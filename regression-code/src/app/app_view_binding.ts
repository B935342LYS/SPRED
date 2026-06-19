/**
 * zoom, fullscreen, details dialog 같은 view control event를 연결한다.
 */

import type {
  AppDom,
  AppState,
} from "./app_types";
import type {
  InstrumentString,
} from "../core/score/types";
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
  addLayoutDraftRow,
  createLayoutDraftBundle,
  deleteLayoutDraftRow,
  getRowsForSelectedString,
  selectLayoutDraftRow,
  selectLayoutDraftString,
  updateLayoutDraftRowHeight,
  type LayoutDraftMutationResult,
  type LayoutInsertPosition,
} from "./layout/layout_draft";
import type {
  LayoutDraftBundle,
  LayoutEditableRowDefinition,
} from "./layout/layout_types";
import { formatPitchName } from "./pitch_label";
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

let activeLayoutDraft: LayoutDraftBundle | null = null;

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
 * layout dialog의 instrument/string/row 영역을 현재 draft 값으로 채운다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : draft : 현재 layout dialog draft
 * - 인수 : message : 상태 줄에 표시할 문구
 * - 인수 : level : 상태 문구 중요도
 * - 반환값 : 없음
 */
function syncLayoutDialogFromDraft(
  dom: AppDom,
  draft: LayoutDraftBundle,
  message = "Layout draft is ready.",
  level: "info" | "warning" | "error" = "info",
): void {
  const instData = draft.instData;

  dom.layoutPresetNameInput.value = draft.layoutPresetDisplayName;
  if (!Array.from(dom.layoutFamilyInput.options).some((option) => option.value === instData.family)) {
    dom.layoutFamilyInput.value = "custom";
  } else {
    dom.layoutFamilyInput.value = instData.family;
  }
  dom.layoutSupportsOpenInput.checked = instData.supportsOpen;
  dom.layoutStringSelect.replaceChildren();
  dom.layoutStringList.replaceChildren();
  dom.layoutStatusLine.textContent = message;
  dom.layoutStatusLine.dataset.level = level;

  for (const stringInfo of instData.strings) {
    dom.layoutStringSelect.appendChild(createStringOption(stringInfo));
    dom.layoutStringList.appendChild(createStringSummaryRow(stringInfo, instData.supportsOpen));
  }

  dom.layoutStringSelect.value = draft.selectedStringId ?? "";
  renderLayoutDraftRows(dom, draft);
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

  row.className = "layout-table-row";
  row.append(
    createLayoutCell(stringInfo.stringId),
    createLayoutCell(stringInfo.stringName),
    createPitchSelect(stringInfo.minMidi, "Min MIDI"),
    createPitchSelect(stringInfo.maxMidi, "Max MIDI"),
    createPitchSelect(stringInfo.openMidi ?? stringInfo.minMidi, "Open MIDI", true),
  );

  return row;
}

/**
 * layout instrument string row에서 MIDI 값을 계이름 dropdown으로 표시한다.
 * - 인수 : selectedMidi : 현재 선택된 MIDI note number
 * - 인수 : label : 접근성 label
 * - 반환값 : 0..127 MIDI 선택지를 가진 select 요소
 */
function createPitchSelect(
  selectedMidi: number,
  label: string,
  disabled = false,
): HTMLSelectElement {
  const select = document.createElement("select");

  select.className = "layout-string-pitch-select";
  select.setAttribute("aria-label", label);
  select.disabled = disabled;

  for (let midi = 127; midi >= 0; midi -= 1) {
    const option = document.createElement("option");

    option.value = String(midi);
    option.textContent = formatPitchName(midi, "sharp");
    select.appendChild(option);
  }

  select.value = String(selectedMidi);

  return select;
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
 * layout dialog의 선택 string row 목록을 렌더링한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : draft : 현재 layout draft
 * - 반환값 : 없음
 */
function renderLayoutDraftRows(dom: AppDom, draft: LayoutDraftBundle): void {
  const rows = getRowsForSelectedString(draft);

  dom.layoutRowList.replaceChildren();

  if (rows.length === 0) {
    dom.layoutRowList.appendChild(createLayoutEmptyState("No editable rows for this string."));
    return;
  }

  dom.layoutRowList.appendChild(createLayoutRowTableHead());

  for (const row of rows) {
    dom.layoutRowList.appendChild(createLayoutDraftRowElement(dom, draft, row));
  }
}

/**
 * layout row list의 머리글을 만든다.
 * - 인수 : 없음
 * - 반환값 : row list head 요소
 */
function createLayoutRowTableHead(): HTMLElement {
  const head = document.createElement("div");

  head.className = "layout-row-table-head";
  head.append(
    createLayoutCell(""),
    createLayoutCell("Type"),
    createLayoutCell("Row ID"),
    createLayoutCell("Pitch"),
    createLayoutCell("Height"),
    createLayoutCell(""),
  );

  return head;
}

/**
 * layout draft row 하나를 표시하는 DOM 요소를 만든다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : draft : 현재 layout draft
 * - 인수 : row : 표시할 note/gap row
 * - 반환값 : row DOM 요소
 */
function createLayoutDraftRowElement(
  dom: AppDom,
  draft: LayoutDraftBundle,
  row: LayoutEditableRowDefinition,
): HTMLElement {
  const element = document.createElement("div");
  const selectInput = document.createElement("input");
  const heightInput = document.createElement("input");
  const deleteButton = document.createElement("button");

  element.className = "layout-row-table-row";
  element.dataset.selected = draft.selectedRowId === row.rowId ? "true" : "false";
  element.dataset.rowType = row.type;

  selectInput.type = "radio";
  selectInput.name = "layout-row-selection";
  selectInput.value = row.rowId;
  selectInput.checked = draft.selectedRowId === row.rowId;
  selectInput.setAttribute("aria-label", `Select ${row.rowId}`);

  heightInput.type = "number";
  heightInput.min = "1";
  heightInput.max = "1100";
  heightInput.step = "1";
  heightInput.value = String(row.height);
  heightInput.className = "layout-row-height-edit";
  heightInput.setAttribute("aria-label", `Height for ${row.rowId}`);

  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.className = "layout-row-delete-button";

  element.append(
    wrapLayoutControl(selectInput),
    createLayoutCell(row.type),
    createLayoutCell(row.rowId),
    createLayoutCell(formatLayoutRowPitch(row)),
    wrapLayoutControl(heightInput),
    wrapLayoutControl(deleteButton),
  );

  // row 클릭은 radio와 같은 선택 동작으로 처리한다.
  element.addEventListener("click", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) {
      return;
    }

    applyLayoutDraftChange(dom, {
      ok: true,
      draft: selectLayoutDraftRow(requireActiveLayoutDraft(), row.rowId),
      message: `Selected ${row.rowId}.`,
    });
  });
  selectInput.addEventListener("change", () => {
    applyLayoutDraftChange(dom, {
      ok: true,
      draft: selectLayoutDraftRow(requireActiveLayoutDraft(), row.rowId),
      message: `Selected ${row.rowId}.`,
    });
  });
  heightInput.addEventListener("change", () => {
    applyLayoutDraftChange(
      dom,
      updateLayoutDraftRowHeight(
        requireActiveLayoutDraft(),
        row.rowId,
        Number(heightInput.value),
      ),
    );
  });
  deleteButton.addEventListener("click", () => {
    applyLayoutDraftChange(dom, deleteLayoutDraftRow(requireActiveLayoutDraft(), row.rowId));
  });

  return element;
}

/**
 * row list 안에 들어갈 control을 고정 크기 cell에 감싼다.
 * - 인수 : control : input 또는 button 요소
 * - 반환값 : control을 담은 span 요소
 */
function wrapLayoutControl(control: HTMLElement): HTMLSpanElement {
  const cell = document.createElement("span");

  cell.appendChild(control);

  return cell;
}

/**
 * note row의 pitch 표시 문자열을 만든다.
 * - 인수 : row : 표시할 note/gap row
 * - 반환값 : note pitch 문자열. gap row는 사용자에게 내부 MIDI range를 표시하지 않는다.
 */
function formatLayoutRowPitch(row: LayoutEditableRowDefinition): string {
  if (row.type === "note") {
    return `${row.displayLabel} (${row.midi})`;
  }

  return "";
}

/**
 * active layout draft를 반환한다.
 * - 인수 : 없음
 * - 반환값 : 현재 열린 layout dialog draft
 */
function requireActiveLayoutDraft(): LayoutDraftBundle {
  if (activeLayoutDraft === null) {
    throw new Error("Layout draft is not initialized.");
  }

  return activeLayoutDraft;
}

/**
 * layout draft 변경 결과를 dialog에 반영한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : result : draft 변경 결과
 * - 반환값 : 없음
 */
function applyLayoutDraftChange(
  dom: AppDom,
  result: LayoutDraftMutationResult,
): void {
  if (!result.ok) {
    setLayoutDialogNotice(dom, result.message, result.level);
    return;
  }

  activeLayoutDraft = result.draft;
  syncLayoutDialogFromDraft(dom, activeLayoutDraft, result.message);
}

/**
 * 아직 구현되지 않은 layout dialog action에 대한 상태 문구를 표시한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : message : 사용자에게 표시할 안내 문구
 * - 반환값 : 없음
 */
function setLayoutDialogNotice(
  dom: AppDom,
  message: string,
  level: "warning" | "error" = "warning",
): void {
  dom.layoutStatusLine.textContent = message;
  dom.layoutStatusLine.dataset.level = level;
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
  activeLayoutDraft = createLayoutDraftBundle(session.getState().document.score);
  syncLayoutDialogFromDraft(dom, activeLayoutDraft, "Layout draft is ready.");
  dom.layoutDialog.showModal();
}

/**
 * layout row 추가 입력을 읽어 draft에 반영한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : position : 선택 row 위/아래 삽입 위치
 * - 반환값 : 없음
 */
function addLayoutRowFromDialog(
  dom: AppDom,
  position: LayoutInsertPosition,
): void {
  applyLayoutDraftChange(
    dom,
    addLayoutDraftRow(requireActiveLayoutDraft(), {
      rowType: dom.layoutRowTypeSelect.value === "gap" ? "gap" : "note",
      height: Number(dom.layoutRowHeightInput.value),
      midi: Number(dom.layoutRowMidiSelect.value),
      position,
    }),
  );
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
    activeLayoutDraft = null;
  });
  dom.layoutCancelButton.addEventListener("click", () => {
    dom.layoutDialog.close();
    activeLayoutDraft = null;
  });
  dom.layoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setLayoutDialogNotice(dom, "Layout Apply will be connected in the next implementation step.");
  });
  dom.layoutStringSelect.addEventListener("change", () => {
    applyLayoutDraftChange(dom, {
      ok: true,
      draft: selectLayoutDraftString(requireActiveLayoutDraft(), dom.layoutStringSelect.value),
      message: `Selected string ${dom.layoutStringSelect.value}.`,
    });
  });
  dom.layoutResetButton.addEventListener("click", () => {
    activeLayoutDraft = createLayoutDraftBundle(session.getState().document.score);
    syncLayoutDialogFromDraft(dom, activeLayoutDraft, "Layout draft was reset to the current score.");
  });
  dom.layoutNewPresetButton.addEventListener("click", () => {
    const presetIndex = dom.layoutPresetSelect.options.length + 1;
    const option = document.createElement("option");

    option.value = `draft-${presetIndex}`;
    option.textContent = `New layout ${presetIndex}`;
    dom.layoutPresetSelect.appendChild(option);
    dom.layoutPresetSelect.value = option.value;
    dom.layoutPresetNameInput.value = option.textContent;
    setLayoutDialogNotice(dom, "Preset creation is a draft UI action. Storage will be connected later.");
  });
  dom.layoutAddRowBelowButton.addEventListener("click", () => {
    addLayoutRowFromDialog(dom, "below");
  });
  dom.layoutAddRowAboveButton.addEventListener("click", () => {
    addLayoutRowFromDialog(dom, "above");
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
