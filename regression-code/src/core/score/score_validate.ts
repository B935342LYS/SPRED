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

export type ScoreValidationError = {
  code: ScoreValidationErrorCode;
  message: string;
  path?: string;
};

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
 * note/global rawText 문법 검사는 parser 단계에서 처리한다.
 */
export function validateScoreFile(value: unknown): ScoreValidationResult {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: invalidShape("Score root must be an object."),
    };
  }

  const score = value as Partial<ScoreFile>;

  const requiredFieldError = validateRequiredTopLevelFields(score);
  if (requiredFieldError) {
    return { ok: false, error: requiredFieldError };
  }

  const shapeError = validateBasicShapes(score);
  if (shapeError) {
    return { ok: false, error: shapeError };
  }

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

function validateRequiredTopLevelFields(
  score: Partial<ScoreFile>,
): ScoreValidationError | null {
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

function validateBasicShapes(
  score: Partial<ScoreFile>,
): ScoreValidationError | null {
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

function validateGlobalStartCells(
  score: ScoreFile,
  rowById: Map<RowId, RowDefinition>,
): ScoreValidationError | null {
  const startKinds = new Set<GlobalKind>();

  for (const cell of score.globalLines.cells) {
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

function unknownRowId(rowId: RowId, path: string): ScoreValidationError {
  return {
    code: "unknown_row_id",
    message: `Unknown rowId: ${rowId}.`,
    path,
  };
}

function invalidShape(message: string, path?: string): ScoreValidationError {
  return {
    code: "invalid_shape",
    message,
    path,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
