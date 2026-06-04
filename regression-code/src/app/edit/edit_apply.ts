/**
 * edit 결과를 ScoreFile에 적용하는 순수 mutation 경계를 제공한다.
 * parse/analyze/render rebuild는 이 모듈 밖에서 수행한다.
 */

import type {
  RowId,
  ScoreFile,
  TrackId,
} from "../../core/score/types";

/** edit 적용 대상 row 종류. */
export type EditRowKind = "global" | "note" | "gap";

/**
 * score edit 적용 대상 좌표.
 * - 인수 : 없음
 * - 반환값 : track, row, column, row kind를 포함한 좌표
 */
export type ScoreEditSelection = {
  trackId: TrackId;
  rowId: RowId;
  col: number;
  rowKind: EditRowKind;
};

/**
 * ScoreFile edit 적용 결과.
 * - 인수 : 없음
 * - 반환값 : 변경된 ScoreFile 또는 적용 실패 메시지
 */
export type ScoreEditApplyResult =
  | {
      ok: true;
      score: ScoreFile;
      isDelete: boolean;
    }
  | {
      ok: false;
      level: "warning" | "error";
      message: string;
    };

/**
 * ScoreFile JSON 구조를 편집용으로 깊은 복사한다.
 * - 인수 : score : 현재 score JSON
 * - 반환값 : mutation을 적용할 독립 score JSON
 */
export function cloneScoreFile(score: ScoreFile): ScoreFile {
  return JSON.parse(JSON.stringify(score)) as ScoreFile;
}

/**
 * active track의 note cell에 rawText를 upsert하거나 빈 문자열이면 삭제한다.
 * - 인수 : score : 현재 score JSON
 * - 인수 : selection : 사용자가 click한 score 좌표와 track
 * - 인수 : rawText : parser가 읽을 note cell rawText
 * - 반환값 : 변경된 score 또는 적용 실패 결과
 */
export function applyNoteCellRawText(
  score: ScoreFile,
  selection: ScoreEditSelection,
  rawText: string,
): ScoreEditApplyResult {
  if (selection.rowKind !== "note") {
    return {
      ok: false,
      level: "warning",
      message: "Only note rows can be edited in this step.",
    };
  }

  const nextScore = cloneScoreFile(score);
  const track = nextScore.tracks.find(
    (candidate) => candidate.trackId === selection.trackId,
  );

  if (track === undefined) {
    return {
      ok: false,
      level: "error",
      message: `Track not found: ${selection.trackId}`,
    };
  }

  // 같은 좌표의 기존 cell을 제거한 뒤 입력값이 있으면 새 cell 하나를 넣어 중복 좌표를 방지한다.
  const nextCells = track.cells.filter(
    (cell) => !(cell.rowId === selection.rowId && cell.col === selection.col),
  );
  const isDelete = rawText.trim().length === 0;

  if (!isDelete) {
    nextCells.push({
      rowId: selection.rowId,
      col: selection.col,
      rawText,
    });
  }

  // parser/analyzer 순회와 JSON 확인이 안정적이도록 track cell을 col, rowId 순서로 정렬한다.
  track.cells = nextCells.sort(
    (left, right) =>
      left.col - right.col || left.rowId.localeCompare(right.rowId),
  );

  return {
    ok: true,
    score: nextScore,
    isDelete,
  };
}
