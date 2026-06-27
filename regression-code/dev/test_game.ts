import type { CanvasScoreLayout } from "../src/renderer/canvas_types";
import {
  createEmptyGameScoreSummary,
  isGameModeTrackChangeLocked,
} from "../src/app/game/game_types";
import {
  calculateRms,
  createGamePitchCorrectionState,
  createFrequencyRangeFromLayout,
  frequencyToMidiPitch,
  resolveClosestPitchClassCandidateMidi,
  resolvePitchClassCandidateMidiWithHysteresis,
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

const foldedC5ToC4 = resolveClosestPitchClassCandidateMidi(72, 0, [
  { midi: 60, centOffset: 0 },
]);

assertClose(foldedC5ToC4, 60, 1e-9, "Pitch class candidate should fold C5 input near a C4 target.");

const foldedC5SharpToC4 = resolveClosestPitchClassCandidateMidi(72, 40, [
  { midi: 60, centOffset: 0 },
  { midi: 62, centOffset: 0 },
]);

assertClose(
  foldedC5SharpToC4,
  60.4,
  1e-9,
  "Pitch class candidate should choose the nearest active target pitch class.",
);

const unrelatedD5AgainstC4 = resolveClosestPitchClassCandidateMidi(74, 0, [
  { midi: 60, centOffset: 0 },
]);

assertClose(
  unrelatedD5AgainstC4,
  74,
  1e-9,
  "Pitch class candidate should not fold unrelated detected notes to the active target.",
);

const semitoneBoundaryAgainstC4 = resolveClosestPitchClassCandidateMidi(61, 0, [
  { midi: 60, centOffset: 0 },
]);

assertClose(
  semitoneBoundaryAgainstC4,
  61,
  1e-9,
  "Pitch class candidate should not fold a semitone jump as an octave match.",
);

const correctionState = createGamePitchCorrectionState();
const hysteresisFoldedC5ToC4 = resolvePitchClassCandidateMidiWithHysteresis(
  72,
  0,
  [{ midi: 60, centOffset: 0 }],
  1000,
  correctionState,
);

assertClose(
  hysteresisFoldedC5ToC4,
  60,
  1e-9,
  "Pitch hysteresis should fold an octave-related input to the active target octave.",
);

const hysteresisGraceFold = resolvePitchClassCandidateMidiWithHysteresis(
  84,
  0,
  [],
  1100,
  correctionState,
);

assertClose(
  hysteresisGraceFold,
  60,
  1e-9,
  "Pitch hysteresis should keep the previous target octave during a short target gap.",
);

const hysteresisUnrelatedInput = resolvePitchClassCandidateMidiWithHysteresis(
  74,
  0,
  [],
  1120,
  correctionState,
);

assertClose(
  hysteresisUnrelatedInput,
  74,
  1e-9,
  "Pitch hysteresis should not fold unrelated pitch classes to the locked target.",
);

const hysteresisExpiredGap = resolvePitchClassCandidateMidiWithHysteresis(
  84,
  0,
  [],
  1400,
  correctionState,
);

assertClose(
  hysteresisExpiredGap,
  84,
  1e-9,
  "Pitch hysteresis should release the target lock after the grace period.",
);

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

console.log("Game mode pitch math test completed.");
