import { parseGlobalCell } from "./parse_global_cell.ts";
import { parseNoteCell } from "./parse_note_cell.ts";
import type {
  GlobalKind,
  ParseDocumentFn,
  ParsedCellEntry,
  ParsedScoreDocument,
  ParsedGlobalCellEntry,
  ScoreCell,
  TrackId,
} from "./types/index.ts";

function getOrCreateMapValue<K, V>(map: Map<K, V>, key: K, create: () => V): V {
  const existing = map.get(key);
  if (existing !== undefined) {
    return existing;
  }

  const created = create();
  map.set(key, created);
  return created;
}

function compareCellsByColThenRowId(
  left: Pick<ScoreCell, "col" | "rowId">,
  right: Pick<ScoreCell, "col" | "rowId">,
): number {
  if (left.col !== right.col) {
    return left.col - right.col;
  }

  return left.rowId.localeCompare(right.rowId);
}

export const parseDocument: ParseDocumentFn = (score, indexes) => {
  const noteCellsByTrackAndCol = new Map<TrackId, Map<number, ParsedCellEntry[]>>();
  const globalCellsByKindAndCol = new Map<
    GlobalKind,
    Map<number, ParsedGlobalCellEntry>
  >();

  for (const track of score.tracks) {
    const entriesByCol = new Map<number, ParsedCellEntry[]>();
    const sortedCells = [...track.cells].sort(compareCellsByColThenRowId);

    for (const cell of sortedCells) {
      const parsedCell = parseNoteCell({
        trackId: track.trackId,
        rowId: cell.rowId,
        col: cell.col,
        rawText: cell.rawText,
      });

      const entries = getOrCreateMapValue(entriesByCol, cell.col, () => []);
      entries.push({
        trackId: track.trackId,
        rowId: cell.rowId,
        col: cell.col,
        parsedCell,
      });
    }

    noteCellsByTrackAndCol.set(track.trackId, entriesByCol);
  }

  for (const cell of score.globalLines.cells) {
    const row = indexes.rowById.get(cell.rowId);
    if (row?.type !== "global") {
      continue;
    }

    const parsedCell = parseGlobalCell(
      {
        rowId: cell.rowId,
        col: cell.col,
        rawText: cell.rawText,
      },
      {
        rowById: indexes.rowById,
      },
    );

    const entriesByCol = getOrCreateMapValue(
      globalCellsByKindAndCol,
      row.kind,
      () => new Map<number, ParsedGlobalCellEntry>(),
    );

    entriesByCol.set(cell.col, {
      rowId: cell.rowId,
      kind: row.kind,
      col: cell.col,
      parsedCell,
    });
  }

  return {
    noteCellsByTrackAndCol,
    globalCellsByKindAndCol,
  } satisfies ParsedScoreDocument;
};
