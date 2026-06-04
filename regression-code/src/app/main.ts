/**
 * 브라우저 앱 진입점이다.
 * sample RuntimeDocument를 canvas renderer 입력으로 변환해 base grid를 표시한다.
 */

import { loadRuntimeDocument } from "../core/score/create_runtime_document";
import { buildParsedDocument } from "../core/parse/build_parsed_document";
import { analyzeDocument } from "../core/analyze/analyze_full";
import { createCanvasRenderInput } from "./canvas_renderer_adapter";
import { buildCanvasNoteRenderItems } from "../renderer/canvas_item_builder";
import { renderCanvasScore } from "../renderer/canvas_score_renderer";
import sampleScoreJson from "../../dev/test_cases/minimal-valid-score.json?raw";
import type {
  CanvasAnalyzedRenderInput,
  CanvasLayerTarget,
  CanvasRenderOptions,
  CanvasRenderTarget,
} from "../renderer/canvas_types";

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
 * - 인수 : 없음
 * - 반환값 : renderer 좌표 계산 옵션
 */
function createRenderOptions(): CanvasRenderOptions {
  const zoomInput = queryElement(".menu-panel input[type='range']", HTMLInputElement);
  const zoom = Number(zoomInput.value) / 100;

  return {
    zoom,
    devicePixelRatio: window.devicePixelRatio || 1,
  };
}

/**
 * renderer 결과 크기를 CSS 변수에 반영해 scroll container와 canvas style을 맞춘다.
 * - 인수 : stageWidth : score stage CSS pixel 너비
 * - 인수 : stageHeight : score stage CSS pixel 높이
 * - 인수 : layoutWidth : layout label area CSS pixel 너비
 * - 반환값 : 없음
 */
function updateStageCssVars(
  stageWidth: number,
  stageHeight: number,
  layoutWidth: number,
): void {
  document.documentElement.style.setProperty(
    "--score-stage-width",
    `${stageWidth}px`,
  );
  document.documentElement.style.setProperty(
    "--score-stage-height",
    `${stageHeight}px`,
  );
  document.documentElement.style.setProperty(
    "--label-width",
    `${layoutWidth}px`,
  );
}

/**
 * sample JSON을 로드하고 base canvas renderer를 실행한다.
 * - 인수 : 없음
 * - 반환값 : 없음
 */
async function boot(): Promise<void> {
  // score viewer DOM 요소와 renderer가 사용할 canvas target을 준비한다.
  const scoreArea = queryElement(".score-area", HTMLElement);
  const layoutStage = queryElement(".layout-canvas-stage", HTMLElement);
  const target = createCanvasRenderTarget();
  const loadResult = loadRuntimeDocument(sampleScoreJson);

  if (!loadResult.ok) {
    throw new Error(loadResult.error.message);
  }

  const renderInput = createCanvasRenderInput(loadResult.document);
  const parsed = buildParsedDocument(loadResult.document);
  const analysis = analyzeDocument({
    score: loadResult.document.score,
    indexes: loadResult.document.indexes,
    parsed,
  });
  const analyzedRenderInput: CanvasAnalyzedRenderInput = {
    ...renderInput,
    noteItems: buildCanvasNoteRenderItems(analysis),
  };

  const render = (): void => {
    // CanvasRenderInput과 현재 UI 옵션으로 canvas score를 다시 그린다.
    const result = renderCanvasScore(
      target,
      analyzedRenderInput,
      createRenderOptions(),
    );
    // renderer가 계산한 stage 크기를 CSS 변수에 반영하고 label scroll 위치를 맞춘다.
    updateStageCssVars(
      result.layout.stageWidth,
      result.layout.stageHeight,
      result.layout.layoutWidth,
    );
    syncLayoutScroll(scoreArea, layoutStage);
    setStatus(2, `renderer: ${result.layout.rows.length} rows`);
  };

  render();
  setStatus(0, "sample auto load: done");
  setStatus(1, `analysis: ${analyzedRenderInput.noteItems.length} notes`);

  // score 영역이 스크롤될 때 layout label stage의 세로 위치를 함께 이동한다.
  scoreArea.addEventListener("scroll", () => syncLayoutScroll(scoreArea, layoutStage));
  window.addEventListener("resize", render);
  // zoom 값이 확정되면 전체 canvas score를 다시 그린다.
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
