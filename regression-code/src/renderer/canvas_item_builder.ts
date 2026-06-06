/**
 * analyzer 결과를 renderer-owned canvas item으로 변환한다.
 */

import type {
  AnalysisResult,
  AnalyzedEvent,
  GlissEvent,
  MuteEvent,
  NoteEvent,
  TimeFraction,
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
  const seenMidAnchorKeys = new Set<string>();

  // trackResults를 순회하며 관계 이벤트인 GlissEvent를 marker item으로 변환하고 연결된 anchor를 기록한다.
  for (const trackResult of analysis.trackResults) {
    for (const event of trackResult.events) {
      if (!isGlissEvent(event)) {
        continue;
      }

      event.sourceCells.forEach((source) => {
        connectedGlissAnchorKeys.add(createGlissAnchorKey(event.trackId, event.glissId, source.rowId, source.col));
      });
      items.push({
        kind: "gliss",
        startRowId: event.startDisplay.rowId,
        startCentOffset: event.startDisplay.centOffset,
        startTick: event.sourceCells[0]?.col ?? timeFractionToNumber(event.time.startTick),
        endRowId: event.endDisplay.rowId,
        endCentOffset: event.endDisplay.centOffset,
        endTick: event.sourceCells[1]?.col ?? timeFractionToNumber(event.time.endTick),
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
        if (anchor.role === "mid") {
          const midKey = `${event.trackId}|${anchor.glissId}|${anchor.source.col}`;

          if (seenMidAnchorKeys.has(midKey)) {
            continue;
          }

          seenMidAnchorKeys.add(midKey);
        }

        const key = createGlissAnchorKey(
          event.trackId,
          anchor.glissId,
          anchor.source.rowId,
          anchor.source.col,
        );

        if (connectedGlissAnchorKeys.has(key)) {
          continue;
        }

        items.push({
          kind: "glissOrphanAnchor",
          rowId: anchor.display.rowId,
          centOffset: anchor.display.centOffset,
          tick: anchor.source.col,
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
  rowId: string,
  col: number,
): string {
  return `${trackId}|${glissId}|${rowId}|${col}`;
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

  return "";
}

/**
 * marker item의 정렬 trackId를 가져온다.
 * - 인수 : item : 정렬 대상 marker item
 * - 반환값 : string : marker track 순서 fallback 기준 trackId
 */
function getMarkerSortTrackId(item: CanvasMarkerItem): string {
  if (item.kind === "gliss" || item.kind === "glissOrphanAnchor") {
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
 * analyzer 시간 분수를 renderer tick number로 변환한다.
 * - 인수 : value : analyzer TimeFraction 값
 * - 반환값 : number : canvas x 좌표 계산에 사용할 tick 값
 */
function timeFractionToNumber(value: TimeFraction): number {
  return value.numerator / value.denominator;
}
