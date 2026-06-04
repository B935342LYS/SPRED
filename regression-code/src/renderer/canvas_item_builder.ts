/**
 * analyzer 결과를 renderer-owned canvas item으로 변환한다.
 */

import type {
  AnalysisResult,
  AnalyzedEvent,
  NoteEvent,
  TimeFraction,
} from "../core/analyze/types";
import type { CanvasNoteRenderItem } from "./canvas_types";

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
 * analyzer event를 NoteEvent로 좁힌다.
 * - 인수 : event : analyzer event 후보
 * - 반환값 : boolean : NoteEvent 여부
 */
function isNoteEvent(event: AnalyzedEvent): event is NoteEvent {
  return event.eventKind === "note";
}

/**
 * analyzer 시간 분수를 renderer tick number로 변환한다.
 * - 인수 : value : analyzer TimeFraction 값
 * - 반환값 : number : canvas x 좌표 계산에 사용할 tick 값
 */
function timeFractionToNumber(value: TimeFraction): number {
  return value.numerator / value.denominator;
}
