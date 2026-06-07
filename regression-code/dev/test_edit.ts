import { readFileSync } from "node:fs";

import { resolveTupletHeadPlacementHit } from "../src/app/app_controller";
import { createInitialState } from "../src/app/app_runtime";
import { composeEditRawText } from "../src/app/edit/edit_core";
import type { DefaultNoteEditInput } from "../src/app/edit/edit_default";
import { loadRuntimeDocument } from "../src/core/score/create_runtime_document";

/**
 * 조건이 거짓이면 테스트 실패 상태를 기록한다.
 * - 인수 : condition : 통과 조건
 * - 인수 : message : 실패 시 출력할 메시지
 * - 반환값 : 없음
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(message);
    process.exitCode = 1;
  }
}

/**
 * 기본 edit 입력 상태를 만든다.
 * - 인수 : overrides : 테스트별로 바꿀 입력 필드
 * - 반환값 : Default 영역과 modifier 영역 입력 상태
 */
function createDefaultInput(
  overrides: Partial<DefaultNoteEditInput> = {},
): DefaultNoteEditInput {
  return {
    mode: "custom",
    customText: "",
    autoText: "",
    hold: "",
    gliss: {
      kind: "",
      id: "a",
    },
    tremDivision: "",
    absolutePitch: "",
    microPitch: "",
    ...overrides,
  };
}

const allTokenResult = composeEditRawText({
  kind: "default",
  input: createDefaultInput({
    customText: "C#4",
    hold: "-",
    gliss: {
      kind: "S",
      id: "b",
    },
    tremDivision: "3",
    absolutePitch: "61",
    microPitch: "-12.5",
  }),
});

const escapedResult = composeEditRawText({
  kind: "default",
  input: createDefaultInput({
    customText: "A/B-~",
  }),
});

const commentResult = composeEditRawText({
  kind: "default",
  input: createDefaultInput({
    mode: "comment",
    customText: "memo/@",
  }),
});

const modifierOnlyResult = composeEditRawText({
  kind: "default",
  input: createDefaultInput({
    absolutePitch: "60",
  }),
});

const zeroPitchResult = composeEditRawText({
  kind: "default",
  input: createDefaultInput({
    customText: "C4",
    absolutePitch: "0",
    microPitch: "0.0",
  }),
});

const autoFlatPitchResult = composeEditRawText({
  kind: "default",
  input: createDefaultInput({
    mode: "autoFlat",
    autoText: "Db4+",
    absolutePitch: "61",
    microPitch: "12.5",
  }),
});

const deleteResult = composeEditRawText({
  kind: "default",
  input: createDefaultInput(),
});

const blockedResult = composeEditRawText({
  kind: "default",
  input: createDefaultInput({
    hold: "~",
    tremDivision: "2",
  }),
});

const tupletResult = composeEditRawText({
  kind: "tuplet",
  draft: {
    divNum: 3,
    slots: [
      {
        slotIndex: 0,
        text: "C4@n(60)",
      },
      {
        slotIndex: 1,
        text: "",
      },
      {
        slotIndex: 2,
        text: "-@n(60)",
      },
    ],
    activeSlotIndex: null,
  },
});

const fixtureUrl = new URL("./test_cases/minimal-valid-score.json", import.meta.url);
const jsonText = readFileSync(fixtureUrl, "utf8");
const loadResult = loadRuntimeDocument(jsonText);

assert(
  allTokenResult.kind === "apply" &&
    allTokenResult.rawText === "-C#4@g(b,S)@t(3)@p(61)@m(-12.5)",
  "All note edit tokens should compose in parser canonical order.",
);
assert(
  escapedResult.kind === "apply" &&
    escapedResult.rawText === "A\\/B\\-\\~",
  "Default text reserved characters should be escaped.",
);
assert(
  commentResult.kind === "apply" &&
    commentResult.rawText === "//memo\\/\\@",
  "Comment mode should compose mute cell rawText.",
);
assert(
  modifierOnlyResult.kind === "apply" &&
    modifierOnlyResult.rawText === "@p(60)",
  "Modifier-only note input should be applicable.",
);
assert(
  zeroPitchResult.kind === "apply" &&
    zeroPitchResult.rawText === "C4",
  "Zero absolutePitch and microPitch should not create modifier tokens.",
);
assert(
  autoFlatPitchResult.kind === "apply" &&
    autoFlatPitchResult.rawText === "Db4+@p(61)@m(12.5)",
  "AUTO flat should use generated display text and keep effective pitch modifiers.",
);
assert(deleteResult.kind === "delete", "Empty CUSTOM input without modifiers should delete.");
assert(blockedResult.kind === "blocked", "Vibrato hold and tremolo should be blocked.");
assert(
  tupletResult.kind === "apply" &&
    tupletResult.rawText === "/3(C4@n(60)||-@n(60))",
  "Tuplet draft should compose pletHead rawText.",
);

assert(loadResult.ok, "Runtime document should load for tuplet placement test.");

if (loadResult.ok && tupletResult.kind === "apply") {
  const placementState = createInitialState(loadResult.document);
  const placementResult = resolveTupletHeadPlacementHit(
    placementState,
    {
      rowId: "s1-note-67",
      rowKind: "note",
      col: 12,
    },
    tupletResult.rawText,
  );

  assert(placementResult.kind === "hit", "Tuplet placement should resolve first slot row.");

  if (placementResult.kind === "hit") {
    assert(placementResult.hit.rowId === "s1-note-60", "Tuplet placement hit should use first slot @n row.");
    assert(placementResult.hit.col === 12, "Tuplet placement hit should keep clicked column.");
  }
}

console.log("Edit composer test completed.");
