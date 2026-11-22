/** Node와 브라우저 비교가 공유하는 합성 악보와 고정 편집 사례다. */
import type { ScoreFile } from "../src/core/score/types";
import type { ScoreTextEdit } from "../src/core/score/score_text_edit";

/** 원본 상태에 적용할 편집 명령 묶음이다. */
export type BenchmarkEditCase = { name: string; edits: ScoreTextEdit[] };

/**
 * 같은 밀도와 주법 구성의 세 트랙 합성 악보를 만든다.
 * - 인수 : template : 기본 행·트랙 구조
 * - 인수 : columns : 악보 열 수
 * - 반환값 : 실제 곡이 아닌 비교용 ScoreFile
 */
export function makeScore(template: ScoreFile, columns: number): ScoreFile {
  const score = structuredClone(template);
  score.globalLines.columnCount = columns;
  score.globalLines.cells = [
    { rowId: "global-bpm", col: 0, rawText: "120" },
    { rowId: "global-bpb", col: 0, rawText: "4" },
    { rowId: "global-spb", col: 0, rawText: "4" },
    { rowId: "global-dyn", col: 0, rawText: "100" },
  ];
  // 16열마다 gliss, tuplet, hold, vibrato, tremolo를 같은 위치에 생성한다.
  for (const track of score.tracks) {
    track.cells = [];
    for (let col = 0; col + 15 < columns; col += 16) {
      track.cells.push(
        { rowId: "s1-note-60", col, rawText: "C@g(a,S)" },
        { rowId: "s1-note-64", col: col + 2, rawText: "E@g(a,E)" },
        { rowId: "s1-note-60", col: col + 4, rawText: "/3(C@n(60)|D@n(62)|E@n(64))" },
        { rowId: "s1-note-60", col: col + 8, rawText: "C" },
        { rowId: "s1-note-60", col: col + 9, rawText: "-" },
        { rowId: "s1-note-60", col: col + 10, rawText: "~" },
        { rowId: "s1-note-64", col: col + 12, rawText: "E@t(3)" },
      );
    }
  }
  return score;
}

/**
 * 재사용 범위가 다른 고정 편집 사례를 만든다.
 * - 인수 : 없음
 * - 반환값 : 매 실행 원본에서 시작하는 실제 변경 명령
 */
export function makeCases(): BenchmarkEditCase[] {
  const single: ScoreTextEdit = {
    selection: { trackId: "basic", rowId: "s1-note-60", col: 8, rowKind: "note" }, rawText: "C@p(62)",
  };
  return [
    { name: "note-single", edits: [single] },
    { name: "note-batch-32", edits: Array.from({ length: 32 }, (_, col) => ({
      selection: { ...single.selection, rowId: "s1-note-67", col }, rawText: "G",
    })) },
    { name: "note-all-tracks", edits: (["basic", "optional", "extra"] as const).map(trackId => ({
      ...single, selection: { ...single.selection, trackId },
    })) },
    { name: "global-bpm", edits: [{
      selection: { trackId: "basic", rowId: "global-bpm", col: 0, rowKind: "global" }, rawText: "140",
    }] },
  ];
}

