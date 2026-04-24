import type {
  GlobalParseErrorCode,
  ParseGlobalCellFn,
  ParsedGlobalCell,
  ParsedGlobalRamp,
} from "./types/index.ts";

function invalidCell(
  rawText: string,
  code: GlobalParseErrorCode,
  charIndex: number | null,
  message?: string,
): ParsedGlobalCell {
  return {
    kind: "invalid",
    rawText,
    error: {
      code,
      charIndex,
      message,
    },
  };
}

function splitRamp(rawText: string): {
  numberText: string;
  ramp: ParsedGlobalRamp;
  rampIndex: number | null;
} {
  if (rawText.endsWith("><")) {
    return {
      numberText: rawText.slice(0, -2),
      ramp: "endStart",
      rampIndex: rawText.length - 2,
    };
  }

  if (rawText.endsWith("<")) {
    return {
      numberText: rawText.slice(0, -1),
      ramp: "start",
      rampIndex: rawText.length - 1,
    };
  }

  if (rawText.endsWith(">")) {
    return {
      numberText: rawText.slice(0, -1),
      ramp: "end",
      rampIndex: rawText.length - 1,
    };
  }

  return {
    numberText: rawText,
    ramp: "none",
    rampIndex: null,
  };
}

function findInvalidDecimalIndex(text: string): number | null {
  return /^(\d+)(?:\.(\d+))?$/.test(text) ? null : 0;
}

function findInvalidIntegerIndex(text: string): number | null {
  return /^\d+$/.test(text) ? null : 0;
}

export const parseGlobalCell: ParseGlobalCellFn = (input, context) => {
  const row = context.rowById.get(input.rowId);
  const rawText = input.rawText;

  if (row?.type !== "global") {
    return invalidCell(rawText, "more_than_expected", null);
  }

  if (rawText.length === 0) {
    return invalidCell(rawText, "empty_global", 0);
  }

  if (row.kind === "bpm" || row.kind === "dynamics") {
    const { numberText, ramp, rampIndex } = splitRamp(rawText);
    const invalidNumberIndex =
      row.kind === "bpm"
        ? findInvalidDecimalIndex(numberText)
        : findInvalidIntegerIndex(numberText);

    if (numberText.length === 0) {
      return invalidCell(rawText, "invalid_number", rampIndex ?? 0);
    }

    if (invalidNumberIndex !== null) {
      return invalidCell(rawText, "invalid_number", invalidNumberIndex);
    }

    const value = Number(numberText);
    if (row.kind === "bpm") {
      if (!Number.isFinite(value) || value <= 0) {
        return invalidCell(rawText, "invalid_bpm_range", 0);
      }

      return {
        kind: "linearGlobalValue",
        rawText,
        globalKind: "bpm",
        value,
        ramp,
      };
    }

    if (!Number.isInteger(value) || value < 0 || value > 150) {
      return invalidCell(rawText, "invalid_dynamics_range", 0);
    }

    return {
      kind: "linearGlobalValue",
      rawText,
      globalKind: "dynamics",
      value,
      ramp,
    };
  }

  if (rawText.endsWith("><")) {
    return invalidCell(rawText, "invalid_ramp_token", rawText.length - 2);
  }

  if (rawText.endsWith("<") || rawText.endsWith(">")) {
    return invalidCell(rawText, "invalid_ramp_token", rawText.length - 1);
  }

  if (findInvalidIntegerIndex(rawText) !== null) {
    return invalidCell(rawText, "invalid_number", 0);
  }

  const value = Number(rawText);
  if (row.kind === "beatsPerBar") {
    if (value < 1) {
      return invalidCell(rawText, "invalid_beats_per_bar_range", 0);
    }

    return {
      kind: "instantGlobalValue",
      rawText,
      globalKind: "beatsPerBar",
      value,
    };
  }

  if (value < 1) {
    return invalidCell(rawText, "invalid_steps_per_beat_range", 0);
  }

  return {
    kind: "instantGlobalValue",
    rawText,
    globalKind: "stepsPerBeat",
    value,
  };
};
