import type {
  CellCoordKey,
  GlobalCell,
  GlobalCellCoordKey,
  GlobalKind,
  NoteRowDefinition,
  RowDefinition,
  RowId,
  ScoreCell,
  ScoreFile,
  ScoreIndexes,
  StringId,
  Track,
  TrackId,
} from "./types/index.ts";

function makeCellCoordKey(rowId: RowId, col: number): CellCoordKey {
  return `${rowId}|${col}`;
}

function makeGlobalCellCoordKey(
  rowId: RowId,
  col: number,
): GlobalCellCoordKey {
  return `${rowId}|${col}`;
}

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
  left: Pick<ScoreCell | GlobalCell, "col" | "rowId">,
  right: Pick<ScoreCell | GlobalCell, "col" | "rowId">,
): number {
  if (left.col !== right.col) {
    return left.col - right.col;
  }

  return left.rowId.localeCompare(right.rowId);
}

function buildRowIndexes(rowDefinitions: RowDefinition[]) {
  const rowById = new Map<RowId, RowDefinition>();
  const rowsInDisplayOrder = [...rowDefinitions];
  const noteRowIdsByStringId = new Map<StringId, RowId[]>();
  const noteRowIdByStringMidi = new Map<`${StringId}|${number}`, RowId>();

  for (const row of rowDefinitions) {
    rowById.set(row.rowId, row);

    if (row.type !== "note") {
      continue;
    }

    const noteRow = row as NoteRowDefinition;
    const rowIds = getOrCreateMapValue(
      noteRowIdsByStringId,
      noteRow.stringId,
      () => [],
    );
    rowIds.push(noteRow.rowId);
    noteRowIdByStringMidi.set(
      `${noteRow.stringId}|${noteRow.midi}`,
      noteRow.rowId,
    );
  }

  return {
    rowById,
    rowsInDisplayOrder,
    noteRowIdsByStringId,
    noteRowIdByStringMidi,
  };
}

function buildTrackIndexes(tracks: Track[]) {
  const trackById = new Map<TrackId, Track>();
  const cellMapByTrackId = new Map<TrackId, Map<CellCoordKey, ScoreCell>>();
  const cellsByTrackAndCol = new Map<TrackId, Map<number, ScoreCell[]>>();

  for (const track of tracks) {
    trackById.set(track.trackId, track);

    const cellMap = new Map<CellCoordKey, ScoreCell>();
    const cellsByCol = new Map<number, ScoreCell[]>();

    const sortedCells = [...track.cells].sort(compareCellsByColThenRowId);
    for (const cell of sortedCells) {
      cellMap.set(makeCellCoordKey(cell.rowId, cell.col), cell);
      const cells = getOrCreateMapValue(cellsByCol, cell.col, () => []);
      cells.push(cell);
    }

    cellMapByTrackId.set(track.trackId, cellMap);
    cellsByTrackAndCol.set(track.trackId, cellsByCol);
  }

  return {
    trackById,
    cellMapByTrackId,
    cellsByTrackAndCol,
  };
}

function buildGlobalIndexes(cells: GlobalCell[], rowById: Map<RowId, RowDefinition>) {
  const globalCellMapByCoord = new Map<GlobalCellCoordKey, GlobalCell>();
  const globalCellsByKindAndCol = new Map<GlobalKind, Map<number, GlobalCell>>();
  const globalCellsInColOrder = new Map<GlobalKind, GlobalCell[]>();

  const sortedCells = [...cells].sort(compareCellsByColThenRowId);
  for (const cell of sortedCells) {
    globalCellMapByCoord.set(makeGlobalCellCoordKey(cell.rowId, cell.col), cell);

    const row = rowById.get(cell.rowId);
    if (row?.type !== "global") {
      continue;
    }

    const cellsByCol = getOrCreateMapValue(
      globalCellsByKindAndCol,
      row.kind,
      () => new Map<number, GlobalCell>(),
    );
    cellsByCol.set(cell.col, cell);

    const cellsInOrder = getOrCreateMapValue(
      globalCellsInColOrder,
      row.kind,
      () => [],
    );
    cellsInOrder.push(cell);
  }

  return {
    globalCellMapByCoord,
    globalCellsByKindAndCol,
    globalCellsInColOrder,
  };
}

export function buildScoreIndexes(score: ScoreFile): ScoreIndexes {
  const rowIndexes = buildRowIndexes(score.layout.rowDefinitions);
  const trackIndexes = buildTrackIndexes(score.tracks);
  const globalIndexes = buildGlobalIndexes(
    score.globalLines.cells,
    rowIndexes.rowById,
  );

  return {
    ...rowIndexes,
    ...trackIndexes,
    ...globalIndexes,
  };
}
