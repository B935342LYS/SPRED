import type { CanvasScoreLayout } from "../src/renderer/canvas_types";
import type { AnalysisResult, NoteEvent } from "../src/core/analyze/types";
import { createTickTimeMapper, numberToTimeFraction } from "../src/audio/tick_time_mapper";
import {
  applyGameSyncOffsetSeconds,
  applyGameScoringSample,
  collectGameJudgeTargetsAtSeconds,
  hasRemainingGameJudgeTarget,
  judgeGameScoringSample,
  normalizeGameTrackDifficulty,
} from "../src/app/game/game_judge";
import {
  DEFAULT_GAME_SYNC_OFFSET_MS,
  createEmptyGameScoreSummary,
  formatGameSyncOffsetMs,
  isGameModeTrackChangeLocked,
  normalizeGameSyncOffsetMs,
} from "../src/app/game/game_types";
import {
  loadGameSyncOffsetMsFromLocalStorage,
  saveGameSyncOffsetMsToLocalStorage,
} from "../src/infra/game_preferences";
import {
  calculateRms,
  createFrequencyRangeFromLayout,
  frequencyToMidiPitch,
} from "../src/app/game/game_pitch_math";

/**
 * 테스트 조건이 참인지 확인한다.
 * - 인수 : condition : 통과해야 하는 조건
 * - 인수 : message : 실패 시 표시할 메시지
 * - 반환값 : 없음
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * 두 숫자가 허용 오차 안에 있는지 확인한다.
 * - 인수 : actual : 실제 계산값
 * - 인수 : expected : 기대값
 * - 인수 : epsilon : 허용 오차
 * - 인수 : message : 실패 시 표시할 메시지
 * - 반환값 : 없음
 */
function assertClose(actual: number, expected: number, epsilon: number, message: string): void {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`${message}: expected ${expected}, received ${actual}`);
  }
}

/**
 * nullable 값을 테스트 안에서 non-null 값으로 좁힌다.
 * - 인수 : value : null일 수 있는 값
 * - 인수 : message : null일 때 표시할 실패 메시지
 * - 반환값 : null이 아닌 값
 */
function requireValue<T>(value: T | null, message: string): T {
  if (value === null) {
    throw new Error(message);
  }

  return value;
}

/**
 * Node 테스트 환경에서 game preference storage가 사용할 localStorage mock을 설치한다.
 * - 인수 : 없음
 * - 반환값 : mock storage map
 */
function installLocalStorageMock(): Map<string, string> {
  const storage = new Map<string, string>();

  globalThis.localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    get length() {
      return storage.size;
    },
  } as Storage;

  return storage;
}

/**
 * 테스트용 note event를 만든다.
 * - 인수 : eventId : event 식별자
 * - 인수 : trackId : 소속 track
 * - 인수 : startTick : 시작 tick
 * - 인수 : endTick : 종료 tick
 * - 인수 : midi : 발음 MIDI note
 * - 반환값 : 최소 필드만 채운 NoteEvent
 */
function createTestNoteEvent(
  eventId: string,
  trackId: "basic" | "optional" | "extra",
  startTick: number,
  endTick: number,
  midi: number,
): NoteEvent {
  return {
    eventKind: "note",
    eventId,
    trackId,
    time: {
      startTick: numberToTimeFraction(startTick),
      endTick: numberToTimeFraction(endTick),
    },
    sourceCells: [{ rowId: `row-${midi}`, col: startTick }],
    text: "",
    displayTextAnchors: [],
    display: {
      rowId: `row-${midi}`,
      centOffset: 0,
    },
    sound: {
      midi,
      centOffset: 0,
    },
    effects: [],
    glissAnchors: [],
  };
}

const a4 = requireValue(frequencyToMidiPitch(440), "A4 should produce a MIDI pitch.");

assert(a4.midi === 69, "A4 should be MIDI 69.");
assertClose(a4.centOffset, 0, 1e-9, "A4 cent offset should be zero.");

const a4SharpQuarter = requireValue(
  frequencyToMidiPitch(440 * 2 ** (50 / 1200)),
  "A4 + 50 cent should produce a MIDI pitch.",
);

assert(a4SharpQuarter.midi === 69 || a4SharpQuarter.midi === 70, "A4 + 50 cent should round near MIDI 69/70.");

const rms = calculateRms(new Float32Array([1, -1, 1, -1]));

assertClose(rms, 1, 1e-9, "Full-scale alternating samples should have RMS 1.");

assert(
  DEFAULT_GAME_SYNC_OFFSET_MS === 90,
  "Default practice Sync should start at +90 ms.",
);
assert(
  normalizeGameSyncOffsetMs(96) === 100,
  "Sync offset should snap to 10 ms steps.",
);
assert(
  normalizeGameSyncOffsetMs(500) === 200,
  "Sync offset should clamp to +200 ms.",
);
assert(
  normalizeGameSyncOffsetMs(-500) === -200,
  "Sync offset should clamp to -200 ms.",
);
assert(
  formatGameSyncOffsetMs(90) === "+90 ms",
  "Sync offset formatter should include a plus sign for positive values.",
);
assertClose(
  applyGameSyncOffsetSeconds(1.5, 90),
  1.41,
  1e-9,
  "Positive Sync should compare against an earlier score time.",
);
assertClose(
  applyGameSyncOffsetSeconds(1.5, -40),
  1.54,
  1e-9,
  "Negative Sync should compare against a later score time.",
);
assertClose(
  applyGameSyncOffsetSeconds(0.03, 90),
  0,
  1e-9,
  "Sync-adjusted score time should not go below zero.",
);

const preferenceStorage = installLocalStorageMock();

assert(
  loadGameSyncOffsetMsFromLocalStorage() === DEFAULT_GAME_SYNC_OFFSET_MS,
  "Missing Sync preference should load the default value.",
);
assert(
  saveGameSyncOffsetMsToLocalStorage(96) === 100 &&
    loadGameSyncOffsetMsFromLocalStorage() === 100,
  "Sync preference should save and load a normalized value.",
);

preferenceStorage.set("regression-code:game-sync-offset-ms", "999");

assert(
  loadGameSyncOffsetMsFromLocalStorage() === 200,
  "Out-of-range stored Sync preference should be clamped on load.",
);

preferenceStorage.set("regression-code:game-sync-offset-ms", "not-a-number");

assert(
  loadGameSyncOffsetMsFromLocalStorage() === DEFAULT_GAME_SYNC_OFFSET_MS,
  "Invalid stored Sync preference should fall back to the default value.",
);

const layout: CanvasScoreLayout = {
  rows: [
    { rowId: "n60", kind: "note", label: "C4", midi: 60, y: 0, height: 10 },
    { rowId: "n72", kind: "note", label: "C5", midi: 72, y: 10, height: 10 },
  ],
  columnCount: 4,
  columnWidth: 20,
  scoreContentWidth: 80,
  stageWidth: 80,
  stageHeight: 20,
  layoutWidth: 120,
  layoutLabelWidth: 100,
  layoutLeftPaddingWidth: 0,
  layoutRightPaddingWidth: 0,
  layoutPlaybackBoundaryX: 0,
  layoutFontSize: 12,
};
const range = createFrequencyRangeFromLayout(layout);

assert(range.minFrequencyHz < 261.63, "Frequency range should allow one octave below the lowest note row.");
assert(range.maxFrequencyHz > 523.25, "Frequency range should allow one octave above the highest note row.");

const emptySummary = createEmptyGameScoreSummary();

assert(
  !isGameModeTrackChangeLocked({ kind: "off" }),
  "Track change should be allowed when game mode is off.",
);
assert(
  !isGameModeTrackChangeLocked({ kind: "ready", summary: emptySummary, pitchFrame: null }),
  "Track change should be allowed while practice mode is ready/stopped.",
);
assert(
  isGameModeTrackChangeLocked({ kind: "playing", summary: emptySummary, pitchFrame: null }),
  "Track change should be locked during practice playback.",
);
assert(
  isGameModeTrackChangeLocked({ kind: "paused", summary: emptySummary, pitchFrame: null }),
  "Track change should be locked while practice playback is paused.",
);

const analysis: AnalysisResult = {
  timingTimeline: [{
    time: {
      startTick: numberToTimeFraction(0),
      endTick: numberToTimeFraction(8),
    },
    startBpm: 120,
    endBpm: 120,
    bpmCurve: "instant",
    beatsPerBar: 4,
    stepsPerBeat: 4,
    sourceCells: [],
  }],
  dynamicsTimeline: [],
  trackResults: [
    {
      trackId: "basic",
      events: [
        createTestNoteEvent("basic-c4", "basic", 0, 4, 60),
      ],
    },
    {
      trackId: "optional",
      events: [
        createTestNoteEvent("optional-d4", "optional", 0, 4, 62),
      ],
    },
    {
      trackId: "extra",
      events: [],
    },
  ],
  analysisIssues: [],
};
const mapper = createTickTimeMapper(analysis.timingTimeline);
const targetsAtStart = collectGameJudgeTargetsAtSeconds(
  analysis,
  ["basic", "optional"],
  mapper,
  0.1,
);

assert(targetsAtStart.length === 2, "Judge target lookup should include active track note events.");
assert(
  hasRemainingGameJudgeTarget(analysis, ["basic"], mapper, 0.1),
  "Practice finish check should detect remaining active note targets.",
);
assert(
  !hasRemainingGameJudgeTarget(analysis, ["basic"], mapper, 2),
  "Practice finish check should stop after all active note targets end.",
);

const transitionAnalysis: AnalysisResult = {
  timingTimeline: analysis.timingTimeline,
  dynamicsTimeline: [],
  trackResults: [
    {
      trackId: "basic",
      events: [
        createTestNoteEvent("transition-c4", "basic", 0, 4, 60),
        createTestNoteEvent("transition-d4", "basic", 4, 8, 62),
      ],
    },
    {
      trackId: "optional",
      events: [],
    },
    {
      trackId: "extra",
      events: [],
    },
  ],
  analysisIssues: [],
};
const transitionMapper = createTickTimeMapper(transitionAnalysis.timingTimeline);
const transitionTargetsInGrace = collectGameJudgeTargetsAtSeconds(
  transitionAnalysis,
  ["basic"],
  transitionMapper,
  0.52,
);
const transitionTargetsAfterGrace = collectGameJudgeTargetsAtSeconds(
  transitionAnalysis,
  ["basic"],
  transitionMapper,
  0.54,
);

assert(
  transitionTargetsInGrace.some((target) => target.eventId === "transition-c4") &&
    transitionTargetsInGrace.some((target) => target.eventId === "transition-d4"),
  "Adjacent note transition should keep the previous note target briefly after its end.",
);
assert(
  !transitionTargetsAfterGrace.some((target) => target.eventId === "transition-c4") &&
    transitionTargetsAfterGrace.some((target) => target.eventId === "transition-d4"),
  "Previous note transition grace should expire after the short release window.",
);

const difficulty = normalizeGameTrackDifficulty({
  basic: 0,
  optional: 2,
  extra: Number.NaN,
});

assertClose(difficulty.basic, 1, 1e-9, "Basic difficulty should fall back when score difficulty is 0.");
assertClose(difficulty.optional, 2, 1e-9, "Optional difficulty should use a positive score difficulty.");
assertClose(difficulty.extra, 1.5, 1e-9, "Extra difficulty should fall back when score difficulty is invalid.");

const perfectSample = judgeGameScoringSample(
  {
    capturedAtMs: 0,
    rawFrequencyHz: 523.25,
    frequencyHz: 523.25,
    midi: 72,
    centOffset: 0,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  targetsAtStart,
  0.1,
  difficulty,
);

assert(perfectSample !== null, "Voiced pitch and active target should create a scoring sample.");
assert(perfectSample?.label === "Perfect", "Same pitch class in another octave should be Perfect.");
assert(perfectSample?.trackId === "basic", "C input should select the C target instead of the D target.");

for (const octaveOffset of [-24, -12, 0, 12, 24]) {
  const octaveShiftedSample = judgeGameScoringSample(
    {
      capturedAtMs: 0,
      rawFrequencyHz: 261.63 * 2 ** (octaveOffset / 12),
      frequencyHz: 261.63 * 2 ** (octaveOffset / 12),
      midi: 60 + octaveOffset,
      centOffset: 0,
      clarity: 1,
      rms: 0.1,
      isVoiced: true,
      rejectReason: null,
    },
    [{
      eventId: "basic-c4",
      trackId: "basic",
      startSeconds: 0,
      endSeconds: 1,
      targetMidi: 60,
      targetCentOffset: 0,
    }],
    0.1,
    difficulty,
  );

  assert(
    octaveShiftedSample?.label === "Perfect",
    `Pitch-class scoring should treat C${octaveOffset / 12} octave shift as Perfect.`,
  );
}

const firstFrameWrongOctaveSample = judgeGameScoringSample(
  {
    capturedAtMs: 1000,
    rawFrequencyHz: 1046.5,
    frequencyHz: 1046.5,
    midi: 84,
    centOffset: 0,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  [{
    eventId: "basic-c4",
    trackId: "basic",
    startSeconds: 0,
    endSeconds: 1,
    targetMidi: 60,
    targetCentOffset: 0,
  }],
  0.1,
  difficulty,
);

assert(
  firstFrameWrongOctaveSample?.label === "Perfect",
  "Pitch-class scoring should accept a two-octave C input for a C target without changing the raw pitch.",
);

const rawJumpSample = judgeGameScoringSample(
  {
    capturedAtMs: 1100,
    rawFrequencyHz: 587.33,
    frequencyHz: 587.33,
    midi: 74,
    centOffset: 0,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  [{
    eventId: "basic-c4",
    trackId: "basic",
    startSeconds: 0,
    endSeconds: 1,
    targetMidi: 60,
    targetCentOffset: 0,
  }],
  0.2,
  difficulty,
);

assert(rawJumpSample?.label === "Miss", "Raw scoring should treat an unrelated detector jump as Miss.");

const lateReleaseSample = judgeGameScoringSample(
  {
    capturedAtMs: 1300,
    rawFrequencyHz: 261.63,
    frequencyHz: 261.63,
    midi: 60,
    centOffset: 0,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  transitionTargetsInGrace,
  0.52,
  difficulty,
);

assert(
  lateReleaseSample?.label === "Perfect" &&
    lateReleaseSample.targetEventId === "transition-c4",
  "Late release during a note transition should match the previous note instead of creating a Miss on the next note.",
);

const expiredLateReleaseSample = judgeGameScoringSample(
  {
    capturedAtMs: 1400,
    rawFrequencyHz: 261.63,
    frequencyHz: 261.63,
    midi: 60,
    centOffset: 0,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  transitionTargetsAfterGrace,
  0.54,
  difficulty,
);

assert(
  expiredLateReleaseSample?.label === "Miss",
  "Late release should become a Miss after the previous note grace window expires.",
);

const rawShortJumpSample = judgeGameScoringSample(
  {
    capturedAtMs: 1100,
    rawFrequencyHz: 587.33,
    frequencyHz: 587.33,
    midi: 74,
    centOffset: 0,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  [{
    eventId: "basic-c4",
    trackId: "basic",
    startSeconds: 0,
    endSeconds: 1,
    targetMidi: 60,
    targetCentOffset: 0,
  }],
  0.2,
  difficulty,
);

assert(
  rawShortJumpSample?.label === "Miss",
  "Raw scoring should keep an unrelated detector jump as Miss without time-based hold.",
);

const harmonicRawSample = judgeGameScoringSample(
  {
    capturedAtMs: 1200,
    rawFrequencyHz: 987.77,
    frequencyHz: 987.77,
    midi: 83,
    centOffset: 0,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  [{
    eventId: "basic-e4",
    trackId: "basic",
    startSeconds: 0,
    endSeconds: 1,
    targetMidi: 64,
    targetCentOffset: 0,
  }],
  0.3,
  difficulty,
);

assert(
  harmonicRawSample?.label === "Miss",
  "Raw scoring should treat an overtone-like high pitch as Miss without target-based adjustment.",
);

const rawExpiredJumpSample = judgeGameScoringSample(
  {
    capturedAtMs: 1600,
    rawFrequencyHz: 587.33,
    frequencyHz: 587.33,
    midi: 74,
    centOffset: 0,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  [{
    eventId: "basic-c4",
    trackId: "basic",
    startSeconds: 0,
    endSeconds: 1,
    targetMidi: 60,
    targetCentOffset: 0,
  }],
  0.7,
  difficulty,
);

assert(
  rawExpiredJumpSample?.label === "Miss",
  "Raw scoring should keep an unrelated pitch as Miss without retained pitch state.",
);

const missSample = judgeGameScoringSample(
  {
    capturedAtMs: 0,
    rawFrequencyHz: 369.99,
    frequencyHz: 369.99,
    midi: 66,
    centOffset: 0,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  [{
    eventId: "basic-c4",
    trackId: "basic",
    startSeconds: 0,
    endSeconds: 1,
    targetMidi: 60,
    targetCentOffset: 0,
  }],
  0.1,
  difficulty,
);

assert(missSample?.label === "Miss", "A far voiced pitch should create a Miss sample.");
assertClose(missSample?.scoreContribution ?? -1, 0, 1e-9, "Miss should not reduce or add score.");

const okSample = judgeGameScoringSample(
  {
    capturedAtMs: 0,
    rawFrequencyHz: 537.13,
    frequencyHz: 537.13,
    midi: 72,
    centOffset: 60,
    clarity: 1,
    rms: 0.1,
    isVoiced: true,
    rejectReason: null,
  },
  [{
    eventId: "basic-c4",
    trackId: "basic",
    startSeconds: 0,
    endSeconds: 1,
    targetMidi: 60,
    targetCentOffset: 0,
  }],
  0.1,
  difficulty,
);

assert(okSample?.label === "Ok", "A 60 cent pitch error should create an Ok sample.");
assertClose(okSample?.scoreContribution ?? -1, 0.6, 1e-9, "Ok should contribute 60% accuracy.");

const silentSample = judgeGameScoringSample(
  {
    capturedAtMs: 0,
    rawFrequencyHz: null,
    frequencyHz: null,
    midi: null,
    centOffset: null,
    clarity: 0,
    rms: 0,
    isVoiced: false,
    rejectReason: "invalid frequency",
  },
  targetsAtStart,
  0.1,
  difficulty,
);

assert(silentSample === null, "Silence should not create a Miss sample.");

const summaryAfterPerfect = perfectSample === null
  ? emptySummary
  : applyGameScoringSample(emptySummary, perfectSample);
const summaryAfterMiss = missSample === null
  ? summaryAfterPerfect
  : applyGameScoringSample(summaryAfterPerfect, missSample);

assert(summaryAfterPerfect.perfectCount === 1, "Perfect sample should increment Perfect count.");
assert(summaryAfterPerfect.bestCombo === 1, "Perfect sample should increment combo.");
assert(summaryAfterMiss.missCount === 1, "Miss sample should increment Miss count.");
assert(summaryAfterMiss.currentCombo === 0, "Miss sample should reset current combo.");
assertClose(
  summaryAfterMiss.accuracyPercent,
  50,
  1e-9,
  "Miss sample should count as 0% in the total average accuracy.",
);

console.log("Game mode pitch math test completed.");
