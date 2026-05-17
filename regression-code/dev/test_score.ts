import { readFileSync } from "node:fs";

import { loadRuntimeDocument } from "../src/core/score/create_runtime_document";

const fixtureUrl = new URL("./test_cases/minimal-valid-score.json", import.meta.url);
const jsonText = readFileSync(fixtureUrl, "utf8");
const result = loadRuntimeDocument(jsonText);

if (!result.ok) {
  console.error("Runtime document load failed.");
  console.error(result.error);
  process.exitCode = 1;
} else {
  const { score, indexes } = result.document;
  const rowCount = score.layout.rowDefinitions.length;
  const trackCount = score.tracks.length;
  const globalCellCount = score.globalLines.cells.length;

  console.log("Runtime document load succeeded.");
  console.log(`title: ${score.musicData.musicTitle}`);
  console.log(`rows: ${rowCount}`);
  console.log(`tracks: ${trackCount}`);
  console.log(`global cells: ${globalCellCount}`);
  console.log(`indexed rows: ${indexes.rowById.size}`);
  console.log(`indexed tracks: ${indexes.trackById.size}`);
  console.log(
    `indexed note rows for s1: ${indexes.noteRowIdsByStringId.get("s1")?.length ?? 0}`,
  );

  if (
    indexes.rowById.size !== rowCount ||
    indexes.trackById.size !== trackCount ||
    indexes.globalCellMapByCoord.size !== globalCellCount
  ) {
    console.error("Score index build failed.");
    process.exitCode = 1;
  }
}
