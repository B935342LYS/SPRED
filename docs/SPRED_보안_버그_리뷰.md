# SPRED 코드 리뷰 — 버그 및 보안 취약점

대상 저장소: `b935342lys/spredtest` (main 브랜치)
리뷰 범위: 클라이언트 사이드 정적 웹앱. 백엔드·인증·쿠키·비밀값 없음.
검토 일자: 2026-06-23

## 위협 모델

이 앱은 서버가 없는 정적 사이트다. 따라서 현실적인 공격 표면은 단 하나다:

> **피해자가 "공유된" 또는 외부에서 받은 악성 악보 JSON을 로드하는 상황** (Info 다이얼로그에 따르면 악보가 DB/공개 목록으로 공유됨).

이 경계에서 노릴 수 있는 것은 (1) 코드 실행(XSS), (2) 자원 고갈(DoS), (3) 의도치 않은 콘텐츠 로드다. 비밀값·세션이 없으므로 데이터 탈취형 위협은 해당이 적다.

---

## 요약 (심각도순)

| # | 심각도 | 항목 | 위치 |
|---|--------|------|------|
| 1 | **High** | `globalLines.columnCount` 상한 미검증 → DoS | `score_validate.ts` / `canvas_grid_renderer.ts` |
| 2 | **Medium** | 행 개수·행 높이 상한 미검증 → DoS/메모리 | `score_validate.ts` (`validateRowFields`) |
| 3 | Low | 로드된 JSON의 `videoId`가 재검증을 안 거침 | `youtube_binding.ts` |
| 4 | Low | `row.stringId` 참조·`midi` 유일성 미검증 | `score_validate.ts` |
| 5 | Low | 음수/0 `columnCount` 미차단 | `score_validate.ts` |
| 6 | Info | `parseYoutubeVideoId` 패턴이 느슨함(길이 상한 없음) | `youtube_url.ts` |
| 7 | Info | 셀 총개수는 8MB 용량으로만 제한 | `score_limits.ts` |
| 8 | Info | YouTube `loadVideo`의 비동기 오류 처리 경합 | `youtube_player.ts` |

### 긍정적으로 확인된 점 (취약점 아님)

- **XSS 없음.** 검토한 모든 DOM 생성이 `document.createElement` + `textContent`/`option.textContent` 기반이고 `innerHTML`/`insertAdjacentHTML`/`document.write`/`eval`/`new Function` 사용이 없다. 악보 메타데이터(제목·아티스트·코멘트), string 이름, 노트 라벨, 사용자 `rawText` 모두 텍스트 노드 또는 canvas `fillText`로만 렌더링된다.
- **JSON은 `JSON.parse`로만 파싱** — eval류 없음. 코드 주입 불가.
- **YouTube는 공식 IFrame API(`cueVideoById`)** 사용 — iframe `src`/URL을 직접 조립하지 않으므로 `javascript:` 등 URL 주입 불가, 자동재생도 아님.
- **셀 `rawText` 길이 100자 제한**(`MAX_CELL_RAW_TEXT_LENGTH`)으로 셀 단위 파서 작업량이 유계.
- **JSON 로드 8MiB 상한** 존재(`MAX_SCORE_JSON_BYTES`).

---

## 상세

### 1. [High] `globalLines.columnCount` 상한 미검증 → DoS

**위치**
- 검증: `score_validate.ts > validateBasicShapes` — `Number.isInteger(columnCount)`만 확인, 상한·양수 검사 없음.
- 소비: `canvas_grid_renderer.ts > drawScoreGrid` — 세로 격자선 루프
  `for (let column = 0; column <= layout.columnCount; column += 1) { … stroke }`
- 레이아웃: `buildCanvasScoreLayout`이 `stageWidth ≈ columnCount × columnWidth`로 stage/canvas 크기를 산출.

**영향**
악성 악보가 `"columnCount": 2000000000` 같은 값을 넣으면, 로드/렌더 시:
- 격자선 루프가 수십억 번 반복 → 탭 프리징(무한에 가까운 동기 루프).
- canvas 너비 = `columnCount × columnWidth × devicePixelRatio` 로 비현실적 크기 → 메모리 할당 실패/크래시.

8MiB 용량 제한으로도 못 막는다. `columnCount`는 셀이 없어도 되는 단일 정수라서, 수 바이트짜리 악보로도 트리거된다.

**재현**
유효한 최소 악보 JSON에 `globalLines.columnCount`만 큰 값으로 바꿔 로드.

**수정안**
검증 단계에서 상한과 양수를 강제:
```ts
const MAX_COLUMN_COUNT = 100_000; // 정책값
if (!Number.isInteger(cc) || cc < 1 || cc > MAX_COLUMN_COUNT) {
  return invalidShape("columnCount out of range.", "globalLines.columnCount");
}
```
추가로 렌더러에서 화면 밖 컬럼은 그리지 않도록 뷰포트 컬링(이미 note 레이어엔 dynamicViewport가 있으나 base 격자선 루프는 전 구간을 돈다).

---

### 2. [Medium] 행 개수·행 높이 상한 미검증 → DoS/메모리

**위치** `score_validate.ts > validateRowFields`
```ts
if (!Number.isInteger(row.height) || row.height < 1) { … }  // 상한 없음
```
- `rowDefinitions` 배열 길이 자체에도 상한이 없음.

**영향**
- `row.height`에 `1e9` 같은 값 → `stageHeight`가 거대해져 canvas 할당 크래시. (UI 드래그 리사이즈는 1~500으로 클램프하지만 JSON 직접 입력은 우회.)
- 행 수 무제한 → 매우 긴 레이아웃 + 큰 배열. #1과 곱해지면 효과 증폭.

**수정안** 행 높이 상한(예: ≤ 1000), 총 행 수 상한(예: ≤ 4096), 그리고 `stageWidth × stageHeight` 총 픽셀 상한 검사를 추가.

> 참고: 이 미검증 덕에 "128행 초과(다중 string·midi 중복)"가 동작한다. 상한을 두되 합리적으로(수천 행) 설정하면 도트아트 용도는 유지하면서 DoS만 막을 수 있다.

---

### 3. [Low] 로드된 JSON의 `videoId`가 재검증을 안 거침

**위치** `youtube_binding.ts` — `loadSavedVideo()`가 `score.musicData.youtube.videoId`를 그대로 `player.loadVideo(videoId, …)`에 전달. `parseYoutubeVideoId`는 사용자가 입력란에 직접 칠 때(`reloadFromInputs`)만 호출된다.

**영향** 코드 실행은 불가(공식 API가 ID로만 취급). 다만 공유 악보가 임의의 영상 ID를 심어 두면, 피해자가 YouTube를 켤 때 의도치 않은 영상이 로드될 수 있다. 영향 낮음.

**수정안** 로드 시에도 `parseYoutubeVideoId`/`isYoutubeVideoId`로 한 번 정규화·검증.

---

### 4. [Low] `row.stringId` 참조·`midi` 유일성 미검증

**위치** `score_validate.ts > validateRows`, `validateRowFields`
- note 행의 `stringId`가 `instData.strings`에 실제 존재하는지 확인하지 않음.
- 같은 string 안에서 `midi` 중복을 막지 않음(rowId 중복만 막음).

**영향** 보안 위협은 아님. 다만 일관성 없는 레이아웃이 검증을 통과해 레이아웃 다이얼로그의 string 그룹핑 등에서 예기치 않은 표시가 날 수 있다.

**수정안** note 행의 `stringId`가 선언된 string 집합에 속하는지 검사(원하면 midi 유일성도).

---

### 5. [Low] 음수/0 `columnCount` 미차단

`Number.isInteger(-5)`는 통과한다. 셀이 없으면 음수 `columnCount`도 검증을 통과하고, 이후 `cell.col >= columnCount`(항상 참) 등과 결합해 일관성 없는 상태가 된다. #1 수정(양수+상한)으로 함께 해결됨.

---

### 6. [Info] `parseYoutubeVideoId` 패턴이 느슨함

`/^[A-Za-z0-9_-]{6,}$/` — 실제 YouTube ID는 11자인데 6자 이상 무제한을 허용. 기능상 문제는 작지만 길이 상한(예: `{6,64}`)을 두는 게 안전.

### 7. [Info] 셀 총개수 상한 없음

8MiB 용량 안에서도 ~15만+ 셀이 가능해 분석·렌더가 무거워질 수 있다(앱도 "Large scores may lag" 경고). 취약점은 아니나, 셀 개수 상한을 두면 사용성·견고성에 도움.

### 8. [Info] `youtube_player.ts`의 오류 처리 경합

`loadVideo`가 `cueVideoById` 직후 `lastError`를 **동기적으로** 확인하지만, embed 차단(101/150)은 나중에 `onError`로 비동기 도착한다. 따라서 `loadVideo`의 reject로는 안 잡히고 별도 `onBlocked` 경로로만 처리됨 — 로직 냄새. 기능엔 큰 문제 없으나 일관성 검토 권장.

---

## 후속 점검: 분석기(`core/analyze`) · 오디오(`audio`)

추가로 분석기·오디오 경로를 무한루프/자원고갈 관점으로 검토했다.

### 9. [긍정] 분석기 timing은 columnCount에 안전

`analyze_timing.ts`는 컬럼을 1칸씩 도는 게 아니라 값이 바뀌는 **경계 컬럼**(전역 셀 수에 비례)만 순회한다. 분석기 자체는 거대 `columnCount`로 폭발하지 않는다.

### 10. [Medium · 재생 시] 오실레이터 polyphony 상한 없음

**위치** `audio/oscillator_backend.ts`(노트당 oscillator + gain 3~5개 생성), `audio/audio_scheduler.ts`(0.2s 룩어헤드).

룩어헤드 덕에 곡 전체를 한꺼번에 만들진 않지만, **같은 틱에 셀이 수백 개**(도트아트에선 한 컬럼이 행 수만큼 = 수백 개)면 그 셀들이 한 룩어헤드 창에 몰려 **동시에 수백 개 oscillator + 수천 개 GainNode**가 생성된다. 동시 발음(voice) 상한이 없어 재생 시 오디오 엔진 과부하/끊김/크래시 가능. (재생은 사용자 트리거 → #1보다 낮음.)

**수정안** 최대 동시 voice 수 제한(voice stealing) 또는 틱당 발음 수 캡.

### 11. [Medium · 재생 시] tremolo 게이트 루프가 노트 길이에 비례해 무제한

**위치** `oscillator_backend.ts > scheduleTremoloGate`
```ts
const pulseCount = Math.max(1, Math.round(Math.max(1, durationTicks) * Math.max(1, division)));
for (let i = 0; i < pulseCount; i++) { /* AudioParam 이벤트 4개씩 예약 */ }
```
`durationTicks`는 노트의 tick 길이(= 컬럼 폭, `columnCount`에 종속, 상한 없음). 거대 폭 노트에 tremolo가 걸리면 `pulseCount`가 수백만이 되고 한 노트에 수천만 건의 AudioParam 예약 → 그 노트가 스케줄될 때 프리징.

**수정안** `pulseCount` 상한(예: ≤ 4096) 또는 노트 길이 상한.

### 12. [Low · 로드 시] schedule 빌드의 준-2차 비용 + Set 누수

- `buildAudioSchedule`는 **재생 전, 로드/트랙 토글/편집 시에도** 실행된다(`createAppPlaybackRuntime`). 그 안의 `buildGainScaleAutomationForEvent`는 이벤트마다 겹치는 span을 순회 — 긴 노트가 많아 겹침이 크면 O(N²)에 근접해 로드 시 잰크.
- `analyze_track`/schedule 빌드에 `noteEvents.find(...)`를 gliss마다 도는 O(gliss×note) 조회가 있음 — gliss·노트가 많은 적대적 입력에서 저하 가능.
- `audio_scheduler.ts`의 `scheduledKeys` Set은 재생 중 가지치기 없이 증가(긴 재생 시 메모리 증가, 경미).

### 13. [Low] 노트 길이(oscillator 수명) 무제한

거대 컬럼 폭 노트는 `oscillator.stop(endTime+0.02)`의 endTime이 아주 먼 미래 → oscillator가 사실상 영구 재생. 다수면 누적. 역시 `columnCount` 상한으로 함께 완화됨.

## 잔여 모듈 점검 결과 (인덱스 · 편집)

### 14. [긍정] `build_score_indexes.ts` — 안전

전부 셀/행 수에 선형(O(N))인 Map 구성 + 1회 정렬(O(N log N)). 무한 루프·2차 폭발 없음. 로드 시 비용은 셀 수에 비례하며, 셀 수는 8MiB 용량으로 유계.

### 15. [Low · 성능] `edit_apply.ts` — 편집마다 트랙 전체 재정렬

`applyScoreCellRawTextBatch`는 batch의 **편집 1건마다** 해당 트랙 `cells`를 `filter + push + sort`한다(`applyNoteCellRawTextToClonedScore`). 드래그로 한 번에 많은 칸을 칠하면 O(E × M log M)에 근접해 편집 잰크 가능(E=편집 수, M=트랙 셀 수). 보안 문제는 아님. (개선: batch 전체를 Map upsert 후 1회만 정렬.)
- `cloneScoreFile`(전체 deep clone)은 export되어 있으나 batch 경로는 편집 트랙 cell 배열만 얕게 복제하므로 실사용 경로는 효율적.

오케스트레이션 `orchestration/partial_rebuild/*`(편집 시 부분 재빌드 최적화)은 사용자 트리거 경로라 우선순위 낮아 생략. 큰 위협은 아닐 것으로 보임.

## 종합 의견

XSS·코드 주입 측면은 설계가 견고하다(텍스트/canvas 렌더, 공식 YT API, `JSON.parse`). 분석기 timing도 안전하다. **실질적 위험은 "미검증 수치 입력(`columnCount`·행 높이·행 수·노트 길이)으로 인한 클라이언트 자원 고갈"** 한 축으로 모인다.

우선순위:
1. **`columnCount` 상한 검증**(#1) — 로드 즉시 발생하는 가장 큰 DoS. 격자선·박자선(#9 외 sink)·노트 길이까지 한 번에 완화.
2. 행 높이·행 수·총 픽셀 상한(#2).
3. 오디오: 동시 voice 캡(#10)과 tremolo `pulseCount` 캡(#11) — 재생 시 자원 고갈 차단.

이 네 가지 상한 검증만 추가하면 발견된 위험의 대부분이 사라진다. 나머지는 견고성·성능 개선 수준이다.
