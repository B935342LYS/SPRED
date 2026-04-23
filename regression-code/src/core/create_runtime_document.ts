import { buildScoreIndexes } from "./build_score_indexes.ts";
import type { CreateRuntimeDocumentFn } from "./types/index.ts";

export const createRuntimeDocument: CreateRuntimeDocumentFn = (score) => {
  const indexes = buildScoreIndexes(score);

  return {
    score,
    indexes,
  };
};
