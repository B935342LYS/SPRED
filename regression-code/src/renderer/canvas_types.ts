/**
 * renderer 계층에서 사용하는 canvas 입력, 좌표, target 타입을 정의한다.
 * 이 파일은 core score/analyze 타입을 import하지 않는 renderer-owned 계약 경계이다.
 */

/** renderer가 score 저장 구조 대신 소비하는 행 종류. */
export type CanvasSourceRowKind = "global" | "note" | "gap";

/**
 * renderer 입력 DTO의 행 단위 값.
 * - 인수 : 없음
 * - 반환값 : renderer가 좌표 계산에 사용할 row 정보
 */
export type CanvasSourceRow = {
  rowId: string;
  kind: CanvasSourceRowKind;
  label: string;
  height: number;
};

/**
 * renderer의 1차 입력 계약.
 * - 인수 : 없음
 * - 반환값 : base grid 렌더링에 필요한 닫힌 입력 구조
 */
export type CanvasRenderInput = {
  rows: CanvasSourceRow[];
  columnCount: number;
  baseColumnWidthPx: number;
};

/**
 * renderer 좌표 계산 옵션.
 * - 인수 : 없음
 * - 반환값 : UI 표시 배율과 layout-side padding 설정
 */
export type CanvasRenderOptions = {
  zoom: number;
  devicePixelRatio: number;
  columnWidth?: number;
};

/**
 * canvas 한 장과 2D context 묶음.
 * - 인수 : 없음
 * - 반환값 : renderer가 draw에 사용할 canvas target
 */
export type CanvasLayerTarget = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

/**
 * score viewer를 구성하는 canvas layer 묶음.
 * - 인수 : 없음
 * - 반환값 : layout/base/note/marker layer target
 */
export type CanvasRenderTarget = {
  layout: CanvasLayerTarget;
  base: CanvasLayerTarget;
  note: CanvasLayerTarget;
  marker: CanvasLayerTarget;
};

/** 좌표 계산 이후 renderer 내부에서 사용하는 행 종류. */
export type CanvasRowKind = "global" | "note" | "gap";

/**
 * CSS pixel 좌표가 확정된 row layout.
 * - 인수 : 없음
 * - 반환값 : draw layer가 직접 소비하는 row 좌표
 */
export type CanvasLayoutRow = {
  rowId: string;
  kind: CanvasRowKind;
  label: string;
  y: number;
  height: number;
};

/**
 * score viewer 전체의 CSS pixel 좌표 모델.
 * - 인수 : 없음
 * - 반환값 : layout/base/note/marker layer가 공유하는 좌표 정보
 */
export type CanvasScoreLayout = {
  rows: CanvasLayoutRow[];
  columnCount: number;
  columnWidth: number;
  scoreContentWidth: number;
  stageWidth: number;
  stageHeight: number;
  layoutWidth: number;
  layoutLabelWidth: number;
  layoutLeftPaddingWidth: number;
  layoutRightPaddingWidth: number;
  layoutPlaybackBoundaryX: number;
  layoutFontSize: number;
};

/**
 * 후속 가상화에서 사용할 viewport 상태.
 * - 인수 : 없음
 * - 반환값 : 보이는 영역 계산용 viewport 값
 */
export type CanvasViewport = {
  scrollLeft: number;
  scrollTop: number;
  width: number;
  height: number;
  zoom: number;
};

/**
 * analyzer 이벤트에서 변환될 note render item.
 * - 인수 : 없음
 * - 반환값 : tick/row 기준 note 표시 정보
 */
export type CanvasNoteRenderItem = {
  rowId: string;
  startTick: number;
  endTick: number;
  text: string;
  trackId?: string;
};

/**
 * 좌표가 확정된 note render item.
 * - 인수 : 없음
 * - 반환값 : note layer가 직접 그릴 수 있는 rectangle 정보
 */
export type CanvasNoteLayoutItem = CanvasNoteRenderItem & {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * marker layer가 후속 단계에서 소비할 표시 item.
 * - 인수 : 없음
 * - 반환값 : beat/bar 또는 gliss marker 표시 정보
 */
export type CanvasMarkerItem =
  | {
      kind: "beat" | "bar";
      tick: number;
    }
  | {
      kind: "gliss";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

/**
 * render 호출 이후 app/controller가 참고할 metadata.
 * - 인수 : 없음
 * - 반환값 : CSS pixel 기준 stage 크기와 layout 정보
 */
export type CanvasRenderResult = {
  layout: CanvasScoreLayout;
};
