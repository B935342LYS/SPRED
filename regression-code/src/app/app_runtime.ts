/**
 * RuntimeDocument에서 app 상태와 renderer 입력을 재생성하는 경계를 담당한다.
 */

import { analyzeDocument } from "../core/analyze/analyze_full";
import type { AnalysisResult } from "../core/analyze/types";
import { buildParsedDocument } from "../core/parse/build_parsed_document";
import type { ParsedScoreDocument } from "../core/parse/types";
import {
  createRuntimeDocument,
  loadRuntimeDocument,
} from "../core/score/create_runtime_document";
import type {
  MusicData,
  RuntimeDocument,
  ScoreFile,
} from "../core/score/types";
import {
  buildCanvasGlobalTextRenderItems,
  buildCanvasMarkerItems,
  buildCanvasMuteRenderItems,
  buildCanvasNoteRenderItems,
} from "../renderer/canvas_item_builder";
import type { CanvasAnalyzedRenderInput } from "../renderer/canvas_types";
import { createCanvasRenderInput } from "./canvas_renderer_adapter";
import {
  applyNoteCellRawText,
  applyScoreCellRawTextBatch,
} from "./edit/edit_apply";
import type { ScoreTextEdit } from "./edit/edit_apply";
import type {
  AppState,
  ScoreOrigin,
  ScoreSelection,
} from "./app_types";
import { applyLayoutDraftToScore } from "./layout/layout_apply";
import type { LayoutDraftBundle } from "./layout/layout_types";

/**
 * 현재 score의 표시 열 범위를 사용자 메시지로 만든다.
 * - 인수 : score : 현재 런타임 score JSON
 * - 반환값 : 0-based column 범위 메시지
 */
export function formatLoadedColumnStatus(score: ScoreFile): string {
  const lastCol = Math.max(0, score.globalLines.columnCount - 1);

  return `Loaded. cols 0-${lastCol}`;
}

/**
 * RuntimeDocument에서 parser/analyzer/renderer 입력을 재생성한다.
 * - 인수 : document : 인덱스가 생성된 런타임 문서
 * - 반환값 : 현재 score에서 파생된 분석 및 렌더 입력 묶음
 */
export function buildRuntimeArtifacts(document: RuntimeDocument): {
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
      globalTextItems: buildCanvasGlobalTextRenderItems(document.score),
      noteItems: buildCanvasNoteRenderItems(analysis),
      muteItems: buildCanvasMuteRenderItems(analysis),
      markerItems: buildCanvasMarkerItems(analysis),
    },
  };
}

/**
 * RuntimeDocument를 AppState 초기값으로 변환한다.
 * - 인수 : document : 로드된 런타임 문서
 * - 인수 : scoreOrigin : 현재 score가 앱에 들어온 출처
 * - 반환값 : 첫 렌더에 필요한 앱 상태
 */
export function createInitialState(
  document: RuntimeDocument,
  scoreOrigin: ScoreOrigin = "loaded",
): AppState {
  const artifacts = buildRuntimeArtifacts(document);

  return {
    document,
    scoreOrigin,
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
 * JSON 문자열을 RuntimeDocument로 로드한 뒤 AppState 초기값으로 변환한다.
 * - 인수 : jsonText : ScoreFile JSON 문자열
 * - 인수 : sourceLabel : 사용자 상태 메시지에 표시할 로드 출처
 * - 인수 : scoreOrigin : 현재 score가 앱에 들어온 출처
 * - 반환값 : 로드 성공 시 새 AppState, 실패 시 기존 상태에 표시할 오류 메시지
 */
export function loadScoreTextAsInitialState(
  jsonText: string,
  sourceLabel: string,
  scoreOrigin: ScoreOrigin = "loaded",
):
  | {
      ok: true;
      state: AppState;
    }
  | {
      ok: false;
      message: string;
    } {
  const loadResult = loadRuntimeDocument(jsonText);

  if (!loadResult.ok) {
    return {
      ok: false,
      message: loadResult.error.message,
    };
  }

  return {
    ok: true,
    state: {
      ...createInitialState(loadResult.document, scoreOrigin),
      statusMessage: {
        level: "info",
        text: `${sourceLabel} loaded.`,
      },
    },
  };
}

/**
 * ScoreFile의 musicData만 교체해 AppState에 반영한다.
 * - 인수 : state : 현재 앱 상태
 * - 인수 : musicData : Details dialog에서 확정된 새 metadata
 * - 반환값 : metadata가 갱신된 앱 상태
 */
export function applyMusicDataEditToState(
  state: AppState,
  musicData: MusicData,
): AppState {
  const nextScore: ScoreFile = {
    ...state.document.score,
    musicData,
  };
  const nextDocument = createRuntimeDocument(nextScore);

  return {
    ...state,
    document: nextDocument,
    statusMessage: {
      level: "info",
      text: "Score details updated.",
    },
  };
}

/**
 * 레이아웃 draft를 ScoreFile에 적용하고 full rebuild 산출물을 만든다.
 * - 인수 : state : 현재 앱 상태
 * - 인수 : draft : Layout dialog에서 확정한 layout draft
 * - 인수 : allowCellDeletion : 삭제될 track cell이 있을 때 적용을 허용할지 여부
 * - 반환값 : full rebuild가 반영된 앱 상태
 */
export function applyLayoutDraftEditToState(
  state: AppState,
  draft: LayoutDraftBundle,
  allowCellDeletion: boolean,
): AppState {
  const applyResult = applyLayoutDraftToScore(state.document.score, draft, {
    allowCellDeletion,
  });

  if (!applyResult.ok) {
    return {
      ...state,
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
    selection: null,
    layout: null,
    statusMessage: {
      level: "info",
      text: applyResult.deletedCells.totalCount > 0
        ? `Layout applied. Deleted ${applyResult.deletedCells.totalCount} track cell(s).`
        : "Layout applied.",
    },
  };
}

/**
 * active track의 note cell에 rawText를 적용하고 full rebuild 산출물을 만든다.
 * - 인수 : state : 현재 앱 상태
 * - 인수 : editTarget : 이번 rawText 편집을 적용할 score 좌표와 track
 * - 인수 : rawText : parser가 읽을 note cell rawText
 * - 반환값 : full rebuild가 반영된 앱 상태
 */
export function applyRawTextToScore(
  state: AppState,
  editTarget: ScoreSelection,
  rawText: string,
): AppState {
  const applyResult = applyNoteCellRawText(
    state.document.score,
    editTarget,
    rawText,
  );

  if (!applyResult.ok) {
    return {
      ...state,
      selection: editTarget,
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
    selection: editTarget,
    statusMessage: {
      level: "info",
      text: applyResult.isDelete
        ? `Cleared ${editTarget.trackId} ${editTarget.rowId}:${editTarget.col}`
        : `Applied ${editTarget.trackId} ${editTarget.rowId}:${editTarget.col}`,
    },
  };
}

/**
 * 여러 score cell rawText 편집을 한 번의 full rebuild로 적용한다.
 * - 인수 : state : 현재 앱 상태
 * - 인수 : edits : 적용할 score cell 편집 목록
 * - 반환값 : full rebuild가 반영된 앱 상태
 */
export function applyRawTextBatchToScore(
  state: AppState,
  edits: ScoreTextEdit[],
): AppState {
  if (edits.length === 0) {
    return state;
  }

  const applyResult = applyScoreCellRawTextBatch(state.document.score, edits);
  const lastSelection = edits[edits.length - 1]?.selection ?? state.selection;

  if (!applyResult.ok) {
    return {
      ...state,
      selection: lastSelection,
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
    selection: lastSelection,
    statusMessage: {
      level: "info",
      text: applyResult.isDelete
        ? `Cleared ${applyResult.updated} cells.`
        : `Applied ${applyResult.updated} cells.`,
    },
  };
}

/**
 * edit 적용 전후 busy/status 전환을 포함해 rawText full rebuild를 실행한다.
 * - 인수 : state : 현재 앱 상태
 * - 인수 : editTarget : rawText 편집을 적용할 score 좌표와 track
 * - 인수 : rawText : parser가 읽을 note cell rawText
 * - 반환값 : 성공/실패 상태 메시지가 반영된 앱 상태
 */
export function applyRawTextEditToState(
  state: AppState,
  editTarget: ScoreSelection,
  rawText: string,
): AppState {
  const actionState: AppState = {
    ...state,
    busy: { kind: "idle" },
  };

  try {
    return {
      ...applyRawTextToScore(actionState, editTarget, rawText),
      busy: { kind: "idle" },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown edit error.";

    return {
      ...state,
      busy: { kind: "idle" },
      statusMessage: {
        level: "error",
        text: message,
      },
    };
  }
}

/**
 * edit 적용 전후 busy/status 전환을 포함해 여러 rawText 편집을 한 번에 적용한다.
 * - 인수 : state : 현재 앱 상태
 * - 인수 : edits : 적용할 score cell 편집 목록
 * - 반환값 : 성공/실패 상태 메시지가 반영된 앱 상태
 */
export function applyRawTextBatchEditToState(
  state: AppState,
  edits: ScoreTextEdit[],
): AppState {
  const actionState: AppState = {
    ...state,
    busy: { kind: "idle" },
  };

  try {
    return {
      ...applyRawTextBatchToScore(actionState, edits),
      busy: { kind: "idle" },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown edit error.";

    return {
      ...state,
      busy: { kind: "idle" },
      statusMessage: {
        level: "error",
        text: message,
      },
    };
  }
}
