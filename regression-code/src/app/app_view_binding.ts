/**
 * zoom, fullscreen, details dialog 같은 view control event를 연결한다.
 */

import type {
  AppDom,
  AppState,
} from "./app_types";
import type { InstrumentString } from "../core/score/types";
import { applyMusicDataEditToState } from "./app_runtime";
import {
  fitScoreHeightZoom,
  populateDetailsDialog,
  readDetailsDialogMusicData,
  setZoomPercent,
  syncFullscreenButton,
  toggleFullscreen,
} from "./app_view_actions";
import {
  syncLayoutScroll,
  syncLeftStatus,
} from "./app_ui_sync";

/** view binding이 app 상태와 render 흐름을 제어하기 위한 session 입력. */
export type ViewBindingSession = {
  getState(): AppState;
  setState(nextState: AppState): void;
  render(): void;
};

/**
 * 현재 score 높이에 맞춰 zoom을 갱신하고 상태 메시지를 반영한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : session : app 상태와 render callback 묶음
 * - 반환값 : 없음
 */
export function fitScoreHeight(
  dom: AppDom,
  session: ViewBindingSession,
): void {
  const state = session.getState();
  const statusMessage = fitScoreHeightZoom(dom, state);

  if (statusMessage.level === "info") {
    session.render();
  }

  session.setState({
    ...session.getState(),
    statusMessage,
  });
  syncLeftStatus(dom, session.getState());
}

/**
 * details dialog를 현재 score metadata로 채운 뒤 연다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : session : app 상태 조회 callback 묶음
 * - 반환값 : 없음
 */
export function openDetailsDialog(
  dom: AppDom,
  session: Pick<ViewBindingSession, "getState">,
): void {
  populateDetailsDialog(dom, session.getState().document.score.musicData);
  dom.detailsDialog.showModal();
}

/**
 * details dialog 입력값을 score metadata에 적용한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : session : app 상태와 render callback 묶음
 * - 반환값 : 없음
 */
export function applyDetailsDialog(
  dom: AppDom,
  session: ViewBindingSession,
): void {
  const state = session.getState();
  const currentMusicData = state.document.score.musicData;

  session.setState(
    applyMusicDataEditToState(
      state,
      readDetailsDialogMusicData(dom, currentMusicData),
    ),
  );
  dom.detailsDialog.close();
  session.render();
}

/**
 * layout dialog의 instrument/string 영역을 현재 score 값으로 채운다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : state : 현재 앱 상태
 * - 반환값 : 없음
 */
function populateLayoutDialogShell(dom: AppDom, state: AppState): void {
  const instData = state.document.score.instData;

  dom.layoutPresetNameInput.value = instData.instName;
  dom.layoutFamilyInput.value = instData.family;
  dom.layoutInstNameInput.value = instData.instName;
  dom.layoutSupportsOpenInput.checked = instData.supportsOpen;
  dom.layoutStringSelect.replaceChildren();
  dom.layoutStringList.replaceChildren();
  dom.layoutRowList.replaceChildren(createLayoutEmptyState("Row draft is not connected yet."));
  dom.layoutStatusLine.textContent = "Layout editor shell opened. Draft editing is not connected yet.";
  dom.layoutStatusLine.dataset.level = "info";

  for (const stringInfo of instData.strings) {
    dom.layoutStringSelect.appendChild(createStringOption(stringInfo));
    dom.layoutStringList.appendChild(createStringSummaryRow(stringInfo, instData.supportsOpen));
  }
}

/**
 * layout string 선택지를 만든다.
 * - 인수 : stringInfo : ScoreFile.instData.strings의 단일 현 정보
 * - 반환값 : stringId를 값으로 가진 option 요소
 */
function createStringOption(stringInfo: InstrumentString): HTMLOptionElement {
  const option = document.createElement("option");

  option.value = stringInfo.stringId;
  option.textContent = `${stringInfo.stringId} · ${stringInfo.stringName}`;

  return option;
}

/**
 * layout dialog의 string 요약 row를 만든다.
 * - 인수 : stringInfo : ScoreFile.instData.strings의 단일 현 정보
 * - 인수 : supportsOpen : 악기 전체가 openMidi를 지원하는지 여부
 * - 반환값 : string 정보를 표시하는 row 요소
 */
function createStringSummaryRow(
  stringInfo: InstrumentString,
  supportsOpen: boolean,
): HTMLElement {
  const row = document.createElement("div");
  const openText = supportsOpen && stringInfo.openMidi !== undefined
    ? String(stringInfo.openMidi)
    : "-";

  row.className = "layout-table-row";
  row.append(
    createLayoutCell(stringInfo.stringId),
    createLayoutCell(stringInfo.stringName),
    createLayoutCell(String(stringInfo.minMidi)),
    createLayoutCell(String(stringInfo.maxMidi)),
    createLayoutCell(openText),
  );

  return row;
}

/**
 * layout dialog 표시에 사용할 단순 cell 요소를 만든다.
 * - 인수 : text : 표시할 문자열
 * - 반환값 : 텍스트가 들어간 span 요소
 */
function createLayoutCell(text: string): HTMLSpanElement {
  const cell = document.createElement("span");

  cell.textContent = text;

  return cell;
}

/**
 * layout dialog의 비어 있는 목록 표시 요소를 만든다.
 * - 인수 : message : 빈 상태 안내 문구
 * - 반환값 : 빈 상태 row 요소
 */
function createLayoutEmptyState(message: string): HTMLElement {
  const row = document.createElement("p");

  row.className = "layout-empty-state";
  row.textContent = message;

  return row;
}

/**
 * 아직 구현되지 않은 layout dialog action에 대한 상태 문구를 표시한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : message : 사용자에게 표시할 안내 문구
 * - 반환값 : 없음
 */
function setLayoutDialogNotice(dom: AppDom, message: string): void {
  dom.layoutStatusLine.textContent = message;
  dom.layoutStatusLine.dataset.level = "warning";
}

/**
 * layout dialog를 현재 score 값으로 채운 뒤 연다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : session : app 상태 조회 callback 묶음
 * - 반환값 : 없음
 */
export function openLayoutDialog(
  dom: AppDom,
  session: Pick<ViewBindingSession, "getState">,
): void {
  populateLayoutDialogShell(dom, session.getState());
  dom.layoutDialog.showModal();
}

/**
 * view 관련 DOM event를 app 상태 변경 흐름에 연결한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : session : app 상태와 render callback 묶음
 * - 반환값 : 없음
 */
export function bindViewControls(
  dom: AppDom,
  session: ViewBindingSession,
): void {
  // score 영역이 스크롤될 때 layout label stage의 세로 위치를 함께 이동한다.
  dom.scoreArea.addEventListener("scroll", () => {
    syncLayoutScroll(dom.scoreArea, dom.layoutStage);
  });

  window.addEventListener("resize", session.render);

  document.addEventListener("fullscreenchange", () => {
    syncFullscreenButton(dom);
    session.render();
  });

  // zoom 값이 확정되면 수동 zoom 하한을 적용한 뒤 전체 canvas score를 다시 그린다.
  dom.zoomInput.addEventListener("change", () => {
    setZoomPercent(dom, Number(dom.zoomInput.value), 100);
    session.render();
  });

  dom.fitHeightButton.addEventListener("click", () => {
    fitScoreHeight(dom, session);
  });

  dom.layoutModifyButton.addEventListener("click", () => {
    openLayoutDialog(dom, session);
  });

  dom.fullscreenButton.addEventListener("click", () => {
    toggleFullscreen(dom, (message) => {
      const state = session.getState();

      session.setState({
        ...state,
        statusMessage: {
          level: "error",
          text: message,
        },
      });
      syncLeftStatus(dom, session.getState());
    });
  });

  dom.detailsButton.addEventListener("click", () => {
    openDetailsDialog(dom, session);
  });
  dom.detailsCloseButton.addEventListener("click", () => {
    dom.detailsDialog.close();
  });
  dom.detailsCancelButton.addEventListener("click", () => {
    dom.detailsDialog.close();
  });
  dom.detailsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    applyDetailsDialog(dom, session);
  });

  dom.layoutCloseButton.addEventListener("click", () => {
    dom.layoutDialog.close();
  });
  dom.layoutCancelButton.addEventListener("click", () => {
    dom.layoutDialog.close();
  });
  dom.layoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setLayoutDialogNotice(dom, "Layout Apply will be connected in the next implementation step.");
  });
  dom.layoutResetButton.addEventListener("click", () => {
    populateLayoutDialogShell(dom, session.getState());
  });
  dom.layoutAddRowButton.addEventListener("click", () => {
    setLayoutDialogNotice(dom, "Add Row will be connected after the layout draft module is implemented.");
  });
  dom.layoutLocalSaveButton.addEventListener("click", () => {
    setLayoutDialogNotice(dom, "Local Save will be connected after layout presets are implemented.");
  });
  dom.layoutLocalLoadButton.addEventListener("click", () => {
    setLayoutDialogNotice(dom, "Local Load will be connected after layout presets are implemented.");
  });
  dom.layoutFileSaveButton.addEventListener("click", () => {
    setLayoutDialogNotice(dom, "File Save will be connected after layout presets are implemented.");
  });
  dom.layoutFileLoadButton.addEventListener("click", () => {
    setLayoutDialogNotice(dom, "File Load will be connected after layout presets are implemented.");
  });
}
