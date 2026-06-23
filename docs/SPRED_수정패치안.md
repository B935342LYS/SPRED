# SPRED 수정 패치안 (diff)

리뷰에서 발견한 항목의 최소·수술적 수정안. 행 번호 대신 **파일 + 함수 + 전후 스니펫**으로 표기했다(그대로 적용 가능). 우선순위: **P1 → P5** 순.

> 적용 권장 순서: P1(columnCount) → P2(행 높이·수) → P5(tremolo) → P4(voice 캡) → P3(videoId) → P6(stringId).

---

## P1 · `columnCount` 상한 검증 (#1, High)

가장 큰 위험. 로드 즉시 발생하는 DoS를 차단한다. 격자선·박자선 루프·노트 길이까지 한 번에 완화됨.

### 1-a. `src/core/score/score_limits.ts` — 상수 추가

```diff
 /** Score JSON 파일 로드 최대 UTF-8 byte 수. */
 export const MAX_SCORE_JSON_BYTES = 8 * 1024 * 1024;
+
+/** 악보 전체 열 개수 상한. (렌더러 격자선·박자선 루프 한계) */
+export const MAX_COLUMN_COUNT = 100_000;
```

### 1-b. `src/core/score/score_validate.ts` — `validateBasicShapes`

```diff
-import { MAX_CELL_RAW_TEXT_LENGTH } from "./score_limits";
+import { MAX_CELL_RAW_TEXT_LENGTH, MAX_COLUMN_COUNT } from "./score_limits";
```

```diff
-  // columnCount는 모든 셀 col 범위 검사의 상한으로 사용된다.
-  if (!Number.isInteger(score.globalLines.columnCount)) {
-    return invalidShape(
-      "globalLines.columnCount must be an integer.",
-      "globalLines.columnCount",
-    );
-  }
+  // columnCount는 모든 셀 col 범위 검사의 상한이자 렌더러 격자선 루프 횟수이므로 양수·상한을 강제한다.
+  if (
+    !Number.isInteger(score.globalLines.columnCount) ||
+    score.globalLines.columnCount < 1 ||
+    score.globalLines.columnCount > MAX_COLUMN_COUNT
+  ) {
+    return invalidShape(
+      `globalLines.columnCount must be an integer in 1..${MAX_COLUMN_COUNT}.`,
+      "globalLines.columnCount",
+    );
+  }
```

> 이 한 패치로 #5(음수/0 columnCount)도 함께 해결된다.

---

## P2 · 행 높이·행 개수 상한 (#2, Medium)

### 2-a. `src/core/score/score_limits.ts` — 상수 추가

```diff
 export const MAX_COLUMN_COUNT = 100_000;
+
+/** layout 행 정의 개수 상한. */
+export const MAX_ROW_DEFINITIONS = 4096;
+
+/** 행 1개 높이(px) 상한. (stage 높이 폭주 방지) */
+export const MAX_ROW_HEIGHT = 1000;
```

### 2-b. `src/core/score/score_validate.ts` — `validateRowFields` (높이 상한)

```diff
-import { MAX_CELL_RAW_TEXT_LENGTH, MAX_COLUMN_COUNT } from "./score_limits";
+import {
+  MAX_CELL_RAW_TEXT_LENGTH,
+  MAX_COLUMN_COUNT,
+  MAX_ROW_DEFINITIONS,
+  MAX_ROW_HEIGHT,
+} from "./score_limits";
```

```diff
 function validateRowFields(row: RowDefinition): ScoreValidationError | null {
-  if (!Number.isInteger(row.height) || row.height < 1) {
-    return invalidShape(`Row height must be a positive integer: ${row.rowId}.`, "layout.rowDefinitions");
-  }
+  if (!Number.isInteger(row.height) || row.height < 1 || row.height > MAX_ROW_HEIGHT) {
+    return invalidShape(
+      `Row height must be an integer in 1..${MAX_ROW_HEIGHT}: ${row.rowId}.`,
+      "layout.rowDefinitions",
+    );
+  }
```

### 2-c. `src/core/score/score_validate.ts` — `validateRows` (행 개수 상한)

```diff
 function validateRows(
   rows: RowDefinition[],
 ): … {
   const rowById = new Map<RowId, RowDefinition>();
+
+  if (rows.length > MAX_ROW_DEFINITIONS) {
+    return {
+      ok: false,
+      error: invalidShape(
+        `layout.rowDefinitions must have ${MAX_ROW_DEFINITIONS} or fewer rows.`,
+        "layout.rowDefinitions",
+      ),
+    };
+  }
 
   for (const row of rows) {
```

> 참고: 이 변환기의 "총 행 수"는 최대 512라 4096 상한 안에 충분히 들어온다(도트아트 영향 없음).

---

## P3 · 로드된 `videoId` 재검증 (#3, Low)

### `src/app/youtube/youtube_binding.ts` — `loadSavedVideo`

```diff
   const loadSavedVideo = async (): Promise<boolean> => {
-    const youtube = session.getState().document.score.musicData.youtube;
-
-    if (youtube.videoId.trim().length === 0) {
+    const youtube = session.getState().document.score.musicData.youtube;
+    const safeVideoId = parseYoutubeVideoId(youtube.videoId);   // 로드된 JSON도 정규화·검증
+
+    if (youtube.videoId.trim().length === 0 || safeVideoId === null) {
       setYoutubeModeOff("No video", "error");
       return false;
     }
@@
-      await player.loadVideo(youtube.videoId, youtubeSeconds);
+      await player.loadVideo(safeVideoId, youtubeSeconds);
```

> `parseYoutubeVideoId`는 이미 같은 파일 상단에서 import되어 있다.

---

## P4 · 오실레이터 동시 발음(voice) 캡 (#10, Medium·재생 시)

가장 단순·안전한 방식: 동시 활성 voice가 상한을 넘으면 새 발음을 건너뛴다(스킵). 더 정교하게는 가장 오래된 voice를 stop하는 voice stealing도 가능.

### `src/audio/oscillator_backend.ts`

상수 추가:
```diff
 const TREMOLO_GATE_RAMP_SECONDS = 0.002;
+const MAX_ACTIVE_VOICES = 256;   // 동시 발음 상한
```

세 스케줄 함수(`scheduleNoteEvent`, `scheduleGlissEvent`, `scheduleGlissChainEvent`) **맨 앞**에 가드 추가:
```diff
   function scheduleNoteEvent(
     event: AudioNoteScheduleEvent,
     offsetSeconds: number,
   ): void {
+    if (activeNodes.size >= MAX_ACTIVE_VOICES) {
+      return;   // 동시 발음 폭주 시 추가 발음 생략(자원 고갈 방지)
+    }
     const audioContext = getOrCreateAudioContext();
```
(같은 2줄 가드를 `scheduleGlissEvent`, `scheduleGlissChainEvent` 시작에도 추가.)

> 선택: 스킵 대신 voice stealing을 원하면, `activeNodes`에서 가장 먼저 추가된 노드를 `cleanupActiveNode` 후 진행하도록 바꾸면 된다(Set는 삽입 순서를 보존).

---

## P5 · tremolo 게이트 펄스 수 상한 (#11, Medium·재생 시)

긴 노트 + tremolo가 만드는 수백만 펄스 루프를 차단한다.

### `src/audio/oscillator_backend.ts`

상수 추가:
```diff
+const MAX_TREMOLO_PULSES = 2048;   // tremolo 펄스 루프 상한
```

`scheduleTremoloGate`:
```diff
-  const pulseCount = Math.max(
-    1,
-    Math.round(Math.max(1, durationTicks) * Math.max(1, division)),
-  );
+  const pulseCount = Math.min(
+    MAX_TREMOLO_PULSES,
+    Math.max(1, Math.round(Math.max(1, durationTicks) * Math.max(1, division))),
+  );
```

> P1(columnCount 상한)이 적용되면 `durationTicks` 자체가 ≤ 100,000으로 제한되지만, 이 캡은 분할 수까지 곱해진 펄스 수를 직접 막는 방어선이다.

---

## P6 · 행 `stringId` 참조 검증 (#4, Low · 견고성)

note 행의 `stringId`가 선언된 string 집합에 속하는지 확인.

### `src/core/score/score_validate.ts` — `validateScoreFile` 흐름에 추가

`validateRows` 통과 직후, `instData.strings`의 stringId 집합과 대조:
```diff
   const rowValidation = validateRows(scoreFile.layout.rowDefinitions);
   if (!rowValidation.ok) {
     return { ok: false, error: rowValidation.error };
   }
+
+  const stringIdError = validateNoteRowStringIds(scoreFile);
+  if (stringIdError) {
+    return { ok: false, error: stringIdError };
+  }
```

함수 추가:
```ts
function validateNoteRowStringIds(score: ScoreFile): ScoreValidationError | null {
  const stringIds = new Set(score.instData.strings.map((s) => s.stringId));
  for (const row of score.layout.rowDefinitions) {
    if (row.type === "note" && !stringIds.has(row.stringId)) {
      return invalidShape(
        `Note row references unknown stringId: ${row.rowId}.`,
        "layout.rowDefinitions",
      );
    }
  }
  return null;
}
```

> ⚠️ 주의: 이 변환기가 만드는 다중 string 레이아웃은 `instData.strings`에 s1·s2…를 모두 선언하므로 이 검증을 통과한다. 다만 과거에 만든 "stringId만 다르고 strings 미선언" 파일이 있다면 거부되니, 도입 시 변환기 출력이 strings를 빠짐없이 넣는지 확인할 것(현재 `buildStrings`가 그렇게 함).

---

## (선택) P7 · 편집 성능 — batch 1회 정렬 (#15, Low)

`edit_apply.ts`의 `applyScoreCellRawTextBatch`에서 편집마다 정렬하는 대신, 모든 upsert/delete를 적용한 뒤 트랙별 1회만 정렬하도록 리팩터. 보안과 무관한 성능 개선이라 여유 있을 때 권장.

---

## 적용 후 회귀 점검 권장

- 정상 악보(기본 columnCount 1000, 128행) 로드/재생/편집/저장 정상 동작.
- 이 변환기 출력(최대 512행, 다중 string, 풀컬러 custom 노트) 로드 정상.
- `columnCount: 100001`, `row.height: 1001`, 행 4097개 → **검증 거부** 확인.
- 한 컬럼에 셀 수백 개 → 재생 시 voice 캡으로 끊김/크래시 없이 재생.
- 긴 노트 + tremolo → 재생 시 프리징 없이 처리.
