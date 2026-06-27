/**
 * 게임 모드 런타임 상태를 player 영역의 practice panel에 반영한다.
 */

import type {
  AppDom,
  AppState,
} from "../app_types";
import {
  getGameScoreSummary,
  isGameModeLocked,
  isGameModeOpen,
} from "./game_types";

/**
 * 게임 모드 상태를 사용자에게 표시할 짧은 status 문자열로 만든다.
 * - 인수 : state : 현재 앱 상태
 * - 반환값 : practice panel status 문자열
 */
function formatGameStatus(state: AppState): string {
  switch (state.gameMode.kind) {
    case "off":
      return "off";
    case "preparing":
      return "preparing";
    case "countdown":
      return String(state.gameMode.count);
    case "ready":
      return "ready";
    case "playing":
      return "playing";
    case "paused":
      return "paused";
    case "finished":
      return "finished";
    case "error":
      return "error";
  }
}

/**
 * 게임 모드 panel과 practice mode 버튼을 현재 AppState에 맞춘다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : state : 현재 앱 상태
 * - 반환값 : 없음
 */
export function syncGameModeUi(dom: AppDom, state: AppState): void {
  const summary = getGameScoreSummary(state.gameMode);
  const isOpen = isGameModeOpen(state.gameMode);
  const isLocked = isGameModeLocked(state.gameMode);
  const statusText = state.gameMode.kind === "preparing"
    ? state.gameMode.message
    : state.gameMode.kind === "error"
      ? state.gameMode.message
      : formatGameStatus(state);

  dom.gamePanel.dataset.state = state.gameMode.kind;
  dom.gameStatus.textContent = statusText;
  dom.gameStatus.title = statusText;
  dom.gameAccuracy.textContent = `${Math.round(summary.accuracyPercent)}%`;
  dom.gamePerfectCount.textContent = String(summary.perfectCount);
  dom.gameOkCount.textContent = String(summary.okCount);
  dom.gameBadCount.textContent = String(summary.badCount);
  dom.gameMissCount.textContent = String(summary.missCount);
  dom.gameCombo.textContent = String(summary.bestCombo);
  dom.gameScore.textContent = String(Math.round(summary.score));
  dom.practiceModeButton.disabled = state.busy.kind !== "idle" && !isLocked;
  dom.practiceModeButton.textContent = isOpen ? "exit practice" : "practice mode";
  dom.practiceModeButton.setAttribute("aria-pressed", String(isOpen));
  dom.practiceModeButton.classList.toggle("on", isOpen);
  dom.practiceModeButton.classList.toggle("off", !isOpen);
}
