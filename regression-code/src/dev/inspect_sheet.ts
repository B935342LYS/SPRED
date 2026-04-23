import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  buildScoreIndexes,
  createRuntimeDocument,
  parseDocument,
} from "../core/index.ts";
import type { ScoreFile } from "../core/index.ts";

type InspectionSummary = {
  rowCount: number;
  trackCount: number;
  globalCellCount: number;
  noteCellCount: number;
  parsedTrackColumnCount: number;
  parsedGlobalKindCount: number;
};

function summarize(score: ScoreFile): InspectionSummary {
  const noteCellCount = score.tracks.reduce(
    (sum, track) => sum + track.cells.length,
    0,
  );

  return {
    rowCount: score.layout.rowDefinitions.length,
    trackCount: score.tracks.length,
    globalCellCount: score.globalLines.cells.length,
    noteCellCount,
    parsedTrackColumnCount: 0,
    parsedGlobalKindCount: 0,
  };
}

async function loadSheetJson(): Promise<ScoreFile> {
  const sheetPath = resolve(process.cwd(), "sheet.json");
  const raw = await readFile(sheetPath, "utf8");
  return JSON.parse(raw) as ScoreFile;
}

async function main(): Promise<void> {
  const score = await loadSheetJson();
  const runtime = createRuntimeDocument(score);
  const indexes = buildScoreIndexes(score);
  const parsed = parseDocument(score, indexes);
  const summary = summarize(score);

  summary.parsedTrackColumnCount = [...parsed.noteCellsByTrackAndCol.values()]
    .reduce((sum, byCol) => sum + byCol.size, 0);
  summary.parsedGlobalKindCount = parsed.globalCellsByKindAndCol.size;

  console.log("Sheet inspection summary");
  console.log(JSON.stringify(summary, null, 2));
  console.log("");
  console.log("Runtime index summary");
  console.log(
    JSON.stringify(
      {
        rowById: runtime.indexes.rowById.size,
        noteRowIdsByStringId: runtime.indexes.noteRowIdsByStringId.size,
        trackById: runtime.indexes.trackById.size,
        globalCellsByKindAndCol: runtime.indexes.globalCellsByKindAndCol.size,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("Failed to inspect sheet.json");
  console.error(error);
  process.exitCode = 1;
});
