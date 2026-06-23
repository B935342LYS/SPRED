import { diffAnalyzedEventsById } from "../src/core/analyze/event_diff";
import type { AnalyzedEvent, NoteEvent } from "../src/core/analyze/types";
import { createPartialRebuildPlan } from "../src/orchestration/partial_rebuild/partial_rebuild_plan";
import { applyPartialRenderInputPatch } from "../src/orchestration/partial_rebuild/partial_rebuild_render_patch";
import type { CanvasAnalyzedRenderInput } from "../src/renderer/canvas_types";
import {
  filterVisibleMarkerItems,
  filterVisibleMuteItems,
  filterVisibleNoteItems,
} from "../src/renderer/canvas_visible_range";

/**
 * 테스트 조건이 거짓이면 프로세스를 실패 상태로 만든다.
 * - 인수 : condition : 통과 여부
 * - 인수 : message : 실패 시 출력할 설명
 * - 반환값 : 없음
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(message);
    process.exitCode = 1;
  }
}

const baseNoteEvent: NoteEvent = {
  eventKind: "note",
  eventId: "basic:note:s1-note-60:0",
  trackId: "basic",
  time: {
    startTick: { numerator: 0, denominator: 1 },
    endTick: { numerator: 1, denominator: 1 },
  },
  sourceCells: [{ rowId: "s1-note-60", col: 0 }],
  text: "C4",
  displayTextAnchors: [
    {
      source: { rowId: "s1-note-60", col: 0 },
      time: {
        startTick: { numerator: 0, denominator: 1 },
        endTick: { numerator: 1, denominator: 1 },
      },
      text: "C4",
    },
  ],
  display: { rowId: "s1-note-60", centOffset: 0 },
  sound: { midi: 60, centOffset: 0 },
  effects: [
    {
      time: {
        startTick: { numerator: 0, denominator: 1 },
        endTick: { numerator: 1, denominator: 1 },
      },
      vib: false,
      trem: null,
    },
  ],
  glissAnchors: [],
  tuplet: null,
};

const nextNoteEvent: NoteEvent = {
  ...baseNoteEvent,
  text: "D4",
  displayTextAnchors: [
    {
      ...baseNoteEvent.displayTextAnchors[0],
      text: "D4",
    },
  ],
};
const addedNoteEvent: NoteEvent = {
  ...baseNoteEvent,
  eventId: "basic:note:s1-note-62:1",
  sourceCells: [{ rowId: "s1-note-62", col: 1 }],
  display: { rowId: "s1-note-62", centOffset: 0 },
  sound: { midi: 62, centOffset: 0 },
};
const noteDiff = diffAnalyzedEventsById([baseNoteEvent], [nextNoteEvent, addedNoteEvent]);
const notePlan = createPartialRebuildPlan({
  editKind: "noteCell",
  eventDiff: noteDiff,
});

assert(notePlan.fallback === "none", "Note plan should not require fallback.");
assert(notePlan.renderer.redrawScope === "note", "Note plan should redraw note scope.");
assert(notePlan.renderer.groups.includes("noteItems"), "Note plan should invalidate note items.");
assert(notePlan.renderer.groups.includes("noteMarkers"), "Note plan should invalidate note-derived markers.");
assert(
  notePlan.renderer.dirtyTickRange?.startTick === 0 &&
    notePlan.renderer.dirtyTickRange.endTick === 1,
  "Note plan should expose a dirty tick range for note redraw.",
);
assert(notePlan.audio.scope === "eventSet", "Note plan should allow event-set audio invalidation.");
assert(
  notePlan.audio.changedEventIds.join(",") === "basic:note:s1-note-60:0,basic:note:s1-note-62:1",
  "Note plan should report changed eventIds.",
);

const globalPlan = createPartialRebuildPlan({
  editKind: "globalCell",
  eventDiff: diffAnalyzedEventsById([], []),
});

assert(globalPlan.fallback === "none", "Global plan should not require fallback.");
assert(globalPlan.renderer.redrawScope === "global", "Global plan should redraw global scope.");
assert(
  globalPlan.renderer.groups.join(",") === "globalTextItems,globalMarkers",
  "Global plan should invalidate global text and marker items.",
);
assert(globalPlan.audio.scope === "fullSchedule", "Global timing/dynamics edits should rebuild audio schedule.");

const duplicateDiff = diffAnalyzedEventsById(
  [baseNoteEvent],
  [baseNoteEvent, { ...baseNoteEvent } as AnalyzedEvent],
);
const duplicatePlan = createPartialRebuildPlan({
  editKind: "noteCell",
  eventDiff: duplicateDiff,
});

assert(duplicatePlan.fallback === "fullRuntime", "Duplicate eventId should force full runtime fallback.");
assert(duplicatePlan.renderer.redrawScope === "all", "Duplicate eventId fallback should redraw all dynamic scopes.");

const structurePlan = createPartialRebuildPlan({
  editKind: "structure",
  eventDiff: diffAnalyzedEventsById([], []),
});

assert(structurePlan.fallback === "fullRuntime", "Structure changes should force full runtime fallback.");
assert(structurePlan.renderer.groups.includes("layoutBase"), "Structure changes should invalidate layout/base.");

const previousRenderInput = createRenderInputFixture("C4", "memo", "old-global");
const nextRenderInput = createRenderInputFixture("D4", "memo", "new-global");
previousRenderInput.noteMarkerItems = [
  {
    kind: "glissOrphanAnchor",
    sourceEventId: "basic:note:s1-note-67:9",
    rowId: "s1-note-60",
    centOffset: 0,
    tick: 0,
    role: "start",
    trackId: "basic",
    renderAlpha: 1,
  },
];
nextRenderInput.noteMarkerItems = [
  {
    kind: "gliss",
    sourceEventId: "basic:gliss:a:s1-note-60:0",
    startRowId: "s1-note-60",
    startCentOffset: 0,
    startTick: 0,
    endRowId: "s1-note-60",
    endCentOffset: 0,
    endTick: 1,
    hasTrem: false,
    trackId: "basic",
    renderAlpha: 1,
  },
];
const patchedNoteInput = applyPartialRenderInputPatch(previousRenderInput, nextRenderInput, notePlan);
const patchedGlobalInput = applyPartialRenderInputPatch(previousRenderInput, nextRenderInput, globalPlan);

assert(patchedNoteInput.noteItems[0]?.text === "D4", "Note patch should replace changed note item.");
assert(patchedNoteInput.muteItems[0]?.text === "memo", "Note patch should preserve unchanged mute item.");
assert(
  patchedNoteInput.globalTextItems[0]?.text === "old-global",
  "Note patch should preserve global text items.",
);
assert(
  patchedNoteInput.noteMarkerItems === nextRenderInput.noteMarkerItems &&
    patchedNoteInput.noteMarkerItems[0]?.kind === "gliss",
  "Note patch should replace the full note marker group because orphan gliss state can change through neighboring events.",
);
assert(
  patchedGlobalInput.noteItems[0]?.text === "C4" &&
    patchedGlobalInput.globalTextItems[0]?.text === "new-global",
  "Global patch should preserve note items and replace global text items.",
);

const visibleRange = {
  startTick: 10,
  endTick: 20,
  startX: 210,
  endX: 420,
};
const visibleNoteItems = filterVisibleNoteItems([
  {
    sourceEventId: "before",
    rowId: "s1-note-60",
    displayCentOffset: 0,
    startTick: 0,
    endTick: 4,
    midi: 60,
    text: "A",
    displayShape: "rect",
    displayTextAnchors: [],
    effects: [],
  },
  {
    sourceEventId: "long-overlap",
    rowId: "s1-note-60",
    displayCentOffset: 0,
    startTick: 2,
    endTick: 12,
    midi: 60,
    text: "B",
    displayShape: "rect",
    displayTextAnchors: [],
    effects: [],
  },
  {
    sourceEventId: "inside",
    rowId: "s1-note-60",
    displayCentOffset: 0,
    startTick: 14,
    endTick: 15,
    midi: 60,
    text: "C",
    displayShape: "rect",
    displayTextAnchors: [],
    effects: [],
  },
  {
    sourceEventId: "after",
    rowId: "s1-note-60",
    displayCentOffset: 0,
    startTick: 24,
    endTick: 25,
    midi: 60,
    text: "D",
    displayShape: "rect",
    displayTextAnchors: [],
    effects: [],
  },
], visibleRange);

assert(
  visibleNoteItems.map((item) => item.sourceEventId).join(",") === "long-overlap,inside",
  "Visible note filter should keep overlapping items in original draw order.",
);

const visibleMuteItems = filterVisibleMuteItems([
  {
    sourceEventId: "mute-before",
    rowId: "s1-note-60",
    startTick: 0,
    endTick: 3,
    text: "before",
  },
  {
    sourceEventId: "mute-overlap",
    rowId: "s1-note-60",
    startTick: 9,
    endTick: 11,
    text: "overlap",
  },
  {
    sourceEventId: "mute-after",
    rowId: "s1-note-60",
    startTick: 22,
    endTick: 23,
    text: "after",
  },
], visibleRange);

assert(
  visibleMuteItems.map((item) => item.sourceEventId).join(",") === "mute-overlap",
  "Visible mute filter should use the same indexed overlap rule.",
);

const visibleMarkerItems = filterVisibleMarkerItems([
  { kind: "loopBoundary", tick: 10, role: "start" },
  { kind: "loopBoundary", tick: 20, role: "end" },
  { kind: "loopBoundary", tick: 24, role: "end" },
], visibleRange);

assert(
  visibleMarkerItems.length === 2 &&
    visibleMarkerItems[0]?.kind === "loopBoundary" &&
    visibleMarkerItems[0].role === "start" &&
    visibleMarkerItems[1]?.kind === "loopBoundary" &&
    visibleMarkerItems[1].role === "end",
  "Visible marker filter should include loop boundaries inside the viewport range.",
);

console.log("Partial rebuild plan test completed.");

/**
 * partial render patch 테스트용 renderer 입력을 만든다.
 * - 인수 : noteText : note item 표시 텍스트
 * - 인수 : muteText : mute item 표시 텍스트
 * - 인수 : globalText : global text item 표시 텍스트
 * - 반환값 : CanvasAnalyzedRenderInput
 */
function createRenderInputFixture(
  noteText: string,
  muteText: string,
  globalText: string,
): CanvasAnalyzedRenderInput {
  return {
    rows: [
      { rowId: "global-bpm", kind: "global", label: "BPM", height: 21 },
      { rowId: "s1-note-60", kind: "note", label: "C4", height: 21, midi: 60 },
    ],
    columnCount: 4,
    baseColumnWidthPx: 21,
    noteItems: [
      {
        sourceEventId: "basic:note:s1-note-60:0",
        rowId: "s1-note-60",
        displayCentOffset: 0,
        startTick: 0,
        endTick: 1,
        midi: 60,
        text: noteText,
        displayShape: "rect",
        displayTextAnchors: [],
        effects: [],
        trackId: "basic",
        renderAlpha: 1,
      },
    ],
    muteItems: [
      {
        sourceEventId: "basic:mute:s1-note-60:2",
        rowId: "s1-note-60",
        startTick: 2,
        endTick: 3,
        text: muteText,
        trackId: "basic",
        renderAlpha: 1,
      },
    ],
    globalTextItems: [
      {
        rowId: "global-bpm",
        col: 0,
        text: globalText,
      },
    ],
    globalMarkerItems: [],
    noteMarkerItems: [],
    markerItems: [],
  };
}
