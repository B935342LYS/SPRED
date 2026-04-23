import { parseDocument } from "./parse_document.ts";
import type { ParseDocumentRangeFn } from "./types/index.ts";

export const parseDocumentRange: ParseDocumentRangeFn = (
  _prev,
  score,
  indexes,
  _request,
) => {
  // TODO: replace with true partial rebuild after range invalidation rules are implemented.
  return parseDocument(score, indexes);
};
