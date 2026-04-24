import {
  isCentValueInRange,
  MAX_CENT_VALUE,
  MIN_CENT_VALUE,
} from "./types/cent.ts";
import type {
  HoldKind,
  ParseError,
  ParseErrorCode,
  ParseNoteCellFn,
  ParsedAbsolutePitch,
  ParsedCell,
  ParsedGliss,
  ParsedMicroPitch,
  ParsedModifiers,
  ParsedPletSlot,
  ParsedPletSlotNote,
  ParsedTrem,
  ParsedTupletPosition,
} from "./types/index.ts";

const ESCAPABLE_CHARS = new Set(["\\", "/", "@", "|", "(", ")", "-", "~"]);
const DEFAULT_TEXT_RESERVED_CHARS = new Set(["/", "@", "|", "(", ")", "-", "~"]);
const NOTE_MODIFIER_ORDER = ["g", "t", "p", "m"] as const;
type NoteModifierName = (typeof NOTE_MODIFIER_ORDER)[number];

function emptyModifiers(): ParsedModifiers {
  return {
    gliss: null,
    trem: null,
    absolutePitch: null,
    microPitch: null,
  };
}

function invalidCell(
  rawText: string,
  code: ParseErrorCode,
  charIndex: number | null,
  message?: string,
): ParsedCell {
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

function makeError(
  code: ParseErrorCode,
  charIndex: number | null,
  message?: string,
): ParseError {
  return {
    code,
    charIndex,
    message,
  };
}

function isDigit(char: string | undefined): boolean {
  return char !== undefined && char >= "0" && char <= "9";
}

function isValidIntegerText(text: string): boolean {
  return /^-?\d+$/.test(text);
}

function isValidCentText(text: string): boolean {
  return /^-?\d+(?:\.\d{1,2})?$/.test(text);
}

function findFirstUnescapedChar(text: string, target: string): number {
  let escaped = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === target) {
      return index;
    }
  }

  return -1;
}

function findMatchingParen(text: string, openIndex: number): number {
  let escaped = false;

  for (let index = openIndex + 1; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "(") {
      return -1;
    }

    if (char === ")") {
      return index;
    }
  }

  return -1;
}

function unescapeText(
  rawText: string,
  startIndex: number,
  text: string,
): { ok: true; value: string } | { ok: false; error: ParseError } {
  let value = "";

  for (let offset = 0; offset < text.length; offset += 1) {
    const char = text[offset];
    if (char !== "\\") {
      value += char;
      continue;
    }

    const nextChar = text[offset + 1];
    if (nextChar === undefined || !ESCAPABLE_CHARS.has(nextChar)) {
      return {
        ok: false,
        error: makeError("invalid_escape", startIndex + offset),
      };
    }

    value += nextChar;
    offset += 1;
  }

  return {
    ok: true,
    value,
  };
}

function scanDefaultText(
  rawText: string,
  startIndex: number,
): { ok: true; value: string; nextIndex: number } | { ok: false; error: ParseError } {
  let index = startIndex;
  let escaped = false;

  while (index < rawText.length) {
    const char = rawText[index];

    if (escaped) {
      if (!ESCAPABLE_CHARS.has(char)) {
        return {
          ok: false,
          error: makeError("invalid_escape", index - 1),
        };
      }
      escaped = false;
      index += 1;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      index += 1;
      continue;
    }

    if (char === "@") {
      break;
    }

    if (DEFAULT_TEXT_RESERVED_CHARS.has(char)) {
      return {
        ok: false,
        error: makeError("unexpected_reserved_char", index),
      };
    }

    index += 1;
  }

  if (escaped) {
    return {
      ok: false,
      error: makeError("invalid_escape", rawText.length - 1),
    };
  }

  const unescaped = unescapeText(rawText, startIndex, rawText.slice(startIndex, index));
  if (!unescaped.ok) {
    return unescaped;
  }

  return {
    ok: true,
    value: unescaped.value,
    nextIndex: index,
  };
}

function parseModifierArguments(
  rawText: string,
  index: number,
): { ok: true; name: string; argsText: string; nextIndex: number } | { ok: false; error: ParseError } {
  if (rawText[index] !== "@") {
    return {
      ok: false,
      error: makeError("more_than_expected", index),
    };
  }

  const name = rawText[index + 1];
  if (name === undefined) {
    return {
      ok: false,
      error: makeError("unknown_modifier", index),
    };
  }

  const openParenIndex = index + 2;
  if (rawText[openParenIndex] !== "(") {
    return {
      ok: false,
      error: makeError("unknown_modifier", index),
    };
  }

  const closeParenIndex = findMatchingParen(rawText, openParenIndex);
  if (closeParenIndex < 0) {
    return {
      ok: false,
      error: makeError("unterminated_paren", openParenIndex),
    };
  }

  return {
    ok: true,
    name,
    argsText: rawText.slice(openParenIndex + 1, closeParenIndex),
    nextIndex: closeParenIndex + 1,
  };
}

function parseGlissModifier(
  rawText: string,
  modifierIndex: number,
  argsText: string,
): { ok: true; value: ParsedGliss } | { ok: false; error: ParseError } {
  const commaIndex = findFirstUnescapedChar(argsText, ",");
  if (commaIndex < 0) {
    return {
      ok: false,
      error: makeError("missing_argument", modifierIndex),
    };
  }

  const idText = argsText.slice(0, commaIndex);
  const kindText = argsText.slice(commaIndex + 1);
  if (idText.length === 0 || kindText.length === 0) {
    return {
      ok: false,
      error: makeError("missing_argument", modifierIndex),
    };
  }

  const idResult = unescapeText(rawText, modifierIndex + 3, idText);
  if (!idResult.ok) {
    return idResult;
  }

  if (kindText !== "start" && kindText !== "mid" && kindText !== "end") {
    return {
      ok: false,
      error: makeError("invalid_gliss_kind", modifierIndex),
    };
  }

  return {
    ok: true,
    value: {
      id: idResult.value,
      glissKind: kindText,
    },
  };
}

function parseTremModifier(
  modifierIndex: number,
  argsText: string,
): { ok: true; value: ParsedTrem } | { ok: false; error: ParseError } {
  if (!isValidIntegerText(argsText)) {
    return {
      ok: false,
      error: makeError("invalid_number", modifierIndex),
    };
  }

  const divNum = Number(argsText);
  if (divNum !== 2 && divNum !== 3 && divNum !== 4) {
    return {
      ok: false,
      error: makeError("invalid_trem_division", modifierIndex),
    };
  }

  return {
    ok: true,
    value: {
      divNum,
    },
  };
}

function parseAbsolutePitchModifier(
  modifierIndex: number,
  argsText: string,
): { ok: true; value: ParsedAbsolutePitch } | { ok: false; error: ParseError } {
  if (!isValidIntegerText(argsText)) {
    return {
      ok: false,
      error: makeError("invalid_number", modifierIndex),
    };
  }

  const midiNum = Number(argsText);
  if (!Number.isInteger(midiNum) || midiNum < 0 || midiNum > 127) {
    return {
      ok: false,
      error: makeError("invalid_midi_range", modifierIndex),
    };
  }

  return {
    ok: true,
    value: {
      midiNum,
    },
  };
}

function parseMicroPitchModifier(
  modifierIndex: number,
  argsText: string,
): { ok: true; value: ParsedMicroPitch } | { ok: false; error: ParseError } {
  if (!isValidCentText(argsText)) {
    return {
      ok: false,
      error: makeError("invalid_number", modifierIndex),
    };
  }

  const centNum = Number(argsText);
  if (!isCentValueInRange(centNum)) {
    return {
      ok: false,
      error: makeError(
        "invalid_cent_range",
        modifierIndex,
        `cent must be between ${MIN_CENT_VALUE} and ${MAX_CENT_VALUE}`,
      ),
    };
  }

  return {
    ok: true,
    value: {
      centNum,
    },
  };
}

function parseTupletPositionModifier(
  modifierIndex: number,
  argsText: string,
): { ok: true; value: ParsedTupletPosition } | { ok: false; error: ParseError } {
  if (!isValidIntegerText(argsText)) {
    return {
      ok: false,
      error: makeError("invalid_number", modifierIndex),
    };
  }

  const midiNum = Number(argsText);
  if (!Number.isInteger(midiNum) || midiNum < 0 || midiNum > 127) {
    return {
      ok: false,
      error: makeError("invalid_midi_range", modifierIndex),
    };
  }

  return {
    ok: true,
    value: {
      midiNum,
    },
  };
}

function classifyRemainingModifier(
  rawText: string,
  index: number,
  seenModifiers: Set<NoteModifierName>,
): ParseError {
  const parsed = parseModifierArguments(rawText, index);
  if (!parsed.ok) {
    return parsed.error;
  }

  const name = parsed.name as NoteModifierName | string;
  if (name === "n") {
    return makeError("more_than_expected", index);
  }

  if (!NOTE_MODIFIER_ORDER.includes(name as NoteModifierName)) {
    return makeError("unknown_modifier", index);
  }

  if (seenModifiers.has(name)) {
    return makeError("duplicate_modifier", index);
  }

  return makeError("modifier_order", index);
}

function parseNoteBody(
  rawText: string,
  allowTupletPosition: boolean,
): { ok: true; hold: HoldKind | null; displayText: string; modifiers: ParsedModifiers; position?: ParsedTupletPosition } | { ok: false; error: ParseError } {
  let index = 0;
  let hold: HoldKind | null = null;

  if (rawText[0] === "-" || rawText[0] === "~") {
    hold = rawText[0];
    index += 1;
  }

  const defaultTextResult = scanDefaultText(rawText, index);
  if (!defaultTextResult.ok) {
    return defaultTextResult;
  }

  index = defaultTextResult.nextIndex;
  const modifiers = emptyModifiers();
  const seenModifiers = new Set<NoteModifierName>();

  for (const modifierName of NOTE_MODIFIER_ORDER) {
    if (!rawText.startsWith(`@${modifierName}(`, index)) {
      continue;
    }

    if (modifierName === "g" && seenModifiers.has("g")) {
      return {
        ok: false,
        error: makeError("duplicate_modifier", index),
      };
    }

    const parsed = parseModifierArguments(rawText, index);
    if (!parsed.ok) {
      return parsed;
    }

    switch (modifierName) {
      case "g": {
        const result = parseGlissModifier(rawText, index, parsed.argsText);
        if (!result.ok) {
          return result;
        }
        modifiers.gliss = result.value;
        break;
      }

      case "t": {
        if (hold === "~") {
          return {
            ok: false,
            error: makeError("vib_and_trem", index),
          };
        }

        const result = parseTremModifier(index, parsed.argsText);
        if (!result.ok) {
          return result;
        }
        modifiers.trem = result.value;
        break;
      }

      case "p": {
        const result = parseAbsolutePitchModifier(index, parsed.argsText);
        if (!result.ok) {
          return result;
        }
        modifiers.absolutePitch = result.value;
        break;
      }

      case "m": {
        const result = parseMicroPitchModifier(index, parsed.argsText);
        if (!result.ok) {
          return result;
        }
        modifiers.microPitch = result.value;
        break;
      }
    }

    seenModifiers.add(modifierName);
    index = parsed.nextIndex;
  }

  let position: ParsedTupletPosition | undefined;
  if (allowTupletPosition && rawText.startsWith("@n(", index)) {
    const parsed = parseModifierArguments(rawText, index);
    if (!parsed.ok) {
      return parsed;
    }

    const positionResult = parseTupletPositionModifier(index, parsed.argsText);
    if (!positionResult.ok) {
      return positionResult;
    }

    position = positionResult.value;
    index = parsed.nextIndex;
  }

  if (index < rawText.length) {
    if (rawText[index] === "@") {
      return {
        ok: false,
        error: classifyRemainingModifier(rawText, index, seenModifiers),
      };
    }

    return {
      ok: false,
      error: makeError("more_than_expected", index),
    };
  }

  if (hold === null && defaultTextResult.value.length === 0 && seenModifiers.size === 0) {
    return {
      ok: false,
      error: makeError("empty_note", 0),
    };
  }

  if (allowTupletPosition && position === undefined) {
    return {
      ok: false,
      error: makeError("tuplet_position_required", 0),
    };
  }

  return {
    ok: true,
    hold,
    displayText:
      defaultTextResult.value.length > 0
        ? defaultTextResult.value
        : hold === "-"
          ? "-"
          : "",
    modifiers,
    position,
  };
}

function splitTupletSlots(body: string, bodyStartIndex: number): { ok: true; slots: string[] } | { ok: false; error: ParseError } {
  const slots: string[] = [];
  let current = "";
  let depth = 0;
  let escaped = false;

  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      current += char;
      escaped = true;
      continue;
    }

    if (char === "(") {
      depth += 1;
      current += char;
      continue;
    }

    if (char === ")") {
      if (depth === 0) {
        return {
          ok: false,
          error: makeError("more_than_expected", bodyStartIndex + index),
        };
      }

      depth -= 1;
      current += char;
      continue;
    }

    if (char === "|" && depth === 0) {
      slots.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (escaped) {
    return {
      ok: false,
      error: makeError("invalid_escape", bodyStartIndex + body.length - 1),
    };
  }

  if (depth !== 0) {
    return {
      ok: false,
      error: makeError("unterminated_paren", bodyStartIndex),
    };
  }

  slots.push(current);
  return {
    ok: true,
    slots,
  };
}

function parseTupletSlots(
  rawText: string,
  divNum: number,
  bodyStartIndex: number,
  body: string,
): { ok: true; slots: ParsedPletSlot[] } | { ok: false; error: ParseError } {
  const splitResult = splitTupletSlots(body, bodyStartIndex);
  if (!splitResult.ok) {
    return splitResult;
  }

  if (splitResult.slots.length !== divNum) {
    return {
      ok: false,
      error: makeError("tuplet_slot_count_mismatch", bodyStartIndex),
    };
  }

  const slots: ParsedPletSlot[] = [];

  for (let slotIndex = 0; slotIndex < splitResult.slots.length; slotIndex += 1) {
    const slotText = splitResult.slots[slotIndex];
    const slotStartIndex =
      slotIndex === 0
        ? bodyStartIndex
        : bodyStartIndex +
          splitResult.slots.slice(0, slotIndex).reduce((sum, value) => sum + value.length + 1, 0);

    if (slotText.length === 0) {
      slots.push({
        slotIndex,
        isRest: true,
        note: null,
      });
      continue;
    }

    if (slotText.startsWith("/")) {
      return {
        ok: false,
        error: makeError("tuplet_nested_forbidden", slotStartIndex),
      };
    }

    const noteResult = parseNoteBody(slotText, true);
    if (!noteResult.ok) {
      return {
        ok: false,
        error: {
          ...noteResult.error,
          charIndex:
            noteResult.error.charIndex === null
              ? null
              : slotStartIndex + noteResult.error.charIndex,
        },
      };
    }

    const note: ParsedPletSlotNote = {
      hold: noteResult.hold,
      displayText: noteResult.displayText,
      modifiers: noteResult.modifiers,
      position: noteResult.position!,
    };

    slots.push({
      slotIndex,
      isRest: false,
      note,
    });
  }

  return {
    ok: true,
    slots,
  };
}

function parseMuteCell(rawText: string): ParsedCell {
  const content = rawText.slice(2);
  const unescaped = unescapeText(rawText, 2, content);
  if (!unescaped.ok) {
    return invalidCell(rawText, unescaped.error.code, unescaped.error.charIndex);
  }

  return {
    kind: "mute",
    rawText,
    displayText: unescaped.value,
  };
}

function parseTupletHeadCell(rawText: string): ParsedCell {
  let index = 1;
  while (isDigit(rawText[index])) {
    index += 1;
  }

  const divText = rawText.slice(1, index);
  if (divText.length === 0 || rawText[index] !== "(") {
    return invalidCell(rawText, "invalid_tuplet_division", 1);
  }

  const divNum = Number(divText);
  if (!Number.isInteger(divNum) || divNum < 2) {
    return invalidCell(rawText, "invalid_tuplet_division", 1);
  }

  if (!rawText.endsWith(")")) {
    return invalidCell(rawText, "unterminated_paren", index);
  }

  const bodyStartIndex = index + 1;
  const body = rawText.slice(bodyStartIndex, -1);
  const slotsResult = parseTupletSlots(rawText, divNum, bodyStartIndex, body);
  if (!slotsResult.ok) {
    return invalidCell(
      rawText,
      slotsResult.error.code,
      slotsResult.error.charIndex,
      slotsResult.error.message,
    );
  }

  return {
    kind: "pletHead",
    rawText,
    divNum,
    slots: slotsResult.slots,
  };
}

export const parseNoteCell: ParseNoteCellFn = (input) => {
  const rawText = input.rawText;

  if (rawText.length === 0) {
    return invalidCell(rawText, "empty_note", 0);
  }

  if (rawText.startsWith("//")) {
    return parseMuteCell(rawText);
  }

  if (rawText === "/&") {
    return {
      kind: "pletExtend",
      rawText,
    };
  }

  if (rawText.startsWith("/") && isDigit(rawText[1])) {
    return parseTupletHeadCell(rawText);
  }

  const parsedNote = parseNoteBody(rawText, false);
  if (!parsedNote.ok) {
    return invalidCell(
      rawText,
      parsedNote.error.code,
      parsedNote.error.charIndex,
      parsedNote.error.message,
    );
  }

  return {
    kind: "note",
    rawText,
    hold: parsedNote.hold,
    displayText: parsedNote.displayText,
    modifiers: parsedNote.modifiers,
  };
};
