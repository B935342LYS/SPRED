/**
 * src/core/analyze/analyze_dynamics.ts
 * MVP 범위의 dynamics timeline을 생성한다.
 * 현재 구현은 col 0의 dynamics 시작값만 사용한다.
 */

import type { ParsedGlobalCellEntry } from "../parse/types";
import type {
  AnalyzeContext,
  AnalyzedDynamicsSegment,
  AnalyzeDynamicsTimelineFn,
  TimeRange,
} from "./types";

const DEFAULT_DYNAMICS = 100;

/**
 * MVP dynamics timeline을 생성한다.
 * - 인수 : context : score/index/parsed 문맥
 * - 반환값 : AnalyzedDynamicsSegment[] : 문서 전체에 적용되는 단일 dynamics segment
 */
export const analyzeDynamicsTimeline: AnalyzeDynamicsTimelineFn = (
  context: AnalyzeContext,
): AnalyzedDynamicsSegment[] => {
  // col 0의 dynamics 전역 셀을 문서 전체 dynamics 시작값으로 가져온다.
  const dynamicsEntry =
    context.parsed.globalCellsByKindAndCol.get("dynamics")?.get(0) ?? null;
  const value = getNumericGlobalValue(dynamicsEntry, DEFAULT_DYNAMICS);

  return [
    {
      time: createDocumentTimeRange(context),
      startValue: value,
      endValue: value,
      curve: "instant",
      sourceCells:
        dynamicsEntry === null
          ? []
          : [
              {
                rowId: dynamicsEntry.rowId,
                col: dynamicsEntry.col,
              },
            ],
    },
  ];
};

/**
 * ParsedGlobalCellEntry에서 dynamics 숫자 값을 읽는다.
 * - 인수 : entry : parsed global entry 후보
 * - 인수 : fallback : 값이 없거나 invalid일 때 사용할 기본값
 * - 반환값 : number : dynamics timeline에 사용할 값
 */
function getNumericGlobalValue(
  entry: ParsedGlobalCellEntry | null,
  fallback: number,
): number {
  const parsedCell = entry?.parsedCell;

  // 정상 숫자 global cell이면 parser가 만든 value를 dynamics 값으로 사용한다.
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
