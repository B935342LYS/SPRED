# Docs Harness

## 1. Purpose

Hub / index / current-state summary for this repository.

## 2. Current Paths

Active implementation root:
- `regression-code/`

Local extension experiment root:
- `regression-code-extend/`
  - ignored by the root repository
  - used for the separate `B935342LYS/SPRED_extend` repository / third-extension experiments

Local deployment staging root:
- `regression-code-test-publish/`
  - ignored by the root repository
  - used for GitHub Pages user-test deployment through `B935342LYS/spredtest`
  - sync stable implementation changes here when updating the deployed test build

Local report commentary root:
- `regression-code-report-commentary-2026-10-15/`
  - current active implementation copied for a new commentary pass
  - commentary style is fixed in `docs/4.1-code-commentary-guide.md`: simplified declaration JSDoc plus detailed internal/field `//` comments
  - 2026-10-15 current task completed the guide only; code commentary has not started, and the next user-specified scope determines where to begin
  - copy prepared only; previous commentary completion status does not carry over
- `regression-code-report-commentary/`
  - ignored by the root repository
  - copied from `regression-code/` for report-writing explanation comments
  - used only for dense code-reading comments, not for active product fixes

Archived implementation roots:
- `0. 이세계 코드 (legacy)/`
- `1. 개발문서/`
- `regression-code-2026-06-19/`

Primary spec roots:
- `docs/1.3-score-json-format.md`
- `docs/1.5-note-cell-parser-spec.md`
- `docs/1.6-global-cell-parser-spec.md`
- `docs/1.7-analyzer-event-list-spec.md`
- `docs/1.8-parser-analyzer-pipeline-spec.md`
- `docs/1.9-mvp-analyzer-renderer-ui-spec.md`
- `docs/2.0-ui-mvp-spec.md`
- `docs/2.1-canvas-renderer-module-spec.md`
- `docs/2.2-ui-state-edit-mode-spec.md`
- `docs/2.3-audio-playback-module-spec.md`
- `docs/2.4-layout-edit-ui-spec.md`
- `docs/2.5-layout-preset-format-spec.md`
- `docs/2.6-track-layer-ui-spec.md`
- `docs/2.7-youtube-sync-ui-spec.md`
- `docs/2.8-edit-invalidation-and-partial-rebuild-spec.md`
- `docs/2.9-range-selection-edit-spec.md`
- `docs/2.10-undo-redo-edit-history-spec.md`
- `docs/2.11-example-score-and-manual-support-spec.md`
- `docs/2.12-manual-content-spec.md`
- `docs/3.0-extendplan-game-mode.md`
- `docs/3.1-extension-roadmap.md`
- `docs/3.2-karaoke-game-mode-spec.md`
- `docs/3.3-third-extension-candidate-spec.md`
- `docs/1.0-development-spec.md`

Memo roots:
- `docs/implementation-memo/`

Report writing guide:
- `docs/4.0-second-extension-report-guide.md`

Code commentary guide:
- `docs/4.1-code-commentary-guide.md`
- follow this guide for the new commentary copy; do not inherit the older copy's lower comment density or internal block-comment convention

## 3. Path Roles

`docs/HARNESS.md` : `hub`
- current baseline
- current state
- document operating rules

`AGENTS.md` : `agent-rules`
- agent behavior
- implementation procedure
- verification and conflict rules

`docs/1.0-development-spec.md` : `roadmap`
- long-term development roadmap
- stage goals and implementation direction

`docs/4.0-second-extension-report-guide.md` : `report-guide`
- 2026-06-19 이후 2차 구현 보고서 목차 구조
- 보고서 서술 원칙
- 보고서 원자료와 해설용 코드 스냅샷 사용 기준

`docs/4.1-code-commentary-guide.md` : `commentary-guide`
- 해설용 복사본의 선언 JSDoc·블록 내부 및 객체 필드 `//` 작성 기준
- 10월 3주차 4.2.2절과 10월 2주차 2.1.2절을 기준으로 한 상세 설명 밀도
- 동작 보존·검증·완료 기록 및 다음 대화 재개 절차

`docs/1.3-score-json-format.md` : `spec`
- score storage format

`docs/1.5-note-cell-parser-spec.md` : `spec`
- note parser structures and rules

`docs/1.6-global-cell-parser-spec.md` : `spec`
- global parser structures and rules

`docs/1.7-analyzer-event-list-spec.md` : `spec`
- analyzer result structures

`docs/1.8-parser-analyzer-pipeline-spec.md` : `spec`
- end-to-end runtime interfaces and pipeline boundaries

`docs/1.9-mvp-analyzer-renderer-ui-spec.md` : `spec`
- first analyzer / renderer / UI MVP scope

`docs/2.0-ui-mvp-spec.md` : `spec`
- first UI layout, state, and event-action MVP scope

`docs/2.1-canvas-renderer-module-spec.md` : `spec`
- canvas renderer module structure, layer input boundaries, and layout conversion scope

`docs/2.2-ui-state-edit-mode-spec.md` : `spec`
- UI state structure, edit mode action dispatch, and score mutation flow

`docs/2.3-audio-playback-module-spec.md` : `spec`
- audio generator, playback controller, scheduler, and Web Audio backend module structure

`docs/2.4-layout-edit-ui-spec.md` : `spec`
- layout editor UI, draft edit flow, apply flow, and cell deletion confirmation boundary

`docs/2.5-layout-preset-format-spec.md` : `spec`
- layout preset JSON format shared by Local Save/Load and File Save/Load

`docs/2.6-track-layer-ui-spec.md` : `spec`
- active track UI, inactive track 반투명 renderer 정책, playback filtering, draw order, track overlap 정책

`docs/2.7-youtube-sync-ui-spec.md` : `spec`
- YouTube mode, musicData youtube field usage, iframe player sync, offset/reload policy

`docs/2.8-edit-invalidation-and-partial-rebuild-spec.md` : `spec`
- note/global edit invalidation sets, layer redraw boundaries, partial rebuild staging

`docs/2.9-range-selection-edit-spec.md` : `spec`
- Ctrl + drag range selection, selection overlay, bulk delete, copy/paste policy

`docs/2.10-undo-redo-edit-history-spec.md` : `spec`
- edit history, undo/redo stack, Undo button and keyboard shortcut policy

`docs/2.11-example-score-and-manual-support-spec.md` : `spec`
- example score manifest/provider, lazy score loading, Supabase read-only extension boundary, Manual support, and user-test feedback items

`docs/2.12-manual-content-spec.md` : `spec`
- Manual content outline, writing template, screenshot/video policy, troubleshooting topics, and feedback guide structure

`docs/3.0-extendplan-game-mode.md` : `extension-plan`
- game mode expansion plan

`docs/3.1-extension-roadmap.md` : `extension-plan`
- MVP 이후 확장 후보와 우선순위 정리

`docs/3.2-karaoke-game-mode-spec.md` : `extension-plan`
- 노래방 모드와 게임 모드를 같은 기능으로 보고, 마이크 pitch detection, 판정, 점수, UI 상태를 구체화한 세부 초안

`docs/3.3-third-extension-candidate-spec.md` : `extension-plan`
- 노래방 / practice mode 안정화 이후 검토할 3차 확장 후보, 선행 조건, 포기 기준, 구현 순서 초안

`docs/1.1-project-plan.md` : `reference`
`docs/1.2-master-spec.md` : `reference`
`docs/1.4-note-string-spec.md` : `reference`
`docs/a1.0-open-source-reference-survey.md` : `appendix`
`docs/implementation-memo/` : `memo`
`regression-code/` : `active`
- stable SPRED implementation root for `B935342LYS/SPRED`
- currently kept at the second-extension stable line around commit `21d7d82 구간 연습 지원`

`regression-code-extend/` : `local-extension-copy`
- local-only working copy for higher-risk third-extension experiments such as MIDI import
- root `.gitignore` excludes this folder so top-level `git add .` does not stage extension code into `B935342LYS/SPRED`
- publish this copy through the separate `B935342LYS/SPRED_extend` repository instead of the root `origin`

`regression-code-test-publish/` : `deployment-staging-copy`
- local-only staging copy for GitHub Pages user-test deployment
- remote deployment repository is `B935342LYS/spredtest`
- copy/sync stable `regression-code/` implementation changes here before publishing a new test build
- not part of the main `B935342LYS/SPRED` source repository
- root `.gitignore` excludes this folder so deploy staging files are not committed into the original workspace

`regression-code-report-commentary/` : `report-commentary-copy`
- local-only copy of `regression-code/` for dense explanatory comments used during report preparation
- root `.gitignore` excludes this folder so explanation-only comments are not committed into the active implementation repository
- preserve runtime behavior; do not use this folder for product fixes
- when continuing the commentary work, add Korean operation-level comments in the style of `regression-code-2026-06-19/`
- active `regression-code/` should remain the source of truth for behavior, tests, and deployment

`0. 이세계 코드 (legacy)/` : `archive`
`1. 개발문서/` : `archive`
`regression-code-2026-06-19/` : `interview-reference`
- 2026-06-19 commit snapshot restored for advisor meeting review
- use only for explanation and code-reading practice around renderer, audio, and UI layers
- not the active implementation target
- explanation-only comments may be added more densely in this snapshot
- do not backport explanation-only comments from this snapshot into active `regression-code/` unless explicitly requested

## 4. Current Implementation Baseline

Read in this order for implementation work:

1. `docs/1.8-parser-analyzer-pipeline-spec.md`
2. `docs/1.9-mvp-analyzer-renderer-ui-spec.md`
3. `docs/2.0-ui-mvp-spec.md`
4. `docs/2.2-ui-state-edit-mode-spec.md`
5. `docs/2.1-canvas-renderer-module-spec.md`
6. `docs/2.3-audio-playback-module-spec.md`
7. `docs/2.4-layout-edit-ui-spec.md`
8. `docs/2.5-layout-preset-format-spec.md`
9. `docs/2.6-track-layer-ui-spec.md`
10. `docs/2.7-youtube-sync-ui-spec.md`
11. `docs/2.8-edit-invalidation-and-partial-rebuild-spec.md`
12. `docs/2.9-range-selection-edit-spec.md`
13. `docs/2.10-undo-redo-edit-history-spec.md`
14. `docs/2.11-example-score-and-manual-support-spec.md`
15. `docs/2.12-manual-content-spec.md`
16. `docs/1.5-note-cell-parser-spec.md`
17. `docs/1.6-global-cell-parser-spec.md`
18. `docs/1.7-analyzer-event-list-spec.md`
19. `docs/1.3-score-json-format.md`
20. `docs/1.0-development-spec.md`

Interpretation rules:

- `docs/3.8-viewport-partial-redraw-spec.md`는 미채택 실험/보고서 기록이다. 2026-09-30 코드 복원 후 active 구현 기준에서 제외한다. 기록에 있는 구현·정렬 보완을 자동 재적용하지 않는다. 사용자 결정에 따라 아이템 내부 텍스트/주법별 세분화도 후속 계획에 다시 넣지 않는다.

- runtime types and function signatures follow `1.8` first
- first analyzer / renderer / UI MVP implementation scope follows `1.9` first
- first UI layout, state, and event-action scope follows `2.0` first
- UI state, edit mode action dispatch, and score mutation flow follows `2.2` first
- canvas renderer module structure and layout conversion scope follows `2.1` first
- audio generator, playback controller, scheduler, and Web Audio backend module structure follows `2.3` first
- layout editor UI, draft edit flow, and apply flow follows `2.4` first
- layout preset save/load format follows `2.5` first
- active track UI, inactive track 반투명 renderer 정책, playback filtering, overlap 정책은 `2.6`을 우선한다
- YouTube mode, iframe player sync, offset/reload 정책은 `2.7`을 우선한다
- note/global edit invalidation, layer redraw scope, partial rebuild staging은 `2.8`을 우선한다
- Ctrl + drag 영역 선택, selection overlay, bulk delete/copy/paste 정책은 `2.9`를 우선한다
- undo/redo history, Undo button, keyboard shortcut 정책은 `2.10`을 우선한다
- Examples provider와 Manual 진입점은 `2.11`을 우선하고, Manual의 실제 내용 구조와 작성 양식은 `2.12`를 우선한다
- note parser details follow `1.5` first
- global parser details follow `1.6` first
- analyzer result structures follow `1.7` first
- score storage format follows `1.3` first
- current stage and next work items follow `1.0` first

## 5. Topic Entry Points

Project overview:
- `docs/1.0-development-spec.md`
- `docs/1.1-project-plan.md`
- `docs/1.2-master-spec.md`

Storage:
- `docs/1.3-score-json-format.md`

Note string / parser:
- `docs/1.4-note-string-spec.md`
- `docs/1.5-note-cell-parser-spec.md`

Global string / parser:
- `docs/1.6-global-cell-parser-spec.md`

Analyzer:
- `docs/1.7-analyzer-event-list-spec.md`

Pipeline:
- `docs/1.8-parser-analyzer-pipeline-spec.md`

MVP analyzer / renderer / UI:
- `docs/1.9-mvp-analyzer-renderer-ui-spec.md`

UI MVP:
- `docs/2.0-ui-mvp-spec.md`

UI state / edit mode:
- `docs/2.2-ui-state-edit-mode-spec.md`

Canvas renderer:
- `docs/2.1-canvas-renderer-module-spec.md`

Audio playback:
- `docs/2.3-audio-playback-module-spec.md`

Layout editing:
- `docs/2.4-layout-edit-ui-spec.md`
- `docs/2.5-layout-preset-format-spec.md`

Track layer:
- `docs/2.6-track-layer-ui-spec.md`

YouTube sync:
- `docs/2.7-youtube-sync-ui-spec.md`

Edit invalidation / partial rebuild:
- `docs/3.9-artifact-direct-render-implementation-plan.md` — 구현 해설·검증 기록; eventDiff/plan/patch 제거 완료, artifact 유지 및 병합 순서 보완
- `docs/3.8-viewport-partial-redraw-spec.md` — 미채택 부분 draw 실험/보고서 기록; active 구현 기준 아님
- `docs/2.8-edit-invalidation-and-partial-rebuild-spec.md`

Range selection / bulk edit:
- `docs/2.9-range-selection-edit-spec.md`

Undo / redo:
- `docs/2.10-undo-redo-edit-history-spec.md`

Examples / Manual:
- `docs/2.11-example-score-and-manual-support-spec.md`
- `docs/2.12-manual-content-spec.md`

Extensions:
- `docs/3.0-extendplan-game-mode.md`
- `docs/3.1-extension-roadmap.md`
- `docs/3.2-karaoke-game-mode-spec.md`
- `docs/3.3-third-extension-candidate-spec.md`

Appendix:
- `docs/a1.0-open-source-reference-survey.md`

## 6. Document Status

`active`
- `1.0-development-spec.md`
- `1.3-score-json-format.md`
- `1.5-note-cell-parser-spec.md`
- `1.6-global-cell-parser-spec.md`
- `1.7-analyzer-event-list-spec.md`
- `1.8-parser-analyzer-pipeline-spec.md`
- `1.9-mvp-analyzer-renderer-ui-spec.md`
- `2.0-ui-mvp-spec.md`
- `2.1-canvas-renderer-module-spec.md`
- `2.2-ui-state-edit-mode-spec.md`
- `2.3-audio-playback-module-spec.md`
- `2.4-layout-edit-ui-spec.md`
- `2.5-layout-preset-format-spec.md`
- `2.6-track-layer-ui-spec.md`
- `2.7-youtube-sync-ui-spec.md`
- `2.8-edit-invalidation-and-partial-rebuild-spec.md`
- `2.9-range-selection-edit-spec.md`
- `2.10-undo-redo-edit-history-spec.md`
- `2.11-example-score-and-manual-support-spec.md`
- `2.12-manual-content-spec.md`

`reference`
- `1.1-project-plan.md`
- `1.2-master-spec.md`
- `1.4-note-string-spec.md`

`appendix`
- `a1.0-open-source-reference-survey.md`

`extension-plan`
- `3.0-extendplan-game-mode.md`
- `3.1-extension-roadmap.md`
- `3.2-karaoke-game-mode-spec.md`
- `3.3-third-extension-candidate-spec.md`

`archive`
- legacy `0.x` text documents
- deleted transitional document formerly numbered `1.6`
- report-only folders such as weekly reports and submission-only materials

## 7. Active Tree Index

`regression-code/`
- `index.html`
- `package.json`
- `package-lock.json`
- `sheet.json`
- `tsconfig.json`
- `dev/`
- `styles/`
  - `app.css`
- `src/core/`
  - `common.types.ts`
  - `index.ts`
  - `score/`
  - `parse/`
  - `analyze/`

## 8. Path Use Rules

Default implementation target:
- `regression-code/`

Separate extension implementation target:
- `regression-code-extend/`
  - use only when explicitly working on `SPRED_extend` / third-extension experiments
  - do not rely on this folder for baseline SPRED implementation work

Open on explicit review request only:
- `docs/implementation-memo/`

Reference only, not current implementation target:
- `0. 이세계 코드 (legacy)/`
- `1. 개발문서/`

If memo content is explicitly adopted by the user for implementation order or structure planning:
- use it as task-local planning guidance
- still resolve rule conflicts in favor of the active specification documents

## 9. Current Working Mode

### 2026-10-15 해설용 주석 작성 가이드 고정 — 코드 주석 미착수

- 사용자 지정 보고서 두 절을 확인하여 `docs/4.1-code-commentary-guide.md`에 작성 기준과 예시를 기록했다. 선언 앞의 간소화된 JSDoc을 유지하고 내부 동작·객체 필드·유니온 각 경우에는 상세한 `//`를 사용한다.
- 기존 해설본의 낮은 설명 밀도 및 내부 `/* ... */` 방식은 새 작업의 기준으로 삼지 않는다. 기존 파일과 완료 기록은 과거 자료로 보존한다.
- 대상은 `regression-code-report-commentary-2026-10-15/`이다. 이번에는 가이드와 탐색 링크만 작성했으며 코드 주석을 추가하지 않았다. 다음 사용자 지시에서 작업 범위를 정한다.

### 2026-10-15 주간보고서 보충 및 새 해설용 복사본 준비

- `1. 개발문서/주간보고서/10월 3주차 보고서.pdf` 16쪽 초안 확인. 3.3.1~3.3.5와 5장 보충 원고 및 원본 수정 참고는 `docs/report-prep/2026-10-15-weekly-report-supplement/`에 준비했다. 원본 PDF와 미완 4.4~4.7은 수정하지 않았다.
- 현재 active에서 `regression-code-report-commentary-2026-10-15/`를 새로 복사하고 원본 hash 목록을 남겼다. 기존 복사본은 참고용이며 새 복사본의 주석 완료 상태를 뜻하지 않는다.
- 이 단계에서는 사용자의 지시에 따라 주석을 시작하지 않고 가이드를 기다렸다. 이후 작성 기준은 위의 4.1 가이드 고정 기록을 따른다. 코드 주석·제품 동작 변경 없음.

### 2026-10-14 배음 감쇠 합성 원인 실험 완료

- 비포화 합성 56개에서 Pitchy·네 CREPE를 비교했다. 전체 음량 감쇠를 맞춰도 기본음 성분만 상대적으로 빨리 줄이면 모두 옥타브 이탈을 보였다. 같은 비율로 감쇠하는 대조군은 기본음을 유지했다.
- 입력 배음 균형 변화가 공통 실패를 만드는 충분조건을 확보했다. 마이크 적응은 필수 설명이 아니며, 실제 음색 변화의 발생 원천은 미확정이다. 제품 교체 보류, 다음 후보는 감쇠·연속성을 이용한 후처리 평가다.
- dev 생성/추론/집계 runner 및 로컬 synthetic-decay-experiment, synthetic-fundamental-decay-experiment에 plan/WAV/hash/JSON/CSV/PNG 저장. 검사와 build 통과, 제품 코드·threshold 변경 없음. 상세 3.6 15절과 2026-10-14-synthetic-decay-review.md.

### 2026-10-14 Pitchy 실패 입력 확보와 A4 반복 CREPE 비교

- 새 other 녹음에서 Pitchy voiced 음정 튐을 재현했다. A4 반복의 발음 끝부분에서 약 490→980Hz 이동, clarity 최대 .970 및 해당 창 PCM 포화 없음이 확인됐다.
- 동일 WAV에 네 CREPE를 적용했으며 부분 개선과 공통 실패가 함께 나타났다. full도 문제를 제거하지 못했고 모델 크기별 단조 개선 없음. 제품 변경 없이 결과를 보존했다.
- 상세 3.6 14절 및 docs/report-prep/implementation-records/2026-10-14-a4-repeat-crepe-comparison.md. 다음은 기본음/배음의 감쇠 속도를 분리한 합성 실험이다.

### 2026-10-14 케이스별 새 녹음과 small·medium 비교 완료

- 사용자 WAV·JSON 7쌍(64.53초) 검증 후 Pitchy/tiny/full/small/medium 비교 완료. 목표음은 의도 정보이며 정답률을 산출하지 않는다.
- small/medium의 낮은 confidence 문제는 일부 줄었지만 gliss 및 F3 반복·지속음에 옥타브 불일치가 남았다. 이번 자료에서는 full의 Pitchy 일치가 대체로 가장 좋고 제품 교체 이점은 아직 미입증이다.
- dev/middle_case_pilot.py 및 compare_middle_cases.py, 로컬 middle-case-experiment의 JSON/CSV/네 모델 PNG를 추가했다. 모델·입력 hash/시간축/RMS 동일성/구문/build 통과. 제품 src/public/package 변경 및 공개 배포 없음.
- 다음: 후보 구간의 독립 음정 검토와 통제 합성 입력. 상세 3.6 13절과 docs/report-prep/implementation-records/2026-10-14-crepe-middle-model-review.md.

### 2026-10-14 새 비교 녹음용 dev PCM recorder 준비

- 과거 3.4의 캡처 기록과 달리 현재 소스/로컬 이력 검색에서 실행 가능한 녹음 도구를 찾지 못해 실험 dev/crepe/recorder.html을 추가했다. 케이스·목표 진행·반복·환경을 입력하고 WAV와 metadata JSON을 저장한다.
- AudioWorklet explicit mono, 실제 AudioContext rate, PCM16, 60초 sample cap, 수동 stop/취소, 늦은 permission 응답 정리, 이전 결과 보존을 구현했다. 서버 전송/제품 연결 없음.
- test:recorder(PCM/60초/flush, Chrome 가상 입력·파일 다운로드·취소·권한 거부), build 통과. 실제 마이크 검증은 사용자 녹음 단계다.
- 실행: 실험 regression-code에서 npm run dev -- --port 5175 --strictPort, /dev/crepe/recorder.html. 보고서 `docs/report-prep/implementation-records/2026-10-14-dev-pcm-recorder.md`. 제품 src/public 변경 없음.

### 2026-10-14 재시작 점검·full 오프라인 대조 완료

- 종료 전 WAV/모델 hash·fixture·JSON 및 tiny Chrome 재실행 검사 통과. 자료 손상 징후 없음. WASM p95 2.4ms 재관측, 제품 파일은 de2e7b2와 동일하다.
- 실험 dev에서 공식 full을 동일 WAV 4개 전체 12,480 frame에 실행했다. full 원시 결과·tiny/Pitchy 대조 CSV·검토 후보 PNG는 실험 report-prep/full-experiment에 있다. full 브라우저 실행은 미수행이다.
- 합성 배음 입력에서 full이 tiny의 일부 옥타브 오류를 줄였지만 440Hz에서는 full만 881.44Hz를 출력했다. 실제 녹음의 정답이 없어 채택 판단은 보류한다. 사용자의 같은 음 반복→gliss 기억과 짧은 옥타브 꺾임은 검토 단서로만 사용하며 보정/자동 정답 분류 없음.
- 후보 탐색 경계 6개·구문·의존성·typecheck 통과. 다음은 통제된 배음/위상/이동 신호 및 실제 녹음 불확실 구간 검토다. 상세 3.6 11절, 로컬 보고서 `docs/report-prep/implementation-records/2026-10-14-crepe-full-offline-review.md`. commit/push/제품 배포 없음.

### 2026-10-14 CREPE tiny dev 변환·첫 실행 검증 완료

- 실험 worktree `D:/SPRED-crepe-pilot`의 `regression-code/dev/crepe/`에 원본 로드·공식 Keras 변환·동일 입력 검사·Chrome WASM/WebGL 측정·전처리 검사·WAV 정렬 도구와 재현 lock/README를 추가했다. 제품 src/public/package는 기준 de2e7b2와 같다.
- tiny float32 변환 1,965,156 bytes, 110 frame 수치 검증 통과. Windows의 불필요한 Decision Forests import 실패는 공식 HDF5 하위 모듈 독립 로딩으로 대응했다(설치 코드/변환 연산 수정 없음).
- 이 PC(Ryzen 7 9800X3D)의 Chrome headless WASM 1 thread median/p95 2.0/2.4ms, WebGL 5.6/15.4ms. 캡처·전처리·판정·UI 제외 dev 값이다. tensor 해제/pageerror 검사·44.1/48kHz 전처리·build/test:game 통과.
- 4 WAV 원본 tiny 전체 출력과 Pitchy 정렬 CSV 생성. 정답 라벨 부재로 품질 개선 판단은 보류한다. 다음은 full 대조와 정답/불확실 구간 정리 후 조건부 WASM 실시간 연결이다. full/마이크/Practice/저전력 장치/배포는 미수행.
- 상세는 3.6 10절과 `docs/report-prep/implementation-records/2026-10-14-crepe-tiny-dev-experiment.md`. 원본 main은 문서만 갱신하며 dev 구현은 실험 branch에 있다. commit/push 없음.

### 2026-10-14 CREPE 실험 worktree 분리와 모델 정적 조사 완료

- `de2e7b2f8e20761cc8ef1b4e429b126d297311e9`에서 `experiment/practice-pitch-detection` branch와 `D:/SPRED-crepe-pilot` worktree를 만들었다. main은 유지했다. 시작 시 미커밋은 하네스뿐이며 제품 개선은 기준 commit에 포함된다.
- WAV/metadata 8개를 복사해 원본 hash와 일치를 확인하고 기존 Pitchy 기준선 도구/결과를 실험 report-prep에 복사했다. 원본/실험 제품 diff 0 확인. 모델과 corpus는 Git 제외 로컬 경로다.
- 원본 CREPE/TF.js demo/onnxcrepe source commit과 라이선스·구조를 확인했다. 원본 tiny HDF5(2,011,144 bytes), ONNX v1.1.0 tiny(1,955,762 bytes)를 받아 SHA-256을 기록했다. 나머지 모델은 크기 metadata만 확인했다.
- 데모의 구형 TF.js/단순 리샘플링 및 ONNX 원본 비교 테스트의 느슨한 허용치를 발견했다. 다음은 원본 tiny 기준 TF.js 변환 재현성 검토, ONNX는 대안이다. runtime 최종 선택·설치·추론·품질 비교는 아직 수행하지 않았다.
- 보고서: `docs/report-prep/implementation-records/2026-10-14-crepe-environment-model-review.md`. 모델 inventory와 조사 도구는 실험 worktree의 `docs/report-prep/crepe-pilot/`에 있다. Python/Node 의존성 설치는 다음 단계이며 이번 제품 build/test 반복·commit·push·배포 없음.

### 2026-10-14 Pitchy 오프라인 기준선 재현 완료

- 확보한 WAV 4개에 현재 제품 pitch runtime을 직접 연결하여 4096샘플/10ms hop 기준선을 생성했다. Pitchy 4.1.0, clarity 0.75, RMS 0.01을 유지하고 과거 layout 미확정으로 제품 null-layout 음역 20–5000Hz를 사용했다.
- 총 12,446 frame 중 7,795 frame이 필터를 통과했다. 정답 라벨이 없어 정확도 수치가 아니다. 원본 hash/header/metadata, 440Hz/무음, 전체 두 번 실행 동등성을 확인했다. RAF/마이크/실시간 지연의 재현과 구분한다.
- 로컬 도구·시계열·요약은 `docs/report-prep/crepe-pilot/`, 보고서는 `docs/report-prep/implementation-records/2026-10-14-pitchy-baseline.md`에 있다. 제품·원본 녹음 변경 및 모델 설치 없음. 다음은 CREPE 개념 해설과 단계 B 구현 계획 검토이며 실험 worktree와 CREPE 실행은 아직 준비 전이다.

### 2026-10-14 CREPE 비교용 기존 녹음 확보

- 사용자 제공 `1. 개발문서/피치테스트/`에서 48kHz mono 16-bit PCM WAV 4개(약 124.78초)와 metadata 및 이전 detector 결과를 확인했다. SHA-256/샘플 수/기본 통계는 로컬 `docs/report-prep/crepe-pilot/2026-10-14-corpus-inventory.json`에 기록했다.
- metadata와 WAV 형식은 일치한다. 원래 track 2채널→저장 mono 변환 규칙과 정답 음정 라벨은 추가 확인 대상이다. 기존 detector·identifiability 결과를 ground truth로 사용하지 않는다.
- 다음은 확보한 동일 WAV의 현재 Pitchy 기준선 재현과 CREPE 실행 검증이다. 모델 설치·실험 worktree 구성·비교 실행은 아직 하지 않았다. 원본 자료는 보존했다.

### 2026-10-14 구조 개선 묶음 마무리·CREPE 실험 준비

- 사용자 채택에 따라 입력 기록 분리까지를 이번 구조 개선 완료 범위로 정리했다. audio schedule/layout 대형 파일 추가 분리, Practice 전체 상태 전이 개편은 이번 주 선행 작업에서 제외하고 재검토 조건을 3.10 28절에 기록했다.
- 다음 작업은 3.4/3.6에 따른 동일 PCM/WAV 기반 Pitchy–CREPE 시범 비교다. Strategy/Adapter는 실제 backend 비교에 필요한 최소 계약으로 구현하며 공개 배포·기본 detector 변경은 별도다.
- 원시 WAV/PCM과 비교 코드의 작업공간 파일명 검색 결과 미발견. 별도 보관 경로를 사용자에게 문의 중이다. 합성 신호로 전후처리를 확인할 수 있지만 실제 악기 품질 결론은 녹음 자료 확보 후 판단한다.
- main의 기존 미커밋 변경을 보존했다. 실험 branch/worktree·모델 설치·새 비교 runner는 아직 준비 전이며, 제품 테스트는 이번 정적 마무리 검토에서 반복하지 않았다.

### 2026-10-14 A7 Practice 입력 기록 분리 완료

- `app/game/game_input_history.ts`가 중복 프레임 확인, onset 후보 생성, 최근 effect frame 보관과 reset을 소유한다. 입력은 GamePitchFrame과 보정된 score time이며 DOM/AppState/오디오 의존은 없다.
- playback binding은 playing 확인·Sync 보정·기록 조회·초기화 시점만 연결한다. 점수/주법 규칙, 카운트다운, UI 확정 순서는 유지했다. pause/resume은 기록을 보존하고 Stop 및 카운트다운 완료 직전에는 초기화한다.
- 3,000단계 기존 코드 대비 목록 동등성, 입력 경계와 판정 연결 검사, Chrome 기록 보존/초기화 및 기존 카운트다운·비동기 검사 통과. test:game/test:audio/test:youtube/build 통과.
- 상세 3.10 27절과 로컬 보고서 `docs/report-prep/implementation-records/2026-10-14-game-input-history.md`. 전체 판정 추출·audio schedule/layout 분리는 이번 작업 범위가 아니다.

### 2026-10-13 A7 playback binding 책임 검토 — 미구현

- 3.10 26절에 상태·자원·호출 순서와 분리 후보를 정리했다. 권장 첫 대상은 Practice 입력 프레임 기록(onset 후보와 최근 effect frame buffer)을 `app/game/game_input_history.ts`로 분리하는 것이다.
- 입력은 GamePitchFrame과 Sync 보정된 score time으로 제한하며 AppState/AppDom·오디오·타이머 소유권은 넘기지 않는다. 판정 규칙·현재 reset/pause 정책과 상수를 보존한다.
- 전체 점수 판정·결과 UI·카운트다운·스크롤 조율은 이번 분리에서 유지한다. audio schedule/layout binding은 예비 확인만 했고 상세 검토 완료가 아니다.
- 제품 수정·테스트 재실행 없음. 기존 10월 10일 미커밋 변경 보존. 다음은 국소 분리안 해설과 범위 합의 후 구현·검증·보고서다.

### 2026-10-10 카운트다운 수명 보완 및 seek 후보 검토

- 보고서 제출 후 구조 개선을 재개했다. Practice 종료·재진입과 Stop 뒤 이전 타이머가 ready를 countdown으로 바꾸는 현상을 Chrome에서 재현했다. 전용 실행 번호와 runtime 확인, 취소 시 비프음 context 정리로 보완했다.
- 종료·재진입/Stop/Sync × 첫 대기/마지막 대기 × 새 실행 전/후의 12개 조건과 새 실행의 재생 준비 진입을 검증했다. seek 막대 input/change는 stopped/paused 상태로 controller에 진입하며 추가 오디오 준비 대기가 없음을 확인했다. seek 지연 충돌은 확정하지 않았고 제품 수정하지 않았다.
- test:audio, test:game, test:youtube, TypeScript 포함 build 통과. 검증은 제어된 타이머 및 장치 대역을 사용하며 실제 장치 청취 검증은 아니다.
- 상세: 3.10 25절, 로컬 보고서 `docs/report-prep/implementation-records/2026-10-10-countdown-lifecycle.md`. 공용 설정 모듈 보류 유지. 대형 파일 일괄 분리는 이번 범위에 포함하지 않는다.

### 2026-10-09 L1–L4 비동기 수명 개선 완료

- 사용자 확정: 파일 읽기 동안 다른 조작 잠금, Examples Escape 취소, Layout 이전 요청 무효화, 폐기된 재생 실패 무시. 상세는 3.10 24절.
- File.text 이전에 busy 진입, 성공/실패 뒤 해제. Examples 목록/악보 요청은 requestId와 AbortController 공유. Layout 파일 요청은 닫기·재개방·새 파일·Reset·슬롯 선택/Load·New Preset에 무효화. 오디오는 controller 세대와 binding runtime/Sync 검사를 적용했다.
- 검증: test:audio(추가 10개 수명 조건), test:examples, test:layout, test:youtube, test:game, 타입 검사 포함 build 통과. Chrome 비동기 회귀 검사 및 기존 Examples 14개/Layout 9개 검사 통과, pageerror 0개. 네트워크·오디오·마이크는 지연 대역이며 실제 서비스/장치 측정이 아니다.
- 보고서: `docs/report-prep/implementation-records/2026-10-09-async-request-lifecycle.md`. 검증 도구/결과는 `docs/review-support/verify-async-lifecycle.cjs`, `async-lifecycle-browser-results.json`.
- 설정 공용화 보류 유지. Practice countdown 재진입과 seek 후속 callback은 추가 재현 후보로 남는다. A7 대형 파일 일괄 분리, 커밋·푸시·배포는 수행하지 않았다.

### 2026-10-09 4단계 비동기 수명 1차 검토 완료·미구현

- 3.10 23절에 File/Examples/Layout 파일 읽기, 재생 준비, Practice 마이크와 countdown, YouTube의 수명 경계를 조사했다. 제품 수정은 하지 않았다.
- 지연 API 대역을 연결한 실제 Chrome에서 이전 File A가 새 B를 덮는 현상, Examples score fetch 중 Escape 이후 busy 유지·응답 적용, 취소한 Layout 파일 읽기의 재개방 draft 덮어쓰기, 폐기된 재생 준비 오류의 새 상태 표시를 관측했다. 이는 실제 네트워크/장치 장애 빈도나 수정 완료 증거가 아니다.
- Practice 종료 후 늦은 microphone stream은 stop됨을 확인했다. 기존 test:audio/test:youtube 통과. countdown의 종료·재진입 경합과 seek callback은 정적 추가 후보이며 이번 재현 완료 범위와 구분한다.
- 다음은 네 발견의 정책/최소 구현안 검토. Examples Escape를 취소로 볼지, 파일 요청 중 중복 입력을 막을지/최신 요청을 우선할지 확정이 필요하다. 거대한 공용 async manager나 대형 파일 일괄 분리는 제안하지 않는다. 도구/결과: review-async-lifecycle.cjs, async-lifecycle-observations.json.

### 2026-10-09 A4/A6 중복 생성·metadata 인덱스 재사용 완료

- **최신 구현:** app_runtime의 전체 렌더 입력은 기존 global/note marker 목록을 새 배열로 병합·공용 정렬한다. Details metadata 수정은 새 score/document를 만들고 기존 indexes를 재사용한다. 상세 3.10 22절. 부분 draw·오디오·timestamp·Details 전체 render 정책은 유지한다.
- **검증:** 보강 test:partial(활성 트랙/정역방향·이전 builder 비교·metadata 후 기존 72단계 편집 복원), test:edit, test:track, test:analyze, 타입 검사 포함 build 통과. Chrome 7개 관측 조건·pageerror 0개.
- **계측:** Node v24.12.0 Windows, 10쌍 워밍업·51회 교대 비교. 9000열/10125셀의 조밀한 gliss·tuplet 합성 악보에서 marker 그룹 계산 중앙값 642.85→318.55ms, metadata helper 1.121→0.0003ms. 후자는 매우 짧은 호출로 정밀한 배율 해석을 피한다. UI·draw·오디오·실사용 개선 수치가 아니다. 원본 runtime-reuse-benchmark.json.
- **기록/다음:** 로컬 보고서 `docs/report-prep/implementation-records/2026-10-09-runtime-artifact-reuse.md`. 기존 미커밋 변경 보존, 이번 커밋·푸시·배포 미수행. 설정 공용화는 보류 유지. 다음은 4단계 비동기 수명 검토의 작은 범위 선정이며 해설부터 진행한다.

### 2026-10-09 설정 공용화 보류·3단계 검토 시작

- 사용자 결정으로 게임 보정 정책 이동과 광범위한 공용 사용자 설정 모듈 도입을 보류한다. 남은 `infra/game_preferences → app/game/game_types` 참조는 인지한 상태로 유지하며 역참조 0개를 목적으로 재개하지 않는다.
- 다음은 3.10의 3단계 중복 연산·재생성 범위다. A4 전체 renderInput의 marker 중복 생성과 A6 Details metadata 인덱스 재생성을 정적으로 재확인했다. 상세는 3.10 21절.
- 현재는 해설/계획 단계이며 제품 변경·성능 측정·테스트 재실행은 하지 않았다. 권장 첫 구현은 A4의 기존 marker 목록 정렬 병합이며, A6는 별도 작은 변경으로 진행한다. 기존 문서·제품 미커밋 변경 보존.

### 2026-10-09 S3 프리셋 공용 계약 분리 완료

- **최신 작업:** 사용자 결정에 따라 신규 파일을 `core/score/layout_preset.ts`에 배치했다. 저장 타입·제한·JSON parse/검증/직렬화를 분리하고, app에는 draft 변환·선택 복원·ID/파일명 생성을 유지했다. 상세는 3.10 20절.
- **동작 유지:** JSON 포맷·실패 조건·슬롯 key/ID·기본 프리셋 복사·손상 슬롯 정리 유지. dialog Load는 draft만, toolbar 선택은 기존 즉시 Apply 경로를 유지한다. 2.4/2.5의 모듈 책임 설명 갱신.
- **검증:** test:layout(왕복 문자열·복사 독립성·선택 복원·손상 슬롯 후속 조회 보강), test:score, 타입 검사 포함 build 통과. Chrome의 실제 Local/File 경로 9개 검사·pageerror 0개. 107개 TS 정적 조사에서 app 외부→app 4→1개, core 상위 의존·실행 import 순환 0개 유지.
- **다음 후보:** 남은 `infra/game_preferences → app/game/game_types`의 보정 기본값·정규화 공용화 검토. 저장 키·정밀도·보정 범위 변경 없이 작은 범위로 진행한다. 전 기능 session 개편과 비동기 수명은 별도 범위다.
- **Git/기록:** 선행 미커밋 작업 보존, 이번 커밋·푸시·배포 미수행. 로컬 보고서는 `docs/report-prep/implementation-records/2026-10-09-layout-preset-contract.md`. 아래 S3 미착수 표기는 이전 상태다.

### 2026-10-09 S2 Examples session 권한 축소 완료

- **최신 작업:** [3.10 19절](3.10-code-structure-review.md#19-s2-examples-session-권한-축소--2026-10-09). Examples에 전체 AppState get/set 대신 Practice 잠금 조회, 로딩 시작, busy 해제·결과 표시, 악보 로드 결과만 전달한다. 상태 확정과 공통 UI 동기화는 main의 전용 session이 담당한다.
- **동작 보존:** 기존 manifest requestId/open/finally, 접근 단어 보관, 악보 로드 pipeline과 dialog 닫기 조건 유지. AppDom 축소와 score fetch 경합 정책 변경은 하지 않았다. 제품 변경은 example_binding.ts와 main.ts에 한정한다.
- **검증:** test:examples, test:edit, test:edit-transaction 15개, 타입 검사 포함 build 통과. 실제 Chrome + 모의 HTTP의 Examples 14개 검사 및 pageerror 0개 확인. 실서비스 Supabase·청감·성능 측정은 미수행. 정적 조사에서 기존 app 외부→app 4개와 실행 import 순환 0개 유지.
- **다음 범위:** S3 프리셋 데이터/검증과 UI draft의 경계 상세 검토. 게임 보정 정책 공용화도 별도 후보다. S2를 모든 기능에 일괄 확대하지 않는다.
- **Git/기록:** HEAD bec32f2와 선행 미커밋 변경 보존. 이번 커밋·푸시·배포 미수행. 작업 보고서는 로컬 `docs/report-prep/implementation-records/2026-10-09-example-session-contract.md`. 아래 인계의 S2 미확정 표기는 이번 작업 이전 상태다.

### 2026-10-09 대화 종료·다음 대화 재개 체크포인트

- **현재 작업:** 2차 구현 이후 책임 분리·캡슐화·모듈화의 단계적 개선. 먼저 설명·검토하고 작은 범위를 구현·검증한 뒤 주간보고서용 기록을 남긴다. 최신 인계는 [3.10 18절](3.10-code-structure-review.md#18-대화-인계-체크포인트--2026-10-09)을 우선한다. 아래 날짜별 기록의 미완료 표기는 당시 상태일 수 있다.
- **완료:** E1~E6 편집/이력/실패 복구/무변경/조회 비용 개선, S1 부분 산출물 입력 축소, 편집 공용 계약 분리. 최신 코드에서는 orchestration → app import가 없다. active 구현은 `regression-code/`이며 설명·배포·확장 사본은 수정 대상이 아니다.
- **다음 기본 범위:** 3.10 14절 S2의 작은 기능 session 계약 상세 검토. Examples는 직접 상태 변경이 busy/status 두 영역이라 첫 후보지만 최종 API는 아직 미확정이다. 프리셋 데이터 경계와 게임 보정 정책 공용화도 남아 있다. 일괄 store 교체나 여러 기능의 동시 개편은 피한다.
- **Git:** 현재 HEAD `bec32f2 E6 구현 및 검증`. 그 이후 S1과 편집 공용 계약의 제품 변경, 기존 명세/검토 문서 변경 및 미추적 조사 도구·결과가 남아 있다. 다음 대화에서 status를 다시 확인하고 기존 변경을 보존한다. 최신 신규 제품 파일 `regression-code/src/core/score/score_text_edit.ts`도 미추적 상태다. 에이전트는 이후 커밋·푸시·배포하지 않았다.
- **최신 검증:** test:edit, test:partial(72단계), test:edit-transaction(15개), 타입 검사 포함 build 통과. 마지막 두 구조 작업에서 성능/브라우저 검사를 재실행하지 않았다. E6 시점의 Chrome 24개 통과와 구분한다.
- **보고서:** `docs/report-prep/implementation-records/`의 작업별 기록 6개가 존재한다. 이 경로는 Git 제외 로컬 자료다. 원본 주간보고서는 변경하지 않았다. 형식 기준은 4.0 9절이다.
- **Change 표시:** 사용자는 VS Code에서 코드 변경이 보이지만 Codex Change에는 보고서만 보인다고 알렸다. Git에서 기존 제품 파일 10개 수정과 신규 공용 파일을 확인했다. Python 파일 수정과 apply_patch 기록 수집 차이가 원인일 가능성은 가설이며 확정된 제품 버그/해결책은 아니다. 앞으로 가능한 한 코드도 apply_patch로 수정하고 실제 git diff/status를 대조한다. UI 표시를 맞추려고 기존 변경을 되돌렸다 다시 적용하지 않는다.

### 2026-10-09 편집 공용 계약 분리 완료

- [3.10 17절](3.10-code-structure-review.md#17-편집-공용-계약-분리--2026-10-09). core/score/score_text_edit.ts로 셀 편집 명령 타입과 영역 분류를 분리하고 모든 소비자가 직접 참조한다. 셀 적용·입력 검증은 app/edit에 유지한다.
- orchestration → app import가 0개가 됐다. 남은 외부→app 선언은 프리셋·게임 보정 정책의 4개이며, core 상위 의존·실행 import 순환은 없다.
- test:edit, test:partial, test:edit-transaction(15개), 타입 검사 포함 build 통과. 성능 개선 주장 없음. 선행 S1 및 기존 미커밋 문서·도구 변경 보존.
- 보고서: `docs/report-prep/implementation-records/2026-10-09-shared-score-edit-contract.md`. 이번 커밋·푸시·배포 미수행. 기능 session 권한과 프리셋/게임 정책 소속 정리는 후속 범위다.


### 2026-10-09 S1 부분 산출물 입력 계약 축소 완료

- [3.10 16절](3.10-code-structure-review.md#16-s1-부분-산출물-입력-계약-축소-구현--2026-10-09). 부분 산출물 생성기에 전체 AppState 대신 previousArtifacts(parsed/analysis/renderInput)·activeTrackIds를 전달한다. nextDocument·edits 및 계산/재사용 정책은 유지한다.
- AppState 역참조 제거. 편집 타입·분류 함수 등 나머지 app 역참조는 후속 범위다. 정적 근거 `module-dependency-review-after-s1.json`에 저장했다.
- test:partial, test:edit, test:edit-transaction(15개), 타입 검사 포함 build 통과. 성능 개선을 주장하지 않으며 이번 브라우저 재검사는 미수행이다.
- 보고서: `docs/report-prep/implementation-records/2026-10-09-partial-artifact-input-contract.md`. 시작 HEAD bec32f2, 이번 커밋·푸시·배포 미수행. 다음 기본 범위는 작은 기능 session 계약 검토다.


### 2026-10-09 2단계 상태 소유권·모듈 계약 검토

- 사용자 요청에 따른 역참조 재확인은 [3.10 15절](3.10-code-structure-review.md#15-상위-계층-역참조-재확인--2026-10-09). 활성 TS 105개 기준 core의 상위 의존과 실행 import 순환은 없지만, orchestration/infra/assets → app의 타입 4개·실행 3개 import 선언이 남아 있다. S1만으로 모든 app 역참조가 해소되지는 않는다.


- [3.10 14절](3.10-code-structure-review.md#14-2단계-상태-소유권모듈-입출력-검토--2026-10-09). 제품 수정 없이 10개 전체 AppState setter session과 88개 직접 setState 호출 지점 및 helper 경로를 조사했다. 정적 집계는 간접 변경과 실제 호출 횟수를 뜻하지 않는다.
- 첫 권장 범위는 partial artifact builder의 AppState 입력을 실제 사용하는 이전 parsed/analysis/renderInput과 activeTrackIds로 좁히는 것이다. 이후 Examples 등 작은 기능의 제한된 session 계약, 프리셋 데이터/저장 경계를 검토한다.
- AppDom 및 전체 setter의 일괄 교체는 권장하지 않는다. async 요청 수명 비대칭은 4단계, metadata 재생성 차이는 3단계 후속으로 분리했다. 모두 제품 미구현 제안이며 앞선 E2/E6 작업을 보존했다.


### 2026-10-09 E6 이력 인덱스 재사용 완료

- [3.10 13절](3.10-code-structure-review.md#13-e6-기존-인덱스-재사용-구현--2026-10-09). 이력 helper는 기존 좌표 Map을 읽고, drag 시작 시 두 Map 참조만 보관하여 종료/취소 시 해제한다. 문자열 patch 저장 계약은 유지한다.
- E2를 공통으로 유지한 Chrome 비교에서 9,000셀의 뒤쪽 1,000셀 편집 22.8→13.1ms, drag 종료 10.0→0.4ms. 단일 셀 편집 일부는 0.2~0.3ms 증가 관측. 전체 결과와 한계는 3.10 및 raw JSON 참조.
- 편집 transaction 15개, 복구 10개, 편집/부분 검사, 타입 검사 포함 build 통과. Node 동등성 25조건, Chrome 회귀 24조건 통과. 제품 변경은 main/edit_history에 한정하고 앞선 E2 작업은 보존했다.
- 보고서: `docs/report-prep/implementation-records/2026-10-09-history-index-reuse.md`. 이번 커밋·푸시·배포 미수행. 다음 범위는 2단계 상태 소유권·모듈 계약 상세 검토다.


### 2026-10-09 E6 이력 조회 검토 완료·제품 미구현

- [3.10 12절](3.10-code-structure-review.md#12-e6-이력-조회-상세-검토--2026-10-09)에 현재 find 반복과 두 대안의 측정을 기록했다. 앞선 E2 작업 변경은 유지했다.
- 큰 뒤쪽 범위에서 기존 runtime 좌표 인덱스 재사용이 유력하다. 매번 Map 생성은 작은 편집을 악화시키므로 권장하지 않는다. 조회 helper 단독 측정이며 전체 앱 개선은 아직 확인하지 않았다.
- 후속 구현은 이력 helper의 좁은 조회 계약, 일반 편집의 기존 전후 인덱스 전달, drag 시작 조회 snapshot 보관으로 한정하는 안이다. 제품 코드는 변경하지 않았으며 설명·검토 단계다.


### 2026-10-09 무변경 편집 생략·성능 비교 완료

- 사용자 백업 `7d758f8` 기준으로 E2의 무변경 편집을 구현·측정했다. 결과를 unchanged로 구분하여 산출물·이력·재생을 유지하고 UI만 반영한다. 기존 출력 오류의 복구는 계속 수행한다.
- 브라우저 교대 측정에서 무변경 명령 87~94% 감소. 변경 작업 일부에서는 0.1~0.4ms 증가도 관측되어 모든 입력의 성능 향상을 주장하지 않는다. 최소 구현은 유지하며 실제 작업에서 불리하면 복원을 고려한다.
- [3.10 11절](3.10-code-structure-review.md#11-e2-무변경-batch-생략-및-비교-측정--2026-10-09), [측정 근거](review-support/noop-performance-summary.md). 편집 transaction 13개, 복구 10개, 기존 편집/부분/오디오 검사 및 타입 검사 포함 build 통과. Chrome 24개 조건 통과.
- 보고서: `docs/report-prep/implementation-records/2026-10-09-noop-edit-measurement.md`. 이번 변경은 로컬 미커밋·미배포. 다음 후보는 E6 이력 lookup 계측이다.


### 2026-10-05 범위 편집 UI·외부 효과 복구 완료

- 사용자 채택 정책에 따라 E4/E5를 구현했다. 상세는 [3.10 10절](3.10-code-structure-review.md#10-단계별-복구범위-편집-ui-확정--2026-10-05). 범위 Delete/Cut/Paste의 선택·clipboard·preview는 편집 성공 시에만 확정한다.
- 확정 후 화면 오류는 재생 중단 후 전체 표시를 한 번 복구한다. 지속 실패 또는 오디오 준비 실패는 새 악보·이력을 유지하고 runtime `outputSyncError`로 Play/Seek/Practice를 차단한다. 다음 편집/Undo/Redo의 전체 표시·오디오 준비 성공 또는 정상 새 악보 로드가 복구 경로다.
- playback 후보 자원 정리와 controller의 대기 중 play 취소를 보완했다. 오디오 schedule/분석/렌더 알고리즘은 유지한다. 명세 2.2/2.3/2.9에 정책을 기록했다.
- typecheck, edit, edit-transaction(9), edit-effects(10), partial, audio, game, youtube, build 통과. Chrome 앱 21개 관측 조건·pageerror 0개 확인. 장애 주입과 실제 장치 청감·외부 영상 검증을 구분한다.
- 보고서: `docs/report-prep/implementation-records/2026-10-05-edit-failure-recovery.md`. 로컬 구현 완료이며 커밋·배포 미수행. 다음 후보는 동일 값 편집 생략/이력 조회 비용 또는 상태 소유권 상세 검토다.

### 2026-10-04 편집 결과·이력 확정 개선 완료

- [3.10 9절](3.10-code-structure-review.md#9-첫-개선-구현-결과--2026-10-04)에 첫 개선 구현과 검증을 기록했다. `app_runtime.ts`의 batch API는 applied/rejected를 반환하고, `main.ts`는 후보 산출물·history 계산 성공 후 상태를 함께 확정한다.
- 실패한 Undo/Redo는 기존 문서·산출물·history·선택을 유지하며 성공 메시지로 덮지 않는다. 실패 시 편집 draw/playback 교체를 생략하고, 성공한 Undo/Redo는 선택을 해제한다. 기존 partial artifact·오디오 내부 알고리즘은 유지한다.
- typecheck, test:edit, test:partial, test:audio, build 및 새 test:edit-transaction 9개 사례 통과. 실제 Chrome 앱 연결 7개 검사와 pageerror 0개 확인. 실패는 장애 주입이며 drag grouping은 session 호출 검사다. 장치 청감 검증은 별도다.
- 로컬 구현 완료이며 커밋·배포는 하지 않았다. 보고서 형식의 작업 기록은 `docs/report-prep/implementation-records/2026-10-04-edit-history-commit.md`에 있다.
- 남은 범위: 동일 값 편집 생략, range binding의 선행 선택/clipboard 변경, history lookup 비용, commit 후 렌더/오디오 실패 복구 정책. 후속 정책이 필요한 항목을 이번에 임의로 확정하지 않았다.

### 2026-10-02 구조 검토 1단계 완료

사용자 요청으로 [3.10 코드 구조 검토](3.10-code-structure-review.md)를 작성해 단계별 작업 기준으로 삼았다. 분류는 `review / task-plan`이며 기존 active 명세를 대체하지 않는다. 전체 정적 모듈 조사와 편집·Undo/Redo의 상태 확정 경계 상세 검토를 완료했고, 제품 코드는 수정하지 않았다.

- 첫 수정 후보는 편집 성공/실패의 명시적 전달과 성공 후 document/artifacts/history 확정이다. 실패한 Undo/Redo의 stack 이동·오류 은폐, 성공 후 selection 해제 불일치를 확인했다.
- 실제 main 함수 본문 추출과 DOM/재생 대역을 사용한 격리 검사 8개로 현재 동작을 관측했다. 실패 반환·UI/렌더 예외 주입은 브라우저 자연 발생 오류 재현과 구분한다. `test:edit`, `test:partial`은 통과했다.
- 검토용 스크립트와 검증 범위는 3.10 7절에 있다. 기존 결함의 관측 assertion 통과를 제품 수정 완료로 해석하지 않는다.
- 후속 순서는 편집 결과·이력 확정 → 상태 소유권·입출력 계약 → 중복 연산·갱신 범위 → 재생/YouTube/Practice의 비동기 수명이다. commit 후 렌더/오디오 실패 복구 정책은 별도 확정이 필요하다.
- 아래 마감 기록의 배포 완료·미채택 실험·기존 검증 제약은 유지한다. 보고서 교정과 폐기한 plan/patch 경로는 자동 재개하지 않는다.

### 2026-10-02 작업 마감 및 다음 대화 재개 지점

사용자는 현재 작업을 한 단락 마무리하고, 다음 작업을 **코드 구조 점검 및 소프트웨어 공학적 개편(캡슐화, 모듈 점검, 패턴 적용 등)**으로 지정했다. 이번 대화에서는 현황 기록만 수행하며 구조 변경에는 착수하지 않는다. 아래 날짜별 설명 중 미착수/미배포 상태는 과거 이력이며 현재 상태는 이 항목을 우선한다.

현재 완료 상태:

- 부분 redraw 실험은 draw 대상 감소에 성공했지만 가상화 환경에서 뚜렷한 시간 개선을 확인하지 못해 미채택했다. `3.8`은 실패 실험/보고서 기록이며 재구현 기준이 아니다.
- 최종 구현은 eventDiff 및 plan/patch 관련 5개 파일을 제거하고 `partial_rebuild_artifacts.ts`의 완성된 입력을 직접 렌더한다. track/global별 산출물 재사용, note/global/all 분기, 가상화와 기존 오디오 전체 갱신은 유지한다. 공용 `canvas_item_order.ts`로 병합 시 전체 builder와 같은 순서를 보장한다.
- 구현 커밋 `6a73f90`, 배포 기록 커밋 `0f13db8`은 SPRED origin/main에 반영되어 있다. spredtest의 배포 커밋은 `318205c`이며 Pages 배포 성공과 공개 페이지 초기 실행을 확인했다. 현황 기록 시작 시 두 저장소 작업 트리는 깨끗했다.
- 사용자가 개발 서버에서 정상 동작을 확인했다. build와 관련 자동 테스트, 브라우저 편집/이력 144단계 및 실제 앱 15개 검사가 통과했다. 상세 조건·측정 한계는 [3.9 9절](3.9-artifact-direct-render-implementation-plan.md#9-구현-결과와-검증-기록-2026-10-01)에 있다.
- `9월 5주차 보고서.pdf` 최신 12쪽을 검토하고 문단별 교체안을 대화에 제시했다. 결과 중심 구성을 유지하면서 renderer 함수 시간과 draw 단독 시간을 구분하고, 합성 이벤트 시험과 실제 artifact 시험의 조건 차이, 오디오 plan 미사용, 최종 단순화 성과를 명시하도록 권장했다. PDF 원본은 에이전트가 수정하지 않았으며 교체안의 최종 반영·제출 여부는 확인하지 않았다. 사용자 요청에 따라 보고서 교정을 자동 재개하지 않는다.

다음 대화의 시작 순서:

1. AGENTS와 이 항목, 현재 Git 상태를 확인한다. 실제 구현은 `regression-code/`를 기준으로 읽고 설명용 사본·배포 사본은 구조 개편 대상으로 삼지 않는다.
2. 관련 active 명세와 실제 코드의 모듈 책임·의존 방향·공개 API·상태 소유권·부수효과 경계를 대조한다. app/orchestration, parser/analyzer, renderer, audio, storage/import/validation 사이의 책임 누출과 결합도를 먼저 점검한다.
3. 발견 사항마다 코드 근거, 실제 유지보수 문제, 최소 변경안, 영향 범위, 검증 방법을 정리하고 우선순위를 제시한다. 아직 특정 모듈의 결함이나 도입할 패턴은 확정하지 않았다.
4. 패턴은 확인된 문제를 해결할 때만 적용한다. 불필요한 추상화·캐시·새 계층을 추가하거나 전역 재설계를 전제하지 않는다. 작은 단위로 기존 동작과 성능을 보존하며 개편한다. 텍스트/주법별 draw 세분화와 폐기한 plan 경로를 다시 도입하지 않는다.

남은 검증·주의 사항:

- `test:view`의 기존 Fit Height/footer 경계 기대값 실패가 남아 있다. 새 구조 변경의 회귀와 구분한다.
- 복원된 개발용 lock에서 `npm ci`의 `@emnapi/wasi-threads` 1.2.2/1.2.3 불일치가 관측되었다. 배포는 별도 lock 및 기존 `npm install` workflow로 성공했다. 환경 재현 문제와 구조 개편을 구분한다.
- 내부 편집 API가 음수 열·미등록 rowId를 항상 거부하는 것은 아니다. 기존 제약이며 UI 방어·검증 책임을 점검할 후보이지 이번 작업에서 수정 완료한 사항이 아니다.
- 추가 실사용·재생 청감 검증은 남아 있다. 자동 테스트 통과를 모든 악보·브라우저의 검증 완료로 해석하지 않는다.
- 보고서 근거와 실험 원본은 로컬 `docs/report-prep/3.8-partial-redraw-review/`에 보존되어 있으며 Git 추적 대상이 아니다. 기존 자료를 삭제하거나 미채택 실험을 현재 구현으로 해석하지 않는다.

### 이전 진행 이력

2026-10-01 배포 완료: 사용자가 개발 서버에서 정상 동작을 확인한 후 배포를 요청했다. 구현 커밋 `6a73f90`은 SPRED origin/main에 반영되어 있으며, 배포 저장소 spredtest의 `318205c`에 동일한 src 106개 파일을 동기화했다. 배포용 build 및 [GitHub Pages 실행 36869395215](https://github.com/B935342LYS/spredtest/actions/runs/36869395215)이 성공했다. 공개 페이지 HTTP 200, Canvas 5개 생성, 브라우저 pageerror 없음과 새 bundle의 plan/patch 호출 제거를 확인했다. 기존 Fit Height 테스트 실패와 추가 실사용·청감 검증 필요성은 유지한다.

2026-10-01 구현 완료: [3.9 구현 결과](3.9-artifact-direct-render-implementation-plan.md#9-구현-결과와-검증-기록-2026-10-01). eventDiff 및 plan/patch 5개 파일을 삭제하고 artifact 직접 렌더로 전환했다. track/global별 산출물 재사용과 가상화를 유지하며 공용 정렬로 통합 marker까지 전체 builder 순서를 보장한다. build 및 관련 테스트 통과, 브라우저 편집/이력 144단계·실제 앱 15개 검사 통과. test:view의 기존 Fit Height 실패는 남아 있다. 성능 대조군과 현재 경로의 측정 범위·한계는 3.9 9절 참조. 다음 확인은 실제 악보와 재생 청감이며 커밋·배포는 하지 않았다. 아래는 이전 진행 이력이다.

2026-10-01 구현 계획 정리: [artifact 직접 렌더 구현 계획 해설](3.9-artifact-direct-render-implementation-plan.md)에 삭제 예정 5개 파일, 유지·이동할 기능, 순서 보완, 검증 절차와 명세 충돌을 정리했다. 사용자 검토용이며 제품 파일 삭제·변경은 아직 실행하지 않았다. 다음 구현은 이 문서의 파일별 조치와 완료 기준을 확인한 뒤 진행한다.

2026-10-01 후속 검토: [artifact 직접 렌더 검토](report-prep/3.8-partial-redraw-review/1.2-artifact-direct-review.md)를 수행했다. eventDiff/plan/patch를 생략하고 정렬 보정한 artifact를 기존 viewport 경로로 그린 결과, 편집 72단계와 앱 연결 12개 검사를 통과했다. 9,000개 실제 노트 산출물의 후속 처리 중앙값은 기존 17.80ms / 직접 경로 0.50ms였다. 범위와 한계는 검토 문서를 따른다. 제품 코드는 아직 변경하지 않았고 제거도 실행하지 않았다.

2026-09-30 재개 지점: 원격 SPRED `origin/main`을 fetch하여 최신 커밋이 로컬 HEAD와 같은 `aac9969546f91715c9d7ab7f4ced079af4f0cd49`임을 확인하고, `regression-code/`의 추적 파일을 해당 커밋과 완전히 일치하도록 복원했다. 신규 실험/검증 파일 9개는 보고서 보관 폴더로 옮겼다. `build`, `test:partial`, `test:edit`, `test:layout`, `test:track` 통과. `npm ci`는 기준 커밋 lock의 `@emnapi/wasi-threads` 1.2.2/1.2.3 불일치로 실패하여 기존 설치 환경에서 검증했으며 lock은 수정하지 않았다. 외부 ZIP과 [보고서 수정 자료](report-prep/3.8-partial-redraw-review/1.0-report-revision-guide.md)는 보존했다. 3.8은 active가 아닌 실패 실험 기록이다. 그리기 순서 보완도 함께 되돌렸으며 다음 독립 검토 대상이다. eventDiff/plan 제거 및 추가 최적화는 하지 않았다. 커밋·배포도 미수행이다.

2026-09-28 우선 작업 당시 기록: `9월 5주차 보고서` 작성을 사용자 결정에 따라 보류하고 [3.8 viewport 내부 부분 재그리기 명세](3.8-viewport-partial-redraw-spec.md)를 최우선 구현 기준으로 삼는다. 현재 eventId 기반 item patch는 구현되어 있으나 viewport 내부의 unchanged 픽셀 보존은 미구현이다. `app_runtime.ts → partial_rebuild_artifacts.ts`의 전체 renderInput 생성은 유지하고 plan 이후에 `partialRenderInput`과 dirty 영역 삭제·복원을 연결한다. 아래 보고서 우선/구현 보류/DB 다음 구현 설명은 이전 시점의 기록이며 이번 작업 순서를 대체하지 않는다.

2026-09-16 현재 `9월 2주차 보고서` 작성 및 제출은 사용자 확인 기준으로 완료되었다. [9월 3주차 DB 확장·CREPE 실험·MIDI 변환 계획](3.5-september-third-week-implementation-plan.md)의 DB 접근 유지 기준(DB-A1~6)이 확정되었으며 다음 구현 대상은 해당 기능이다. 재생 시간 자동 등록은 보류하고 CREPE·MIDI는 후속 논의 대상으로 유지한다. 미결정 제안은 active 명세를 대체하지 않는다. 아래의 이전 구현·보고서·회의 준비 기록은 누적 이력이며, 최신 작업 재개 지점은 10장의 날짜별 현황을 우선한다.

- `regression-code/` is the stable SPRED working root for `B935342LYS/SPRED`
- higher-risk MIDI / audio-to-score import experiments have been split into local `regression-code-extend/` and remote `B935342LYS/SPRED_extend`
- the root `.gitignore` excludes `regression-code-extend/` to prevent accidental staging through top-level `git add .`
- implementation work has started in `regression-code/`
- current work follows the first-stage roadmap in `docs/implementation-memo/1.0-roadmap.md`
- `docs/implementation-memo/` is being used for implementation notes and design commentary
- current focus has moved from additional 2nd-extension implementation to report preparation for the 2026-06-19 이후 2차 구현 work
- `docs/report-prep/` now contains mechanically extracted Codex session logs, git logs, session summaries, a daily timeline, and the first time-sequence + feature-group report outline
- implementation changes are paused unless new real-use test issues are found; near-term work should use the report-prep materials to draft the 2nd-extension report before broad refactoring
- dense report-commentary comments are currently being added to the ignored `regression-code-report-commentary/` copy; active `regression-code/` should not receive these explanation-only comments
- the previous implementation focus moved from track/audio/YouTube stabilization to first user-test deployment follow-up, practice-mode stabilization, Examples / Manual support, and GitHub Pages deployment
- after the latest deployment sync, implementation work is temporarily paused for advisor meeting preparation
- meeting preparation uses `regression-code-2026-06-19/` as a readable historical snapshot because the latest version contains too many follow-up features to explain within the meeting time
- the immediate code-review focus is the 2026-06-19 renderer, audio, and UI layer structure
- current partial rebuild work has moved past note/global invalidation and canvas layer separation into partial parsed-document reuse, edited-track analyzer/render item rebuild, and drag input batching
- Default/Long/Gliss/Trem/Pitch modifier UI input is now mostly wired for rawText creation, and Number UI input can edit global rows
- Score JSON file load is limited to 8 MiB, local score save is limited to 3 MiB, and stored cell rawText is limited to 200 characters
- gliss, mute, trem/vib, tuplet analyzer/render connections, basic Web Audio playback, pause/seek state, metadata/details editing, and edit UX helpers have first-pass implementations

## 10. Current Progress Summary

### 2026-09-30: SPRED 최신 커밋으로 코드 복원 완료

- 복원 기준: fetch로 확인한 `origin/main` = 로컬 HEAD = `aac9969`. 활성 코드/패키지의 diff 및 미추적 추가 파일이 없음을 확인했다.
- 외부 백업 278개 파일의 SHA-256과 복원 직전 변경 코드의 일치를 확인했다. 신규 9개 파일은 `docs/report-prep/3.8-partial-redraw-review/archived-working-files/`로 이동했다. 배포 사본과 PDF는 수정하지 않았다.
- 기존 설치 환경의 build 및 partial/edit/layout/track 검사 통과. 깨끗한 의존성 설치는 원본 lock 불일치로 실패했으며 별도 문제로 기록한다. Fit Height 기존 보류는 유지한다.
- 소스 복원은 완료했고, 그리기 순서 보완 등 후속 개선은 시작하지 않았다. 보고서 및 실험 기록을 보존하므로 저장소 전체가 clean인 것은 아니다.

### 2026-09-30: 미채택 실험과 보고서 수정 자료 보존

- 보고서 10쪽 연결 문단 및 11~14쪽 3.1.3 이후의 draw 축소 성공 서술을 검토했다. 입력 patch와 실제 픽셀 부분 복원의 혼동을 정정하는 [교체 본문](report-prep/3.8-partial-redraw-review/1.1-replacement-text.md)을 작성했다.
- draw 73→3개, 초기 구현 지연 증가, plan 재사용 후 기존과 비슷한 시간, 규모별 계산 비용을 각각 다른 측정 조건으로 구분해 인용했다. 단일 필터 함수만의 비용으로 단정하지 않는다.
- 보고서 원본 PDF·측정 로그·실험/검증 스크립트·현재/배포 소스·Git diff를 작업공간 밖 ZIP에 보관하고 모든 파일 hash를 검증했다. 원본 PDF 편집과 코드 rollback은 미수행이다.

### 2026-09-29: eventDiff 단순화 격리 실험

- 제품 수정 없이 참조 우선/JSON 캐시/구조 직접 비교를 비교했다. 9,000개 전체 재생성에서 diff 중앙값은 기존 10.80 / 참조 10.55 / 캐시 8.70 / 구조 비교 13.40ms였다. 1/3 재생성에서는 기존 9.90 / 참조 4.40ms로 줄었다.
- 기존 diff와 동일성 검증 1,036개 통과. 객체 재사용/재생성 조건과 캐시 mutation 반례를 함께 기록했다. 캐시는 불변 산출물 계약 검토 전 적용하지 않는다.
- 가장 작은 참조 우선 개선은 구/현재 renderer 양쪽에 적용 가능한 별도 후보다. 유지/제거를 아직 결정하지 않았으며 상세·재현 방법은 [3.8](3.8-viewport-partial-redraw-spec.md) 16장에 모았다.

### 2026-09-29: 부분 갱신 계산 복잡도 계측

- 가상화를 유지하고 구 배포본/현재의 eventDiff → plan → patch 및 draw 전 renderer 준비를 규모별로 비교했다. 제품·배포 코드는 변경하지 않았다.
- N=900/3,000/9,000/27,000, 단일 변경에서 계산 합계 중앙값은 구 1.00/3.40/10.90/34.55ms, 현재 1.00/3.50/11.30/35.25ms였다. 전체 편집 시간은 아니며 parser/analyzer/artifact/audio/UI는 제외했다.
- 큰 공통 비용은 기존 eventDiff의 전체 이벤트 fingerprint 비교다. draw 대상은 줄었으나 전체 계산 복잡도/시간 개선은 확인하지 못했다. 상세 범위·정적 복잡도·재현 명령·한계는 [3.8](3.8-viewport-partial-redraw-spec.md) 15장에 모았다.

### 2026-09-29: plan 재사용 후속 구현

- 기존 plan의 변경 ID로 노트·뮤트 전후 경계를 조회하고, 지정 그룹의 전역·파생 표시만 비교한다. 전체 fingerprint 재비교와 편집마다 공간 index 재정렬하는 비용을 줄였다. ID 조회표는 유지하며 변경 ID만 갱신한다.
- 전체 목록 구성·교차 조회 순회는 남는다. 동일 조건의 반복 renderer 중앙값은 기존 배포본 0.3~0.4ms / 새 부분 0.3~0.4ms로, 이전 구현보다 개선했지만 배포본을 앞섰다고 단정하지 않는다. 첫 편집/초기 준비 비용과 한계는 3.8의 14장에 기록했다.
- Canvas 480개 사례, 실제 plan 편집 66단계, 앱 연결 6개 및 fallback 전환, `test:partial`, TypeScript 검사·build 통과. 배포 사본은 변경하지 않았다. 아래 최초 구현 수치는 이전 단계 기록이다.

### 2026-09-29: viewport 부분 재그리기 로컬 구현·검증 완료

- renderer가 실제 화면 기준과 표시 경계를 관리하고, 변경 영역만 삭제한 뒤 교차 아이템을 원래 순서로 복원한다. 화면 밖 변경은 draw 없이 입력 기준만 갱신한다.
- artifact track 병합과 event patch의 순서를 공통 정렬로 보완했다. 전체 renderInput 및 parser/analyzer/audio/storage 계약은 유지했다.
- `test:canvas`의 Canvas 240개 사례, 실제 편집 66단계, 앱 연결 6개 및 fallback 전환 검증 통과. `test:partial`, `test:edit`, `test:layout`, `test:track`, `typecheck`, `build` 통과.
- 9,000개 아이템 사례: draw 대상 73 → 3개, clear 면적 243,000 → 810 CSS px². renderer 중앙값은 partial 약 1.2~1.5ms / full 약 1.0ms로, draw 절감이 전체 처리 시간 향상을 보장하지 않았다.
- 사용자 정상 작동 확인 후 배포 사본 `c866fe7`과 직접 비교했다. 같은 단순 노트 조건의 renderer 중앙값은 기존 0.3~0.4ms / 새 전체 0.8~0.9ms / 새 부분 0.9~1.2ms였다. 처리 시간 개선으로 해석하지 않는다. 재현 스크립트와 측정 한계는 3.8의 13장에 기록했다. plan 변경 후보 재사용 및 목록/index 비용은 후속 검토 대상이다.
- 상세 모듈 위치·픽셀 허용 오차·계측 한계는 [3.8](3.8-viewport-partial-redraw-spec.md) 13장에만 유지한다. 다음 단계는 실제 악보 확인과 별도 배포다. 커밋·배포 사본 동기화·푸시는 수행하지 않았다.

### 2026-09-28: viewport 내부 부분 재그리기 우선 착수

- [3.8](3.8-viewport-partial-redraw-spec.md)을 active 명세로 고정했다. 현재는 명세 작성 완료 / 제품 구현 미착수다.
- 데이터 부분 갱신과 실제 draw를 구분한다. 현재 기본 viewport 분기는 unchanged 아이템도 가시 범위에 있으면 다시 그리므로 목표 미달이다.
- 다음 순서: DTO와 화면 기준/fallback → 일반 노트 → 텍스트·주법·연결 마커 → 전역 셀 → 픽셀 비교·호출 계측·회귀 검사 → 배포 검증.
- 변경 밖 픽셀은 유지한다. 삭제 영역과 겹치는 unchanged는 복원한다. 전체 renderInput은 스크롤/전체 렌더용 상태로 유지한다.
- 보고서 작성은 보류한다. 오디오 부분 갱신, parser/analyzer 범위 변경은 이번 범위 밖이다.
- 선행 base 입력 재사용 수정은 원본 `aac9969`, 배포 저장소 `c866fe7`에 커밋되었고 배포 main 푸시 및 로컬 build 통과까지 확인했다. 해당 푸시의 Pages 완료 상태는 별도 확인하지 않았다.
- `test:view`의 기존 Fit Height 기대값 불일치는 진단 완료이며 사용자 결정에 따라 수정 보류한다. 본 작업의 새로운 실패와 구분한다.

### Latest checkpoint — 2026-09-21

- 배포 완료: 사용자 안정화 확인 후 입력 확정·패널 접기·error:2 수정·양 언어 매뉴얼을 배포 저장소 main `1a8884d`에 푸시했다. [Pages Actions 35592417030](https://github.com/B935342LYS/spredtest/actions/runs/35592417030) 성공. 원본 테스트 3종과 원본·배포본 build 통과, 양쪽 로컬 산출물 일치. 게시 CSS 일치, JS는 raw 악보 템플릿의 CRLF/LF 차이만 있으며 정규화 후 전체 일치. 게시 사이트 실제 영상 `gpcRRvCuXfs`의 악보 로드·Reload·Play/Pause·off/on도 오류 없이 확인했다. 원본 저장소 변경은 미커밋 상태다. 아래 로컬·미배포 설명은 이전 작업 시점의 기록이며 상세는 `3.7` 22절을 따른다.
- 실제 영상 error:2 후속 수정: 빈 ID로 생성한 player의 `/embed/` 초기 오류를 실제 API에서 재현했다. 생성 시 확정된 videoId를 전달하도록 수정하고 생성 옵션 회귀 검사를 추가했다. `test:youtube`, `build`, Chrome 모의 회귀 통과. 사용자 ID `gpcRRvCuXfs`를 넣은 ScoreFile의 on·Reload·Play/Pause·off/on에서 오류 없이 실제 영상 재생을 확인했다. 상세는 `3.7` 21절. 청감·전체 기기 검증 및 배포는 별도다.
- [3.7 YouTube 입력 확정·패널 명세](3.7-youtube-local-offset-spec.md)의 최신 결정에 따라 `regression-code/` 로컬 구현 완료. Video·곡 offset을 change/Enter에서 독립 적용하며 Reload는 저장된 영상 재로딩으로 분리했다. 곡 metadata 변경은 indexes·분석·오디오·편집 이력을 재사용한다.
- YouTube off는 버튼만 표시하고 부속 UI·영상을 접는다. 빈 링크·영상 오류에서도 사용자가 켠 패널은 유지하며 링크 수정·Reload로 복구한다. 영상 변경·Reload별 player 분리, AbortController/요청 세대, API 실패 캐시 해제·준비 timeout·소유 mount 정리로 이전 요청의 개입을 차단했다.
- `test:youtube`에 binding/player lifecycle 검증을 연결했다. `test:youtube`, `test:audio`, `test:game`, `build` 통과. Chrome 모의 player에서 입력·메타데이터 독립성, 오류 복구, Reload 중복 방지, 로딩 중 off, 재생 보정·drift, 390/1000/1280/1920px 배치와 개폐를 확인했다.
- `2.7`, `3.7`, 한글·영어 매뉴얼 갱신. 실제 YouTube 확인은 위 후속 수정 기록의 범위이며 사용자 장치 청감 확인은 별도 필요하다. 커밋·배포 사본 동기화·푸시는 수행하지 않았다. 공개 배포는 아래 9월 20일 기록을 유지한다.

### Previous checkpoint — 2026-09-20

- YouTube Local offset과 후속 UI 보완을 배포 저장소 main `841a422`에 푸시했다. 라벨은 입력 아래에 두고 버튼·입력 높이를 통일하며, 토글 색상을 Edit Mode와 맞췄다. 좁은 창에서는 한 줄을 강제하지 않고 버튼 아래 폭도 줄바꿈에 활용한다. 1280px에서 컨트롤 세 줄을 두 줄로 줄여 영상 포함 높이를 약 32px 낮췄다.
- 원본 `test:youtube`, `test:game`, `test:audio`, 원본·배포본 `build` 통과. 양쪽 JS/CSS 빌드 결과 일치. 배포본에는 dev 테스트 디렉터리가 없어 단위 테스트는 원본에서 실행했다. 사용자가 기능의 정상 동작을 확인했으며 전체 기기 청감 검증으로 일반화하지 않는다.
- [Pages Actions 35475721400](https://github.com/B935342LYS/spredtest/actions/runs/35475721400) 성공. 게시 사이트와 한글·영어 매뉴얼 HTTP 200, Local offset 입력·저장 키·매뉴얼 설명·최종 줄바꿈 CSS 반영을 확인했다. 게시 CSS는 로컬 빌드와 일치한다.

### Previous checkpoint — 2026-09-19

- 사용자 결정에 따라 기존 3.7 비동기 초기 동기화 명세를 삭제하고 [3.7 YouTube Local offset 구현 명세](3.7-youtube-local-offset-spec.md)로 대체했다. 곡 offset과 별도로 브라우저에 환경 보정값을 저장하고, Video 폭을 줄여 기존 Offset 오른쪽에 한 줄로 배치한다.
- Local offset 로컬 구현 완료: load/play/resume/seek/stop/loop/drift/영상 시작 경계에 곡 offset과의 합산값을 적용한다. YL-1~3 답변에 따라 ±5000ms·기본 0ms·1ms 단위로 구현했다. change/Enter 확정 시만 브라우저에 저장·적용하고 0 입력으로 초기화한다. 곡 데이터·미적용 Video/곡 offset 입력은 보존한다. 큰 값의 영상 생략·시작 대기는 명세에 기록했다. Android 일괄 보정이나 새 PLAYING 대기 절차는 도입하지 않는다. CREPE 계획은 3.6에 보존한다.
- 한글·영어 매뉴얼과 한국어 코드 주석을 반영했다. `test:youtube`, `test:game`, `build` 통과. Chrome 모의 YouTube로 저장/복원·확정 시 적용·재생 상태 유지·drift·시작 대기 취소·당시 1280/1440px 배치를 확인했다. 이후 원본 `bfcfa90`에 커밋됐으며, 9월 20일 후속 UI와 함께 배포했다.

### Previous checkpoint — 2026-09-18

- 다음 작업은 CREPE 시범 도입 계획 검토: [3.6 CREPE 시범 도입 계획](3.6-crepe-pilot-plan.md). 동일 WAV 비교 후 조건부 개발용 실시간 연결을 권장하며 CR-1~3(범위·기기·원시 자료) 답변 대기. 현재 실험 브랜치·WAV를 찾지 못해 복구 또는 새 캡처를 첫 단계로 둔다. 모델 설치·제품 코드 변경·배포는 아직 하지 않았다.

- 사용자 안정화 확인 후 누적 변경 배포 완료. Sync 창의 `Saved for this browser. Score playback stays paused; use Play after closing.` 안내를 삭제하고 한글·영어 매뉴얼 7.1의 입력/출력 지연 설명을 포함해 반영했다.
- 배포 커밋 `41f7a23`, [Actions 35279572439](https://github.com/B935342LYS/spredtest/actions/runs/35279572439) 성공. 개발·배포본 build 및 `test:game`·`test:youtube`·`test:audio` 통과, 양쪽 JS/CSS 빌드 해시 일치. 게시 사이트와 두 매뉴얼 HTTP 200, 안내 삭제·±1ms 버튼·Display 저장 키 반영 확인.

- Display offset 후속 기준 확정·로컬 구현 완료: 별도 localStorage 저장/복원, 800ms 테스트 노트와 beep, 공통 Start/Stop, Sync 진입 시 악보/YouTube 일시정지, 닫기 뒤 Play 수동 재개.
- Display offset·Input Sync에 ±1ms 버튼을 추가하고 ±10ms 버튼을 축소했다. 값은 좌우 버튼 사이에 중앙 정렬하며 저장·복원 정밀도도 1ms로 변경했다. `test:game`, `build`, Chrome 증감·배치·새로고침 복원 검증 통과.
- UI 후속 정정: Apply를 헤더로 이동하고 Input Sync Reset을 원위치로 복구했다. 미리보기 노트 중심의 기준선 접촉에 140ms 원형 강조 효과를 추가했다. 보정값별 효과 시점·정리와 빌드 검증 통과. 악보 파일 자체의 타이밍 결함 가능성은 미확정이며 이번 UI 보완에서는 오디오 동기화 코드를 추가 변경하지 않았다.
- countdown과 비동기 재생 준비 요청을 Sync 진입 시 무효화한다. 미리보기 종료 시 RAF·노드·예약 oscillator·AudioContext·flash 타이머를 정리한다.
- `test:game`, `test:youtube`, `build` 통과. 로컬 Chrome에서 저장 복원·미리보기 실행/정리·countdown 취소·재생 일시정지/수동 재개를 확인했다. 실제 장치 청취와 실제 YouTube 영상 확인은 별도 필요.
- Sync 후 재개 보완: 영상 위치 차이가 50ms 이내인 일시정지 재개는 YouTube seek를 생략한다. Display offset의 오디오 시간 유입은 재현되지 않았으며 실제 청감 원인은 미확정이다. 헤더 우측을 Start/Stop → Apply → Close 순으로 배치했다. `test:audio` 및 모의 YouTube를 연결한 실제 앱 재개 검증도 통과.
- 상세는 `3.5` 11.8~11.9절, `3.2` 13.2~13.3절 및 `2.7` 5절. 아래 이전 체크포인트와 상세 문서의 로컬·미배포 표기는 당시 작업 기록이다.

### Previous checkpoint — 2026-09-17

- 후속 로컬 시범 구현: Practice Sync 팝업에 독립적인 Display offset 추가. 기본 0ms, ±500ms, 10ms 단계, 페이지 메모리만 유지. 오디오/입력 판정은 기존 시간을 사용하고 화면 좌표 변환만 보정한다. 상세는 `3.2` 13.2절.
- 화면 보정 검증: `test:game`, `test:youtube`, `build` 통과. 로컬 Chrome 가상 마이크로 조절 범위·Reset·입력 Sync 독립성·Practice 재진입 유지·새로고침 초기화·저장소 미변경·모드별 mapper 전달 시간을 확인했다. 실제 인터페이스/YouTube 청취 보정, 긴 곡·구간 반복의 체감 검증은 사용자 환경에서 필요하다. 이번 화면 보정은 커밋·배포하지 않았다.
- Pages 배포 완료: [Actions 35184383237](https://github.com/B935342LYS/spredtest/actions/runs/35184383237)의 build/deploy 모두 성공. 배포 사이트와 JS 응답 HTTP 200 및 게시 번들의 접근 단어 임시 상태·요청 취소 처리 반영 확인.
- DB 접근 유지 로컬 구현 완료: `example_binding.ts`에서 페이지 메모리의 검증된 단어를 재사용하고 `example_dialog.ts`에서 재개방 시 복원·자동 조회한다. 저장소나 서버 인증 계약은 변경하지 않았다.
- 보관 단어 인증 거부 시 초기화, 통신·서버 오류 및 다른 단어 오입력 시 보관값 유지. 닫힌 창·이전 요청의 응답은 목록과 busy 상태를 덮어쓰지 않는다.
- 한국어 JSDoc·핵심 블록 주석 추가. `typecheck`, `test:examples`, `build` 통과. 로컬 Chrome + 모의 응답으로 재개방·악보 로드·오류·요청 경합·새로고침·새 탭·접근 단어 미저장을 검증했다.
- 상세 결과는 `3.5` 3.5절. 사용자 후속 요청으로 원본 `SPRED` main `ae04a82`, 배포용 `spredtest` main `6929c77`에 코드 두 파일을 커밋·푸시했다. 배포 폴더 typecheck/build 통과. 배포 폴더의 Examples 테스트는 대상 파일 부재로 실행 실패했고 원본 테스트는 통과했다. Supabase 실서비스 인증 검증은 수행하지 않았다. 재생 시간 자동 등록은 보류 유지.

### Previous checkpoint — 2026-09-16

- DB 접근 유지 확정: 검증된 단어를 현재 페이지 메모리에만 보관한다. Examples 재개방 시 단어를 복원하고 추가 목록을 자동 조회한다. 새로고침·새 탭·브라우저 재방문 시 재입력한다.
- localStorage/sessionStorage 및 별도 기억 UI는 추가하지 않는다. 세부 기준은 `3.5` 3장과 갱신된 `2.11`을 따른다.
- 재생 시간 자동 등록은 사용자 결정으로 보류한다. 현재 null 등록 경로를 유지하고 기존 DB 값을 별도로 보충하지 않는다.
- 이번 DB 구현 범위는 접근 유지 기능만이다. 현재까지는 기준 문서만 갱신했으며 제품 코드 변경·원격 DB 갱신·배포는 수행하지 않았다.

### Previous checkpoint — 2026-09-15

- 사용자 확인: 9월 2주차 보고서 작성 및 제출 완료.
- 새 작업 계획: `docs/3.5-september-third-week-implementation-plan.md`. DB 접근 유지, 등록 시 재생 시간, CREPE 시범 가동, MIDI 정합성 설계를 다룬다.
- 문서 상태: `task-plan / decision-pending`. 확정 요청·현황·제안·미결정을 구분하며 질문 ID별 답변을 반영한다. 코드 구현이나 원격 DB 갱신·배포를 완료한 상태가 아니다.
- CREPE 비교는 `docs/3.4-practice-pitch-detector-backend-spec.md`의 기존 실험 브랜치·동일 WAV 비교·채택 기준을 따른다. 실험 코드와 자료의 실제 위치는 착수 시 확인한다.
- 이번 변경은 계획 문서 작성과 하네스 재개 지점 갱신이다. 제품 테스트와 빌드는 재실행하지 않았다.

### Previous checkpoint — 2026-09-11

- 안정판 최근 반영: CSS 역할별 분리(`6a09f5c`), BPM 하한 1 적용(`662c352`), tuplet 내부 gliss 연속 재생 수정(`00110e0`).
- tuplet gliss 수정은 `audio_schedule_builder.ts`에서 slot anchor의 실제 시간 경계로 앞뒤 발음 구간을 체인에 흡수하도록 보완한 것이다. `slotIndex`가 있는 음은 일반 단일 셀 판정에서 제외한다. parser / analyzer / ScoreFile 형식은 변경하지 않았다.
- 검증: 슬롯 길이·head 위치·외부 hold 연결을 조합한 12개 회귀 사례 추가. 수정 당시 `test:audio`, `test:analyze`, `test:partial`, `test:game`, `build` 통과. 이후 사용자가 원래 문제 악보에서 정상 동작을 확인했다.
- 원격 반영: `B935342LYS/SPRED` main `00110e0`, 배포 저장소 `B935342LYS/spredtest` main `d364d25`까지 푸시 완료. 배포본 로컬 빌드는 통과했으나 해당 푸시의 GitHub Actions / Pages 완료 여부는 별도로 확인하지 않았다.
- 소수 tick 시간 보정은 `docs/3.3-third-extension-candidate-spec.md` 9.6절에 3차 확장 후보로 기록했다. `C4@f(0.15,0.80)`은 예시이며 문법·단위·제약은 미확정, 구현하지 않았다.
- 저장소 정리: `.gitignore`에 `/.agents/tmp/`를 추가하고 기존 추적 파일 `karaoke-mode-draft.pdf`는 `git rm --cached`로 추적 해제했다. PDF와 브라우저 프로필은 로컬에 유지한다. 이 정리 변경은 아직 커밋·푸시하지 않았다.
- 보고서: 로컬 `1. 개발문서/주간보고서/9월 2주차 보고서.pdf`의 3.1.2 `출력 limit 설정` 작성 중. 출력 압축 설정값·gainScale과의 역할 구분·한계에 관한 부연 문단을 제안한 상태이며, PDF 반영은 미확인이다. 다음 작성 대상은 3.2 gliss 오버랩 실패와 연속 체인 전환이다.
- 보고서와 흐름도의 상세 재개 기준은 `docs/4.0-second-extension-report-guide.md` 8장에 기록한다. 이번 체크포인트의 테스트 결과는 이전 수정 때의 실행 기록이지 문서 정리 시 재실행한 결과가 아니다.

### Earlier accumulated implementation history

- active specification documents `1.3`, `1.5`, `1.6`, `1.7`, `1.8` are prepared
- active MVP implementation specification document `1.9` is prepared for the first analyzer / renderer / UI connection
- active UI MVP specification document `2.0` is prepared for layout, UI state, and event-action flow
- the early experimental implementation archive has been removed after the active `regression-code/` parser path was established
- a reinitialized `regression-code/` now exists as the active implementation path
- implementation order and folder structure now follow `docs/implementation-memo/1.0-roadmap.md`
- `regression-code/src/core/score/types.ts` defines the score storage and runtime index types
- `regression-code/src/core/parse/types.ts` defines parser result, parser input, document parse, and parser cache types
- `regression-code/src/core/analyze/types.ts` has an initial analyzer type contract for events, timelines, diagnostics, and cache structures
- `regression-code/src/core/score/json_load.ts` now implements JSON parsing, top-level object checking, and the convenience `loadScoreFile()` entry point that delegates structure validation
- `regression-code/src/core/score/score_validate.ts` now implements the first-stage minimum ScoreFile structure/reference validation
- `regression-code/src/core/score/build_score_indexes.ts` now implements the first-stage ScoreIndexes builder
- `regression-code/src/core/score/create_runtime_document.ts` now bundles validated ScoreFile data with ScoreIndexes into RuntimeDocument
- `regression-code/src/core/parse/parse_global_cell.ts` now implements the first-stage global cell parser
- `regression-code/src/core/parse/parse_note_cell.ts` now implements the first-stage note parser path for mute, pletExtend, pletHead, default note, hold-only cells, and general note modifiers
- `regression-code/src/core/parse/build_parsed_document.ts` now accepts `RuntimeDocument` as the public parse input and assembles single-cell parser results into `ParsedScoreDocument`
- document-level parser public API now uses `RuntimeDocument` instead of separate `ScoreFile` and `ScoreIndexes` arguments to keep score/index pairs synchronized for later runtime editing and partial update work
- `regression-code/dev/test_cases/minimal-valid-score.json` is the current parser/score test fixture
- `regression-code/dev/test_score.ts` verifies the fixture through `loadRuntimeDocument()`
- `regression-code/dev/test_parse.ts` verifies fixture global cells through `parseGlobalCell()`, fixture track cells through `parseNoteCell()`, direct note modifier samples, direct pletHead samples, and `buildParsedDocument()`
- TypeScript verification has been introduced through `regression-code/tsconfig.json`, `npm run typecheck`, and `npm run test:score`
- parser verification has been introduced through `npm run test:parse`
- current near-term focus is verifying the first track layer implementation and then preparing the basic audio verification step
- the first analyzer MVP scope is fixed to default note text and `"-"` hold only
- UI layout customization MVP now distinguishes original `instData.presetId` from user-created `layoutPresetId`
- `score_validate.ts` now rejects ScoreFiles without any of the fixed `basic`, `optional`, and `extra` tracks
- `regression-code/index.html` and `regression-code/styles/app.css` now contain a static MVP UI shell modeled after legacy `이세계 코드`
- the UI shell currently includes hover/focus menu groups, center player card, YouTube placeholder, legacy-like edit panel cards, layout label area, canvas score layers, and Info dialog
- renderer/playback specs now keep the layout/score boundary as the playback reference and use layout-side padding columns with a translucent red right-half overlay to emphasize that boundary
- `docs/2.1-canvas-renderer-module-spec.md` now defines the initial canvas renderer base-layer path around `CanvasRenderInput`, `CanvasScoreLayout`, `canvas_renderer_adapter.ts`, `canvas_types.ts`, `canvas_coordinate.ts`, `canvas_grid_renderer.ts`, and `canvas_score_renderer.ts`
- renderer score/layout DTO conversion is assigned to `src/app/canvas_renderer_adapter.ts`, while later `AnalysisResult` to canvas item conversion is assigned to renderer-side `canvas_item_builder.ts` to avoid both adapter overreach and draw-layer analyzer coupling
- `CanvasScoreLayout` now keeps only layout/base renderer coordinates; score-side playback scroll boundary is deferred to the later playback/scroll controller
- legacy `이세계 코드` rendering flow has been inspected for reference concepts: cumulative coordinate precomputation, DPR canvas sizing, label/score vertical scroll sync, base grid draw order, and range rendering preparation
- `regression-code/src/renderer/` now contains the first canvas renderer path for layout/base grid and analyzer-driven note layer rendering
- `regression-code/src/app/canvas_renderer_adapter.ts` converts `RuntimeDocument` layout data into renderer DTOs
- `regression-code/src/renderer/canvas_item_builder.ts` converts `AnalysisResult` note events into canvas note items
- analyzer MVP currently creates `NoteEvent` for defaultText and `"-"` hold merge, with `displayTextAnchors` for per-cell text placement
- note rendering currently displays legacy-like track colors, 21px note rectangle height, black text except extra, and per-cell `displayTextAnchors`
- the UI shell now uses canvas layers instead of the temporary static score grid
- the left menu status line has been added for user-facing load/edit/error messages
- minimal edit mode is implemented for the `basic` track: CUSTOM/AUTO/default modifier input writes note cell rawText, empty input deletes a cell, and edit-mode right click deletes cells
- CUSTOM defaultText input escapes parser reserved characters internally while showing the user-entered characters in the input and rendered score
- edit-mode mutation now uses a partial rebuild path for note/global rawText edits: score text mutation -> runtime document/index rebuild -> parsed document group reuse -> edited track or global analyzer rebuild -> renderer item group patch -> partial canvas redraw
- edit-mode mutation now supports note/global batch edits, and drag input batches pointermove edits by animation frame before applying the partial rebuild path
- `src/app/edit/` now separates edit logic into `edit_core.ts`, `edit_default.ts`, `edit_tuplet.ts`, and `edit_apply.ts`
- `edit_core.ts` returns apply/delete/blocked commands, `edit_default.ts` handles defaultText escaping and note rawText composition, `edit_tuplet.ts` handles tuplet draft/finalize helpers, and `edit_apply.ts` applies note/global cell upsert/delete to `ScoreFile`
- score pointer coordinate resolution currently uses the graphics UI convention name `hitTestScoreCell()` and edit-mode hit testing can use nearest-note row slop for thin note rows
- `main.ts` has been partially modularized into `app_types.ts`, `app_dom.ts`, `app_runtime.ts`, `app_ui_sync.ts`, `app_controller.ts`, `pitch_label.ts`, and `score_hit_test.ts`
- edit mode now supports Default AUTO sharp/flat, CUSTOM, comment, eraser, long hold, vibrato hold, Gliss input controls, Trem input controls, absolutePitch dropdown, and microPitch normalization
- edit mode now supports same-cell click cycle `currentText -> - -> ~ -> currentText`, left-drag install, right-drag delete, and per-cell drag loop based on existing rawText
- Number UI is always available in edit mode for global rows; `bpm` and `dynamics` accept ramp tokens while `beatsPerBar` and `stepsPerBeat` remain numeric-only
- CUSTOM defaultText input is limited to 10 characters and escapes parser reserved characters at rawText composition time
- tuplet slot input is limited to 30 characters, and composed tuplet rawText is blocked above the 200-character cell limit
- absolutePitch UI uses a high-to-low sharp-note dropdown instead of direct MIDI number input
- `@p(0)` and `@m(0)` are omitted from composed rawText because they have no effect
- tuplet UI now supports On/Off state, slot activation, SELECT ROW slot filling with `@n(midi)`, and Finalize Value preparation for later cell insertion
- File panel JSON Download/Load and Local Save/Load are connected through `src/infra/score_file_io.ts` and `src/infra/score_local_storage.ts`
- analyzer track handling now consumes general note cells except gliss, and supports `@p`, `@m`, `@t`, `"-"` hold, and `"~"` vibrato hold as `NoteEvent` data
- `@p` changes final sound MIDI and renderer note color follows the final sound MIDI
- `@m` changes final sound cent offset and display cent offset; renderer maps `+100/-100` cent to the adjacent note row center
- `~` vibrato hold is rendered as a sine wave; immediate `F4 ~ ~` style head notes are included in vib segments, consecutive vib segments are merged into one path, and renderer sampling/stroke coordinates are tuned for smoother display
- `@t` tremolo is rendered as chop lines using the note row background color
- layout label rows now carry note MIDI into renderer layout data and the label column is colored with muted pitch-class colors
- renderer common colors and metrics are centralized in `regression-code/src/renderer/canvas_theme.ts`, while pitch-class palettes remain in `canvas_note_colors.ts`
- gliss analyzer/render now supports connected S/M/E segments, orphan anchor markers, duplicate same-column anchor filtering, trem+gliss dashed outgoing segments, and tuplet slot anchor coordinates
- tuplet analyzer/render now supports `/n(...)` head plus `/&` group spans, slot note/rest events, extend-only containers, first-slot based placement, dotted 21px containers, and slot gliss display rules
- long tuplet slot gliss start/mid notes use `anchorSquare` display while short slots and end anchors keep normal rectangles; `-@g(...,S)` held start anchors inside a merged long note split the base rectangle around the square anchor; long slot text is left-aligned in the renderer
- renderer now displays `globalLines.cells` rawText as white text on global rows through `CanvasGlobalTextRenderItem`
- audio module first pass is implemented under `regression-code/src/audio/` with schedule building, tick/seconds mapping, event queue, lookahead scheduler, oscillator backend, and playback controller
- UI playback buttons now connect basic note events to Web Audio oscillator playback and scroll the score so the layout/score boundary acts as the playback reference line
- current audio backend supports basic note playback, vibrato detune LFO, tremolo gain gating, dynamics gain automation, actual-overlap gainScale normalization, mid-event resume clipping, standalone gliss fallback bridge playback, connected gliss chain playback through a single oscillator with segment-level frequency ramps, and monotonic short-event edge envelopes for fast tuplet boundary gliss cases; sampled instrument playback and full note voice-span gliss merging remain later backend extensions
- `PlaybackController` now tracks `stopped`, `playing`, and `paused` states and supports `playFromStart()`, `playFromSeconds()`, `pause()`, `pauseAtSeconds()`, `resume()`, `seekToSeconds()`, and `stop()`
- seek UI is connected to score seconds and displays `mm:ss`; the former stepMs display now shows the current BPM derived from the timing timeline at the current score time
- app playback-related modules have been moved under `regression-code/src/app/playback/` to keep playback orchestration separate from general app wiring
- edit mode pointer input can preview the touched note row pitch through Web Audio, with row-level drag throttling to reduce overlapping preview artifacts
- Fit Height, Fullscreen, zoom floor handling, and edit-mode auto Fit Height are connected as score view helpers
- the edit panel uses a single-row grid layout with horizontal overflow so smaller desktop screens can keep edit controls on one line
- center player metadata now reads from `ScoreFile.musicData`, and the Details dialog can edit general musicData fields except creation/update timestamps and YouTube sync fields
- beat and bar marker rendering now uses timing row data, treats bar markers as stronger than beat markers at the same tick, and does not let BPM-only segment changes reset the beat/bar grid
- `docs/1.3-score-json-format.md` now records the future layout replacement policy: incompatible cells may be deleted only after explicit user confirmation, while external JSON import still fails on invalid row references
- `docs/2.4-layout-edit-ui-spec.md` defines the layout editor UI, simplified draft-bundle apply flow, deletion confirmation boundary, and reusable existing module boundaries
- `docs/2.5-layout-preset-format-spec.md` defines the Local/File layout preset JSON format and the fixed 3-slot localStorage policy per `instrumentPresetId`
- `docs/2.6-track-layer-ui-spec.md`는 0개 이상 active track filter, active track 대상 edit/playback, inactive track 반투명 render, `extra -> optional -> basic` draw order, 동일 track gain 정책, stopped/paused toggle 정책, `src/track/track_control.ts` 공용 정책 모듈을 정의한다
- track layer first pass is implemented: Track menu toggles update `activeTrackIds`, note edit batches expand to all active tracks, empty active tracks block note edit while keeping global edit available, renderer items carry active/inactive alpha, audio schedule consumes only active tracks, playing state disables track toggles, and paused track toggle preserves score time for resume
- harmonics auto-pitch direction is recorded in `docs/implementation-memo/1.36-harmonics-auto-pitch-plan.md`: the `@p(h)` special-token experiment was discarded, and the next pass should implement `AUTO◇` as a UI preset that emits existing `@p(n)` / `@m(c)` modifiers for a single sounding partial, likely defaulting to the 4th harmonic
- harmonics `AUTO◇ +2oct` is now implemented as an edit UI preset: it keeps the AUTO selection state, recalculates from the clicked note row, emits existing `@p(rowMidi + 24)`, and makes AUTO sharp/flat default text show the two-octave target pitch name
- global row column 0 values are now protected at the edit-apply boundary: they may be changed but cannot be deleted, preventing local-save files that later fail required global start-cell validation
- View menu cleanup and first view options are connected: `Refresh Lines` and ambiguous `Reload` controls were removed, `Normal`/`Reverse` toggles renderer row order for non-global rows only, `Light`/`Dark` toggles menu and edit-panel theme, `Expand right` increases `ScoreFile.globalLines.columnCount`, `Trim Right` decreases it while removing out-of-range cells, and `Clear All` resets musicData plus score cells to default metadata and an empty 1000-column score with initial global row values before rebuilding runtime artifacts
- the layout editor draft/apply/storage MVP is connected: `Modify` opens a `Layout` dialog, selected string rows render into a draft row list and preview, common note height and gap height editing are wired, note/gap add/delete draft mutations are implemented, Apply creates a structurally shared next ScoreFile after deletion confirmation, and Local/File preset save/load are connected
- the outer layout toolbar now shows `Default Layout` plus Local Slot 1..3; Default reapplies the score-load-time layout snapshot, filled slots can be applied directly, and empty slots fall back to Default
- layout preset names are limited to 30 characters, layout preset JSON is limited to 256 KiB, preset file names use the simplified `layout-{preset name}.json` rule, and layout apply/preset apply reset playback runtime
- local score save is limited to 3 MiB, score JSON file load is limited to 8 MiB, and score cell `rawText` is validated at the score and edit-input boundaries
- unused layout preset index helpers, unused generic JSON download helpers, and stale unused variables/imports were removed; `tsc --noUnusedLocals --noUnusedParameters` passes
- root layout test fixtures have been added for a 2-octave layout with fixed 21px gap rows and a 3-octave layout without gap rows
- `docs/implementation-memo/1.15-step2-edit-render-verification-loop.md` records the current edit/analyze/render verification loop implementation
- `docs/implementation-memo/1.16-weekly-report-draft-step2-edit-render.md` provides a weekly report draft for the grid-renderer-afterward work segment
- `docs/implementation-memo/1.17-step2-gliss-mute-marker-rendering.md` records gliss, mute, trem+gliss, and vibrato renderer decisions
- `docs/implementation-memo/1.18-step3-tuplet-analyzer-first-pass.md` records tuplet analyzer/render first-pass decisions
- `docs/implementation-memo/1.19-step4-audio-open-source-survey.md` records audio open-source survey and adoption candidates
- `docs/implementation-memo/1.20-step4-playback-edit-global-visualization.md` records audio playback, edit UX, batch edit, and global rawText visualization progress
- `docs/implementation-memo/1.21-step4-playback-layout-ui-progress.md` records pause/seek playback state, metadata/details UI, view helper, edit preview, app playback folder split, and layout compatibility planning progress
- `docs/implementation-memo/1.22-step4-basic-audio-effects.md` records vibrato, tremolo, gliss fallback, connected gliss chain, audio overlap normalization, mid-event resume clipping, and the current gliss-chain/tremolo-gate listening diagnosis
- `docs/implementation-memo/1.25-step5-layout-editor-ui-shell.md` records the layout editor UI shell, current placeholder boundaries, and the next layout draft step
- `docs/implementation-memo/1.26-step5-layout-draft-apply-preset.md` records the layout draft, apply, local slot preset, file preset, and toolbar preset implementation decisions
- `docs/implementation-memo/1.27-step5-layout-storage-constraints-cleanup.md` records layout preset limits, score/localStorage limits, structural-sharing apply, playback reset, validation boundaries, cleanup, and the next work order
- `docs/implementation-memo/1.28-step6-track-layer-spec-decisions.md` records the finalized active track policy, inactive render/audio behavior, playing-state toggle rule, and `src/track/track_control.ts` module decision before implementation
- `docs/implementation-memo/1.29-step7-partial-rebuild-performance.md` records partial rebuild performance profiling, score clone narrowing, parsed document reuse, renderer dirty-range fixes, and drag input batching
- `docs/implementation-memo/1.30-step8-user-test-stabilization.md` records first user-test follow-up work around playback position preservation, input/storage safeguards, Local Save/Load confirmation, fullscreen/Fit Height/zoom/status footer layout, and publish staging updates
- `docs/implementation-memo/1.31-step9-viewport-view-loop-ui.md` records viewport bounded rendering implementation, performance profiling/removal, View menu Speed/Text off behavior, Loop marker UI first pass, and publish staging synchronization
- `docs/implementation-memo/1.39-range-selection-paste-preview-undo-plan.md` records Ctrl+drag range selection, bulk delete/copy/paste, paste preview overlay, and the decision to use cell patch based Undo / Redo instead of full `ScoreFile` snapshots
- `docs/implementation-memo/1.40-undo-redo-history-implementation.md` records cell patch based Undo / Redo implementation, button/shortcut wiring, drag edit transaction grouping, verification, and publish staging synchronization
- `docs/implementation-memo/1.41-performance-profiler-instrumentation.md` records the runtime profiler, `?perf=1` / `window.spredPerf` usage, broad app/runtime/renderer/playback/audio scheduler measurement points, and the next bottleneck narrowing workflow
- `docs/implementation-memo/1.42-game-mode-pitch-visualization.md` records the game/practice mode UI skeleton, microphone permission and pitch input runtime, pitch dot overlay, pitchy dependency, and first pitch math verification
- `docs/implementation-memo/1.43-practice-playback-render-stabilization.md` records practice mode UI/diagnostic additions, pitch judging stabilization attempts, judge overlay, result dialog, gliss render order, overlap gain/limiter, copyright notice, rawText limit, tuplet container visibility, dark theme fixes, and deployment synchronization
- `docs/implementation-memo/1.44-practice-pitch-correction-reset.md` records the decision to remove target-based pitch correction, octave/harmonic correction, and hysteresis lock from practice judging while returning to raw detector pitch for further investigation
- `docs/implementation-memo/1.45-practice-timing-judge-stabilization.md` records the raw pitch stabilization state, Miss-as-0% accuracy policy, timing early/late/miss implementation, headset notice removal, judge overlay size tuning, and latest deployment synchronization
- `docs/implementation-memo/1.46-practice-result-and-tuplet-gliss-followup.md` records the 4-stage timing judge, 4-step pitch/timing accuracy weights, result dialog pitch/timing grouping, practice diagnostic width stabilization, `-@g(...,S)` tuplet gliss rectangle split, deployment staging update, and the next two practice-mode tasks
- `docs/implementation-memo/1.47-practice-vib-short-target-and-timing-rollback.md` records short-target vib bonus threshold relaxation, the 160 BPM two-tick vib regression test, and the rollback of the no-onset timing anti-cheat attempt
- `docs/implementation-memo/1.48-practice-attack-credit-spec.md` records the attack credit / score eligibility split for timing anti-cheat work without direct no-onset `Bad` / `Miss` downgrades, including the first implementation pass
- `docs/implementation-memo/1.49-practice-pro-mode-spec.md` records the planned session-only Pro Mode, stricter pitch/timing thresholds, red practice UI accent, mode-specific combo reset policy, and deferred implementation/verification plan
- `docs/implementation-memo/1.51-practice-full-combo-and-examples-support-plan.md` records the gliss-neighbor target selection fix, FULL COMBO result display, deployment staging sync, and the current Supabase Edge Function based Examples support plan
- `docs/implementation-memo/1.52-examples-supabase-first-implementation.md` records the first Supabase Edge Function based Examples implementation, public Storage score loading, Manual first pass, browser-based catalog SQL generator, and remaining Examples test items
- `docs/implementation-memo/1.53-examples-comment-layout-followup.md` records Examples public/extra/hidden visibility follow-up, score comment 500-character support, Details comment 10-row height, bundled slot 1 Normal Score layout, and deployment status
- `docs/report-prep/README.md` records the report-preparation extraction pipeline, including Codex session extraction, git log collection, session summary generation, and outline use rules
- `docs/report-prep/session-summaries/daily-timeline.md` is the current compact chronological source for 2026-06-19 이후 work; use it instead of loading raw `.jsonl` transcripts into context
- `docs/report-prep/second-extension-report-outline.md` is the current report structure draft, organized by time sequence plus feature groups
- `regression-code-report-commentary/` currently has dense explanation comments in `src/app/main.ts`, `src/app/app_runtime.ts`, `src/app/app_types.ts`, `src/orchestration/partial_rebuild/`, and most renderer modules including `canvas_score_renderer.ts`, `canvas_viewport.ts`, `canvas_visible_range.ts`, `canvas_coordinate.ts`, `canvas_grid_renderer.ts`, `canvas_item_builder.ts`, `canvas_note_renderer.ts`, `canvas_marker_renderer.ts`, `canvas_note_colors.ts`, `canvas_theme.ts`, and `canvas_types.ts`
- remaining report-commentary work should continue module-by-module outside active `regression-code/`; likely next candidates are app playback, audio scheduling/playback, game/practice mode, examples/manual support, edit/history/range-selection, and smaller UI helper modules
- `docs/2.3-audio-playback-module-spec.md` defines the audio generator, playback controller, lookahead scheduler, and Web Audio backend structure
- `docs/2.7-youtube-sync-ui-spec.md` defines YouTube mode, `musicData.youtube` usage, iframe player sync, offset semantics, YouTube-panel video/offset editing, and Reload policy
- YouTube sync first pass is implemented: the right panel owns video/offset input even while mode is off/error, Details no longer edits YouTube fields, `Reload` updates `musicData.youtube` and `updatedAt`, the IFrame API is lazy-loaded, playback play/pause/stop/seek drives the player as a follower, and URL/offset helpers have unit coverage
- `docs/2.8-edit-invalidation-and-partial-rebuild-spec.md` defines note/global/mixed/structure edit invalidation groups, renderer item grouping, layer redraw boundaries, and the first partial rebuild staging policy
- partial rebuild implementation now includes `src/orchestration/partial_rebuild/`, `eventId`-based event diffing, note/global renderer group patching, edited-track parsed/analyzer reuse, and app-level partial render planning
- renderer layer separation now uses layout/base/global marker/note marker/note canvases; note edits avoid base/global marker redraw, global edits avoid note item redraw, and note marker redraw is kept broad enough to avoid gliss/orphan artifacts
- long-score edit profiling showed the initial `apply raw text + rebuild artifacts` bottleneck was reduced by replacing whole-ScoreFile JSON deep clone with targeted track/global cell array cloning and by reusing parsed document groups
- drag editing now batches pointermove-generated score edits by `requestAnimationFrame`, with pointerup/pointercancel flushing pending edits, to reduce repeated rebuild/render/playback-reset work during fast drags
- the app boot template score now lives at `regression-code/src/assets/templates/default-score.json`; it keeps the default instrument/layout/global rows but starts with default music metadata and empty tracks, while dev fixtures under `regression-code/dev/test_cases/` remain test-only inputs
- long-score viewport bounded rendering first pass is implemented: static row background stays fixed, dynamic grid/global marker/note marker/note layers render only the current viewport plus overscan, scroll redraw is merged through `requestAnimationFrame`, and visible item filtering uses tick-range indexes for note/global text/marker groups
- View menu runtime options are connected: Speed scales renderer column width from `1.0x` to `4.0x` without changing timing/audio seconds, Text Scale was removed, and Text off hides note `displayText` plus mute text while keeping global row rawText visible
- Loop UI first pass is connected as runtime view state: Loop on/off, First/Last defaults, `Select Column` pick mode, repeated boundary picking, translucent bottom loop markers, edit-mode disabling/off behavior, and score/layout/column reset behavior are implemented; playback looping remains a follow-up connection task
- Range selection edit first pass is implemented: edit mode supports `Ctrl + left drag` range selection, one-piece selection overlay including visual gaps, Delete/Backspace bulk delete, internal Ctrl+C clipboard, Ctrl+V paste preserving original rowIds, and automatic selection clear after delete/paste
- Paste preview is implemented as a lightweight DOM overlay: after Ctrl+C, mouse x movement over the score sets the paste column without requiring a click, preview rectangles follow the copied cell footprint, y position preserves source rowIds, and preview rectangle height matches the 21px note render height scaled by current zoom
- Undo / Redo first pass is implemented around `CellHistoryPatch` before/after rawText records for note/global cell edits: Undo/Redo buttons, `Ctrl+Z`, `Ctrl+Y`, `Ctrl+Shift+Z` / `Cmd+Shift+Z`, session-only 50-entry history, score-load/structure-change history reset, and drag edit transaction grouping are connected; Details metadata edit and YouTube metadata reload remain excluded from the first undo scope
- Runtime performance profiler instrumentation is connected for broad bottleneck exploration: `?perf=1` or `window.spredPerf.enable()` turns on console timing groups for app render, score text edit orchestration, runtime artifact rebuild, partial render patching, playback reset, playback toggle/RAF/lookahead, audio schedule building, renderer layout, visible filtering, canvas resize, and draw phases
- Performance stabilization is sufficient for the next feature stage: desktop playback is smooth, Chrome 4x/6x CPU-throttled testing identified and reduced seek UI overhead, RAF-based playback follow scroll was kept for visual smoothness, and a 2019 low-power i5-10210U / 8GB RAM laptop can play scores normally with only minor frame drops
- Game / practice mode UI skeleton is now connected: practice mode toggle, compact split player/practice panel, microphone permission request, disabled edit/seek/loop/layout/file controls during practice mode, active track changes allowed only while practice is ready/stopped, and 3-2-1 countdown with beep before playback
- Game pitch visualization first pass is implemented with `pitchy`, microphone pitch frame loop, clarity/RMS/frequency range filtering, runtime `GamePitchFrame`, and a green pitch dot overlay near the playback boundary
- Practice pitch correction experiments were rolled back: target-based octave correction, harmonic correction, and hysteresis lock are removed; pitch dot display and scoring now use detector raw pitch before pitch-class error comparison
- Practice judging is connected: each score-eligible scoring sample displays `Perfect`/`Ok`/`Bad`/`Miss` text above the hit target note for `500ms`, `Perfect`/`Ok`/`Bad` include `COMBO n`, `Miss` hides combo text and resets combo, text uses outline shadow without a background rectangle, combo text is always white, and the current overlay font sizes are combo `15px`, label `21px`, timing `12px`
- Practice accuracy display uses one decimal place in the live panel and result dialog, `Miss` samples count as `0%`, and pitch/timing accuracy weights now use the four-step `100% / 66.7% / 33.3% / 0%` policy
- Practice timing judgment is connected: onset candidates come from `unvoiced -> voiced` or sufficient pitch-class change, `<80ms` is on-time, `80-149ms` shows small `early` / `late`, `150-249ms` downgrades the final pitch label to `Bad`, `250ms+` downgrades it to `Miss`, each note/onset is consumed once, and very short same-pitch consecutive notes avoid forced timing downgrade
- Practice result dialog now groups pitch and timing summaries into two columns: `Pitch Accuracy` / `Timing Accuracy`, `Total Score` / `Max Combo`, then `Perfect/Ok/Bad/Miss` beside `Early/Late/Bad (timing)/Miss (timing)`; active track listing was removed from the result screen
- Practice mode opening now auto-exits edit mode by setting `AppState.mode` to `view`; `syncUiControls()` also forces the edit toggle checked/pressed state from `AppState.mode`, so a disabled checked edit toggle is not left visible during practice lock
- Practice effect bonus first pass is connected for gliss and vib: active-track `GlissEvent` targets are split into fixed `250ms` intervals, vib bonus targets come from `NoteEvent.effects` with `vib: true`, short vib targets use relaxed minimum window/frame/direction-change thresholds for 2-tick cases around 160 BPM, failures have no penalty, and result/live UI keeps separated `Gliss!` / `Vib!` / `Trem!` counts plus `effectBonusScore`; trem detection remains follow-up
- A no-onset timing anti-cheat attempt was rolled back after gliss-end / long-note neighbor structures proved too strict in real play; current timing judgment still only downgrades when an onset candidate is matched to a note start
- Attack credit / score eligibility first pass is implemented: attack-required notes without confirmed onset keep their internal pitch label but do not show judge overlay, do not update live/result pitch counts, receive `scoreContribution = 0`, combo does not increase, and gliss end targets are not blocked only because no onset was detected
- Practice target selection now prefers a currently active note over a previous note that remains only through transition grace when pitch error ties; this prevents a gliss-end F# target from stealing the following same-pitch F# note's onset credit
- Practice result dialog now shows `FULL COMBO` when at least one judged scoring sample exists and every judged scoring sample kept the combo chain for the current judge mode
- `docs/2.11-example-score-and-manual-support-spec.md` now defines the first Examples implementation as Supabase Edge Function based rather than local static example based: no local example Score JSON fallback, public examples without access word, tester examples with an optional temporary access word, reduced catalog table, current-score preservation on remote failure, and a dedicated `src/app/examples/` module boundary
- Examples first implementation is connected in `regression-code/src/app/examples/`: File > Examples opens an access-word dialog, calls the Supabase `get-example-manifest` Edge Function, validates the manifest, fetches selected public Storage Score JSON, and reuses the existing Score JSON load pipeline
- Examples public/extra list follow-up is implemented: opening Examples now auto-loads public examples without an access word, the access-word button is labeled `Load Extra List`, wrong non-empty access words preserve the current score/list while showing an error, and `regression-code/dev/example_catalog_generator.html` now generates rows for `public` / `extra` / `hidden` list visibility
- Help > Manual now opens a first-pass static manual at `regression-code/public/manual/index.html`; the Korean manual is considered complete until user-test feedback, shared manual CSS has been split to `regression-code/public/manual/manual.css`, and the English manual lives at `regression-code/public/manual/en/index.html`
- `regression-code/dev/example_catalog_generator.html` is a browser-only local helper that reads selected Score JSON files and generates `example_scores` upsert SQL from existing bucket object filenames; it does not upload files or call Supabase
- score comment length is now `500` characters across docs, validation, Details metadata editing, and dev tests; the Details comment textarea defaults to `rows="10"` so ordinary credit text is visible before manual resize
- bundled layout preset support is connected for slot 1: `Normal Score` lives under `regression-code/src/assets/templates/`, targets `otamatone-basic`, uses C3-C6 note rows only, sets each note row to `21px`, and is returned when slot 1 has no user localStorage preset
- Gliss effect bonus now uses a lenient judge window around the original gliss duration, adding `50%` duration up to `150ms` as front/back grace while clamping target pitch interpolation to the original gliss range
- Practice Pro Mode is now specified but not implemented: it is session-only, uses stricter pitch thresholds `<30/<60/<100/>=100 cent`, stricter timing thresholds `<50/50-99/100-149/>=150ms`, applies red practice UI accent, keeps score/effect policies unchanged, and resets combo on Bad only in Pro Mode
- Practice notice wording now recommends only a microphone and quiet place; headset recommendation was removed because connected playback devices can affect browser/OS input routing or audio processing behavior
- Audio chord clipping stabilization is connected: same-pitch overlap still uses duplicate-count scaling, 2-pitch chords keep full gain, 3+ pitch groups use `sqrt(2 / pitchGroupCount)` schedule gain, and the oscillator backend now routes master output through a `DynamicsCompressorNode` limiter
- Info dialog copyright/distribution notice has been expanded in English and Korean, covering app scope, no upload/download/cache/extract/share services, official embed-only external video playback, user rights responsibility, permitted example material scope, and takedown contact `odogihapmatone@gmail.com`
- Expand right now relies on the global `MAX_SCORE_COLUMN_COUNT` limit instead of a separate one-action column cap
- renderer DPR downscaling still caps very large bitmap allocation, but long-score scroll/render no longer depends on full-score-width dynamic layer redraw; tile rendering remains a later optimization only if viewport bounded rendering proves insufficient
- first GitHub Pages user-test deployment was prepared through a separate local `regression-code-test-publish/` copy and pushed to `B935342LYS/spredtest`; the publish copy uses `base: "./"`, a short Korean README, `.gitignore`, and a GitHub Actions Pages workflow with Node 24 and `npm install`/`npm run build`
- the deployment staging repo `regression-code-test-publish/` has been synced and pushed through commit `9bec0a9 Add bundled Normal Score layout`; this includes the public Examples follow-up, 500-character comment support, Details comment 10-row height, and bundled slot 1 Normal Score layout preset
- after a short real-use test, the edit-mode click-cycle change was reverted in deployment staging through commit `23ddca8 Revert "Align click edit cycle with drag cycle"` and GitHub Pages run `28709956567` succeeded; the previous click behavior is again the intended stable behavior
- `regression-code-test-publish/` is a local deployment staging copy, not part of the main SPRED repository; the root `.gitignore` excludes test publish/deploy copies so future deployment staging folders are not committed into the original workspace
- third-extension MIDI import experiment work was moved out of `regression-code/` into local `regression-code-extend/` after publishing experimental commit `442a922 Add MIDI import experiment` to `B935342LYS/SPRED_extend`; the stable `B935342LYS/SPRED` repository keeps `regression-code/` at `21d7d82 구간 연습 지원`
- latest verified commands: active `npm run test:edit`, `npm run typecheck`, `npm run build`; deployment staging `npm run typecheck`, `npm run build`; report-prep `powershell -ExecutionPolicy Bypass -File tools\extract-codex-report-log.ps1` and `powershell -ExecutionPolicy Bypass -File tools\summarize-codex-report-sessions.ps1`; previous broader verification also included `npm run test:score`, `npm run test:layout`, `npm run test:examples`, `npm run test:game`, `npm run test:parse`, `npm run test:view`, `npm run test:analyze`, `npm run test:audio`, `npm run test:youtube`, and `npx tsc --noEmit --noUnusedLocals --noUnusedParameters`

Deferred planned work:
- report writing:
  - use `docs/report-prep/session-summaries/daily-timeline.md` and `docs/report-prep/second-extension-report-outline.md` as the next starting point
  - split the report into manageable sections because 2026-06-19 이후 work is too broad for a single uninterrupted draft pass
  - before writing final prose, cross-check each section against `docs/HARNESS.md`, `docs/implementation-memo/`, and representative git commits
  - exclude raw transcript content, personal situational notes, and long tool outputs from any externally shared report
  - continue dense code-reading comments only in `regression-code-report-commentary/`, keeping `regression-code/` clean for behavior changes and deployment
  - after moving machines, first check `.gitignore`, `docs/4.0-second-extension-report-guide.md`, and this `HARNESS` section before resuming commentary work
- long-score performance roadmap:
  - first viewport bounded rendering target is implemented and should be rechecked on lower-end laptops with real 9000+ column scores
  - use the runtime profiler to compare initial/full render, single edit, drag edit, range paste/delete, and scroll redraw before choosing the next optimization target
  - current desktop and 2019 low-power i5 laptop checks are sufficient to move forward; additional optimization should be driven by concrete future regression or user-test evidence
  - if remaining lag appears, next candidates are tile/chunk rendering for dynamic layers, time-budget based scroll redraw throttling, and further note marker visibility indexing
  - after render scope is bounded, remaining edit latency can be reduced with runtime index partial update, analyzer range partial, or dirty-column rebuild around changed cells
- first partial rebuild staging target is implemented for ordinary rawText edits; remaining work is runtime index/audio partial update and any additional viewport/tile optimization proven necessary by testing
- verify the current edit/analyze/render path through JSON download/load round trip with saved local files
- manually verify active track UI behavior in browser, including empty active track state, inactive alpha visibility, multi-track edit overwrite, playing-state toggle lock, paused-state toggle resume, and playback reset
- expand manual and browser-level tests for vibrato, tremolo, gliss fallback, connected gliss chain, seek, pause/resume, and layout-change playback reset behavior
- continue user-test verification of the GitHub Pages build, especially YouTube mode with real embeddable and embedding-blocked videos, including offset tuning, Reload, seek, pause/resume, stop, score load, and empty video input behavior
- next Examples work is to verify the deployed public/extra/hidden list behavior against actual Supabase rows, then continue verification with all Supabase Storage score files, public `score_url` direct-open checks, manifest list rendering, each Example Load path, broken JSON/URL failure preservation, and practice-mode lock behavior
- continue modifier bonus judging for trem and real-microphone vib tuning; vib now has first-pass target-near oscillation checks and short-target relaxation, while trem should reuse RMS envelope/onset data without adding heavy real-time analysis
- continue timing anti-cheat tuning after the attack credit first pass, especially gliss-neighbor, hold/vib, tuplet same-pitch, and real-microphone onset quality cases
- implement the specified session-only Pro Mode after Trem/Rules priorities are settled: Pro toggle near Sync, red accent state, mode-specific pitch/timing thresholds, mode-specific combo reset, result mode display, and unit/browser verification
- connect Loop UI range to playback controller/scheduler behavior and confirm interaction with YouTube follower playback
- connect dynamics automation and refined tuplet timing behavior to the audio generator
- add loop playback range selection and scheduler/controller support after YouTube sync
- evaluate Tone.js or sampled-instrument backends after the native Web Audio event path is stable
- continue visual hit-test/edit UX tuning for tuplet containers and complex token anchors
- continue moving app orchestration out of `main.ts` when stable extraction points appear
- consider explicit local layout slot clear/delete UI after practical preset usage feedback
- define a production build path that strips or minifies comments for GitHub Pages deployment

## 11. Current Boundary Notes

- `1.4` and `1.5`
  - note-string explanation overlaps, implementation baseline is `1.5`
- `1.3` and `1.8`
  - `1.3` covers storage format, `1.8` covers runtime interfaces
- `1.7` and actual code implementation
  - analyzer type contracts now include `sourceCells`, partial analysis, and cache structures; note/gliss/mute/tuplet event algorithms are partially implemented in `regression-code/src/core/analyze/`
- `1.9` and actual MVP implementation
  - `1.9` intentionally narrows the broad analyzer/renderer/audio goals to default note text, `"-"` hold, minimum renderer, and basic audio/playback
- `2.0` and actual UI shell
  - static HTML/CSS UI structure exists and the first edit state path is connected to TypeScript
  - many controls remain placeholders, but Edit Mode, Default CUSTOM, zoom change, canvas render, and status line are connected
- `2.0` and `2.7`
  - `2.0` treated YouTube as an MVP placeholder; `2.7` is the later active implementation spec that turns the prepared right-side YouTube area into a synced iframe mode
- `2.1` and actual renderer modules
  - renderer module boundaries are implemented for layout/base grid and the first analyzer-driven note layer path
  - `1.9` says renderer consumes `AnalysisResult`; for current implementation this is interpreted as the broad render pipeline, while draw-layer modules consume canvas DTOs and `AnalysisResult` interpretation is isolated to the future `canvas_item_builder.ts`
  - app/controller adapter converts `RuntimeDocument` to `CanvasRenderInput`; analyzer output is converted to note items in renderer-side `canvas_item_builder.ts`
- `2.2` and actual edit mode implementation
  - minimal CUSTOM edit, empty-input delete, right-click delete, modifier composition, and tuplet draft/finalize support are partially implemented
  - mobile edit mode and advanced edit UX are still out of initial scope
- `1.0` and current implementation state
  - `1.0` keeps long-term stage goals, current-state tracking belongs here in `HARNESS`
- `1.0-roadmap` and actual first-stage implementation
  - `score_validate.ts` was originally deferred, but minimum validation was added early to avoid unstable ScoreFile assumptions before index building

## 12. Cleanup Principles

- prefer active documents over reference, appendix, or archive material when implementation guidance conflicts
- keep the implementation baseline concentrated in as few active documents as practical
- when implementation stage or active path changes significantly, update both `docs/1.0-development-spec.md` and `docs/HARNESS.md`

## 13. Update Rules

Update this file when one of the following happens:

1. an active document is added or removed
2. implementation priority changes
3. a new overlap or contradiction is found
4. the center of reference for implementation work shifts significantly
5. active implementation path or archive path changes
