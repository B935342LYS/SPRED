/**
 * 브라우저 앱 진입점이다.
 * sample RuntimeDocument를 canvas renderer 입력으로 변환하고 최소 edit mode를 연결한다.
 */

import {
  createRuntimeDocument,
  loadRuntimeDocument,
} from "../core/score/create_runtime_document";
import { buildParsedDocument } from "../core/parse/build_parsed_document";
import { analyzeDocument } from "../core/analyze/analyze_full";
import { createCanvasRenderInput } from "./canvas_renderer_adapter";
import { applyNoteCellRawText } from "./edit/edit_apply";
import { composeEditRawText } from "./edit/edit_core";
import { buildCanvasNoteRenderItems } from "../renderer/canvas_item_builder";
import { renderCanvasScore } from "../renderer/canvas_score_renderer";
import sampleScoreJson from "../../dev/test_cases/minimal-valid-score.json?raw";
import type { AnalysisResult } from "../core/analyze/types";
import type { ParsedScoreDocument } from "../core/parse/types";
import type {
  RuntimeDocument,
  RowId,
  ScoreFile,
  TrackId,
} from "../core/score/types";
import type {
  CanvasAnalyzedRenderInput,
  CanvasLayerTarget,
  CanvasRowKind,
  CanvasRenderOptions,
  CanvasRenderResult,
  CanvasRenderTarget,
  CanvasScoreLayout,
} from "../renderer/canvas_types";

/** 사용자가 볼 수 있는 짧은 상태 메시지의 중요도. */
type UiStatusLevel = "info" | "warning" | "error";

/** 왼쪽 메뉴 하단에 표시할 사용자 조작 결과 메시지. */
type UiStatusMessage = {
  level: UiStatusLevel;
  text: string;
};

/** 앱이 입력을 받아도 되는지 나타내는 전역 busy 상태. */
type AppBusyState =
  | { kind: "idle" }
  | { kind: "loadingScore"; message: string }
  | { kind: "applyingEdit"; message: string }
  | { kind: "rebuilding"; message: string };

/** edit mode에서 활성화된 도구. */
type EditTool = {
  kind: "customText";
  text: string;
};

/** score click을 어떤 의미로 해석할지 결정하는 앱 모드. */
type AppMode =
  | { kind: "view" }
  | { kind: "edit"; tool: EditTool };

/** score 영역 click을 renderer 좌표에서 score 좌표로 변환한 결과. */
type ScoreHit = {
  rowId: RowId;
  rowKind: CanvasRowKind;
  col: number;
};

/** UI가 현재 선택한 score 위치. */
type ScoreSelection = ScoreHit & {
  trackId: TrackId;
};

/** 문서, 파생 산출물, UI 모드를 함께 보관하는 앱 상태. */
type AppState = {
  document: RuntimeDocument;
  parsed: ParsedScoreDocument;
  analysis: AnalysisResult;
  renderInput: CanvasAnalyzedRenderInput;
  activeTrackId: TrackId;
  mode: AppMode;
  busy: AppBusyState;
  statusMessage: UiStatusMessage;
  selection: ScoreSelection | null;
  layout: CanvasScoreLayout | null;
};

/** main.ts에서 직접 제어하는 DOM 요소 묶음. */
type AppDom = {
  scoreArea: HTMLElement;
  scoreStage: HTMLElement;
  layoutStage: HTMLElement;
  target: CanvasRenderTarget;
  editToggle: HTMLInputElement;
  defaultModeSelect: HTMLSelectElement;
  customTextInput: HTMLInputElement;
  zoomInput: HTMLInputElement;
  leftStatusLine: HTMLElement;
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
 * 현재 score의 표시 열 범위를 사용자 메시지로 만든다.
 * - 인수 : score : 현재 런타임 score JSON
 * - 반환값 : 0-based column 범위 메시지
 */
function formatLoadedColumnStatus(score: ScoreFile): string {
  const lastCol = Math.max(0, score.globalLines.columnCount - 1);

  return `Loaded. cols 0-${lastCol}`;
}

/**
 * ScoreFile JSON 구조를 편집용으로 깊은 복사한다.
 * - 인수 : score : 현재 score JSON
 * - 반환값 : mutation을 적용할 독립 score JSON
 */
/**
 * RuntimeDocument에서 parser/analyzer/renderer 입력을 재생성한다.
 * - 인수 : document : 인덱스가 생성된 런타임 문서
 * - 반환값 : 현재 score에서 파생된 분석 및 렌더 입력 묶음
 */
function buildRuntimeArtifacts(document: RuntimeDocument): {
  parsed: ParsedScoreDocument;
  analysis: AnalysisResult;
  renderInput: CanvasAnalyzedRenderInput;
} {
  // parser와 analyzer는 RuntimeDocument의 score/index를 기준으로 전체 산출물을 다시 만든다.
  const parsed = buildParsedDocument(document);
  const analysis = analyzeDocument({
    score: document.score,
    indexes: document.indexes,
    parsed,
  });
  const renderInput = createCanvasRenderInput(document);

  return {
    parsed,
    analysis,
    // note layer는 analyzer 결과만 소비하도록 renderer 입력에 noteItems를 덧붙인다.
    renderInput: {
      ...renderInput,
      noteItems: buildCanvasNoteRenderItems(analysis),
    },
  };
}

/**
 * RuntimeDocument를 AppState 초기값으로 변환한다.
 * - 인수 : document : 로드된 런타임 문서
 * - 반환값 : 첫 렌더에 필요한 앱 상태
 */
function createInitialState(document: RuntimeDocument): AppState {
  const artifacts = buildRuntimeArtifacts(document);

  return {
    document,
    parsed: artifacts.parsed,
    analysis: artifacts.analysis,
    renderInput: artifacts.renderInput,
    activeTrackId: "basic",
    mode: { kind: "view" },
    busy: { kind: "idle" },
    statusMessage: {
      level: "info",
      text: formatLoadedColumnStatus(document.score),
    },
    selection: null,
    layout: null,
  };
}

/**
 * busy 상태를 우선하여 왼쪽 상태줄에 표시할 메시지를 고른다.
 * - 인수 : state : 현재 앱 상태
 * - 반환값 : DOM에 표시할 상태 메시지
 */
function getVisibleStatusMessage(state: AppState): UiStatusMessage {
  if (state.busy.kind !== "idle") {
    return {
      level: "info",
      text: state.busy.message,
    };
  }

  return state.statusMessage;
}

/**
 * AppState를 왼쪽 user-facing status line에 반영한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : state : 현재 앱 상태
 * - 반환값 : 없음
 */
function syncLeftStatus(dom: AppDom, state: AppState): void {
  const message = getVisibleStatusMessage(state);

  // 긴 오류/상태 문구는 한 줄로 줄이고 전체 내용은 title에서 확인할 수 있게 둔다.
  dom.leftStatusLine.textContent = message.text;
  dom.leftStatusLine.dataset.level = message.level;
  dom.leftStatusLine.title = message.text;
}

/**
 * edit/busy 상태에 따라 최소 구현 대상 UI control을 활성화한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : state : 현재 앱 상태
 * - 반환값 : 없음
 */
function syncUiControls(dom: AppDom, state: AppState): void {
  const isBusy = state.busy.kind !== "idle";
  const isEditMode = state.mode.kind === "edit";

  // 1차 구현에서는 CUSTOM만 활성 기능이므로 select는 edit mode에서만 열고 값은 custom으로 고정한다.
  dom.editToggle.disabled = isBusy;
  dom.defaultModeSelect.disabled = isBusy || !isEditMode;
  dom.customTextInput.disabled = isBusy || !isEditMode;
  dom.zoomInput.disabled = isBusy;
  dom.defaultModeSelect.value = "custom";
}

/**
 * score click 좌표를 renderer layout 기준 row/col hit로 변환한다.
 * - 인수 : event : score canvas stage에서 발생한 pointer event
 * - 인수 : stage : score canvas stage DOM 요소
 * - 인수 : layout : 마지막 renderer 호출이 계산한 score layout
 * - 반환값 : score 좌표 hit, 범위 밖이면 null
 */
function hitTestScore(
  event: MouseEvent,
  stage: HTMLElement,
  layout: CanvasScoreLayout,
): ScoreHit | null {
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor(x / layout.columnWidth);

  // column 또는 row 범위를 벗어난 click은 score mutation 대상으로 보지 않는다.
  if (col < 0 || col >= layout.columnCount) {
    return null;
  }

  const row = layout.rows.find(
    (layoutRow) => layoutRow.y <= y && y < layoutRow.y + layoutRow.height,
  );

  if (row === undefined) {
    return null;
  }

  return {
    rowId: row.rowId,
    rowKind: row.kind,
    col,
  };
}

/**
 * 현재 mode/tool 상태로 score canvas click을 처리한다.
 * - 인수 : state : 현재 앱 상태
 * - 인수 : hit : renderer 좌표계에서 변환된 score hit
 * - 반환값 : mutation이 필요하면 갱신된 상태, 아니면 선택만 반영한 상태
 */
function handleScoreClick(state: AppState, hit: ScoreHit): AppState {
  const selection: ScoreSelection = {
    ...hit,
    trackId: state.activeTrackId,
  };

  if (state.busy.kind !== "idle") {
    return state;
  }

  if (state.mode.kind === "view") {
    return {
      ...state,
      selection,
      statusMessage: {
        level: "info",
        text: `Selected ${selection.trackId} ${selection.rowId}:${selection.col}`,
      },
    };
  }
  return {
    ...state,
    selection,
    statusMessage: {
      level: "warning",
      text: "Current edit mode must be applied through edit composer.",
    },
  };
}

/**
 * active track의 note cell에 rawText를 적용하고 full rebuild 산출물을 만든다.
 * - 인수 : state : 현재 앱 상태
 * - 인수 : selection : 사용자가 click한 score 좌표와 track
 * - 인수 : rawText : parser가 읽을 note cell rawText
 * - 반환값 : full rebuild가 반영된 앱 상태
 */
function applyRawTextToScore(
  state: AppState,
  selection: ScoreSelection,
  rawText: string,
): AppState {
  const applyResult = applyNoteCellRawText(
    state.document.score,
    selection,
    rawText,
  );

  if (!applyResult.ok) {
    return {
      ...state,
      selection,
      statusMessage: {
        level: applyResult.level,
        text: applyResult.message,
      },
    };
  }

  const nextDocument = createRuntimeDocument(applyResult.score);
  const artifacts = buildRuntimeArtifacts(nextDocument);

  return {
    ...state,
    document: nextDocument,
    parsed: artifacts.parsed,
    analysis: artifacts.analysis,
    renderInput: artifacts.renderInput,
    selection,
    statusMessage: {
      level: "info",
      text: applyResult.isDelete
        ? `Cleared ${selection.trackId} ${selection.rowId}:${selection.col}`
        : `Applied ${selection.trackId} ${selection.rowId}:${selection.col}`,
    },
  };
}

/**
 * AppState 안의 renderInput으로 canvas score를 다시 그리고 layout을 상태에 반영한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : state : 현재 앱 상태
 * - 반환값 : renderer layout이 반영된 새 상태
 */
function renderApp(dom: AppDom, state: AppState): AppState {
  // CanvasRenderInput과 현재 UI 옵션으로 canvas score를 다시 그린다.
  const result: CanvasRenderResult = renderCanvasScore(
    dom.target,
    state.renderInput,
    createRenderOptions(dom.zoomInput),
  );

  // renderer가 계산한 stage 크기를 CSS 변수에 반영하고 label scroll 위치를 맞춘다.
  updateStageCssVars(
    result.layout.stageWidth,
    result.layout.stageHeight,
    result.layout.layoutWidth,
  );
  syncLayoutScroll(dom.scoreArea, dom.layoutStage);
  setStatus(1, `analysis: ${state.renderInput.noteItems.length} notes`);
  setStatus(2, `renderer: ${result.layout.rows.length} rows`);

  return {
    ...state,
    layout: result.layout,
  };
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
function createRenderOptions(zoomInput: HTMLInputElement): CanvasRenderOptions {
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
  const scoreStage = queryElement(".score-canvas-stage", HTMLElement);
  const layoutStage = queryElement(".layout-canvas-stage", HTMLElement);
  const editToggle = queryElement("#edit-mode-toggle", HTMLInputElement);
  const defaultModeSelect = queryElement(".default-mode-select", HTMLSelectElement);
  const customTextInput = queryElement(".custom-text-input", HTMLInputElement);
  const zoomInput = queryElement(".menu-panel input[type='range']", HTMLInputElement);
  const leftStatusLine = queryElement(".left-status-line", HTMLElement);
  const dom: AppDom = {
    scoreArea,
    scoreStage,
    layoutStage,
    target: createCanvasRenderTarget(),
    editToggle,
    defaultModeSelect,
    customTextInput,
    zoomInput,
    leftStatusLine,
  };
  const loadResult = loadRuntimeDocument(sampleScoreJson);

  if (!loadResult.ok) {
    throw new Error(loadResult.error.message);
  }

  let state = createInitialState(loadResult.document);

  const render = (): void => {
    state = renderApp(dom, state);
    syncLeftStatus(dom, state);
    syncUiControls(dom, state);
  };

  const applyScoreTextEdit = (hit: ScoreHit, rawText: string): void => {
    const selection: ScoreSelection = {
      ...hit,
      trackId: state.activeTrackId,
    };

    state = {
      ...state,
      busy: { kind: "applyingEdit", message: "Applying edit..." },
    };
    syncLeftStatus(dom, state);
    syncUiControls(dom, state);

    try {
      const actionState: AppState = {
        ...state,
        busy: { kind: "idle" },
      };

      // rawText를 직접 적용해 좌클릭 입력과 우클릭 삭제가 같은 full rebuild 경로를 사용한다.
      state = {
        ...applyRawTextToScore(actionState, selection, rawText),
        busy: { kind: "idle" },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown edit error.";

      state = {
        ...state,
        busy: { kind: "idle" },
        statusMessage: {
          level: "error",
          text: message,
        },
      };
    }

    render();
  };

  render();
  setStatus(0, "sample auto load: done");

  // score 영역이 스크롤될 때 layout label stage의 세로 위치를 함께 이동한다.
  scoreArea.addEventListener("scroll", () => syncLayoutScroll(scoreArea, layoutStage));
  window.addEventListener("resize", render);
  // zoom 값이 확정되면 전체 canvas score를 다시 그린다.
  zoomInput.addEventListener("change", render);
  editToggle.addEventListener("change", () => {
    // checkbox 상태를 mode로 변환하고 CUSTOM text input은 edit mode의 현재 rawText가 된다.
    state = {
      ...state,
      mode: editToggle.checked
        ? {
            kind: "edit",
            tool: {
              kind: "customText",
              text: customTextInput.value,
            },
          }
        : { kind: "view" },
      statusMessage: {
        level: "info",
        text: editToggle.checked ? "Edit mode: CUSTOM" : "View mode",
      },
    };
    syncLeftStatus(dom, state);
    syncUiControls(dom, state);
  });
  defaultModeSelect.addEventListener("change", () => {
    // 후속 도구가 구현되기 전까지 Default 드롭다운은 CUSTOM만 실제 동작한다.
    defaultModeSelect.value = "custom";
    state = {
      ...state,
      statusMessage: {
        level: "warning",
        text: "Only CUSTOM edit is enabled.",
      },
    };
    syncLeftStatus(dom, state);
  });
  customTextInput.addEventListener("input", () => {
    if (state.mode.kind !== "edit") {
      return;
    }

    // 입력 중인 customText를 mode tool 상태에 계속 반영한다.
    state = {
      ...state,
      mode: {
        kind: "edit",
        tool: {
          kind: "customText",
          text: customTextInput.value,
        },
      },
    };
  });
  scoreStage.addEventListener("click", (event) => {
    if (state.busy.kind !== "idle" || state.layout === null) {
      return;
    }

    const hit = hitTestScore(event, scoreStage, state.layout);

    if (hit === null) {
      state = {
        ...state,
        statusMessage: {
          level: "warning",
          text: "Score click is outside editable cells.",
        },
      };
      syncLeftStatus(dom, state);
      return;
    }

    if (state.mode.kind === "view") {
      // view mode click은 score mutation 없이 selection/status만 갱신한다.
      state = handleScoreClick(state, hit);
      render();
      return;
    }

    const editRawText = composeEditRawText({
      kind: "default",
      input: {
        customText: state.mode.tool.text,
      },
    });

    if (editRawText.kind === "blocked") {
      state = {
        ...state,
        statusMessage: {
          level: "warning",
          text: editRawText.message,
        },
      };
      syncLeftStatus(dom, state);
      return;
    }

    // edit_core가 합성한 적용/삭제 명령을 score mutation 경계로 넘긴다.
    applyScoreTextEdit(
      hit,
      editRawText.kind === "delete" ? "" : editRawText.rawText,
    );
  });
  scoreStage.addEventListener("contextmenu", (event) => {
    if (state.mode.kind !== "edit") {
      return;
    }

    // edit mode의 score stage 우클릭은 브라우저 메뉴 대신 해당 note cell 삭제로 해석한다.
    event.preventDefault();

    if (state.busy.kind !== "idle" || state.layout === null) {
      return;
    }

    const hit = hitTestScore(event, scoreStage, state.layout);

    if (hit === null) {
      state = {
        ...state,
        statusMessage: {
          level: "warning",
          text: "Score right-click is outside editable cells.",
        },
      };
      syncLeftStatus(dom, state);
      return;
    }

    // 빈 rawText 적용은 edit_apply의 삭제 규칙을 사용한다.
    applyScoreTextEdit(hit, "");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  boot().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown boot error.";
    setStatus(0, "sample auto load: failed");
    setStatus(1, message);
  });
});
