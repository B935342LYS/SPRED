import { readFileSync } from "node:fs";

import {
  applyClearAllScoreToState,
  applyExpandColumnsToState,
  applyMenuThemeToState,
  applyReverseRowsOption,
  applyReverseRowsToState,
  applyTrimRightColumnsToState,
  createInitialState,
} from "../src/app/app_runtime";
import { createRuntimeDocument } from "../src/core/score/create_runtime_document";
import type { ScoreFile } from "../src/core/score/types";
import type { CanvasRenderInput } from "../src/renderer/canvas_types";

/**
 * 테스트 조건이 거짓이면 프로세스를 실패 상태로 만든다.
 * - 인수 : condition : 통과 여부
 * - 인수 : message : 실패 시 출력할 설명
 * - 반환값 : 없음
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const input: CanvasRenderInput = {
  rows: [
    { rowId: "global-bpm", kind: "global", label: "BPM", height: 21 },
    { rowId: "global-spb", kind: "global", label: "SPB", height: 21 },
    { rowId: "gap-top", kind: "gap", label: "", height: 7 },
    { rowId: "note-high", kind: "note", label: "High", height: 7, midi: 72 },
    { rowId: "note-low", kind: "note", label: "Low", height: 7, midi: 60 },
  ],
  columnCount: 16,
  baseColumnWidthPx: 21,
};
const reversed = applyReverseRowsOption(input, true);

assert(
  reversed.rows.map((row) => row.rowId).join(",") ===
    "global-bpm,global-spb,note-low,note-high,gap-top",
  "Reverse rows should keep global rows first and reverse only body rows.",
);
assert(
  applyReverseRowsOption(input, false).rows === input.rows,
  "Normal row option should keep original row reference.",
);

const fixtureUrl = new URL("./test_cases/minimal-valid-score.json", import.meta.url);
const jsonText = readFileSync(fixtureUrl, "utf8");
const document = createRuntimeDocument(JSON.parse(jsonText) as ScoreFile);
const initialState = createInitialState(document);
const reversedState = applyReverseRowsToState(initialState, true);
const expandedState = applyExpandColumnsToState(initialState, 12);
const invalidExpandState = applyExpandColumnsToState(initialState, 0);
const darkThemeState = applyMenuThemeToState(initialState, "dark");
const clearAllTimestamp = "2026-06-22T00:00:00.000Z";
const clearedState = applyClearAllScoreToState(initialState, clearAllTimestamp);
const trimmedState = applyTrimRightColumnsToState(initialState, 990);
const invalidTrimState = applyTrimRightColumnsToState(initialState, 1000);

assert(reversedState.reverseRows, "Reverse state should be enabled.");
assert(
  reversedState.renderInput.rows[0]?.kind === "global",
  "Reverse state should keep global rows at the top.",
);
assert(
  expandedState.document.score.globalLines.columnCount ===
    initialState.document.score.globalLines.columnCount + 12,
  "Expand should add columns to ScoreFile.globalLines.columnCount.",
);
assert(
  expandedState.renderInput.columnCount === expandedState.document.score.globalLines.columnCount,
  "Expand should rebuild renderer input with the new column count.",
);
assert(
  invalidExpandState.statusMessage.level === "warning",
  "Invalid expand count should produce a warning state.",
);
assert(
  trimmedState.document.score.globalLines.columnCount === 10,
  "Trim Right should subtract columns from ScoreFile.globalLines.columnCount.",
);
assert(
  trimmedState.renderInput.columnCount === trimmedState.document.score.globalLines.columnCount,
  "Trim Right should rebuild renderer input with the new column count.",
);
assert(
  trimmedState.document.score.tracks.every((track) =>
    track.cells.every((cell) => cell.col < trimmedState.document.score.globalLines.columnCount),
  ),
  "Trim Right should remove track cells outside the new column range.",
);
assert(
  trimmedState.document.score.globalLines.cells.every((cell) =>
    cell.col < trimmedState.document.score.globalLines.columnCount,
  ),
  "Trim Right should remove global cells outside the new column range.",
);
assert(
  trimmedState.statusMessage.text.includes("Removed 1 cell(s)"),
  "Trim Right should report removed cell count.",
);
assert(
  invalidTrimState.statusMessage.level === "warning" &&
    invalidTrimState.document.score.globalLines.columnCount ===
      initialState.document.score.globalLines.columnCount,
  "Invalid Trim Right count should produce a warning without changing columnCount.",
);
assert(
  darkThemeState.menuTheme === "dark",
  "Menu theme state should update to dark.",
);
assert(
  clearedState.document.score.globalLines.columnCount === 1000,
  "Clear All should reset columnCount to 1000.",
);
assert(
  clearedState.document.score.globalLines.cells.length === 4,
  "Clear All should keep only the initial global cells.",
);
assert(
  clearedState.document.score.globalLines.cells.every((cell) => cell.col === 0),
  "Clear All global defaults should be placed at column 0.",
);
assert(
  clearedState.document.score.globalLines.cells.some((cell) => cell.rawText === "120") &&
    clearedState.document.score.globalLines.cells.some((cell) => cell.rawText === "4") &&
    clearedState.document.score.globalLines.cells.some((cell) => cell.rawText === "100"),
  "Clear All should restore default global rawText values.",
);
assert(
  clearedState.document.score.tracks.every((track) => track.cells.length === 0),
  "Clear All should remove all track cells.",
);
assert(
  clearedState.document.score.musicData.musicTitle === "Unknown" &&
    clearedState.document.score.musicData.musicArtist === "Unknown" &&
    clearedState.document.score.musicData.musicGenre === "Unknown" &&
    clearedState.document.score.musicData.scoreWriter === "Anonymous",
  "Clear All should reset text musicData fields to defaults.",
);
assert(
  clearedState.document.score.musicData.comment === "",
  "Clear All should reset musicData.comment to an empty string.",
);
assert(
  clearedState.document.score.musicData.scoreDifficulty.basic === 0 &&
    clearedState.document.score.musicData.scoreDifficulty.optional === 0 &&
    clearedState.document.score.musicData.scoreDifficulty.extra === 0,
  "Clear All should reset all track difficulties to 0.",
);
assert(
  clearedState.document.score.musicData.createdAt === clearAllTimestamp &&
    clearedState.document.score.musicData.updatedAt === clearAllTimestamp,
  "Clear All should reset createdAt and updatedAt to the same timestamp.",
);
assert(
  clearedState.document.score.musicData.youtube.videoId === "" &&
    clearedState.document.score.musicData.youtube.offsetMs === 0,
  "Clear All should reset youtube sync data.",
);

console.log("View option test completed.");
