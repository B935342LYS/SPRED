/**
 * canvas renderer 내부에서 공유하는 색상과 치수 상수를 정의한다.
 */

/**
 * renderer 공통 색상 상수.
 * - 인수 : 없음
 * - 반환값 : canvas layer별 draw 함수가 공유하는 CSS 색상 문자열 묶음
 */
export const CANVAS_COLORS = {
  rollBackground: "#525252",
  noteRowBackground: "#646464",
  gridSoft: "rgba(255,255,255,0.12)",
  gridVertical: "rgba(0,0,0,0.18)",
  labelText: "rgba(255,255,255,0.92)",
  noteLabelText: "rgba(255,255,255,0.95)",
  labelLine: "rgba(255,255,255,0.18)",
  playbackBoundary: "rgba(255,80,80,0.35)",
  noteStroke: "rgba(255,255,255,0.22)",
  extraNoteStroke: "rgba(255,255,255,0.92)",
  noteText: "#000000",
  extraNoteText: "#ffffff",
  extraNoteFill: "#000000",
  vibWave: "rgba(0,0,0,0.72)",
  extraVibWave: "rgba(255,255,255,0.92)",
} as const;

/**
 * renderer 공통 치수 상수.
 * - 인수 : 없음
 * - 반환값 : canvas 좌표/크기 계산에 사용하는 기준 px 값 묶음
 */
export const CANVAS_METRICS = {
  baseLayoutLabelWidth: 100,
  baseLayoutPaddingWidth: 21,
  baseLayoutFontSize: 12,
  baseNoteRenderHeight: 21,
  noteInsetX: 1,
  minNoteWidth: 1,
  minNoteHeight: 1,
  tremoloChopLineWidth: 2,
  vibWaveSampleCount: 48,
} as const;
