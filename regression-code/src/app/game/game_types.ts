/**
 * 게임 모드 런타임 상태와 UI 표시용 집계 타입을 정의한다.
 */

/** 게임 모드 화면에 표시할 scoring sample 집계값. */
export type GameScoreSummary = {
  accuracyPercent: number;
  perfectCount: number;
  okCount: number;
  badCount: number;
  missCount: number;
  currentCombo: number;
  bestCombo: number;
  score: number;
};

/** 마이크 입력에서 추정한 단일 pitch frame. */
export type GamePitchFrame = {
  capturedAtMs: number;
  frequencyHz: number | null;
  midi: number | null;
  centOffset: number | null;
  clarity: number;
  rms: number;
  isVoiced: boolean;
};

/** score JSON에 저장하지 않는 게임 모드 세션 상태. */
export type GameModeState =
  | { kind: "off" }
  | { kind: "preparing"; message: string }
  | { kind: "countdown"; count: number; summary: GameScoreSummary; pitchFrame: GamePitchFrame | null }
  | { kind: "ready"; summary: GameScoreSummary; pitchFrame: GamePitchFrame | null }
  | { kind: "playing"; summary: GameScoreSummary; pitchFrame: GamePitchFrame | null }
  | { kind: "paused"; summary: GameScoreSummary; pitchFrame: GamePitchFrame | null }
  | { kind: "finished"; summary: GameScoreSummary; pitchFrame: GamePitchFrame | null }
  | { kind: "error"; message: string };

/** 새 게임 모드 세션에서 사용할 빈 점수 집계를 만든다. */
export function createEmptyGameScoreSummary(): GameScoreSummary {
  return {
    accuracyPercent: 0,
    perfectCount: 0,
    okCount: 0,
    badCount: 0,
    missCount: 0,
    currentCombo: 0,
    bestCombo: 0,
    score: 0,
  };
}

/**
 * 게임 모드 panel을 표시해야 하는지 확인한다.
 * - 인수 : state : 현재 게임 모드 상태
 * - 반환값 : off가 아니면 true
 */
export function isGameModeOpen(state: GameModeState): boolean {
  return state.kind !== "off";
}

/**
 * 게임 모드가 score 구조나 시간축 조작을 막아야 하는 상태인지 확인한다.
 * - 인수 : state : 현재 게임 모드 상태
 * - 반환값 : 세션이 준비/진행/정지/완료 상태이면 true
 */
export function isGameModeLocked(state: GameModeState): boolean {
  return state.kind === "preparing" ||
    state.kind === "countdown" ||
    state.kind === "ready" ||
    state.kind === "playing" ||
    state.kind === "paused" ||
    state.kind === "finished";
}

/**
 * 게임 모드가 active track 변경을 막아야 하는 상태인지 확인한다.
 * - 인수 : state : 현재 게임 모드 상태
 * - 반환값 : practice ready/off/error 외 상태이면 true
 */
export function isGameModeTrackChangeLocked(state: GameModeState): boolean {
  return state.kind === "preparing" ||
    state.kind === "countdown" ||
    state.kind === "playing" ||
    state.kind === "paused" ||
    state.kind === "finished";
}

/**
 * 게임 모드 상태에서 표시 가능한 점수 집계를 꺼낸다.
 * - 인수 : state : 현재 게임 모드 상태
 * - 반환값 : 점수 집계가 있는 상태이면 해당 집계, 아니면 빈 집계
 */
export function getGameScoreSummary(state: GameModeState): GameScoreSummary {
  if (
    state.kind === "ready" ||
    state.kind === "countdown" ||
    state.kind === "playing" ||
    state.kind === "paused" ||
    state.kind === "finished"
  ) {
    return state.summary;
  }

  return createEmptyGameScoreSummary();
}
