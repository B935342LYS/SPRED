/**
 * src/core/analyze/analyze_track.ts
 * MVP 범위의 track note event 분석을 수행한다.
 * 현재 구현은 modifier 없는 일반 note와 "-" hold 병합만 처리한다.
 */

import type {
  NoteRowDefinition,
  RowDefinition,
  TrackId,
} from "../score/types";
import type { ParsedCellEntry, ParsedNoteCell } from "../parse/types";
import type {
  AnalyzeContext,
  AnalyzeTrackEventsFn,
  AnalyzeTrackRange,
  AnalyzedTrackResult,
  NoteEvent,
  SourceCellRef,
  TimeFraction,
  TimeRange,
} from "./types";

/**
 * 한 track 내부의 MVP note event를 분석한다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : context : score/index/parsed 문맥
 * - 인수 : range : 후속 partial analysis용 범위. 현재 MVP에서는 범위가 없을 때 full 분석한다.
 * - 반환값 : AnalyzedTrackResult : track 내부 note event 목록
 */
export const analyzeTrackEvents: AnalyzeTrackEventsFn = (
  trackId: TrackId,
  context: AnalyzeContext,
  range?: AnalyzeTrackRange,
): AnalyzedTrackResult => {
  const cellsByCol =
    context.parsed.noteCellsByTrackAndCol.get(trackId) ?? new Map();
  const sortedEntries = getSortedTrackEntries(cellsByCol, range);
  const events: NoteEvent[] = [];

  for (const entry of sortedEntries) {
    const event = analyzeParsedNoteEntry(trackId, context, entry, events);

    if (event !== null) {
      events.push(event);
    }
  }

  return {
    trackId,
    events,
  };
};

/**
 * track의 parsed cell entry를 col, rowId 순서로 정렬해 반환한다.
 * - 인수 : cellsByCol : col별 parsed cell entry map
 * - 인수 : range : 선택적 분석 범위
 * - 반환값 : ParsedCellEntry[] : 안정적인 분석 순서의 entry 목록
 */
function getSortedTrackEntries(
  cellsByCol: Map<number, ParsedCellEntry[]>,
  range?: AnalyzeTrackRange,
): ParsedCellEntry[] {
  const entries: ParsedCellEntry[] = [];

  for (const [col, colEntries] of cellsByCol) {
    if (range !== undefined && (col < range.colStart || col > range.colEnd)) {
      continue;
    }

    entries.push(...colEntries);
  }

  return entries.sort((left, right) => {
    if (left.col !== right.col) {
      return left.col - right.col;
    }

    return left.rowId.localeCompare(right.rowId);
  });
}

/**
 * 단일 parsed note entry를 MVP NoteEvent로 변환하거나 기존 이벤트에 hold로 병합한다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : context : score/index/parsed 문맥
 * - 인수 : entry : 문서 위치가 붙은 parsed cell
 * - 인수 : events : 현재까지 생성된 note event 목록
 * - 반환값 : 새로 생성된 NoteEvent 또는 병합/제외 시 null
 */
function analyzeParsedNoteEntry(
  trackId: TrackId,
  context: AnalyzeContext,
  entry: ParsedCellEntry,
  events: NoteEvent[],
): NoteEvent | null {
  const parsedCell = entry.parsedCell;

  if (parsedCell.kind !== "note" || !isMvpNoteCell(parsedCell)) {
    return null;
  }

  const row = asNoteRow(context.indexes.rowById.get(entry.rowId));

  if (row === null) {
    return null;
  }

  const sourceCell = createSourceCellRef(entry);

  if (parsedCell.hold === "-") {
    const previousEvent = findConnectablePreviousEvent(
      events,
      entry.col,
      row,
    );

    if (previousEvent !== null) {
      previousEvent.time.endTick = integerTick(entry.col + 1);
      previousEvent.sourceCells.push(sourceCell);
      previousEvent.effects = [createDefaultEffectSegment(previousEvent.time)];
      return null;
    }
  }

  const time = createIntegerTimeRange(entry.col, entry.col + 1);

  return {
    eventKind: "note",
    eventId: createNoteEventId(trackId, sourceCell),
    trackId,
    time,
    sourceCells: [sourceCell],
    display: {
      rowId: row.rowId,
      centOffset: 0,
    },
    sound: {
      midi: row.midi,
      centOffset: 0,
    },
    effects: [createDefaultEffectSegment(time)],
    glissRole: null,
    tuplet: null,
  };
}

/**
 * 현재 MVP analyzer가 소비할 수 있는 일반 note 셀인지 확인한다.
 * - 인수 : parsedCell : parser가 만든 일반 note 셀
 * - 반환값 : boolean : modifier 없는 default note 또는 "-" hold 여부
 */
function isMvpNoteCell(parsedCell: ParsedNoteCell): boolean {
  if (parsedCell.hold !== null && parsedCell.hold !== "-") {
    return false;
  }

  return (
    parsedCell.modifiers.gliss === null &&
    parsedCell.modifiers.trem === null &&
    parsedCell.modifiers.absolutePitch === null &&
    parsedCell.modifiers.microPitch === null
  );
}

/**
 * 바로 왼쪽 tick에 끝나고 표시/발음 위치가 같은 기존 NoteEvent를 찾는다.
 * - 인수 : events : 현재까지 생성된 note event 목록
 * - 인수 : col : 현재 셀 col
 * - 인수 : row : 현재 셀의 note row definition
 * - 반환값 : 연결 가능한 이전 NoteEvent 또는 null
 */
function findConnectablePreviousEvent(
  events: NoteEvent[],
  col: number,
  row: NoteRowDefinition,
): NoteEvent | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];

    if (
      event !== undefined &&
      fractionToNumber(event.time.endTick) === col &&
      event.display.rowId === row.rowId &&
      event.display.centOffset === 0 &&
      event.sound.midi === row.midi &&
      event.sound.centOffset === 0
    ) {
      return event;
    }
  }

  return null;
}

/**
 * RowDefinition을 note row로 좁힌다.
 * - 인수 : row : rowById에서 조회한 행 후보
 * - 반환값 : NoteRowDefinition | null : note row이면 해당 행, 아니면 null
 */
function asNoteRow(row: RowDefinition | undefined): NoteRowDefinition | null {
  if (row?.type === "note") {
    return row;
  }

  return null;
}

/**
 * ParsedCellEntry에서 SourceCellRef를 만든다.
 * - 인수 : entry : 문서 위치가 붙은 parsed cell
 * - 반환값 : SourceCellRef : analyzer event 원인 셀 참조
 */
function createSourceCellRef(entry: ParsedCellEntry): SourceCellRef {
  return {
    rowId: entry.rowId,
    col: entry.col,
  };
}

/**
 * 정수 tick을 TimeFraction으로 만든다.
 * - 인수 : tick : 정수 tick 값
 * - 반환값 : TimeFraction : denominator 1의 시간 값
 */
function integerTick(tick: number): TimeFraction {
  return {
    numerator: tick,
    denominator: 1,
  };
}

/**
 * 정수 시작/끝 tick으로 TimeRange를 만든다.
 * - 인수 : startTick : 시작 tick
 * - 인수 : endTick : 배타적 끝 tick
 * - 반환값 : TimeRange : denominator 1의 시간 범위
 */
function createIntegerTimeRange(startTick: number, endTick: number): TimeRange {
  return {
    startTick: integerTick(startTick),
    endTick: integerTick(endTick),
  };
}

/**
 * TimeFraction을 MVP 비교용 number로 변환한다.
 * - 인수 : value : 비교할 시간 분수
 * - 반환값 : number : numerator / denominator
 */
function fractionToNumber(value: TimeFraction): number {
  return value.numerator / value.denominator;
}

/**
 * note 전체 구간에 적용되는 기본 effect segment를 만든다.
 * - 인수 : time : note event 시간 범위
 * - 반환값 : vib/trem이 없는 effect segment
 */
function createDefaultEffectSegment(time: TimeRange) {
  return {
    time: {
      startTick: { ...time.startTick },
      endTick: { ...time.endTick },
    },
    vib: false,
    trem: null,
  };
}

/**
 * 첫 source cell 기준으로 안정적인 note event id를 만든다.
 * - 인수 : trackId : 이벤트가 속한 track
 * - 인수 : sourceCell : 이벤트 시작 원인 셀
 * - 반환값 : string : MVP note event id
 */
function createNoteEventId(trackId: TrackId, sourceCell: SourceCellRef): string {
  return `${trackId}:note:${sourceCell.rowId}:${sourceCell.col}`;
}
