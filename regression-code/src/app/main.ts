/**
 * 브라우저 앱 진입점이다.
 * sample RuntimeDocument를 로드하고 DOM event를 app 상태 갱신 흐름에 연결한다.
 */

import type {
  NumberEditRamp,
  ScoreHit,
  ScoreSelection,
} from "./app_types";
import { collectAppDom } from "./app_dom";
import {
  activateTupletSlot,
  composeTupletSlotTextFromRow,
  handleScoreClick,
  readDefaultNoteEditInput,
  resolveTupletHeadPlacementHit,
  setActiveTupletSlotText,
  syncDefaultEditToolFromDom,
  syncTupletEditToolFromDom,
} from "./app_controller";
import {
  applyMusicDataEditToState,
  applyRawTextBatchEditToState,
  loadScoreTextAsInitialState,
} from "./app_runtime";
import type { ScoreTextEdit } from "./edit/edit_apply";
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
  syncMusicMetadata,
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
import { columnToX } from "../renderer/canvas_coordinate";
import {
  createAppPlaybackRuntime,
  type AppPlaybackRuntime,
} from "./app_playback";
import sampleScoreJson from "../../dev/test_cases/minimal-valid-score.json?raw";

type RepeatedClickCycleState = {
  targetKey: string;
  baseRawText: string;
  nextStep: 0 | 1 | 2;
};

type DragEditState = {
  pointerId: number;
  button: 0 | 2;
  startClientX: number;
  startClientY: number;
  startHit: ScoreHit | null;
  lastHit: ScoreHit | null;
  canDrag: boolean;
  isDragging: boolean;
  edits: Map<string, ScoreTextEdit>;
};

const DRAG_START_DISTANCE_PX = 4;
const NOTE_ROW_HIT_SLOP_PX = 14;

/**
 * sample JSON을 로드하고 base canvas renderer를 실행한다.
 * - 인수 : 없음
 * - 반환값 : 없음
 */
async function boot(): Promise<void> {
  // score viewer DOM 요소와 renderer가 사용할 canvas target을 준비한다.
  const dom = collectAppDom();

  populateAbsolutePitchOptions(dom.absolutePitchSelect);

  const sampleLoadResult = loadScoreTextAsInitialState(sampleScoreJson, "sample score");

  if (!sampleLoadResult.ok) {
    throw new Error(sampleLoadResult.message);
  }

  let state = sampleLoadResult.state;
  let playbackRuntime: AppPlaybackRuntime;
  let playbackRafId: number | null = null;
  let repeatedClickCycle: RepeatedClickCycleState | null = null;
  let dragEdit: DragEditState | null = null;
  let suppressNextClick = false;

  const render = (): void => {
    state = renderApp(dom, state);
    syncMusicMetadata(dom, state);
    syncLeftStatus(dom, state);
    syncUiControls(dom, state);
  };

  const stopPlaybackAnimation = (): void => {
    if (playbackRafId !== null) {
      cancelAnimationFrame(playbackRafId);
      playbackRafId = null;
    }
  };

  const syncPlaybackStatus = (text: string): void => {
    dom.playbackStatus.textContent = text;
    dom.playbackStatus.title = text;
  };

  const setZoomPercent = (zoomPercent: number, minZoomPercent?: number): void => {
    const min = Number(dom.zoomInput.min);
    const max = Number(dom.zoomInput.max);
    const normalizedMin = minZoomPercent ?? (Number.isFinite(min) ? min : 1);
    const boundedZoom = Math.min(
      Math.max(zoomPercent, normalizedMin),
      Number.isFinite(max) ? max : 400,
    );

    dom.zoomInput.value = String(Math.round(boundedZoom));
  };

  const fitScoreHeight = (): void => {
    const baseStageHeight = state.renderInput.rows.reduce(
      (sum, row) => sum + Math.max(0, row.height),
      0,
    );
    const targetHeight = Math.max(
      0,
      dom.scoreArea.clientHeight,
    );

    if (baseStageHeight <= 0 || targetHeight <= 0) {
      state = {
        ...state,
        statusMessage: {
          level: "warning",
          text: "Fit Height needs a visible score area.",
        },
      };
      syncLeftStatus(dom, state);
      return;
    }

    setZoomPercent((targetHeight / baseStageHeight) * 100);
    render();
    state = {
      ...state,
      statusMessage: {
        level: "info",
        text: `Fit Height: ${dom.zoomInput.value}%`,
      },
    };
    syncLeftStatus(dom, state);
  };

  const syncFullscreenButton = (): void => {
    dom.fullscreenButton.textContent =
      document.fullscreenElement === dom.appShell ? "Exit Fullscreen" : "Fullscreen";
  };

  const readIntegerInput = (input: HTMLInputElement, fallback: number): number => {
    const value = Number.parseInt(input.value, 10);

    return Number.isFinite(value) ? value : fallback;
  };

  const populateDetailsDialog = (): void => {
    const musicData = state.document.score.musicData;

    // Details dialog는 생성/수정 시각을 제외한 musicData 편집 필드를 현재 score 값으로 채운다.
    dom.detailsTitleInput.value = musicData.musicTitle;
    dom.detailsArtistInput.value = musicData.musicArtist;
    dom.detailsGenreInput.value = musicData.musicGenre;
    dom.detailsWriterInput.value = musicData.scoreWriter;
    dom.detailsCommentInput.value = musicData.comment;
    dom.detailsBasicDifficultyInput.value = String(musicData.scoreDifficulty.basic);
    dom.detailsOptionalDifficultyInput.value = String(musicData.scoreDifficulty.optional);
    dom.detailsExtraDifficultyInput.value = String(musicData.scoreDifficulty.extra);
    dom.detailsYoutubeVideoInput.value = musicData.youtube.videoId;
    dom.detailsYoutubeOffsetInput.value = String(musicData.youtube.offsetMs);
  };

  const openDetailsDialog = (): void => {
    populateDetailsDialog();
    dom.detailsDialog.showModal();
  };

  const applyDetailsDialog = (): void => {
    const currentMusicData = state.document.score.musicData;

    state = applyMusicDataEditToState(state, {
      ...currentMusicData,
      musicTitle: dom.detailsTitleInput.value,
      musicArtist: dom.detailsArtistInput.value,
      musicGenre: dom.detailsGenreInput.value,
      scoreWriter: dom.detailsWriterInput.value,
      comment: dom.detailsCommentInput.value.slice(0, 100),
      scoreDifficulty: {
        basic: readIntegerInput(
          dom.detailsBasicDifficultyInput,
          currentMusicData.scoreDifficulty.basic,
        ),
        optional: readIntegerInput(
          dom.detailsOptionalDifficultyInput,
          currentMusicData.scoreDifficulty.optional,
        ),
        extra: readIntegerInput(
          dom.detailsExtraDifficultyInput,
          currentMusicData.scoreDifficulty.extra,
        ),
      },
      youtube: {
        videoId: dom.detailsYoutubeVideoInput.value,
        offsetMs: readIntegerInput(
          dom.detailsYoutubeOffsetInput,
          currentMusicData.youtube.offsetMs,
        ),
      },
    });
    dom.detailsDialog.close();
    render();
  };

  const toggleFullscreen = (): void => {
    if (document.fullscreenElement === dom.appShell) {
      document.exitFullscreen()
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : "Unknown fullscreen error.";

          state = {
            ...state,
            statusMessage: {
              level: "error",
              text: message,
            },
          };
          syncLeftStatus(dom, state);
        });
      return;
    }

    dom.appShell.requestFullscreen()
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown fullscreen error.";

        state = {
          ...state,
          statusMessage: {
            level: "error",
            text: message,
          },
        };
        syncLeftStatus(dom, state);
      });
  };

  playbackRuntime = createAppPlaybackRuntime(dom, state);

  const resetPlaybackForCurrentState = (): void => {
    stopPlaybackAnimation();
    playbackRuntime.controller.dispose();
    playbackRuntime = createAppPlaybackRuntime(dom, state);
    syncPlaybackStatus("stopped");
  };

  const resetRepeatedClickCycle = (): void => {
    repeatedClickCycle = null;
  };

  const getSelectionForHit = (hit: ScoreHit): ScoreSelection => ({
    ...hit,
    trackId: state.activeTrackId,
  });

  const getEditTargetKey = (selection: ScoreSelection): string =>
    `${selection.trackId}|${selection.rowId}|${selection.col}`;

  const getScoreTextEditKey = (edit: ScoreTextEdit): string =>
    getEditTargetKey(edit.selection);

  const getPointerEditHit = (event: MouseEvent): ScoreHit | null => {
    if (state.layout === null) {
      return null;
    }

    return hitTestScoreCell(event, dom.scoreStage, state.layout, {
      nearestNoteSlopPx: NOTE_ROW_HIT_SLOP_PX,
    });
  };

  const getExistingRawText = (selection: ScoreSelection): string => {
    if (selection.rowKind === "global") {
      const cell = state.document.indexes.globalCellMapByCoord.get(
        `${selection.rowId}|${selection.col}`,
      );

      return cell?.rawText ?? "";
    }

    if (selection.rowKind === "note") {
      const trackCellMap = state.document.indexes.cellMapByTrackId.get(selection.trackId);
      const cell = trackCellMap?.get(`${selection.rowId}|${selection.col}`);

      return cell?.rawText ?? "";
    }

    return "";
  };

  const cycleRawTextFromExistingCell = (
    existingRawText: string,
    baseRawText: string,
  ): string => {
    const normalized = existingRawText.trim();
    const pitchModifierSuffix = extractPitchModifierSuffix(baseRawText);

    if (normalized.length === 0) {
      return baseRawText;
    }

    if (normalized.startsWith("-")) {
      return `~${pitchModifierSuffix}`;
    }

    if (normalized.startsWith("~")) {
      return baseRawText;
    }

    return `-${pitchModifierSuffix}`;
  };

  const extractPitchModifierSuffix = (rawText: string): string => {
    const pitchTokenSuffix = rawText.match(/(?:@(?:p|m)\([^)]*\))+$/);

    return pitchTokenSuffix?.[0] ?? "";
  };

  const getSelectedNumberRamp = (): NumberEditRamp => {
    const selectedButton = dom.numberRampButtons.find(
      (button) => button.getAttribute("aria-pressed") === "true",
    );
    const ramp = selectedButton?.dataset.ramp;

    if (ramp === "start" || ramp === "end" || ramp === "endStart") {
      return ramp;
    }

    return "none";
  };

  const setSelectedNumberRamp = (ramp: NumberEditRamp): void => {
    dom.numberRampButtons.forEach((button) => {
      const isSelected = button.dataset.ramp === ramp;

      button.setAttribute("aria-pressed", String(isSelected));
      button.classList.toggle("on", isSelected);
      button.classList.toggle("off", !isSelected);
    });
  };

  const getRampToken = (ramp: NumberEditRamp): string => {
    if (ramp === "start") {
      return "<";
    }

    if (ramp === "end") {
      return ">";
    }

    if (ramp === "endStart") {
      return "><";
    }

    return "";
  };

  const composeNumberRawTextForHit = (hit: ScoreHit):
    | {
        kind: "apply";
        rawText: string;
      }
    | {
        kind: "blocked";
        message: string;
      } => {
    if (hit.rowKind !== "global") {
      return {
        kind: "blocked",
        message: "Number input can only edit global rows.",
      };
    }

    const numberText = dom.numberRawInput.value.trim();

    if (numberText.length === 0) {
      return {
        kind: "blocked",
        message: "Number input is empty.",
      };
    }

    const row = state.document.indexes.rowById.get(hit.rowId);

    if (row?.type !== "global") {
      return {
        kind: "blocked",
        message: "Selected row is not a global row.",
      };
    }

    const ramp = getSelectedNumberRamp();

    if (
      ramp !== "none" &&
      row.kind !== "bpm" &&
      row.kind !== "dynamics"
    ) {
      return {
        kind: "blocked",
        message: `${row.kind} does not allow tempo mark tokens.`,
      };
    }

    return {
      kind: "apply",
      rawText: `${numberText}${getRampToken(ramp)}`,
    };
  };

  const updatePlaybackScroll = (): void => {
    if (!playbackRuntime.controller.isPlaying() || state.layout === null) {
      playbackRafId = null;
      return;
    }

    const currentTick = playbackRuntime.timeMapper.secondsToTick(
      playbackRuntime.controller.getCurrentScoreSeconds(),
    );
    const currentTickNumber = currentTick.numerator / currentTick.denominator;

    // score canvas의 왼쪽 edge를 재생 기준선으로 두고 현재 tick이 그 위치에 오도록 스크롤한다.
    dom.scoreArea.scrollLeft = columnToX(currentTickNumber, state.layout);
    playbackRafId = requestAnimationFrame(updatePlaybackScroll);
  };

  const applyScoreTextEdits = (edits: ScoreTextEdit[]): void => {
    if (edits.length === 0) {
      return;
    }

    state = {
      ...state,
      busy: { kind: "applyingEdit", message: "Applying edit..." },
    };
    syncLeftStatus(dom, state);
    syncUiControls(dom, state);

    // 모아둔 rawText 편집을 하나의 full rebuild 경로로 넘겨 드래그 입력 중 rebuild 반복을 피한다.
    state = applyRawTextBatchEditToState(state, edits);

    render();
    resetPlaybackForCurrentState();
  };

  const applyRepeatedClickCycle = (hit: ScoreHit, baseRawText: string): string => {
    const selection = getSelectionForHit(hit);
    const targetKey = getEditTargetKey(selection);
    const pitchModifierSuffix = extractPitchModifierSuffix(baseRawText);

    if (
      repeatedClickCycle === null ||
      repeatedClickCycle.targetKey !== targetKey ||
      repeatedClickCycle.baseRawText !== baseRawText
    ) {
      repeatedClickCycle = {
        targetKey,
        baseRawText,
        nextStep: 1,
      };
      return baseRawText;
    }

    if (repeatedClickCycle.nextStep === 1) {
      repeatedClickCycle = {
        ...repeatedClickCycle,
        nextStep: 2,
      };
      return `-${pitchModifierSuffix}`;
    }

    if (repeatedClickCycle.nextStep === 2) {
      repeatedClickCycle = {
        ...repeatedClickCycle,
        nextStep: 0,
      };
      return `~${pitchModifierSuffix}`;
    }

    repeatedClickCycle = {
      ...repeatedClickCycle,
      nextStep: 1,
    };
    return baseRawText;
  };

  const composeSingleEditForHit = (
    hit: ScoreHit,
    options: {
      useClickCycle: boolean;
      forceDelete: boolean;
    },
  ):
    | {
        kind: "edit";
        edit: ScoreTextEdit;
      }
    | {
        kind: "handled";
      }
    | {
        kind: "blocked";
        message: string;
      } => {
    const mode = state.mode;

    if (mode.kind !== "edit") {
      return {
        kind: "blocked",
        message: "Edit mode is not active.",
      };
    }

    if (options.forceDelete) {
      resetRepeatedClickCycle();
      return {
        kind: "edit",
        edit: {
          selection: getSelectionForHit(hit),
          rawText: "",
        },
      };
    }

    if (hit.rowKind === "global") {
      resetRepeatedClickCycle();
      const numberResult = composeNumberRawTextForHit(hit);

      if (numberResult.kind === "blocked") {
        return numberResult;
      }

      return {
        kind: "edit",
        edit: {
          selection: getSelectionForHit(hit),
          rawText: numberResult.rawText,
        },
      };
    }

    if (
      mode.tool.kind === "tuplet" &&
      dom.tupletInsertModeSelect.value === "SELECT ROW"
    ) {
      resetRepeatedClickCycle();
      const slotTextResult = composeTupletSlotTextFromRow(dom, state, hit);

      if (slotTextResult.kind === "blocked") {
        return slotTextResult;
      }

      state = setActiveTupletSlotText(dom, state, slotTextResult.text);
      syncLeftStatus(dom, state);
      syncUiControls(dom, state);
      return {
        kind: "handled",
      };
    }

    const editRawText = mode.tool.kind === "pletExtend"
      ? {
          kind: "apply" as const,
          rawText: "/&",
        }
      : mode.tool.kind === "tuplet"
        ? composeEditRawText({
            kind: "tuplet",
            draft: mode.tool.draft,
          })
        : composeEditRawText({
            kind: "default",
            input: resolveAutoDefaultText(state, mode.tool.input, hit.rowId),
          });

    if (editRawText.kind === "blocked") {
      return {
        kind: "blocked",
        message: editRawText.message,
      };
    }

    let targetHit = hit;
    let rawText = editRawText.kind === "delete" ? "" : editRawText.rawText;

    if (mode.tool.kind === "tuplet" && editRawText.kind === "apply") {
      resetRepeatedClickCycle();
      const placementResult = resolveTupletHeadPlacementHit(state, hit, editRawText.rawText);

      if (placementResult.kind === "blocked") {
        return placementResult;
      }

      targetHit = placementResult.hit;
    } else if (
      options.useClickCycle &&
      mode.tool.kind === "default" &&
      editRawText.kind === "apply" &&
      hit.rowKind === "note"
    ) {
      rawText = applyRepeatedClickCycle(hit, editRawText.rawText);
    } else {
      resetRepeatedClickCycle();
    }

    return {
      kind: "edit",
      edit: {
        selection: getSelectionForHit(targetHit),
        rawText,
      },
    };
  };

  const applySinglePointerEdit = (
    hit: ScoreHit,
    options: {
      useClickCycle: boolean;
      forceDelete: boolean;
    },
  ): void => {
    const result = composeSingleEditForHit(hit, options);

    if (result.kind === "blocked") {
      state = {
        ...state,
        statusMessage: {
          level: "warning",
          text: result.message,
        },
      };
      syncLeftStatus(dom, state);
      return;
    }

    if (result.kind === "handled") {
      return;
    }

    applyScoreTextEdits([result.edit]);
  };

  const composeDragRawTextForHit = (
    hit: ScoreHit,
    button: 0 | 2,
  ):
    | {
        kind: "apply";
        rawText: string;
      }
    | {
        kind: "blocked";
        message: string;
      } => {
    if (button === 2) {
      return {
        kind: "apply",
        rawText: "",
      };
    }

    if (hit.rowKind === "global") {
      return composeNumberRawTextForHit(hit);
    }

    const mode = state.mode;

    if (mode.kind !== "edit") {
      return {
        kind: "blocked",
        message: "Drag edit is only available in edit mode.",
      };
    }

    if (mode.tool.kind === "pletExtend") {
      return {
        kind: "apply",
        rawText: "/&",
      };
    }

    if (mode.tool.kind !== "default") {
      return {
        kind: "blocked",
        message: "Drag edit is only available for Default, Eraser, Number, and /& input.",
      };
    }

    const editRawText = composeEditRawText({
      kind: "default",
      input: resolveAutoDefaultText(state, mode.tool.input, hit.rowId),
    });

    if (editRawText.kind === "blocked") {
      return {
        kind: "blocked",
        message: editRawText.message,
      };
    }

    const baseRawText = editRawText.kind === "delete" ? "" : editRawText.rawText;

    if (
      editRawText.kind === "apply" &&
      !baseRawText.startsWith("//") &&
      hit.rowKind === "note"
    ) {
      return {
        kind: "apply",
        rawText: cycleRawTextFromExistingCell(
          getExistingRawText(getSelectionForHit(hit)),
          baseRawText,
        ),
      };
    }

    return {
      kind: "apply",
      rawText: baseRawText,
    };
  };

  const createDragEditForHit = (
    dragState: DragEditState,
    hit: ScoreHit,
  ): ScoreTextEdit | null => {
    const rawTextResult = composeDragRawTextForHit(hit, dragState.button);

    if (rawTextResult.kind === "blocked") {
      return null;
    }

    const selection = getSelectionForHit(hit);

    return {
      selection,
      rawText: rawTextResult.rawText,
    };
  };

  const addDragEditForHit = (dragState: DragEditState, hit: ScoreHit): ScoreTextEdit[] => {
    const edits: ScoreTextEdit[] = [];

    // 같은 행에서 빠르게 이동해 중간 열 hit가 누락된 경우 이전 열과 현재 열 사이를 채운다.
    if (dragState.lastHit !== null && dragState.lastHit.rowId === hit.rowId) {
      const startCol = Math.min(dragState.lastHit.col, hit.col);
      const endCol = Math.max(dragState.lastHit.col, hit.col);

      for (let col = startCol; col <= endCol; col += 1) {
        const interpolatedEdit = createDragEditForHit(dragState, {
          ...hit,
          col,
        });

        if (interpolatedEdit !== null) {
          dragState.edits.set(getScoreTextEditKey(interpolatedEdit), interpolatedEdit);
          edits.push(interpolatedEdit);
        }
      }
    } else {
      const edit = createDragEditForHit(dragState, hit);

      if (edit !== null) {
        dragState.edits.set(getScoreTextEditKey(edit), edit);
        edits.push(edit);
      }
    }

    dragState.lastHit = hit;

    return edits;
  };

  const shouldStartDragEdit = (event: PointerEvent): boolean => {
    if (dragEdit === null || dragEdit.isDragging || !dragEdit.canDrag) {
      return false;
    }

    const deltaX = event.clientX - dragEdit.startClientX;
    const deltaY = event.clientY - dragEdit.startClientY;

    return Math.hypot(deltaX, deltaY) >= DRAG_START_DISTANCE_PX;
  };

  const loadScoreJsonText = (jsonText: string, sourceLabel: string): void => {
    state = {
      ...state,
      busy: { kind: "loadingScore", message: `Loading ${sourceLabel}...` },
    };
    syncLeftStatus(dom, state);
    syncUiControls(dom, state);

    const nextLoadResult = loadScoreTextAsInitialState(jsonText, sourceLabel);

    if (!nextLoadResult.ok) {
      state = {
        ...state,
        busy: { kind: "idle" },
        statusMessage: {
          level: "error",
          text: nextLoadResult.message,
        },
      };
      syncLeftStatus(dom, state);
      syncUiControls(dom, state);
      return;
    }

    dom.editToggle.checked = false;
    state = {
      ...nextLoadResult.state,
      busy: { kind: "idle" },
    };
    render();
    resetPlaybackForCurrentState();
  };

  render();
  setStatus(0, "sample auto load: done");

  // score 영역이 스크롤될 때 layout label stage의 세로 위치를 함께 이동한다.
  dom.scoreArea.addEventListener("scroll", () => {
    syncLayoutScroll(dom.scoreArea, dom.layoutStage);
  });
  window.addEventListener("resize", render);
  document.addEventListener("fullscreenchange", () => {
    syncFullscreenButton();
    render();
  });
  // zoom 값이 확정되면 수동 zoom 하한을 적용한 뒤 전체 canvas score를 다시 그린다.
  dom.zoomInput.addEventListener("change", () => {
    setZoomPercent(Number(dom.zoomInput.value), 100);
    render();
  });
  dom.fitHeightButton.addEventListener("click", fitScoreHeight);
  dom.fullscreenButton.addEventListener("click", toggleFullscreen);
  dom.detailsButton.addEventListener("click", openDetailsDialog);
  dom.detailsCloseButton.addEventListener("click", () => {
    dom.detailsDialog.close();
  });
  dom.detailsCancelButton.addEventListener("click", () => {
    dom.detailsDialog.close();
  });
  dom.detailsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    applyDetailsDialog();
  });
  dom.playButton.addEventListener("click", () => {
    if (state.busy.kind !== "idle") {
      return;
    }

    resetPlaybackForCurrentState();
    playbackRuntime.controller
      .playFromStart()
      .then(() => {
        dom.scoreArea.scrollLeft = 0;
        syncPlaybackStatus("playing");
        stopPlaybackAnimation();
        playbackRafId = requestAnimationFrame(updatePlaybackScroll);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown playback error.";

        state = {
          ...state,
          statusMessage: {
            level: "error",
            text: message,
          },
        };
        syncPlaybackStatus("error");
        syncLeftStatus(dom, state);
      });
  });
  dom.stopButton.addEventListener("click", () => {
    stopPlaybackAnimation();
    playbackRuntime.controller.stop();
    dom.scoreArea.scrollLeft = 0;
    syncPlaybackStatus("stopped");
    syncLayoutScroll(dom.scoreArea, dom.layoutStage);
  });
  dom.volumeInput.addEventListener("change", resetPlaybackForCurrentState);
  dom.waveSelect.addEventListener("change", resetPlaybackForCurrentState);
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
  dom.numberRawInput.addEventListener("input", resetRepeatedClickCycle);
  dom.numberRampButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const ramp = button.dataset.ramp;

      if (ramp === "none" || ramp === "start" || ramp === "end" || ramp === "endStart") {
        setSelectedNumberRamp(ramp);
        resetRepeatedClickCycle();
      }
    });
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
  dom.scoreStage.addEventListener("pointerdown", (event) => {
    if (
      state.busy.kind !== "idle" ||
      state.layout === null ||
      state.mode.kind !== "edit" ||
      (event.button !== 0 && event.button !== 2)
    ) {
      return;
    }

    const hit = getPointerEditHit(event);

    event.preventDefault();
    suppressNextClick = true;

    const button = event.button as 0 | 2;
    const dragRawText = hit === null ? null : composeDragRawTextForHit(hit, button);
    const canStartFloatingDrag = button === 2 ||
      (
        state.mode.kind === "edit" &&
        (state.mode.tool.kind === "default" || state.mode.tool.kind === "pletExtend")
      );

    dragEdit = dragRawText?.kind === "apply" || (hit === null && canStartFloatingDrag)
      ? {
          pointerId: event.pointerId,
          button,
          startClientX: event.clientX,
          startClientY: event.clientY,
          startHit: hit,
          lastHit: hit,
          canDrag: true,
          isDragging: false,
          edits: new Map(),
        }
      : null;

    if (dragRawText?.kind === "blocked") {
      // 드래그 입력을 지원하지 않는 도구는 pointerup에서 단일 클릭 처리만 수행한다.
      dragEdit = {
        pointerId: event.pointerId,
        button,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startHit: hit,
        lastHit: hit,
        canDrag: false,
        isDragging: false,
        edits: new Map(),
      };
    }

    dom.scoreStage.setPointerCapture(event.pointerId);
  });
  dom.scoreStage.addEventListener("pointermove", (event) => {
    if (
      dragEdit === null ||
      dragEdit.pointerId !== event.pointerId ||
      state.busy.kind !== "idle" ||
      state.layout === null
    ) {
      return;
    }

    let startedDragThisMove = false;

    if (shouldStartDragEdit(event)) {
      dragEdit.isDragging = true;
      startedDragThisMove = true;
      resetRepeatedClickCycle();
      if (dragEdit.startHit !== null) {
        const startEdits = addDragEditForHit(dragEdit, dragEdit.startHit);

        applyScoreTextEdits(startEdits);
        dragEdit.edits.clear();
      }
    }

    if (!dragEdit.isDragging) {
      return;
    }

    const hit = getPointerEditHit(event);

    if (hit === null) {
      return;
    }

    if (
      startedDragThisMove &&
      dragEdit.startHit !== null &&
      dragEdit.startHit.rowId === hit.rowId &&
      dragEdit.startHit.col === hit.col
    ) {
      return;
    }

    const edits = addDragEditForHit(dragEdit, hit);

    applyScoreTextEdits(edits);
    dragEdit.edits.clear();
  });
  dom.scoreStage.addEventListener("pointerup", (event) => {
    if (dragEdit === null || dragEdit.pointerId !== event.pointerId) {
      return;
    }

    const completedDrag = dragEdit;
    dragEdit = null;

    if (dom.scoreStage.hasPointerCapture(event.pointerId)) {
      dom.scoreStage.releasePointerCapture(event.pointerId);
    }

    if (completedDrag.isDragging) {
      applyScoreTextEdits(Array.from(completedDrag.edits.values()));
      return;
    }

    if (completedDrag.startHit === null) {
      return;
    }

    applySinglePointerEdit(completedDrag.startHit, {
      useClickCycle: completedDrag.button === 0,
      forceDelete: completedDrag.button === 2,
    });
  });
  dom.scoreStage.addEventListener("pointercancel", (event) => {
    if (dragEdit === null || dragEdit.pointerId !== event.pointerId) {
      return;
    }

    dragEdit = null;
  });
  dom.scoreStage.addEventListener("click", (event) => {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }

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

    applySinglePointerEdit(hit, {
      useClickCycle: true,
      forceDelete: false,
    });
  });
  dom.scoreStage.addEventListener("contextmenu", (event) => {
    if (state.mode.kind !== "edit") {
      return;
    }

    // edit mode의 score stage 우클릭은 브라우저 메뉴 대신 pointer 삭제 입력으로 해석한다.
    event.preventDefault();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  boot().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown boot error.";
    setStatus(0, "sample auto load: failed");
    setStatus(1, message);
  });
});
