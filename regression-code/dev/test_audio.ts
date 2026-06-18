import { readFileSync } from "node:fs";

import { analyzeDocument } from "../src/core/analyze/analyze_full";
import type {
  AnalysisResult,
  AnalyzedDynamicsSegment,
  AnalyzedTimeSegment,
  GlissEvent,
  NoteEvent,
} from "../src/core/analyze/types";
import { buildParsedDocument } from "../src/core/parse/build_parsed_document";
import { loadRuntimeDocument } from "../src/core/score/create_runtime_document";
import { createAudioEventQueue } from "../src/audio/audio_event_queue";
import { buildAudioSchedule } from "../src/audio/audio_schedule_builder";
import { createAudioLookaheadScheduler } from "../src/audio/audio_scheduler";
import { createPlaybackController } from "../src/audio/playback_controller";
import type {
  AudioBackend,
  AudioScheduleEvent,
} from "../src/audio/audio_types";
import { midiToFrequency } from "../src/audio/oscillator_backend";
import {
  createTickTimeMapper,
  numberToTimeFraction,
  timeFractionToNumber,
} from "../src/audio/tick_time_mapper";

/**
 * 테스트 조건이 거짓이면 프로세스를 실패 상태로 만든다.
 * - 인수 : condition : 통과 여부
 * - 인수 : message : 실패 시 출력할 설명
 * - 반환값 : 없음
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * 두 숫자가 허용 오차 안에서 같은지 확인한다.
 * - 인수 : actual : 실제 값
 * - 인수 : expected : 기대 값
 * - 인수 : message : 실패 시 출력할 설명
 * - 반환값 : 없음
 */
function assertNear(actual: number, expected: number, message: string): void {
  if (Math.abs(actual - expected) > 1e-9) {
    throw new Error(`${message} actual=${actual} expected=${expected}`);
  }
}

/**
 * constant BPM timing segment를 만든다.
 * - 인수 : startTick : segment 시작 tick
 * - 인수 : endTick : segment 끝 tick
 * - 인수 : bpm : segment BPM
 * - 인수 : stepsPerBeat : 1 beat당 step 수
 * - 반환값 : AnalyzedTimeSegment : 테스트용 timing segment
 */
function createConstantSegment(
  startTick: number,
  endTick: number,
  bpm: number,
  stepsPerBeat: number,
): AnalyzedTimeSegment {
  return {
    time: {
      startTick: numberToTimeFraction(startTick),
      endTick: numberToTimeFraction(endTick),
    },
    startBpm: bpm,
    endBpm: bpm,
    bpmCurve: "instant",
    beatsPerBar: 4,
    stepsPerBeat,
    sourceCells: [],
  };
}

/**
 * linear BPM timing segment를 만든다.
 * - 인수 : startTick : segment 시작 tick
 * - 인수 : endTick : segment 끝 tick
 * - 인수 : startBpm : 시작 BPM
 * - 인수 : endBpm : 종료 BPM
 * - 인수 : stepsPerBeat : 1 beat당 step 수
 * - 반환값 : AnalyzedTimeSegment : 테스트용 timing segment
 */
function createLinearSegment(
  startTick: number,
  endTick: number,
  startBpm: number,
  endBpm: number,
  stepsPerBeat: number,
): AnalyzedTimeSegment {
  return {
    time: {
      startTick: numberToTimeFraction(startTick),
      endTick: numberToTimeFraction(endTick),
    },
    startBpm,
    endBpm,
    bpmCurve: "linear",
    beatsPerBar: 4,
    stepsPerBeat,
    sourceCells: [],
  };
}

/**
 * dynamics timeline segment를 만든다.
 * - 인수 : startTick : segment 시작 tick
 * - 인수 : endTick : segment 끝 tick
 * - 인수 : startValue : 시작 dynamics 값
 * - 인수 : endValue : 종료 dynamics 값
 * - 인수 : curve : 값 변화 방식
 * - 반환값 : AnalyzedDynamicsSegment : 테스트용 dynamics segment
 */
function createDynamicsSegment(
  startTick: number,
  endTick: number,
  startValue: number,
  endValue: number,
  curve: "instant" | "linear",
): AnalyzedDynamicsSegment {
  return {
    time: {
      startTick: numberToTimeFraction(startTick),
      endTick: numberToTimeFraction(endTick),
    },
    startValue,
    endValue,
    curve,
    sourceCells: [],
  };
}

const singleMapper = createTickTimeMapper([
  createConstantSegment(0, 16, 120, 4),
]);

assertNear(singleMapper.tickToSeconds(numberToTimeFraction(0)), 0, "tick 0 should be 0s.");
assertNear(singleMapper.tickToSeconds(numberToTimeFraction(1)), 0.125, "BPM 120 SPB 4 should make 1 tick 0.125s.");
assertNear(singleMapper.tickToSeconds(numberToTimeFraction(16)), 2, "16 ticks should be 2s.");
assertNear(singleMapper.getDurationSeconds(), 2, "single segment duration mismatch.");
assertNear(timeFractionToNumber(singleMapper.secondsToTick(0.125)), 1, "0.125s should map to tick 1.");
assertNear(timeFractionToNumber(singleMapper.secondsToTick(2)), 16, "duration end should map to end tick.");

const multiMapper = createTickTimeMapper([
  createConstantSegment(0, 8, 120, 4),
  createConstantSegment(8, 16, 60, 4),
]);

assertNear(multiMapper.tickToSeconds(numberToTimeFraction(8)), 1, "second segment should start at 1s.");
assertNear(multiMapper.tickToSeconds(numberToTimeFraction(9)), 1.25, "BPM 60 SPB 4 should make 1 tick 0.25s.");
assertNear(multiMapper.tickToSeconds(numberToTimeFraction(16)), 3, "multi segment duration mismatch.");
assertNear(multiMapper.getDurationSeconds(), 3, "multi segment total duration mismatch.");
assertNear(timeFractionToNumber(multiMapper.secondsToTick(1)), 8, "1s should map to second segment start tick.");
assertNear(timeFractionToNumber(multiMapper.secondsToTick(1.25)), 9, "1.25s should map to tick 9.");
assertNear(timeFractionToNumber(multiMapper.secondsToTick(3)), 16, "multi duration end should map to end tick.");

const linearMapper = createTickTimeMapper([
  createLinearSegment(0, 8, 120, 240, 4),
]);

assertNear(
  linearMapper.tickToSeconds(numberToTimeFraction(4)),
  Math.log(1.5),
  "Linear BPM 120..240 should integrate to ln(1.5) seconds at tick 4.",
);
assertNear(
  linearMapper.tickToSeconds(numberToTimeFraction(8)),
  Math.log(2),
  "Linear BPM 120..240 should integrate to ln(2) seconds at tick 8.",
);
assertNear(
  timeFractionToNumber(linearMapper.secondsToTick(Math.log(1.5))),
  4,
  "Linear BPM inverse mapping should recover tick 4.",
);

const fractionalTick = numberToTimeFraction(8.5);

assert(fractionalTick.numerator === 17 && fractionalTick.denominator === 2, "8.5 should reduce to 17/2.");
assertNear(multiMapper.tickToSeconds(fractionalTick), 1.125, "fractional tick should map inside second segment.");
assertNear(midiToFrequency(69, 0), 440, "A4 should be 440Hz.");
assertNear(midiToFrequency(69, 100), midiToFrequency(70, 0), "+100 cents should match the next semitone.");
assertNear(midiToFrequency(69, -100), midiToFrequency(68, 0), "-100 cents should match the previous semitone.");

const effectNoteEvent: NoteEvent = {
  eventKind: "note",
  eventId: "basic:note:s1-note-60:0",
  trackId: "basic",
  time: {
    startTick: numberToTimeFraction(0),
    endTick: numberToTimeFraction(3),
  },
  sourceCells: [{ rowId: "s1-note-60", col: 0 }],
  text: "C4",
  displayTextAnchors: [],
  display: {
    rowId: "s1-note-60",
    centOffset: 0,
  },
  sound: {
    midi: 60,
    centOffset: 0,
  },
  effects: [
    {
      time: {
        startTick: numberToTimeFraction(0),
        endTick: numberToTimeFraction(1),
      },
      vib: false,
      trem: { division: 3 },
    },
    {
      time: {
        startTick: numberToTimeFraction(1),
        endTick: numberToTimeFraction(3),
      },
      vib: true,
      trem: null,
    },
  ],
  glissRole: null,
  glissAnchors: [
    {
      glissId: "a",
      role: "start",
      source: { rowId: "s1-note-60", col: 0 },
      time: {
        startTick: numberToTimeFraction(0),
        endTick: numberToTimeFraction(1),
      },
      display: {
        rowId: "s1-note-60",
        centOffset: 0,
      },
    },
  ],
  tuplet: null,
};
const effectGlissEvent: GlissEvent = {
  eventKind: "gliss",
  eventId: "basic:gliss:a:s1-note-60:0:s1-note-64:3",
  trackId: "basic",
  time: {
    startTick: numberToTimeFraction(0),
    endTick: numberToTimeFraction(3),
  },
  sourceCells: [
    { rowId: "s1-note-60", col: 0 },
    { rowId: "s1-note-64", col: 3 },
  ],
  startDisplay: {
    rowId: "s1-note-60",
    centOffset: 0,
  },
  endDisplay: {
    rowId: "s1-note-64",
    centOffset: 0,
  },
  startSound: {
    midi: 60,
    centOffset: 0,
  },
  endSound: {
    midi: 64,
    centOffset: 0,
  },
  glissId: "a",
  startAnchorTick: numberToTimeFraction(0.5),
  endAnchorTick: numberToTimeFraction(3),
  fromKind: "start",
  toKind: "end",
  startAttach: "attack",
  endAttach: "release",
};
const effectAnalysis: AnalysisResult = {
  timingTimeline: [
    {
      time: {
        startTick: numberToTimeFraction(0),
        endTick: numberToTimeFraction(4),
      },
      startBpm: 120,
      endBpm: 120,
      bpmCurve: "instant",
      beatsPerBar: 4,
      stepsPerBeat: 4,
      sourceCells: [],
    },
  ],
  dynamicsTimeline: [
    createDynamicsSegment(0, 2, 50, 150, "linear"),
    createDynamicsSegment(2, 4, 80, 80, "instant"),
  ],
  trackResults: [
    {
      trackId: "basic",
      events: [effectNoteEvent, effectGlissEvent],
    },
  ],
  analysisIssues: [],
};
const effectSchedule = buildAudioSchedule({
  analysis: effectAnalysis,
  activeTrackIds: ["basic"],
});
const effectScheduleEvent = effectSchedule.events[0];

assert(effectScheduleEvent !== undefined, "Effect schedule should include the synthetic note.");
assert(
  effectScheduleEvent?.sourceEventKind === "note",
  "First effect schedule event should be a note.",
);

if (effectScheduleEvent?.sourceEventKind === "note") {
  const tremolo = effectScheduleEvent.effects.find((effect) => effect.kind === "tremolo");
  const vibrato = effectScheduleEvent.effects.find((effect) => effect.kind === "vibrato");
  const dynamicsAutomation = effectScheduleEvent.automation.find(
    (automation) => automation.kind === "gainRamp",
  );

  assertNear(
    effectScheduleEvent.endSeconds,
    0.0625,
    "Gliss start anchor note should be clipped at the gliss start tick.",
  );
  assert(tremolo !== undefined, "Schedule should preserve tremolo effect.");
  assert(vibrato !== undefined, "Schedule should preserve vibrato effect.");
  assert(dynamicsAutomation !== undefined, "Schedule should include note dynamics automation.");

  if (tremolo !== undefined) {
    assert(tremolo.division === 3, "Tremolo schedule should keep division.");
    assertNear(tremolo.durationTicks, 1, "Tremolo schedule should keep source duration in ticks.");
    assertNear(tremolo.startSeconds, 0, "Tremolo should start at note start.");
    assertNear(tremolo.endSeconds, 0.125, "One tick at BPM 120/SPB 4 should last 0.125s.");
  }

  if (vibrato !== undefined) {
    assertNear(vibrato.startSeconds, 0.125, "Vibrato should start on the second tick.");
    assertNear(vibrato.endSeconds, 0.375, "Vibrato should end with the note.");
  }

  if (dynamicsAutomation !== undefined && dynamicsAutomation.kind === "gainRamp") {
    assertNear(dynamicsAutomation.startSeconds, 0, "Note dynamics should start with the note.");
    assertNear(dynamicsAutomation.endSeconds, 0.0625, "Note dynamics should end at clipped note end.");
    assertNear(dynamicsAutomation.startValue, 0.5, "Dynamics 50 should map to gain 0.5.");
    assertNear(dynamicsAutomation.endValue, 0.75, "Dynamics should interpolate to gain 0.75 at tick 0.5.");
  }
}

const glissScheduleEvent = effectSchedule.events.find(
  (event) => event.sourceEventKind === "gliss",
);

assert(glissScheduleEvent !== undefined, "Schedule should include the synthetic gliss fallback.");

if (glissScheduleEvent?.sourceEventKind === "gliss") {
  const tremolo = glissScheduleEvent.effects.find((effect) => effect.kind === "tremolo");
  const dynamicsAutomation = glissScheduleEvent.automation.filter(
    (automation) => automation.kind === "gainRamp",
  );

  assertNear(glissScheduleEvent.startSeconds, 0.0625, "Gliss should start at its start anchor.");
  assertNear(glissScheduleEvent.endSeconds, 0.375, "Gliss should end at its end anchor.");
  assert(glissScheduleEvent.startMidi === 60, "Gliss should keep start MIDI.");
  assert(glissScheduleEvent.endMidi === 64, "Gliss should keep end MIDI.");
  assertNear(glissScheduleEvent.crossfadeSeconds, 0.02, "Gliss should use default crossfade.");
  assert(tremolo !== undefined, "Gliss should inherit tremolo from its start anchor.");
  assert(dynamicsAutomation.length === 2, "Gliss should split dynamics automation by timeline segments.");

  if (tremolo !== undefined) {
    assert(tremolo.division === 3, "Gliss tremolo should keep start anchor division.");
    assertNear(tremolo.startSeconds, 0.0625, "Gliss tremolo should start with the gliss.");
    assertNear(tremolo.endSeconds, 0.375, "Gliss tremolo should end with the gliss.");
    assertNear(tremolo.durationTicks, 2.5, "Gliss tremolo duration should follow gliss ticks.");
  }

  if (dynamicsAutomation[0]?.kind === "gainRamp") {
    assertNear(dynamicsAutomation[0].startSeconds, 0.0625, "Gliss first dynamics ramp should start at the gliss start.");
    assertNear(dynamicsAutomation[0].endSeconds, 0.25, "Gliss first dynamics ramp should end at dynamics boundary.");
    assertNear(dynamicsAutomation[0].startValue, 0.75, "Gliss dynamics should interpolate start gain.");
    assertNear(dynamicsAutomation[0].endValue, 1.5, "Dynamics 150 should map to gain 1.5.");
  }

  if (dynamicsAutomation[1]?.kind === "gainRamp") {
    assertNear(dynamicsAutomation[1].startSeconds, 0.25, "Gliss second dynamics segment should start at tick 2.");
    assertNear(dynamicsAutomation[1].endSeconds, 0.375, "Gliss second dynamics segment should end at gliss end.");
    assertNear(dynamicsAutomation[1].startValue, 0.8, "Dynamics 80 should map to gain 0.8.");
    assertNear(dynamicsAutomation[1].endValue, 0.8, "Instant dynamics should keep the same gain.");
  }
}

const fixtureUrl = new URL("./test_cases/minimal-valid-score.json", import.meta.url);
const jsonText = readFileSync(fixtureUrl, "utf8");
const loadResult = loadRuntimeDocument(jsonText);

assert(loadResult.ok, "Audio schedule fixture should load.");

if (loadResult.ok) {
  const parsed = buildParsedDocument(loadResult.document);
  const analysis = analyzeDocument({
    score: loadResult.document.score,
    indexes: loadResult.document.indexes,
    parsed,
  });
  const schedule = buildAudioSchedule({
    analysis,
    activeTrackIds: ["basic"],
  });
  const queue = createAudioEventQueue(schedule);
  const firstEvent = schedule.events[0];

  assert(schedule.events.length === 6, "Audio schedule should include 6 basic note events.");
  assertNear(schedule.durationSeconds, 125, "Fixture schedule duration should follow timing timeline.");
  assert(firstEvent !== undefined, "Audio schedule should have a first event.");
  assert(firstEvent?.sourceEventKind === "note", "First fixture event should be a note.");

  if (firstEvent?.sourceEventKind === "note") {
    assert(firstEvent.eventId.length > 0, "Audio event should keep analyzer eventId.");
    assert(firstEvent.trackId === "basic", "Audio event should keep trackId.");
    assertNear(firstEvent.startSeconds, 0, "First note should start at 0s.");
    assertNear(firstEvent.endSeconds, 0.5, "First merged 4-tick note should last 0.5s.");
    assert(firstEvent.midi === 52, "First event should keep final sound MIDI.");
  }

  assert(queue.getEventCount() === schedule.events.length, "Queue should keep all schedule events.");
  assert(queue.getEventsStartingInRange(0.125, 0.25).length === 0, "Starting lookup should not repeat an already-started long note.");
  assert(queue.getEventsOverlappingRange(0.125, 0.25).length === 1, "Overlap lookup should include an already-started long note.");
  assert(queue.getEventsStartingInRange(0.5, 0.75).length >= 1, "Starting lookup should include events after first note end.");

  const scheduledEvents: Array<{ event: AudioScheduleEvent; offsetSeconds: number }> = [];
  const backend: AudioBackend = {
    ensureStarted: () => Promise.resolve(),
    scheduleEvent: (event, offsetSeconds) => {
      scheduledEvents.push({ event, offsetSeconds });
    },
    getCurrentTime: () => 0,
    stopAll: () => {
      scheduledEvents.length = 0;
    },
    dispose: () => {
      scheduledEvents.length = 0;
    },
  };
  const scheduler = createAudioLookaheadScheduler({
    queue,
    backend,
    lookaheadSeconds: 0.2,
  });

  assert(
    scheduler.scheduleLookahead(0, { enabled: false }) === 1,
    "Scheduler should schedule the first event at playback start.",
  );
  assertNear(scheduledEvents[0]?.offsetSeconds ?? -1, 0, "First scheduled event should start immediately.");
  assert(
    scheduler.scheduleLookahead(0.05, { enabled: false }) === 0,
    "Scheduler should not repeat an already-started event.",
  );
  assert(
    scheduler.scheduleLookahead(0.49, { enabled: false }) >= 1,
    "Scheduler should schedule the next event when it enters lookahead.",
  );

  scheduler.resetScheduledEvents();
  scheduledEvents.length = 0;

  assert(
    scheduler.scheduleLookahead(
      0.55,
      {
        enabled: true,
        startSeconds: 0,
        endSeconds: 0.6,
      },
      0,
    ) === 1,
    "Loop wrap lookahead should schedule the first event of the next cycle.",
  );
  assertNear(scheduledEvents[0]?.offsetSeconds ?? -1, 0.05, "Wrapped event should be scheduled after loop end.");
  assert(
    scheduler.scheduleLookahead(
      0,
      {
        enabled: true,
        startSeconds: 0,
        endSeconds: 0.6,
      },
      1,
    ) === 0,
    "Loop cycle should not duplicate an event already scheduled from wrapped lookahead.",
  );

  let fakeAudioTime = 0;
  const controllerScheduledEvents: Array<{ event: AudioScheduleEvent; offsetSeconds: number }> = [];
  const controllerBackend: AudioBackend = {
    ensureStarted: () => Promise.resolve(),
    scheduleEvent: (event, offsetSeconds) => {
      controllerScheduledEvents.push({ event, offsetSeconds });
    },
    getCurrentTime: () => fakeAudioTime,
    stopAll: () => {
      controllerScheduledEvents.length = 0;
    },
    dispose: () => {
      controllerScheduledEvents.length = 0;
    },
  };
  const controller = createPlaybackController({
    schedule,
    scheduler: createAudioLookaheadScheduler({
      queue,
      backend: controllerBackend,
      lookaheadSeconds: 0.2,
    }),
    backend: controllerBackend,
    schedulerIntervalMs: 25,
  });

  await controller.playFromSeconds(0.5);
  assert(controller.getState().kind === "playing", "Controller should enter playing state.");
  assertNear(controller.getCurrentScoreSeconds(), 0.5, "playFromSeconds should set playback origin.");

  fakeAudioTime = 0.25;
  assertNear(controller.getCurrentScoreSeconds(), 0.75, "Playing controller should advance with backend time.");
  controller.pause();
  assert(controller.getState().kind === "paused", "Pause should enter paused state.");
  assertNear(controller.getCurrentScoreSeconds(), 0.75, "Pause should preserve current score time.");

  await controller.resume();
  assert(controller.getState().kind === "playing", "Resume should enter playing state.");
  assertNear(controller.getCurrentScoreSeconds(), 0.75, "Resume should restart from paused score time.");

  await controller.seekToSeconds(1.25);
  assert(controller.getState().kind === "playing", "Seek during playback should keep playing state.");
  assertNear(controller.getCurrentScoreSeconds(), 1.25, "Seek should move playing origin.");

  controller.pause();
  await controller.seekToSeconds(0.25);
  assert(controller.getState().kind === "paused", "Seek while paused should keep paused state.");
  assertNear(controller.getCurrentScoreSeconds(), 0.25, "Paused seek should update paused time.");

  controller.stop();
  assert(controller.getState().kind === "stopped", "Stop should enter stopped state.");
  assertNear(controller.getCurrentScoreSeconds(), 0, "Stop should reset score time.");
}

console.log("Audio timing mapper test completed.");
