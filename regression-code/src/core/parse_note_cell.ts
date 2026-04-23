import type {
  ParseNoteCellFn,
  ParsedCell,
  ParsedModifiers,
  ParseErrorCode,
} from "./types/index.ts";

function emptyModifiers(): ParsedModifiers {
  return {
    gliss: null,
    trem: null,
    absolutePitch: null,
    microPitch: null,
  };
}

function invalidCell(rawText: string, code: ParseErrorCode, charIndex: number | null): ParsedCell {
  return {
    kind: "invalid",
    rawText,
    error: {
      code,
      charIndex,
    },
  };
}

function isTupletHeadText(rawText: string): boolean {
  return /^\/\d+\(/.test(rawText);
}

export const parseNoteCell: ParseNoteCellFn = (input) => {
  const rawText = input.rawText;

  if (rawText.length === 0) {
    return invalidCell(rawText, "empty_note", 0);
  }

  if (rawText.startsWith("//")) {
    return {
      kind: "mute",
      rawText,
      displayText: rawText.slice(2),
    };
  }

  if (rawText === "/&") {
    return {
      kind: "pletExtend",
      rawText,
    };
  }

  if (isTupletHeadText(rawText)) {
    const divisionMatch = rawText.match(/^\/(\d+)\((.*)\)$/);
    if (!divisionMatch) {
      return invalidCell(rawText, "unterminated_paren", rawText.length - 1);
    }

    const divNum = Number(divisionMatch[1]);
    if (!Number.isInteger(divNum) || divNum < 2) {
      return invalidCell(rawText, "invalid_tuplet_division", 1);
    }

    return {
      kind: "pletHead",
      rawText,
      divNum,
      slots: [],
    };
  }

  const hold = rawText[0] === "-" || rawText[0] === "~" ? rawText[0] : null;
  const displayText = hold === null ? rawText : rawText.slice(1);

  return {
    kind: "note",
    rawText,
    hold,
    displayText,
    modifiers: emptyModifiers(),
  };
};
