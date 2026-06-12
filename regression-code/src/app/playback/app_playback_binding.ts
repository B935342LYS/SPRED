/**
 * playback 버튼, seek input, audio option event를 app playback runtime에 연결한다.
 */

import type {
  AppDom,
  AppState,
} from "../app_types";
import { syncLeftStatus } from "../app_ui_sync";
import type { AppPlaybackRuntime } from "./app_playback";
import {
  scrollToScoreSeconds,
  syncPlaybackStatus,
  syncPlaybackUi,
  syncSeekUi,
} from "./app_playback_ui";

/** playback binding이 app 상태와 runtime을 조회하기 위한 session 입력. */
export type PlaybackBindingSession = {
  getState(): AppState;
  setState(nextState: AppState): void;
  getPlaybackRuntime(): AppPlaybackRuntime;
  resetPlaybackForCurrentState(): void;
  resetNotePreviewForCurrentDom(): void;
};

/** playback binding이 외부 reset 흐름에 제공하는 control 객체. */
export type PlaybackBindingControl = {
  stopPlaybackAnimation(): void;
};

/**
 * playback 관련 DOM event를 app playback runtime에 연결한다.
 * - 인수 : dom : 앱에서 제어하는 DOM 요소
 * - 인수 : session : app 상태와 playback runtime callback 묶음
 * - 반환값 : 외부 reset에서 사용할 animation control
 */
export function bindPlaybackControls(
  dom: AppDom,
  session: PlaybackBindingSession,
): PlaybackBindingControl {
  let playbackRafId: number | null = null;

  const stopPlaybackAnimation = (): void => {
    if (playbackRafId !== null) {
      cancelAnimationFrame(playbackRafId);
      playbackRafId = null;
    }
  };

  const updatePlaybackScroll = (): void => {
    const state = session.getState();
    const playbackRuntime = session.getPlaybackRuntime();

    if (!playbackRuntime.controller.isPlaying() || state.layout === null) {
      playbackRafId = null;
      syncPlaybackUi(dom, state, playbackRuntime);
      return;
    }

    const currentScoreSeconds = playbackRuntime.controller.getCurrentScoreSeconds();

    // score canvas의 왼쪽 edge를 재생 기준선으로 두고 현재 tick이 그 위치에 오도록 스크롤한다.
    scrollToScoreSeconds(dom, state, playbackRuntime, currentScoreSeconds);
    syncSeekUi(dom, state, playbackRuntime, currentScoreSeconds);
    playbackRafId = requestAnimationFrame(updatePlaybackScroll);
  };

  dom.playButton.addEventListener("click", () => {
    const state = session.getState();
    const playbackRuntime = session.getPlaybackRuntime();

    if (state.busy.kind !== "idle") {
      return;
    }

    const playbackState = playbackRuntime.controller.getState();

    if (playbackState.kind === "playing") {
      playbackRuntime.controller.pause();
      stopPlaybackAnimation();
      syncPlaybackUi(dom, state, playbackRuntime);
      scrollToScoreSeconds(
        dom,
        state,
        playbackRuntime,
        playbackRuntime.controller.getCurrentScoreSeconds(),
      );
      return;
    }

    const playRequest = playbackState.kind === "paused"
      ? playbackRuntime.controller.resume()
      : playbackRuntime.controller.playFromSeconds(Number(dom.seekInput.value));

    playRequest
      .then(() => {
        const nextState = session.getState();
        const nextPlaybackRuntime = session.getPlaybackRuntime();

        syncPlaybackUi(dom, nextState, nextPlaybackRuntime);
        scrollToScoreSeconds(
          dom,
          nextState,
          nextPlaybackRuntime,
          nextPlaybackRuntime.controller.getCurrentScoreSeconds(),
        );
        stopPlaybackAnimation();
        playbackRafId = requestAnimationFrame(updatePlaybackScroll);
      })
      .catch((error: unknown) => {
        const currentState = session.getState();
        const message = error instanceof Error ? error.message : "Unknown playback error.";

        session.setState({
          ...currentState,
          statusMessage: {
            level: "error",
            text: message,
          },
        });
        syncPlaybackStatus(dom, "error");
        syncLeftStatus(dom, session.getState());
      });
  });

  dom.stopButton.addEventListener("click", () => {
    const state = session.getState();
    const playbackRuntime = session.getPlaybackRuntime();

    stopPlaybackAnimation();
    playbackRuntime.controller.stop();
    syncPlaybackUi(dom, state, playbackRuntime);
    scrollToScoreSeconds(dom, state, playbackRuntime, 0);
  });

  dom.seekInput.addEventListener("input", () => {
    const state = session.getState();
    const playbackRuntime = session.getPlaybackRuntime();
    const scoreSeconds = Number(dom.seekInput.value);

    syncSeekUi(dom, state, playbackRuntime, scoreSeconds);
    scrollToScoreSeconds(dom, state, playbackRuntime, scoreSeconds);
  });

  dom.seekInput.addEventListener("change", () => {
    const scoreSeconds = Number(dom.seekInput.value);
    const playbackRuntime = session.getPlaybackRuntime();

    playbackRuntime.controller.seekToSeconds(scoreSeconds)
      .then(() => {
        const state = session.getState();
        const nextPlaybackRuntime = session.getPlaybackRuntime();

        syncPlaybackUi(dom, state, nextPlaybackRuntime);
        scrollToScoreSeconds(
          dom,
          state,
          nextPlaybackRuntime,
          nextPlaybackRuntime.controller.getCurrentScoreSeconds(),
        );
        if (nextPlaybackRuntime.controller.isPlaying()) {
          stopPlaybackAnimation();
          playbackRafId = requestAnimationFrame(updatePlaybackScroll);
        }
      })
      .catch((error: unknown) => {
        const currentState = session.getState();
        const message = error instanceof Error ? error.message : "Unknown seek error.";

        session.setState({
          ...currentState,
          statusMessage: {
            level: "error",
            text: message,
          },
        });
        syncPlaybackStatus(dom, "error");
        syncLeftStatus(dom, session.getState());
      });
  });

  dom.volumeInput.addEventListener("change", () => {
    session.resetPlaybackForCurrentState();
    session.resetNotePreviewForCurrentDom();
  });

  dom.waveSelect.addEventListener("change", () => {
    session.resetPlaybackForCurrentState();
    session.resetNotePreviewForCurrentDom();
  });

  return {
    stopPlaybackAnimation,
  };
}
