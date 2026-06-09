/**
 * src/core/analyze/analyze_track.ts
 * track note event 분석을 수행한다.
 * 일반 note의 hold, gliss, absolutePitch, microPitch, vib, trem을 처리한다.
 */

import type {
  NoteRowDefinition,
  RowDefinition,
  RowId,
  TrackId,
} from "../score/types";
import type {
  ParsedCellEntry,
  ParsedGliss,
  ParsedMuteCell,
  ParsedNoteCell,
  ParsedPletHeadCell,
  ParsedPletSlotNote,
  ParsedTrem,
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
  RestEvent,
  SourceCellRef,
  TimeFraction,
  TimeRange,
  TupletExtendGroupEvent,
  TupletMembership,
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

// ============================================================
// Public entry
// ============================================================

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
  const consumedPletExtendCellKeys = new Set<string>();

  // 정렬된 parsed entry를 차례대로 분석하며 새 NoteEvent를 events 배열에 누적한다.
  for (const entry of sortedEntries) {
    deleteExpiredActiveNotes(activeNotesByConnectionKey, entry.col);

    const event = analyzeParsedEntry(
      trackId,
      context,
      entry,
      cellsByCol,
      activeNotesByConnectionKey,
      glissAnchors,
      consumedPletExtendCellKeys,
    );

    if (event !== null) {
      events.push(...event);
    }
  }

  events.push(...createOrphanTupletExtendGroupEvents(trackId, cellsByCol, consumedPletExtendCellKeys));
  events.push(...createGlissEvents(trackId, glissAnchors, rowOrderById));

  return {
    trackId,
    events: sortAnalyzedEvents(events),
  };
};

// ============================================================
// Track iteration helpers
// ============================================================

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

// ============================================================
// Parsed entry analyzers
// ============================================================

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
  cellsByCol: Map<number, ParsedCellEntry[]>,
  activeNotesByConnectionKey: ActiveNoteMap,
  glissAnchors: GlissAnchor[],
  consumedPletExtendCellKeys: Set<string>,
): AnalyzedEvent[] | null {
  const parsedCell = entry.parsedCell;

  if (parsedCell.kind === "mute") {
    const muteEvent = analyzeParsedMuteEntry(trackId, context, entry, parsedCell);

    return muteEvent === null ? null : [muteEvent];
  }

  if (parsedCell.kind === "pletHead") {
    return analyzeParsedPletHeadEntry(
      trackId,
      context,
      entry,
      parsedCell,
      cellsByCol,
      activeNotesByConnectionKey,
      glissAnchors,
      consumedPletExtendCellKeys,
    );
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
  return [event];
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

// ============================================================
// Tuplet analyzers
// ============================================================

/**
 * 단일 pletHead entry를 TupletGroupEvent와 slot note/rest 이벤트로 변환한다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : context : score/index/parsed 문맥
 * - 인수 : entry : pletHead 위치가 붙은 parsed cell
 * - 인수 : parsedCell : parser가 확정한 pletHead 셀
 * - 인수 : cellsByCol : 같은 track의 col별 parsed entry map
 * - 인수 : activeNotesByConnectionKey : hold 연결 기준별 마지막 note event map
 * - 인수 : glissAnchors : gliss 연결 후보를 누적할 목록
 * - 반환값 : TupletGroupEvent와 slot 이벤트 목록
 */
function analyzeParsedPletHeadEntry(
  trackId: TrackId,
  context: AnalyzeContext,
  entry: ParsedCellEntry,
  parsedCell: ParsedPletHeadCell,
  cellsByCol: Map<number, ParsedCellEntry[]>,
  activeNotesByConnectionKey: ActiveNoteMap,
  glissAnchors: GlissAnchor[],
  consumedPletExtendCellKeys: Set<string>,
): AnalyzedEvent[] {
  const headRow = asNoteRow(context.indexes.rowById.get(entry.rowId));

  if (headRow === null) {
    return [];
  }

  const groupId = createTupletGroupId(trackId, entry);
  const sourceCell = createSourceCellRef(entry);
  const extendCells = collectPletExtendSourceCells(entry, cellsByCol, consumedPletExtendCellKeys);
  const groupLength = 1 + extendCells.length;
  const groupTime = createIntegerTimeRange(entry.col, entry.col + groupLength);
  const containerRowId = resolveTupletContainerRowId(context, headRow, parsedCell) ?? sourceCell.rowId;
  const slotEvents: Array<NoteEvent | RestEvent> = [];
  const slots = parsedCell.slots.map((slot) => {
    const slotTime = createTupletSlotTimeRange(
      entry.col,
      groupLength,
      parsedCell.divNum,
      slot.slotIndex,
    );
    const slotSource = {
      ...sourceCell,
      slotIndex: slot.slotIndex,
    };
    const membership: TupletMembership = {
      groupId,
      slotIndex: slot.slotIndex,
      divNum: parsedCell.divNum,
    };

    if (slot.isRest || slot.note === null) {
      slotEvents.push(createTupletRestEvent(trackId, slotSource, slotTime, membership));
      return {
        slotIndex: slot.slotIndex,
        parsedKind: "rest" as const,
      };
    }

    const event = analyzeTupletSlotNote(
      trackId,
      context,
      headRow,
      slot.note,
      slotSource,
      slotTime,
      membership,
      activeNotesByConnectionKey,
      glissAnchors,
    );

    if (event === null) {
      slotEvents.push(createTupletRestEvent(trackId, slotSource, slotTime, membership));
      return {
        slotIndex: slot.slotIndex,
        parsedKind: "invalid" as const,
      };
    }

    if (event !== "merged") {
      slotEvents.push(event);
    }

    return {
      slotIndex: slot.slotIndex,
      parsedKind: "note" as const,
    };
  });

  return [
    ...slotEvents,
    {
      eventKind: "tupletGroup",
      trackId,
      time: groupTime,
      sourceCells: [
        sourceCell,
        ...extendCells,
      ],
      groupId,
      divNum: parsedCell.divNum,
      headCell: sourceCell,
      containerRowId,
      extendCells,
      slots,
    },
  ];
}

/**
 * tuplet 점선 컨테이너를 표시할 rowId를 첫 slot의 @n(midi) 기준으로 찾는다.
 * - 인수 : context : score/index/parsed 문맥
 * - 인수 : headRow : pletHead가 놓인 note row
 * - 인수 : parsedCell : parser가 확정한 pletHead 셀
 * - 반환값 : 첫 slot 위치 rowId, 찾지 못하면 null
 */
function resolveTupletContainerRowId(
  context: AnalyzeContext,
  headRow: NoteRowDefinition,
  parsedCell: ParsedPletHeadCell,
): RowId | null {
  const firstSlot = parsedCell.slots.find((slot) => slot.slotIndex === 0);
  const firstSlotMidi = firstSlot?.note?.position.midiNum;

  if (firstSlotMidi === undefined) {
    return null;
  }

  return context.indexes.noteRowIdByStringMidi.get(
    `${headRow.stringId}|${firstSlotMidi}`,
  ) ?? null;
}

/**
 * pletHead 오른쪽의 연속된 pletExtend source cell 목록을 찾는다.
 * - 인수 : entry : pletHead 위치가 붙은 parsed cell
 * - 인수 : cellsByCol : 같은 track의 col별 parsed entry map
 * - 반환값 : SourceCellRef[] : head와 같은 row에서 오른쪽으로 연속된 extend cell 목록
 */
function collectPletExtendSourceCells(
  entry: ParsedCellEntry,
  cellsByCol: Map<number, ParsedCellEntry[]>,
  consumedPletExtendCellKeys: Set<string>,
): SourceCellRef[] {
  const extendCells: SourceCellRef[] = [];
  let col = entry.col + 1;

  // head 오른쪽에 같은 row의 /&가 연속되는 동안 tuplet group 길이에 포함한다.
  while (true) {
    const extendEntry = cellsByCol.get(col)?.find((candidate) =>
      candidate.rowId === entry.rowId &&
      candidate.parsedCell.kind === "pletExtend"
    );

    if (extendEntry === undefined) {
      break;
    }

    consumedPletExtendCellKeys.add(createCellKey(extendEntry.rowId, extendEntry.col));
    extendCells.push(createSourceCellRef(extendEntry));
    col += 1;
  }

  return extendCells;
}

/**
 * head에 소비되지 않은 pletExtend 연속 구간을 보조 이벤트로 만든다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : cellsByCol : 같은 track의 col별 parsed entry map
 * - 인수 : consumedPletExtendCellKeys : 정상 tuplet group에 포함된 extend cell key 집합
 * - 반환값 : TupletExtendGroupEvent[] : head가 지워진 extend-only 표시 구간 목록
 */
function createOrphanTupletExtendGroupEvents(
  trackId: TrackId,
  cellsByCol: Map<number, ParsedCellEntry[]>,
  consumedPletExtendCellKeys: Set<string>,
): TupletExtendGroupEvent[] {
  const extendEntries = collectOrphanPletExtendEntries(cellsByCol, consumedPletExtendCellKeys);
  const events: TupletExtendGroupEvent[] = [];
  let activeRun: ParsedCellEntry[] = [];

  // row와 col이 연속된 /& 묶음을 하나의 삭제 보조 표시 구간으로 만든다.
  for (const entry of extendEntries) {
    const previousEntry = activeRun.at(-1);

    if (
      previousEntry !== undefined &&
      previousEntry.rowId === entry.rowId &&
      previousEntry.col + 1 === entry.col
    ) {
      activeRun.push(entry);
      continue;
    }

    pushOrphanTupletExtendRun(events, trackId, activeRun);
    activeRun = [entry];
  }

  pushOrphanTupletExtendRun(events, trackId, activeRun);

  return events;
}

/**
 * 정상 tuplet group에 포함되지 않은 pletExtend entry를 정렬해 모은다.
 * - 인수 : cellsByCol : 같은 track의 col별 parsed entry map
 * - 인수 : consumedPletExtendCellKeys : 정상 tuplet group에 포함된 extend cell key 집합
 * - 반환값 : ParsedCellEntry[] : rowId와 col 기준으로 정렬된 orphan extend entry 목록
 */
function collectOrphanPletExtendEntries(
  cellsByCol: Map<number, ParsedCellEntry[]>,
  consumedPletExtendCellKeys: Set<string>,
): ParsedCellEntry[] {
  const entries: ParsedCellEntry[] = [];

  // parsed map을 순회하며 head에 붙지 않은 /&만 후보로 모은다.
  for (const colEntries of cellsByCol.values()) {
    for (const entry of colEntries) {
      if (
        entry.parsedCell.kind === "pletExtend" &&
        !consumedPletExtendCellKeys.has(createCellKey(entry.rowId, entry.col))
      ) {
        entries.push(entry);
      }
    }
  }

  return entries.sort((left, right) => {
    if (left.rowId !== right.rowId) {
      return left.rowId.localeCompare(right.rowId);
    }

    return left.col - right.col;
  });
}

/**
 * pletExtend 연속 구간을 TupletExtendGroupEvent로 변환해 목록에 추가한다.
 * - 인수 : events : 누적할 TupletExtendGroupEvent 목록
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : run : 같은 row에서 col이 연속된 pletExtend entry 목록
 * - 반환값 : 없음
 */
function pushOrphanTupletExtendRun(
  events: TupletExtendGroupEvent[],
  trackId: TrackId,
  run: ParsedCellEntry[],
): void {
  if (run.length === 0) {
    return;
  }

  const firstEntry = run[0];
  const lastEntry = run.at(-1);

  if (firstEntry === undefined || lastEntry === undefined) {
    return;
  }

  const extendCells = run.map((entry) => createSourceCellRef(entry));

  events.push({
    eventKind: "tupletExtendGroup",
    trackId,
    time: createIntegerTimeRange(firstEntry.col, lastEntry.col + 1),
    sourceCells: extendCells,
    groupId: createTupletExtendGroupId(trackId, firstEntry),
    rowId: firstEntry.rowId,
    extendCells,
  });
}

/**
 * tuplet slot note를 NoteEvent로 변환하거나 이전 event에 hold로 병합한다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : context : score/index/parsed 문맥
 * - 인수 : headRow : pletHead가 놓인 note row
 * - 인수 : slotNote : parser가 확정한 slot note
 * - 인수 : sourceCell : slot source 참조
 * - 인수 : time : slot이 차지하는 유리수 tick 범위
 * - 인수 : membership : slot의 tuplet 소속 정보
 * - 인수 : activeNotesByConnectionKey : hold 연결 기준별 마지막 note event map
 * - 인수 : glissAnchors : gliss 연결 후보를 누적할 목록
 * - 반환값 : 새 NoteEvent, 병합 결과, 또는 row 매핑 실패 시 null
 */
function analyzeTupletSlotNote(
  trackId: TrackId,
  context: AnalyzeContext,
  headRow: NoteRowDefinition,
  slotNote: ParsedPletSlotNote,
  sourceCell: SourceCellRef,
  time: TimeRange,
  membership: TupletMembership,
  activeNotesByConnectionKey: ActiveNoteMap,
  glissAnchors: GlissAnchor[],
): NoteEvent | "merged" | null {
  const displayRowId = context.indexes.noteRowIdByStringMidi.get(
    `${headRow.stringId}|${slotNote.position.midiNum}`,
  );

  if (displayRowId === undefined) {
    return null;
  }

  const displayRow = asNoteRow(context.indexes.rowById.get(displayRowId));

  if (displayRow === null) {
    return null;
  }

  const display = createDisplayPositionFromValues(
    displayRow.rowId,
    slotNote.modifiers.microPitch?.centNum ?? 0,
  );
  const sound = createSoundPitchFromValues(
    displayRow.midi,
    slotNote.modifiers.absolutePitch?.midiNum ?? null,
    slotNote.modifiers.microPitch?.centNum ?? 0,
  );
  const connectionKey = createHoldConnectionKey(display, sound);

  if (slotNote.hold !== null) {
    const previousEvent = findConnectablePreviousEventAtTick(
      activeNotesByConnectionKey,
      fractionToNumber(time.startTick),
      connectionKey,
    );

    if (previousEvent !== null) {
      previousEvent.time.endTick = cloneTimeFraction(time.endTick);
      previousEvent.sourceCells.push(sourceCell);
      previousEvent.displayTextAnchors.push(
        createNoteDisplayTextAnchorFromValues(sourceCell, time, slotNote.displayText),
      );
      previousEvent.effects.push(
        createEffectSegmentForValues(
          slotNote.hold,
          slotNote.modifiers.trem ?? null,
          time,
          previousEvent,
        ),
      );
      appendGlissAnchorFromValues(glissAnchors, previousEvent, sourceCell, time, slotNote.modifiers.gliss);
      activeNotesByConnectionKey.set(connectionKey, previousEvent);
      return "merged";
    }
  }

  const event: NoteEvent = {
    eventKind: "note",
    eventId: createTupletNoteEventId(trackId, sourceCell),
    text: slotNote.displayText,
    displayTextAnchors: [createNoteDisplayTextAnchorFromValues(sourceCell, time, slotNote.displayText)],
    trackId,
    time: cloneTimeRange(time),
    sourceCells: [sourceCell],
    display,
    sound,
    effects: [
      createEffectSegmentForValues(slotNote.hold, slotNote.modifiers.trem ?? null, time, null),
    ],
    glissRole: null,
    glissAnchors: [],
    tuplet: membership,
  };

  appendGlissAnchorFromValues(glissAnchors, event, sourceCell, time, slotNote.modifiers.gliss);
  activeNotesByConnectionKey.set(connectionKey, event);
  return event;
}

/**
 * tuplet rest slot을 RestEvent로 만든다.
 * - 인수 : trackId : 분석 대상 track
 * - 인수 : sourceCell : slot source 참조
 * - 인수 : time : rest slot이 차지하는 유리수 tick 범위
 * - 인수 : membership : slot의 tuplet 소속 정보
 * - 반환값 : RestEvent : 시간 점유용 rest event
 */
function createTupletRestEvent(
  trackId: TrackId,
  sourceCell: SourceCellRef,
  time: TimeRange,
  membership: TupletMembership,
): RestEvent {
  return {
    eventKind: "rest",
    trackId,
    time: cloneTimeRange(time),
    sourceCells: [sourceCell],
    display: null,
    tuplet: membership,
  };
}

// ============================================================
// Gliss analyzers
// ============================================================

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
    source: { ...sourceCell },
    time: cloneTimeRange(time),
  });
}

/**
 * parsed gliss 값을 NoteEvent와 별도 anchor 목록에 반영한다.
 * - 인수 : glissAnchors : gliss 연결 후보 누적 목록
 * - 인수 : event : modifier가 붙은 note가 속한 NoteEvent
 * - 인수 : sourceCell : modifier가 붙은 원본 셀 또는 slot 참조
 * - 인수 : time : modifier가 붙은 원본 셀 또는 slot의 시간 범위
 * - 인수 : gliss : parser가 확정한 gliss modifier
 * - 반환값 : 없음
 */
function appendGlissAnchorFromValues(
  glissAnchors: GlissAnchor[],
  event: NoteEvent,
  sourceCell: SourceCellRef,
  time: TimeRange,
  gliss: ParsedGliss | null,
): void {
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
    source: { ...sourceCell },
    time: cloneTimeRange(time),
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
  const sortedAnchors = filterDuplicateGlissAnchors(
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
    startAnchorTick: createGlissAnchorTick(startAnchor),
    endAnchorTick: createGlissAnchorTick(endAnchor),
    fromKind: toGlissFromKind(startAnchor),
    toKind: endAnchor.role === "mid" ? "mid" : "end",
    startAttach: isAnchorInsideMergedEvent(startAnchor) ? "legato" : "attack",
    endAttach: isAnchorBeforeMergedEventEnd(endAnchor) ? "holdContinue" : "release",
  };
}

/**
 * gliss anchor의 시각 기준 tick을 만든다.
 * - 인수 : anchor : gliss anchor 정보
 * - 반환값 : tuplet slot anchor는 slot 시작 tick, 일반 cell anchor는 cell 중심 tick
 */
function createGlissAnchorTick(anchor: GlissAnchor): TimeFraction {
  if (anchor.source.slotIndex !== undefined) {
    return cloneTimeFraction(anchor.time.startTick);
  }

  return createTimeRangeCenterTick(anchor.time);
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
 * 동일 col에 같은 glissId와 role의 anchor가 여러 개 있으면 위쪽 하나만 남긴다.
 * - 인수 : anchors : 시간과 표시 행 순서로 정렬된 gliss anchor 목록
 * - 반환값 : GlissAnchor[] : 동일 col/id/role 중복이 제거된 anchor 목록
 */
function filterDuplicateGlissAnchors(anchors: GlissAnchor[]): GlissAnchor[] {
  const filteredAnchors: GlissAnchor[] = [];
  const seenAnchorKey = new Set<string>();

  // 동일 열의 같은 id/role anchor는 수직 gliss segment를 만들 수 없으므로 첫 anchor만 유지한다.
  for (const anchor of anchors) {
    const key = createGlissAnchorUniquenessKey(anchor);

    if (seenAnchorKey.has(key)) {
      continue;
    }

    seenAnchorKey.add(key);
    filteredAnchors.push(anchor);
  }

  return filteredAnchors;
}

/**
 * 중복 gliss anchor 판정에 사용할 key를 만든다.
 * - 인수 : anchor : 중복 판정 대상 gliss anchor
 * - 반환값 : string : 같은 id/role/col/slotIndex를 묶는 key
 */
function createGlissAnchorUniquenessKey(anchor: GlissAnchor): string {
  return [
    anchor.glissId,
    anchor.role,
    anchor.source.col,
    anchor.source.slotIndex ?? "",
  ].join("|");
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
  return [
    trackId,
    "gliss",
    startAnchor.glissId,
    startAnchor.source.rowId,
    startAnchor.source.col,
    startAnchor.source.slotIndex ?? "",
  ].join(":");
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

// ============================================================
// Event sorting helpers
// ============================================================

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
    tupletExtendGroup: 2,
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

// ============================================================
// Note position and hold helpers
// ============================================================

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
 * 특정 tick에서 바로 이어지는 기존 NoteEvent를 찾는다.
 * - 인수 : activeNotesByConnectionKey : hold 연결 기준별 마지막 note event map
 * - 인수 : startTick : 현재 slot 또는 cell의 시작 tick
 * - 인수 : connectionKey : 현재 slot 또는 cell의 표시/발음 위치 기준 key
 * - 반환값 : 연결 가능한 이전 NoteEvent 또는 null
 */
function findConnectablePreviousEventAtTick(
  activeNotesByConnectionKey: ActiveNoteMap,
  startTick: number,
  connectionKey: HoldConnectionKey,
): NoteEvent | null {
  const event = activeNotesByConnectionKey.get(connectionKey);

  // tuplet slot은 유리수 tick에서 시작될 수 있으므로 col 대신 number tick 값으로 비교한다.
  if (event !== undefined && fractionToNumber(event.time.endTick) === startTick) {
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
  return createDisplayPositionFromValues(
    row.rowId,
    parsedCell.modifiers.microPitch?.centNum ?? 0,
  );
}

/**
 * rowId와 cent offset에서 최종 표시 위치를 만든다.
 * - 인수 : rowId : renderer가 배치 기준으로 사용할 note row id
 * - 인수 : centOffset : 표시 위치의 cent 단위 보정
 * - 반환값 : FinalDisplayPosition : renderer가 사용할 의미적 표시 위치
 */
function createDisplayPositionFromValues(
  rowId: RowId,
  centOffset: number,
): FinalDisplayPosition {
  return {
    rowId,
    centOffset,
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
  return createSoundPitchFromValues(
    row.midi,
    parsedCell.modifiers.absolutePitch?.midiNum ?? null,
    parsedCell.modifiers.microPitch?.centNum ?? 0,
  );
}

/**
 * row MIDI와 pitch modifier 값에서 최종 발음 음정을 만든다.
 * - 인수 : rowMidi : 표시 row의 기본 MIDI 번호
 * - 인수 : absoluteMidi : 직접 지정된 발음 MIDI 번호. 없으면 null
 * - 인수 : centOffset : 발음 음정의 cent 단위 보정
 * - 반환값 : FinalSoundPitch : audio generator가 사용할 의미적 발음 음정
 */
function createSoundPitchFromValues(
  rowMidi: number,
  absoluteMidi: number | null,
  centOffset: number,
): FinalSoundPitch {
  return {
    midi: absoluteMidi ?? rowMidi,
    centOffset,
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
  return createNoteDisplayTextAnchorFromValues(
    sourceCell,
    time,
    parsedCell.displayText,
  );
}

/**
 * 표시 문자열 값을 NoteEvent 내부 표시 anchor로 복사한다.
 * - 인수 : sourceCell : 원본 셀 또는 slot 참조
 * - 인수 : time : 표시 anchor가 차지하는 시간 범위
 * - 인수 : text : renderer가 표시할 문자열
 * - 반환값 : NoteDisplayTextAnchor : note layer가 시간 위치별로 표시할 텍스트
 */
function createNoteDisplayTextAnchorFromValues(
  sourceCell: SourceCellRef,
  time: TimeRange,
  text: string,
): NoteDisplayTextAnchor {
  return {
    source: { ...sourceCell },
    time: cloneTimeRange(time),
    text,
  };
}

// ============================================================
// Time helpers
// ============================================================

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
 * tuplet group의 slot 하나가 차지하는 유리수 tick 범위를 만든다.
 * - 인수 : startCol : pletHead가 놓인 시작 col
 * - 인수 : groupLength : head와 연속 extend를 합친 정수 tick 길이
 * - 인수 : divNum : tuplet slot 분할 수
 * - 인수 : slotIndex : 0부터 시작하는 slot 순서
 * - 반환값 : TimeRange : slot 하나의 유리수 tick 범위
 */
function createTupletSlotTimeRange(
  startCol: number,
  groupLength: number,
  divNum: number,
  slotIndex: number,
): TimeRange {
  return {
    startTick: {
      numerator: startCol * divNum + slotIndex * groupLength,
      denominator: divNum,
    },
    endTick: {
      numerator: startCol * divNum + (slotIndex + 1) * groupLength,
      denominator: divNum,
    },
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
 * TimeRange의 중심 tick을 TimeFraction으로 만든다.
 * - 인수 : time : 중심 tick을 계산할 시간 범위
 * - 반환값 : TimeFraction : start/end의 산술 중심 tick
 */
function createTimeRangeCenterTick(time: TimeRange): TimeFraction {
  const startDenominator = time.startTick.denominator;
  const endDenominator = time.endTick.denominator;

  return {
    numerator:
      time.startTick.numerator * endDenominator +
      time.endTick.numerator * startDenominator,
    denominator: startDenominator * endDenominator * 2,
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

// ============================================================
// Effect helpers
// ============================================================

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
  return createEffectSegmentForValues(
    parsedCell.hold,
    parsedCell.modifiers.trem,
    time,
    previousEvent,
  );
}

/**
 * hold와 trem 값에서 현재 시간 구간의 effect segment를 만든다.
 * - 인수 : hold : 현재 cell 또는 slot의 hold 표식
 * - 인수 : explicitTrem : 현재 cell 또는 slot의 trem modifier
 * - 인수 : time : 현재 구간이 차지하는 시간 범위
 * - 인수 : previousEvent : hold로 이어 붙는 이전 NoteEvent, 새 note이면 null
 * - 반환값 : vib/trem 상태가 반영된 effect segment
 */
function createEffectSegmentForValues(
  hold: ParsedNoteCell["hold"],
  explicitTrem: ParsedTrem | null,
  time: TimeRange,
  previousEvent: NoteEvent | null,
): NoteEffectSegment {
  const vib = hold === "~";

  if (vib) {
    return {
      ...createDefaultEffectSegment(time),
      vib: true,
      trem: null,
    };
  }

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

// ============================================================
// Stable id helpers
// ============================================================

/**
 * 첫 source cell 기준으로 안정적인 note event id를 만든다.
 * - 인수 : trackId : 이벤트가 속한 track
 * - 인수 : sourceCell : 이벤트 시작 원인 셀
 * - 반환값 : string : MVP note event id
 */
function createNoteEventId(trackId: TrackId, sourceCell: SourceCellRef): string {
  return `${trackId}:note:${sourceCell.rowId}:${sourceCell.col}`;
}

/**
 * tuplet group의 안정적인 group id를 만든다.
 * - 인수 : trackId : 이벤트가 속한 track
 * - 인수 : entry : tuplet head parsed entry
 * - 반환값 : string : tuplet group id
 */
function createTupletGroupId(trackId: TrackId, entry: ParsedCellEntry): string {
  return `${trackId}:tuplet:${entry.rowId}:${entry.col}`;
}

/**
 * tuplet slot note의 안정적인 event id를 만든다.
 * - 인수 : trackId : 이벤트가 속한 track
 * - 인수 : sourceCell : slot source 참조
 * - 반환값 : string : MVP tuplet note event id
 */
function createTupletNoteEventId(trackId: TrackId, sourceCell: SourceCellRef): string {
  return `${trackId}:note:${sourceCell.rowId}:${sourceCell.col}:slot:${sourceCell.slotIndex ?? 0}`;
}

/**
 * orphan pletExtend group의 안정적인 id를 만든다.
 * - 인수 : trackId : 이벤트가 속한 track
 * - 인수 : entry : extend run의 첫 parsed entry
 * - 반환값 : string : tuplet extend group id
 */
function createTupletExtendGroupId(trackId: TrackId, entry: ParsedCellEntry): string {
  return `${trackId}:tuplet-extend:${entry.rowId}:${entry.col}`;
}

/**
 * row/col source cell key를 만든다.
 * - 인수 : rowId : 원본 cell rowId
 * - 인수 : col : 원본 cell col
 * - 반환값 : string : set 조회용 cell key
 */
function createCellKey(rowId: RowId, col: number): string {
  return `${rowId}|${col}`;
}
