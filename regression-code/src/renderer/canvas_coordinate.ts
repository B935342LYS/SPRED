/**
 * CanvasRenderInput을 CSS pixel 기준 CanvasScoreLayout으로 변환하고 canvas bitmap 크기를 맞춘다.
 */

import type {
  CanvasLayerTarget,
  CanvasRenderInput,
  CanvasRenderOptions,
  CanvasRenderTarget,
  CanvasScoreLayout,
} from "./canvas_types";

const DEFAULT_LAYOUT_WIDTH = 208;
const MAX_CANVAS_BITMAP_DIMENSION = 16_384;
const MAX_CANVAS_BITMAP_AREA = 67_108_864;

type NormalizedCanvasRenderOptions = {
  zoom: number;
  devicePixelRatio: number;
  layoutWidth: number;
  columnWidth: number;
  layoutLeftPaddingColumns: number;
  layoutRightPaddingColumns: number;
};

/**
 * 숫자 옵션이 유효한 양수인지 확인한다.
 * - 인수 : value : 검사할 숫자
 * - 반환값 : 양수 finite number 여부
 */
function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

/**
 * 숫자 옵션이 유효한 0 이상 값인지 확인한다.
 * - 인수 : value : 검사할 숫자
 * - 반환값 : 0 이상 finite number 여부
 */
function isNonNegativeFinite(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

/**
 * 큰 score canvas가 브라우저 bitmap 한계를 넘지 않도록 layer별 DPR을 낮춘다.
 * - 인수 : cssWidth : CSS pixel 기준 너비
 * - 인수 : cssHeight : CSS pixel 기준 높이
 * - 인수 : requestedDevicePixelRatio : 화면에서 요청한 DPR
 * - 반환값 : canvas bitmap 한계를 넘지 않는 effective DPR
 */
function clampDevicePixelRatioForCanvas(
  cssWidth: number,
  cssHeight: number,
  requestedDevicePixelRatio: number,
): number {
  const dimensionLimitedRatio = Math.min(
    requestedDevicePixelRatio,
    MAX_CANVAS_BITMAP_DIMENSION / Math.max(1, cssWidth),
    MAX_CANVAS_BITMAP_DIMENSION / Math.max(1, cssHeight),
  );
  const areaLimitedRatio = Math.sqrt(
    MAX_CANVAS_BITMAP_AREA / Math.max(1, cssWidth * cssHeight),
  );

  return Math.max(0.25, Math.min(dimensionLimitedRatio, areaLimitedRatio));
}

/**
 * renderer 옵션을 좌표 계산에 안전한 값으로 정규화한다.
 * - 인수 : input : renderer 입력 DTO
 * - 인수 : options : UI/app controller에서 전달한 렌더 옵션
 * - 반환값 : 기본값과 유효 범위가 반영된 options
 */
function normalizeCanvasRenderOptions(
  input: CanvasRenderInput,
  options: CanvasRenderOptions,
): NormalizedCanvasRenderOptions {
  const zoom = isPositiveFinite(options.zoom) ? options.zoom : 1;
  const devicePixelRatio = isPositiveFinite(options.devicePixelRatio)
    ? options.devicePixelRatio
    : 1;
  const layoutWidth = isPositiveFinite(options.layoutWidth)
    ? options.layoutWidth
    : DEFAULT_LAYOUT_WIDTH;
  const baseColumnWidth = isPositiveFinite(input.baseColumnWidthPx)
    ? input.baseColumnWidthPx
    : 1;
  const optionColumnWidth =
    options.columnWidth === undefined ? baseColumnWidth : options.columnWidth;
  const columnWidth = isPositiveFinite(optionColumnWidth)
    ? optionColumnWidth * zoom
    : baseColumnWidth * zoom;

  return {
    zoom,
    devicePixelRatio,
    layoutWidth,
    columnWidth,
    layoutLeftPaddingColumns: isNonNegativeFinite(
      options.layoutLeftPaddingColumns,
    )
      ? options.layoutLeftPaddingColumns
      : 0,
    layoutRightPaddingColumns: isNonNegativeFinite(
      options.layoutRightPaddingColumns,
    )
      ? options.layoutRightPaddingColumns
      : 0,
  };
}

/**
 * column/tick 값을 CSS pixel x 좌표로 바꾼다.
 * - 인수 : column : 변환할 column 또는 tick 값
 * - 인수 : layout : 공유 좌표 layout
 * - 반환값 : score canvas 내부 x 좌표
 */
export function columnToX(column: number, layout: CanvasScoreLayout): number {
  return column * layout.columnWidth;
}

/**
 * renderer 입력 DTO에서 row 누적 좌표와 stage metric을 계산한다.
 * - 인수 : input : renderer 입력 DTO
 * - 인수 : options : UI/app controller에서 전달한 렌더 옵션
 * - 반환값 : canvas layer가 공유할 CSS pixel 좌표 모델
 */
export function buildCanvasScoreLayout(
  input: CanvasRenderInput,
  options: CanvasRenderOptions,
): CanvasScoreLayout {
  const normalized = normalizeCanvasRenderOptions(input, options);
  let y = 0;
  const rows = input.rows.map((row) => {
    const height = Math.max(0, row.height * normalized.zoom);
    const layoutRow = {
      rowId: row.rowId,
      kind: row.kind,
      label: row.label,
      y,
      height,
    };
    y += height;
    return layoutRow;
  });
  const columnCount = Math.max(0, Math.floor(input.columnCount));
  const scoreContentWidth = columnCount * normalized.columnWidth;
  const layoutLeftPaddingWidth =
    normalized.layoutLeftPaddingColumns * normalized.columnWidth;
  const layoutRightPaddingWidth =
    normalized.layoutRightPaddingColumns * normalized.columnWidth;

  return {
    rows,
    columnCount,
    columnWidth: normalized.columnWidth,
    scoreContentWidth,
    stageWidth: scoreContentWidth,
    stageHeight: y,
    layoutWidth: normalized.layoutWidth,
    layoutLeftPaddingWidth,
    layoutRightPaddingWidth,
    layoutPlaybackBoundaryX: normalized.layoutWidth,
  };
}

/**
 * canvas bitmap 크기를 CSS pixel 크기와 devicePixelRatio에 맞춘다.
 * - 인수 : target : 크기를 맞출 canvas target
 * - 인수 : cssWidth : CSS pixel 기준 너비
 * - 인수 : cssHeight : CSS pixel 기준 높이
 * - 인수 : devicePixelRatio : bitmap 해상도 보정값
 * - 반환값 : 없음
 */
function resizeCanvasLayer(
  target: CanvasLayerTarget,
  cssWidth: number,
  cssHeight: number,
  devicePixelRatio: number,
): void {
  const effectiveDevicePixelRatio = clampDevicePixelRatioForCanvas(
    cssWidth,
    cssHeight,
    devicePixelRatio,
  );
  const bitmapWidth = Math.max(
    1,
    Math.floor(cssWidth * effectiveDevicePixelRatio),
  );
  const bitmapHeight = Math.max(
    1,
    Math.floor(cssHeight * effectiveDevicePixelRatio),
  );

  target.canvas.style.width = `${cssWidth}px`;
  target.canvas.style.height = `${cssHeight}px`;

  if (target.canvas.width !== bitmapWidth) {
    target.canvas.width = bitmapWidth;
  }
  if (target.canvas.height !== bitmapHeight) {
    target.canvas.height = bitmapHeight;
  }

  target.context.setTransform(
    effectiveDevicePixelRatio,
    0,
    0,
    effectiveDevicePixelRatio,
    0,
    0,
  );
}

/**
 * renderer가 사용하는 모든 canvas layer의 bitmap과 CSS 크기를 동기화한다.
 * - 인수 : target : renderer canvas target 묶음
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 인수 : options : UI/app controller에서 전달한 렌더 옵션
 * - 반환값 : 없음
 */
export function resizeCanvasLayers(
  target: CanvasRenderTarget,
  layout: CanvasScoreLayout,
  options: CanvasRenderOptions,
): void {
  const dpr = isPositiveFinite(options.devicePixelRatio)
    ? options.devicePixelRatio
    : 1;

  resizeCanvasLayer(target.layout, layout.layoutWidth, layout.stageHeight, dpr);
  resizeCanvasLayer(target.base, layout.stageWidth, layout.stageHeight, dpr);
  resizeCanvasLayer(target.note, layout.stageWidth, layout.stageHeight, dpr);
  resizeCanvasLayer(target.marker, layout.stageWidth, layout.stageHeight, dpr);
}
