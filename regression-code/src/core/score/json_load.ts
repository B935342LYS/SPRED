/**
 * src\core\score\json_load.ts
 * 입력되는 악보 JSON 문자열을 JavaScript 값으로 파싱한다.
 * JSON 문법 오류와 최상위 값의 object 여부만 이 단계에서 처리한다.
 * ScoreFile 구조 검증은 score_validate.ts가 담당한다.
 */

import type { ScoreFile } from "./types";
import {
  validateScoreFile,
  type ScoreValidationError,
} from "./score_validate";

/**
 * JSON 문자열 파싱 결과.
 * - 정상 로드 시 : ScoreFile 후보 값
 * - 비정상 로드 시 : JsonLoadError
 */
export type LoadScoreJsonResult =
  | {
      ok: true;
      value: unknown;
    }
  | {
      ok: false;
      error: JsonLoadError;
    };

/**
 * json 파싱 단계에서 두 종류의 오류가 있을 수 있다.
 * - parse_error : JSON 작성 형식을 지키지 않아 발생하는 오류
 * - not_object : 파싱 결과가 올바른 객체가 아님
 */
export type JsonLoadError = {
  code: "parse_error" | "not_object";
  message: string;
};

/**
 * JSON 파싱과 ScoreFile 구조 검증까지 끝낸 통합 로드 결과.
 * 호출자는 이 결과만 보고 후속 score 모듈로 넘길 수 있다.
 */
export type LoadScoreFileResult =
  | {
      ok: true;
      score: ScoreFile;
    }
  | {
      ok: false;
      error: JsonLoadError | ScoreValidationError;
    };

/**
 * JSON 문자열을 ScoreFile 후보 값으로 파싱한다.
 * 이 함수는 JSON 문법과 최상위 object 여부만 확인한다.
 */
export function loadScoreJson(jsonText: string): LoadScoreJsonResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "parse_error",
        message: error instanceof Error ? error.message : "Invalid JSON text.",
      },
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      ok: false,
      error: {
        code: "not_object",
        message: "Score JSON root must be an object.",
      },
    };
  }

  return {
    ok: true,
    value: parsed,
  };
}

/**
 * JSON 문자열을 파싱한 뒤 ScoreFile 최소 구조 검증까지 수행한다.
 * 외부 호출부에서는 보통 이 함수를 사용한다.
 */
export function loadScoreFile(jsonText: string): LoadScoreFileResult {
  const loadResult = loadScoreJson(jsonText);

  if (!loadResult.ok) {
    return loadResult;
  }

  return validateScoreFile(loadResult.value);
}
