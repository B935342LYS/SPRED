/**
 * layout label canvas와 score base canvas의 grid/background를 그린다.
 */

import { columnToX } from "./canvas_coordinate";
import type { CanvasScoreLayout } from "./canvas_types";

const COLORS = {
  rollBackground: "#525252",
  noteRowBackground: "#646464",
  gridStrong: "rgba(255,255,255,0.18)",
  gridSoft: "rgba(255,255,255,0.12)",
  labelText: "rgba(255,255,255,0.92)",
  labelLine: "rgba(255,255,255,0.18)",
  boundary: "rgba(255,80,80,0.35)",
  boundaryLine: "rgba(255,120,120,0.8)",
};

/**
 * layout label 영역의 row background, label, playback boundary 표시를 그린다.
 * - 인수 : context : layout canvas 2D context
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : 없음
 */
export function drawLayoutGrid(
  context: CanvasRenderingContext2D,
  layout: CanvasScoreLayout,
): void {
  context.clearRect(0, 0, layout.layoutWidth, layout.stageHeight);
  context.fillStyle = COLORS.rollBackground;
  context.fillRect(0, 0, layout.layoutWidth, layout.stageHeight);
  context.font = "700 12px Arial, sans-serif";
  context.textBaseline = "middle";

  for (const row of layout.rows) {
    if (row.kind === "note") {
      context.fillStyle = COLORS.noteRowBackground;
      context.fillRect(0, row.y, layout.layoutWidth, row.height);
    }

    context.strokeStyle = COLORS.labelLine;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, row.y + row.height + 0.5);
    context.lineTo(layout.layoutWidth, row.y + row.height + 0.5);
    context.stroke();

    if (row.label !== "") {
      context.fillStyle = COLORS.labelText;
      context.fillText(
        row.label,
        Math.max(10, layout.layoutLeftPaddingWidth + 10),
        row.y + row.height / 2,
      );
    }
  }

  // playback 기준 시각화는 score column 좌표와 섞지 않고 layout 영역 안에서만 그린다.
  if (layout.layoutRightPaddingWidth > 0) {
    const overlayWidth = layout.layoutRightPaddingWidth / 2;
    context.fillStyle = COLORS.boundary;
    context.fillRect(
      layout.layoutWidth - overlayWidth,
      0,
      overlayWidth,
      layout.stageHeight,
    );
  }

  context.strokeStyle = COLORS.boundaryLine;
  context.beginPath();
  context.moveTo(layout.layoutPlaybackBoundaryX - 0.5, 0);
  context.lineTo(layout.layoutPlaybackBoundaryX - 0.5, layout.stageHeight);
  context.stroke();
}

/**
 * score base 영역의 row background와 column/row grid를 그린다.
 * - 인수 : context : base canvas 2D context
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : 없음
 */
export function drawScoreGrid(
  context: CanvasRenderingContext2D,
  layout: CanvasScoreLayout,
): void {
  context.clearRect(0, 0, layout.stageWidth, layout.stageHeight);
  context.fillStyle = COLORS.rollBackground;
  context.fillRect(0, 0, layout.stageWidth, layout.stageHeight);

  for (const row of layout.rows) {
    if (row.kind === "note") {
      context.fillStyle = COLORS.noteRowBackground;
      context.fillRect(0, row.y, layout.stageWidth, row.height);
    }
  }

  context.lineWidth = 1;

  for (let column = 0; column <= layout.columnCount; column += 1) {
    const x = columnToX(column, layout);
    context.strokeStyle =
      column % 4 === 0 ? COLORS.gridStrong : COLORS.gridSoft;
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, layout.stageHeight);
    context.stroke();
  }

  for (const row of layout.rows) {
    context.strokeStyle = COLORS.gridSoft;
    context.beginPath();
    context.moveTo(0, row.y + row.height + 0.5);
    context.lineTo(layout.stageWidth, row.y + row.height + 0.5);
    context.stroke();
  }
}
