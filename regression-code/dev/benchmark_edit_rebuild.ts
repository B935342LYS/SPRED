/**
 * 동일 편집의 전체 재계산과 산출물 재사용을 비교하는 Node 개발 도구다.
 * Canvas/DOM/audio/이력은 제외하며 제품 profiler와 제품 동작은 변경하지 않는다.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { cpus, totalmem } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRuntimeArtifacts, applyRawTextBatchToScore, createInitialState } from "../src/app/app_runtime";
import { applyScoreCellRawTextBatch } from "../src/app/edit/edit_apply";
import { createRuntimeDocument } from "../src/core/score/create_runtime_document";
import type { ScoreFile } from "../src/core/score/types";
import { makeScore, makeCases, type BenchmarkEditCase } from "./benchmark_edit_fixture";
import { buildScoreTextEditPartialArtifacts } from "../src/orchestration/partial_rebuild/partial_rebuild_artifacts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const warmupPairs = 10;
const samplesPerVariant = 51;
type Artifacts = ReturnType<typeof buildRuntimeArtifacts>;


/**
 * Git 근거를 읽는다. Git 없는 이전 패키지에서도 실행할 수 있다.
 * - 인수 : args : Git 명령 인수
 * - 반환값 : 명령 결과 또는 unavailable
 */
function gitInfo(args: string[]): string {
  try { return execFileSync("git", args, { cwd: projectRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
  catch { return "unavailable"; }
}

/**
 * 원시 표본의 중앙값과 nearest-rank P95를 계산한다.
 * - 인수 : samples : ms 표본 (실행 순서 유지)
 * - 반환값 : 반올림하지 않은 통계
 */
function summarize(samples: number[]) {
  assert(samples.length > 0 && samples.every(value => Number.isFinite(value) && value >= 0));
  const sorted = [...samples].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return {
    medianMs: sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2,
    p95Ms: sorted[Math.ceil(sorted.length * 0.95) - 1],
    minMs: sorted[0], maxMs: sorted[sorted.length - 1],
  };
}

/**
 * 한 사례를 검증한 뒤 교대 측정한다. 검증·복제·출력은 측정 구간 밖에 둔다.
 * - 인수 : score : 수정하지 않을 편집 전 악보
 * - 인수 : scenario : 동일하게 적용할 편집 명령
 * - 반환값 : 조건, 통계, 실행 순서별 원시 표본
 */
function measureCase(score: ScoreFile, scenario: BenchmarkEditCase) {
  const activeTrackIds = ["basic", "optional", "extra"] as const;
  const document = createRuntimeDocument(score);
  const previousArtifacts = buildRuntimeArtifacts(document, activeTrackIds);
  const sourceSnapshot = structuredClone({ document, previousArtifacts, edits: scenario.edits });

  /**
   * 공통 편집·인덱스 생성 후 지정한 산출물 생성기를 실행한다.
   * - 인수 : reuse : true이면 기존 산출물 재사용
   * - 반환값 : 변경된 문서와 완성 산출물; 거절·무변경·fallback은 실패
   */
  function run(reuse: boolean) {
    const applied = applyScoreCellRawTextBatch(score, scenario.edits);
    if (!applied.ok) throw new Error(applied.message);
    if (applied.score === score) throw new Error("Unexpected no-op edit");
    const nextDocument = createRuntimeDocument(applied.score);
    const artifacts: Artifacts | null = reuse
      ? buildScoreTextEditPartialArtifacts({ previousArtifacts, activeTrackIds, nextDocument, edits: scenario.edits })
      : buildRuntimeArtifacts(nextDocument, activeTrackIds);
    if (artifacts === null) throw new Error("Unexpected full fallback; not a reuse sample");
    return { document: nextDocument, artifacts };
  }

  // 산출물의 내용·순서 및 실제 앱 편집 경로와의 일치를 측정 전에 확인한다.
  const expected = run(false);
  assert.deepStrictEqual(run(true), expected, `${scenario.name}: full/reuse mismatch`);
  const state = createInitialState(document);
  const actual = applyRawTextBatchToScore({ ...state, ...previousArtifacts, activeTrackIds: [...activeTrackIds] }, scenario.edits);
  assert.equal(actual.kind, "applied");
  if (actual.kind !== "applied") throw new Error("Product edit did not apply");
  assert.deepStrictEqual({ document: actual.state.document, artifacts: {
    parsed: actual.state.parsed, analysis: actual.state.analysis, renderInput: actual.state.renderInput,
  } }, expected, "Benchmark must match the product edit path");

  for (let i = 0; i < warmupPairs; i++) { run(false); run(true); }
  const samples: { pair: number; order: string; fullMs: number; reuseMs: number }[] = [];
  let lastFull = expected;
  let lastReuse = expected;
  for (let pair = 0; pair < samplesPerVariant; pair++) {
    let fullMs = 0;
    let reuseMs = 0;
    // AB/BA 순서를 교대하며 콘솔 출력과 결과 비교는 타이머에 포함하지 않는다.
    for (const reuse of pair % 2 === 0 ? [false, true] : [true, false]) {
      const start = performance.now();
      const result = run(reuse);
      const duration = performance.now() - start;
      if (reuse) { reuseMs = duration; lastReuse = result; }
      else { fullMs = duration; lastFull = result; }
    }
    samples.push({ pair, order: pair % 2 === 0 ? "full,reuse" : "reuse,full", fullMs, reuseMs });
  }
  // 마지막 산출물과 원본 불변성도 확인하며 불일치하면 결과 파일을 내보내지 않는다.
  assert.deepStrictEqual(lastFull, expected);
  assert.deepStrictEqual(lastReuse, expected);
  assert.deepStrictEqual({ document, previousArtifacts, edits: scenario.edits }, sourceSnapshot);
  const full = summarize(samples.map(sample => sample.fullMs));
  const reuse = summarize(samples.map(sample => sample.reuseMs));
  return {
    columns: score.globalLines.columnCount,
    cellsByTrack: score.tracks.map(track => ({ trackId: track.trackId, cells: track.cells.length })),
    scoreSha256: createHash("sha256").update(JSON.stringify(score)).digest("hex"),
    scenario: scenario.name, edits: scenario.edits, activeTrackIds,
    verifiedEquivalent: true, verifiedSourceUnchanged: true, fallbackCount: 0,
    full, reuse, reductionPercent: (1 - reuse.medianMs / full.medianMs) * 100, samples,
  };
}

/**
 * 모든 사례가 성공한 경우에만 재현 조건과 JSON/CSV 비교표를 저장한다.
 * - 인수 : 없음 (CLI: 선택적 출력 디렉터리)
 * - 반환값 : 없음; 오류는 종료 코드로 전파
 */
function main(): void {
  assert.deepStrictEqual(summarize([5, 1, 3, 4, 2]), { medianMs: 3, p95Ms: 5, minMs: 1, maxMs: 5 });
  const startedAt = new Date().toISOString();
  const outputDir = resolve(process.argv[2] ?? fileURLToPath(new URL(`../../.agents/tmp/edit-rebuild-${startedAt.replace(/[:.]/g, "-")}/`, import.meta.url)));
  const results = [];
  for (const columns of [100, 1000, 9000]) {
    const template = JSON.parse(readFileSync(new URL("./test_cases/minimal-valid-score.json", import.meta.url), "utf8")) as ScoreFile;
    const score = makeScore(template, columns);
    for (const scenario of makeCases()) {
      const result = measureCase(score, scenario);
      results.push(result);
      console.log(`${columns} columns / ${scenario.name}: full ${result.full.medianMs.toFixed(3)} ms, reuse ${result.reuse.medianMs.toFixed(3)} ms`);
    }
  }
  const output = {
    schemaVersion: 1, startedAt, finishedAt: new Date().toISOString(),
    scope: "Node synchronous edit + indexes + parsed/analysis/renderInput; excludes DOM, Canvas draw/presentation, audio, undo history, file loading and initial state",
    comparison: "Current full recomputation vs current artifact reuse; NOT historical version comparison or browser input latency",
    fixture: "Synthetic: identical three tracks, 7 cells per 16 columns; gliss/tuplet/hold/vibrato/tremolo; reverseRows=false",
    runtime: process.version, platform: process.platform, arch: process.arch,
    cpu: cpus()[0]?.model, logicalCpus: cpus().length, memoryBytes: totalmem(),
    gitHead: gitInfo(["rev-parse", "HEAD"]), gitStatus: gitInfo(["status", "--short"]),
    benchmarkSha256: createHash("sha256").update(readFileSync(fileURLToPath(import.meta.url))).digest("hex"),
    warmupPairs, samplesPerVariant, order: "alternating AB/BA", p95Method: "nearest rank",
    profiler: "disabled (no active session)", gc: "natural; no forced GC; no outlier removal", results,
  };
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(resolve(outputDir, "results.json"), JSON.stringify(output, null, 2) + "\n");
  const rows = ["columns,track_cells,scenario,full_median_ms,reuse_median_ms,reduction_percent,full_p95_ms,reuse_p95_ms"];
  for (const result of results) rows.push([
    result.columns, result.cellsByTrack.reduce((sum, track) => sum + track.cells, 0), result.scenario,
    result.full.medianMs.toFixed(3), result.reuse.medianMs.toFixed(3), result.reductionPercent.toFixed(1),
    result.full.p95Ms.toFixed(3), result.reuse.p95Ms.toFixed(3),
  ].join(","));
  writeFileSync(resolve(outputDir, "comparison.csv"), rows.join("\n") + "\n");
  console.log(`Validated results: ${outputDir}`);
}

main();
