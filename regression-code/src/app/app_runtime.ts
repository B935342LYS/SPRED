/**
 * RuntimeDocument에서 app 상태와 renderer 입력을 재생성하는 경계를 담당한다.
 */

import { analyzeDocument } from "../core/analyze/analyze_full";
import type { AnalysisResult } from "../core/analyze/types";
import { buildParsedDocument } from "../core/parse/build_parsed_document";
import type { ParsedScoreDocument } from "../core/parse/types";
import { createRuntimeDocument } from "../core/score/create_runtime_document";
import type {
  RuntimeDocument,
  ScoreFile,
} from "../core/score/types";
import { buildCanvasNoteRenderItems } from "../renderer/canvas_item_builder";
import type { CanvasAnalyzedRenderInput } from "../renderer/canvas_types";
import { createCanvasRenderInput } from "./canvas_renderer_adapter";
import { applyNoteCellRawText } from "./edit/edit_apply";
import type {
  AppState,
  ScoreSelection,
} from "./app_types";

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
      noteItems: buildCanvasNoteRenderItems(analysis),
    },
  };
}

/**
 * RuntimeDocument를 AppState 초기값으로 변환한다.
 * - 인수 : document : 로드된 런타임 문서
 * - 반환값 : 첫 렌더에 필요한 앱 상태
 */
export function createInitialState(document: RuntimeDocument): AppState {
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
