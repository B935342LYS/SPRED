import { readFileSync } from "node:fs";

import { loadScoreFile } from "../src/core/score/json_load";

const fixtureUrl = new URL("./test_cases/minimal-valid-score.json", import.meta.url);
const jsonText = readFileSync(fixtureUrl, "utf8");
const result = loadScoreFile(jsonText);

if (!result.ok) {
  console.error("Score load failed.");
  console.error(result.error);
  process.exitCode = 1;
} else {
  console.log("Score load succeeded.");
  console.log(`title: ${result.score.musicData.musicTitle}`);
  console.log(`rows: ${result.score.layout.rowDefinitions.length}`);
  console.log(`tracks: ${result.score.tracks.length}`);
  console.log(`global cells: ${result.score.globalLines.cells.length}`);
}
