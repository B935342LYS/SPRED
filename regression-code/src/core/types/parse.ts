import type { CentValue } from "./cent.ts";
import type { GlobalKind, RowDefinition, RowId, TrackId } from "./score.ts";

export type ParsedCellKind =
  | "mute"
  | "note"
  | "pletHead"
  | "pletExtend"
  | "invalid";

export type HoldKind = "-" | "~";

export type ParseErrorCode =
  | "empty_note"
  | "invalid_escape"
  | "unexpected_reserved_char"
  | "unknown_modifier"
  | "modifier_order"
  | "duplicate_modifier"
  | "unterminated_paren"
  | "missing_argument"
  | "invalid_number"
  | "invalid_gliss_kind"
  | "invalid_trem_division"
  | "invalid_midi_range"
  | "invalid_cent_range"
  | "invalid_tuplet_division"
  | "tuplet_slot_count_mismatch"
  | "tuplet_nested_forbidden"
  | "tuplet_position_required"
  | "vib_and_trem"
  | "more_than_expected";

export type ParseError = {
  code: ParseErrorCode;
  charIndex: number | null;
  message?: string;
};

export type ParsedGliss = {
  id: string;
  glissKind: "start" | "mid" | "end";
};

export type ParsedTrem = {
  divNum: 2 | 3 | 4;
};

export type ParsedAbsolutePitch = {
  midiNum: number;
};

export type ParsedMicroPitch = {
  centNum: CentValue;
};

export type ParsedTupletPosition = {
  midiNum: number;
};

export type ParsedModifiers = {
  gliss: ParsedGliss | null;
  trem: ParsedTrem | null;
  absolutePitch: ParsedAbsolutePitch | null;
  microPitch: ParsedMicroPitch | null;
};

export type ParsedCellBase = {
  kind: ParsedCellKind;
  rawText: string;
};

export type ParsedInvalidCell = ParsedCellBase & {
  kind: "invalid";
  error: ParseError;
};

export type ParsedMuteCell = ParsedCellBase & {
  kind: "mute";
  displayText: string;
};

export type ParsedNoteCell = ParsedCellBase & {
  kind: "note";
  hold: HoldKind | null;
  displayText: string;
  modifiers: ParsedModifiers;
};

export type ParsedPletSlotNote = {
  hold: HoldKind | null;
  displayText: string;
  modifiers: ParsedModifiers;
  position: ParsedTupletPosition;
};

export type ParsedPletSlot = {
  slotIndex: number;
  isRest: boolean;
  note: ParsedPletSlotNote | null;
};

export type ParsedPletHeadCell = ParsedCellBase & {
  kind: "pletHead";
  divNum: number;
  slots: ParsedPletSlot[];
};

export type ParsedPletExtendCell = ParsedCellBase & {
  kind: "pletExtend";
};

export type ParsedCell =
  | ParsedMuteCell
  | ParsedNoteCell
  | ParsedPletHeadCell
  | ParsedPletExtendCell
  | ParsedInvalidCell;

export type GlobalParseErrorCode =
  | "empty_global"
  | "invalid_number"
  | "invalid_ramp_token"
  | "more_than_expected"
  | "invalid_bpm_range"
  | "invalid_beats_per_bar_range"
  | "invalid_steps_per_beat_range"
  | "invalid_dynamics_range";

export type GlobalParseError = {
  code: GlobalParseErrorCode;
  charIndex: number | null;
  message?: string;
};

export type ParsedGlobalRamp = "none" | "start" | "end" | "endStart";

export type ParsedGlobalCellKind =
  | "linearGlobalValue"
  | "instantGlobalValue"
  | "invalid";

export type ParsedGlobalCellBase = {
  kind: ParsedGlobalCellKind;
  rawText: string;
};

export type ParsedGlobalInvalidCell = ParsedGlobalCellBase & {
  kind: "invalid";
  error: GlobalParseError;
};

export type ParsedLinearGlobalCell = ParsedGlobalCellBase & {
  kind: "linearGlobalValue";
  globalKind: "bpm" | "dynamics";
  value: number;
  ramp: ParsedGlobalRamp;
};

export type ParsedInstantGlobalCell = ParsedGlobalCellBase & {
  kind: "instantGlobalValue";
  globalKind: "beatsPerBar" | "stepsPerBeat";
  value: number;
};

export type ParsedGlobalCell =
  | ParsedLinearGlobalCell
  | ParsedInstantGlobalCell
  | ParsedGlobalInvalidCell;

export type ParsePartResult<T> =
  | {
      ok: true;
      value: T;
      nextIndex: number;
    }
  | {
      ok: false;
      error: ParseError;
    };

export type NoteCellParserInput = {
  trackId: TrackId;
  rowId: RowId;
  col: number;
  rawText: string;
};

export type GlobalCellParserInput = {
  rowId: RowId;
  col: number;
  rawText: string;
};

export type GlobalCellParserContext = {
  rowById: Map<RowId, RowDefinition>;
};

export type ParsedCellEntry = {
  trackId: TrackId;
  rowId: RowId;
  col: number;
  parsedCell: ParsedCell;
};

export type ParsedGlobalCellEntry = {
  rowId: RowId;
  kind: GlobalKind;
  col: number;
  parsedCell: ParsedGlobalCell;
};

export type ParsedScoreDocument = {
  noteCellsByTrackAndCol: Map<TrackId, Map<number, ParsedCellEntry[]>>;
  globalCellsByKindAndCol: Map<GlobalKind, Map<number, ParsedGlobalCellEntry>>;
};

export type ParseRangeRequest =
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
