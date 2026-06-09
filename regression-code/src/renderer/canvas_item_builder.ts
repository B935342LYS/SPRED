/**
 * analyzer 결과를 renderer-owned canvas item으로 변환한다.
 */

import type {
  AnalysisResult,
  AnalyzedEvent,
  GlissEvent,
  MuteEvent,
  NoteEvent,
  SourceCellRef,
  TimeFraction,
  TimeRange,
  TupletExtendGroupEvent,
  TupletGroupEvent,
} from "../core/analyze/types";
import type {
  CanvasMarkerItem,
  CanvasMuteRenderItem,
  CanvasNoteRenderItem,
} from "./canvas_types";

/**
 * analyzer 결과에서 note layer가 사용할 note item 목록을 만든다.
 * - 인수 : analysis : analyzer가 확정한 문서 분석 결과
 * - 반환값 : CanvasNoteRenderItem[] : renderer-owned note 표시 item 목록
 */
export function buildCanvasNoteRenderItems(
  analysis: AnalysisResult,
): CanvasNoteRenderItem[] {
  const items: CanvasNoteRenderItem[] = [];

  // trackResults를 순회하며 실제 발음 이벤트인 NoteEvent만 renderer item으로 변환한다.
  for (const trackResult of analysis.trackResults) {
    for (const event of trackResult.events) {
      if (!isNoteEvent(event)) {
        continue;
      }

      items.push({
        rowId: event.display.rowId,
        displayCentOffset: event.display.centOffset,
        startTick: timeFractionToNumber(event.time.startTick),
        endTick: timeFractionToNumber(event.time.endTick),
        midi: event.sound.midi,
        text: event.text,
        displayTextAnchors: event.displayTextAnchors.map((anchor) => ({
          sourceRowId: anchor.source.rowId,
          sourceCol: anchor.source.col,
          sourceSlotIndex: anchor.source.slotIndex,
          startTick: timeFractionToNumber(anchor.time.startTick),
          endTick: timeFractionToNumber(anchor.time.endTick),
          text: anchor.text,
        })),
        effects: event.effects.map((effect) => ({
          startTick: timeFractionToNumber(effect.time.startTick),
          endTick: timeFractionToNumber(effect.time.endTick),
          vib: effect.vib,
          tremDivision: effect.trem?.division ?? null,
        })),
        trackId: event.trackId,
      });
    }
  }

  // note layer draw 순서가 입력 순서에 의존하지 않도록 시간, 행, track 순서로 정렬한다.
  return items.sort((left, right) => {
    if (left.startTick !== right.startTick) {
      return left.startTick - right.startTick;
    }
    if (left.rowId !== right.rowId) {
      return left.rowId.localeCompare(right.rowId);
    }
    return (left.trackId ?? "").localeCompare(right.trackId ?? "");
  });
}

/**
 * analyzer 결과에서 note layer가 사용할 mute text item 목록을 만든다.
 * - 인수 : analysis : analyzer가 확정한 문서 분석 결과
 * - 반환값 : CanvasMuteRenderItem[] : renderer-owned mute 텍스트 표시 item 목록
 */
export function buildCanvasMuteRenderItems(
  analysis: AnalysisResult,
): CanvasMuteRenderItem[] {
  const items: CanvasMuteRenderItem[] = [];

  // trackResults를 순회하며 표시 전용 이벤트인 MuteEvent만 renderer item으로 변환한다.
  for (const trackResult of analysis.trackResults) {
    for (const event of trackResult.events) {
      if (!isMuteEvent(event)) {
        continue;
      }

      items.push({
        rowId: event.display.rowId,
        startTick: timeFractionToNumber(event.time.startTick),
        endTick: timeFractionToNumber(event.time.endTick),
        text: event.text,
        trackId: event.trackId,
      });
    }
  }

  // mute text draw 순서가 입력 순서에 의존하지 않도록 시간, 행, track 순서로 정렬한다.
  return items.sort((left, right) => {
    if (left.startTick !== right.startTick) {
      return left.startTick - right.startTick;
    }
    if (left.rowId !== right.rowId) {
      return left.rowId.localeCompare(right.rowId);
    }
    return (left.trackId ?? "").localeCompare(right.trackId ?? "");
  });
}

/**
 * analyzer 결과에서 marker layer가 사용할 item 목록을 만든다.
 * - 인수 : analysis : analyzer가 확정한 문서 분석 결과
 * - 반환값 : CanvasMarkerItem[] : renderer-owned marker 표시 item 목록
 */
export function buildCanvasMarkerItems(
  analysis: AnalysisResult,
): CanvasMarkerItem[] {
  const items: CanvasMarkerItem[] = [];
  const connectedGlissAnchorKeys = new Set<string>();
  const noteEvents = collectNoteEvents(analysis);

  // trackResults를 순회하며 관계 이벤트인 GlissEvent를 marker item으로 변환하고 연결된 anchor를 기록한다.
  for (const trackResult of analysis.trackResults) {
    for (const event of trackResult.events) {
      if (!isGlissEvent(event)) {
        if (isTupletGroupEvent(event)) {
          items.push({
            kind: "tupletContainer",
            rowId: event.containerRowId,
            startTick: timeFractionToNumber(event.time.startTick),
            endTick: timeFractionToNumber(event.time.endTick),
            divNum: event.divNum,
            trackId: event.trackId,
          });
        } else if (isTupletExtendGroupEvent(event)) {
          items.push({
            kind: "tupletContainer",
            rowId: event.rowId,
            startTick: timeFractionToNumber(event.time.startTick),
            endTick: timeFractionToNumber(event.time.endTick),
            divNum: null,
            trackId: event.trackId,
          });
        }

        continue;
      }

      event.sourceCells.forEach((source) => {
        connectedGlissAnchorKeys.add(createGlissAnchorKey(event.trackId, event.glissId, source));
      });
      items.push({
        kind: "gliss",
        startRowId: event.startDisplay.rowId,
        startCentOffset: event.startDisplay.centOffset,
        startTick: timeFractionToNumber(event.startAnchorTick),
        endRowId: event.endDisplay.rowId,
        endCentOffset: event.endDisplay.centOffset,
        endTick: timeFractionToNumber(event.endAnchorTick),
        hasTrem: hasTremOnStartAnchor(event, noteEvents),
        trackId: event.trackId,
      });
    }
  }

  // 연결된 GlissEvent를 만들지 못한 note 내부 gliss anchor는 편집용 orphan marker로 변환한다.
  for (const trackResult of analysis.trackResults) {
    for (const event of trackResult.events) {
      if (!isNoteEvent(event)) {
        continue;
      }

      for (const anchor of event.glissAnchors) {
        const key = createGlissAnchorKey(event.trackId, anchor.glissId, anchor.source);

        if (connectedGlissAnchorKeys.has(key)) {
          continue;
        }

        items.push({
          kind: "glissOrphanAnchor",
          rowId: anchor.display.rowId,
          centOffset: anchor.display.centOffset,
          tick: timeRangeCenterToNumber(anchor.time),
          role: anchor.role,
          trackId: event.trackId,
        });
      }
    }
  }

  // marker draw 순서가 입력 순서에 의존하지 않도록 시간과 행 순서로 정렬한다.
  return items.sort((left, right) => {
    const leftTick = getMarkerSortTick(left);
    const rightTick = getMarkerSortTick(right);

    if (leftTick !== rightTick) {
      return leftTick - rightTick;
    }

    const leftRowId = getMarkerSortRowId(left);
    const rightRowId = getMarkerSortRowId(right);

    if (leftRowId !== rightRowId) {
      return leftRowId.localeCompare(rightRowId);
    }
    return getMarkerSortTrackId(left).localeCompare(getMarkerSortTrackId(right));
  });
}

/**
 * analyzer 결과에서 NoteEvent만 모은다.
 * - 인수 : analysis : analyzer가 확정한 문서 분석 결과
 * - 반환값 : NoteEvent[] : gliss와 trem 겹침 판정에 사용할 note event 목록
 */
function collectNoteEvents(analysis: AnalysisResult): NoteEvent[] {
  const noteEvents: NoteEvent[] = [];

  // 모든 track result를 순회하며 실제 발음 이벤트만 모은다.
  for (const trackResult of analysis.trackResults) {
    for (const event of trackResult.events) {
      if (isNoteEvent(event)) {
        noteEvents.push(event);
      }
    }
  }

  return noteEvents;
}

/**
 * gliss segment 시작 anchor의 note/slot에 trem effect가 있는지 확인한다.
 * - 인수 : glissEvent : marker로 변환할 gliss event
 * - 인수 : noteEvents : 같은 분석 결과 안의 note event 목록
 * - 반환값 : boolean : 시작 anchor가 놓인 구간에 trem이 있는지 여부
 */
function hasTremOnStartAnchor(
  glissEvent: GlissEvent,
  noteEvents: NoteEvent[],
): boolean {
  const startSource = glissEvent.sourceCells[0];

  if (startSource === undefined) {
    return false;
  }

  // trem+gliss 점선은 시작 anchor의 오른쪽 outgoing segment에만 적용한다.
  return noteEvents.some((event) => {
    if (event.trackId !== glissEvent.trackId) {
      return false;
    }

    const startAnchor = event.glissAnchors.find((anchor) =>
      anchor.glissId === glissEvent.glissId &&
      anchor.role === glissEvent.fromKind &&
      sourceCellsMatch(anchor.source, startSource)
    );

    if (startAnchor === undefined) {
      return false;
    }

    const anchorStartTick = timeFractionToNumber(startAnchor.time.startTick);
    const anchorEndTick = timeFractionToNumber(startAnchor.time.endTick);

    return event.effects.some((effect) =>
      effect.trem !== null &&
      effect.trem !== undefined &&
      rangesOverlap(
        anchorStartTick,
        anchorEndTick,
        timeFractionToNumber(effect.time.startTick),
        timeFractionToNumber(effect.time.endTick),
      ),
    );
  });
}

/**
 * 두 source cell 참조가 같은 일반 cell 또는 같은 tuplet slot을 가리키는지 확인한다.
 * - 인수 : left : 왼쪽 source cell 참조
 * - 인수 : right : 오른쪽 source cell 참조
 * - 반환값 : boolean : row/col/slotIndex가 모두 같은지 여부
 */
function sourceCellsMatch(left: SourceCellRef, right: SourceCellRef): boolean {
  return left.rowId === right.rowId &&
    left.col === right.col &&
    (left.slotIndex ?? null) === (right.slotIndex ?? null);
}

/**
 * 두 배타적 tick 범위가 겹치는지 확인한다.
 * - 인수 : leftStart : 첫 범위 시작 tick
 * - 인수 : leftEnd : 첫 범위 배타적 끝 tick
 * - 인수 : rightStart : 둘째 범위 시작 tick
 * - 인수 : rightEnd : 둘째 범위 배타적 끝 tick
 * - 반환값 : boolean : 두 범위에 공통 구간이 있는지 여부
 */
function rangesOverlap(
  leftStart: number,
  leftEnd: number,
  rightStart: number,
  rightEnd: number,
): boolean {
  return leftStart < rightEnd && rightStart < leftEnd;
}

/**
 * gliss anchor 연결 여부 판정에 사용할 key를 만든다.
 * - 인수 : trackId : anchor가 속한 track
 * - 인수 : glissId : gliss 연결 id
 * - 인수 : rowId : anchor 원본 rowId
 * - 인수 : col : anchor 원본 col
 * - 반환값 : 연결 anchor set 조회 key
 */
function createGlissAnchorKey(
  trackId: string,
  glissId: string,
  source: SourceCellRef,
): string {
  return `${trackId}|${glissId}|${source.rowId}|${source.col}|${source.slotIndex ?? ""}`;
}

/**
 * marker item의 정렬 tick을 가져온다.
 * - 인수 : item : 정렬 대상 marker item
 * - 반환값 : number : marker 시간 순서 기준 tick
 */
function getMarkerSortTick(item: CanvasMarkerItem): number {
  if (item.kind === "gliss") {
    return item.startTick;
  }

  if (item.kind === "glissOrphanAnchor") {
    return item.tick;
  }

  if (item.kind === "tupletContainer") {
    return item.startTick;
  }

  return item.tick;
}

/**
 * marker item의 정렬 rowId를 가져온다.
 * - 인수 : item : 정렬 대상 marker item
 * - 반환값 : string : marker 행 순서 fallback 기준 rowId
 */
function getMarkerSortRowId(item: CanvasMarkerItem): string {
  if (item.kind === "gliss") {
    return item.startRowId;
  }

  if (item.kind === "glissOrphanAnchor") {
    return item.rowId;
  }

  if (item.kind === "tupletContainer") {
    return item.rowId;
  }

  return "";
}

/**
 * marker item의 정렬 trackId를 가져온다.
 * - 인수 : item : 정렬 대상 marker item
 * - 반환값 : string : marker track 순서 fallback 기준 trackId
 */
function getMarkerSortTrackId(item: CanvasMarkerItem): string {
  if (
    item.kind === "gliss" ||
    item.kind === "glissOrphanAnchor" ||
    item.kind === "tupletContainer"
  ) {
    return item.trackId ?? "";
  }

  return "";
}

/**
 * analyzer event를 NoteEvent로 좁힌다.
 * - 인수 : event : analyzer event 후보
 * - 반환값 : boolean : NoteEvent 여부
 */
function isNoteEvent(event: AnalyzedEvent): event is NoteEvent {
  return event.eventKind === "note";
}

/**
 * analyzer event를 GlissEvent로 좁힌다.
 * - 인수 : event : analyzer event 후보
 * - 반환값 : boolean : GlissEvent 여부
 */
function isGlissEvent(event: AnalyzedEvent): event is GlissEvent {
  return event.eventKind === "gliss";
}

/**
 * analyzer event를 MuteEvent로 좁힌다.
 * - 인수 : event : analyzer event 후보
 * - 반환값 : boolean : MuteEvent 여부
 */
function isMuteEvent(event: AnalyzedEvent): event is MuteEvent {
  return event.eventKind === "mute";
}

/**
 * analyzer event를 TupletGroupEvent로 좁힌다.
 * - 인수 : event : analyzer event 후보
 * - 반환값 : boolean : TupletGroupEvent 여부
 */
function isTupletGroupEvent(event: AnalyzedEvent): event is TupletGroupEvent {
  return event.eventKind === "tupletGroup";
}

/**
 * analyzer event를 TupletExtendGroupEvent로 좁힌다.
 * - 인수 : event : analyzer event 후보
 * - 반환값 : boolean : TupletExtendGroupEvent 여부
 */
function isTupletExtendGroupEvent(
  event: AnalyzedEvent,
): event is TupletExtendGroupEvent {
  return event.eventKind === "tupletExtendGroup";
}

/**
 * analyzer 시간 분수를 renderer tick number로 변환한다.
 * - 인수 : value : analyzer TimeFraction 값
 * - 반환값 : number : canvas x 좌표 계산에 사용할 tick 값
 */
function timeFractionToNumber(value: TimeFraction): number {
  return value.numerator / value.denominator;
}

/**
 * TimeRange의 중심 tick을 renderer number tick으로 변환한다.
 * - 인수 : time : analyzer TimeRange 값
 * - 반환값 : number : canvas x 좌표 계산에 사용할 중심 tick 값
 */
function timeRangeCenterToNumber(time: TimeRange): number {
  return (
    timeFractionToNumber(time.startTick) +
    timeFractionToNumber(time.endTick)
  ) / 2;
}
