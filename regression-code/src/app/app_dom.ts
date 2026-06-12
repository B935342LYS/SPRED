/**
 * app 진입점에서 사용하는 DOM 조회와 canvas target 생성을 담당한다.
 */

import type { AppDom } from "./app_types";
import type {
  CanvasLayerTarget,
  CanvasRenderTarget,
} from "../renderer/canvas_types";

/**
 * selector에 해당하는 HTML 요소를 찾고 타입을 확인한다.
 * - 인수 : selector : 조회할 CSS selector
 * - 인수 : ctor : 기대하는 HTMLElement 생성자
 * - 반환값 : 타입이 확인된 HTML 요소
 */
export function queryElement<T extends HTMLElement>(
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
export function createCanvasLayerTarget(selector: string): CanvasLayerTarget {
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
export function createCanvasRenderTarget(): CanvasRenderTarget {
  return {
    layout: createCanvasLayerTarget(".label-layer"),
    base: createCanvasLayerTarget(".base-layer"),
    note: createCanvasLayerTarget(".note-layer"),
    marker: createCanvasLayerTarget(".marker-layer"),
  };
}

/**
 * 앱 부팅에 필요한 DOM 요소를 한 번에 조회한다.
 * - 인수 : 없음
 * - 반환값 : 앱 이벤트 배선과 renderer가 사용할 DOM 요소 묶음
 */
export function collectAppDom(): AppDom {
  const tupletSlotInputs = Array.from(
    document.querySelectorAll(".tuplet-slot-input"),
  ).filter((element): element is HTMLInputElement => element instanceof HTMLInputElement);
  const numberRampButtons = Array.from(
    document.querySelectorAll(".number-ramp-button"),
  ).filter((element): element is HTMLButtonElement => element instanceof HTMLButtonElement);

  return {
    appShell: queryElement(".app-shell", HTMLElement),
    scoreViewer: queryElement(".score-viewer", HTMLElement),
    scoreArea: queryElement(".score-area", HTMLElement),
    scoreStage: queryElement(".score-canvas-stage", HTMLElement),
    layoutStage: queryElement(".layout-canvas-stage", HTMLElement),
    target: createCanvasRenderTarget(),
    editToggle: queryElement("#edit-mode-toggle", HTMLInputElement),
    defaultModeSelect: queryElement(".default-mode-select", HTMLSelectElement),
    customTextInput: queryElement(".custom-text-input", HTMLInputElement),
    holdTokenSelect: queryElement(".hold-token-select", HTMLSelectElement),
    glissKindSelect: queryElement(".gliss-kind-select", HTMLSelectElement),
    glissIdSelect: queryElement(".gliss-id-select", HTMLSelectElement),
    tremDivisionSelect: queryElement(".trem-division-select", HTMLSelectElement),
    absolutePitchSelect: queryElement(".absolute-pitch-select", HTMLSelectElement),
    microPitchInput: queryElement(".micro-pitch-input", HTMLInputElement),
    tupletModeToggle: queryElement(".tuplet-mode-toggle", HTMLButtonElement),
    tupletDivisionSelect: queryElement(".tuplet-division-select", HTMLSelectElement),
    tupletInsertModeSelect: queryElement(".tuplet-insert-mode-select", HTMLSelectElement),
    tupletFinalizeButton: queryElement(".tuplet-finalize-button", HTMLButtonElement),
    tupletSlotInputs,
    numberRawInput: queryElement(".number-raw-input", HTMLInputElement),
    numberRampButtons,
    currentRawTextPreview: queryElement(".current-raw-text-preview", HTMLElement),
    jsonLoadButton: queryElement(".json-load-button", HTMLButtonElement),
    jsonDownloadButton: queryElement(".json-download-button", HTMLButtonElement),
    jsonLoadInput: queryElement(".json-load-input", HTMLInputElement),
    localSaveButton: queryElement(".local-save-button", HTMLButtonElement),
    localLoadButton: queryElement(".local-load-button", HTMLButtonElement),
    zoomInput: queryElement(".menu-panel input[type='range']", HTMLInputElement),
    fullscreenButton: queryElement(".fullscreen-button", HTMLButtonElement),
    fitHeightButton: queryElement(".fit-height-button", HTMLButtonElement),
    detailsButton: queryElement(".details-button", HTMLButtonElement),
    detailsDialog: queryElement("#score-details", HTMLDialogElement),
    detailsForm: queryElement(".details-form", HTMLFormElement),
    detailsCloseButton: queryElement(".details-close-button", HTMLButtonElement),
    detailsCancelButton: queryElement(".details-cancel-button", HTMLButtonElement),
    detailsTitleInput: queryElement(".details-title-input", HTMLInputElement),
    detailsArtistInput: queryElement(".details-artist-input", HTMLInputElement),
    detailsGenreInput: queryElement(".details-genre-input", HTMLInputElement),
    detailsWriterInput: queryElement(".details-writer-input", HTMLInputElement),
    detailsCommentInput: queryElement(".details-comment-input", HTMLTextAreaElement),
    detailsBasicDifficultyInput: queryElement(".details-basic-difficulty-input", HTMLInputElement),
    detailsOptionalDifficultyInput: queryElement(".details-optional-difficulty-input", HTMLInputElement),
    detailsExtraDifficultyInput: queryElement(".details-extra-difficulty-input", HTMLInputElement),
    detailsYoutubeVideoInput: queryElement(".details-youtube-video-input", HTMLInputElement),
    detailsYoutubeOffsetInput: queryElement(".details-youtube-offset-input", HTMLInputElement),
    playButton: queryElement(".transport-button[aria-label='Play or pause']", HTMLButtonElement),
    stopButton: queryElement(".transport-button[aria-label='Stop']", HTMLButtonElement),
    playbackStatus: queryElement(".playback-status", HTMLElement),
    musicArtist: queryElement(".music-meta .artist", HTMLElement),
    musicTitle: queryElement(".music-meta .title", HTMLElement),
    volumeInput: queryElement(".audio-row input[type='range']", HTMLInputElement),
    waveSelect: queryElement(".audio-row select", HTMLSelectElement),
    leftStatusLine: queryElement(".left-status-line", HTMLElement),
  };
}
