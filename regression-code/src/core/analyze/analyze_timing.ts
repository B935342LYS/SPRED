/**
 * src/core/analyze/analyze_timing.ts
 * MVP 범위의 timing timeline을 생성한다.
 * 현재 구현은 col 0의 bpm, beatsPerBar, stepsPerBeat 시작값만 사용한다.
 */

import type { GlobalKind } from "../score/types";
import type { ParsedGlobalCellEntry } from "../parse/types";
import type {
  AnalyzeContext,
  AnalyzedTimeSegment,
  AnalyzeTimingTimelineFn,
  SourceCellRef,
  TimeRange,
} from "./types";

const DEFAULT_BPM = 120;
const DEFAULT_BEATS_PER_BAR = 4;
const DEFAULT_STEPS_PER_BEAT = 4;

/**
 * MVP timing timeline을 생성한다.
 * - 인수 : context : score/index/parsed 문맥
 * - 반환값 : AnalyzedTimeSegment[] : 문서 전체에 적용되는 단일 timing segment
 */
export const analyzeTimingTimeline: AnalyzeTimingTimelineFn = (
  context: AnalyzeContext,
): AnalyzedTimeSegment[] => {
  // col 0에 있는 timing 관련 전역 셀들을 시작값으로 가져온다.
  const bpmEntry = getGlobalEntryAtZero(context, "bpm");
  const beatsPerBarEntry = getGlobalEntryAtZero(context, "beatsPerBar");
  const stepsPerBeatEntry = getGlobalEntryAtZero(context, "stepsPerBeat");

  return [
    {
      time: createDocumentTimeRange(context),
      startBpm: getNumericGlobalValue(bpmEntry, DEFAULT_BPM),
      endBpm: getNumericGlobalValue(bpmEntry, DEFAULT_BPM),
      bpmCurve: "instant",
      beatsPerBar: getNumericGlobalValue(
        beatsPerBarEntry,
        DEFAULT_BEATS_PER_BAR,
      ),
      stepsPerBeat: getNumericGlobalValue(
        stepsPerBeatEntry,
        DEFAULT_STEPS_PER_BEAT,
      ),
      sourceCells: collectSourceCells([
        bpmEntry,
        beatsPerBarEntry,
        stepsPerBeatEntry,
      ]),
    },
  ];
};

/**
 * 특정 global kind의 col 0 parsed entry를 가져온다.
 * - 인수 : context : score/index/parsed 문맥
 * - 인수 : kind : 조회할 global kind
 * - 반환값 : ParsedGlobalCellEntry | null : col 0 entry 또는 null
 */
function getGlobalEntryAtZero(
  context: AnalyzeContext,
  kind: GlobalKind,
): ParsedGlobalCellEntry | null {
  return context.parsed.globalCellsByKindAndCol.get(kind)?.get(0) ?? null;
}

/**
 * ParsedGlobalCellEntry에서 숫자 값을 읽는다.
 * - 인수 : entry : parsed global entry 후보
 * - 인수 : fallback : 값이 없거나 invalid일 때 사용할 기본값
 * - 반환값 : number : timeline에 사용할 숫자 값
 */
function getNumericGlobalValue(
  entry: ParsedGlobalCellEntry | null,
  fallback: number,
): number {
  const parsedCell = entry?.parsedCell;

  // 정상 숫자 global cell이면 parser가 만든 value를 timeline 값으로 사용한다.
  if (
    parsedCell?.kind === "instantGlobalValue" ||
    parsedCell?.kind === "linearGlobalValue"
  ) {
    return parsedCell.value;
  }

  return fallback;
}

/**
 * 문서 전체 범위의 TimeRange를 만든다.
 * - 인수 : context : score/index/parsed 문맥
 * - 반환값 : TimeRange : 0부터 columnCount까지의 시간 범위
 */
function createDocumentTimeRange(context: AnalyzeContext): TimeRange {
  return {
    startTick: {
      numerator: 0,
      denominator: 1,
    },
    endTick: {
      numerator: context.score.globalLines.columnCount,
      denominator: 1,
    },
  };
}

/**
 * global entry 목록에서 source cell 참조를 모은다.
 * - 인수 : entries : source로 기록할 global entry 후보 목록
 * - 반환값 : SourceCellRef[] : 존재하는 entry의 좌표 목록
 */
function collectSourceCells(
  entries: Array<ParsedGlobalCellEntry | null>,
): SourceCellRef[] {
  return entries.flatMap((entry) =>
    entry === null
      ? []
      : [
          {
            rowId: entry.rowId,
            col: entry.col,
          },
        ],
  );
}
