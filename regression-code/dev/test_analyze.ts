import { readFileSync } from "node:fs";

import { analyzeDocument } from "../src/core/analyze/analyze_full";
import type { NoteEvent } from "../src/core/analyze/types";
import { buildParsedDocument } from "../src/core/parse/build_parsed_document";
import { loadRuntimeDocument } from "../src/core/score/create_runtime_document";
import type { ScoreFile } from "../src/core/score/types";

const fixtureUrl = new URL("./test_cases/minimal-valid-score.json", import.meta.url);
const jsonText = readFileSync(fixtureUrl, "utf8");
const result = loadRuntimeDocument(jsonText);

/**
 * TimeFraction을 테스트 비교용 number로 바꾼다.
 * - 인수 : value : analyzer 시간 분수
 * - 반환값 : number : numerator / denominator
 */
function tickToNumber(value: { numerator: number; denominator: number }): number {
  return value.numerator / value.denominator;
}

/**
 * analyzer event 목록에서 NoteEvent만 고른다.
 * - 인수 : events : analyzer event 목록
 * - 반환값 : NoteEvent[] : note event만 모은 배열
 */
function getNoteEvents(events: Array<{ eventKind: string }>): NoteEvent[] {
  return events.filter((event): event is NoteEvent => event.eventKind === "note");
}

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
 * score JSON 문자열을 복제 가능한 ScoreFile로 읽는다.
 * - 인수 : sourceText : fixture JSON 문자열
 * - 반환값 : ScoreFile : 테스트에서 수정할 score 객체
 */
function parseFixtureScore(sourceText: string): ScoreFile {
  return JSON.parse(sourceText) as ScoreFile;
}

/**
 * score 객체를 런타임 문서로 로드하고 analyzer를 실행한다.
 * - 인수 : score : 테스트용 score 객체
 * - 반환값 : analyzer 결과와 로드 성공 여부
 */
function analyzeFixtureScore(score: ScoreFile):
  | { ok: true; noteEvents: NoteEvent[] }
  | { ok: false } {
  const modifierResult = loadRuntimeDocument(JSON.stringify(score));

  if (!modifierResult.ok) {
    console.error("Runtime document load failed for modifier score.");
    console.error(modifierResult.error);
    return { ok: false };
  }

  const parsed = buildParsedDocument(modifierResult.document);
  const analysis = analyzeDocument({
    score: modifierResult.document.score,
    indexes: modifierResult.document.indexes,
    parsed,
  });
  const basicTrack = analysis.trackResults.find(
    (track) => track.trackId === "basic",
  );

  return {
    ok: true,
    noteEvents: getNoteEvents(basicTrack?.events ?? []),
  };
}

/**
 * analyzer modifier 연결 동작을 검증한다.
 * - 인수 : sourceText : 기본 fixture JSON 문자열
 * - 반환값 : 없음
 */
function testModifierAnalysis(sourceText: string): void {
  const score = parseFixtureScore(sourceText);
  const basicTrack = score.tracks.find((track) => track.trackId === "basic");

  assert(basicTrack !== undefined, "Missing basic track in modifier fixture.");

  if (basicTrack === undefined) {
    return;
  }

  // 기존 기본 fixture와 충돌하지 않는 높은 col에 modifier 전용 셀을 추가한다.
  basicTrack.cells.push(
    { rowId: "s1-note-52", col: 20, rawText: "P@p(60)@m(100)" },
    { rowId: "s1-note-53", col: 22, rawText: "T@t(3)" },
    { rowId: "s1-note-53", col: 23, rawText: "-" },
    { rowId: "s1-note-53", col: 24, rawText: "~" },
  );

  const modifierAnalysis = analyzeFixtureScore(score);

  assert(modifierAnalysis.ok, "Modifier score should analyze.");

  if (!modifierAnalysis.ok) {
    return;
  }

  const absoluteMicroEvent = modifierAnalysis.noteEvents.find(
    (event) => tickToNumber(event.time.startTick) === 20,
  );
  const tremVibEvent = modifierAnalysis.noteEvents.find(
    (event) => tickToNumber(event.time.startTick) === 22,
  );

  assert(absoluteMicroEvent !== undefined, "Missing @p/@m note event.");
  assert(tremVibEvent !== undefined, "Missing @t/~ note event.");

  if (absoluteMicroEvent !== undefined) {
    assert(absoluteMicroEvent.sound.midi === 60, "@p should override sound midi.");
    assert(absoluteMicroEvent.sound.centOffset === 100, "@m should affect sound cents.");
    assert(
      absoluteMicroEvent.display.rowId === "s1-note-52" &&
        absoluteMicroEvent.display.centOffset === 100,
      "@m should affect display cent offset while keeping source row.",
    );
  }

  if (tremVibEvent !== undefined) {
    assert(
      tickToNumber(tremVibEvent.time.startTick) === 22 &&
        tickToNumber(tremVibEvent.time.endTick) === 25,
      "@t then hold/vib sequence should merge into 22..25.",
    );
    assert(tremVibEvent.effects.length === 3, "Merged @t/~ event should keep 3 effect segments.");
    assert(
      tremVibEvent.effects[0]?.trem?.division === 3,
      "@t should start trem segment with division 3.",
    );
    assert(
      tremVibEvent.effects[1]?.trem?.division === 3,
      "plain hold should continue previous trem segment.",
    );
    assert(
      tremVibEvent.effects[2]?.vib === true &&
        tremVibEvent.effects[2]?.trem === null,
      "~ should create vib segment and stop trem display.",
    );
  }
}

if (!result.ok) {
  console.error("Runtime document load failed.");
  console.error(result.error);
  process.exitCode = 1;
} else {
  const parsed = buildParsedDocument(result.document);
  const analysis = analyzeDocument({
    score: result.document.score,
    indexes: result.document.indexes,
    parsed,
  });
  const basicTrack = analysis.trackResults.find(
    (track) => track.trackId === "basic",
  );
  const optionalTrack = analysis.trackResults.find(
    (track) => track.trackId === "optional",
  );
  const extraTrack = analysis.trackResults.find(
    (track) => track.trackId === "extra",
  );
  const basicNoteEvents = getNoteEvents(basicTrack?.events ?? []);

  console.log("Analyze document completed.");
  console.log(`track results: ${analysis.trackResults.length}`);
  console.log(`basic note events: ${basicNoteEvents.length}`);
  console.log(`timing segments: ${analysis.timingTimeline.length}`);
  console.log(`dynamics segments: ${analysis.dynamicsTimeline.length}`);
  console.log(`issues: ${analysis.analysisIssues.length}`);

  assert(basicTrack !== undefined, "Missing basic track analysis result.");
  assert(optionalTrack !== undefined, "Missing optional track analysis result.");
  assert(extraTrack !== undefined, "Missing extra track analysis result.");
  assert(optionalTrack?.events.length === 0, "Optional track should have no MVP events.");
  assert(extraTrack?.events.length === 0, "Extra track should have no MVP events.");
  assert(basicNoteEvents.length === 6, "Basic track should produce 6 note events.");

  const firstEvent = basicNoteEvents[0];
  const secondEvent = basicNoteEvents[1];
  const thirdEvent = basicNoteEvents[2];
  const fourthEvent = basicNoteEvents[3];

  assert(firstEvent !== undefined, "Missing first note event.");
  assert(secondEvent !== undefined, "Missing second note event.");
  assert(thirdEvent !== undefined, "Missing third note event.");
  assert(fourthEvent !== undefined, "Missing fourth note event.");

  if (
    firstEvent !== undefined &&
    secondEvent !== undefined &&
    thirdEvent !== undefined &&
    fourthEvent !== undefined
  ) {
    assert(
      tickToNumber(firstEvent.time.startTick) === 0 &&
        tickToNumber(firstEvent.time.endTick) === 4,
      "E3 hold sequence should merge into 0..4.",
    );
    assert(firstEvent.sourceCells.length === 4, "E3 merged note should keep 4 source cells.");
    assert(firstEvent.text === "E3", "E3 merged note should keep display text.");
    assert(
      firstEvent.displayTextAnchors.map((anchor) => anchor.text).join(" ") === "E3 - - -",
      "E3 merged note should keep per-anchor display text.",
    );
    assert(
      firstEvent.displayTextAnchors.map((anchor) => tickToNumber(anchor.time.startTick)).join(",") === "0,1,2,3",
      "E3 merged note should keep per-anchor start ticks.",
    );
    assert(firstEvent.sound.midi === 52, "E3 merged note should use MIDI 52.");
    assert(firstEvent.display.rowId === "s1-note-52", "E3 merged note display row mismatch.");

    assert(
      tickToNumber(secondEvent.time.startTick) === 4 &&
        tickToNumber(secondEvent.time.endTick) === 6,
      "First F3 hold sequence should merge into 4..6.",
    );
    assert(secondEvent.sourceCells.length === 2, "First F3 merged note should keep 2 source cells.");

    assert(
      tickToNumber(thirdEvent.time.startTick) === 6 &&
        tickToNumber(thirdEvent.time.endTick) === 8,
      "Second F3 hold sequence should merge into 6..8.",
    );
    assert(thirdEvent.sourceCells.length === 2, "Second F3 merged note should keep 2 source cells.");

    assert(
      tickToNumber(fourthEvent.time.startTick) === 8 &&
        tickToNumber(fourthEvent.time.endTick) === 9,
      "F#3 note should occupy 8..9.",
    );
    assert(fourthEvent.sound.midi === 54, "F#3 note should use MIDI 54.");
  }

  const timing = analysis.timingTimeline[0];
  const dynamics = analysis.dynamicsTimeline[0];

  assert(timing !== undefined, "Missing MVP timing segment.");
  assert(dynamics !== undefined, "Missing MVP dynamics segment.");

  if (timing !== undefined) {
    assert(timing.startBpm === 120, "MVP timing should use BPM 120.");
    assert(timing.endBpm === 120, "MVP timing should keep BPM 120.");
    assert(timing.beatsPerBar === 4, "MVP timing should use beatsPerBar 4.");
    assert(timing.stepsPerBeat === 4, "MVP timing should use stepsPerBeat 4.");
    assert(
      tickToNumber(timing.time.endTick) === result.document.score.globalLines.columnCount,
      "MVP timing should cover the full document length.",
    );
  }

  if (dynamics !== undefined) {
    assert(dynamics.startValue === 100, "MVP dynamics should use value 100.");
    assert(dynamics.endValue === 100, "MVP dynamics should keep value 100.");
  }

  testModifierAnalysis(jsonText);
}
