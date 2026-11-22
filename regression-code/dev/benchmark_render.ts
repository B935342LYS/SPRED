/** 브라우저에서 전체/viewport 그리기와 편집 산출물 재사용의 2×2 비교를 수행한다. */
import { makeScore, makeCases } from "./benchmark_edit_fixture";
import { buildRuntimeArtifacts } from "../src/app/app_runtime";
import { applyScoreCellRawTextBatch } from "../src/app/edit/edit_apply";
import { createRuntimeDocument } from "../src/core/score/create_runtime_document";
import type { ScoreFile } from "../src/core/score/types";
import { buildScoreTextEditPartialArtifacts } from "../src/orchestration/partial_rebuild/partial_rebuild_artifacts";
import { renderCanvasScore } from "../src/renderer/canvas_score_renderer";
import { buildCanvasScoreLayout } from "../src/renderer/canvas_coordinate";
import type { CanvasRenderOptions, CanvasRenderTarget } from "../src/renderer/canvas_types";

const activeTrackIds = ["basic", "optional", "extra"] as const;
const width = 1008;
const overscanPx = 252;
const warmupRounds = 4;
const sampleRounds = 32;
const keys = ["layout", "base", "marker", "noteMarker", "note"] as const;
const variants = [
  { name: "neither", reuse: false, viewport: false },
  { name: "reuse-only", reuse: true, viewport: false },
  { name: "viewport-only", reuse: false, viewport: true },
  { name: "both", reuse: true, viewport: true },
] as const;

/**
 * 벤치마크 조건을 확인한다. 실패하면 수치 생성도 중단한다.
 * - 인수 : condition : 만족해야 할 조건
 * - 인수 : message : 실패 설명
 * - 반환값 : 없음
 */
function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

/**
 * Map을 포함한 산출물을 비교 가능한 문자열로 바꾼다.
 * - 인수 : value : 산출물 또는 원본
 * - 반환값 : Map 키 순서만 정규화한 JSON (배열 순서는 보존)
 */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_key, item) => item instanceof Map
    ? { mapEntries: [...item.entries()].sort(([a], [b]) => String(a).localeCompare(String(b))) }
    : item);
}

/**
 * 제품 renderer가 사용하는 HTMLCanvasElement 다섯 장을 준비한다.
 * - 인수 : 없음
 * - 반환값 : 화면 합성 없이 draw API만 실행하는 독립 target
 */
function makeTarget(): CanvasRenderTarget {
  const target = {} as CanvasRenderTarget;
  for (const key of keys) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: false });
    check(context, "Canvas 2D unavailable");
    target[key] = { canvas, context };
  }
  return target;
}

/**
 * 큰 bitmap 메모리를 다음 조건 전에 해제한다.
 * - 인수 : targets : 사용이 끝난 target
 * - 반환값 : 없음
 */
function dispose(...targets: CanvasRenderTarget[]): void {
  for (const target of targets) for (const key of keys) {
    target[key].canvas.width = 1;
    target[key].canvas.height = 1;
  }
}

/**
 * 각 layer의 최소 읽기로 대기 중인 Canvas 작업이 다음 표본에 넘어가는 것을 줄인다.
 * - 인수 : target : 이번에 그린 target
 * - 반환값 : 없음; 이 비용은 별도 측정하며 화면 표시 완료를 뜻하지 않는다.
 */
function readback(target: CanvasRenderTarget): void {
  for (const key of keys) target[key].context.getImageData(0, 0, 1, 1);
}

/**
 * 같은 화면 영역의 layer를 합성하여 full/viewport 결과를 비교한다.
 * - 인수 : target : 그려진 target
 * - 인수 : options : 해당 그리기의 viewport 옵션
 * - 인수 : scrollLeft : 비교할 화면 시작 위치
 * - 반환값 : RGBA 픽셀
 */
function visiblePixels(target: CanvasRenderTarget, options: CanvasRenderOptions, scrollLeft: number): Uint8ClampedArray {
  const output = document.createElement("canvas");
  output.width = width;
  output.height = target.note.canvas.height;
  const context = output.getContext("2d", { willReadFrequently: true });
  check(context, "Pixel comparison context missing");
  const origin = options.dynamicViewport ? Math.max(0, scrollLeft - overscanPx) : 0;
  // base → global marker → note marker → note 순서로 같은 score 영역을 합성한다.
  for (const key of ["base", "marker", "noteMarker", "note"] as const) {
    context.drawImage(target[key].canvas, origin - scrollLeft, 0);
  }
  const pixels = context.getImageData(0, 0, width, output.height).data;
  output.width = output.height = 1;
  return pixels;
}

/**
 * 화면 차이를 집계한다. grid layer 분리에서 생기는 교차점 차이는 따로 드러낸다.
 * - 인수 : left : 기준 RGBA
 * - 인수 : right : 비교 RGBA
 * - 반환값 : 차이 비율과 채널 평균/최대 차이
 */
function pixelDifference(left: Uint8ClampedArray, right: Uint8ClampedArray) {
  check(left.length === right.length, "Pixel dimensions differ");
  let changed = 0;
  let above8 = 0;
  let above32 = 0;
  let sum = 0;
  let max = 0;
  for (let i = 0; i < left.length; i += 4) {
    let pixelMax = 0;
    for (let channel = 0; channel < 4; channel++) {
      const delta = Math.abs(left[i + channel] - right[i + channel]);
      sum += delta;
      max = Math.max(max, delta);
      pixelMax = Math.max(pixelMax, delta);
    }
    if (pixelMax > 0) changed++;
    if (pixelMax > 8) above8++;
    if (pixelMax > 32) above32++;
  }
  return { changedPixelRatio: changed / (left.length / 4), above8PixelRatio: above8 / (left.length / 4),
    above32PixelRatio: above32 / (left.length / 4), meanChannelError: sum / left.length, maxChannelError: max };
}

/**
 * 실패 원인을 눈으로 확인할 수 있도록 비교 영역을 PNG로 보관한다.
 * - 인수 : pixels : RGBA 픽셀
 * - 반환값 : PNG data URL
 */
function pixelPng(pixels: Uint8ClampedArray): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = pixels.length / width / 4;
  const context = canvas.getContext("2d")!;
  const data = context.createImageData(canvas.width, canvas.height);
  data.data.set(pixels);
  context.putImageData(data, 0, 0);
  const url = canvas.toDataURL();
  canvas.width = canvas.height = 1;
  return url;
}

/**
 * 표본의 중앙값과 nearest-rank P95를 계산한다.
 * - 인수 : values : 실행 순서대로 저장한 ms 표본
 * - 반환값 : 반올림 전 통계
 */
function summarize(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  check(sorted.length > 0 && sorted.every(value => Number.isFinite(value) && value >= 0), "Invalid samples");
  const mid = Math.floor(sorted.length / 2);
  return { medianMs: sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
    p95Ms: sorted[Math.ceil(sorted.length * 0.95) - 1], minMs: sorted[0], maxMs: sorted.at(-1) };
}

/**
 * 실제 Canvas를 사용해 한 입력의 렌더 단독 또는 편집+렌더 4조건을 측정한다.
 * - 인수 : template : 합성 악보의 기본 구조
 * - 인수 : columns : 열 수
 * - 인수 : scenarioName : render-only 또는 고정 편집 사례 이름
 * - 인수 : position : 렌더 단독 검사의 화면 위치
 * - 반환값 : 입력 조건·검증 결과·원시 표본·통계
 */
async function run(template: ScoreFile, columns: number, scenarioName: string, position: "start" | "middle" = "start") {
  const score = makeScore(template, columns);
  const source = createRuntimeDocument(score);
  const previousArtifacts = buildRuntimeArtifacts(source, activeTrackIds);
  const isRenderOnly = scenarioName === "render-only";
  const scenario = makeCases().find(item => item.name === scenarioName);
  check(isRenderOnly || scenario, "Unknown scenario");
  const sourceSnapshot = canonical({ source, previousArtifacts });
  const layout = buildCanvasScoreLayout(previousArtifacts.renderInput, { zoom: 1, devicePixelRatio: 1 });
  const scrollLeft = position === "start" ? 0 : Math.floor((layout.stageWidth - width) / 2);
  // 같은 해상도 조건을 벗어나면 저해상도 full을 공정한 비교로 취급하지 않는다.
  check(layout.stageWidth <= 30000 && layout.stageHeight <= 1080, "Full bitmap exceeds equal-resolution benchmark bounds");
  const fullOptions: CanvasRenderOptions = { zoom: 1, devicePixelRatio: 1, showTupletContainers: true };
  const viewportOptions: CanvasRenderOptions = { ...fullOptions, dynamicViewport: { scrollLeft, width, overscanPx } };

  /**
   * 공통 편집 적용 후 전체 또는 재사용 산출물 생성기를 실행한다.
   * - 인수 : reuse : 산출물 재사용 여부
   * - 반환값 : 다음 산출물; 렌더 단독이면 같은 입력 객체
   */
  function compute(reuse: boolean) {
    if (!scenario) return previousArtifacts;
    const applied = applyScoreCellRawTextBatch(score, scenario.edits);
    check(applied.ok, "Edit rejected");
    check(applied.score !== score, "No-op edit");
    const nextDocument = createRuntimeDocument(applied.score);
    const artifacts = reuse ? buildScoreTextEditPartialArtifacts({ previousArtifacts, activeTrackIds, nextDocument, edits: scenario.edits })
      : buildRuntimeArtifacts(nextDocument, activeTrackIds);
    check(artifacts, "Unexpected fallback");
    return artifacts;
  }

  const expected = compute(false);
  check(canonical(expected) === canonical(compute(true)), "Full/reuse artifacts differ");
  const validationFull = makeTarget();
  const validationViewport = makeTarget();
  let visual;
  try {
    renderCanvasScore(validationFull, expected.renderInput, fullOptions);
    renderCanvasScore(validationViewport, expected.renderInput, viewportOptions);
    check(validationFull.note.context.getTransform().a === 1 && validationViewport.note.context.getTransform().a === 1, "DPR downscaling detected");
    const left = visiblePixels(validationFull, fullOptions, scrollLeft);
    const right = visiblePixels(validationViewport, viewportOptions, scrollLeft);
    check(left.some((value, i) => i % 4 === 3 && value > 0), "Blank full canvas");
    visual = pixelDifference(left, right);
    window.__benchmarkVisual = { full: pixelPng(left), viewport: pixelPng(right), columns, scenarioName, position, visual };
    // 큰/작은 bitmap의 미세한 래스터 차이는 기록하되 유의한 색상 차이와 평균 오차를 제한한다.
    // 0보다 큰 모든 차이를 제한하면 1단계 색상 차이가 넓게 생기는 경우에도 실패한다.
    check(visual.above8PixelRatio <= 0.001 && visual.meanChannelError <= 0.1 && visual.maxChannelError <= 64,
      `Visible output mismatch: ${JSON.stringify(visual)}`);
  } finally { dispose(validationFull, validationViewport); }

  const fullTarget = makeTarget();
  const viewportTarget = makeTarget();
  const selected = isRenderOnly ? [variants[0], variants[2]] : [...variants];
  const samples: { round: number; order: number; variant: string; computeMs: number; renderSubmitMs: number; pipelineSubmitMs: number; readbackMs: number; pipelineWithReadbackMs: number }[] = [];
  const dimensions: Record<string, Record<string, { width: number; height: number }>> = {};
  try {
    // bitmap 할당과 첫 draw는 측정 밖에서 끝내고 모든 변형이 같은 두 target을 사용한다.
    renderCanvasScore(fullTarget, expected.renderInput, fullOptions);
    renderCanvasScore(viewportTarget, expected.renderInput, viewportOptions);
    readback(fullTarget); readback(viewportTarget);
    for (const [label, target] of [["full", fullTarget], ["viewport", viewportTarget]] as const) {
      dimensions[label] = Object.fromEntries(keys.map(key => [key, { width: target[key].canvas.width, height: target[key].canvas.height }]));
    }
    for (let round = -warmupRounds; round < sampleRounds; round++) {
      const offset = ((round % selected.length) + selected.length) % selected.length;
      // 각 조건이 순서의 모든 위치를 같은 횟수 차지하도록 회전한다.
      for (let order = 0; order < selected.length; order++) {
        const variant = selected[(order + offset) % selected.length];
        const target = variant.viewport ? viewportTarget : fullTarget;
        const options = variant.viewport ? viewportOptions : fullOptions;
        const start = performance.now();
        const artifacts = compute(variant.reuse);
        const afterCompute = performance.now();
        renderCanvasScore(target, artifacts.renderInput, options);
        const afterDraw = performance.now();
        readback(target);
        const afterReadback = performance.now();
        if (round >= 0) samples.push({ round, order, variant: variant.name,
          computeMs: afterCompute - start, renderSubmitMs: afterDraw - afterCompute,
          pipelineSubmitMs: afterDraw - start, readbackMs: afterReadback - afterDraw,
          pipelineWithReadbackMs: afterReadback - start });
      }
      // 장시간 실행 중에도 브라우저가 제어를 반환받는다. 대기는 타이머 밖이다.
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    }
    check(canonical({ source, previousArtifacts }) === sourceSnapshot, "Source mutated");
    check(canonical(compute(false)) === canonical(expected) && canonical(compute(true)) === canonical(expected), "Final artifact mismatch");
  } finally { dispose(fullTarget, viewportTarget); }
  return {
    columns, cells: score.tracks.reduce((sum, track) => sum + track.cells.length, 0), scenario: scenarioName, position,
    edits: scenario?.edits ?? [], viewport: viewportOptions.dynamicViewport, layout, dimensions,
    validation: { artifactsEqual: true, sourceUnchanged: true, equalResolution: true, visual },
    warmupRounds, sampleRounds, samples,
    summary: selected.map(variant => {
      const own = samples.filter(sample => sample.variant === variant.name);
      return { variant: variant.name, compute: summarize(own.map(sample => sample.computeMs)),
        renderSubmit: summarize(own.map(sample => sample.renderSubmitMs)),
        pipelineSubmit: summarize(own.map(sample => sample.pipelineSubmitMs)),
        readback: summarize(own.map(sample => sample.readbackMs)),
        pipelineWithReadback: summarize(own.map(sample => sample.pipelineWithReadbackMs)) };
    }),
  };
}

declare global {
  interface Window { __renderBenchmark: { run: typeof run }; __benchmarkVisual?: unknown; }
}
window.__renderBenchmark = { run };
document.querySelector("#status")!.textContent = "준비 완료";
