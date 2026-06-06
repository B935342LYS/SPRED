/**
 * ScoreFile JSON을 브라우저 localStorage에 저장하고 불러온다.
 */

import type { ScoreFile } from "../core/score/types";
import { serializeScoreFile } from "./score_file_io";

const LOCAL_SCORE_STORAGE_KEY = "regression-code:score-json";

/**
 * 현재 ScoreFile을 localStorage에 저장한다.
 * - 인수 : score : 저장할 score JSON 객체
 * - 반환값 : 없음
 */
export function saveScoreToLocalStorage(score: ScoreFile): void {
  localStorage.setItem(LOCAL_SCORE_STORAGE_KEY, serializeScoreFile(score));
}

/**
 * localStorage에 저장된 ScoreFile JSON 문자열을 읽는다.
 * - 인수 : 없음
 * - 반환값 : 저장된 JSON 문자열, 없으면 null
 */
export function loadScoreFromLocalStorage(): string | null {
  return localStorage.getItem(LOCAL_SCORE_STORAGE_KEY);
}
