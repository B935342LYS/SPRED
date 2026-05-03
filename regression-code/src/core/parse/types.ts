import type { GlobalKind, RowDefinition, RowId, TrackId } from "../score/types.ts";

export type ParsedCellCacheKey = `${TrackId}|${RowId}|${number}`;
export type ParsedGlobalCellCacheKey = `${RowId}|${number}`;