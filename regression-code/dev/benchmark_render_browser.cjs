/** 실제 Chrome에서 renderer 비교를 실행하고 원시 JSON 및 세 비교표를 저장한다. */
const assert = require('node:assert/strict');
const { readFileSync, writeFileSync, mkdirSync, readdirSync } = require('node:fs');
const { resolve, join } = require('node:path');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { cpus, totalmem } = require('node:os');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve(__dirname, '..');

/**
 * Git 환경 정보를 읽는다.
 * - 인수 : args : Git 명령 인수
 * - 반환값 : 결과 또는 unavailable
 */
function gitInfo(args) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return 'unavailable'; }
}

/**
 * 실제 작업본의 코드 해시를 남긴다. 미커밋 변경도 재현 근거에 포함한다.
 * - 인수 : directory : src 경로
 * - 반환값 : 정렬된 파일별 SHA-256 목록
 */
function sourceHashes(directory) {
  return readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceHashes(path) : [{ path: path.slice(root.length + 1).replaceAll('\\', '/'),
      sha256: createHash('sha256').update(readFileSync(path)).digest('hex') }];
  });
}

/**
 * CSV에 수치를 저장한다. 문자열은 고정된 내부 이름만 사용한다.
 * - 인수 : path : 출력 파일
 * - 인수 : rows : 헤더와 데이터 행
 * - 반환값 : 없음
 */
function writeCsv(path, rows) {
  writeFileSync(path, rows.map(row => row.map(value => typeof value === 'number' ? value.toFixed(3) : String(value)).join(',')).join('\n') + '\n');
}

/**
 * 로컬 Vite와 브라우저를 준비하고 조건별 측정 후 결과를 내보낸다.
 * - 인수 : 없음 (PLAYWRIGHT_MODULE, BROWSER_PATH, 선택적 출력 경로 사용)
 * - 반환값 : 완료 Promise
 */
async function main() {
  const startedAt = new Date().toISOString();
  const smoke = process.argv.includes('--smoke');
  const explicitOutput = process.argv.slice(2).find(arg => !arg.startsWith('--'));
  const outputDir = resolve(explicitOutput || join(root, '../.agents/tmp', `render-benchmark-${startedAt.replace(/[:.]/g, '-')}`));
  const { createServer } = await import('vite');
  const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, open: false } });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(server.resolvedUrls.local[0] + 'dev/benchmark_render.html');
    await page.waitForFunction(() => Boolean(window.__renderBenchmark));
    const template = JSON.parse(readFileSync(join(root, 'dev/test_cases/minimal-valid-score.json'), 'utf8'));
    const metadata = {
      startedAt, browser: await browser.version(), userAgent: await page.evaluate(() => navigator.userAgent),
      runtime: process.version, platform: process.platform, arch: process.arch, cpu: cpus()[0]?.model,
      logicalCpus: cpus().length, memoryBytes: totalmem(), headless: true, devicePixelRatio: 1,
      gitHead: gitInfo(['rev-parse', 'HEAD']), gitStatus: gitInfo(['status', '--short']),
      sourceHashes: sourceHashes(join(root, 'src')),
      toolHashes: ['benchmark_render.ts', 'benchmark_render_browser.cjs', 'benchmark_edit_fixture.ts'].map(name => ({ name,
        sha256: createHash('sha256').update(readFileSync(join(__dirname, name))).digest('hex') })),
      scope: 'Browser synchronous edit/index/artifact calculation + Canvas command submission; separate 1px-per-layer readback cost; NOT display completion/input latency',
      partialDefinition: 'artifact reuse only; all variants call renderCanvasScore; layer-specific redraw reuse excluded to isolate the two factors',
      viewport: { width: 1008, overscanPx: 252 }, fixture: 'shared synthetic fixture with Node benchmark; 3 tracks / 7 cells per 16 columns',
      policy: '4 warmup rounds, 32 samples/variant, rotating order; preallocated canvases; no outlier removal/forced GC; dedicated validation canvases',
      fullResolutionBounds: 'stageWidth <= 30000 and stageHeight <= 1080; zoom=1, DPR=1; reject downscaling',
    };
    const results = [];
    for (const columns of smoke ? [100] : [100, 500, 1000]) {
      const cases = smoke ? [['render-only', 'start'], ['note-single', 'start']] : [
        ['render-only', 'start'], ['render-only', 'middle'], ['note-single', 'start'],
        ['note-batch-32', 'start'], ['note-all-tracks', 'start'], ['global-bpm', 'start'],
      ];
      for (const [scenario, position] of cases) {
        let result;
        try {
          result = await page.evaluate(async ({ template, columns, scenario, position }) =>
            window.__renderBenchmark.run(template, columns, scenario, position), { template, columns, scenario, position });
        } catch (error) {
          const visual = await page.evaluate(() => window.__benchmarkVisual);
          if (visual) {
            const debugDir = join(outputDir, 'failed-validation');
            mkdirSync(debugDir, { recursive: true });
            for (const key of ['full', 'viewport']) writeFileSync(join(debugDir, `${key}.png`), Buffer.from(visual[key].split(',')[1], 'base64'));
            writeFileSync(join(debugDir, 'difference.json'), JSON.stringify({ ...visual, full: undefined, viewport: undefined }, null, 2));
            console.error(`Validation diagnostics: ${debugDir}`);
          }
          throw error;
        }
        assert.equal(errors.length, 0, errors.join('\n'));
        results.push(result);
        console.log(`${columns} / ${scenario} / ${position}: ${result.summary.map(row => `${row.variant}=${row.pipelineSubmit.medianMs.toFixed(2)}ms`).join(', ')}`);
      }
    }
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(join(outputDir, 'results.json'), JSON.stringify({ schemaVersion: 1, metadata, finishedAt: new Date().toISOString(), smoke, results }, null, 2) + '\n');
    const viewportRows = [['columns', 'cells', 'position', 'full_draw_submit_median_ms', 'viewport_draw_submit_median_ms', 'reduction_percent', 'full_p95_ms', 'viewport_p95_ms']];
    const factorialRows = [['columns', 'cells', 'scenario', 'variant', 'compute_median_ms', 'render_submit_median_ms', 'pipeline_submit_median_ms', 'pipeline_submit_p95_ms', 'readback_median_ms', 'pipeline_with_readback_median_ms']];
    const combinedRows = [['columns', 'cells', 'scenario', 'neither_pipeline_submit_median_ms', 'both_pipeline_submit_median_ms', 'reduction_percent', 'neither_p95_ms', 'both_p95_ms']];
    for (const result of results) {
      if (result.scenario === 'render-only') {
        const full = result.summary.find(row => row.variant === 'neither').renderSubmit;
        const viewport = result.summary.find(row => row.variant === 'viewport-only').renderSubmit;
        viewportRows.push([result.columns, result.cells, result.position, full.medianMs, viewport.medianMs,
          (1 - viewport.medianMs / full.medianMs) * 100, full.p95Ms, viewport.p95Ms]);
      } else {
        for (const row of result.summary) factorialRows.push([result.columns, result.cells, result.scenario, row.variant,
          row.compute.medianMs, row.renderSubmit.medianMs, row.pipelineSubmit.medianMs, row.pipelineSubmit.p95Ms,
          row.readback.medianMs, row.pipelineWithReadback.medianMs]);
        const neither = result.summary.find(row => row.variant === 'neither').pipelineSubmit;
        const both = result.summary.find(row => row.variant === 'both').pipelineSubmit;
        combinedRows.push([result.columns, result.cells, result.scenario, neither.medianMs, both.medianMs,
          (1 - both.medianMs / neither.medianMs) * 100, neither.p95Ms, both.p95Ms]);
      }
    }
    writeCsv(join(outputDir, 'viewport-comparison.csv'), viewportRows);
    writeCsv(join(outputDir, 'factorial-comparison.csv'), factorialRows);
    writeCsv(join(outputDir, 'combined-comparison.csv'), combinedRows);
    console.log(`Validated results: ${outputDir}`);
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
