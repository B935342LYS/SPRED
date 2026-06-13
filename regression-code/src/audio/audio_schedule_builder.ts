/**
 * src/audio/audio_schedule_builder.ts
 * AnalysisResult의 note event를 audio backend가 예약 가능한 초 단위 schedule로 변환한다.
 */

import type {
  AnalyzedEvent,
  AnalysisResult,
  GlissEvent,
  NoteEffectSegment,
  NoteEvent,
} from "../core/analyze/types";
import type {
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
  timeFractionToNumber,
} from "./tick_time_mapper";

const DEFAULT_VELOCITY = 1;
const DEFAULT_GLISS_CROSSFADE_SECONDS = 0.02;

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
  const activeTrackIdSet = new Set(activeTrackIds);
  const events: AudioScheduleEvent[] = [];

  for (const trackResult of analysis.trackResults) {
    if (!activeTrackIdSet.has(trackResult.trackId)) {
      continue;
    }

    // 선택된 track의 note와 gliss fallback 발음 이벤트를 audio schedule event로 변환한다.
    for (const event of trackResult.events) {
      if (isNoteEvent(event)) {
        events.push(createAudioNoteScheduleEvent(event, mapper));
        continue;
      }

      if (isGlissEvent(event)) {
        const glissScheduleEvent = createAudioGlissScheduleEvent(event, mapper);

        if (glissScheduleEvent !== null) {
          events.push(glissScheduleEvent);
        }
      }
    }
  }

  return {
    durationSeconds: mapper.getDurationSeconds(),
    events: events.sort(compareAudioScheduleEvents),
  };
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
 * - 반환값 : AudioNoteScheduleEvent : backend 예약용 note event
 */
function createAudioNoteScheduleEvent(
  event: NoteEvent,
  mapper: TickTimeMapper,
): AudioNoteScheduleEvent {
  const startSeconds = mapper.tickToSeconds(event.time.startTick);
  const endSeconds = mapper.tickToSeconds(event.time.endTick);

  return {
    eventId: event.eventId,
    trackId: event.trackId,
    startTick: event.time.startTick,
    endTick: event.time.endTick,
    startSeconds,
    endSeconds,
    midi: event.sound.midi,
    centOffset: event.sound.centOffset,
    velocity: DEFAULT_VELOCITY,
    effects: buildAudioScheduleEffects(event.effects, mapper),
    automation: [],
    sourceEventKind: "note" as const,
  };
}

/**
 * GlissEvent 하나를 AudioGlissScheduleEvent로 변환한다.
 * - 인수 : event : analyzer가 만든 gliss event
 * - 인수 : mapper : tick/seconds 변환기
 * - 반환값 : backend 예약용 gliss fallback event 또는 길이가 없으면 null
 */
function createAudioGlissScheduleEvent(
  event: GlissEvent,
  mapper: TickTimeMapper,
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
    velocity: DEFAULT_VELOCITY,
    sourceEventKind: "gliss",
    startMidi: event.startSound.midi,
    startCentOffset: event.startSound.centOffset,
    endMidi: event.endSound.midi,
    endCentOffset: event.endSound.centOffset,
    curve: "linear",
    crossfadeSeconds: DEFAULT_GLISS_CROSSFADE_SECONDS,
  };
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
