/**
 * analyzer 기반 marker item을 score marker layer에 그린다.
 */

import { columnToX } from "./canvas_coordinate";
import {
  CANVAS_COLORS,
  CANVAS_METRICS,
} from "./canvas_theme";
import type {
  CanvasLayoutRow,
  CanvasMarkerItem,
  CanvasScoreLayout,
} from "./canvas_types";

const TRACK_EXTRA = "extra";

/**
 * marker render item 목록을 canvas에 그린다.
 * - 인수 : context : marker layer canvas 2D context
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 인수 : items : marker 표시 item 목록
 * - 반환값 : 없음
 */
export function drawScoreMarkers(
  context: CanvasRenderingContext2D,
  layout: CanvasScoreLayout,
  items: CanvasMarkerItem[],
): void {
  context.clearRect(0, 0, layout.stageWidth, layout.stageHeight);

  const rowById = createLayoutRowMap(layout);

  // marker item 종류별로 score 좌표를 계산해 marker layer에 그린다.
  for (const item of items) {
    if (item.kind === "gliss") {
      drawGlissMarker(context, layout, rowById, item);
    } else if (item.kind === "glissOrphanAnchor") {
      drawGlissOrphanAnchorMarker(context, layout, rowById, item);
    }
  }
}

/**
 * layout row를 rowId 기준 Map으로 만든다.
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : Map<string, CanvasLayoutRow> : marker item row 조회용 Map
 */
function createLayoutRowMap(
  layout: CanvasScoreLayout,
): Map<string, CanvasLayoutRow> {
  const rowById = new Map<string, CanvasLayoutRow>();

  // layout.rows를 순회하며 marker item이 참조할 수 있는 모든 row 좌표를 저장한다.
  for (const row of layout.rows) {
    rowById.set(row.rowId, row);
  }

  return rowById;
}

/**
 * gliss marker item을 두 anchor 중심을 잇는 선으로 그린다.
 * - 인수 : context : marker layer canvas 2D context
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 인수 : rowById : layout row 조회 Map
 * - 인수 : item : gliss marker item
 * - 반환값 : 없음
 */
function drawGlissMarker(
  context: CanvasRenderingContext2D,
  layout: CanvasScoreLayout,
  rowById: Map<string, CanvasLayoutRow>,
  item: Extract<CanvasMarkerItem, { kind: "gliss" }>,
): void {
  const startRow = rowById.get(item.startRowId);
  const endRow = rowById.get(item.endRowId);

  if (
    startRow === undefined ||
    endRow === undefined ||
    startRow.kind !== "note" ||
    endRow.kind !== "note"
  ) {
    return;
  }

  const startX = getAnchorX(item.startTick, layout);
  const endX = getAnchorX(item.endTick, layout);
  const startY = getDisplayCenterY(startRow, item.startCentOffset, layout);
  const endY = getDisplayCenterY(endRow, item.endCentOffset, layout);

  context.save();
  context.strokeStyle = item.trackId === TRACK_EXTRA
    ? CANVAS_COLORS.extraGlissLine
    : CANVAS_COLORS.glissLine;
  context.lineWidth = CANVAS_METRICS.glissLineWidth;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
  context.restore();
}

/**
 * 연결되지 않은 gliss anchor를 편집 보조용 짧은 선으로 그린다.
 * - 인수 : context : marker layer canvas 2D context
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 인수 : rowById : layout row 조회 Map
 * - 인수 : item : orphan gliss anchor marker item
 * - 반환값 : 없음
 */
function drawGlissOrphanAnchorMarker(
  context: CanvasRenderingContext2D,
  layout: CanvasScoreLayout,
  rowById: Map<string, CanvasLayoutRow>,
  item: Extract<CanvasMarkerItem, { kind: "glissOrphanAnchor" }>,
): void {
  const row = rowById.get(item.rowId);

  if (row === undefined || row.kind !== "note") {
    return;
  }

  const anchorX = getAnchorX(item.tick, layout);
  const anchorY = getDisplayCenterY(row, item.centOffset, layout);
  const ranges = createOrphanAnchorRanges(anchorX, item.role, layout);

  context.save();
  context.strokeStyle = item.trackId === TRACK_EXTRA
    ? CANVAS_COLORS.extraGlissLine
    : CANVAS_COLORS.glissLine;
  context.lineWidth = CANVAS_METRICS.glissLineWidth;
  context.lineCap = "round";

  // note 사각형 뒤에 있어도 보이도록 셀 중앙이 아닌 바깥쪽 반 칸 구간만 그린다.
  for (const range of ranges) {
    context.beginPath();
    context.moveTo(range.x0, anchorY);
    context.lineTo(range.x1, anchorY);
    context.stroke();
  }

  context.restore();
}

/**
 * orphan anchor role에 따라 짧은 선의 x 범위를 만든다.
 * - 인수 : anchorX : anchor cell 중심 x 좌표
 * - 인수 : role : start/mid/end gliss 역할
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : 왼쪽/오른쪽 orphan 표시 선 범위 목록
 */
function createOrphanAnchorRanges(
  anchorX: number,
  role: "start" | "mid" | "end",
  layout: CanvasScoreLayout,
): Array<{ x0: number; x1: number }> {
  const halfColumn = layout.columnWidth / 2;
  const ranges: Array<{ x0: number; x1: number }> = [];

  if (role === "end" || role === "mid") {
    ranges.push({
      x0: anchorX - halfColumn * 2,
      x1: anchorX - halfColumn,
    });
  }

  if (role === "start" || role === "mid") {
    ranges.push({
      x0: anchorX + halfColumn,
      x1: anchorX + halfColumn * 2,
    });
  }

  return ranges;
}

/**
 * gliss anchor tick을 note rectangle 내부 anchor x 좌표로 변환한다.
 * - 인수 : tick : anchor가 속한 tick
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : number : marker layer x 좌표
 */
function getAnchorX(tick: number, layout: CanvasScoreLayout): number {
  return columnToX(tick, layout) + layout.columnWidth / 2;
}

/**
 * microPitch centOffset을 note row 중심 y 좌표로 변환한다.
 * - 인수 : row : 기준 note row layout
 * - 인수 : centOffset : -100~100 cent 단위 표시 위치 보정값
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : number : 보정이 반영된 note 중심 y 좌표
 */
function getDisplayCenterY(
  row: CanvasLayoutRow,
  centOffset: number,
  layout: CanvasScoreLayout,
): number {
  const baseCenter = row.y + row.height / 2;

  if (centOffset === 0) {
    return baseCenter;
  }

  const noteRows = layout.rows.filter((candidate) => candidate.kind === "note");
  const rowIndex = noteRows.findIndex((candidate) => candidate.rowId === row.rowId);

  if (rowIndex === -1) {
    return baseCenter;
  }

  const direction = centOffset > 0 ? -1 : 1;
  const targetRow = noteRows[rowIndex + direction];

  if (targetRow !== undefined) {
    const targetCenter = targetRow.y + targetRow.height / 2;

    return baseCenter + (targetCenter - baseCenter) * (Math.abs(centOffset) / 100);
  }

  // 악기 범위 끝에서는 이웃 note row 간격을 구할 수 없으므로 현재 row 높이만큼 외삽한다.
  return baseCenter - Math.sign(centOffset) * row.height * (Math.abs(centOffset) / 100);
}
