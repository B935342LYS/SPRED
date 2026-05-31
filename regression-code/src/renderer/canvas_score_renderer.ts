/**
 * canvas score renderer의 public 진입점이다.
 */

import {
  buildCanvasScoreLayout,
  resizeCanvasLayers,
} from "./canvas_coordinate";
import { drawLayoutGrid, drawScoreGrid } from "./canvas_grid_renderer";
import type {
  CanvasRenderInput,
  CanvasRenderOptions,
  CanvasRenderResult,
  CanvasRenderTarget,
} from "./canvas_types";

/**
 * 비어 있는 overlay layer를 CSS pixel 좌표 기준으로 지운다.
 * - 인수 : context : overlay canvas 2D context
 * - 인수 : width : CSS pixel 기준 너비
 * - 인수 : height : CSS pixel 기준 높이
 * - 반환값 : 없음
 */
function clearLayer(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  context.clearRect(0, 0, width, height);
}

/**
 * CanvasRenderInput을 실제 canvas layer에 그린다.
 * - 인수 : target : layout/base/note/marker canvas target
 * - 인수 : input : renderer 전용 입력 DTO
 * - 인수 : options : UI 표시 옵션
 * - 반환값 : 렌더 결과 metadata
 */
export function renderCanvasScore(
  target: CanvasRenderTarget,
  input: CanvasRenderInput,
  options: CanvasRenderOptions,
): CanvasRenderResult {
  const layout = buildCanvasScoreLayout(input, options);

  resizeCanvasLayers(target, layout, options);
  drawLayoutGrid(target.layout.context, layout);
  drawScoreGrid(target.base.context, layout);
  clearLayer(target.note.context, layout.stageWidth, layout.stageHeight);
  clearLayer(target.marker.context, layout.stageWidth, layout.stageHeight);

  return {
    layout,
  };
}
