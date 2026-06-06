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

  // viewport 기준 pointer 좌표에서 stage의 viewport 기준 위치를 빼 score stage 내부 좌표를 계산한다.
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // column width로 x 좌표를 나누어 col 인덱스를 계산한다.
  const col = Math.floor(x / layout.columnWidth);

  // column 범위를 벗어난 click은 null을 반환한다.
  if (col < 0 || col >= layout.columnCount) {
    return null;
  }

  // layout의 rows 배열 내부 row 중 범위 내에 클릭 y 좌표를 포함하는 row를 찾는다.
  const row = layout.rows.find(
    (layoutRow) => (layoutRow.y <= y) && (y < layoutRow.y + layoutRow.height),
  );

  // 클릭 y 좌표를 포함하는 row가 없으면 null을 반환한다.
  if (row === undefined) {
    return null;
  }

  // stage 내부 좌표에 대응되는 score row/column 정보를 반환한다.
  return {
    rowId: row.rowId,
    rowKind: row.kind,
    col,
  };
}
