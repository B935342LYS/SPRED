/**
 * canvas score renderer의 public 진입점이다.
 */

import {
  buildCanvasScoreLayout,
  resizeCanvasLayers,
} from "./canvas_coordinate";
import { drawLayoutGrid, drawScoreGrid } from "./canvas_grid_renderer";
import { drawScoreNotes } from "./canvas_note_renderer";
import type {
  CanvasAnalyzedRenderInput,
  CanvasRenderInput,
  CanvasRenderOptions,
  CanvasRenderResult,
  CanvasRenderTarget,
  CanvasNoteRenderItem,
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
  input: CanvasRenderInput | CanvasAnalyzedRenderInput,
  options: CanvasRenderOptions,
): CanvasRenderResult {
  const layout = buildCanvasScoreLayout(input, options);
  const noteItems = getNoteItems(input);

  resizeCanvasLayers(target, layout, options);
  drawLayoutGrid(target.layout.context, layout);
  drawScoreGrid(target.base.context, layout);
  drawScoreNotes(target.note.context, layout, noteItems);
  clearLayer(target.marker.context, layout.stageWidth, layout.stageHeight);

  return {
    layout,
  };
}

/**
 * renderer 입력에서 note item 목록을 꺼낸다.
 * - 인수 : input : base-only 또는 analyzer 연결 renderer 입력
 * - 반환값 : CanvasNoteRenderItem[] : note layer가 그릴 item 목록
 */
function getNoteItems(
  input: CanvasRenderInput | CanvasAnalyzedRenderInput,
): CanvasNoteRenderItem[] {
  if ("noteItems" in input) {
    return input.noteItems;
  }

  return [];
}
