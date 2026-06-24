import { readFileSync } from "node:fs";

import { resolveTupletHeadPlacementHit } from "../src/app/edit/edit_controller";
import { createInitialState } from "../src/app/app_runtime";
import { applyRawTextBatchToScore } from "../src/app/app_runtime";
import {
  applyScoreCellRawTextBatch,
  getScoreTextEditInvalidationKind,
} from "../src/app/edit/edit_apply";
import { composeEditRawText } from "../src/app/edit/edit_core";
import type { DefaultNoteEditInput } from "../src/app/edit/edit_default";
import { normalizeNumberRawInput } from "../src/app/edit/edit_number";
import { composeTupletRawText } from "../src/app/edit/edit_tuplet";
import {
  touchScoreTimestampsForSave,
  touchScoreUpdatedAt,
} from "../src/app/score_timestamp";
import { loadRuntimeDocument } from "../src/core/score/create_runtime_document";
import {
  MAX_CELL_RAW_TEXT_LENGTH,
  MAX_LOCAL_SCORE_JSON_BYTES,
} from "../src/core/score/score_limits";
import { saveScoreToLocalStorage } from "../src/infra/score_local_storage";
import {
  AUTO_HARMONIC_2OCTAVE_ABSOLUTE_PITCH,
  resolveAutoDefaultText,
  resolveAutoHarmonicAbsolutePitch,
  resolveAutoPitchInputs,
} from "../src/app/pitch_label";

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

/**
 * Node 테스트 환경에서 score localStorage가 사용할 mock을 설치한다.
 * - 인수 : 없음
 * - 반환값 : 없음
 */
function installLocalStorageMock(): void {
  const storage = new Map<string, string>();

  globalThis.localStorage = {
    getItem(key: string): string | null {
      return storage.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      storage.set(key, value);
    },
    removeItem(key: string): void {
      storage.delete(key);
    },
    clear(): void {
      storage.clear();
    },
    key(index: number): string | null {
      return Array.from(storage.keys())[index] ?? null;
    },
    get length(): number {
      return storage.size;
    },
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

const glissHoldStartPresetResult = composeEditRawText({
  kind: "default",
  input: createDefaultInput({
    mode: "autoSharp",
    autoText: "C4",
    customText: "ignored",
    hold: "~",
    gliss: {
      kind: "holdStart",
      id: "c",
    },
    tremDivision: "3",
    absolutePitch: "60",
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
const longTupletResult = composeTupletRawText({
  divNum: 7,
  slots: Array.from({ length: 7 }, (_, slotIndex) => ({
    slotIndex,
    text: "x".repeat(30),
  })),
  activeSlotIndex: null,
});

const fixtureUrl = new URL("./test_cases/minimal-valid-score.json", import.meta.url);
const jsonText = readFileSync(fixtureUrl, "utf8");
const loadResult = loadRuntimeDocument(jsonText);

installLocalStorageMock();

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
assert(
  glissHoldStartPresetResult.kind === "apply" &&
    glissHoldStartPresetResult.rawText === "-@g(c,S)",
  "Gliss hold-start preset should ignore Default/Long values and compose -@g(id,S).",
);
assert(deleteResult.kind === "delete", "Empty CUSTOM input without modifiers should delete.");
assert(blockedResult.kind === "blocked", "Vibrato hold and tremolo should be blocked.");
assert(
  tupletResult.kind === "apply" &&
    tupletResult.rawText === "/3(C4@n(60)||-@n(60))",
  "Tuplet draft should compose pletHead rawText.",
);
assert(
  longTupletResult.kind === "notReady",
  "Tuplet draft should reject rawText longer than the cell limit.",
);
assert(
  normalizeNumberRawInput("999") === "999" &&
    normalizeNumberRawInput("1000") === "100" &&
    normalizeNumberRawInput("12a3") === "123",
  "Number raw input should keep only the first three digits.",
);

assert(loadResult.ok, "Runtime document should load for tuplet placement test.");

if (loadResult.ok && tupletResult.kind === "apply") {
  const placementState = createInitialState(loadResult.document);
  const autoHarmonicInput = resolveAutoPitchInputs(
    placementState,
    createDefaultInput({
      mode: "autoSharp",
      absolutePitch: AUTO_HARMONIC_2OCTAVE_ABSOLUTE_PITCH,
    }),
    "s1-note-60",
  );
  const preservedAutoHarmonicInput = resolveAutoDefaultText(
    placementState,
    createDefaultInput({
      mode: "autoSharp",
      absolutePitch: AUTO_HARMONIC_2OCTAVE_ABSOLUTE_PITCH,
    }),
    "s1-note-60",
  );
  const nextRowAutoHarmonicInput = resolveAutoPitchInputs(
    placementState,
    preservedAutoHarmonicInput,
    "s1-note-62",
  );
  const autoHarmonicResult = composeEditRawText({
    kind: "default",
    input: autoHarmonicInput,
  });
  const nextRowAutoHarmonicResult = composeEditRawText({
    kind: "default",
    input: nextRowAutoHarmonicInput,
  });
  const longRawTextApplyResult = applyScoreCellRawTextBatch(loadResult.document.score, [
    {
      selection: {
        trackId: "basic",
        rowId: "s1-note-60",
        rowKind: "note",
        col: 2,
      },
      rawText: "x".repeat(MAX_CELL_RAW_TEXT_LENGTH + 1),
    },
  ]);
  const protectedGlobalDeleteResult = applyScoreCellRawTextBatch(loadResult.document.score, [
    {
      selection: {
        trackId: "basic",
        rowId: "global-bpm",
        rowKind: "global",
        col: 0,
      },
      rawText: "",
    },
  ]);
  const protectedGlobalUpdateResult = applyScoreCellRawTextBatch(loadResult.document.score, [
    {
      selection: {
        trackId: "basic",
        rowId: "global-bpm",
        rowKind: "global",
        col: 0,
      },
      rawText: "140",
    },
  ]);

  assert(
    autoHarmonicResult.kind === "apply" &&
      autoHarmonicResult.rawText === "C6@p(84)",
    "AUTO◇ should resolve selected row MIDI to display and absolutePitch two octaves higher.",
  );
  assert(
    preservedAutoHarmonicInput.absolutePitch === AUTO_HARMONIC_2OCTAVE_ABSOLUTE_PITCH &&
      nextRowAutoHarmonicResult.kind === "apply" &&
      nextRowAutoHarmonicResult.rawText === "D6@p(86)",
    "AUTO◇ state should stay automatic and recalculate when the target note row changes.",
  );
  assert(
    resolveAutoHarmonicAbsolutePitch(103) === "127" &&
      resolveAutoHarmonicAbsolutePitch(104) === null,
    "AUTO◇ should block note rows whose two-octave target exceeds MIDI range.",
  );
  assert(
    !longRawTextApplyResult.ok,
    "Edit apply should reject rawText longer than the cell limit.",
  );
  assert(
    !protectedGlobalDeleteResult.ok,
    "Edit apply should reject deleting global row values at column 0.",
  );
  assert(
    protectedGlobalUpdateResult.ok &&
      protectedGlobalUpdateResult.score.globalLines.cells.some((cell) =>
        cell.rowId === "global-bpm" && cell.col === 0 && cell.rawText === "140"
      ),
    "Edit apply should allow changing global row values at column 0.",
  );

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

  const restFirstPlacementResult = resolveTupletHeadPlacementHit(
    placementState,
    {
      rowId: "s1-note-67",
      rowKind: "note",
      col: 13,
    },
    "/3(|D@n(62)|E@n(64))",
  );

  assert(restFirstPlacementResult.kind === "hit", "Tuplet placement should use the first non-rest slot.");

  if (restFirstPlacementResult.kind === "hit") {
    assert(restFirstPlacementResult.hit.rowId === "s1-note-62", "Rest-first tuplet placement should use slot 2 row.");
    assert(restFirstPlacementResult.hit.col === 13, "Rest-first placement should keep clicked column.");
  }

  const allRestPlacementResult = resolveTupletHeadPlacementHit(
    placementState,
    {
      rowId: "s1-note-67",
      rowKind: "note",
      col: 14,
    },
    "/3(||)",
  );

  assert(allRestPlacementResult.kind === "hit", "All-rest tuplet placement should keep clicked row.");

  if (allRestPlacementResult.kind === "hit") {
    assert(allRestPlacementResult.hit.rowId === "s1-note-67", "All-rest tuplet placement should keep source row.");
    assert(allRestPlacementResult.hit.col === 14, "All-rest placement should keep clicked column.");
  }

  const batchApplyResult = applyScoreCellRawTextBatch(loadResult.document.score, [
    {
      selection: {
        trackId: "basic",
        rowId: "s1-note-60",
        rowKind: "note",
        col: 2,
      },
      rawText: "C4",
    },
    {
      selection: {
        trackId: "basic",
        rowId: "global-bpm",
        rowKind: "global",
        col: 2,
      },
      rawText: "120<",
    },
  ]);

  assert(
    getScoreTextEditInvalidationKind([
      {
        selection: {
          trackId: "basic",
          rowId: "s1-note-60",
          rowKind: "note",
          col: 2,
        },
        rawText: "C4",
      },
    ]) === "noteCell",
    "Note-only edit batch should invalidate note cells.",
  );
  assert(
    getScoreTextEditInvalidationKind([
      {
        selection: {
          trackId: "basic",
          rowId: "global-bpm",
          rowKind: "global",
          col: 2,
        },
        rawText: "120<",
      },
    ]) === "globalCell",
    "Global-only edit batch should invalidate global cells.",
  );
  assert(
    getScoreTextEditInvalidationKind([
      {
        selection: {
          trackId: "basic",
          rowId: "s1-note-60",
          rowKind: "note",
          col: 2,
        },
        rawText: "C4",
      },
      {
        selection: {
          trackId: "basic",
          rowId: "global-bpm",
          rowKind: "global",
          col: 2,
        },
        rawText: "120<",
      },
    ]) === "mixedCell",
    "Mixed edit batch should be classified as the mixed fallback.",
  );

  assert(batchApplyResult.ok, "Batch edit should apply note and global cells together.");

  if (batchApplyResult.ok) {
    const noteCell = batchApplyResult.score.tracks
      .find((track) => track.trackId === "basic")
      ?.cells.find((cell) => cell.rowId === "s1-note-60" && cell.col === 2);
    const globalCell = batchApplyResult.score.globalLines.cells.find(
      (cell) => cell.rowId === "global-bpm" && cell.col === 2,
    );

    assert(noteCell?.rawText === "C4", "Batch edit should upsert note rawText.");
    assert(globalCell?.rawText === "120<", "Batch edit should upsert global rawText.");
    assert(
      batchApplyResult.score.musicData.updatedAt === loadResult.document.score.musicData.updatedAt,
      "Batch edit should preserve musicData.updatedAt until explicit save.",
    );

    const touchedScore = touchScoreUpdatedAt(batchApplyResult.score, "2026-06-13T12:00:00.000Z");

    assert(
      touchedScore.musicData.createdAt === batchApplyResult.score.musicData.createdAt,
      "Explicit save timestamp update should preserve createdAt.",
    );
    assert(
      touchedScore.musicData.updatedAt === "2026-06-13T12:00:00.000Z",
      "Explicit save timestamp update should set updatedAt.",
    );

    const templateSavedScore = touchScoreTimestampsForSave(
      batchApplyResult.score,
      "template",
      "2026-06-13T13:00:00.000Z",
    );
    const loadedSavedScore = touchScoreTimestampsForSave(
      batchApplyResult.score,
      "loaded",
      "2026-06-13T14:00:00.000Z",
    );

    assert(
      templateSavedScore.musicData.createdAt === "2026-06-13T13:00:00.000Z" &&
        templateSavedScore.musicData.updatedAt === "2026-06-13T13:00:00.000Z",
      "Template score save should initialize createdAt and updatedAt together.",
    );
    assert(
      loadedSavedScore.musicData.createdAt === batchApplyResult.score.musicData.createdAt &&
        loadedSavedScore.musicData.updatedAt === "2026-06-13T14:00:00.000Z",
      "Loaded score save should preserve createdAt and update updatedAt.",
    );

    const oversizedLocalScore = {
      ...batchApplyResult.score,
      musicData: {
        ...batchApplyResult.score.musicData,
        comment: "x".repeat(MAX_LOCAL_SCORE_JSON_BYTES),
      },
    };
    let localSaveRejected = false;

    try {
      saveScoreToLocalStorage(oversizedLocalScore);
    } catch {
      localSaveRejected = true;
    }

    assert(localSaveRejected, "Local score save should reject JSON larger than the local limit.");
  }

  const globalOnlyState = applyRawTextBatchToScore(placementState, [
    {
      selection: {
        trackId: "basic",
        rowId: "global-bpm",
        rowKind: "global",
        col: 3,
      },
      rawText: "90",
    },
  ]);

  assert(
    globalOnlyState.analysis.trackResults === placementState.analysis.trackResults,
    "Global-only edit should reuse previous track analysis.",
  );
  assert(
    globalOnlyState.renderInput.noteItems === placementState.renderInput.noteItems &&
      globalOnlyState.renderInput.noteMarkerItems === placementState.renderInput.noteMarkerItems,
    "Global-only edit should reuse note-derived renderer item groups.",
  );
  assert(
    globalOnlyState.renderInput.globalTextItems !== placementState.renderInput.globalTextItems &&
      globalOnlyState.renderInput.globalMarkerItems !== placementState.renderInput.globalMarkerItems,
    "Global-only edit should rebuild global renderer item groups.",
  );

  const optionalOnlyState = applyRawTextBatchToScore(placementState, [
    {
      selection: {
        trackId: "optional",
        rowId: "s1-note-60",
        rowKind: "note",
        col: 4,
      },
      rawText: "C4",
    },
  ]);
  const previousBasicTrackResult = placementState.analysis.trackResults.find(
    (trackResult) => trackResult.trackId === "basic",
  );
  const previousOptionalTrackResult = placementState.analysis.trackResults.find(
    (trackResult) => trackResult.trackId === "optional",
  );
  const nextBasicTrackResult = optionalOnlyState.analysis.trackResults.find(
    (trackResult) => trackResult.trackId === "basic",
  );
  const nextOptionalTrackResult = optionalOnlyState.analysis.trackResults.find(
    (trackResult) => trackResult.trackId === "optional",
  );

  assert(
    optionalOnlyState.analysis.timingTimeline === placementState.analysis.timingTimeline &&
      optionalOnlyState.analysis.dynamicsTimeline === placementState.analysis.dynamicsTimeline,
    "Note-only edit should reuse global timing and dynamics analysis.",
  );
  assert(
    previousBasicTrackResult === nextBasicTrackResult,
    "Note-only edit should reuse unedited track analysis.",
  );
  assert(
    previousOptionalTrackResult !== nextOptionalTrackResult,
    "Note-only edit should rebuild edited track analysis.",
  );
  assert(
    optionalOnlyState.renderInput.globalTextItems === placementState.renderInput.globalTextItems &&
      optionalOnlyState.renderInput.globalMarkerItems === placementState.renderInput.globalMarkerItems,
    "Note-only edit should reuse global renderer item groups.",
  );
  assert(
    optionalOnlyState.renderInput.noteItems.some((item) =>
      item.trackId === "optional" && item.sourceEventId === "optional:note:s1-note-60:4"
    ),
    "Note-only edit should add renderer items for the edited track.",
  );
}

console.log("Edit composer test completed.");
