/**
 * src/core/analyze/analyze_track.ts
 * track note event 분석을 수행한다.
 * 일반 note의 hold, absolutePitch, microPitch, vib, trem을 처리한다.
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
  FinalDisplayPosition,
  FinalSoundPitch,
  NoteEffectSegment,
  NoteEvent,
  NoteDisplayTextAnchor,
  SourceCellRef,
  TimeFraction,
  TimeRange,
} from "./types";

type HoldConnectionKey = string;

type ActiveNoteMap = Map<HoldConnectionKey, NoteEvent>;

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
  const activeNotesByConnectionKey: ActiveNoteMap = new Map();

  // 정렬된 parsed entry를 차례대로 분석하며 새 NoteEvent를 events 배열에 누적한다.
  for (const entry of sortedEntries) {
    const event = analyzeParsedNoteEntry(
      trackId,
      context,
      entry,
      activeNotesByConnectionKey,
    );

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

  // col별 Map에 들어 있는 parsed entry들을 하나의 배열로 모은다.
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
 * - 인수 : activeNotesByConnectionKey : hold 연결 기준별 마지막 note event map
 * - 반환값 : 새로 생성된 NoteEvent 또는 병합/제외 시 null
 */
function analyzeParsedNoteEntry(
  trackId: TrackId,
  context: AnalyzeContext,
  entry: ParsedCellEntry,
  activeNotesByConnectionKey: ActiveNoteMap,
): NoteEvent | null {
  const parsedCell = entry.parsedCell;

  if (parsedCell.kind !== "note" || !isAnalyzableNoteCell(parsedCell)) {
    return null;
  }

  const row = asNoteRow(context.indexes.rowById.get(entry.rowId));

  if (row === null) {
    return null;
  }

  const sourceCell = createSourceCellRef(entry);
  const display = createDisplayPosition(row, parsedCell);
  const sound = createSoundPitch(row, parsedCell);
  const connectionKey = createHoldConnectionKey(display, sound);

  // 현재 셀이 hold이면 바로 왼쪽에 이어 붙일 수 있는 기존 NoteEvent를 찾는다.
  if (parsedCell.hold !== null) {
    const previousEvent = findConnectablePreviousEvent(
      activeNotesByConnectionKey,
      entry.col,
      connectionKey,
    );

    if (previousEvent !== null) {
      // 연결 가능한 이벤트가 있으면 끝 tick과 source cell 목록을 확장하고 새 이벤트는 만들지 않는다.
      previousEvent.time.endTick = integerTick(entry.col + 1);
      previousEvent.sourceCells.push(sourceCell);
      previousEvent.displayTextAnchors.push(
        createNoteDisplayTextAnchor(entry, parsedCell),
      );
      previousEvent.effects.push(
        createEffectSegmentForCell(
          parsedCell,
          createIntegerTimeRange(entry.col, entry.col + 1),
          previousEvent,
        ),
      );
      activeNotesByConnectionKey.set(connectionKey, previousEvent);
      return null;
    }
  }

  const time = createIntegerTimeRange(entry.col, entry.col + 1);

  // hold 병합이 없으면 현재 셀의 rowId와 midi를 사용해 새 NoteEvent를 만든다.
  const event: NoteEvent = {
    eventKind: "note",
    eventId: createNoteEventId(trackId, sourceCell),
    text: parsedCell.displayText,
    displayTextAnchors: [createNoteDisplayTextAnchor(entry, parsedCell)],
    trackId,
    time,
    sourceCells: [sourceCell],
    display,
    sound,
    effects: [createEffectSegmentForCell(parsedCell, time, null)],
    glissRole: null,
    tuplet: null,
  };

  activeNotesByConnectionKey.set(connectionKey, event);
  return event;
}

/**
 * 현재 analyzer가 note event로 소비할 수 있는 일반 note 셀인지 확인한다.
 * - 인수 : parsedCell : parser가 만든 일반 note 셀
 * - 반환값 : boolean : gliss/tuplet을 제외한 note event 분석 가능 여부
 */
function isAnalyzableNoteCell(parsedCell: ParsedNoteCell): boolean {
  // gliss는 별도 GlissEvent 연결 단계에서 처리해야 하므로 이번 단계에서는 제외한다.
  return parsedCell.modifiers.gliss === null;
}

/**
 * 바로 왼쪽 tick에 끝나고 표시/발음 위치가 같은 기존 NoteEvent를 찾는다.
 * - 인수 : activeNotesByConnectionKey : hold 연결 기준별 마지막 note event map
 * - 인수 : col : 현재 셀 col
 * - 인수 : connectionKey : 현재 셀의 표시/발음 위치 기준 key
 * - 반환값 : 연결 가능한 이전 NoteEvent 또는 null
 */
function findConnectablePreviousEvent(
  activeNotesByConnectionKey: ActiveNoteMap,
  col: number,
  connectionKey: HoldConnectionKey,
): NoteEvent | null {
  const event = activeNotesByConnectionKey.get(connectionKey);

  // 같은 연결 key의 마지막 note가 현재 col 바로 앞에서 끝났는지 확인한다.
  if (event !== undefined && fractionToNumber(event.time.endTick) === col) {
    return event;
  }

  return null;
}

/**
 * note row에서 MVP 기본 표시 위치를 만든다.
 * - 인수 : row : 현재 셀의 note row definition
 * - 반환값 : FinalDisplayPosition : renderer가 사용할 의미적 표시 위치
 */
function createDisplayPosition(
  row: NoteRowDefinition,
  parsedCell: ParsedNoteCell,
): FinalDisplayPosition {
  return {
    rowId: row.rowId,
    centOffset: parsedCell.modifiers.microPitch?.centNum ?? 0,
  };
}

/**
 * note row와 pitch modifier에서 최종 발음 음정을 만든다.
 * - 인수 : row : 현재 셀의 note row definition
 * - 인수 : parsedCell : parser가 확정한 note 셀
 * - 반환값 : FinalSoundPitch : audio generator가 사용할 의미적 발음 음정
 */
function createSoundPitch(
  row: NoteRowDefinition,
  parsedCell: ParsedNoteCell,
): FinalSoundPitch {
  return {
    midi: parsedCell.modifiers.absolutePitch?.midiNum ?? row.midi,
    centOffset: parsedCell.modifiers.microPitch?.centNum ?? 0,
  };
}

/**
 * hold 연결 판정에 사용할 표시/발음 위치 key를 만든다.
 * - 인수 : display : 현재 셀의 최종 표시 위치
 * - 인수 : sound : 현재 셀의 최종 발음 음정
 * - 반환값 : HoldConnectionKey : active note map 조회 key
 */
function createHoldConnectionKey(
  display: FinalDisplayPosition,
  sound: FinalSoundPitch,
): HoldConnectionKey {
  // 표시 행/센트와 발음 midi/센트를 하나의 문자열로 묶어 hold 연결 후보를 조회한다.
  return [
    display.rowId,
    display.centOffset,
    sound.midi,
    sound.centOffset,
  ].join("|");
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
 * ParsedNoteCell의 displayText를 NoteEvent 내부 표시 anchor로 복사한다.
 * - 인수 : entry : 문서 위치가 붙은 parsed cell
 * - 인수 : parsedCell : parser가 확정한 note 셀 표시 정보
 * - 반환값 : NoteDisplayTextAnchor : note layer가 시간 위치별로 표시할 텍스트
 */
function createNoteDisplayTextAnchor(
  entry: ParsedCellEntry,
  parsedCell: ParsedNoteCell,
): NoteDisplayTextAnchor {
  return {
    source: createSourceCellRef(entry),
    time: createIntegerTimeRange(entry.col, entry.col + 1),
    text: parsedCell.displayText,
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
function createDefaultEffectSegment(time: TimeRange): NoteEffectSegment {
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
 * 현재 셀에 해당하는 effect segment를 만든다.
 * - 인수 : parsedCell : parser가 확정한 note 셀
 * - 인수 : time : 현재 셀 하나가 차지하는 시간 범위
 * - 인수 : previousEvent : hold로 이어 붙는 이전 NoteEvent, 새 note이면 null
 * - 반환값 : vib/trem 상태가 반영된 effect segment
 */
function createEffectSegmentForCell(
  parsedCell: ParsedNoteCell,
  time: TimeRange,
  previousEvent: NoteEvent | null,
): NoteEffectSegment {
  const vib = parsedCell.hold === "~";

  if (vib) {
    return {
      ...createDefaultEffectSegment(time),
      vib: true,
      trem: null,
    };
  }

  const explicitTrem = parsedCell.modifiers.trem;
  const previousTrem = getContinuingTrem(previousEvent);

  return {
    ...createDefaultEffectSegment(time),
    trem: explicitTrem !== null
      ? { division: explicitTrem.divNum }
      : previousTrem,
  };
}

/**
 * hold로 이어지는 이전 note에서 지속 가능한 trem 상태를 가져온다.
 * - 인수 : previousEvent : hold 연결 대상 이벤트
 * - 반환값 : 이어질 trem 정보, 없으면 null
 */
function getContinuingTrem(
  previousEvent: NoteEvent | null,
): NoteEffectSegment["trem"] {
  if (previousEvent === null) {
    return null;
  }

  const previousSegment = previousEvent.effects.at(-1);

  // vib가 시작된 뒤에는 trem이 끊긴 것으로 보고, 새 @t가 나올 때만 다시 시작한다.
  if (previousSegment === undefined || previousSegment.vib) {
    return null;
  }

  return previousSegment.trem ?? null;
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
