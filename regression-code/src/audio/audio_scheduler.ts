/**
 * src/audio/audio_scheduler.ts
 * AudioEventQueue와 AudioBackend 사이에서 lookahead 기반 예약을 수행한다.
 */

import type {
  AudioBackend,
  AudioEventQueue,
  AudioLookaheadScheduler,
  AudioScheduleEvent,
  PlaybackLoopState,
} from "./audio_types";

/** lookahead scheduler 생성 입력. */
export type AudioLookaheadSchedulerInput = {
  queue: AudioEventQueue;
  backend: AudioBackend;
  lookaheadSeconds: number;
};

type LookaheadQueryWindow = {
  queryStartSeconds: number;
  queryEndSeconds: number;
  offsetBaseSeconds: number;
  cycleOffset: number;
};

/**
 * AudioEventQueue에서 가까운 미래 이벤트를 조회해 backend에 예약하는 scheduler를 만든다.
 * - 인수 : input : event queue, backend, lookahead 설정
 * - 반환값 : AudioLookaheadScheduler : playback controller가 호출할 scheduler
 */
export function createAudioLookaheadScheduler(
  input: AudioLookaheadSchedulerInput,
): AudioLookaheadScheduler {
  validateLookaheadSeconds(input.lookaheadSeconds);

  const scheduledKeys = new Set<string>();

  return {
    scheduleLookahead(
      currentScoreSeconds: number,
      loop: PlaybackLoopState,
      loopCycleIndex = 0,
    ): number {
      validateCurrentScoreSeconds(currentScoreSeconds);

      const windows = createLookaheadQueryWindows(
        currentScoreSeconds,
        input.lookaheadSeconds,
        loop,
      );
      let scheduledCount = 0;

      // lookahead window를 순회하며 아직 예약하지 않은 event만 backend에 넘긴다.
      for (const window of windows) {
        const events = input.queue.getEventsStartingInRange(
          window.queryStartSeconds,
          window.queryEndSeconds,
        );

        for (const event of events) {
          const scheduledKey = createScheduledEventKey(event, loopCycleIndex + window.cycleOffset);

          if (scheduledKeys.has(scheduledKey)) {
            continue;
          }

          const offsetSeconds = event.startSeconds + window.offsetBaseSeconds;

          if (offsetSeconds < 0) {
            continue;
          }

          input.backend.scheduleEvent(event, offsetSeconds);
          scheduledKeys.add(scheduledKey);
          scheduledCount += 1;
        }
      }

      return scheduledCount;
    },
    resetScheduledEvents(): void {
      scheduledKeys.clear();
    },
    getScheduledEventCount(): number {
      return scheduledKeys.size;
    },
  };
}

/**
 * 현재 score time과 loop 상태로 조회할 schedule 구간을 만든다.
 * - 인수 : currentScoreSeconds : 현재 score time
 * - 인수 : lookaheadSeconds : 미리 예약할 초 단위 범위
 * - 인수 : loop : loop 상태
 * - 반환값 : LookaheadQueryWindow[] : scheduler가 조회할 하나 이상의 구간
 */
function createLookaheadQueryWindows(
  currentScoreSeconds: number,
  lookaheadSeconds: number,
  loop: PlaybackLoopState,
): LookaheadQueryWindow[] {
  if (!loop.enabled) {
    return [
      {
        queryStartSeconds: currentScoreSeconds,
        queryEndSeconds: currentScoreSeconds + lookaheadSeconds,
        offsetBaseSeconds: -currentScoreSeconds,
        cycleOffset: 0,
      },
    ];
  }

  validateLoopState(loop);

  const clampedCurrent = clamp(
    currentScoreSeconds,
    loop.startSeconds,
    loop.endSeconds,
  );
  const lookaheadEnd = clampedCurrent + lookaheadSeconds;

  if (lookaheadEnd <= loop.endSeconds) {
    return [
      {
        queryStartSeconds: clampedCurrent,
        queryEndSeconds: lookaheadEnd,
        offsetBaseSeconds: -clampedCurrent,
        cycleOffset: 0,
      },
    ];
  }

  const wrappedEnd = loop.startSeconds + (lookaheadEnd - loop.endSeconds);

  return [
    {
      queryStartSeconds: clampedCurrent,
      queryEndSeconds: loop.endSeconds,
      offsetBaseSeconds: -clampedCurrent,
      cycleOffset: 0,
    },
    {
      queryStartSeconds: loop.startSeconds,
      queryEndSeconds: Math.min(wrappedEnd, loop.endSeconds),
      offsetBaseSeconds: loop.endSeconds - clampedCurrent - loop.startSeconds,
      cycleOffset: 1,
    },
  ];
}

/**
 * scheduler 중복 예약 방지용 key를 만든다.
 * - 인수 : event : 예약 후보 event
 * - 인수 : loopCycleIndex : playback controller가 관리하는 loop 반복 번호
 * - 인수 : window : event가 조회된 lookahead window
 * - 반환값 : scheduler 내부 key
 */
function createScheduledEventKey(
  event: AudioScheduleEvent,
  loopCycleIndex: number,
): string {
  return `${loopCycleIndex}|${event.eventId}`;
}

/**
 * lookahead 값이 scheduler에 사용할 수 있는 양수인지 확인한다.
 * - 인수 : lookaheadSeconds : 미리 예약할 초 단위 범위
 * - 반환값 : 없음
 */
function validateLookaheadSeconds(lookaheadSeconds: number): void {
  if (!Number.isFinite(lookaheadSeconds) || lookaheadSeconds <= 0) {
    throw new Error("lookaheadSeconds must be a positive finite number.");
  }
}

/**
 * 현재 score time이 유한한 값인지 확인한다.
 * - 인수 : currentScoreSeconds : 현재 score time
 * - 반환값 : 없음
 */
function validateCurrentScoreSeconds(currentScoreSeconds: number): void {
  if (!Number.isFinite(currentScoreSeconds)) {
    throw new Error("currentScoreSeconds must be a finite number.");
  }
}

/**
 * loop 범위가 유효한지 확인한다.
 * - 인수 : loop : loop 상태
 * - 반환값 : 없음
 */
function validateLoopState(loop: Extract<PlaybackLoopState, { enabled: true }>): void {
  if (
    !Number.isFinite(loop.startSeconds) ||
    !Number.isFinite(loop.endSeconds) ||
    loop.endSeconds <= loop.startSeconds
  ) {
    throw new Error("Enabled loop requires finite startSeconds < endSeconds.");
  }
}

/**
 * 값을 지정 범위 안으로 제한한다.
 * - 인수 : value : 제한할 값
 * - 인수 : min : 최솟값
 * - 인수 : max : 최댓값
 * - 반환값 : 범위 안으로 제한된 값
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
