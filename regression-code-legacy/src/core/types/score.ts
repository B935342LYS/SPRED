export type TrackId = "basic" | "optional" | "extra";

export type GlobalKind =
  | "bpm"
  | "beatsPerBar"
  | "stepsPerBeat"
  | "dynamics";

export type RowId = string;
export type StringId = string;
export type CellCoordKey = `${RowId}|${number}`;
export type GlobalCellCoordKey = `${RowId}|${number}`;
export type ParsedCellCacheKey = `${TrackId}|${RowId}|${number}`;
export type ParsedGlobalCellCacheKey = `${RowId}|${number}`;

export type ScoreFormat = {
  formatName: string;
  version: string;
};

export type YoutubeSync = {
  videoId: string;
  offsetMs: number;
};

export type ScoreDifficulty = Partial<Record<TrackId, number>>;

export type MusicData = {
  musicTitle: string;
  musicArtist: string;
  musicGenre: string;
  scoreWriter: string;
  comment: string;
  scoreDifficulty: ScoreDifficulty;
  createdAt: string;
  updatedAt: string;
  youtube: YoutubeSync;
};

export type InstrumentString = {
  stringId: StringId;
  stringName: string;
  openMidi?: number;
  minMidi: number;
  maxMidi: number;
};

export type InstrumentData = {
  presetId?: string;
  family: string;
  instName: string;
  supportsOpen: boolean;
  strings: InstrumentString[];
};

export type GlobalCell = {
  rowId: RowId;
  col: number;
  rawText: string;
};

export type GlobalLines = {
  columnCount: number;
  cells: GlobalCell[];
};

export type GlobalRowDefinition = {
  rowId: RowId;
  type: "global";
  kind: GlobalKind;
  height: number;
};

export type NoteRowDefinition = {
  rowId: RowId;
  type: "note";
  stringId: StringId;
  midi: number;
  height: number;
  displayLabel: string;
};

export type GapRowDefinition = {
  rowId: RowId;
  type: "gap";
  stringId: StringId;
  fromMidi: number;
  toMidi: number;
  height: number;
};

export type RowDefinition =
  | GlobalRowDefinition
  | NoteRowDefinition
  | GapRowDefinition;

export type LayoutData = {
  baseColumnWidthPx: number;
  rowDefinitions: RowDefinition[];
};

export type ScoreCell = {
  rowId: RowId;
  col: number;
  rawText: string;
};

export type Track = {
  trackId: TrackId;
  trackName: string;
  cells: ScoreCell[];
};

export type ScoreFile = {
  format: ScoreFormat;
  musicData: MusicData;
  instData: InstrumentData;
  globalLines: GlobalLines;
  layout: LayoutData;
  tracks: Track[];
};

export type ScoreIndexes = {
  rowById: Map<RowId, RowDefinition>;
  rowsInDisplayOrder: RowDefinition[];
  noteRowIdsByStringId: Map<StringId, RowId[]>;
  noteRowIdByStringMidi: Map<`${StringId}|${number}`, RowId>;
  trackById: Map<TrackId, Track>;
  cellMapByTrackId: Map<TrackId, Map<CellCoordKey, ScoreCell>>;
  cellsByTrackAndCol: Map<TrackId, Map<number, ScoreCell[]>>;
  globalCellMapByCoord: Map<GlobalCellCoordKey, GlobalCell>;
  globalCellsByKindAndCol: Map<GlobalKind, Map<number, GlobalCell>>;
  globalCellsInColOrder: Map<GlobalKind, GlobalCell[]>;
};

export type RuntimeDocument = {
  score: ScoreFile;
  indexes: ScoreIndexes;
};
