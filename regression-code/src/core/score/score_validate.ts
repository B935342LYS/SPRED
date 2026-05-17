/**
 * src\core\score\score_validate.ts
 * JSON 파싱이 끝난 값을 ScoreFile로 사용할 수 있는지 최소 검증한다.
 * 이 파일은 1단계 구현 안정화를 위한 구조/참조 무결성 검증을 담당한다.
 */

import type {
  GlobalCell,
  GlobalKind,
  RowDefinition,
  RowId,
  ScoreCell,
  ScoreFile,
  TrackId,
} from "./types";

/**
 * ScoreFile 검증 실패를 구분하는 오류 코드.
 * - invalid_shape : 필드 타입이나 지원 범위가 맞지 않음
 * - duplicate_* : 고유해야 하는 ID 또는 좌표가 중복됨
 * - unknown_row_id : 셀이 존재하지 않는 rowId를 참조함
 * - missing_global_start_cell : 필수 전역 시작 셀이 없음
 */
export type ScoreValidationErrorCode =
  | "invalid_shape"
  | "missing_required_field"
  | "duplicate_string_id"
  | "duplicate_row_id"
  | "duplicate_track_id"
  | "duplicate_track_cell_coord"
  | "duplicate_global_cell_coord"
  | "unknown_row_id"
  | "invalid_cell_row_type"
  | "invalid_global_row_type"
  | "col_out_of_range"
  | "missing_global_start_cell";

/**
 * ScoreFile 구조 또는 참조 무결성 검증 실패 정보.
 * - code : 오류 분류 코드
 * - message : 사용자 또는 개발자에게 전달할 오류 설명
 * - path : 오류가 발견된 ScoreFile 내부 위치
 */
export type ScoreValidationError ={
  code: ScoreValidationErrorCode;
  message: string;
  path?: string;
};

/**
 * ScoreFile 검증 결과.
 * - 정상 검증 시 : ScoreFile
 * - 비정상 검증 시 : ScoreValidationError
 */
export type ScoreValidationResult =
  | {
      ok: true;
      score: ScoreFile;
    }
  | {
      ok: false;
      error: ScoreValidationError;
    };

const TRACK_IDS: TrackId[] = ["basic", "optional", "extra"];
const GLOBAL_KINDS: GlobalKind[] = [
  "bpm",
  "beatsPerBar",
  "stepsPerBeat",
  "dynamics",
];

/**
 * ScoreFile의 최소 구조와 핵심 참조 무결성을 검증한다.
 * - 인수 : value : 이전 모듈에서 건네준 JSON 파싱 성공 객체의 value 필드값.
 * - 반환값 : ScoreValidationResult : 검증 성공 또는 실패 반환 객체.
 */
export function validateScoreFile(value: unknown): ScoreValidationResult
{
  // score 후보 객체 여부 확인
  if (!isRecord(value)) {
    return {
      ok: false,
      error: invalidShape("Score root must be an object."),
    };
  }

  // 타입 단언 + Partial<type> : value를 불완전할 수 있는 ScoreFile로 해석
  const score = value as Partial<ScoreFile>;

  // 최상위 필드 누락 검사
  const requiredFieldError = validateRequiredTopLevelFields(score);
  if (requiredFieldError) {
    return { ok: false, error: requiredFieldError };
  }

  // 주요 필드의 기본 자료형 검사
  const shapeError = validateBasicShapes(score);
  if (shapeError) {
    return { ok: false, error: shapeError };
  }

  // 위 shape 검사를 통과한 뒤에만 후속 참조 검증을 위해 ScoreFile로 단언한다.
  const scoreFile = score as ScoreFile;

  const stringIdError = validateUniqueStringIds(scoreFile);
  if (stringIdError) {
    return { ok: false, error: stringIdError };
  }

  const rowValidation = validateRows(scoreFile.layout.rowDefinitions);
  if (!rowValidation.ok) {
    return { ok: false, error: rowValidation.error };
  }

  const trackIdError = validateTrackIds(scoreFile);
  if (trackIdError) {
    return { ok: false, error: trackIdError };
  }

  const globalCellError = validateGlobalCells(scoreFile, rowValidation.rowById);
  if (globalCellError) {
    return { ok: false, error: globalCellError };
  }

  const trackCellError = validateTrackCells(scoreFile, rowValidation.rowById);
  if (trackCellError) {
    return { ok: false, error: trackCellError };
  }

  const globalStartError = validateGlobalStartCells(
    scoreFile,
    rowValidation.rowById,
  );
  if (globalStartError) {
    return { ok: false, error: globalStartError };
  }

  return {
    ok: true,
    score: scoreFile,
  };
}

/**
 * ScoreFile 최상위 필수 필드가 모두 존재하는지 확인한다.
 * - 인수 : score : 일반 객체로 확인된 ScoreFile 후보 객체
 * - 반환값 : ScoreValidationError | null : 누락 필드 오류 또는 통과 결과
 */
function validateRequiredTopLevelFields(score: Partial<ScoreFile>, ): ScoreValidationError | null
{
  const requiredFields: (keyof ScoreFile)[] = [
    "format",
    "musicData",
    "instData",
    "layout",
    "globalLines",
    "tracks",
  ];

  for (const field of requiredFields) {
    if (!(field in score)) {
      return {
        code: "missing_required_field",
        message: `Missing required field: ${field}.`,
        path: field,
      };
    }
  }

  return null;
}

/**
 * 후속 검증에서 직접 접근하는 주요 필드의 기본 형태를 확인한다.
 * - 인수 : score : 필수 최상위 필드 존재 확인을 통과한 ScoreFile 후보 객체
 * - 반환값 : ScoreValidationError | null : 필드 형태 오류 또는 통과 결과
 */
function validateBasicShapes(score: Partial<ScoreFile>,): ScoreValidationError | null
{
  if (!isRecord(score.format)) {
    return invalidShape("format must be an object.", "format");
  }

  if (!isRecord(score.musicData)) {
    return invalidShape("musicData must be an object.", "musicData");
  }

  if (!isRecord(score.instData)) {
    return invalidShape("instData must be an object.", "instData");
  }

  if (!Array.isArray(score.instData.strings)) {
    return invalidShape("instData.strings must be an array.", "instData.strings");
  }

  if (!isRecord(score.layout)) {
    return invalidShape("layout must be an object.", "layout");
  }

  if (!Array.isArray(score.layout.rowDefinitions)) {
    return invalidShape(
      "layout.rowDefinitions must be an array.",
      "layout.rowDefinitions",
    );
  }

  if (!isRecord(score.globalLines)) {
    return invalidShape("globalLines must be an object.", "globalLines");
  }

  if (!Number.isInteger(score.globalLines.columnCount)) {
    return invalidShape(
      "globalLines.columnCount must be an integer.",
      "globalLines.columnCount",
    );
  }

  if (!Array.isArray(score.globalLines.cells)) {
    return invalidShape(
      "globalLines.cells must be an array.",
      "globalLines.cells",
    );
  }

  if (!Array.isArray(score.tracks)) {
    return invalidShape("tracks must be an array.", "tracks");
  }

  return null;
}

/**
 * 악기 현 정의의 stringId 중복 여부를 확인한다.
 * - 인수 : score : 기본 형태 검증을 통과한 ScoreFile
 * - 반환값 : ScoreValidationError | null : stringId 중복 오류 또는 통과 결과
 */
function validateUniqueStringIds(score: ScoreFile): ScoreValidationError | null {
  const stringIds = new Set<string>();

  for (const stringInfo of score.instData.strings) {
    if (stringIds.has(stringInfo.stringId)) {
      return {
        code: "duplicate_string_id",
        message: `Duplicate stringId: ${stringInfo.stringId}.`,
        path: "instData.strings",
      };
    }

    stringIds.add(stringInfo.stringId);
  }

  return null;
}

/**
 * rowId 중복 여부를 확인하고 rowId 기반 조회 Map을 생성한다.
 * - 인수 : rows : layout.rowDefinitions 배열
 * - 반환값 : 검증 성공 시 rowById Map, 실패 시 ScoreValidationError
 */
function validateRows(
  rows: RowDefinition[],
):
  | {
      ok: true;
      rowById: Map<RowId, RowDefinition>;
    }
  | {
      ok: false;
      error: ScoreValidationError;
    } {
  const rowById = new Map<RowId, RowDefinition>();

  for (const row of rows) {
    if (rowById.has(row.rowId)) {
      return {
        ok: false,
        error: {
          code: "duplicate_row_id",
          message: `Duplicate rowId: ${row.rowId}.`,
          path: "layout.rowDefinitions",
        },
      };
    }

    rowById.set(row.rowId, row);
  }

  return {
    ok: true,
    rowById,
  };
}

/**
 * tracks 배열의 trackId가 지원 범위 안에 있고 중복되지 않는지 확인한다.
 * - 인수 : score : 기본 형태 검증을 통과한 ScoreFile
 * - 반환값 : ScoreValidationError | null : trackId 오류 또는 통과 결과
 */
function validateTrackIds(score: ScoreFile): ScoreValidationError | null {
  const trackIds = new Set<TrackId>();

  for (const track of score.tracks) {
    if (!TRACK_IDS.includes(track.trackId)) {
      return {
        code: "invalid_shape",
        message: `Unsupported trackId: ${track.trackId}.`,
        path: "tracks",
      };
    }

    if (trackIds.has(track.trackId)) {
      return {
        code: "duplicate_track_id",
        message: `Duplicate trackId: ${track.trackId}.`,
        path: "tracks",
      };
    }

    trackIds.add(track.trackId);
  }

  return null;
}

/**
 * 전역 셀의 rowId 참조, row 타입, 열 범위, 좌표 중복을 확인한다.
 * - 인수 : score : 기본 형태 검증을 통과한 ScoreFile
 * - 인수 : rowById : validateRows()에서 생성한 rowId 조회 Map
 * - 반환값 : ScoreValidationError | null : 전역 셀 오류 또는 통과 결과
 */
function validateGlobalCells(
  score: ScoreFile,
  rowById: Map<RowId, RowDefinition>,
): ScoreValidationError | null {
  const coords = new Set<string>();
  const columnCount = score.globalLines.columnCount;

  for (const cell of score.globalLines.cells) {
    const row = rowById.get(cell.rowId);
    if (!row) {
      return unknownRowId(cell.rowId, "globalLines.cells");
    }

    // globalLines.cells는 전역 상태 행에만 붙을 수 있으므로 note/gap row 참조를 차단한다.
    if (row.type !== "global") {
      return {
        code: "invalid_global_row_type",
        message: `Global cell rowId must refer to a global row: ${cell.rowId}.`,
        path: "globalLines.cells",
      };
    }

    const colError = validateCellCol(cell, columnCount, "globalLines.cells");
    if (colError) {
      return colError;
    }

    // 같은 전역 행과 같은 열에는 하나의 전역 셀만 존재할 수 있다.
    const coordKey = `${cell.rowId}|${cell.col}`;
    if (coords.has(coordKey)) {
      return {
        code: "duplicate_global_cell_coord",
        message: `Duplicate global cell coordinate: ${coordKey}.`,
        path: "globalLines.cells",
      };
    }

    coords.add(coordKey);
  }

  return null;
}

/**
 * 트랙 셀의 rowId 참조, gap row 참조 금지, 열 범위, 좌표 중복을 확인한다.
 * - 인수 : score : 기본 형태 검증을 통과한 ScoreFile
 * - 인수 : rowById : validateRows()에서 생성한 rowId 조회 Map
 * - 반환값 : ScoreValidationError | null : 트랙 셀 오류 또는 통과 결과
 */
function validateTrackCells(
  score: ScoreFile,
  rowById: Map<RowId, RowDefinition>,
): ScoreValidationError | null {
  const columnCount = score.globalLines.columnCount;

  for (const track of score.tracks) {
    const coords = new Set<string>();

    for (const cell of track.cells) {
      const row = rowById.get(cell.rowId);
      if (!row) {
        return unknownRowId(cell.rowId, `tracks.${track.trackId}.cells`);
      }

      // gap row는 화면 간격 표현용 행이므로 실제 입력 셀이 붙을 수 없다.
      if (row.type === "gap") {
        return {
          code: "invalid_cell_row_type",
          message: `Track cell rowId must not refer to a gap row: ${cell.rowId}.`,
          path: `tracks.${track.trackId}.cells`,
        };
      }

      const colError = validateCellCol(
        cell,
        columnCount,
        `tracks.${track.trackId}.cells`,
      );
      if (colError) {
        return colError;
      }

      // 좌표 중복은 트랙별로 검사한다. 서로 다른 트랙의 같은 좌표 입력은 허용된다.
      const coordKey = `${cell.rowId}|${cell.col}`;
      if (coords.has(coordKey)) {
        return {
          code: "duplicate_track_cell_coord",
          message: `Duplicate track cell coordinate in ${track.trackId}: ${coordKey}.`,
          path: `tracks.${track.trackId}.cells`,
        };
      }

      coords.add(coordKey);
    }
  }

  return null;
}

/**
 * 필수 전역 종류가 col 0에 시작 셀을 가지고 있는지 확인한다.
 * - 인수 : score : 기본 형태 검증을 통과한 ScoreFile
 * - 인수 : rowById : validateRows()에서 생성한 rowId 조회 Map
 * - 반환값 : ScoreValidationError | null : 전역 시작 셀 누락 오류 또는 통과 결과
 */
function validateGlobalStartCells(
  score: ScoreFile,
  rowById: Map<RowId, RowDefinition>,
): ScoreValidationError | null {
  const startKinds = new Set<GlobalKind>();

  for (const cell of score.globalLines.cells) {
    // 시작 시점의 기본 전역 상태만 확인하므로 col 0 셀만 수집한다.
    if (cell.col !== 0) {
      continue;
    }

    const row = rowById.get(cell.rowId);
    if (row?.type === "global") {
      startKinds.add(row.kind);
    }
  }

  for (const kind of GLOBAL_KINDS) {
    if (!startKinds.has(kind)) {
      return {
        code: "missing_global_start_cell",
        message: `Missing global ${kind} start cell at col 0.`,
        path: "globalLines.cells",
      };
    }
  }

  return null;
}

/**
 * 셀의 열 좌표가 정수이며 악보 열 범위 안에 있는지 확인한다.
 * - 인수 : cell : 열 좌표를 가진 ScoreCell 또는 GlobalCell
 * - 인수 : columnCount : 악보 전체 열 개수
 * - 인수 : path : 오류가 발생한 ScoreFile 내부 위치
 * - 반환값 : ScoreValidationError | null : 열 범위 오류 또는 통과 결과
 */
function validateCellCol(
  cell: ScoreCell | GlobalCell,
  columnCount: number,
  path: string,
): ScoreValidationError | null {
  if (
    !Number.isInteger(cell.col) ||
    cell.col < 0 ||
    cell.col >= columnCount
  ) {
    return {
      code: "col_out_of_range",
      message: `Cell col out of range: ${cell.col}.`,
      path,
    };
  }

  return null;
}

/**
 * 존재하지 않는 rowId 참조 오류 객체를 생성한다.
 * - 인수 : rowId : 셀이 참조했지만 layout.rowDefinitions에 없는 rowId
 * - 인수 : path : 오류가 발생한 ScoreFile 내부 위치
 * - 반환값 : ScoreValidationError : unknown_row_id 오류 객체
 */
function unknownRowId(rowId: RowId, path: string): ScoreValidationError {
  return {
    code: "unknown_row_id",
    message: `Unknown rowId: ${rowId}.`,
    path,
  };
}

/**
 * 필드 형식이 맞지 않는 경우 ScoreValidationError 객체를 생성한다.
 * - 인수 : message : 사용자에게 보일 오류 메시지 문자열
 * - 인수 : path : 오류 발생 위치 문자열. 생략 가능
 * - 반환값 : ScoreValidationError : invalid_shape 오류 객체
 */
function invalidShape(message: string, path?: string): ScoreValidationError {
  return {
    code: "invalid_shape",
    message,
    path,
  };
}

/**
 * 입력값이 ScoreFile 후보로 다룰 수 있는 일반 객체인지 확인한다.
 * - 인수 : value : JSON 파싱 이후의 unknown 값
 * - 반환값 : value is Record<string, unknown> : null과 배열을 제외한 object 여부
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  // typeof null도 object로 평가되며, 배열도 object의 일종이므로 둘 다 명시적으로 제외한다.
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
