/**
 * src/audio/oscillator_backend.ts
 * AudioScheduleEvent를 Web Audio API의 OscillatorNode와 GainNode로 재생하는 기본 backend이다.
 */

import type {
  AudioBackend,
  AudioScheduleEffect,
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
  tremoloGain: GainNode | null;
  auxiliaryNodes: AudioNode[];
  auxiliaryOscillators: OscillatorNode[];
};

const DEFAULT_WAVE_TYPE: OscillatorType = "sine";
const DEFAULT_MASTER_VOLUME = 0.7;
const DEFAULT_ATTACK_SECONDS = 0.005;
const DEFAULT_RELEASE_SECONDS = 0.03;
const MIN_NOTE_SECONDS = 0.03;
const SILENT_GAIN = 0.0001;
const DEFAULT_VIBRATO_RATE_HZ = 5;
const DEFAULT_VIBRATO_DEPTH_CENTS = 35;
const TREMOLO_GATE_MIN_GAIN = 0.0001;
const TREMOLO_GATE_DUTY_RATIO = 0.6;
const TREMOLO_GATE_RAMP_SECONDS = 0.002;

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
      const hasTremolo = event.effects.some((effect) => effect.kind === "tremolo");
      const tremoloGain = hasTremolo ? audioContext.createGain() : null;
      const activeNode: ActiveOscillatorNode = {
        oscillator,
        gain,
        tremoloGain,
        auxiliaryNodes: [],
        auxiliaryOscillators: [],
      };

      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(
        midiToFrequency(event.midi, event.centOffset),
        startTime,
      );

      applyVibratoEffects(audioContext, event, oscillator, startTime, endTime, activeNode);
      applyTremoloEffects(event, tremoloGain, startTime, endTime);

      // 기본 note envelope는 tremolo gate와 분리해 note 전체 attack/release만 담당한다.
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

      if (tremoloGain !== null) {
        oscillator.connect(tremoloGain);
        tremoloGain.connect(gain);
      } else {
        oscillator.connect(gain);
      }

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
          for (const oscillator of activeNode.auxiliaryOscillators) {
            oscillator.stop();
          }
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

    if (activeNode.tremoloGain !== null) {
      try {
        activeNode.tremoloGain.disconnect();
      } catch {
        // 이미 disconnect된 node는 추가 처리가 필요 없다.
      }
    }

    for (const oscillator of activeNode.auxiliaryOscillators) {
      try {
        oscillator.disconnect();
      } catch {
        // 이미 disconnect된 node는 추가 처리가 필요 없다.
      }
    }

    for (const node of activeNode.auxiliaryNodes) {
      try {
        node.disconnect();
      } catch {
        // 이미 disconnect된 node는 추가 처리가 필요 없다.
      }
    }

    activeNodes.delete(activeNode);
  }
}

/**
 * vibrato effect 구간을 oscillator detune LFO로 예약한다.
 * - 인수 : audioContext : backend가 사용하는 AudioContext
 * - 인수 : event : 예약 대상 note event
 * - 인수 : oscillator : 발음 oscillator
 * - 인수 : startTime : note 시작 audio time
 * - 인수 : endTime : note 종료 audio time
 * - 인수 : activeNode : stop/disconnect 정리를 위한 active node 묶음
 * - 반환값 : 없음
 */
function applyVibratoEffects(
  audioContext: AudioContext,
  event: AudioScheduleEvent,
  oscillator: OscillatorNode,
  startTime: number,
  endTime: number,
  activeNode: ActiveOscillatorNode,
): void {
  const vibratoEffects = event.effects.filter((effect) => effect.kind === "vibrato");

  if (vibratoEffects.length === 0) {
    return;
  }

  const lfo = audioContext.createOscillator();
  const depth = audioContext.createGain();

  lfo.type = "sine";
  lfo.frequency.setValueAtTime(DEFAULT_VIBRATO_RATE_HZ, startTime);
  depth.gain.setValueAtTime(0, startTime);

  // Tone.js의 Vibrato처럼 LFO 출력에 depth를 곱해 detune cents를 흔든다.
  lfo.connect(depth);
  depth.connect(oscillator.detune);

  for (const effect of vibratoEffects) {
    const effectRange = clampEffectTimeRange(effect, event, startTime, endTime);

    if (effectRange === null) {
      continue;
    }

    depth.gain.setValueAtTime(DEFAULT_VIBRATO_DEPTH_CENTS, effectRange.startTime);
    depth.gain.setValueAtTime(0, effectRange.endTime);
  }

  activeNode.auxiliaryOscillators.push(lfo);
  activeNode.auxiliaryNodes.push(depth);
  lfo.start(startTime);
  lfo.stop(endTime + 0.02);
}

/**
 * tremolo effect 구간을 note 내부 gain gate automation으로 예약한다.
 * - 인수 : event : 예약 대상 note event
 * - 인수 : tremoloGain : oscillator와 envelope 사이에 놓인 tremolo gate
 * - 인수 : startTime : note 시작 audio time
 * - 인수 : endTime : note 종료 audio time
 * - 반환값 : 없음
 */
function applyTremoloEffects(
  event: AudioScheduleEvent,
  tremoloGain: GainNode | null,
  startTime: number,
  endTime: number,
): void {
  if (tremoloGain === null) {
    return;
  }

  tremoloGain.gain.setValueAtTime(1, startTime);

  const tremoloEffects = event.effects
    .filter((effect) => effect.kind === "tremolo")
    .sort((left, right) => left.startSeconds - right.startSeconds);

  for (let index = 0; index < tremoloEffects.length; index += 1) {
    const effect = tremoloEffects[index];
    const effectRange = clampEffectTimeRange(effect, event, startTime, endTime);

    if (effectRange === null || effect.division < 2) {
      continue;
    }

    const nextEffect = tremoloEffects[index + 1];
    const restoreToUnity = nextEffect === undefined ||
      nextEffect.startSeconds > effect.endSeconds + 1e-9;

    scheduleTremoloGate(
      tremoloGain.gain,
      effectRange.startTime,
      effectRange.endTime,
      effect.division,
      effect.durationTicks,
      restoreToUnity,
    );
  }
}

/**
 * tremolo gate gain에 on/off pulse를 예약한다.
 * - 인수 : gain : tremolo gate로 사용할 AudioParam
 * - 인수 : startTime : tremolo 시작 audio time
 * - 인수 : endTime : tremolo 종료 audio time
 * - 인수 : division : tick당 tremolo 분할 수
 * - 인수 : durationTicks : effect segment의 tick 길이
 * - 인수 : restoreToUnity : 다음 tremolo 구간과 맞닿지 않을 때 gain을 1로 복귀할지 여부
 * - 반환값 : 없음
 */
function scheduleTremoloGate(
  gain: AudioParam,
  startTime: number,
  endTime: number,
  division: number,
  durationTicks: number,
  restoreToUnity: boolean,
): void {
  const durationSeconds = endTime - startTime;

  if (durationSeconds <= 0) {
    return;
  }

  const pulseCount = Math.max(
    1,
    Math.round(Math.max(1, durationTicks) * Math.max(1, division)),
  );
  const pulseSeconds = durationSeconds / pulseCount;
  const rampSeconds = Math.min(TREMOLO_GATE_RAMP_SECONDS, pulseSeconds * 0.25);

  gain.setValueAtTime(TREMOLO_GATE_MIN_GAIN, startTime);

  for (let index = 0; index < pulseCount; index += 1) {
    const pulseStart = startTime + index * pulseSeconds;
    const pulseEnd = index === pulseCount - 1
      ? endTime
      : pulseStart + pulseSeconds;
    const onEnd = Math.min(
      pulseEnd,
      pulseStart + pulseSeconds * TREMOLO_GATE_DUTY_RATIO,
    );

    gain.linearRampToValueAtTime(1, pulseStart + rampSeconds);
    gain.setValueAtTime(1, Math.max(pulseStart + rampSeconds, onEnd - rampSeconds));
    gain.linearRampToValueAtTime(TREMOLO_GATE_MIN_GAIN, onEnd);
    gain.setValueAtTime(TREMOLO_GATE_MIN_GAIN, pulseEnd);
  }

  if (restoreToUnity) {
    gain.linearRampToValueAtTime(1, Math.min(endTime + rampSeconds, endTime + 0.01));
  }
}

/**
 * effect의 score seconds 구간을 현재 예약된 note의 audio time 구간으로 제한한다.
 * - 인수 : effect : schedule effect
 * - 인수 : event : effect가 속한 note event
 * - 인수 : startTime : note 시작 audio time
 * - 인수 : endTime : note 종료 audio time
 * - 반환값 : 유효한 audio time 구간 또는 null
 */
function clampEffectTimeRange(
  effect: AudioScheduleEffect,
  event: AudioScheduleEvent,
  startTime: number,
  endTime: number,
): { startTime: number; endTime: number } | null {
  const effectStartTime = startTime + effect.startSeconds - event.startSeconds;
  const effectEndTime = startTime + effect.endSeconds - event.startSeconds;
  const clampedStartTime = Math.max(startTime, effectStartTime);
  const clampedEndTime = Math.min(endTime, effectEndTime);

  if (clampedEndTime <= clampedStartTime) {
    return null;
  }

  return {
    startTime: clampedStartTime,
    endTime: clampedEndTime,
  };
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
