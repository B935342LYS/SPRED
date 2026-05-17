import { readFileSync } from "node:fs";

import { parseGlobalCell } from "../src/core/parse/parse_global_cell";
import { loadRuntimeDocument } from "../src/core/score/create_runtime_document";

const fixtureUrl = new URL("./test_cases/minimal-valid-score.json", import.meta.url);
const jsonText = readFileSync(fixtureUrl, "utf8");
const result = loadRuntimeDocument(jsonText);

if (!result.ok) {
  console.error("Runtime document load failed.");
  console.error(result.error);
  process.exitCode = 1;
} else {
  const parsedGlobalCells = result.document.score.globalLines.cells.map((cell) =>
    parseGlobalCell(cell, {
      rowById: result.document.indexes.rowById,
    }),
  );
  const invalidGlobalCells = parsedGlobalCells.filter(
    (cell) => cell.kind === "invalid",
  );

  console.log("Global cell parse completed.");
  console.log(`global cells: ${parsedGlobalCells.length}`);
  console.log(`invalid global cells: ${invalidGlobalCells.length}`);

  if (invalidGlobalCells.length > 0) {
    console.error(invalidGlobalCells);
    process.exitCode = 1;
  }
}
