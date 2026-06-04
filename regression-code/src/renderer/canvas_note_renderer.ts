/**
 * analyzer 기반 note item을 score note layer에 그린다.
 */

import { columnToX } from "./canvas_coordinate";
import type {
  CanvasLayoutRow,
  CanvasNoteLayoutItem,
  CanvasNoteRenderItem,
  CanvasScoreLayout,
} from "./canvas_types";

const NOTE_STYLE = {
  stroke: "rgba(255,255,255,0.22)",
  extraStroke: "rgba(255,255,255,0.92)",
  text: "#000000",
  extraText: "#ffffff",
};
const NOTE_COLORS: Record<number, { main: string; alt: string }> = {
  0: { main: "#ff3b30", alt: "#b62a22" },
  1: { main: "#ff3b30", alt: "#b62a22" },
  2: { main: "#ff9500", alt: "#b56a00" },
  3: { main: "#ff9500", alt: "#b56a00" },
  4: { main: "#ffcc00", alt: "#b89200" },
  5: { main: "#34c759", alt: "#23873c" },
  6: { main: "#34c759", alt: "#23873c" },
  7: { main: "#5ac8fa", alt: "#2a7ea6" },
  8: { main: "#5ac8fa", alt: "#2a7ea6" },
  9: { main: "#007aff", alt: "#0052ad" },
  10: { main: "#007aff", alt: "#0052ad" },
  11: { main: "#af52de", alt: "#6f3390" },
};
const NOTE_COLORS_OPTIONAL: Record<number, { main: string; alt: string }> = {
  0: { main: "#ff9f99", alt: "#ffc1bd" },
  1: { main: "#ff9f99", alt: "#ffc1bd" },
  2: { main: "#ffbf80", alt: "#ffd6a8" },
  3: { main: "#ffbf80", alt: "#ffd6a8" },
  4: { main: "#ffe699", alt: "#fff0bf" },
  5: { main: "#8fe1a6", alt: "#b3edc3" },
  6: { main: "#8fe1a6", alt: "#b3edc3" },
  7: { main: "#9fd8f5", alt: "#c3e9fb" },
  8: { main: "#9fd8f5", alt: "#c3e9fb" },
  9: { main: "#9fbfff", alt: "#c3d6ff" },
  10: { main: "#9fbfff", alt: "#c3d6ff" },
  11: { main: "#d6b0f0", alt: "#e6cff7" },
};
const NATURAL_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);
const TRACK_OPTIONAL = "optional";
const TRACK_EXTRA = "extra";
const BASE_NOTE_RENDER_HEIGHT = 21;
const NOTE_INSET_X = 1;
const MIN_NOTE_WIDTH = 1;
const MIN_NOTE_HEIGHT = 1;

/**
 * note render item 목록을 canvas에 그린다.
 * - 인수 : context : note layer canvas 2D context
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 인수 : items : tick/row 기준 note 표시 item 목록
 * - 반환값 : 없음
 */
export function drawScoreNotes(
  context: CanvasRenderingContext2D,
  layout: CanvasScoreLayout,
  items: CanvasNoteRenderItem[],
): void {
  context.clearRect(0, 0, layout.stageWidth, layout.stageHeight);

  const rowById = createLayoutRowMap(layout);

  // analyzer note item을 CSS pixel 좌표 item으로 변환한 뒤 note rectangle과 text를 그린다.
  for (const item of items) {
    const layoutItem = createNoteLayoutItem(item, rowById, layout);

    if (layoutItem === null) {
      continue;
    }

    drawNoteRectangle(context, layoutItem);
    drawNoteText(context, layoutItem, layout);
  }
}

/**
 * layout row를 rowId 기준 Map으로 만든다.
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : Map<string, CanvasLayoutRow> : note item row 조회용 Map
 */
function createLayoutRowMap(
  layout: CanvasScoreLayout,
): Map<string, CanvasLayoutRow> {
  const rowById = new Map<string, CanvasLayoutRow>();

  // layout.rows를 순회하며 note item이 참조할 수 있는 모든 row 좌표를 저장한다.
  for (const row of layout.rows) {
    rowById.set(row.rowId, row);
  }

  return rowById;
}

/**
 * tick/row 기준 note item을 CSS pixel 기준 note item으로 변환한다.
 * - 인수 : item : analyzer에서 변환된 note 표시 item
 * - 인수 : rowById : layout row 조회 Map
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : CanvasNoteLayoutItem | null : 그릴 수 있는 좌표 item 또는 제외 결과
 */
function createNoteLayoutItem(
  item: CanvasNoteRenderItem,
  rowById: Map<string, CanvasLayoutRow>,
  layout: CanvasScoreLayout,
): CanvasNoteLayoutItem | null {
  const row = rowById.get(item.rowId);

  if (row === undefined || row.kind !== "note") {
    return null;
  }

  const startX = columnToX(item.startTick, layout);
  const endX = columnToX(item.endTick, layout);
  const x = startX + NOTE_INSET_X;
  const height = Math.max(MIN_NOTE_HEIGHT, BASE_NOTE_RENDER_HEIGHT * getLayoutZoom(layout));
  const y = row.y + row.height / 2 - height / 2;
  const width = Math.max(MIN_NOTE_WIDTH, endX - startX - NOTE_INSET_X * 2);

  return {
    ...item,
    x,
    y,
    width,
    height,
  };
}

/**
 * note rectangle의 배경과 윤곽선을 그린다.
 * - 인수 : context : note layer canvas 2D context
 * - 인수 : item : CSS pixel 좌표가 확정된 note item
 * - 반환값 : 없음
 */
function drawNoteRectangle(
  context: CanvasRenderingContext2D,
  item: CanvasNoteLayoutItem,
): void {
  context.fillStyle = colorForTrackMidi(item.trackId, item.midi);
  context.strokeStyle =
    item.trackId === TRACK_EXTRA ? NOTE_STYLE.extraStroke : NOTE_STYLE.stroke;
  context.lineWidth = 1;
  context.fillRect(item.x, item.y, item.width, item.height);
  context.strokeRect(item.x + 0.5, item.y + 0.5, item.width - 1, item.height - 1);
}

/**
 * note rectangle 안에 표시 문자열을 그린다.
 * - 인수 : context : note layer canvas 2D context
 * - 인수 : item : CSS pixel 좌표가 확정된 note item
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : 없음
 */
function drawNoteText(
  context: CanvasRenderingContext2D,
  item: CanvasNoteLayoutItem,
  layout: CanvasScoreLayout,
): void {
  if (item.displayTextAnchors.length === 0) {
    return;
  }

  const fontSize = Math.max(7, Math.min(14, item.height * 0.78));

  context.save();
  context.fillStyle =
    item.trackId === TRACK_EXTRA ? NOTE_STYLE.extraText : NOTE_STYLE.text;
  context.font = `700 ${fontSize}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // 병합된 표시 anchor를 순회하며 각 시간 범위의 중심에 displayText를 그대로 표시한다.
  for (const anchor of item.displayTextAnchors) {
    if (anchor.text === "") {
      continue;
    }

    context.fillText(
      anchor.text,
      getTextAnchorCenterX(anchor.startTick, anchor.endTick, layout),
      item.y + item.height / 2,
    );
  }

  context.restore();
}

/**
 * 표시 텍스트 anchor의 시간 범위 중심 x 좌표를 계산한다.
 * - 인수 : startTick : anchor 시작 tick
 * - 인수 : endTick : anchor 끝 tick
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : number : 텍스트를 배치할 x 좌표
 */
function getTextAnchorCenterX(
  startTick: number,
  endTick: number,
  layout: CanvasScoreLayout,
): number {
  return (columnToX(startTick, layout) + columnToX(endTick, layout)) / 2;
}

/**
 * layout font size에서 현재 layout zoom을 계산한다.
 * - 인수 : layout : CSS pixel 기준 score layout
 * - 반환값 : number : 기준 font size 대비 확대 배율
 */
function getLayoutZoom(layout: CanvasScoreLayout): number {
  return layout.layoutFontSize / 12;
}

/**
 * trackId와 midi에 맞는 legacy note fill 색상을 반환한다.
 * - 인수 : trackId : note가 속한 track id
 * - 인수 : midi : note 발음 midi 번호
 * - 반환값 : string : canvas fillStyle에 사용할 CSS 색상
 */
function colorForTrackMidi(trackId: string | undefined, midi: number): string {
  if (trackId === TRACK_EXTRA) {
    return "#000000";
  }

  if (trackId === TRACK_OPTIONAL) {
    return colorForMidi(midi, NOTE_COLORS_OPTIONAL);
  }

  return colorForMidi(midi, NOTE_COLORS);
}

/**
 * midi pitch class를 legacy 팔레트 색상으로 변환한다.
 * - 인수 : midi : note 발음 midi 번호
 * - 인수 : palette : basic 또는 optional track 팔레트
 * - 반환값 : string : natural/accidental 구분이 반영된 색상
 */
function colorForMidi(
  midi: number,
  palette: Record<number, { main: string; alt: string }>,
): string {
  const pitchClass = getPitchClass(midi);
  const color = palette[pitchClass];

  // 자연음은 main 색, 변화음은 같은 계열의 alt 색으로 표시한다.
  return NATURAL_PITCH_CLASSES.has(pitchClass) ? color.main : color.alt;
}

/**
 * midi 값을 0-11 pitch class로 정규화한다.
 * - 인수 : midi : note 발음 midi 번호
 * - 반환값 : number : 0-11 범위의 pitch class
 */
function getPitchClass(midi: number): number {
  return ((midi % 12) + 12) % 12;
}
