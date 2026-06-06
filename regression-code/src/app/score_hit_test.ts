/**
 * renderer layout 좌표를 score cell 선택 좌표로 변환한다.
 */

import type { CanvasScoreLayout } from "../renderer/canvas_types";
import type { ScoreHit } from "./app_types";

/**
 * score click 좌표를 renderer layout 기준 score cell 좌표로 변환한다.
 * - 인수 : event : score canvas stage에서 발생한 pointer event
 * - 인수 : stage : score canvas stage DOM 요소
 * - 인수 : layout : 마지막 renderer 호출이 계산한 score layout
 * - 반환값 : score 좌표 hit, 범위 밖이면 null
 */
export function hitTestScoreCell(
  event: MouseEvent,
  stage: HTMLElement,
  layout: CanvasScoreLayout,
): ScoreHit | null {
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor(x / layout.columnWidth);

  // column 또는 row 범위를 벗어난 click은 score mutation 대상으로 보지 않는다.
  if (col < 0 || col >= layout.columnCount) {
    return null;
  }

  const row = layout.rows.find(
    (layoutRow) => layoutRow.y <= y && y < layoutRow.y + layoutRow.height,
  );

  if (row === undefined) {
    return null;
  }

  return {
    rowId: row.rowId,
    rowKind: row.kind,
    col,
  };
}
