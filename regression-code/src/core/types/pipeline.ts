import type { AnalysisResult, AnalyzeGlobalRange, AnalyzePartialRequest, AnalyzeTrackRange, AnalyzedDynamicsSegment, AnalyzedTimeSegment, AnalyzedTrackResult } from "./analyze.ts";
import type { GlobalCellParserContext, GlobalCellParserInput, NoteCellParserInput, ParsedCell, ParsedGlobalCell, ParsedScoreDocument, ParseRangeRequest } from "./parse.ts";
import type { RuntimeDocument, ScoreFile, ScoreIndexes, TrackId } from "./score.ts";

export type AnalyzeContext = {
  score: ScoreFile;
  indexes: ScoreIndexes;
  parsed: ParsedScoreDocument;
};

export type BuildScoreIndexesFn = (score: ScoreFile) => ScoreIndexes;

export type CreateRuntimeDocumentFn = (score: ScoreFile) => RuntimeDocument;

export type ParseNoteCellFn = (input: NoteCellParserInput) => ParsedCell;

export type ParseGlobalCellFn = (
  input: GlobalCellParserInput,
  context: GlobalCellParserContext,
) => ParsedGlobalCell;

export type ParseDocumentFn = (
  score: ScoreFile,
  indexes: ScoreIndexes,
) => ParsedScoreDocument;
export type ParseDocumentRangeFn = (
  prev: ParsedScoreDocument,
  score: ScoreFile,
  indexes: ScoreIndexes,
  request: ParseRangeRequest,
) => ParsedScoreDocument;

export type AnalyzeDocumentFn = (context: AnalyzeContext) => AnalysisResult;

export type AnalyzeDocumentPartialFn = (
  prev: AnalysisResult,
  context: AnalyzeContext,
  request: AnalyzePartialRequest,
) => AnalysisResult;

export type AnalyzeTrackEventsFn = (
  trackId: TrackId,
  context: AnalyzeContext,
  range?: AnalyzeTrackRange,
) => AnalyzedTrackResult;

export type AnalyzeTimingTimelineFn = (
  context: AnalyzeContext,
  range?: AnalyzeGlobalRange,
) => AnalyzedTimeSegment[];

export type AnalyzeDynamicsTimelineFn = (
  context: AnalyzeContext,
  range?: AnalyzeGlobalRange,
) => AnalyzedDynamicsSegment[];
