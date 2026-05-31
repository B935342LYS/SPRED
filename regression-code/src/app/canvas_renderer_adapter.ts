/**
 * core score RuntimeDocument를 renderer-owned CanvasRenderInput으로 변환한다.
 */

import type { GlobalKind, RuntimeDocument } from "../core/score/types";
import type {
  CanvasRenderInput,
  CanvasSourceRow,
} from "../renderer/canvas_types";

const GLOBAL_LABEL_BY_KIND: Record<GlobalKind, string> = {
  bpm: "BPM",
  beatsPerBar: "BeatsPerBar",
  stepsPerBeat: "StepsPerBeat",
  dynamics: "Dynamics",
};

/**
 * RuntimeDocument의 layout row를 renderer source row로 변환한다.
 * - 인수 : document : score와 index가 묶인 런타임 문서
 * - 반환값 : renderer가 core 타입 없이 소비할 수 있는 CanvasRenderInput
 */
export function createCanvasRenderInput(
  document: RuntimeDocument,
): CanvasRenderInput {
  const rows: CanvasSourceRow[] =
    document.score.layout.rowDefinitions.map((row) => {
      if (row.type === "global") {
        return {
          rowId: row.rowId,
          kind: "global",
          label: GLOBAL_LABEL_BY_KIND[row.kind],
          height: row.height,
        };
      }

      if (row.type === "note") {
        return {
          rowId: row.rowId,
          kind: "note",
          label: row.displayLabel,
          height: row.height,
        };
      }

      return {
        rowId: row.rowId,
        kind: "gap",
        label: "",
        height: row.height,
      };
    });

  return {
    rows,
    columnCount: document.score.globalLines.columnCount,
    baseColumnWidthPx: document.score.layout.baseColumnWidthPx,
  };
}
