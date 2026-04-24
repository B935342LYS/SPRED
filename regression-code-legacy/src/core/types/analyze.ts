import type { CentValue } from "./cent.ts";
import type { GlobalKind, RowId, TrackId } from "./score.ts";
import type { ParsedCell, ParsedGlobalCell } from "./parse.ts";

export type TimeFraction = {
  numerator: number;
  denominator: number;
};

export type TimeRange = {
  startTick: TimeFraction;
  endTick: TimeFraction;
};

export type SourceCellRef = {
  rowId: RowId;
  col: number;
  slotIndex?: number;
};

export type FinalDisplayPosition = {
  rowId: RowId;
  midiNum: number;
  centOffset: CentValue;
};

export type FinalSoundPitch = {
  midiNum: number;
  centOffset: CentValue;
};

export type AnalyzerNoteCellInput = {
  trackId: TrackId;
  rowId: RowId;
  col: number;
  parsedCell: ParsedCell;
};

export type AnalyzerGlobalCellInput = {
  rowId: RowId;
  kind: GlobalKind;
  col: number;
  parsedCell: ParsedGlobalCell;
};

export type AnalyzedIssueCode =
  | "invalid_tuplet_position"
  | "gliss_unresolved"
  | "hold_unresolved"
  | "global_segment_unresolved"
  | "invalid_absolute_pitch"
  | "invalid_global_transition";

export type AnalyzedIssue = {
  level: "warning" | "error";
  code: AnalyzedIssueCode;
  message: string;
  trackId?: TrackId | null;
  sourceCells: SourceCellRef[];
};

export type AnalyzedEventKind =
  | "note"
  | "rest"
  | "mute"
  | "gliss"
  | "tupletGroup";

export type AnalyzedEventBase = {
  eventKind: AnalyzedEventKind;
  trackId: TrackId;
  time: TimeRange;
  sourceCells: SourceCellRef[];
};

export type TremInfo = {
  division: number;
};

export type NoteEffectSegment = {
  time: TimeRange;
  vib: boolean;
  trem?: TremInfo | null;
};

export type GlissAnchorRole = {
  glissId: string;
  role: "start" | "mid" | "end";
};

export type NoteEvent = AnalyzedEventBase & {
  eventKind: "note";
  display: FinalDisplayPosition;
  sound: FinalSoundPitch;
  effects: NoteEffectSegment[];
  glissRole?: GlissAnchorRole | null;
  tuplet?: {
    groupId: string;
    slotIndex: number;
    divNum: number;
  } | null;
};

export type RestEvent = AnalyzedEventBase & {
  eventKind: "rest";
  display?: FinalDisplayPosition | null;
};

export type MuteEvent = AnalyzedEventBase & {
  eventKind: "mute";
  display: FinalDisplayPosition;
  text: string;
};

export type GlissEvent = AnalyzedEventBase & {
  eventKind: "gliss";
  startDisplay: FinalDisplayPosition;
  endDisplay: FinalDisplayPosition;
  startSound: FinalSoundPitch;
  endSound: FinalSoundPitch;
  glissId: string;
  fromKind: "start" | "mid";
  toKind: "mid" | "end";
  startAttach: "attack" | "legato";
  endAttach: "release" | "holdContinue";
};

export type TupletSlotInfo = {
  slotIndex: number;
  startTick: TimeFraction;
  endTick: TimeFraction;
  isRest: boolean;
};

export type TupletGroupEvent = AnalyzedEventBase & {
  eventKind: "tupletGroup";
  groupId: string;
  divNum: number;
  headCell: SourceCellRef;
  extendCells: SourceCellRef[];
  slots: TupletSlotInfo[];
};

export type AnalyzedEvent =
  | NoteEvent
  | RestEvent
  | MuteEvent
  | GlissEvent
  | TupletGroupEvent;

export type AnalyzedTrackResult = {
  trackId: TrackId;
  events: AnalyzedEvent[];
};

export type AnalyzedTimeSegment = {
  time: TimeRange;
  startBpm: number;
  endBpm: number;
  bpmCurve: "instant" | "linear";
  beatsPerBar: number;
  stepsPerBeat: number;
  sourceCells: SourceCellRef[];
};

export type AnalyzedDynamicsSegment = {
  time: TimeRange;
  startValue: number;
  endValue: number;
  curve: "instant" | "linear";
  sourceCells: SourceCellRef[];
};

export type AnalysisResult = {
  timingTimeline: AnalyzedTimeSegment[];
  dynamicsTimeline: AnalyzedDynamicsSegment[];
  trackResults: AnalyzedTrackResult[];
  analysisIssues: AnalyzedIssue[];
};

export type AnalyzeTrackRange = {
  colStart: number;
  colEnd: number;
};

export type AnalyzeGlobalRange = {
  kinds: GlobalKind[];
  colStart: number;
  colEnd: number;
};

export type AnalyzePartialRequest =
  | {
      scope: "track";
      trackId: TrackId;
      colStart: number;
      colEnd: number;
    }
  | {
      scope: "global";
      kind: GlobalKind;
      colStart: number;
      colEnd: number;
    };

export type AnalysisCache = {
  eventsByStartCol: Map<TrackId, Map<number, AnalyzedEvent[]>>;
  trackResultByTrackId: Map<TrackId, AnalyzedTrackResult>;
  tupletGroupById: Map<string, TupletGroupEvent>;
  glissEventsById: Map<string, GlissEvent[]>;
};
