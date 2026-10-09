/** 실제 앱의 편집·이력 연결 검사. Vite 메모리 변환으로만 시험 훅을 추가한다. */
const { createRequire } = require('node:module');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');
const root = process.cwd();
const req = createRequire(resolve(root, 'regression-code/package.json'));
const { createServer } = req('vite');
const { chromium } = req('playwright');

/**
 * 격리 개발 서버와 Chrome에서 실제 binding의 상태 확정과 오류 처리를 확인한다.
 * - 인수 : 없음
 * - 반환값 : 없음. 실패 시 프로세스 오류 코드 설정
 */
async function verify() {
  const server = await createServer({
    root: resolve(root, 'regression-code'), logLevel: 'error',
    server: { host: '127.0.0.1', port: 0 },
    plugins: [{
      name: 'edit-transaction-verification', enforce: 'pre',
      transform(code, id) {
        code = code.replaceAll('\r\n', '\n');
        if (id.endsWith('/src/app/main.ts')) {
          const anchor = '  render();\n  syncPlaybackUi(dom, state, playbackRuntime);';
          if (!code.includes(anchor)) throw new Error('Main probe anchor missing');
          code = code.replace(anchor, '  window.__editProbe = { session: appSession, dom };\n' + anchor);
          code = code.replace('const renderAfterScoreTextEdit = (edits: ScoreTextEdit[]): void => {',
            'const renderAfterScoreTextEdit = (edits: ScoreTextEdit[]): void => { window.__editDraws = (window.__editDraws ?? 0) + 1; if (window.__renderFailure) throw new Error("injected render failure");');
          code = code.replace('const render = (): void => {',
            'const render = (): void => { window.__fullDraws = (window.__fullDraws ?? 0) + 1; if (window.__fullRenderFailure) throw new Error("injected full render failure");');
          return code;
        }
        if (id.endsWith('/src/app/playback/app_playback.ts')) {
          return code.replace('  const schedule = measurePerf(', '  if (globalThis.__audioFailure) throw new Error("injected audio failure");\n  const schedule = measurePerf(')
            .replace('createTickTimeMapper(state.analysis.timingTimeline)', '(globalThis.__mapperFailure ? (() => { throw new Error("injected mapper failure"); })() : createTickTimeMapper(state.analysis.timingTimeline))');
        }
        if (id.endsWith('/src/audio/oscillator_backend.ts')) {
          return code.replace('dispose(): void {', 'dispose(): void { globalThis.__backendDisposals = (globalThis.__backendDisposals ?? 0) + 1;');
        }
        if (id.endsWith('/src/app/app_runtime.ts')) {
          return code.replace('  const partialArtifacts = measurePerf(',
            '  if (globalThis.__editFailure) throw new Error("injected artifact failure");\n  const partialArtifacts = measurePerf(');
        }
      },
    }],
  });
  let browser;
  try {
    await server.listen();
    browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(server.resolvedUrls.local[0]);
    await page.waitForFunction(() => window.__editProbe !== undefined);
    await page.evaluate(() => {
      const { session } = window.__editProbe;
      window.__testEdit = { selection: { trackId: 'basic', rowId: 's1-note-60', rowKind: 'note', col: 8 }, rawText: 'test' };
      window.__beforeScore = JSON.stringify(session.getState().document.score);
      session.applyScoreTextEdits([window.__testEdit]);
      window.__afterScore = JSON.stringify(session.getState().document.score);
    });
    await page.evaluate(() => window.__editProbe.dom.undoButton.click());
    const normalUndo = await page.evaluate(() => {
      const s = window.__editProbe.session.getState();
      return JSON.stringify(s.document.score) === window.__beforeScore && s.selection === null && s.history.redoStack.length === 1;
    });
    await page.keyboard.press('Control+y');
    const normalRedo = await page.evaluate(() => {
      const s = window.__editProbe.session.getState();
      return JSON.stringify(s.document.score) === window.__afterScore && s.selection === null && s.history.undoStack.length === 1;
    });
    const failures = await page.evaluate(() => {
      const { session, dom } = window.__editProbe;
      const results = {};
      // 실제 runtime의 artifact 계산 지점에서 예외를 발생시킨다.
      const capture = () => ({ state: session.getState(), playback: session.getPlaybackRuntime(), draws: window.__editDraws });
      const preserved = before => {
        const s = session.getState();
        return ['document', 'parsed', 'analysis', 'renderInput', 'history', 'selection', 'rangeSelection', 'rangeClipboard', 'pastePreview']
          .every(key => s[key] === before.state[key]) && s.busy.kind === 'idle' &&
          session.getPlaybackRuntime() === before.playback && window.__editDraws === before.draws;
      };
      let before = capture();
      window.__editFailure = true;
      dom.undoButton.click();
      results.failedUndo = preserved(before) && session.getState().statusMessage.text === 'injected artifact failure';
      window.__editFailure = false;
      dom.undoButton.click();
      before = capture();
      window.__editFailure = true;
      dom.redoButton.click();
      results.failedRedo = preserved(before) && session.getState().statusMessage.level === 'error';
      window.__editFailure = false;
      before = capture();
      session.applyScoreTextEdits([{ ...window.__testEdit, rawText: 'x'.repeat(201) }]);
      results.rejectedInput = preserved(before) && session.getState().statusMessage.level === 'warning';
      before = capture();
      session.beginScoreEditHistoryTransaction('Browser drag');
      session.applyScoreTextEdits([window.__testEdit]);
      session.applyScoreTextEdits([{ ...window.__testEdit, selection: { ...window.__testEdit.selection, col: 9 } }]);
      session.endScoreEditHistoryTransaction();
      results.dragGrouping = session.getState().history.undoStack.length === before.state.history.undoStack.length + 1;
      dom.undoButton.click();
      results.dragUndo = JSON.stringify(session.getState().document.score) === JSON.stringify(before.state.document.score);
      return results;
    });
    const recovery = await page.evaluate(async () => {
      const { session, dom } = window.__editProbe;
      const results = {};
      const key = (key, ctrlKey = false) => document.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
      // 실제 pointer binding의 키보드 handler를 사용한다.
      dom.editToggle.checked = true;
      dom.editToggle.dispatchEvent(new Event('change', { bubbles: true }));
      session.applyScoreTextEdits([window.__testEdit]);
      const range = { rowKind: 'note', startRowId: 's1-note-60', endRowId: 's1-note-60', rowIds: ['s1-note-60'], startCol: 8, endColExclusive: 9, trackIds: ['basic'] };
      const oldClipboard = { rowKind: 'note', sourceRowIds: ['s1-note-60'], width: 1, trackIds: ['basic'], cells: [{ rowOffset: 0, colOffset: 0, trackId: 'basic', rawText: 'old' }] };
      for (const command of ['Delete', 'x', 'v']) {
        session.setState({ ...session.getState(), rangeSelection: range, rangeClipboard: oldClipboard, pastePreview: { anchorCol: 10 } });
        const before = session.getState();
        window.__editFailure = true;
        key(command, command !== 'Delete');
        const failed = session.getState();
        results[`${command}PreservesUi`] = failed.document === before.document && failed.history === before.history &&
          failed.rangeSelection === before.rangeSelection && failed.rangeClipboard === before.rangeClipboard && failed.pastePreview === before.pastePreview && failed.statusMessage.level === 'error';
        window.__editFailure = false;
      }
      key('x', true);
      const cut = session.getState();
      results.cutCommitsUi = cut.rangeSelection === null && cut.rangeClipboard !== oldClipboard && cut.rangeClipboard?.cells[0]?.rawText === 'test';
      session.setState({ ...cut, pastePreview: { anchorCol: 11 } });
      key('v', true);
      const pasted = session.getState();
      results.pasteCommitsUi = pasted.rangeClipboard === null && pasted.rangeSelection === null && pasted.pastePreview.anchorCol === null &&
        pasted.document.score.tracks.find(t => t.trackId === 'basic').cells.some(c => c.col === 11 && c.rowId === 's1-note-60' && c.rawText === 'test');
      let before = session.getState();
      let fullDraws = window.__fullDraws;
      window.__renderFailure = true;
      session.applyScoreTextEdits([{ ...window.__testEdit, rawText: 'recovered' }]);
      results.renderRecovered = window.__fullDraws === fullDraws + 1 && session.getState().outputSyncError === undefined &&
        session.getState().history.undoStack.length === before.history.undoStack.length + 1 && !session.getPlaybackRuntime().controller.isPlaying();
      window.__fullRenderFailure = true;
      before = session.getState();
      const playback = session.getPlaybackRuntime();
      await playback.controller.playFromSeconds(0);
      results.playingBeforeFailure = playback.controller.isPlaying();
      fullDraws = window.__fullDraws;
      session.applyScoreTextEdits([{ ...window.__testEdit, rawText: 'committed' }]);
      results.persistentRenderBlocked = window.__fullDraws === fullDraws + 1 && session.getState().document !== before.document &&
        session.getState().history.undoStack.length === before.history.undoStack.length + 1 && !!session.getState().outputSyncError &&
        session.getPlaybackRuntime() === playback && !playback.controller.isPlaying() && dom.playButton.disabled && dom.seekInput.disabled && dom.practiceModeButton.disabled;
      key(' ');
      results.blockedKeyboard = !playback.controller.isPlaying();
      window.__renderFailure = false;
      window.__fullRenderFailure = false;
      session.applyScoreTextEdits([{ ...window.__testEdit, rawText: 'retry' }]);
      results.editRetryRecovered = session.getState().outputSyncError === undefined && !dom.playButton.disabled && !dom.practiceModeButton.disabled;
      before = session.getState();
      window.__audioFailure = true;
      session.applyScoreTextEdits([{ ...window.__testEdit, rawText: 'audio-failed' }]);
      results.audioFailureBlocked = session.getState().document !== before.document && session.getState().outputSyncError?.startsWith('playback:') &&
        !session.getPlaybackRuntime().controller.isPlaying() && dom.playButton.disabled;
      window.__audioFailure = false;
      session.applyScoreTextEdits([{ ...window.__testEdit, rawText: 'audio-retry' }]);
      results.audioRetryRecovered = session.getState().outputSyncError === undefined && !dom.playButton.disabled;
      const disposalCount = window.__backendDisposals ?? 0;
      window.__mapperFailure = true;
      session.applyScoreTextEdits([{ ...window.__testEdit, rawText: 'mapper-failed' }]);
      // 실패한 후보 backend와 오류 정리 시의 note preview backend가 각각 해제된다.
      results.candidateBackendDisposed = window.__backendDisposals === disposalCount + 2 && session.getState().outputSyncError?.includes('injected mapper failure') && !session.getPlaybackRuntime().controller.isPlaying();
      window.__mapperFailure = false;
      session.applyScoreTextEdits([{ ...window.__testEdit, rawText: 'mapper-retry' }]);
      results.candidateFailureRecovered = session.getState().outputSyncError === undefined;
      return results;
    });
    const result = { browser: browser.version(), normalUndo, normalRedo, ...failures, ...recovery, pageErrors: errors };
    writeFileSync(resolve(root, 'docs/review-support/edit-transaction-browser-results.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
    if (!normalUndo || !normalRedo || Object.values({ ...failures, ...recovery }).some(value => !value) || errors.length) process.exitCode = 1;
  } finally {
    await browser?.close();
    await server.close();
  }
}
verify().catch(error => { console.error(error); process.exitCode = 1; });
