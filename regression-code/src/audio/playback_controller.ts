/**
 * src/audio/playback_controller.ts
 * audio schedule, scheduler, backend를 묶어 play from start와 stop을 제어한다.
 */

import type {
  AudioBackend,
  AudioLookaheadScheduler,
  AudioSchedule,
  PlaybackState,
} from "./audio_types";

/** playback controller 생성 입력. */
export type PlaybackControllerInput = {
  schedule: AudioSchedule;
  scheduler: AudioLookaheadScheduler;
  backend: AudioBackend;
  schedulerIntervalMs: number;
};

/** UI/app 계층이 사용할 playback controller 계약. */
export type PlaybackController = {
  playFromStart(): Promise<void>;
  stop(): void;
  getState(): PlaybackState;
  getCurrentScoreSeconds(): number;
  isPlaying(): boolean;
  dispose(): void;
};

const LOOP_OFF = { enabled: false } as const;

/**
 * play from start와 stop을 지원하는 첫 playback controller를 만든다.
 * - 인수 : input : schedule, scheduler, backend, interval 설정
 * - 반환값 : PlaybackController : app에서 호출할 재생 제어 객체
 */
export function createPlaybackController(
  input: PlaybackControllerInput,
): PlaybackController {
  validateSchedulerInterval(input.schedulerIntervalMs);

  let state: PlaybackState = {
    kind: "stopped",
    loop: LOOP_OFF,
  };
  let intervalId: ReturnType<typeof setInterval> | null = null;

  return {
    async playFromStart(): Promise<void> {
      stopInterval();
      input.backend.stopAll();
      input.scheduler.resetScheduledEvents();
      await input.backend.ensureStarted();

      state = {
        kind: "playing",
        audioStartedAt: input.backend.getCurrentTime(),
        scoreStartedAt: 0,
        loop: LOOP_OFF,
      };
      scheduleCurrentLookahead();
      intervalId = setInterval(
        scheduleCurrentLookahead,
        input.schedulerIntervalMs,
      );
    },
    stop(): void {
      stopInterval();
      input.backend.stopAll();
      input.scheduler.resetScheduledEvents();
      state = {
        kind: "stopped",
        loop: LOOP_OFF,
      };
    },
    getState(): PlaybackState {
      return state;
    },
    getCurrentScoreSeconds(): number {
      if (state.kind !== "playing") {
        return state.kind === "paused" ? state.pausedAtScoreSeconds : 0;
      }

      return clampScoreSeconds(
        state.scoreStartedAt + input.backend.getCurrentTime() - state.audioStartedAt,
        input.schedule.durationSeconds,
      );
    },
    isPlaying(): boolean {
      return state.kind === "playing";
    },
    dispose(): void {
      stopInterval();
      input.backend.dispose();
      state = {
        kind: "stopped",
        loop: LOOP_OFF,
      };
    },
  };

  /**
   * 현재 score time 기준 lookahead 예약을 수행한다.
   * - 인수 : 없음
   * - 반환값 : 없음
   */
  function scheduleCurrentLookahead(): void {
    if (state.kind !== "playing") {
      return;
    }

    const currentScoreSeconds = clampScoreSeconds(
      state.scoreStartedAt + input.backend.getCurrentTime() - state.audioStartedAt,
      input.schedule.durationSeconds,
    );

    input.scheduler.scheduleLookahead(currentScoreSeconds, state.loop);

    if (currentScoreSeconds >= input.schedule.durationSeconds) {
      stopInterval();
      state = {
        kind: "stopped",
        loop: LOOP_OFF,
      };
    }
  }

  /**
   * scheduler interval을 중지한다.
   * - 인수 : 없음
   * - 반환값 : 없음
   */
  function stopInterval(): void {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
}

/**
 * scheduler interval이 유효한 양수인지 확인한다.
 * - 인수 : schedulerIntervalMs : setInterval 주기
 * - 반환값 : 없음
 */
function validateSchedulerInterval(schedulerIntervalMs: number): void {
  if (!Number.isFinite(schedulerIntervalMs) || schedulerIntervalMs <= 0) {
    throw new Error("schedulerIntervalMs must be a positive finite number.");
  }
}

/**
 * score seconds를 재생 가능 범위로 제한한다.
 * - 인수 : seconds : 현재 score seconds
 * - 인수 : durationSeconds : schedule 전체 길이
 * - 반환값 : 0..durationSeconds 범위의 seconds
 */
function clampScoreSeconds(seconds: number, durationSeconds: number): number {
  if (!Number.isFinite(seconds)) {
    return 0;
  }

  return Math.min(Math.max(seconds, 0), Math.max(0, durationSeconds));
}
