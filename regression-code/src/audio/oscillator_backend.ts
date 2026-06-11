/**
 * src/audio/oscillator_backend.ts
 * AudioScheduleEvent를 Web Audio API의 OscillatorNode와 GainNode로 재생하는 기본 backend이다.
 */

import type {
  AudioBackend,
  AudioScheduleEvent,
} from "./audio_types";

/** oscillator backend 생성 옵션. */
export type OscillatorBackendOptions = {
  waveType?: OscillatorType;
  masterVolume?: number;
  attackSeconds?: number;
  releaseSeconds?: number;
};

type ActiveOscillatorNode = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

const DEFAULT_WAVE_TYPE: OscillatorType = "sine";
const DEFAULT_MASTER_VOLUME = 0.7;
const DEFAULT_ATTACK_SECONDS = 0.005;
const DEFAULT_RELEASE_SECONDS = 0.03;
const MIN_NOTE_SECONDS = 0.03;
const SILENT_GAIN = 0.0001;

/**
 * MIDI note number와 cent offset을 주파수로 변환한다.
 * - 인수 : midi : MIDI note number. A4는 69이다.
 * - 인수 : centOffset : cent 단위 미세 음정 보정
 * - 반환값 : Hz 단위 frequency
 */
export function midiToFrequency(midi: number, centOffset = 0): number {
  if (!Number.isFinite(midi) || !Number.isFinite(centOffset)) {
    throw new Error("midiToFrequency requires finite midi and centOffset.");
  }

  return 440 * 2 ** ((midi - 69 + centOffset / 100) / 12);
}

/**
 * Web Audio API 기반 oscillator backend를 만든다.
 * - 인수 : options : 파형, master volume, envelope 설정
 * - 반환값 : AudioBackend : scheduler가 사용할 backend 구현체
 */
export function createOscillatorBackend(
  options: OscillatorBackendOptions = {},
): AudioBackend {
  let context: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  const activeNodes = new Set<ActiveOscillatorNode>();
  const waveType = options.waveType ?? DEFAULT_WAVE_TYPE;
  const masterVolume = clamp01(options.masterVolume ?? DEFAULT_MASTER_VOLUME);
  const attackSeconds = normalizePositiveSeconds(
    options.attackSeconds ?? DEFAULT_ATTACK_SECONDS,
    DEFAULT_ATTACK_SECONDS,
  );
  const releaseSeconds = normalizePositiveSeconds(
    options.releaseSeconds ?? DEFAULT_RELEASE_SECONDS,
    DEFAULT_RELEASE_SECONDS,
  );

  return {
    async ensureStarted(): Promise<void> {
      const audioContext = getOrCreateAudioContext();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
    },
    scheduleEvent(event: AudioScheduleEvent, offsetSeconds: number): void {
      const audioContext = getOrCreateAudioContext();
      const startTime = audioContext.currentTime + Math.max(0, offsetSeconds);
      const durationSeconds = Math.max(
        MIN_NOTE_SECONDS,
        event.endSeconds - event.startSeconds,
      );
      const endTime = startTime + durationSeconds;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const activeNode: ActiveOscillatorNode = {
        oscillator,
        gain,
      };

      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(
        midiToFrequency(event.midi, event.centOffset),
        startTime,
      );

      // 현재 1차 backend는 effect/automation을 적용하지 않고 기본 note envelope만 예약한다.
      gain.gain.setValueAtTime(SILENT_GAIN, startTime);
      gain.gain.linearRampToValueAtTime(
        masterVolume * event.velocity,
        startTime + Math.min(attackSeconds, durationSeconds / 2),
      );
      gain.gain.setValueAtTime(
        masterVolume * event.velocity,
        Math.max(startTime, endTime - releaseSeconds),
      );
      gain.gain.linearRampToValueAtTime(SILENT_GAIN, endTime);

      oscillator.connect(gain);
      gain.connect(getMasterGain());
      activeNodes.add(activeNode);
      oscillator.addEventListener("ended", () => {
        cleanupActiveNode(activeNode);
      }, { once: true });
      oscillator.start(startTime);
      oscillator.stop(endTime + 0.02);
    },
    getCurrentTime(): number {
      return getOrCreateAudioContext().currentTime;
    },
    stopAll(): void {
      const audioContext = context;

      for (const activeNode of activeNodes) {
        try {
          activeNode.gain.gain.cancelScheduledValues(0);
          activeNode.gain.gain.setValueAtTime(SILENT_GAIN, audioContext?.currentTime ?? 0);
          activeNode.oscillator.stop();
        } catch {
          // 이미 stop된 node는 ended handler 정리만 기다린다.
        }

        cleanupActiveNode(activeNode);
      }

      activeNodes.clear();
    },
    dispose(): void {
      this.stopAll();

      if (context !== null) {
        void context.close();
      }

      context = null;
      masterGain = null;
    },
  };

  /**
   * AudioContext를 지연 생성하고 master gain까지 초기화한다.
   * - 인수 : 없음
   * - 반환값 : AudioContext : backend가 공유하는 audio context
   */
  function getOrCreateAudioContext(): AudioContext {
    if (context === null) {
      const AudioContextCtor = getAudioContextConstructor();

      context = new AudioContextCtor();
      masterGain = context.createGain();
      masterGain.gain.value = masterVolume;
      masterGain.connect(context.destination);
    }

    return context;
  }

  /**
   * master GainNode를 반환한다.
   * - 인수 : 없음
   * - 반환값 : GainNode : 모든 note가 연결될 master gain
   */
  function getMasterGain(): GainNode {
    if (masterGain === null) {
      getOrCreateAudioContext();
    }

    if (masterGain === null) {
      throw new Error("Master gain could not be initialized.");
    }

    return masterGain;
  }

  /**
   * 종료된 oscillator node 연결을 정리한다.
   * - 인수 : activeNode : 정리할 oscillator/gain 묶음
   * - 반환값 : 없음
   */
  function cleanupActiveNode(activeNode: ActiveOscillatorNode): void {
    try {
      activeNode.oscillator.disconnect();
    } catch {
      // 이미 disconnect된 node는 추가 처리가 필요 없다.
    }

    try {
      activeNode.gain.disconnect();
    } catch {
      // 이미 disconnect된 node는 추가 처리가 필요 없다.
    }

    activeNodes.delete(activeNode);
  }
}

/**
 * 현재 브라우저의 AudioContext 생성자를 가져온다.
 * - 인수 : 없음
 * - 반환값 : AudioContext 생성자
 */
function getAudioContextConstructor(): typeof AudioContext {
  const audioGlobal = globalThis as typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };
  const AudioContextCtor = audioGlobal.AudioContext ?? audioGlobal.webkitAudioContext;

  if (AudioContextCtor === undefined) {
    throw new Error("Web Audio API is not available in this environment.");
  }

  return AudioContextCtor;
}

/**
 * volume 값을 0 이상 1 이하로 제한한다.
 * - 인수 : value : 제한할 volume
 * - 반환값 : 0..1 범위 volume
 */
function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_MASTER_VOLUME;
  }

  return Math.min(Math.max(value, 0), 1);
}

/**
 * 초 단위 옵션을 양수로 정규화한다.
 * - 인수 : value : 사용자가 전달한 초 단위 값
 * - 인수 : fallback : 값이 유효하지 않을 때 사용할 기본값
 * - 반환값 : 양수 초 단위 값
 */
function normalizePositiveSeconds(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
}
