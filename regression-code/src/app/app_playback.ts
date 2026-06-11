/**
 * src/app/app_playback.ts
 * app 상태와 DOM 입력값에서 playback controller와 tick mapper를 생성한다.
 */

import { buildAudioSchedule } from "../audio/audio_schedule_builder";
import { createAudioEventQueue } from "../audio/audio_event_queue";
import { createAudioLookaheadScheduler } from "../audio/audio_scheduler";
import type { TickTimeMapper } from "../audio/audio_types";
import { createOscillatorBackend } from "../audio/oscillator_backend";
import type { PlaybackController } from "../audio/playback_controller";
import { createPlaybackController } from "../audio/playback_controller";
import { createTickTimeMapper } from "../audio/tick_time_mapper";
import type {
  AppDom,
  AppState,
} from "./app_types";

const PLAYBACK_LOOKAHEAD_SECONDS = 0.2;
const PLAYBACK_SCHEDULER_INTERVAL_MS = 25;

/** app 계층에서 함께 보관하는 playback runtime 객체 묶음. */
export type AppPlaybackRuntime = {
  controller: PlaybackController;
  timeMapper: TickTimeMapper;
};

/**
 * 현재 app 상태와 playback UI 입력값으로 playback runtime을 만든다.
 * - 인수 : dom : playback 설정을 읽을 DOM 묶음
 * - 인수 : state : 현재 score/analyzer 상태
 * - 반환값 : AppPlaybackRuntime : controller와 tick mapper 묶음
 */
export function createAppPlaybackRuntime(
  dom: AppDom,
  state: AppState,
): AppPlaybackRuntime {
  const schedule = buildAudioSchedule({
    analysis: state.analysis,
    activeTrackIds: [state.activeTrackId],
  });
  const queue = createAudioEventQueue(schedule);
  const backend = createOscillatorBackend({
    waveType: dom.waveSelect.value as OscillatorType,
    masterVolume: Number(dom.volumeInput.value) / 100,
  });
  const scheduler = createAudioLookaheadScheduler({
    queue,
    backend,
    lookaheadSeconds: PLAYBACK_LOOKAHEAD_SECONDS,
  });

  return {
    controller: createPlaybackController({
      schedule,
      scheduler,
      backend,
      schedulerIntervalMs: PLAYBACK_SCHEDULER_INTERVAL_MS,
    }),
    timeMapper: createTickTimeMapper(state.analysis.timingTimeline),
  };
}
