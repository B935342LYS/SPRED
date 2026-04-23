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
): ParsedGlobalCell {
  return {
    kind: "invalid",
    rawText,
    error: {
      code,
      charIndex,
    },
  };
}

function splitRamp(rawText: string): {
  numberText: string;
  ramp: ParsedGlobalRamp;
} {
  if (rawText.endsWith("><")) {
    return {
      numberText: rawText.slice(0, -2),
      ramp: "endStart",
    };
  }

  if (rawText.endsWith("<")) {
    return {
      numberText: rawText.slice(0, -1),
      ramp: "start",
    };
  }

  if (rawText.endsWith(">")) {
    return {
      numberText: rawText.slice(0, -1),
      ramp: "end",
    };
  }

  return {
    numberText: rawText,
    ramp: "none",
  };
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
    const { numberText, ramp } = splitRamp(rawText);
    const value = Number(numberText);

    if (numberText.length === 0 || Number.isNaN(value)) {
      return invalidCell(rawText, "invalid_number", 0);
    }

    if (row.kind === "bpm") {
      if (value <= 0) {
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

  if (rawText.endsWith("<") || rawText.endsWith(">")) {
    return invalidCell(rawText, "invalid_ramp_token", rawText.length - 1);
  }

  const value = Number(rawText);
  if (!Number.isInteger(value)) {
    return invalidCell(rawText, "invalid_number", 0);
  }

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
