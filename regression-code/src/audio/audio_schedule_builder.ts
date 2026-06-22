/**
 * src/audio/audio_schedule_builder.ts
 * AnalysisResult의 note event를 audio backend가 예약 가능한 초 단위 schedule로 변환한다.
 */

import type {
  AnalyzedEvent,
  AnalyzedDynamicsSegment,
  AnalysisResult,
  GlissEvent,
  NoteEffectSegment,
  NoteEvent,
  SourceCellRef,
} from "../core/analyze/types";
import type {
  AudioAutomationEvent,
  AudioBuildInput,
  AudioGlissScheduleEvent,
  AudioNoteScheduleEvent,
  AudioSchedule,
  AudioScheduleEvent,
  AudioScheduleEffect,
  TickTimeMapper,
} from "./audio_types";
import type { TrackId } from "../core/score/types";
import {
  createTickTimeMapper,
  numberToTimeFraction,
  timeFractionToNumber,
} from "./tick_time_mapper";
import {
  filterActiveTrackResults,
  getTrackGain,
} from "../track/track_control";

const DEFAULT_VELOCITY = 1;
const DEFAULT_GLISS_CROSSFADE_SECONDS = 0.02;
const DEFAULT_GLISS_INTERNAL_OVERLAP_SECONDS = 0.05;
const DEFAULT_DYNAMICS_GAIN = 1;

type GlissOverlapInfo = {
  startOverlapSeconds: number;
  endOverlapSeconds: number;
};

type GainScaleSpan = {
  startSeconds: number;
  endSeconds: number;
  gainScale: number;
};

type SweepPoint = {
  seconds: number;
  delta: 1 | -1;
};

/**
 * analyzer 결과에서 audio schedule을 만든다.
 * - 인수 : input : analyzer 결과와 재생 대상 track 목록
 * - 반환값 : AudioSchedule : 초 단위로 정렬된 note schedule
 */
export function buildAudioSchedule(input: AudioBuildInput): AudioSchedule {
  const mapper = createTickTimeMapper(input.analysis.timingTimeline);

  return buildAudioScheduleWithMapper(input.analysis, input.activeTrackIds, mapper);
}

/**
 * 지정된 TickTimeMapper를 사용해 analyzer 결과에서 audio schedule을 만든다.
 * - 인수 : analysis : analyzer 결과
 * - 인수 : activeTrackIds : 재생할 trackId 목록
 * - 인수 : mapper : tick/seconds 변환기
 * - 반환값 : AudioSchedule : 초 단위로 정렬된 note schedule
 */
export function buildAudioScheduleWithMapper(
  analysis: AnalysisResult,
  activeTrackIds: TrackId[],
  mapper: TickTimeMapper,
): AudioSchedule {
  const events: AudioScheduleEvent[] = [];

  for (const trackResult of filterActiveTrackResults(analysis, activeTrackIds)) {
    const noteEvents = trackResult.events.filter(isNoteEvent);
    const glissEvents = trackResult.events.filter(isGlissEvent);
    const noteClipEndTickByEvent = buildGlissStartNoteClipEndTickMap(
      noteEvents,
      glissEvents,
    );
    const glissOverlapInfoByEvent = buildConnectedGlissOverlapInfoMap(glissEvents);

    // 선택된 track의 note와 gliss fallback 발음 이벤트를 audio schedule event로 변환한다.
    for (const event of trackResult.events) {
      if (isNoteEvent(event)) {
        const noteScheduleEvent = createAudioNoteScheduleEvent(
          event,
          mapper,
          noteClipEndTickByEvent.get(event) ?? null,
          analysis.dynamicsTimeline,
        );

        if (noteScheduleEvent !== null) {
          events.push(noteScheduleEvent);
        }
        continue;
      }

      if (isGlissEvent(event)) {
        const glissScheduleEvent = createAudioGlissScheduleEvent(
          event,
          mapper,
          noteEvents,
          glissOverlapInfoByEvent.get(event) ?? null,
          analysis.dynamicsTimeline,
        );

        if (glissScheduleEvent !== null) {
          events.push(glissScheduleEvent);
        }
      }
    }
  }

  return {
    durationSeconds: mapper.getDurationSeconds(),
    events: applyOverlapGainScaleAutomation(events.sort(compareAudioScheduleEvents)),
  };
}

/**
 * 실제로 동시에 울리는 schedule event 수를 기준으로 event별 gain scale automation을 추가한다.
 * - 인수 : events : 초 단위로 변환된 발음 이벤트 목록
 * - 반환값 : gainScale automation이 추가된 발음 이벤트 목록
 */
function applyOverlapGainScaleAutomation(
  events: AudioScheduleEvent[],
): AudioScheduleEvent[] {
  const gainScaleSpans = buildGainScaleSpans(events);

  return events.map((event) => {
    const gainScaleAutomation = buildGainScaleAutomationForEvent(event, gainScaleSpans);

    return {
      ...event,
      automation: [
        ...event.automation,
        ...gainScaleAutomation,
      ],
    };
  });
}

/**
 * sweep-line으로 전체 score 시간의 동시 발음 수 span을 만든다.
 * - 인수 : events : 전체 발음 event 목록
 * - 반환값 : gainScaleSpan[] : 인접 event 경계 사이의 gainScale 목록
 */
function buildGainScaleSpans(
  events: AudioScheduleEvent[],
): GainScaleSpan[] {
  const points: SweepPoint[] = events.flatMap((event) => [
    { seconds: event.startSeconds, delta: 1 as const },
    { seconds: event.endSeconds, delta: -1 as const },
  ])
    .filter((point) => Number.isFinite(point.seconds))
    .sort(compareSweepPoints);
  const spans: GainScaleSpan[] = [];
  let activeCount = 0;
  let index = 0;

  while (index < points.length) {
    const currentSeconds = points[index]?.seconds;

    if (currentSeconds === undefined) {
      break;
    }

    // 같은 시각의 end/start delta를 모두 반영한 activeCount가 다음 span의 동시 발음 수이다.
    let nextIndex = index;
    while (nextIndex < points.length && points[nextIndex]?.seconds === currentSeconds) {
      activeCount += points[nextIndex]?.delta ?? 0;
      nextIndex += 1;
    }

    const nextSeconds = points[nextIndex]?.seconds;

    if (nextSeconds !== undefined && nextSeconds > currentSeconds && activeCount > 0) {
      spans.push({
        startSeconds: currentSeconds,
        endSeconds: nextSeconds,
        gainScale: 1 / activeCount,
      });
    }

    index = nextIndex;
  }

  return mergeAdjacentGainScaleSpans(spans);
}

/**
 * sweep point를 시간순으로 정렬한다. 같은 시간에서는 end를 start보다 먼저 처리한다.
 * - 인수 : left : 왼쪽 sweep point
 * - 인수 : right : 오른쪽 sweep point
 * - 반환값 : 정렬 비교값
 */
function compareSweepPoints(left: SweepPoint, right: SweepPoint): number {
  if (left.seconds !== right.seconds) {
    return left.seconds - right.seconds;
  }

  return left.delta - right.delta;
}

/**
 * 같은 scale이 이어지는 span을 병합한다.
 * - 인수 : spans : sweep-line으로 만든 gainScale span 목록
 * - 반환값 : 인접 동일 scale span을 병합한 목록
 */
function mergeAdjacentGainScaleSpans(spans: GainScaleSpan[]): GainScaleSpan[] {
  const merged: GainScaleSpan[] = [];

  for (const span of spans) {
    const previous = merged[merged.length - 1];

    if (
      previous !== undefined &&
      previous.gainScale === span.gainScale &&
      previous.endSeconds === span.startSeconds
    ) {
      previous.endSeconds = span.endSeconds;
      continue;
    }

    merged.push({ ...span });
  }

  return merged;
}

/**
 * 단일 event와 겹치는 gainScale span을 automation으로 변환한다.
 * - 인수 : event : gain scale을 적용할 event
 * - 인수 : gainScaleSpans : sweep-line으로 만든 전체 gainScale span 목록
 * - 반환값 : gainScale automation 목록
 */
function buildGainScaleAutomationForEvent(
  event: AudioScheduleEvent,
  gainScaleSpans: GainScaleSpan[],
): AudioAutomationEvent[] {
  const automation: AudioAutomationEvent[] = [];

  for (const span of gainScaleSpans) {
    if (span.endSeconds <= event.startSeconds) {
      continue;
    }

    if (span.startSeconds >= event.endSeconds) {
      break;
    }

    const startSeconds = Math.max(event.startSeconds, span.startSeconds);
    const endSeconds = Math.min(event.endSeconds, span.endSeconds);

    if (endSeconds <= startSeconds) {
      continue;
    }

    automation.push({
      kind: "gainScale",
      startSeconds,
      endSeconds,
      startValue: span.gainScale,
      endValue: span.gainScale,
      curve: "instant",
    });
  }

  return mergeAdjacentConstantGainScaleAutomation(automation);
}

/**
 * 같은 값이 연속되는 gainScale automation을 하나로 합쳐 backend 예약량을 줄인다.
 * - 인수 : automation : gainScale automation 목록
 * - 반환값 : 인접 동일 scale 구간을 병합한 목록
 */
function mergeAdjacentConstantGainScaleAutomation(
  automation: AudioAutomationEvent[],
): AudioAutomationEvent[] {
  const merged: AudioAutomationEvent[] = [];

  for (const item of automation) {
    const previous = merged[merged.length - 1];

    if (
      previous?.kind === "gainScale" &&
      item.kind === "gainScale" &&
      previous.endValue === item.startValue &&
      previous.endValue === item.endValue &&
      previous.endSeconds === item.startSeconds
    ) {
      previous.endSeconds = item.endSeconds;
      continue;
    }

    merged.push({ ...item });
  }

  return merged;
}

/**
 * 연결된 gliss 세그먼트의 내부 anchor에서 양쪽 oscillator가 짧게 겹치도록 overlap 정보를 만든다.
 * - 인수 : glissEvents : 같은 track의 gliss event 목록
 * - 반환값 : Map<GlissEvent, GlissOverlapInfo> : 세그먼트별 시작/종료 overlap 설정
 */
function buildConnectedGlissOverlapInfoMap(
  glissEvents: GlissEvent[],
): Map<GlissEvent, GlissOverlapInfo> {
  const overlapInfoByEvent = new Map<GlissEvent, GlissOverlapInfo>();
  const sortedEvents = [...glissEvents].sort((left, right) =>
    timeFractionToNumber(left.startAnchorTick) - timeFractionToNumber(right.startAnchorTick),
  );

  for (const event of sortedEvents) {
    overlapInfoByEvent.set(event, {
      startOverlapSeconds: 0,
      endOverlapSeconds: 0,
    });
  }

  // 같은 gliss id의 인접 세그먼트가 같은 anchor pitch에서 만날 때만 내부 crossfade를 적용한다.
  for (let index = 0; index < sortedEvents.length - 1; index += 1) {
    const currentEvent = sortedEvents[index];
    const nextEvent = sortedEvents[index + 1];

    if (
      currentEvent === undefined ||
      nextEvent === undefined ||
      !areConnectedGlissEvents(currentEvent, nextEvent)
    ) {
      continue;
    }

    const currentInfo = overlapInfoByEvent.get(currentEvent);
    const nextInfo = overlapInfoByEvent.get(nextEvent);

    if (currentInfo !== undefined) {
      currentInfo.endOverlapSeconds = DEFAULT_GLISS_INTERNAL_OVERLAP_SECONDS;
    }

    if (nextInfo !== undefined) {
      nextInfo.startOverlapSeconds = DEFAULT_GLISS_INTERNAL_OVERLAP_SECONDS;
    }
  }

  return overlapInfoByEvent;
}

/**
 * 두 gliss fallback 세그먼트가 같은 내부 anchor를 공유하는지 확인한다.
 * - 인수 : currentEvent : 앞쪽 gliss event
 * - 인수 : nextEvent : 뒤쪽 gliss event
 * - 반환값 : 같은 track/id/time/pitch에서 연결되는지 여부
 */
function areConnectedGlissEvents(
  currentEvent: GlissEvent,
  nextEvent: GlissEvent,
): boolean {
  return currentEvent.trackId === nextEvent.trackId &&
    currentEvent.glissId === nextEvent.glissId &&
    timeFractionToNumber(currentEvent.endAnchorTick) ===
      timeFractionToNumber(nextEvent.startAnchorTick) &&
    currentEvent.endSound.midi === nextEvent.startSound.midi &&
    currentEvent.endSound.centOffset === nextEvent.startSound.centOffset;
}

/**
 * analyzer event가 실제 발음 note event인지 확인한다.
 * - 인수 : event : analyzer event
 * - 반환값 : event is NoteEvent : note event 여부
 */
function isNoteEvent(event: AnalyzedEvent): event is NoteEvent {
  return event.eventKind === "note";
}

/**
 * analyzer event가 gliss fallback 발음 이벤트인지 확인한다.
 * - 인수 : event : analyzer event
 * - 반환값 : event is GlissEvent : gliss event 여부
 */
function isGlissEvent(event: AnalyzedEvent): event is GlissEvent {
  return event.eventKind === "gliss";
}

/**
 * NoteEvent 하나를 AudioNoteScheduleEvent로 변환한다.
 * - 인수 : event : analyzer가 만든 note event
 * - 인수 : mapper : tick/seconds 변환기
 * - 인수 : clipEndTick : gliss fallback 시작점 때문에 audio에서만 줄일 종료 tick
 * - 반환값 : AudioNoteScheduleEvent : backend 예약용 note event 또는 길이가 없으면 null
 */
function createAudioNoteScheduleEvent(
  event: NoteEvent,
  mapper: TickTimeMapper,
  clipEndTick: NoteEvent["time"]["endTick"] | null,
  dynamicsTimeline: AnalyzedDynamicsSegment[],
): AudioNoteScheduleEvent | null {
  const startSeconds = mapper.tickToSeconds(event.time.startTick);
  const effectiveEndTick = getClippedNoteEndTick(event, clipEndTick);
  const endSeconds = mapper.tickToSeconds(effectiveEndTick);

  if (endSeconds <= startSeconds) {
    return null;
  }

  return {
    eventId: event.eventId,
    trackId: event.trackId,
    startTick: event.time.startTick,
    endTick: effectiveEndTick,
    startSeconds,
    endSeconds,
    midi: event.sound.midi,
    centOffset: event.sound.centOffset,
    velocity: DEFAULT_VELOCITY * getTrackGain(event.trackId),
    effects: buildAudioScheduleEffects(event.effects, mapper),
    automation: buildDynamicsGainAutomation(
      dynamicsTimeline,
      event.time.startTick,
      effectiveEndTick,
      mapper,
    ),
    sourceEventKind: "note" as const,
  };
}

/**
 * gliss fallback 시작 anchor와 겹치는 note event의 audio 종료 tick을 찾는다.
 * - 인수 : noteEvents : 같은 track의 note event 목록
 * - 인수 : glissEvents : 같은 track의 gliss event 목록
 * - 반환값 : Map<NoteEvent, TimeFraction> : audio note 종료를 앞당길 tick lookup
 */
function buildGlissStartNoteClipEndTickMap(
  noteEvents: NoteEvent[],
  glissEvents: GlissEvent[],
): Map<NoteEvent, NoteEvent["time"]["endTick"]> {
  const clipEndTickByEvent = new Map<NoteEvent, NoteEvent["time"]["endTick"]>();

  // gliss fallback이 시작되는 anchor note는 gliss 시작 시점에서 발음을 끊어 겹침을 줄인다.
  for (const glissEvent of glissEvents) {
    const noteEvent = findStartAnchorNoteEvent(glissEvent, noteEvents);

    if (noteEvent === null) {
      continue;
    }

    const currentClipEndTick = clipEndTickByEvent.get(noteEvent);
    const nextClipEndTick = glissEvent.startAnchorTick;

    if (
      currentClipEndTick === undefined ||
      timeFractionToNumber(nextClipEndTick) < timeFractionToNumber(currentClipEndTick)
    ) {
      clipEndTickByEvent.set(noteEvent, cloneTimeFraction(nextClipEndTick));
    }
  }

  return clipEndTickByEvent;
}

/**
 * gliss 시작 anchor가 속한 note event를 찾는다.
 * - 인수 : glissEvent : analyzer가 만든 gliss event
 * - 인수 : noteEvents : 같은 track의 note event 목록
 * - 반환값 : 시작 anchor가 붙은 note event 또는 없으면 null
 */
function findStartAnchorNoteEvent(
  glissEvent: GlissEvent,
  noteEvents: NoteEvent[],
): NoteEvent | null {
  const startSource = glissEvent.sourceCells[0];

  if (startSource === undefined) {
    return null;
  }

  return noteEvents.find((noteEvent) =>
    noteEvent.glissAnchors.some((anchor) =>
      anchor.glissId === glissEvent.glissId &&
      anchor.role === glissEvent.fromKind &&
      sourceCellsMatch(anchor.source, startSource)
    )
  ) ?? null;
}

/**
 * note event의 audio 종료 tick을 gliss 시작점 기준으로 제한한다.
 * - 인수 : event : analyzer가 만든 note event
 * - 인수 : clipEndTick : 후보 종료 tick
 * - 반환값 : 실제 audio note 종료 tick
 */
function getClippedNoteEndTick(
  event: NoteEvent,
  clipEndTick: NoteEvent["time"]["endTick"] | null,
): NoteEvent["time"]["endTick"] {
  if (clipEndTick === null) {
    return event.time.endTick;
  }

  const startTick = timeFractionToNumber(event.time.startTick);
  const endTick = timeFractionToNumber(event.time.endTick);
  const clippedEndTick = timeFractionToNumber(clipEndTick);

  if (clippedEndTick <= startTick || clippedEndTick >= endTick) {
    return event.time.endTick;
  }

  return cloneTimeFraction(clipEndTick);
}

/**
 * GlissEvent 하나를 AudioGlissScheduleEvent로 변환한다.
 * - 인수 : event : analyzer가 만든 gliss event
 * - 인수 : mapper : tick/seconds 변환기
 * - 인수 : noteEvents : gliss 시작 anchor의 tremolo 정보를 찾기 위한 같은 track note event 목록
 * - 반환값 : backend 예약용 gliss fallback event 또는 길이가 없으면 null
 */
function createAudioGlissScheduleEvent(
  event: GlissEvent,
  mapper: TickTimeMapper,
  noteEvents: NoteEvent[],
  overlapInfo: GlissOverlapInfo | null,
  dynamicsTimeline: AnalyzedDynamicsSegment[],
): AudioGlissScheduleEvent | null {
  const startSeconds = mapper.tickToSeconds(event.startAnchorTick);
  const endSeconds = mapper.tickToSeconds(event.endAnchorTick);

  if (endSeconds <= startSeconds) {
    return null;
  }

  return {
    eventId: event.eventId,
    trackId: event.trackId,
    startTick: event.startAnchorTick,
    endTick: event.endAnchorTick,
    startSeconds,
    endSeconds,
    velocity: DEFAULT_VELOCITY * getTrackGain(event.trackId),
    sourceEventKind: "gliss",
    startMidi: event.startSound.midi,
    startCentOffset: event.startSound.centOffset,
    endMidi: event.endSound.midi,
    endCentOffset: event.endSound.centOffset,
    curve: "linear",
    crossfadeSeconds: DEFAULT_GLISS_CROSSFADE_SECONDS,
    startOverlapSeconds: overlapInfo?.startOverlapSeconds ?? 0,
    endOverlapSeconds: overlapInfo?.endOverlapSeconds ?? 0,
    effects: buildGlissTremoloEffects(event, mapper, noteEvents),
    automation: buildDynamicsGainAutomation(
      dynamicsTimeline,
      event.startAnchorTick,
      event.endAnchorTick,
      mapper,
    ),
  };
}

/**
 * dynamics timeline을 발음 event 내부 gain automation으로 변환한다.
 * - 인수 : dynamicsTimeline : analyzer가 만든 dynamics segment 목록
 * - 인수 : eventStartTick : 발음 event 시작 tick
 * - 인수 : eventEndTick : 발음 event 끝 tick
 * - 인수 : mapper : tick/seconds 변환기
 * - 반환값 : AudioAutomationEvent[] : event 구간과 겹치는 gain ramp 목록
 */
function buildDynamicsGainAutomation(
  dynamicsTimeline: AnalyzedDynamicsSegment[],
  eventStartTick: NoteEvent["time"]["startTick"],
  eventEndTick: NoteEvent["time"]["endTick"],
  mapper: TickTimeMapper,
): AudioScheduleEvent["automation"] {
  const eventStart = timeFractionToNumber(eventStartTick);
  const eventEnd = timeFractionToNumber(eventEndTick);
  const automation: AudioScheduleEvent["automation"] = [];

  if (eventEnd <= eventStart) {
    return automation;
  }

  for (const segment of dynamicsTimeline) {
    const segmentStart = timeFractionToNumber(segment.time.startTick);
    const segmentEnd = timeFractionToNumber(segment.time.endTick);
    const overlapStart = Math.max(eventStart, segmentStart);
    const overlapEnd = Math.min(eventEnd, segmentEnd);

    if (overlapEnd <= overlapStart) {
      continue;
    }

    const startValue = interpolateDynamicsValue(segment, overlapStart);
    const endValue = interpolateDynamicsValue(segment, overlapEnd);

    automation.push({
      kind: "gainRamp",
      startSeconds: mapper.tickToSeconds(numberToTimeFraction(overlapStart)),
      endSeconds: mapper.tickToSeconds(numberToTimeFraction(overlapEnd)),
      startValue: dynamicsValueToGain(startValue),
      endValue: dynamicsValueToGain(endValue),
      curve: Math.abs(startValue - endValue) < 1e-9 ? "instant" : segment.curve,
    });
  }

  return automation;
}

/**
 * dynamics segment 안의 특정 tick에서 dynamics 값을 선형 보간한다.
 * - 인수 : segment : dynamics analyzer segment
 * - 인수 : tick : 값을 구할 tick number
 * - 반환값 : number : 0~150 범위의 dynamics 값
 */
function interpolateDynamicsValue(
  segment: AnalyzedDynamicsSegment,
  tick: number,
): number {
  const segmentStart = timeFractionToNumber(segment.time.startTick);
  const segmentEnd = timeFractionToNumber(segment.time.endTick);

  if (
    segment.curve === "instant" ||
    segmentEnd <= segmentStart ||
    Math.abs(segment.endValue - segment.startValue) < 1e-9
  ) {
    return segment.startValue;
  }

  const ratio = (tick - segmentStart) / (segmentEnd - segmentStart);

  return segment.startValue + (segment.endValue - segment.startValue) * ratio;
}

/**
 * dynamics raw value를 audio gain 배율로 변환한다.
 * - 인수 : value : dynamics row 값. 현재 parser 기준 0~150 정수이다.
 * - 반환값 : number : 100을 기본 음량 1로 보는 gain 배율
 */
function dynamicsValueToGain(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_DYNAMICS_GAIN;
  }

  return Math.min(Math.max(value, 0), 150) / 100;
}

/**
 * gliss 시작 anchor에 걸린 tremolo를 gliss fallback 전체 구간의 audio effect로 변환한다.
 * - 인수 : event : analyzer가 만든 gliss event
 * - 인수 : mapper : tick/seconds 변환기
 * - 인수 : noteEvents : 같은 track의 note event 목록
 * - 반환값 : AudioScheduleEffect[] : gliss fallback에 적용할 tremolo effect 목록
 */
function buildGlissTremoloEffects(
  event: GlissEvent,
  mapper: TickTimeMapper,
  noteEvents: NoteEvent[],
): AudioScheduleEffect[] {
  const tremDivision = findStartAnchorTremoloDivision(event, noteEvents);

  if (tremDivision === null) {
    return [];
  }

  return [
    {
      kind: "tremolo",
      startSeconds: mapper.tickToSeconds(event.startAnchorTick),
      endSeconds: mapper.tickToSeconds(event.endAnchorTick),
      durationTicks:
        timeFractionToNumber(event.endAnchorTick) -
        timeFractionToNumber(event.startAnchorTick),
      division: tremDivision,
    },
  ];
}

/**
 * gliss 시작 anchor가 속한 note effect에서 tremolo division을 찾는다.
 * - 인수 : glissEvent : analyzer가 만든 gliss event
 * - 인수 : noteEvents : 같은 track의 note event 목록
 * - 반환값 : tremolo division 또는 없으면 null
 */
function findStartAnchorTremoloDivision(
  glissEvent: GlissEvent,
  noteEvents: NoteEvent[],
): number | null {
  const startSource = glissEvent.sourceCells[0];

  if (startSource === undefined) {
    return null;
  }

  for (const noteEvent of noteEvents) {
    const startAnchor = noteEvent.glissAnchors.find((anchor) =>
      anchor.glissId === glissEvent.glissId &&
      anchor.role === glissEvent.fromKind &&
      sourceCellsMatch(anchor.source, startSource)
    );

    if (startAnchor === undefined) {
      continue;
    }

    const anchorStartTick = timeFractionToNumber(startAnchor.time.startTick);
    const anchorEndTick = timeFractionToNumber(startAnchor.time.endTick);
    const tremEffect = noteEvent.effects.find((effect) =>
      effect.trem !== null &&
      effect.trem !== undefined &&
      rangesOverlap(
        anchorStartTick,
        anchorEndTick,
        timeFractionToNumber(effect.time.startTick),
        timeFractionToNumber(effect.time.endTick),
      )
    );

    if (tremEffect?.trem !== null && tremEffect?.trem !== undefined) {
      return tremEffect.trem.division;
    }
  }

  return null;
}

/**
 * NoteEffectSegment 목록을 초 단위 audio effect 목록으로 변환한다.
 * - 인수 : segments : analyzer note effect segment 목록
 * - 인수 : mapper : tick/seconds 변환기
 * - 반환값 : AudioScheduleEffect[] : backend가 해석할 effect 목록
 */
function buildAudioScheduleEffects(
  segments: NoteEffectSegment[],
  mapper: TickTimeMapper,
): AudioScheduleEffect[] {
  return segments.flatMap((segment) => {
    const startSeconds = mapper.tickToSeconds(segment.time.startTick);
    const endSeconds = mapper.tickToSeconds(segment.time.endTick);
    const effects: AudioScheduleEffect[] = [];

    // vibrato와 tremolo는 첫 schedule 단계에서는 DTO에 보존하고 backend에서 후속 해석한다.
    if (segment.vib) {
      effects.push({
        kind: "vibrato",
        startSeconds,
        endSeconds,
      });
    }

    if (segment.trem !== null && segment.trem !== undefined) {
      effects.push({
        kind: "tremolo",
        startSeconds,
        endSeconds,
        durationTicks:
          timeFractionToNumber(segment.time.endTick) -
          timeFractionToNumber(segment.time.startTick),
        division: segment.trem.division,
      });
    }

    return effects;
  });
}

/**
 * 두 source cell 참조가 같은 일반 cell 또는 같은 tuplet slot을 가리키는지 확인한다.
 * - 인수 : left : 왼쪽 source cell 참조
 * - 인수 : right : 오른쪽 source cell 참조
 * - 반환값 : row/col/slotIndex가 모두 같은지 여부
 */
function sourceCellsMatch(left: SourceCellRef, right: SourceCellRef): boolean {
  return left.rowId === right.rowId &&
    left.col === right.col &&
    (left.slotIndex ?? null) === (right.slotIndex ?? null);
}

/**
 * 두 배타적 tick 범위가 겹치는지 확인한다.
 * - 인수 : leftStart : 첫 범위 시작 tick
 * - 인수 : leftEnd : 첫 범위 배타적 끝 tick
 * - 인수 : rightStart : 둘째 범위 시작 tick
 * - 인수 : rightEnd : 둘째 범위 배타적 끝 tick
 * - 반환값 : 두 범위에 공통 구간이 있는지 여부
 */
function rangesOverlap(
  leftStart: number,
  leftEnd: number,
  rightStart: number,
  rightEnd: number,
): boolean {
  return leftStart < rightEnd && rightStart < leftEnd;
}

/**
 * TimeFraction을 얕은 공유 없이 복사한다.
 * - 인수 : value : 복사할 시간 분수
 * - 반환값 : 복제된 시간 분수
 */
function cloneTimeFraction(value: NoteEvent["time"]["endTick"]): NoteEvent["time"]["endTick"] {
  return {
    numerator: value.numerator,
    denominator: value.denominator,
  };
}

/**
 * audio schedule event를 backend 예약 순서로 정렬한다.
 * - 인수 : left : 왼쪽 event
 * - 인수 : right : 오른쪽 event
 * - 반환값 : 정렬 비교값
 */
function compareAudioScheduleEvents(
  left: { startSeconds: number; endSeconds: number; trackId: string; eventId: string },
  right: { startSeconds: number; endSeconds: number; trackId: string; eventId: string },
): number {
  if (left.startSeconds !== right.startSeconds) {
    return left.startSeconds - right.startSeconds;
  }

  if (left.endSeconds !== right.endSeconds) {
    return left.endSeconds - right.endSeconds;
  }

  if (left.trackId !== right.trackId) {
    return left.trackId.localeCompare(right.trackId);
  }

  return left.eventId.localeCompare(right.eventId);
}
