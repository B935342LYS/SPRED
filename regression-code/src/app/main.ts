/**
 * 브라우저 앱 진입점이다.
 * sample RuntimeDocument를 로드하고 DOM event를 app 상태 갱신 흐름에 연결한다.
 */

import { loadRuntimeDocument } from "../core/score/create_runtime_document";
import type {
  AppState,
  ScoreHit,
  ScoreSelection,
} from "./app_types";
import { collectAppDom } from "./app_dom";
import {
  activateTupletSlot,
  composeTupletSlotTextFromRow,
  handleScoreClick,
  readDefaultNoteEditInput,
  setActiveTupletSlotText,
  syncDefaultEditToolFromDom,
  syncTupletEditToolFromDom,
} from "./app_controller";
import {
  applyRawTextToScore,
  createInitialState,
} from "./app_runtime";
import { composeEditRawText } from "./edit/edit_core";
import {
  normalizeMicroPitchInput,
  populateAbsolutePitchOptions,
  resolveAutoDefaultText,
} from "./pitch_label";
import { hitTestScoreCell } from "./score_hit_test";
import {
  renderApp,
  setStatus,
  syncLayoutScroll,
  syncLeftStatus,
  syncUiControls,
} from "./app_ui_sync";
import {
  downloadScoreJson,
  readTextFile,
} from "../infra/score_file_io";
import {
  loadScoreFromLocalStorage,
  saveScoreToLocalStorage,
} from "../infra/score_local_storage";
import sampleScoreJson from "../../dev/test_cases/minimal-valid-score.json?raw";

/**
 * sample JSON을 로드하고 base canvas renderer를 실행한다.
 * - 인수 : 없음
 * - 반환값 : 없음
 */
async function boot(): Promise<void> {
  // score viewer DOM 요소와 renderer가 사용할 canvas target을 준비한다.
  const dom = collectAppDom();

  populateAbsolutePitchOptions(dom.absolutePitchSelect);

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

  const loadScoreJsonText = (jsonText: string, sourceLabel: string): void => {
    state = {
      ...state,
      busy: { kind: "loadingScore", message: `Loading ${sourceLabel}...` },
    };
    syncLeftStatus(dom, state);
    syncUiControls(dom, state);

    const nextLoadResult = loadRuntimeDocument(jsonText);

    if (!nextLoadResult.ok) {
      state = {
        ...state,
        busy: { kind: "idle" },
        statusMessage: {
          level: "error",
          text: nextLoadResult.error.message,
        },
      };
      syncLeftStatus(dom, state);
      syncUiControls(dom, state);
      return;
    }

    dom.editToggle.checked = false;
    state = {
      ...createInitialState(nextLoadResult.document),
      statusMessage: {
        level: "info",
        text: `${sourceLabel} loaded.`,
      },
    };
    render();
  };

  render();
  setStatus(0, "sample auto load: done");

  // score 영역이 스크롤될 때 layout label stage의 세로 위치를 함께 이동한다.
  dom.scoreArea.addEventListener("scroll", () => {
    syncLayoutScroll(dom.scoreArea, dom.layoutStage);
  });
  window.addEventListener("resize", render);
  // zoom 값이 확정되면 전체 canvas score를 다시 그린다.
  dom.zoomInput.addEventListener("change", render);
  dom.jsonDownloadButton.addEventListener("click", () => {
    downloadScoreJson(state.document.score);
    state = {
      ...state,
      statusMessage: {
        level: "info",
        text: "JSON downloaded.",
      },
    };
    syncLeftStatus(dom, state);
  });
  dom.jsonLoadButton.addEventListener("click", () => {
    dom.jsonLoadInput.click();
  });
  dom.jsonLoadInput.addEventListener("change", () => {
    const file = dom.jsonLoadInput.files?.item(0);

    if (file === null || file === undefined) {
      return;
    }

    readTextFile(file)
      .then((jsonText) => {
        loadScoreJsonText(jsonText, file.name);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown file read error.";

        state = {
          ...state,
          statusMessage: {
            level: "error",
            text: message,
          },
        };
        syncLeftStatus(dom, state);
      })
      .finally(() => {
        dom.jsonLoadInput.value = "";
      });
  });
  dom.localSaveButton.addEventListener("click", () => {
    try {
      saveScoreToLocalStorage(state.document.score);
      state = {
        ...state,
        statusMessage: {
          level: "info",
          text: "Score saved to local storage.",
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown local save error.";

      state = {
        ...state,
        statusMessage: {
          level: "error",
          text: message,
        },
      };
    }

    syncLeftStatus(dom, state);
  });
  dom.localLoadButton.addEventListener("click", () => {
    try {
      const jsonText = loadScoreFromLocalStorage();

      if (jsonText === null) {
        state = {
          ...state,
          statusMessage: {
            level: "warning",
            text: "No local score is saved.",
          },
        };
        syncLeftStatus(dom, state);
        return;
      }

      loadScoreJsonText(jsonText, "local storage");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown local load error.";

      state = {
        ...state,
        statusMessage: {
          level: "error",
          text: message,
        },
      };
      syncLeftStatus(dom, state);
    }
  });
  dom.editToggle.addEventListener("change", () => {
    // checkbox 상태를 mode로 변환하고 edit panel의 현재 입력값을 rawText 합성 상태로 보관한다.
    state = {
      ...state,
      mode: dom.editToggle.checked
        ? {
            kind: "edit",
            tool: {
              kind: "default",
              input: resolveAutoDefaultText(
                state,
                readDefaultNoteEditInput(dom),
                state.selection?.rowId ?? null,
              ),
            },
          }
        : { kind: "view" },
      statusMessage: {
        level: "info",
        text: dom.editToggle.checked ? "Edit mode: AUTO♯" : "View mode",
      },
    };
    syncLeftStatus(dom, state);
    syncUiControls(dom, state);
  });

  const syncDefaultEditInput = (): void => {
    state = syncDefaultEditToolFromDom(dom, state);
    syncUiControls(dom, state);
  };

  // edit panel 입력이 바뀔 때마다 현재 rawText preview와 click 적용 상태를 동기화한다.
  dom.defaultModeSelect.addEventListener("change", syncDefaultEditInput);
  dom.customTextInput.addEventListener("input", syncDefaultEditInput);
  dom.holdTokenSelect.addEventListener("change", syncDefaultEditInput);
  dom.glissKindSelect.addEventListener("change", syncDefaultEditInput);
  dom.glissIdSelect.addEventListener("change", syncDefaultEditInput);
  dom.tremDivisionSelect.addEventListener("change", syncDefaultEditInput);
  dom.absolutePitchSelect.addEventListener("change", syncDefaultEditInput);
  dom.microPitchInput.addEventListener("input", () => {
    const normalizedValue = normalizeMicroPitchInput(dom.microPitchInput.value);

    if (dom.microPitchInput.value !== normalizedValue) {
      dom.microPitchInput.value = normalizedValue;
    }

    syncDefaultEditInput();
  });
  dom.tupletModeToggle.addEventListener("click", () => {
    if (state.mode.kind !== "edit") {
      return;
    }

    const isTupletMode = state.mode.tool.kind === "tuplet" ||
      state.mode.tool.kind === "pletExtend";

    if (isTupletMode) {
      state = {
        ...state,
        mode: {
          kind: "edit",
          tool: {
            kind: "default",
            input: resolveAutoDefaultText(
              state,
              readDefaultNoteEditInput(dom),
              state.selection?.rowId ?? null,
            ),
          },
        },
      };
    } else if (dom.tupletInsertModeSelect.value === "extend") {
      state = {
        ...state,
        mode: {
          kind: "edit",
          tool: {
            kind: "pletExtend",
          },
        },
      };
    } else {
      state = syncTupletEditToolFromDom(dom, state);
    }

    syncUiControls(dom, state);
  });

  const syncTupletEditInput = (): void => {
    if (
      state.mode.kind === "edit" &&
      state.mode.tool.kind === "pletExtend" &&
      dom.tupletInsertModeSelect.value !== "extend"
    ) {
      state = syncTupletEditToolFromDom(dom, state);
    } else if (
      state.mode.kind === "edit" &&
      state.mode.tool.kind === "tuplet" &&
      dom.tupletInsertModeSelect.value === "extend"
    ) {
      state = {
        ...state,
        mode: {
          kind: "edit",
          tool: {
            kind: "pletExtend",
          },
        },
      };
    } else if (state.mode.kind === "edit" && state.mode.tool.kind === "tuplet") {
      state = syncTupletEditToolFromDom(dom, state);
    }

    syncUiControls(dom, state);
  };

  dom.tupletDivisionSelect.addEventListener("change", syncTupletEditInput);
  dom.tupletInsertModeSelect.addEventListener("change", syncTupletEditInput);
  dom.tupletFinalizeButton.addEventListener("click", () => {
    state = syncTupletEditToolFromDom(dom, state);
    dom.tupletInsertModeSelect.value = "SELECT MODE";
    state = {
      ...state,
      statusMessage: {
        level: "info",
        text: "Tuplet value finalized. Select a score cell to apply.",
      },
    };
    syncLeftStatus(dom, state);
    syncUiControls(dom, state);
  });
  dom.tupletSlotInputs.forEach((input, slotIndex) => {
    input.addEventListener("click", () => {
      state = activateTupletSlot(dom, state, slotIndex);
      syncLeftStatus(dom, state);
      syncUiControls(dom, state);
    });
    input.addEventListener("focus", () => {
      state = activateTupletSlot(dom, state, slotIndex);
      syncLeftStatus(dom, state);
      syncUiControls(dom, state);
    });
    input.addEventListener("input", syncTupletEditInput);
  });
  dom.scoreStage.addEventListener("click", (event) => {
    if (state.busy.kind !== "idle" || state.layout === null) {
      return;
    }

    const hit = hitTestScoreCell(event, dom.scoreStage, state.layout);

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

    if (
      state.mode.tool.kind === "tuplet" &&
      dom.tupletInsertModeSelect.value === "SELECT ROW"
    ) {
      const slotTextResult = composeTupletSlotTextFromRow(dom, state, hit);

      if (slotTextResult.kind === "blocked") {
        state = {
          ...state,
          statusMessage: {
            level: "warning",
            text: slotTextResult.message,
          },
        };
        syncLeftStatus(dom, state);
        return;
      }

      state = setActiveTupletSlotText(dom, state, slotTextResult.text);
      syncLeftStatus(dom, state);
      syncUiControls(dom, state);
      return;
    }

    const editRawText = state.mode.tool.kind === "pletExtend"
      ? {
          kind: "apply" as const,
          rawText: "/&",
        }
      : state.mode.tool.kind === "tuplet"
        ? composeEditRawText({
            kind: "tuplet",
            draft: state.mode.tool.draft,
          })
        : composeEditRawText({
            kind: "default",
            input: resolveAutoDefaultText(state, state.mode.tool.input, hit.rowId),
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
  dom.scoreStage.addEventListener("contextmenu", (event) => {
    if (state.mode.kind !== "edit") {
      return;
    }

    // edit mode의 score stage 우클릭은 브라우저 메뉴 대신 해당 note cell 삭제로 해석한다.
    event.preventDefault();

    if (state.busy.kind !== "idle" || state.layout === null) {
      return;
    }

    const hit = hitTestScoreCell(event, dom.scoreStage, state.layout);

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
