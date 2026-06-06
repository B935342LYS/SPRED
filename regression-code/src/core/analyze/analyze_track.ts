/**
 * src/core/analyze/analyze_track.ts
 * track note event 분석을 수행한다.
 * 일반 note의 hold, gliss, absolutePitch, microPitch, vib, trem을 처리한다.
 */

import type {
  NoteRowDefinition,
  RowDefinition,
  TrackId,
} from "../score/types";
import type {
  ParsedCellEntry,
  ParsedMuteCell,
  ParsedNoteCell,
} from "../parse/types";
import type {
  AnalyzeContext,
  AnalyzeTrackEventsFn,
  AnalyzeTrackRange,
  AnalyzedEvent,
  AnalyzedTrackResult,
  FinalDisplayPosition,
  FinalSoundPitch,
  GlissEvent,
  MuteEvent,
  NoteEffectSegment,
  NoteEvent,
  NoteDisplayTextAnchor,
  SourceCellRef,
  TimeFraction,
  TimeRange,
} from "./types";

type HoldConnectionKey = string;

type ActiveNoteMap = Map<HoldConnectionKey, NoteEvent>;

type GlissAnchor = {
  glissId: string;
  role: "start" | "mid" | "end";
  event: NoteEvent;
  source: SourceCellRef;
  time: TimeRange;
};

type RowOrderMap = Map<string, number>;

/**
 * 한 track 내부의 MVP note/gliss event를 분석한다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : context : score/index/parsed 문맥
 * - 인수 : range : 후속 partial analysis용 범위. 현재 MVP에서는 범위가 없을 때 full 분석한다.
 * - 반환값 : AnalyzedTrackResult : track 내부 note/gliss event 목록
 */
export const analyzeTrackEvents: AnalyzeTrackEventsFn = (
  trackId: TrackId,
  context: AnalyzeContext,
  range?: AnalyzeTrackRange,
): AnalyzedTrackResult => {
  const cellsByCol =
    context.parsed.noteCellsByTrackAndCol.get(trackId) ?? new Map();
  const rowOrderById = createRowOrderMap(context);
  const sortedEntries = getSortedTrackEntries(cellsByCol, rowOrderById, range);
  const events: AnalyzedEvent[] = [];
  const glissAnchors: GlissAnchor[] = [];
  const activeNotesByConnectionKey: ActiveNoteMap = new Map();

  // 정렬된 parsed entry를 차례대로 분석하며 새 NoteEvent를 events 배열에 누적한다.
  for (const entry of sortedEntries) {
    deleteExpiredActiveNotes(activeNotesByConnectionKey, entry.col);

    const event = analyzeParsedEntry(
      trackId,
      context,
      entry,
      activeNotesByConnectionKey,
      glissAnchors,
    );

    if (event !== null) {
      events.push(event);
    }
  }

  events.push(...createGlissEvents(trackId, glissAnchors, rowOrderById));

  return {
    trackId,
    events: sortAnalyzedEvents(events),
  };
};

/**
 * 현재 col에서 더 이상 hold 연결 후보가 될 수 없는 active note를 제거한다.
 * - 인수 : activeNotesByConnectionKey : hold 연결 기준별 마지막 note event map
 * - 인수 : col : 현재 분석 중인 cell column
 * - 반환값 : 없음
 */
function deleteExpiredActiveNotes(
  activeNotesByConnectionKey: ActiveNoteMap,
  col: number,
): void {
  // hold는 바로 왼쪽 tick에 끝난 note에만 연결되므로 endTick이 현재 col보다 작으면 후보가 아니다.
  for (const [connectionKey, event] of activeNotesByConnectionKey) {
    if (fractionToNumber(event.time.endTick) < col) {
      activeNotesByConnectionKey.delete(connectionKey);
    }
  }
}

/**
 * track의 parsed cell entry를 col, rowId 순서로 정렬해 반환한다.
 * - 인수 : cellsByCol : col별 parsed cell entry map
 * - 인수 : range : 선택적 분석 범위
 * - 반환값 : ParsedCellEntry[] : 안정적인 분석 순서의 entry 목록
 */
function getSortedTrackEntries(
  cellsByCol: Map<number, ParsedCellEntry[]>,
  rowOrderById: RowOrderMap,
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

    return compareRowOrder(left.rowId, right.rowId, rowOrderById);
  });
}

/**
 * layout 표시 순서를 rowId 조회 Map으로 만든다.
 * - 인수 : context : score/index/parsed 문맥
 * - 반환값 : RowOrderMap : 위쪽 행일수록 작은 값을 갖는 정렬 Map
 */
function createRowOrderMap(context: AnalyzeContext): RowOrderMap {
  const rowOrderById: RowOrderMap = new Map();

  // renderer와 같은 layout 표시 순서를 analyzer의 동일 col 판정 기준으로 사용한다.
  context.indexes.rowsInDisplayOrder.forEach((row, index) => {
    rowOrderById.set(row.rowId, index);
  });

  return rowOrderById;
}

/**
 * 단일 parsed entry를 analyzer event로 변환하거나 기존 이벤트에 hold로 병합한다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : context : score/index/parsed 문맥
 * - 인수 : entry : 문서 위치가 붙은 parsed cell
 * - 인수 : activeNotesByConnectionKey : hold 연결 기준별 마지막 note event map
 * - 인수 : glissAnchors : gliss 연결 후보를 누적할 목록
 * - 반환값 : 새로 생성된 analyzer event 또는 병합/제외 시 null
 */
function analyzeParsedEntry(
  trackId: TrackId,
  context: AnalyzeContext,
  entry: ParsedCellEntry,
  activeNotesByConnectionKey: ActiveNoteMap,
  glissAnchors: GlissAnchor[],
): NoteEvent | MuteEvent | null {
  const parsedCell = entry.parsedCell;

  if (parsedCell.kind === "mute") {
    return analyzeParsedMuteEntry(trackId, context, entry, parsedCell);
  }

  if (parsedCell.kind !== "note") {
    return null;
  }

  const row = asNoteRow(context.indexes.rowById.get(entry.rowId));

  if (row === null) {
    return null;
  }

  const sourceCell = createSourceCellRef(entry);
  const time = createIntegerTimeRange(entry.col, entry.col + 1);
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
        createNoteDisplayTextAnchor(sourceCell, time, parsedCell),
      );
      previousEvent.effects.push(
        createEffectSegmentForCell(
          parsedCell,
          time,
          previousEvent,
        ),
      );
      appendGlissAnchorIfNeeded(glissAnchors, previousEvent, sourceCell, time, parsedCell);
      activeNotesByConnectionKey.set(connectionKey, previousEvent);
      return null;
    }
  }

  // hold 병합이 없으면 현재 셀의 rowId와 midi를 사용해 새 NoteEvent를 만든다.
  const event: NoteEvent = {
    eventKind: "note",
    eventId: createNoteEventId(trackId, sourceCell),
    text: parsedCell.displayText,
    displayTextAnchors: [createNoteDisplayTextAnchor(sourceCell, time, parsedCell)],
    trackId,
    time,
    sourceCells: [sourceCell],
    display,
    sound,
    effects: [createEffectSegmentForCell(parsedCell, time, null)],
    glissRole: null,
    glissAnchors: [],
    tuplet: null,
  };

  appendGlissAnchorIfNeeded(glissAnchors, event, sourceCell, time, parsedCell);
  activeNotesByConnectionKey.set(connectionKey, event);
  return event;
}

/**
 * 단일 parsed mute entry를 MuteEvent로 변환한다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : context : score/index/parsed 문맥
 * - 인수 : entry : 문서 위치가 붙은 parsed cell
 * - 인수 : parsedCell : parser가 확정한 mute 셀
 * - 반환값 : MuteEvent 또는 note row가 아니면 null
 */
function analyzeParsedMuteEntry(
  trackId: TrackId,
  context: AnalyzeContext,
  entry: ParsedCellEntry,
  parsedCell: ParsedMuteCell,
): MuteEvent | null {
  const row = asNoteRow(context.indexes.rowById.get(entry.rowId));

  if (row === null) {
    return null;
  }

  const sourceCell = createSourceCellRef(entry);

  // mute는 발음 이벤트가 아니므로 표시 위치와 텍스트만 가진 독립 이벤트로 만든다.
  return {
    eventKind: "mute",
    trackId,
    time: createIntegerTimeRange(entry.col, entry.col + 1),
    sourceCells: [sourceCell],
    display: {
      rowId: row.rowId,
      centOffset: 0,
    },
    text: parsedCell.displayText,
  };
}

/**
 * parsed note의 gliss modifier를 NoteEvent와 별도 anchor 목록에 반영한다.
 * - 인수 : glissAnchors : gliss 연결 후보 누적 목록
 * - 인수 : event : modifier가 붙은 note가 속한 NoteEvent
 * - 인수 : sourceCell : modifier가 붙은 원본 셀
 * - 인수 : time : modifier가 붙은 원본 셀의 시간 범위
 * - 인수 : parsedCell : parser가 확정한 note 셀
 * - 반환값 : 없음
 */
function appendGlissAnchorIfNeeded(
  glissAnchors: GlissAnchor[],
  event: NoteEvent,
  sourceCell: SourceCellRef,
  time: TimeRange,
  parsedCell: ParsedNoteCell,
): void {
  const gliss = parsedCell.modifiers.gliss;

  if (gliss === null) {
    return;
  }

  const role = toGlissAnchorRole(gliss.glissKind);

  event.glissRole = {
    glissId: gliss.id,
    role,
  };
  event.glissAnchors.push({
    glissId: gliss.id,
    role,
    source: { ...sourceCell },
    time: cloneTimeRange(time),
    display: { ...event.display },
  });
  glissAnchors.push({
    glissId: gliss.id,
    role,
    event,
    source: sourceCell,
    time,
  });
}

/**
 * parser의 S/M/E gliss kind를 analyzer anchor role로 변환한다.
 * - 인수 : glissKind : parser가 읽은 gliss kind
 * - 반환값 : NoteEvent와 GlissEvent에 기록할 anchor role
 */
function toGlissAnchorRole(glissKind: "S" | "M" | "E"): GlissAnchor["role"] {
  if (glissKind === "S") {
    return "start";
  }

  if (glissKind === "M") {
    return "mid";
  }

  return "end";
}

/**
 * gliss anchor 목록에서 인접 anchor 쌍별 GlissEvent를 만든다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : anchors : note 분석 중 수집한 gliss anchor 목록
 * - 반환값 : GlissEvent[] : renderer/audio가 소비할 gliss segment 목록
 */
function createGlissEvents(
  trackId: TrackId,
  anchors: GlissAnchor[],
  rowOrderById: RowOrderMap,
): GlissEvent[] {
  const glissEvents: GlissEvent[] = [];
  const lastConnectableAnchorById = new Map<string, GlissAnchor>();
  const sortedAnchors = filterDuplicateMidAnchors(
    [...anchors].sort((left, right) => compareGlissAnchors(left, right, rowOrderById)),
  );

  // 같은 glissId 안에서 S 또는 M 뒤에 오는 M/E만 segment로 연결한다.
  for (const anchor of sortedAnchors) {
    if (anchor.role === "start") {
      lastConnectableAnchorById.set(anchor.glissId, anchor);
      continue;
    }

    const previousAnchor = lastConnectableAnchorById.get(anchor.glissId);

    if (previousAnchor !== undefined) {
      glissEvents.push(createGlissEvent(trackId, previousAnchor, anchor));
    }

    if (anchor.role === "mid") {
      lastConnectableAnchorById.set(anchor.glissId, anchor);
    } else {
      lastConnectableAnchorById.delete(anchor.glissId);
    }
  }

  return glissEvents;
}

/**
 * 두 gliss anchor에서 하나의 GlissEvent를 만든다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : startAnchor : segment 시작 anchor
 * - 인수 : endAnchor : segment 종료 anchor
 * - 반환값 : GlissEvent : 두 anchor 사이의 gliss segment
 */
function createGlissEvent(
  trackId: TrackId,
  startAnchor: GlissAnchor,
  endAnchor: GlissAnchor,
): GlissEvent {
  return {
    eventKind: "gliss",
    eventId: createGlissEventId(trackId, startAnchor),
    trackId,
    time: {
      startTick: cloneTimeFraction(startAnchor.time.startTick),
      endTick: cloneTimeFraction(endAnchor.time.endTick),
    },
    sourceCells: [
      { ...startAnchor.source },
      { ...endAnchor.source },
    ],
    startDisplay: { ...startAnchor.event.display },
    endDisplay: { ...endAnchor.event.display },
    startSound: { ...startAnchor.event.sound },
    endSound: { ...endAnchor.event.sound },
    glissId: startAnchor.glissId,
    fromKind: toGlissFromKind(startAnchor),
    toKind: endAnchor.role === "mid" ? "mid" : "end",
    startAttach: isAnchorInsideMergedEvent(startAnchor) ? "legato" : "attack",
    endAttach: isAnchorBeforeMergedEventEnd(endAnchor) ? "holdContinue" : "release",
  };
}

/**
 * gliss segment 시작 anchor role을 GlissEvent.fromKind 타입으로 좁힌다.
 * - 인수 : anchor : segment 시작 anchor
 * - 반환값 : GlissEvent.fromKind에 허용되는 start 또는 mid
 */
function toGlissFromKind(anchor: GlissAnchor): GlissEvent["fromKind"] {
  return anchor.role === "mid" ? "mid" : "start";
}

/**
 * gliss anchor 정렬 순서를 만든다.
 * - 인수 : left : 왼쪽 비교 대상
 * - 인수 : right : 오른쪽 비교 대상
 * - 반환값 : Array.sort에 사용할 비교 결과
 */
function compareGlissAnchors(
  left: GlissAnchor,
  right: GlissAnchor,
  rowOrderById: RowOrderMap,
): number {
  const leftTick = fractionToNumber(left.time.startTick);
  const rightTick = fractionToNumber(right.time.startTick);

  if (leftTick !== rightTick) {
    return leftTick - rightTick;
  }
  if (left.source.col !== right.source.col) {
    return left.source.col - right.source.col;
  }
  return compareRowOrder(left.source.rowId, right.source.rowId, rowOrderById);
}

/**
 * 동일 col에 같은 glissId의 mid anchor가 여러 개 있으면 위쪽 하나만 남긴다.
 * - 인수 : anchors : 시간과 표시 행 순서로 정렬된 gliss anchor 목록
 * - 반환값 : GlissAnchor[] : 동일 col/id mid 중복이 제거된 anchor 목록
 */
function filterDuplicateMidAnchors(anchors: GlissAnchor[]): GlissAnchor[] {
  const filteredAnchors: GlissAnchor[] = [];
  const seenMidKey = new Set<string>();

  // 동일 열의 같은 id mid는 수직 gliss segment를 만들 수 없으므로 첫 anchor만 유지한다.
  for (const anchor of anchors) {
    if (anchor.role !== "mid") {
      filteredAnchors.push(anchor);
      continue;
    }

    const key = `${anchor.glissId}|${anchor.source.col}`;

    if (seenMidKey.has(key)) {
      continue;
    }

    seenMidKey.add(key);
    filteredAnchors.push(anchor);
  }

  return filteredAnchors;
}

/**
 * 두 rowId를 layout 표시 순서 기준으로 비교한다.
 * - 인수 : leftRowId : 왼쪽 rowId
 * - 인수 : rightRowId : 오른쪽 rowId
 * - 인수 : rowOrderById : layout 표시 순서 Map
 * - 반환값 : Array.sort에 사용할 비교 결과
 */
function compareRowOrder(
  leftRowId: string,
  rightRowId: string,
  rowOrderById: RowOrderMap,
): number {
  const leftOrder = rowOrderById.get(leftRowId);
  const rightOrder = rowOrderById.get(rightRowId);

  if (leftOrder !== undefined && rightOrder !== undefined && leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  if (leftOrder !== undefined || rightOrder !== undefined) {
    return leftOrder === undefined ? 1 : -1;
  }

  return leftRowId.localeCompare(rightRowId);
}

/**
 * GlissEvent의 안정적인 eventId를 만든다.
 * - 인수 : trackId : 이벤트가 속한 track
 * - 인수 : startAnchor : gliss segment 시작 anchor
 * - 반환값 : string : gliss event id
 */
function createGlissEventId(trackId: TrackId, startAnchor: GlissAnchor): string {
  return `${trackId}:gliss:${startAnchor.glissId}:${startAnchor.source.rowId}:${startAnchor.source.col}`;
}

/**
 * anchor가 병합된 note event의 시작보다 뒤에 있는지 확인한다.
 * - 인수 : anchor : gliss anchor 정보
 * - 반환값 : boolean : 앞선 hold 위에서 시작된 gliss 여부
 */
function isAnchorInsideMergedEvent(anchor: GlissAnchor): boolean {
  return fractionToNumber(anchor.event.time.startTick) < fractionToNumber(anchor.time.startTick);
}

/**
 * anchor가 병합된 note event의 끝보다 앞에 있는지 확인한다.
 * - 인수 : anchor : gliss anchor 정보
 * - 반환값 : boolean : gliss 종착 뒤로 hold가 계속되는지 여부
 */
function isAnchorBeforeMergedEventEnd(anchor: GlissAnchor): boolean {
  return fractionToNumber(anchor.time.endTick) < fractionToNumber(anchor.event.time.endTick);
}

/**
 * analyzer event를 시간과 종류 기준으로 안정 정렬한다.
 * - 인수 : events : 정렬할 analyzer event 목록
 * - 반환값 : AnalyzedEvent[] : renderer/audio 소비 순서가 안정화된 목록
 */
function sortAnalyzedEvents(events: AnalyzedEvent[]): AnalyzedEvent[] {
  const eventKindOrder = {
    note: 0,
    rest: 0,
    mute: 0,
    gliss: 1,
    tupletGroup: 2,
  } as const;

  return events.sort((left, right) => {
    const leftStart = fractionToNumber(left.time.startTick);
    const rightStart = fractionToNumber(right.time.startTick);

    if (leftStart !== rightStart) {
      return leftStart - rightStart;
    }

    const leftKindOrder = eventKindOrder[left.eventKind];
    const rightKindOrder = eventKindOrder[right.eventKind];

    if (leftKindOrder !== rightKindOrder) {
      return leftKindOrder - rightKindOrder;
    }

    const leftEnd = fractionToNumber(left.time.endTick);
    const rightEnd = fractionToNumber(right.time.endTick);

    if (leftEnd !== rightEnd) {
      return leftEnd - rightEnd;
    }

    return compareSourceCells(left.sourceCells[0], right.sourceCells[0]);
  });
}

/**
 * source cell 좌표를 안정 정렬용으로 비교한다.
 * - 인수 : left : 왼쪽 source cell 후보
 * - 인수 : right : 오른쪽 source cell 후보
 * - 반환값 : Array.sort에 사용할 비교 결과
 */
function compareSourceCells(
  left: SourceCellRef | undefined,
  right: SourceCellRef | undefined,
): number {
  if (left === undefined || right === undefined) {
    return left === right ? 0 : left === undefined ? 1 : -1;
  }
  if (left.col !== right.col) {
    return left.col - right.col;
  }
  return left.rowId.localeCompare(right.rowId);
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
 * - 인수 : sourceCell : 원본 셀 참조
 * - 인수 : time : 표시 anchor가 차지하는 시간 범위
 * - 인수 : parsedCell : parser가 확정한 note 셀 표시 정보
 * - 반환값 : NoteDisplayTextAnchor : note layer가 시간 위치별로 표시할 텍스트
 */
function createNoteDisplayTextAnchor(
  sourceCell: SourceCellRef,
  time: TimeRange,
  parsedCell: ParsedNoteCell,
): NoteDisplayTextAnchor {
  return {
    source: { ...sourceCell },
    time: cloneTimeRange(time),
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
 * TimeRange를 얕은 공유 없이 복사한다.
 * - 인수 : time : 복사할 시간 범위
 * - 반환값 : TimeRange : start/end fraction이 복제된 시간 범위
 */
function cloneTimeRange(time: TimeRange): TimeRange {
  return {
    startTick: cloneTimeFraction(time.startTick),
    endTick: cloneTimeFraction(time.endTick),
  };
}

/**
 * TimeFraction을 얕은 공유 없이 복사한다.
 * - 인수 : value : 복사할 시간 분수
 * - 반환값 : TimeFraction : 복제된 시간 분수
 */
function cloneTimeFraction(value: TimeFraction): TimeFraction {
  return {
    numerator: value.numerator,
    denominator: value.denominator,
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
    time: cloneTimeRange(time),
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
