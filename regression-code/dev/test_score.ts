import { readFileSync } from "node:fs";

import { loadRuntimeDocument } from "../src/core/score/create_runtime_document";

const fixtureUrl = new URL("./test_cases/minimal-valid-score.json", import.meta.url);
const jsonText = readFileSync(fixtureUrl, "utf8");

// score 모듈 전체 로드 경로를 확인하기 위해 JSON -> RuntimeDocument까지 한 번에 실행한다.
const result = loadRuntimeDocument(jsonText);

// 로드 실패는 JSON 파싱, ScoreFile 검증, RuntimeDocument 생성 전 단계의 오류를 그대로 출력한다.
if (!result.ok) {
  console.error("Runtime document load failed.");
  console.error(result.error);
  process.exitCode = 1;
} else {
  // 성공 결과에서 원본 score와 파생 indexes가 같은 문서 기준으로 묶였는지 확인한다.
  const { score, indexes } = result.document;
  const rowCount = score.layout.rowDefinitions.length;
  const trackCount = score.tracks.length;
  const globalCellCount = score.globalLines.cells.length;

  console.log("Runtime document load succeeded.");
  console.log(`title: ${score.musicData.musicTitle}`);
  console.log(`rows: ${rowCount}`);
  console.log(`tracks: ${trackCount}`);
  console.log(`global cells: ${globalCellCount}`);
  console.log(`indexed rows: ${indexes.rowById.size}`);
  console.log(`indexed tracks: ${indexes.trackById.size}`);
  console.log(
    `indexed note rows for s1: ${indexes.noteRowIdsByStringId.get("s1")?.length ?? 0}`,
  );

  // 핵심 인덱스 크기가 원본 배열 크기와 다르면 index builder 단계의 실패로 본다.
  if (
    indexes.rowById.size !== rowCount ||
    indexes.trackById.size !== trackCount ||
    indexes.globalCellMapByCoord.size !== globalCellCount
  ) {
    console.error("Score index build failed.");
    process.exitCode = 1;
  }
}
