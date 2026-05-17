/**
 * src/core/parse/parse_global_cell.ts
 * 전역 행 셀의 rawText를 ParsedGlobalCell 구조로 변환한다.
 * 이 파일은 전역 셀 하나의 숫자 형식, 선형 변화 토큰, kind별 값 범위만 판정한다.
 */

import type { GlobalKind, RowDefinition } from "../score/types";
import type {
  GlobalCellParserContext,
  GlobalCellParserInput,
  GlobalParseError,
  GlobalParseErrorCode,
  ParsedGlobalCell,
  ParsedGlobalRamp,
} from "./types";

/**
 * 전역 셀 하나의 rawText를 ParsedGlobalCell로 파싱한다.
 * - 인수 : input : 전역 셀 좌표와 원본 문자열
 * - 인수 : context : rowId에서 전역 행 kind를 유도하기 위한 parser 문맥
 * - 반환값 : ParsedGlobalCell : 전역 셀 파싱 성공 또는 실패 결과
 */
export function parseGlobalCell(
  input: GlobalCellParserInput,
  context: GlobalCellParserContext,
): ParsedGlobalCell {
  const row = context.rowById.get(input.rowId);

  if (!isGlobalRow(row)) {
    return invalidGlobalCell(
      input.rawText,
      "more_than_expected",
      null,
      "Global cell rowId must refer to a global row.",
    );
  }

  if (input.rawText.length === 0) {
    return invalidGlobalCell(
      input.rawText,
      "empty_global",
      0,
      "Global cell text must not be empty.",
    );
  }

  if (isLinearGlobalKind(row.kind)) {
    return parseLinearGlobalCell(input.rawText, row.kind);
  }

  return parseInstantGlobalCell(input.rawText, row.kind);
}

/**
 * bpm 또는 dynamics 전역 셀을 파싱한다.
 * - 인수 : rawText : 전역 셀 원본 문자열
 * - 인수 : globalKind : 선형 변화 토큰을 허용하는 전역 행 종류
 * - 반환값 : ParsedGlobalCell : 선형 전역 셀 파싱 성공 또는 실패 결과
 */
function parseLinearGlobalCell(
  rawText: string,
  globalKind: Extract<GlobalKind, "bpm" | "dynamics">,
): ParsedGlobalCell {
  const rampParse = splitRampToken(rawText);

  if (rampParse.numberText.length === 0) {
    return invalidGlobalCell(
      rawText,
      "invalid_number",
      0,
      "Global cell number text must not be empty.",
    );
  }

  if (globalKind === "bpm") {
    return parseBpmCell(rawText, rampParse.numberText, rampParse.ramp);
  }

  return parseDynamicsCell(rawText, rampParse.numberText, rampParse.ramp);
}

/**
 * beatsPerBar 또는 stepsPerBeat 전역 셀을 파싱한다.
 * - 인수 : rawText : 전역 셀 원본 문자열
 * - 인수 : globalKind : 선형 변화 토큰을 허용하지 않는 전역 행 종류
 * - 반환값 : ParsedGlobalCell : 즉시 적용 전역 셀 파싱 성공 또는 실패 결과
 */
function parseInstantGlobalCell(
  rawText: string,
  globalKind: Extract<GlobalKind, "beatsPerBar" | "stepsPerBeat">,
): ParsedGlobalCell {
  const rampErrorIndex = findTrailingRampTokenIndex(rawText);

  if (rampErrorIndex !== null) {
    return invalidGlobalCell(
      rawText,
      "invalid_ramp_token",
      rampErrorIndex,
      `${globalKind} does not allow ramp tokens.`,
    );
  }

  if (globalKind === "beatsPerBar") {
    return parseBeatsPerBarCell(rawText);
  }

  return parseStepsPerBeatCell(rawText);
}

/**
 * bpm 전역 셀의 숫자와 ramp 값을 검증해 ParsedGlobalCell을 만든다.
 * - 인수 : rawText : 전역 셀 원본 문자열
 * - 인수 : numberText : ramp 토큰을 제거한 숫자 문자열
 * - 인수 : ramp : 파싱된 선형 변화 토큰
 * - 반환값 : ParsedGlobalCell : bpm 셀 파싱 성공 또는 실패 결과
 */
function parseBpmCell(
  rawText: string,
  numberText: string,
  ramp: ParsedGlobalRamp,
): ParsedGlobalCell {
  const numberParse = parseFiniteDecimal(numberText);

  if (!numberParse.ok) {
    return invalidGlobalCell(
      rawText,
      "invalid_number",
      numberParse.charIndex,
      "BPM must be a positive number.",
    );
  }

  if (numberParse.value <= 0) {
    return invalidGlobalCell(
      rawText,
      "invalid_bpm_range",
      0,
      "BPM must be greater than 0.",
    );
  }

  return {
    kind: "linearGlobalValue",
    rawText,
    globalKind: "bpm",
    value: numberParse.value,
    ramp,
  };
}

/**
 * dynamics 전역 셀의 숫자와 ramp 값을 검증해 ParsedGlobalCell을 만든다.
 * - 인수 : rawText : 전역 셀 원본 문자열
 * - 인수 : numberText : ramp 토큰을 제거한 숫자 문자열
 * - 인수 : ramp : 파싱된 선형 변화 토큰
 * - 반환값 : ParsedGlobalCell : dynamics 셀 파싱 성공 또는 실패 결과
 */
function parseDynamicsCell(
  rawText: string,
  numberText: string,
  ramp: ParsedGlobalRamp,
): ParsedGlobalCell {
  const integerParse = parseNonNegativeInteger(numberText);

  if (!integerParse.ok) {
    return invalidGlobalCell(
      rawText,
      "invalid_number",
      integerParse.charIndex,
      "Dynamics must be an integer.",
    );
  }

  if (integerParse.value > 150) {
    return invalidGlobalCell(
      rawText,
      "invalid_dynamics_range",
      0,
      "Dynamics must be between 0 and 150.",
    );
  }

  return {
    kind: "linearGlobalValue",
    rawText,
    globalKind: "dynamics",
    value: integerParse.value,
    ramp,
  };
}

/**
 * beatsPerBar 전역 셀의 자연수 값을 검증해 ParsedGlobalCell을 만든다.
 * - 인수 : rawText : 전역 셀 원본 문자열
 * - 반환값 : ParsedGlobalCell : beatsPerBar 셀 파싱 성공 또는 실패 결과
 */
function parseBeatsPerBarCell(rawText: string): ParsedGlobalCell {
  const integerParse = parsePositiveInteger(rawText);

  if (!integerParse.ok) {
    return invalidGlobalCell(
      rawText,
      "invalid_number",
      integerParse.charIndex,
      "beatsPerBar must be a positive integer.",
    );
  }

  return {
    kind: "instantGlobalValue",
    rawText,
    globalKind: "beatsPerBar",
    value: integerParse.value,
  };
}

/**
 * stepsPerBeat 전역 셀의 자연수 값을 검증해 ParsedGlobalCell을 만든다.
 * - 인수 : rawText : 전역 셀 원본 문자열
 * - 반환값 : ParsedGlobalCell : stepsPerBeat 셀 파싱 성공 또는 실패 결과
 */
function parseStepsPerBeatCell(rawText: string): ParsedGlobalCell {
  const integerParse = parsePositiveInteger(rawText);

  if (!integerParse.ok) {
    return invalidGlobalCell(
      rawText,
      "invalid_number",
      integerParse.charIndex,
      "stepsPerBeat must be a positive integer.",
    );
  }

  return {
    kind: "instantGlobalValue",
    rawText,
    globalKind: "stepsPerBeat",
    value: integerParse.value,
  };
}

/**
 * 선형 변화 가능 전역 셀의 끝에서 ramp 토큰을 분리한다.
 * - 인수 : rawText : 전역 셀 원본 문자열
 * - 반환값 : { numberText: string; ramp: ParsedGlobalRamp } : 숫자 문자열과 ramp 해석 결과
 */
function splitRampToken(rawText: string): {
  numberText: string;
  ramp: ParsedGlobalRamp;
} {
  // "><"는 두 글자 토큰이므로 "<" 또는 ">"보다 먼저 판정한다.
  if (rawText.endsWith("><")) {
    return {
      numberText: rawText.slice(0, -2),
      ramp: "endStart",
    };
  }

  if (rawText.endsWith("<")) {
    return {
      numberText: rawText.slice(0, -1),
      ramp: "start",
    };
  }

  if (rawText.endsWith(">")) {
    return {
      numberText: rawText.slice(0, -1),
      ramp: "end",
    };
  }

  return {
    numberText: rawText,
    ramp: "none",
  };
}

/**
 * 선형 변화 불가 전역 셀 끝에 ramp 토큰이 있는지 확인한다.
 * - 인수 : rawText : 전역 셀 원본 문자열
 * - 반환값 : number | null : ramp 토큰 시작 위치 또는 없음
 */
function findTrailingRampTokenIndex(rawText: string): number | null {
  if (rawText.endsWith("><")) {
    return rawText.length - 2;
  }

  if (rawText.endsWith("<") || rawText.endsWith(">")) {
    return rawText.length - 1;
  }

  return null;
}

/**
 * 양의 정수 문자열을 number로 파싱한다.
 * - 인수 : text : 숫자로 파싱할 문자열
 * - 반환값 : NumberParseResult : 양의 정수 파싱 성공 또는 실패 결과
 */
function parsePositiveInteger(text: string): NumberParseResult {
  const result = parseInteger(text);

  if (!result.ok) {
    return result;
  }

  if (result.value < 1) {
    return {
      ok: false,
      charIndex: 0,
    };
  }

  return result;
}

/**
 * 0 이상의 정수 문자열을 number로 파싱한다.
 * - 인수 : text : 숫자로 파싱할 문자열
 * - 반환값 : NumberParseResult : 0 이상 정수 파싱 성공 또는 실패 결과
 */
function parseNonNegativeInteger(text: string): NumberParseResult {
  const result = parseInteger(text);

  if (!result.ok) {
    return result;
  }

  if (result.value < 0) {
    return {
      ok: false,
      charIndex: 0,
    };
  }

  return result;
}

/**
 * 부호 없는 정수 문자열을 number로 파싱한다.
 * - 인수 : text : 숫자로 파싱할 문자열
 * - 반환값 : NumberParseResult : 정수 파싱 성공 또는 실패 결과
 */
function parseInteger(text: string): NumberParseResult {
  const invalidIndex = findFirstRegexMismatch(text, /^[0-9]+$/);

  if (invalidIndex !== null) {
    return {
      ok: false,
      charIndex: invalidIndex,
    };
  }

  return {
    ok: true,
    value: Number.parseInt(text, 10),
  };
}

/**
 * 유한한 십진수 문자열을 number로 파싱한다.
 * - 인수 : text : 숫자로 파싱할 문자열
 * - 반환값 : NumberParseResult : 십진수 파싱 성공 또는 실패 결과
 */
function parseFiniteDecimal(text: string): NumberParseResult {
  const invalidIndex = findFirstRegexMismatch(text, /^[0-9]+(?:\.[0-9]+)?$/);

  if (invalidIndex !== null) {
    return {
      ok: false,
      charIndex: invalidIndex,
    };
  }

  const value = Number.parseFloat(text);

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      charIndex: 0,
    };
  }

  return {
    ok: true,
    value,
  };
}

/**
 * 전체 문자열이 정규식과 일치하는지 확인하고, 실패 시 첫 의심 위치를 반환한다.
 * - 인수 : text : 검사할 문자열
 * - 인수 : pattern : 전체 문자열 검사용 정규식
 * - 반환값 : number | null : 불일치 추정 위치 또는 통과 결과
 */
function findFirstRegexMismatch(text: string, pattern: RegExp): number | null {
  if (text.length === 0) {
    return 0;
  }

  if (pattern.test(text)) {
    return null;
  }

  const invalidIndex = text.search(/[^0-9.]/);

  if (invalidIndex >= 0) {
    return invalidIndex;
  }

  return 0;
}

/**
 * RowDefinition이 global row인지 확인한다.
 * - 인수 : row : rowById에서 조회한 RowDefinition 후보
 * - 반환값 : row is Extract<RowDefinition, { type: "global" }> : global row 여부
 */
function isGlobalRow(
  row: RowDefinition | undefined,
): row is Extract<RowDefinition, { type: "global" }> {
  return row?.type === "global";
}

/**
 * 전역 행 종류가 선형 변화 토큰을 허용하는지 확인한다.
 * - 인수 : kind : 전역 행 종류
 * - 반환값 : kind is Extract<GlobalKind, "bpm" | "dynamics"> : 선형 변화 가능 여부
 */
function isLinearGlobalKind(
  kind: GlobalKind,
): kind is Extract<GlobalKind, "bpm" | "dynamics"> {
  return kind === "bpm" || kind === "dynamics";
}

/**
 * 전역 셀 parser 실패 결과를 생성한다.
 * - 인수 : rawText : 전역 셀 원본 문자열
 * - 인수 : code : 전역 셀 parser 오류 코드
 * - 인수 : charIndex : 오류 위치. 특정하기 어려우면 null
 * - 인수 : message : 사람이 읽는 보조 오류 메시지
 * - 반환값 : ParsedGlobalCell : invalid 전역 셀 결과
 */
function invalidGlobalCell(
  rawText: string,
  code: GlobalParseErrorCode,
  charIndex: number | null,
  message: string,
): ParsedGlobalCell {
  return {
    kind: "invalid",
    rawText,
    error: createGlobalParseError(code, charIndex, message),
  };
}

/**
 * 전역 셀 parser 오류 객체를 생성한다.
 * - 인수 : code : 전역 셀 parser 오류 코드
 * - 인수 : charIndex : 오류 위치. 특정하기 어려우면 null
 * - 인수 : message : 사람이 읽는 보조 오류 메시지
 * - 반환값 : GlobalParseError : 전역 셀 parser 오류 객체
 */
function createGlobalParseError(
  code: GlobalParseErrorCode,
  charIndex: number | null,
  message: string,
): GlobalParseError {
  return {
    code,
    charIndex,
    message,
  };
}

/**
 * 숫자 파싱 성공 또는 실패 결과.
 * - 정상 파싱 시 : number 값
 * - 비정상 파싱 시 : 오류 위치
 */
type NumberParseResult =
  | {
      ok: true;
      value: number;
    }
  | {
      ok: false;
      charIndex: number;
    };
