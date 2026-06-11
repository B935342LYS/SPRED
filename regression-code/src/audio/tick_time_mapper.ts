/**
 * src/audio/tick_time_mapper.ts
 * analyzer timing timeline을 audio scheduler가 쓰는 초 단위 score time으로 변환한다.
 */

import type {
  AnalyzedTimeSegment,
  TimeFraction,
} from "../core/analyze/types";
import type {
  ConstantTempoMapSegment,
  TickTimeMapper,
} from "./audio_types";

/**
 * timing timeline에서 constant tempo 기반 TickTimeMapper를 만든다.
 * - 인수 : segments : analyzer가 생성한 timing segment 목록
 * - 반환값 : TickTimeMapper : tick/seconds 양방향 변환기
 */
export function createTickTimeMapper(
  segments: AnalyzedTimeSegment[],
): TickTimeMapper {
  const mapSegments = buildConstantTempoMapSegments(segments);
  const durationSeconds = mapSegments.length === 0
    ? 0
    : mapSegments[mapSegments.length - 1].endSeconds;

  return {
    tickToSeconds(tick: TimeFraction): number {
      const tickNumber = timeFractionToNumber(tick);
      const segment = findSegmentByTick(mapSegments, tickNumber);

      return segment.startSeconds +
        (tickNumber - segment.startTickNumber) * segment.secondsPerTick;
    },
    secondsToTick(seconds: number): TimeFraction {
      const normalizedSeconds = clampSeconds(seconds, durationSeconds);
      const segment = findSegmentBySeconds(mapSegments, normalizedSeconds);
      const tickNumber = segment.startTickNumber +
        (normalizedSeconds - segment.startSeconds) / segment.secondsPerTick;

      return numberToTimeFraction(tickNumber);
    },
    getDurationSeconds(): number {
      return durationSeconds;
    },
  };
}

/**
 * TimeFraction을 number tick으로 변환한다.
 * - 인수 : value : analyzer 시간 분수
 * - 반환값 : number : numerator / denominator
 */
export function timeFractionToNumber(value: TimeFraction): number {
  if (value.denominator === 0) {
    throw new Error("TimeFraction denominator must not be 0.");
  }

  return value.numerator / value.denominator;
}

/**
 * number tick을 TimeFraction으로 변환한다.
 * - 인수 : value : number tick
 * - 반환값 : TimeFraction : audio mapper가 반환할 시간 분수
 */
export function numberToTimeFraction(value: number): TimeFraction {
  if (!Number.isFinite(value)) {
    throw new Error("Tick value must be a finite number.");
  }

  const roundedInteger = Math.round(value);

  if (Math.abs(value - roundedInteger) < 1e-9) {
    return {
      numerator: roundedInteger,
      denominator: 1,
    };
  }

  const denominator = 1_000_000;
  const numerator = Math.round(value * denominator);
  const divisor = gcd(Math.abs(numerator), denominator);

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

/**
 * timing segment 목록을 시작 초가 누적된 constant tempo segment 목록으로 바꾼다.
 * - 인수 : segments : analyzer timing segment 목록
 * - 반환값 : ConstantTempoMapSegment[] : tick/seconds 변환용 segment 목록
 */
function buildConstantTempoMapSegments(
  segments: AnalyzedTimeSegment[],
): ConstantTempoMapSegment[] {
  const sortedSegments = [...segments].sort(
    (left, right) =>
      timeFractionToNumber(left.time.startTick) -
      timeFractionToNumber(right.time.startTick),
  );
  const result: ConstantTempoMapSegment[] = [];
  let nextStartSeconds = 0;

  // timing segment마다 누적 시작 초와 tick당 초를 계산해 변환 lookup 단위를 만든다.
  for (const segment of sortedSegments) {
    validateConstantTempoSegment(segment);

    const startTickNumber = timeFractionToNumber(segment.time.startTick);
    const endTickNumber = timeFractionToNumber(segment.time.endTick);
    const secondsPerTick = 60 / segment.startBpm / segment.stepsPerBeat;
    const durationSeconds = (endTickNumber - startTickNumber) * secondsPerTick;
    const endSeconds = nextStartSeconds + durationSeconds;

    result.push({
      source: segment,
      startTickNumber,
      endTickNumber,
      startSeconds: nextStartSeconds,
      endSeconds,
      secondsPerTick,
    });
    nextStartSeconds = endSeconds;
  }

  return result;
}

/**
 * 1차 audio mapper가 지원하는 constant tempo segment인지 확인한다.
 * - 인수 : segment : 검사할 analyzer timing segment
 * - 반환값 : 없음
 */
function validateConstantTempoSegment(segment: AnalyzedTimeSegment): void {
  const startTickNumber = timeFractionToNumber(segment.time.startTick);
  const endTickNumber = timeFractionToNumber(segment.time.endTick);

  if (endTickNumber < startTickNumber) {
    throw new Error("Timing segment endTick must be greater than or equal to startTick.");
  }

  if (segment.startBpm <= 0 || segment.endBpm <= 0) {
    throw new Error("Timing segment BPM must be greater than 0.");
  }

  if (segment.stepsPerBeat <= 0) {
    throw new Error("Timing segment stepsPerBeat must be greater than 0.");
  }

  if (segment.bpmCurve !== "instant" || segment.startBpm !== segment.endBpm) {
    throw new Error("Linear tempo segments are not supported by the first audio mapper.");
  }
}

/**
 * tick 위치를 포함하는 timing segment를 찾는다.
 * - 인수 : segments : 정규화된 timing segment 목록
 * - 인수 : tickNumber : 조회할 tick number
 * - 반환값 : tick을 포함하는 segment
 */
function findSegmentByTick(
  segments: ConstantTempoMapSegment[],
  tickNumber: number,
): ConstantTempoMapSegment {
  if (segments.length === 0) {
    throw new Error("TickTimeMapper requires at least one timing segment.");
  }

  // segment 끝 tick은 다음 segment 시작으로 취급하되, 문서 끝 tick은 마지막 segment에 포함한다.
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const isLastSegment = index === segments.length - 1;

    if (
      tickNumber >= segment.startTickNumber &&
      (tickNumber < segment.endTickNumber ||
        (isLastSegment && tickNumber === segment.endTickNumber))
    ) {
      return segment;
    }
  }

  if (tickNumber < segments[0].startTickNumber) {
    return segments[0];
  }

  return segments[segments.length - 1];
}

/**
 * 초 위치를 포함하는 timing segment를 찾는다.
 * - 인수 : segments : 정규화된 timing segment 목록
 * - 인수 : seconds : 조회할 score seconds
 * - 반환값 : seconds를 포함하는 segment
 */
function findSegmentBySeconds(
  segments: ConstantTempoMapSegment[],
  seconds: number,
): ConstantTempoMapSegment {
  if (segments.length === 0) {
    throw new Error("TickTimeMapper requires at least one timing segment.");
  }

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const isLastSegment = index === segments.length - 1;

    if (
      seconds >= segment.startSeconds &&
      (seconds < segment.endSeconds ||
        (isLastSegment && seconds === segment.endSeconds))
    ) {
      return segment;
    }
  }

  return seconds < segments[0].startSeconds
    ? segments[0]
    : segments[segments.length - 1];
}

/**
 * score seconds를 문서 길이 범위로 제한한다.
 * - 인수 : seconds : 제한할 초 단위 위치
 * - 인수 : durationSeconds : 문서 전체 길이
 * - 반환값 : 0 이상 durationSeconds 이하의 seconds
 */
function clampSeconds(seconds: number, durationSeconds: number): number {
  if (!Number.isFinite(seconds)) {
    throw new Error("Score seconds must be a finite number.");
  }

  return Math.min(Math.max(seconds, 0), durationSeconds);
}

/**
 * 두 정수의 최대공약수를 구한다.
 * - 인수 : left : 첫 번째 정수
 * - 인수 : right : 두 번째 정수
 * - 반환값 : 최대공약수
 */
function gcd(left: number, right: number): number {
  let a = left;
  let b = right;

  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }

  return a || 1;
}
