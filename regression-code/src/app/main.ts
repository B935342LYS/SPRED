/**
 * 브라우저 앱 진입점이다.
 * sample RuntimeDocument를 canvas renderer 입력으로 변환해 base grid를 표시한다.
 */

import { loadRuntimeDocument } from "../core/score/create_runtime_document";
import { createCanvasRenderInput } from "./canvas_renderer_adapter";
import { renderCanvasScore } from "../renderer/canvas_score_renderer";
import sampleScoreJson from "../../dev/test_cases/minimal-valid-score.json?raw";
import type {
  CanvasLayerTarget,
  CanvasRenderOptions,
  CanvasRenderTarget,
} from "../renderer/canvas_types";

const DEFAULT_LAYOUT_PADDING_COLUMNS = {
  left: 0,
  right: 1,
};

/**
 * selector에 해당하는 HTML 요소를 찾고 타입을 확인한다.
 * - 인수 : selector : 조회할 CSS selector
 * - 인수 : ctor : 기대하는 HTMLElement 생성자
 * - 반환값 : 타입이 확인된 HTML 요소
 */
function queryElement<T extends HTMLElement>(
  selector: string,
  ctor: { new (): T },
): T {
  const element = document.querySelector(selector);

  if (!(element instanceof ctor)) {
    throw new Error(`Missing element: ${selector}`);
  }

  return element;
}

/**
 * canvas element에서 2D rendering target을 만든다.
 * - 인수 : selector : canvas selector
 * - 반환값 : canvas와 2D context 묶음
 */
function createCanvasLayerTarget(selector: string): CanvasLayerTarget {
  const canvas = queryElement(selector, HTMLCanvasElement);
  const context = canvas.getContext("2d");

  if (context === null) {
    throw new Error(`2D context is unavailable: ${selector}`);
  }

  return {
    canvas,
    context,
  };
}

/**
 * DOM에 배치된 canvas layer를 renderer target으로 묶는다.
 * - 인수 : 없음
 * - 반환값 : renderer가 사용할 canvas target 묶음
 */
function createCanvasRenderTarget(): CanvasRenderTarget {
  return {
    layout: createCanvasLayerTarget(".label-layer"),
    base: createCanvasLayerTarget(".base-layer"),
    note: createCanvasLayerTarget(".note-layer"),
    marker: createCanvasLayerTarget(".marker-layer"),
  };
}

/**
 * status footer의 특정 위치 문구를 바꾼다.
 * - 인수 : index : 바꿀 status span 순서
 * - 인수 : text : 표시할 문구
 * - 반환값 : 없음
 */
function setStatus(index: number, text: string): void {
  const items = document.querySelectorAll(".status-area span");
  const item = items.item(index);

  if (item !== null) {
    item.textContent = text;
  }
}

/**
 * layout label canvas를 score 영역의 세로 스크롤과 동기화한다.
 * - 인수 : scoreArea : score canvas scroll container
 * - 인수 : layoutStage : layout label canvas stage
 * - 반환값 : 없음
 */
function syncLayoutScroll(
  scoreArea: HTMLElement,
  layoutStage: HTMLElement,
): void {
  layoutStage.style.transform = `translateY(${-scoreArea.scrollTop}px)`;
}

/**
 * 현재 DOM 상태와 UI 옵션으로 renderer option을 만든다.
 * - 인수 : layoutCanvas : layout label canvas
 * - 반환값 : renderer 좌표 계산 옵션
 */
function createRenderOptions(layoutCanvas: HTMLCanvasElement): CanvasRenderOptions {
  const zoomInput = queryElement(".menu-panel input[type='range']", HTMLInputElement);
  const zoom = Number(zoomInput.value) / 100;

  return {
    zoom,
    devicePixelRatio: window.devicePixelRatio || 1,
    layoutWidth: layoutCanvas.clientWidth,
    layoutLeftPaddingColumns: DEFAULT_LAYOUT_PADDING_COLUMNS.left,
    layoutRightPaddingColumns: DEFAULT_LAYOUT_PADDING_COLUMNS.right,
  };
}

/**
 * renderer 결과 크기를 CSS 변수에 반영해 scroll container와 canvas style을 맞춘다.
 * - 인수 : stageWidth : score stage CSS pixel 너비
 * - 인수 : stageHeight : score stage CSS pixel 높이
 * - 반환값 : 없음
 */
function updateStageCssVars(stageWidth: number, stageHeight: number): void {
  document.documentElement.style.setProperty(
    "--score-stage-width",
    `${stageWidth}px`,
  );
  document.documentElement.style.setProperty(
    "--score-stage-height",
    `${stageHeight}px`,
  );
}

/**
 * sample JSON을 로드하고 base canvas renderer를 실행한다.
 * - 인수 : 없음
 * - 반환값 : 없음
 */
async function boot(): Promise<void> {
  const scoreArea = queryElement(".score-area", HTMLElement);
  const layoutStage = queryElement(".layout-canvas-stage", HTMLElement);
  const target = createCanvasRenderTarget();
  const loadResult = loadRuntimeDocument(sampleScoreJson);

  if (!loadResult.ok) {
    throw new Error(loadResult.error.message);
  }

  const renderInput = createCanvasRenderInput(loadResult.document);

  const render = (): void => {
    const result = renderCanvasScore(
      target,
      renderInput,
      createRenderOptions(target.layout.canvas),
    );
    updateStageCssVars(result.layout.stageWidth, result.layout.stageHeight);
    syncLayoutScroll(scoreArea, layoutStage);
    setStatus(2, `renderer: ${result.layout.rows.length} rows`);
  };

  render();
  setStatus(0, "sample auto load: done");
  setStatus(1, "analysis: not connected");

  scoreArea.addEventListener("scroll", () => syncLayoutScroll(scoreArea, layoutStage));
  window.addEventListener("resize", render);
  document
    .querySelector(".menu-panel input[type='range']")
    ?.addEventListener("change", render);
}

window.addEventListener("DOMContentLoaded", () => {
  boot().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown boot error.";
    setStatus(0, "sample auto load: failed");
    setStatus(1, message);
  });
});
