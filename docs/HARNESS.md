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
  - 2026-10-16: staged plan in `docs/4.2-code-commentary-plan.md`; all stages 1–13 completed (108/108 files); final hash/syntax/comment-contract/typecheck/build audit passed
  - previous commentary completion status does not carry over; current completion is tracked in README-commentary.md and the staged plan
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
- `docs/3.11-midi-import-spec.md` — MIDI 확정 정책; 미확정 절은 협의 초안
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
- current product baseline: `b73dda6 ScoreFile 명세구현 구멍 메우기`, followed by the 2026-10-30 pre-MIDI stabilization checkpoint; see section 9 for deployment and verification

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

### 2026-10-30 MIDI 구현 전 안정 상태 고정

- 제품 기준은 `regression-code/`의 `b73dda6`이다. MIDI import 활성 작업본 구현은 미착수이며, 정책 기준은 `3.11-midi-import-spec.md`다. 다음 논의는 일대일 유지 또는 다대일 허용 여부이다.
- 최신 ScoreFile 구조 검증·비차단 경고·날짜 보완·레이아웃 허용 정책과 관련 UI/검사 16개 파일을 배포본에 동기화했다. 배포용 package-lock.json과 CI 설정은 유지했다.
- 배포 저장소 `B935342LYS/spredtest`의 `main`에 `1d8d7d4` (`10.30 MIDI구현 시도 전 안정적 상태 고정`)를 커밋·푸시했다.
- [Pages 실행 40931291538](https://github.com/B935342LYS/spredtest/actions/runs/40931291538)의 build/deploy 모두 success. 공개 페이지와 연결된 JS/CSS HTTP 200 및 새 로드 경고 UI 마크업을 확인했다. 브라우저 상호작용 재검증은 수행하지 않았다.
- 원본과 배포본의 추적 대상 `src/`, `styles/`, `public/`, `scripts/` 파일 hash 차이는 0개다. 배포 사본 작업 트리는 커밋 후 깨끗하다.
- 원본 및 배포본에서 `npm run build`(타입·라이선스 검사 포함), `test:score`, `test:layout`, `test:edit`, `test:parse`, `test:analyze`, `test:examples`가 모두 통과했다. 두 로컬 빌드의 JS/CSS 산출물 이름도 일치한다.
- `test:view`의 알려진 과거 기대값 문제는 이번 범위에서 수정·재검사하지 않았다. 실제 마이크·청감 검증은 수행하지 않았다.
- MIDI 명세와 후보 문서·하네스 변경은 원본 안정화 커밋에 포함한다. `docs/report-prep/2026-10-week5-midi-policy.md`는 `.gitignore`의 `docs/report-prep/` 규칙에 따라 로컬 전용으로 유지한다.
- 아래 날짜별 기록의 미배포·미커밋 표시는 당시 상태이며, 현재 상태는 이 체크포인트를 우선한다.


### 다음 대화 재개 지점 — 2026-10-30

- 졸업전시 팜플렛 작성·검토를 마치고 MIDI import 설계 논의로 복귀했다. 팜플렛 메일의 실제 발송 여부는 확인하지 않았다.
- 현재 읽을 문서: [3.11 MIDI Import 명세](3.11-midi-import-spec.md), [10월 5주차 보고서용 문단·표](report-prep/2026-10-week5-midi-policy.md). 실험본 한계는 3.10의 29절 참고.
- 확정 정책: 기존 악보에 병합하지 않고 새 ScoreFile 생성; 제목·아티스트·장르 Unknown, 작성자 Anonymous, 코멘트 빈 문자열; MIDI 텍스트/파일명의 곡 metadata 자동 대입 제외; 생성 후 Details에서 직접 입력; 기존 생성·저장 시각 정책 사용.
- 확정 UI 방향: MIDI import 버튼으로 파일 입력 → 원본 트랙 목록 표시 → 사용자가 basic/optional/extra 대상 레이어 지정.
- **첫 논의 항목은 일대일 유지 또는 다대일 병합 허용 여부이다.** 사용자는 최초 일대일을 선택한 후 여러 MIDI 트랙을 같은 대상에 배정하는 경우의 구현 난도를 질문했다. 다대일의 구현 가능성과 충돌 문제를 설명했으나 최종 선택은 아직 없다.
- 기존 악보와 MIDI를 합치는 기능은 제외로 확정했다. 여러 MIDI 트랙을 새 악보의 한 레이어로 합치는 다대일 여부와 혼동하지 않는다.
- 그 다음은 채널/음표 없는 트랙, layout, 양자화·동일 음 중첩·충돌, 템포/박자, 지원 범위와 손실 보고·적용 절차 순으로 협의한다. 기존 제안이나 실험본 기본값을 승인된 정책으로 간주하지 않는다.
- 사용자 작업 방식: 정책을 순서대로 논의·확정할 때마다 명세와 10월 5주차 보고서용 문단·표를 함께 갱신한다. 설계 결정과 구현 완료 표현을 구분한다.
- 원본 코드 기준 커밋: b73dda6 (ScoreFile 명세구현 구멍 메우기). MIDI 활성 작업본 구현은 미착수이며, 이번 세션은 문서만 수정했다. 커밋·배포는 하지 않았다.
- 이번 문서 변경: docs/3.11 신규, docs/HARNESS 및 docs/3.3 갱신, docs/report-prep/2026-10-week5-midi-policy.md 신규. report-prep 파일은 로컬에는 존재하나 현재 git status에 표시되지 않으므로 이후 커밋 시 추적/ignore 여부를 별도로 확인한다.


### 2026-10-30 MIDI Import 정책 명세 초안 작성

- [3.11 MIDI Import 명세](3.11-midi-import-spec.md)는 현재 확정된 정책의 기준이다. 미확정 절은 구현 승인으로 해석하지 않는다.
- 확정: 새 ScoreFile 생성, 곡 메타데이터 자동 추출/추정 제외 및 기존 기본값 사용, Details 수동 입력, 전용 MIDI import UI에서 원본 트랙 목록과 대상 레이어 수동 배정.
- 배정 관계: 최초 일대일 선택 이후 다대일 병합 가능성을 질문·검토한 상태다. 다대일 채택도 일대일 최종 고정도 아직 확정하지 않는다.
- 다음 협의: 배정 관계 → 채널/전역 전용 트랙 → layout → 양자화·중첩·충돌 → 템포/박자·지원 범위 → 경고·적용·검증.
- [10월 5주차 보고서용 문단·표](report-prep/2026-10-week5-midi-policy.md)를 함께 작성했다. 이번 작업은 문서 정리이며 MIDI 제품 구현·배포는 하지 않았다.


### 2026-10-26 ScoreFile 검증·허용 정책 보강 완료

- 사용자 확정 정책에 따라 spred-sheet/0.0.1 지원 목록, 중첩 객체·배열, ID·행 종류·전역 종류 유일성, 악기 MIDI·열 너비, 트랙 note 행 참조 검사를 보강했다.
- 날짜 누락/오류/역전, 개방현 정보 불일치, 악기 설정 음역 밖 note 행, 전역 parser 오류는 로드를 허용하고 비차단 경고로 모아 표시한다. 전역 시작 셀의 존재는 여전히 필수다.
- 작성 시각은 원본 보존 후 명시 저장에서만 필요 시 보완한다. 정상 날짜·선택 난이도·presetId 생략은 보존한다. Details는 비문자열 날짜를 안전하게 표시한다.
- 행 추가와 별도 레이아웃 프리셋도 음역 밖 MIDI 및 빈 표시명을 허용한다. 읽기 전용 openMidi는 레이아웃 적용만으로 생성·삭제하지 않는다.
- 새 score_warnings.ts는 시각 판별과 비차단 경고 수집을 담당한다. parser/analyzer/renderer/audio 알고리즘 변경이나 외부 소스 재사용은 없다.
- 검증: build(타입·라이선스 포함), test:score/layout/edit/parse/analyze/examples 통과. test:score에 구조 거부·경고 원본 보존·저장 보완·프리셋 왕복 회귀 검사를 연결했다.
- Chrome: 경고 펼치기, Details, 레이아웃 개방현 누락 보존, JSON 저장 시 날짜 보완, 손상된 현 객체 거부 확인; pageerror 0개.
- 작업본 regression-code와 명세 1.3/2.4/2.5 반영. 해설본·배포본 갱신과 커밋·배포는 이번 작업 범위에 포함하지 않았다. 상세 기록: 3.10의 31절.


### 2026-10-22 MIDI 선행 구조 개선 배포 완료

- 사용자 요청으로 원본 `5b0b526`의 선택 metadata/명시적 로드 결과 변경을 배포 사본에 반영했다. 제품 9개·관련 검사 4개 파일을 동기화하고 배포용 lock/설정 및 해설본은 유지했다.
- spredtest main `63ac629c05a4bbccd03fb0e0aa4a320007202974` 커밋·push 완료. [Pages 실행 39775046650](https://github.com/B935342LYS/spredtest/actions/runs/39775046650)의 build/deploy success. 아래 10월 20일 미커밋·미배포는 당시 기록이다.
- 배포본 build(타입·라이선스 검사 포함), test:score/layout/game/examples 통과. test:view 기존 Fit Height 기대값 문제는 이번 배포에서 수정하지 않았다.
- 공개 사이트 Chrome 검사: 선택 metadata 없는 JSON 로드, Details의 0 표시, 레이아웃 창 열기, 다운로드의 필드 생략 유지, 잘못된 JSON 로드 후 기존 악보 보존, pageerror 0개 확인. 공개 JS는 raw 템플릿 CRLF escape 정규화 후 로컬 배포 bundle과 일치한다. 실제 마이크·청감 검증을 뜻하지 않는다.
- 배포 저장소 작업 트리는 깨끗하다. 원본의 이번 변경은 이미 사용자 커밋에 포함되어 있었으며, 에이전트는 배포 현황 문서만 추가 갱신했다. MIDI 설계는 이후 작업이다.

### 2026-10-20 선택 metadata·명시적 로드 결과 반영

- 사용자 결정으로 난이도 객체/개별 트랙 값과 ScoreFile presetId는 선택값으로 변경했다. 누락 난이도는 Details 0, Practice 기존 1/2/3 기본값; presetId는 custom 계열로 취급한다. 로드·단순 저장은 생략 상태를 보존하며 별도 프리셋 생성 시 custom을 기록한다. 1.3/2.5 갱신.
- R1의 필수 검사 강화 권고는 위 결정으로 대체한다. R2 로드 함수는 boolean 결과를 직접 반환하고 Examples가 이를 사용한다. 기존 출력 예외 전파 정책 유지. R3 객체 진입점은 보류한다.
- build 및 score/layout/game/examples 검사, Chrome 로드 계약·선택 metadata UI·기존 비동기 수명 검사 통과. 상세는 [3.10 30절](3.10-code-structure-review.md#30-선택-metadata-정책-변경-및-로드-결과-계약-구현--2026-10-20). 이번 제품 변경은 미커밋·미배포이며 해설본은 변경하지 않았다.

### 2026-10-20 MIDI 검토·구조 개선 후보 선정

- 사용자 채택 순서: MIDI 요구사항/실험본 검토 → 제한된 구조 개선 → MIDI 구현 → 음정 개선.상세는 [3.10 29절](3.10-code-structure-review.md#29-midi-import-재검토와-다음-구조-개선-후보--2026-10-20).
- 실험본 test:midi/typecheck 통과. 템포 변화·박자 분모 미반영, 같은 시작 칸만 단선율 처리하는 한계, 단일 target 할당·고정 UI·진단 누락을 확인했다. 제품 전체 병합 대신 변환 모듈과 fixture를 선별 검토한다.
- 우선 후보 R1은 presetId/난이도 필수 필드 검증 누락 보완, R2는 악보 로드 명시적 결과 계약이다. R3 객체 입력 공통 진입점은 이후 필요성 판단. 대형 파일 일괄 분리·Practice 전면 개편은 선행 범위에서 제외한다.
- MIDI 선택/할당·양자화·layout·템포/박자 및 실패 복구 정책은 구현 전 확정해야 한다. 이번에는 검토와 문서 기록만 수행했으며 제품·실험본 코드는 수정하지 않았다.

### 2026-10-20 라이선스 변경 검사 및 배포 완료

- 사용자 결정: Examples 등록 전 권리 검토는 소유자가 직접 수행하며, 매뉴얼 이미지는 직접 촬영한 프로그램 스크린샷만 사용한다. 권리 metadata 등록 강제·이미지 출처 관리 기능은 추가하지 않는다. 이번 후속 범위는 의존성 고지 누락 검사와 배포다.
- `scripts/license-inventory.json`에 사용 중인 pitchy/fft.js 및 Vite helper의 버전·라이선스·원문 구간 SHA-256을 기록했다. `check-licenses.mjs`는 lock의 전이 runtime 의존성, 설치 버전/원문, HTML/다운로드 고지, 실제 번들 목록과 dist 고지 일치를 검사한다. npm run build 전후에 실행되어 CI에서도 누락 시 배포를 막는다. 외부 라이선스의 적합성을 자동 판정하는 도구는 아니다.
- 의존성 갱신 시 원문과 사용 조건을 사람이 검토하고 고지 HTML/텍스트 및 inventory의 버전·원문 hash를 함께 갱신해야 한다. 새 runtime 라이브러리는 inventory 등록 및 고지가 필요하다. README 원문과 Vite helper 누락은 정적 고지로 계속 보완한다.
- 검증: 제품 및 배포 사본 build(TypeScript 검사 포함) 통과. 격리 임시 fixture에서 새 runtime 의존성·버전 변경·HTML 고지 누락·원문 변경·새 번들 의존성·dist 고지 누락 6개를 모두 차단하고 원상 복구한 fixture의 통과를 확인했다.
- 배포 저장소의 lock과 기존 변경은 보존하고 이번 11개 파일만 커밋했다. spredtest main `1592c1f6ed644efa32c471fa9377dfddf467238c` push 완료. Pages 실행: https://github.com/B935342LYS/spredtest/actions/runs/39336772367 . Pages build/deploy 모두 success. 공개 Help > Licenses 새 탭·opener 차단·고지 3개·390/1280px 넘침 없음·원문 다운로드·pageerror 0개를 Chrome에서 확인했다. 고지 HTML/CSS/텍스트/자동 목록은 HTTP 200 및 LF 정규화 후 로컬 dist와 일치한다. 공개 JS는 번들에 포함된 raw 악보 템플릿의 CRLF escape를 정규화한 뒤 로컬과 일치한다(바이트 동일 주장 아님). 배포 저장소 작업 트리는 깨끗하며 원본 작업공간의 기존 미커밋 문서·해설 계획은 보존했다.

### 2026-10-20 오픈소스 고지 페이지 구현 완료

- 사용자 선택으로 Help > Licenses를 추가했다. `public/licenses/index.html`을 별도 탭으로 열며 pitchy 4.1.0, fft.js 4.0.4, Vite 8.0.14의 번들 보조 코드에 관한 MIT 원문·저작권·출처 및 다운로드용 THIRD-PARTY-NOTICES.txt를 제공한다. 악보 데이터/파서/분석기/렌더러/오디오 동작 변경 없음.
- 설치된 버전의 pitchy/LICENSE, fft.js/README.md LICENSE 절, Vite/LICENSE.md core 절을 원문으로 복제했다. 라이선스 고지 텍스트 재배포이며 외부 알고리즘 코드를 복사·수정한 작업은 아니다. Pitchy 최신 브랜치의 0BSD와 사용 중인 4.1.0의 MIT를 구분한다.
- Vite build.license로 `dist/licenses/bundled-dependencies.md`를 추가 생성한다. 자동 수집은 fft.js README의 원문과 Vite 가상 모듈 고지를 완전히 포함하지 않으므로 수동 고지 파일을 대체하지 않는다. 의존성 갱신 시 목록·버전·원문을 재검토해야 한다.
- 참조: https://github.com/ianprime0509/pitchy/blob/v4.1.0/LICENSE , https://github.com/indutny/fft.js/blob/v4.0.4/README.md#license , https://github.com/vitejs/vite/blob/v8.0.14/packages/vite/LICENSE.md , https://vite.dev/config/build-options.html#build-license . Vite 문서는 설정 참조이며 코드 차용 없음.
- 검증: 정식 build(TypeScript 검사 포함) 통과. 설치된 Chrome headless로 `/spredtest/` 하위 경로의 Help 버튼→새 탭, opener 차단, 고지 3개, 390/1280px 가로 넘침 없음, 원문 다운로드, 자동 생성 파일 HTTP 200, 앱 pageerror 0개 확인. 최초 루트 디렉터리 build 호출 및 검증 도구의 Windows import/미설치 Chromium 시도는 실패했으며 제품 디렉터리와 설치된 Chrome으로 최종 검증했다.
- 공개 배포/커밋은 하지 않았다. 배포 사본·해설본은 변경하지 않았다. Examples 권리 출처/허락 근거 표시와 공개 전 검증, 이미지 출처 관리, YouTube 약관·개인정보 안내 정비는 제안이며 아직 구현하지 않았다. 고지 페이지가 악보·음원·이미지의 이용 허락을 대신하지 않는다.

### 현재 재개 기준 — 2026-10-20

- 2차 구현 이후 구조 개선과 2026-10-16 테스트 사이트 배포를 완료했다. 새 해설본도 13단계, src TS 108/108개 파일의 해설 및 종합 검증을 완료했다. 제품 동작 기준은 `regression-code/`다.
- 아래 날짜별 기록은 누적 이력이다. 당시의 다음 작업·미완료·미배포·최신이라는 표현은 현재 지시가 아니다. 현재 요약은 10절을 우선한다.
- `test:view`의 Fit Height/footer 실패는 사용자가 2026-10-20 재확인한 대로 수정된 제품 코드에 과거 테스트 기대값을 갱신하지 않아 발생한 문제다. 제품 결함이나 새 구조 개선의 회귀로 분류하지 않는다. 기대값 갱신은 별도 유지보수 항목이며 이번에는 테스트 수정·재실행을 하지 않았다.
- 다음 후보는 구조 개선 재개, 오픈소스 라이선스 고지 페이지, 배음이 강한 입력 개선 실험, MIDI import 등 3차 확장이다. 이후 사용자 선택으로 오픈소스 고지 페이지를 구현했다(위 완료 기록). 나머지 후보는 후속 선택 대상으로 유지한다.
- 구조 개선을 선택해도 대형 파일 일괄 분리·설정 공용화·Practice 전체 상태 전이 개편·패턴 도입을 자동 승인된 범위로 해석하지 않는다. 확인된 문제와 최소 변경안을 먼저 검토한다.

### 해설 작업 누적 이력

- 2026-10-16: 4.2 해설 계획 전체 108/108 완료. 제품 원본 167개 hash·전체 TS 구문 동일성·주석 계약·typecheck/build 종합 검증 완료. 과거 아래 기록의 다음/미완료 표시는 당시 상태이다.

- 2026-10-16: 12H-4 main 전체 해설 완료. 누적 105/108. 다음은 13단계 세 파일과 전체 검증.

- 2026-10-16: 12H-3 main 드래그 이력・Undo/Redo・악보 로드 해설 완료. 전체 완료 104/108 유지. 다음은 session/기능 연결 12H-4.

- 2026-10-16: 12H-2 main 편집 확정/출력 복구 해설 완료. 전체 완료 104/108 유지. 다음은 드래그 이력/Undo/Redo 12H-3.

- 2026-10-16: 12H-1 main 부팅~위치 보존 재생 reset 해설 완료. 전체 완료 104/108 유지. 다음은 편집 실패 복구/확정 12H-2.

- 2026-10-16: 12G UI sync 전체 완료(104/108). 원본 hash·구문 동일성·typecheck/build 통과. 다음은 12H main.

- 2026-10-16: 12G-2 control~트랙 표시 해설 완료. 전체 완료 103/108 유지. 다음은 syncLayoutScroll부터 12G-3.

- 2026-10-16: 12G-1 UI 안내~붙여넣기 overlay 해설 완료. 전체 완료 103/108 유지. 다음은 syncUiControls부터 12G-2.

- 2026-10-16: 12F 화면 연결 전체 완료(103/108). 원본 hash·구문 동일성·typecheck/build 통과. 다음은 12G app_ui_sync.

- 2026-10-16: 12F-1 view binding 계약~applyTextOff 해설 완료. 전체 완료 102/108 유지. 다음은 toggleLoop부터 12F-2.

- 2026-10-16: 12E 화면 조작 helper 해설 완료(102/108). 원본 hash·구문 동일성·typecheck/build 통과. 다음은 12F app_view_binding.

- 2026-10-16: 12D 트랙 연결 해설 완료(101/108). 원본 hash·구문 동일성·typecheck/build 통과. 다음은 12E app_view_actions.

- 2026-10-16: 12C 파일/브라우저 저장 이벤트 해설 완료(100/108). 원본 hash·구문 동일성·typecheck/build 통과. 다음은 12D app_track_binding.

- 2026-10-16: 12B DOM 수집 해설 완료(99/108). 원본 hash·구문 동일성·typecheck/build 통과. 다음은 12C app_file_binding.

- 2026-10-16: 12A UI 보조 함수 세 파일 해설 완료(98/108). 원본 hash·구문 동일성·typecheck/build 통과. 다음은 12B app_dom.

- 2026-10-16: 11I Examples binding/11단계 전체 완료(95/108). 원본 hash·구문 동일성·typecheck/build 통과. 다음은 12A UI 보조 함수.

- 2026-10-16: 11H Examples dialog 전체 해설 완료(94/108). 원본 hash·구문 동일성·typecheck/build 통과. 다음은 11I Examples binding.

- 2026-10-16: 11H-1 Examples dialog 계약~resetExampleDialog 해설 완료. 전체 완료는 93/108 유지. 파일 전체 구문 동일성·typecheck/build 통과. 다음은 createExampleRow부터 11H-2.

- 2026-10-16: 11G provider 해설 완료(93/108). 원본 hash·주석 제외 구문 동일성·typecheck/build 통과. 다음은 11H Examples dialog.

- 2026-10-16: 11F manifest 검증 해설 완료(92/108). 원본 hash·주석 제외 구문 동일성·typecheck/build 통과. 다음은 11G provider.

- 2026-10-16: 11E Examples 타입/설정 해설 완료(91/108). 원본 hash·주석 제외 구문 동일성·typecheck/build 통과. 다음은 11F manifest 검증.

- 2026-10-16: 11D profiler 해설 완료(89/108). 원본 hash·주석 제외 구문 동일성·typecheck/build 통과. 다음은 11E Examples 타입/설정.

- 2026-10-16: 11C layout preset 슬롯 해설 완료(88/108). 원본 hash·주석 제외 구문 동일성·typecheck/build 통과. 다음은 11D perf_profiler.

- 2026-10-16: 11B 악보 저장·파일 입출력 해설 완료(87/108). 원본 hash·주석 제외 구문 동일성·typecheck/build 통과. 다음은 11C layout preset storage.

- 2026-10-16: 11A browser preferences commentary complete (85/108 files). Baseline hashes, comment-free syntax and typecheck/build passed. Next: 11B score_local_storage/score_file_io.

- 2026-10-16: 10K game binding and stage 10 fully complete (83/108 files). All 38 contracts, hash, comment-free syntax and typecheck/build passed. Next: 11A game/youtube preferences.

- 2026-10-16: 10K-2 exit/mode/Sync/marker commentary complete; 82/108 full files. Twenty-one prefix contracts, hash/syntax and typecheck/build passed. Next: 10K-3 DOM listeners and async microphone lifecycle.

- 2026-10-16: 10K-1 binding contracts/microphone/input commentary complete; 82/108 full files. Eleven scope contracts, full-file hash/syntax and typecheck/build passed. Next: 10K-2 exit/mode/Sync/marker controls.

- 2026-10-16: 10J sync preview complete (82/108 files). Fourteen contracts, baseline hash, comment-free syntax and typecheck/build passed. Next: 10K-1 game_binding contracts/microphone/session/input.

- 2026-10-16: 10I game UI commentary complete (81/108 files). Ten contracts, hash, comment-free syntax and typecheck/build passed. Next: 10J game_sync_preview, then 10K game_binding.

- 2026-10-16: 10H judge overlay commentary complete (80/108 files). Twelve contracts, hash, comment-free syntax and typecheck/build passed. Next: 10I game_ui.

- 2026-10-16: 10G pitch overlay commentary complete (79/108 files). Six contracts, hash, comment-free syntax and typecheck/build passed. Next: 10H game_judge_overlay.

- 2026-10-16: 10F effect judge fully complete (78/108 files). Six types and 40 function/callback contracts reviewed; baseline hash, comment-free syntax and typecheck/build passed. Next: 10G game_pitch_overlay.

- 2026-10-16: 10F-4 vib window/trend/direction commentary complete; 77/108 full files. Eleven scope contracts, hash/syntax and typecheck/build passed. Next: 10F-5 remaining target collection helpers and file audit.

- 2026-10-16: 10F-3 gliss judging/lock/helpers complete; 77/108 full files. Hash, comment-free syntax and typecheck/build passed. Next: 10F-4 vib window/trend/direction helpers.

- 2026-10-16: 10F-2 trem attack/synthetic hit commentary complete; 77/108 full files. Hash, comment-free syntax, five scope contracts and typecheck/build passed. Next: 10F-3 gliss judging/helpers.

- 2026-10-16: 10F-1 effect judge constants/six types/target collection complete; 77/108 full files. Hash, comment-free syntax and typecheck/build passed. Next: 10F-2 trem attack/synthetic hit judging.

- 2026-10-16: 10E game_judge fully complete (77/108 files). All 32 function/callback contracts, baseline hash, comment-free syntax and typecheck/build passed. Next: 10F-1 game_effect_judge contracts.

- 2026-10-16: 10E-3 timing/summary commentary complete; full-file count remains 76/108. Thirteen prefix contracts, full-file comment-free syntax and typecheck/build passed. Next: 10E-4 trem run/hit helpers.

- 2026-10-16: 10E-2 sample generation/target priority commentary complete; count remains 76/108. Nine prefix function contracts, full-file syntax equality and typecheck/build passed. Next: 10E-3 timing matching and summary updates.

- 2026-10-16: 10E-1 game_judge constants/options/Sync/target collection complete; full-file count stays 76/108. Hash, comment-free syntax and typecheck/build passed. Next: 10E-2 sample selection and target priority.

- 2026-10-16: 10D input history commentary complete (76/108 files). Baseline hash, comment-free syntax, 16 contracts and typecheck/build passed. Next: 10E-1 game_judge constants/options/target collection.

- 2026-10-16: 10B–10C pitch math/input commentary complete (75/108 files). Baseline hashes, comment-free syntax and typecheck/build passed. Next: 10D game_input_history.

- 2026-10-16: 10A game_types commentary complete; 73/108 files. Nine types and nine functions reviewed; baseline hash, comment-free syntax, typecheck/build passed. Next: 10B game_pitch_math, then 10C game_pitch_input.

- 2026-10-16: stages 1–9 commentary complete (72/108 files). YouTube sync/types/URL verified with baseline hashes, comment-free TypeScript equality and typecheck/build. Next: 10A game_types.

- 2026-10-16: 9F player lifecycle commentary complete; 69/108 files complete. Hash, comment-free TypeScript equality, typecheck/build passed. Next: 9G youtube_sync.

### 2026-10-16 9F-1 완료 — iframe API 공유 준비

- `youtube_player.ts`의 외부 player/옵션/namespace/Window 계약과 `loadYoutubeIframeApi`·`waitForApi` 해설을 추가했다. 파일 전체 완료는 아니다.
- 공유 API Promise와 10초 준비 제한, 기존 전역 콜백 보존·동일 참조일 때 복구·단일 결과 확정과 실패 script 제거를 설명했다.
- 실패 캐시의 참조 비교/초기화로 Reload 재시도 허용, 개별 AbortSignal은 공유 스크립트 로드를 중단하지 않고 호출자의 대기만 거부하는 경계를 명시했다.
- 외부 API 메서드와 생성자/이벤트 계약, Window 타입 확장과 실제 런타임 속성의 차이, 공유 준비 완료 후 취소 listener 해제를 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 함수/콜백/타입 계약 JSDoc 21개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 68/108 유지. 다음 9F-2는 `createYoutubePlayer`의 독립 mount·준비/오류·취소·반환 handle이다.


### 2026-10-16 9E-3 완료 — YouTube binding 완료

- `youtube_binding.ts`의 위치 정렬/드리프트/시작 경계/helper 함수 9개·타이머 콜백 2개 해설을 추가하고 파일 전체를 완료했다.
- 준비 상태 검사·합산 offset의 영상 시작 전 0초 대기, 강제 seek/시작 경계/냉각 간격 분기, 반환 true가 매번 seek 수행을 뜻하지 않음을 설명했다.
- 주기 확인 중 상태 종료·경계 통과 play·오차 정책 위임과 500ms 벽시계 냉각 간격을 명시했다.
- HTML 범위와 저장 검증 분리, 시작 타이머 단일 예약·최신 위치 재검사·아직 경계 전 재예약·늦은 실행에서도 영상 0초 시작을 설명했다.
- 현재 시각 정렬 helper의 options 인수/boolean 반환 계약을 보완했다.
- 파일 전체 함수/콜백/구현 메서드 37개와 메서드 계약 9개 JSDoc 점검 완료. 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 68/108 파일 완료. 다음 9F는 `src/app/youtube/youtube_player.ts`의 iframe API 준비와 player 수명이다.


### 2026-10-16 9E-2 완료 — 입력 확정과 외부 제어

- `youtube_binding.ts`의 `saveMetadata`부터 패널 이벤트와 반환 제어 객체까지 함수 5개·콜백 5개·구현 메서드 5개를 추가 해설했다. 파일 전체 완료는 아니다.
- 메타데이터만 갱신하고 분석/runtime은 유지하는 경계, 참조 동일성 무변경 판정, 영상 ID 오류 시 기존 저장값/player 보존을 설명했다.
- 곡 offset과 Local 저장의 분리·숫자 정규화/기존 값 복구·변경 시 영상 재정렬, 악보 교체 시 모드 Off 초기화를 명시했다.
- change/Enter와 IME 검사, 입력/확정 함수 튜플, Reload의 포커스·blur 제어와 요청 병합을 설명했다.
- 50ms 이내 재개 seek 생략, 영상 시작 전 예약, 영상만 pause/stop·악보 0초 offset 정렬·binding dispose 경계를 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 35개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 67/108 유지. 다음 9E-3는 `syncPlayerToCurrentScoreTime`부터 시작 경계·드리프트·seek 냉각 helper와 전체 점검이다.


### 2026-10-16 9E-1 완료 — YouTube 계약과 요청 수명

- `youtube_binding.ts`의 모듈/session/control 계약·초기 상태부터 `queueVideoLoad`까지 해설했다. 파일 전체 완료는 아니다.
- 악보 기준 시계와 영상 follower 경계, 곡/Local 보정 합산과 Practice 보정 분리, 자동 seek/오차 확인 간격을 설명했다.
- 패널 활성·영상 상태·입력 오류의 분리, 숨김 전 포커스 복구와 loading/ready 영상 표시를 명시했다.
- 요청 세대·AbortSignal·로드 예약·드리프트/시작 타이머·현재 player 정리와 이벤트 수명의 분리를 설명했다.
- 저장 ID 검증·요청 소유권 재검사·늦게 생성된 핸들 폐기·로드 중 취소 가능한 참조 등록·준비 후 최신 위치/재생 상태 재정렬을 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 함수/콜백 11개와 메서드 계약 9개 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 67/108 유지. 다음 9E-2는 `saveMetadata`부터 입력 확정·패널 이벤트·외부 제어 객체다.


### 2026-10-16 9D 완료 — 재생 UI

- `app_playback_ui.ts` 함수 12개·측정 콜백 15개 전체 해설을 완료했다.
- 실제 시각과 Practice 화면 보정의 분리, 유한성/길이 제한, range 정수 반올림과 시계 내림·누적 분 표시를 설명했다.
- BPM 이진 탐색의 [start,end) 경계·마지막 구간 fallback·tick 기준 선형 보간과 표시 자리수를 명시했다.
- 변경된 DOM 문자열만 쓰는 helper, Play/Stop/seek의 서로 다른 잠금 조건과 트랙 UI 위임을 설명했다.
- 초→유리수 tick→열/X 좌표→scrollLeft, 0.5 CSS px 변경 기준, 레이아웃 stage 동기화와 역변환의 범위 제한을 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 67/108 파일, 앱 재생 4개 파일 완료. 다음 9E는 `src/app/youtube/youtube_binding.ts`부터 YouTube 연동 경계다.


### 2026-10-16 9C-8 완료 — 재생 binding 완료

- `app_playback_binding.ts`의 키보드/정지/seek/파형 콜백 7개와 파일 끝 helper 2개를 추가 해설하고 파일 전체를 완료했다.
- Space 입력 영역 보호·자동 반복 차단, 정지 시 Practice 요약 초기화와 ready 전환, 악보 0초 화면 복귀를 설명했다.
- seek input의 화면 미리보기와 change의 실제 위치 변경을 구분하고, 비동기 완료의 최신 상태 사용/세대 검사 부재·오류 안내를 명시했다.
- 볼륨의 기존 backend 즉시 반영과 파형의 runtime 재구성, 전체 input/contenteditable 키 보호, 백분율 숫자 변환·비유한 값 음소거·0..1 제한을 설명했다.
- 외부 반환은 animation 정리만 제공하며 DOM 이벤트 dispose는 없는 구조임을 명시했다.
- 파일 전체 함수/콜백 78개와 메서드 계약 8개 JSDoc 점검 완료. 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 66/108 파일 완료. 다음 9D는 `src/app/playback/app_playback_ui.ts`의 시간 표시·스크롤/seek 좌표 변환이다.


### 2026-10-16 9C-7 완료 — 재생 전환과 비동기 시작

- `app_playback_binding.ts`의 `togglePlayback` 내부 함수와 콜백 17개 해설을 추가했다. 파일 전체 완료는 아니다.
- Sync/busy/산출물 오류 차단, controller 재생 중 pause와 Practice 요약/입력 기록 보존, ready 카운트다운과 중복 시작 방지를 설명했다.
- controller paused 위치 우선순위, 모드 전환 전 loop/Practice 범위 계산과 paused 모드의 일반 loop 변환 경로를 명시했다. 현재 동작을 보존했다.
- 시작 세대/runtime 재검사와 과거 controller 정지, Sync/오류 상태의 pause 처리, 최신 상태로 UI/영상/RAF 시작을 설명했다.
- 영상 재개 인수, 직전 시각 취득 후 animation 정리로 null 초기화되는 현재 순서, 최신 요청 오류만 표시하고 Practice 모드 롤백은 하지 않는 경계를 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 77개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 65/108 유지. 다음 9C-8는 키보드/버튼/seek/오디오 이벤트와 파일 끝 helper 및 전체 완료 점검이다.


### 2026-10-16 9C-6 완료 — 볼륨·스크롤 seek·재생 RAF

- `app_playback_binding.ts`의 `updateMasterVolumeFromInput`부터 `updatePlaybackScroll`과 악보 영역 이벤트 연결까지 내부 함수 3개·콜백 14개를 추가 해설했다. 파일 전체 완료는 아니다.
- 본 재생/미리듣기 볼륨 즉시 반영과 미리듣기 감쇠, 스크롤 이벤트의 RAF 병합·최신 상태/runtime 재취득·잠금 재검사를 설명했다.
- 수동 조작 일시정지→scrollLeft 초 변환→UI 선반영→loop 포함 controller seek→영상 동기화와 오류 안내 경계를 명시했다. 완료 경로에는 별도 요청 세대 검사가 없다.
- 재생 종료/레이아웃 없음의 RAF 중단, 자연 종료 처리, 시간 역행 시 영상 seek, 입력 기록 후 점수 갱신 순서를 설명했다.
- 재생 스크롤/seek UI/다음 RAF 예약과 finally의 성능 기록, capture 일시정지·passive 기본 스크롤 허용을 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 59개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 65/108 유지. 다음 9C-7는 `togglePlayback`의 재생/일시정지·Practice 시작 조율이다.


### 2026-10-16 9C-5 완료 — 수동 조작과 카운트다운

- `app_playback_binding.ts`의 `pausePlaybackForManualSeek`부터 `startPracticeCountdown`까지 내부 함수 6개·콜백 1개를 추가 해설했다. 파일 전체 완료는 아니다.
- 재생 중 수동 조작의 악보/영상/RAF 정지, busy/산출물 오류/Practice 잠금 검사, 설정 변경의 tick 위치 보존과 일시정지 후보 구성·미리듣기 교체를 설명했다.
- 취소 핸들이 없는 타이머 Promise, 전용 카운트다운 AudioContext 재사용과 숫자별 oscillator/gain 생성을 명시했다.
- 비프음 주파수·오디오 시각·15ms 상승/160ms 감쇠/180ms 종료, 본 재생 masterVolume을 거치지 않는 출력 경로를 설명했다.
- 세대/runtime/Sync 창/모드의 매 대기 후 재검사, 새 timing/주법 대상 구성, playing 상태 전환 후 공통 Play 호출을 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 42개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 65/108 유지. 다음 9C-6는 `updateMasterVolumeFromInput`부터 스크롤 seek와 재생 RAF 갱신이다.


### 2026-10-16 9C-4 완료 — 화면 갱신과 Sync 일시정지

- `app_playback_binding.ts`의 `invalidatePracticeCountdown`부터 Sync 버튼 연결까지 내부 함수 5개·콜백 11개를 추가 해설했다. 파일 전체 완료는 아니다.
- 카운트다운 세대 변경과 비프음 context 비동기 정리, 재생 RAF 취소·직전 시각 초기화·선택적 판정 기록 초기화를 설명했다.
- 프로그램 스크롤의 seek 억제와 다음 RAF 해제, 화면 보정 정규화/저장 및 10ms·1ms·Reset 버튼을 명시했다.
- Practice 종료 후 일반 표시 복구, Sync 진입의 악보/YouTube pause·기록 보존·playing→paused/countdown→ready 전환을 설명했다.
- capture 단계 정지와 비동기 시작 세대 무효화, 마이크를 직접 종료하지 않는 경계를 명시했다. 기존 '악보만' 설명을 실제 영상 pause 동작에 맞게 수정했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 35개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 65/108 유지. 다음 9C-5는 `pausePlaybackForManualSeek`부터 수동 조작·오디오 설정·카운트다운이다.


### 2026-10-16 9C-3 완료 — 기본 점수와 종료 조건

- `app_playback_binding.ts`의 `updatePracticeScoring`·`finishPracticePlayback`·`finishPracticeAfterNaturalPlaybackEnd` 내부 함수 3개를 추가 해설했다. 파일 전체 완료는 아니다.
- 보정 전 시각의 0.1초 간격 제한, Sync 보정 후 주법 우선 가산과 최신 상태 재취득, 범위 끝/기본·주법 대상 소진 종료 조건을 설명했다.
- 활성 target와 pitch/onset 비교, scoreEligible보다 먼저 기록하는 timing 사용/attack 충족 이력, 기본 점수/콤보/오버레이 반영을 명시했다.
- 기본 샘플 없음/비대상에도 주법 보너스 표시를 유지하고, 예외 흡수 시 앞선 상태 변경을 롤백하지 않는 범위를 설명했다.
- finished 상태의 요약/프레임 보존과 결과 창 표시, 오디오·마이크 직접 정지 미수행, 자연 종료의 전체 타임라인 길이/1e-6초 경계 검사를 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 19개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 65/108 유지. 다음 9C-4는 `invalidatePracticeCountdown`부터 애니메이션·스크롤·Sync 일시정지 helper다.


### 2026-10-16 9C-2 완료 — 주법 보너스 조율

- `app_playback_binding.ts`의 `updatePracticeEffectBonus`부터 `hasPendingEffectBonusTarget`까지 내부 함수 4개·콜백 1개를 추가 해설했다. 파일 전체 완료는 아니다.
- gliss interval/vib segment/trem attack별 판정 단위, 실패 target 잠금·성공 키 중복 방지, trem 가변 runtime의 별도 이력을 설명했다.
- 앞선 target의 점수를 보존하도록 최신 상태를 다시 조회해 누적하고, 호출 반환값에는 마지막 성공만 남기는 계약을 명시했다. 기존 gliss 전용/반환값 없음 설명도 수정했다.
- target별 trem Map 참조 공유, 채택/보상 onset과 합성 hit 집합, 마지막 공격 시각/연속 횟수를 설명했다.
- vib 경계 포함 검사·gliss 구간 키 생성, 시간만 보는 남은 target 검사와 성공/실패 이력을 조회하지 않는 범위를 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 16개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 65/108 유지. 다음 9C-3는 `updatePracticeScoring`의 기본 점수 누적과 종료 조건이다.


### 2026-10-16 9C-1 완료 — 재생 binding 계약과 초기 상태

- `app_playback_binding.ts`의 모듈/session/control 계약과 바인딩 진입 상태, `resetPracticeTimingState`·`updatePracticeTimingInput`을 해설했다. 파일 전체 완료는 아니다.
- 최신 상태/runtime 조회와 외부 재구성 책임, 선택적 YouTube 제어, 외부 animation 정리와 backend 정지의 차이를 설명했다.
- 재생 RAF/스크롤 seek RAF, 프로그램 스크롤 억제, 직전 재생/점수 시각, onset/악보 이벤트/주법 대상별 집합과 trem 상태 Map을 명시했다.
- 카운트다운 전용 AudioContext와 비동기 무효화 세대, 새 세션의 입력/판정 이력 교체를 설명했다.
- playing 모드 타입 좁히기, 중복 입력 처리는 history에 위임, Sync ms를 초로 바꿔 판정 시각에서 빼는 경계를 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 진입/내부 함수 3개와 메서드 계약 8개 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 65/108 유지. 다음 9C-2는 `updatePracticeEffectBonus`부터 주법 보너스 판정과 helper를 진행한다.


### 2026-10-16 9B 완료 — 재생 runtime 구성

- `app_playback.ts` 함수 3개·측정 콜백 6개와 runtime/Practice 범위 타입 전체 해설을 완료했다.
- loop UI의 미지정 경계 기본값·끝 제외 범위·분모 1 tick과 tempo 기반 초 변환, 역순/빈 범위 비활성 및 clamp 미수행을 설명했다.
- 일반 반복과 Practice 1회 범위는 같은 경계 변환을 사용하되 소비하는 호출부의 의미가 다름을 명시했다.
- 분석 결과/활성 트랙→일정→시간 조회 큐→전용 backend→예약기→컨트롤러와 mapper 조립을 설명했다.
- 0.2초 lookahead와 25ms 타이머 단위 차이, UI 파형/백분율 볼륨의 생성 시점 취득, 동기 성능 측정 콜백을 명시했다.
- backend 생성 이후 실패 시 후보 자원 정리 후 오류 재전달, 앱 runtime 교체는 외부 책임인 경계를 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 65/108 파일 완료. 다음 9C는 `src/app/playback/app_playback_binding.ts`의 재생/Practice 이벤트 조율을 처리 단위별로 진행한다.


### 2026-10-16 9A 완료 — 입력 음 미리듣기

- `app_note_preview.ts` 함수/구현 메서드/콜백 7개와 runtime 메서드 계약 3개 전체 해설을 완료했다.
- 전용 oscillator backend·생성 시점 파형·백분율 볼륨 변환과 0.65 배율·3ms/35ms envelope 설정을 설명했다.
- 120ms 단발음과 60ms 접수 간격, performance 시간축과 발음 성공 전 시각 갱신, 유한성만 검사하는 MIDI 입력 경계를 명시했다.
- 비동기 시작 후 offset 0 예약·이전 음 release 유지·오류 흡수, dispose의 backend 정리와 대기 Promise 무효화 플래그 부재를 설명했다.
- 임시 ID와 고정 basic 값, 계약용 tick 0..1과 실제 초 단위 길이, cent/효과 없는 기본 음 미리듣기를 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백/메서드 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 64/108 파일 완료. 다음 9B는 `src/app/playback/app_playback.ts`의 재생 runtime 구성이다.


### 2026-10-16 8E 완료 — 레이아웃·트랙 단계 종료

- `src/track/track_control.ts`의 함수 6개·콜백 1개와 공용 정책 상수 전체 해설을 완료했다.
- 2.6 명세와 renderer/audio/app 호출부를 확인했다. 고정 3트랙의 활성 여부·투명도·분석 결과 필터·그리기 순서만 담당하며 트랙 추가/삭제/이름 변경은 현재 범위가 아니다.
- UI 순서와 겹침 순서의 차이, 기본 활성 배열 복사, inactive 10% 불투명도와 빈 활성 목록을 설명했다.
- 미지원 ID 검사와 타입 좁히기, 모든 트랙 gain=1 및 활성 필터의 별도 역할, Set 조회·원래 결과 순서·객체 참조 공유를 명시했다.
- 그리기 순위의 미지원/누락 fallback과 타입 단언/실제 문자열 검사의 차이를 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 63/108 파일, 8단계 레이아웃·트랙 6개 파일 완료. 다음 9A는 앱 재생 경계의 `app_note_preview.ts`부터 진행한다.


### 2026-10-16 8D-6 완료 — 레이아웃 대화상자 완료

- `bindLayoutDialogControls`의 이벤트 콜백 20개와 빈 슬롯 판별 콜백 1개를 추가 해설하고 `layout_dialog_binding.ts` 전체를 완료했다.
- 취소/닫기의 파일 결과 무효화·전역 드래그 정리·초안 폐기, 다시 열린 창을 보호하는 close 검사, Practice 잠금과 submit 기본 동작 차단을 설명했다.
- 현/공통 note 높이 변경, 현재 score 기반 Reset, 첫 빈 슬롯의 선택/이름만 준비하는 New Preset을 명시했다.
- 위/아래 행 추가·로컬/파일 버튼 연결·슬롯 변경 시 대기 파일 무효화·첫 File의 null/undefined 검사를 설명했다. 중복 바인딩 방지와 외부 dispose 반환은 없는 구조다.
- 파일 전체 함수 42개·콜백 39개·세션 메서드 계약 4개 JSDoc 점검 완료. 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 62/108 파일 완료. 다음 8E는 `src/track/track_control.ts`의 트랙 제어이며 이후 9단계 앱 재생/YouTube로 이어간다.
- GitHub 면담용 브랜치의 최신 업로드는 `3d7a938`(61/108)이다. 이번 대화상자 전체 해설은 아직 로컬에만 있다.


### 2026-10-16 8D-5 완료 — 프리셋 입출력

- `layout_dialog_binding.ts`의 `saveLayoutDraftToLocalPreset`부터 `syncLayoutAddRowHeightState`까지 함수 6개·콜백 4개 해설을 추가했다. 파일 전체 완료는 아니다.
- 기존 슬롯 메타데이터 유지·덮어쓰기 확인·직렬화 사전 검증과 storage 재검증/저장/재조회 경계를 설명했다.
- 대화상자 Load의 빈 슬롯 경고와 초안 유지, 파일 Save의 새 후보 생성·브라우저 다운로드 요청을 명시했다. 다운로드 안내는 디스크 저장 완료 확인이 아니다.
- 파일 읽기의 요청 세대 캡처·Promise 오류 전달·현재 요청/열린 창 검사, 다른 악기 확인과 초안 복원, 최신 요청만 입력을 비우는 finally를 설명했다.
- 로컬/파일 입출력은 실제 악보 Apply와 별개이며, 파일 불러오기는 로컬 슬롯에 자동 저장하지 않는 경계를 명시했다.
- 행 추가의 note/gap 높이 출처와 자동 MIDI/경계 계산 위임, 개별 높이 입력의 활성 여부만 변경하는 helper를 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 63개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 61/108 유지. 다음 8D-6는 `bindLayoutDialogControls`의 이벤트 연결과 파일 전체 완료 점검이다.


### 2026-10-16 8D-4 완료 — 실제 적용과 툴바 프리셋

- `layout_dialog_binding.ts`의 `applyLayoutDialogDraft`부터 `applyLayoutToolbarDraft`까지 함수 8개·콜백 1개 해설을 추가했다. 파일 전체 완료는 아니다.
- Practice 잠금·최신 DOM 재취득·전체 트랙 삭제 셀 확인, 공통 앱 적용 함수의 검증/재구성과 실패 상태 전달을 설명했다.
- 성공 시 드래그/초안/비동기 파일 요청 정리·창 닫기·render·재생 초기화 순서를 명시했다.
- 모달 열기의 새 초안 구성, 악기 ID별 로컬 슬롯 조회와 오류 시 저장소를 변경하지 않는 빈 슬롯 표시를 설명했다.
- 툴바 default/슬롯 분기, 빈 슬롯의 기본 초안 fallback, 적용 실패/취소 메시지와 성공 선택값 반영을 명시했다. 목록 갱신은 현재 UI 선택값을 유지하며 실제 적용된 프리셋으로 되돌리는 기능은 아니다.
- `setLayoutDialogNotice`의 과거 미구현 전용 설명을 실제 공용 안내 역할에 맞게 수정하고 누락된 level 인수 설명을 추가했다. 코드 동작은 유지했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 53개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 61/108 유지. 다음 8D-5는 `saveLayoutDraftToLocalPreset`부터 로컬/파일 저장과 불러오기다.


### 2026-10-16 8D-3 완료 — 행 편집 UI와 입력 취득

- `layout_dialog_binding.ts`의 `createLayoutRowTableHead`부터 `bindLayoutStringPitchInputs`까지 함수 11개·콜백 9개 해설을 추가했다. 파일 전체 완료는 아니다.
- 행의 6칸 구성·radio 선택·gap 전용 높이 입력·삭제 버튼 조건, 입력 컨트롤 click의 중복 선택 방지를 설명했다.
- 같은 현 note의 배열 순서 양끝 삭제 정책과 최소 1개 유지, 최신 초안 재검증, 초안 행 삭제와 Apply의 실제 셀 삭제 경계를 명시했다.
- 실패 시 안내만 변경하고 성공 시 초안 교체/DOM 재구성, 초기화 전 조회 오류와 현재 참조 반환을 설명했다.
- 표시명 trim/빈 값 fallback·악기명 동기화·얕은 복사, stringId DOM 인덱스와 기존 현 순서 보존, openMidi 제거 후 조건부 재삽입을 명시했다.
- parseInt의 정수 접두부 해석과 범위 검사 미수행, 누락 DOM의 기존 필드 보존, MIDI change의 초안만 교체하는 경계를 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 44개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 61/108 유지. 다음 8D-4는 `applyLayoutDialogDraft`부터 실제 적용·프리셋 조작 흐름이다.


### 2026-10-16 8D-2 완료 — 미리보기와 높이 조절

- `layout_dialog_binding.ts`의 `createPitchSelect`부터 `handleLayoutPreviewResizeEnd`까지 함수 10개·콜백 3개 해설을 추가했다. 파일 전체 완료는 아니다.
- MIDI 전체 범위의 내림차순 선택지와 sharp 표시, DOM 필드 식별, 선택 현의 행 목록/미리보기 재구성을 설명했다.
- note 라벨 색상과 gap 전용 손잡이, 최신 초안에서 행 선택, 버튼 click 제외와 CSS px 높이 표시를 명시했다.
- 드래그 시작 기준 보존·window 이벤트 수신·pointerId 필터 없음, 반올림/방향 반전/1..500px 제한·중복 높이 생략을 설명했다.
- 높이 변경 실패 시 기존 초안 유지, 성공 후보 반영과 재표시, 종료/취소 시 롤백 없이 listener 해제를 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 24개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 61/108 유지. 다음 8D-3는 `createLayoutRowTableHead`부터 개별 행 편집 UI와 초안 반영 helper다.


### 2026-10-16 8D-1 완료 — 레이아웃 대화상자 진행 중

- `layout_dialog_binding.ts`의 모듈 상태·session 메서드 계약과 `createStringSummaryRow`까지 함수 6개·콜백 1개를 해설했다. 파일 전체 완료는 아니다.
- 공유 초안/높이 조절 상태, CSS px 기준과 마지막 높이, 파일 요청 세대 번호를 통한 오래된 비동기 결과 무효화를 설명했다.
- 초안에서 DOM 재구성 후 새 MIDI 입력에 이벤트 연결, family 표시 fallback, 대표 note 높이와 선택 현/행 표시 경계를 명시했다.
- 대화상자/툴바 슬롯 선택지의 차이, 기본값 복구, 현 ID와 표시 문구 분리, 개방현 MIDI fallback과 비활성 입력을 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 함수/콜백/메서드 계약 JSDoc 11개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 61/108 유지. 다음 8D-2는 `createPitchSelect`부터 목록/미리보기 DOM 구성으로 이어간다.
- 면담용 61/108 완료본은 SPREDbackup `commentary-2026-10-16` 브랜치의 `3d7a938`에 업로드했다. 이번 대화상자 부분 해설은 아직 업로드본에 포함되지 않는다.


### 2026-10-16 8C 완료

- `layout_preset.ts` 함수 10개·콜백 4개 전체 해설 완료.
- 2.5 명세와 dialog의 저장/직렬화 호출을 확인했다. 표시명 trim/code point 제한 후 후보 생성, 전체 포맷 검증과 저장은 외부 책임인 경계를 설명했다.
- 기존 ID/생성 시각 보존·UTC 수정 시각 갱신, 기준 악기 ID 전달, 악기명 반영과 객체 복사, 불러오기 현 선택 유지/행 선택 재설정을 명시했다.
- 시각 기반 ID의 충돌 검사 미제공, 파일명 금지 문자 정리와 UTF-16 길이 제한, record/type guard의 검사 범위를 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 61/108 파일 완료. 다음 8D는 `layout_dialog_binding.ts`의 대화상자 상태·초안 표시부터 처리 단위를 나누어 진행한다.
- 면담용 업로드는 SPREDbackup의 `commentary-2026-10-16` 브랜치, `c8a4cfc` 커밋(60/108 시점)에 완료했다. 이번 추가 작업은 아직 그 커밋에 포함되지 않는다.

### 2026-10-16 8B 완료

- `layout_apply.ts` 함수 7개·콜백 6개·적용 옵션 타입 1개 전체 해설 완료.
- 전체 트랙의 사라진 note row 참조 셀 집계, 삭제 허용 true 검사, 기존 전역 행/초안 편집 행 결합과 표시명 반영을 설명했다.
- 삭제 없음의 tracks 참조 재사용, 삭제가 있으면 모든 track/cells 컨테이너 복사와 생존 셀 객체 공유, 후보 전체 검증 및 외부 runtime 확정 경계를 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 60/108 파일 완료. 다음 8C는 `layout_preset.ts`의 프리셋/초안 변환이다.
- 면담용 중간본 업로드 요청에 따라 현재 60개 완료 시점 자료를 SPREDbackup 별도 브랜치에 보관한다. 전체 108개 완료 목표는 유지한다.

### 2026-10-16 8A-3 완료 — 레이아웃 초안 완료

- `layout_draft.ts`의 note/gap 삽입과 이웃/경계 helper 11개·콜백 5개를 추가해 파일 전체 함수 26개·콜백 14개 해설을 완료했다.
- 명시/자동 MIDI 선택·정수/현 음역/중복 검사, 삽입 방향별 이웃 탐색 우선순위와 ±1 반음 계산을 설명했다.
- 같은 현 인접 gap 금지·양쪽 note 경계 정렬·한쪽 끝의 가상 -1/128 경계·동일 경계 중복 및 내부 경계 검증 범위를 명시했다.
- 행 ID/표시명 생성, 선택 행 기준 삽입과 현 끝 fallback, 기존 행 참조를 공유하는 새 배열, 다른 현/gap을 건너뛰는 방향 탐색을 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 59/108 파일 완료. 다음 8B는 `layout_apply.ts`의 삭제 셀 집계·부분 복사·후보 검증과 적용 경계다.

### 2026-10-16 8A-2 완료 — 레이아웃 초안 진행 중

- `layout_draft.ts`의 `addLayoutDraftRow`부터 `validateRowHeight`까지 함수 8개·콜백 5개를 추가 해설했다. 파일 전체 완료는 아니다.
- 공통 높이/현 선택 검사 후 note/gap 위임, 대상 rowId 조회와 초안 행만 제거하는 경계, 삭제 후 현재 현의 첫 행 선택을 설명했다.
- 삭제 대상 현의 note 개수와 배열 순서 양끝 정책, gap 삭제의 별도 취급, 타입 술어/Extract와 정수 높이 검증을 명시했다.
- 악기 객체·현 배열·현 객체의 명시적 복사 및 note/gap 행 복사, 첫 행 조회의 gap 포함과 null 의미를 설명했다.
- 기존 삭제 안내의 “until Apply is implemented”는 현재 별도 layout_apply 구현과 맞지 않는 과거 문구다. 이번에는 동작/문자열을 보존하고 주석으로 설명했으며, 문구 수정은 별도 기능/UI 정리 범위다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백 JSDoc 24개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 58/108 유지. 다음 8A-3는 `addNoteRow`부터 note/gap 삽입과 이웃 행/경계 계산 helper를 진행한다.

### 2026-10-16 8A-1 완료 — 레이아웃 초안 진행 중

- `layout_types.ts` 타입 4개 전체 해설 완료. 전역 제외 초안, 표시명/악기명 적용, 선택 ID, 모든 트랙의 삭제 셀 집계와 검증된 적용 후보/확정 상태의 차이를 설명했다.
- `layout_draft.ts`의 상수·입력/결과 타입과 생성/선택/높이 변경 함수 7개·콜백 4개를 `updateLayoutDraftCommonNoteHeight`까지 해설했다. draft 파일 전체 완료는 아니다.
- score 행/악기 정보 복사, 선택 helper의 검증 범위, 조회 배열과 내부 행 참조 공유, 대상 행만 복사하는 높이 갱신을 설명했다.
- 공통 높이는 첫 note 값(없으면 7px)이고 일괄 변경은 모든 현의 note 대상인 점, 같은 높이여도 성공 처리되는 조건을 명시했다.
- 두 파일 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 58/108 파일 완료. 다음 8A-2는 `layout_draft.ts`의 `addLayoutDraftRow`부터 삭제 정책과 복사/검증 helper를 진행하고 note/gap 삽입 계산으로 이어간다.

### 2026-10-16 7J-6 완료 — 편집 단계 종료

- click/contextmenu/keydown 콜백 3개와 파일 끝 helper 4개 해설을 추가하고 `edit_pointer_binding.ts` 전체를 완료했다.
- 후속 click 억제·Practice ready 구간 선택 예외·근접 보정 없는 click hit·보기 선택/편집 분기를 설명했다. contextmenu는 메뉴만 억제하며 삭제는 pointer 경로가 담당한다.
- 입력 DOM 키 보호, busy/Practice 잠금, 범위 삭제/복사/잘라내기/붙여넣기 조건과 Escape의 clipboard/preview 종료 범위를 명시했다.
- 루프 경계 null 기본값·악보 범위 제한·역순 정렬과 끝 제외 tick의 표시용 -1 변환, 외부에는 반복 클릭 초기화만 반환하는 계약을 설명했다.
- 파일 전체 함수/콜백 40개와 메서드 계약 9개 JSDoc 점검 완료. 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 57/108 파일, 7단계 편집 13개 파일 완료. 다음 8A는 레이아웃 경계의 `layout_types.ts`와 `layout_draft.ts` 입력 계약부터 진행하고 적용/preset/dialog 및 트랙 제어로 이어간다.

### 2026-10-16 7J-5 완료 — pointer binding 진행 중

- pointermove/leave/up/cancel 이벤트 콜백 4개와 드래그 원문 해석 콜백 2개를 추가 해설했다. 파일 전체 완료는 아니다.
- 범위 선택 이동 우선 처리, 일반 이동의 붙여넣기 preview 갱신, 포인터 ID/잠금 검사와 4 CSS px 임계 거리 전환을 설명했다.
- 드래그 시작 셀 포함·동일 hit 중복 생략·행 잠금/열 보간 helper 위임·활성 트랙 확장·frame 대기열 누적을 명시했다.
- pointerup의 capture 해제·대기 flush 후 이력 종료, 단일 입력의 시작 hit 사용과 버튼별 순환/삭제를 설명했다.
- pointerleave는 clipboard/드래그를 종료하지 않으며, pointercancel은 롤백 대신 대기 명령까지 적용하고 이력을 종료한다. 범위 취소는 마지막 선택을 유지한다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 42개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 56/108 유지. 다음 7J-6는 click/contextmenu/keyboard 이벤트와 파일 끝 루프/키보드 helper이며, 이후 pointer binding 전체 완료 점검을 진행한다.

### 2026-10-16 7J-4 완료 — pointer binding 진행 중

- `applyLoopPickForHit`·`applySinglePointerEdit` helper 2개와 pointerdown 콜백 1개를 추가 해설했다. 파일 전체 완료는 아니다.
- 루프 끝 셀 포함을 위한 +1 경계, 정규화와 pick 종료, Practice ready의 Range 안내를 설명했다.
- 단일 입력은 합성 전에 범위/clipboard/preview를 즉시 비우며 blocked 이후에도 유지되는 점, 반복 클릭 상태 반영과 handled/명령 적용 분기를 명시했다.
- pointerdown의 차단 순서, Ctrl+주 버튼 범위 선택과 Ctrl+보조 버튼 거절, 미리듣기 요청, 빈 영역 시작 허용 도구와 드래그 불가 입력의 단일 처리 준비를 설명했다.
- 시작 client 좌표·hit·행 잠금·직전 hit·누적 Map과 pointer capture를 구분했다. 실제 편집 확정은 이동/해제 후속 이벤트가 담당한다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 36개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 56/108 유지. 다음 7J-5는 pointermove/leave/up/cancel의 드래그 진행·flush·이력 종료이며 이후 click/contextmenu/keyboard와 끝 helper를 진행한다.

### 2026-10-16 7J-3 완료 — pointer binding 진행 중

- `updateRangeSelection`부터 `pasteRangeClipboard`까지 범위 helper 5개를 추가 해설했다. 파일 전체 완료는 아니다.
- 2.9 실패 처리 결정과 main의 uiAfter 확정을 확인했다. 범위 계산 실패 시 마지막 선택 유지, 선택 갱신 시 clipboard 보존/preview 숨김 및 overlay만 갱신하는 경계를 설명했다.
- 삭제/잘라내기/붙여넣기의 UI 후보를 미리 확정하지 않고 편집 성공에 결합하는 흐름과 복사의 즉시 상태 갱신을 구분했다.
- 전역 0열의 복사 허용/삭제 보호에 따른 잘라내기 복사 개수와 삭제 명령 수 차이, 빈 명령일 때 기존 clipboard 유지, 붙여넣기 anchor 우선순위와 반환 범위 미사용을 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 33개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 56/108 유지. 다음 7J-4는 `applyLoopPickForHit`·`applySinglePointerEdit` 및 포인터 이벤트 연결이다.

### 2026-10-16 7J-2 완료 — pointer binding 진행 중

- `edit_pointer_binding.ts`의 `getPointerEditHit`부터 `setStatusMessage`까지 helper 8개를 추가 해설했다. 파일 전체 완료는 아니다.
- 공용 hit test의 note 행 근접 보정과 가로 열 단독 조회, viewport→stage CSS px 변환·열 내림·가로 경계 검사를 설명했다.
- clipboard를 보존하는 preview 숨김과 clipboard까지 비우는 종료의 차이, 표시 조건과 무관한 최근 열 추적, 같은 열 overlay 갱신 생략을 명시했다.
- 미리듣기의 실제 note 행 재확인·rowId 중복 억제·행 기본 MIDI 사용과 runtime 요청 전 key 확정, key 초기화가 오디오 중단이 아닌 점을 설명했다.
- 최신 상태의 메시지만 교체하고 상태줄을 동기화하는 경계를 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 누적 함수/콜백/메서드 계약 JSDoc 28개·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 56/108 유지. 다음 7J-3는 `updateRangeSelection`부터 범위 삭제/복사/잘라내기/붙여넣기 명령이며, 이후 루프 선택과 포인터 이벤트를 진행한다.

### 2026-10-16 7J-1 완료 — pointer binding 진행 중

- `edit_pointer_binding.ts` 모듈/진입 계약, 두 상수, 세션/control 타입의 메서드 9개, 클로저 상태, 내부 helper 8개와 콜백 2개를 `queueDragEdits`까지 해설했다. 파일 전체 완료는 아니다.
- CSS px 거리 기준, 반복 클릭/일반 drag/범위 drag/미리듣기/붙여넣기 열/RAF/이력 상태의 역할을 분리했다.
- 대표 note 명령을 확장 시점 활성 트랙에 복제하고 전역은 한 번만 유지하는 흐름, frame 대기 Map의 마지막 명령 유지와 드래그 전체 중복 기록의 차이를 설명했다.
- 드래그 이력 시작/종료와 frame 단위 적용의 분리, flush 전 예약 취소·대기열 비우기·적용 위임, 자동 재삽입/재시도 미제공을 명시했다. cancel transaction은 외부 계약에 있으나 이 binding에서 호출하지 않는다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·완료 범위 함수/콜백/메서드 계약 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 완전 완료 파일 수는 56/108 유지. 다음 7J-2는 `getPointerEditHit`부터 좌표 조회·붙여넣기 preview·행 음정 preview·상태 안내 helper이며, 이후 범위 명령과 이벤트 연결을 진행한다.

### 2026-10-16 7I 완료

- `edit_panel_binding.ts` 진입 함수 1개·내부 helper/콜백 12개·세션 메서드 계약 4개 해설 완료.
- main의 session 연결, UI 미리보기 동기화, fitScoreHeight 호출을 확인했다. 이벤트 시점 최신 상태 조회, 편집 진입의 default 입력·루프 해제·높이 맞춤, Practice 잠금 분기를 설명했다.
- microPitch/숫자 DOM 정규화와 최종 합성 검증의 분리, 숫자/ramp 변경의 클릭 순환 초기화, ramp dataset 허용값 좁히기를 명시했다.
- default↔tuplet/pletExtend 전환과 슬롯 초안 재독, Finalize가 실제 악보 적용이 아닌 다음 머리 배치 클릭 준비인 점, click/focus/input의 슬롯 처리 차이를 설명했다.
- 세션 상태 확정과 UI 갱신의 분리, DOM 리스너 등록 및 해제/중복 방지 미제공 경계를 명시했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백/메서드 계약 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 56/108 파일 완료. 다음 7J는 `edit_pointer_binding.ts`의 포인터 상태·편집 transaction·범위 명령·이벤트 연결을 나누어 진행한다.

### 2026-10-16 7H 완료

- `edit_range_selection.ts` 함수 8개·콜백 22개·삭제 결과 타입 1개 해설 완료.
- 2.9 명세와 pointer binding 호출을 확인해 시작 행 종류 고정, renderer 순서의 같은 종류 행 수집, 열 반열린 구간 정규화와 호출 시점 트랙 배열 복사를 설명했다.
- 실제 저장 셀만 삭제/복사하는 순회, 전역 0열 삭제 보호와 복사 허용, 선택에 저장된 트랙 유지, 행 offset과 열 offset 및 빈 영역 폭의 차이를 명시했다.
- 붙여넣기는 원본 행/트랙을 유지하고 열만 이동한다. 누락 행/종류 변경/삭제 트랙/열 범위 밖 셀 제외, 빈 칸은 대상 셀을 지우지 않는 흐름을 설명했다.
- 반환 범위 메타데이터와 실제 edits의 차이, 현재 호출부의 붙여넣기 후 선택 해제, helper가 상태/OS clipboard/score를 직접 수정하지 않는 경계를 설명했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 55/108 파일 완료. 다음 7I는 `edit_panel_binding.ts`의 패널 이벤트와 도구 상태 동기화이며, 이후 `edit_pointer_binding.ts`를 진행한다.

### 2026-10-16 7G 완료

- `edit_history.ts` 함수 10개·콜백 1개·조회 타입 1개 해설 완료.
- 2.10의 최신 인덱스 조회 계약과 main의 transaction/Undo/Redo 호출을 확인했다. 두 Map 참조 snapshot과 과거 Map/셀 불변 전제, 이력에는 문자열 patch만 저장하는 경계를 설명했다.
- 요청 원문 대신 대상 좌표만 수집하고 최종 전후 Map을 비교하는 흐름, 마지막 selection 참조와 최초 key 순서 유지, 순변경 없는 셀 제외를 명시했다.
- 빈 patch의 redo 보존, entry 수 제한과 오래된 항목 제거, 배열 복사와 entry 참조 공유, Undo/Redo 스택 이동 후보를 호출부가 편집 성공 시 확정하는 흐름을 설명했다.
- null 셀 부재→빈 문자열 삭제 명령 변환, 전역 좌표의 트랙 무관 key, ID 생성의 시각/난수 조합을 설명했다. transaction 시작/종료 자체는 main의 책임이다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 54/108 파일 완료. 다음 7H는 `edit_range_selection.ts`의 범위 선택·복사/붙여넣기·삭제 명령 생성이다.

### 2026-10-16 7F 완료

- `edit_commit_effects.ts` 함수 3개·외부 동작 메서드 계약 4개·타입 2개 해설 완료.
- main의 악보/이력 확정 뒤 주입되는 동기 효과를 확인하고, 정상 render→재생 갱신 및 render 실패→중단→전체 refresh 1회→재생 갱신 순서를 설명했다.
- stop 실패 시 화면 복구 생략, refresh 실패 시 재생 갱신 생략, playback 실패 시 재시도 없이 중단하며 추가 중단 오류도 메시지에 보존하는 차이를 명시했다.
- ready가 실제 재생 중임을 뜻하지 않는 점, recovered가 화면 복구 성공을 뜻하는 점, 악보 확정과 출력 실패 결과의 분리를 설명했다. errorText의 unknown 좁히기와 문자열 변환 범위도 명시했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/메서드 계약 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 53/108 파일 완료. 다음 7G는 `edit_history.ts`의 셀 변경 패치·transaction·undo/redo 상태 흐름이다.

### 2026-10-16 7E 완료

- `edit_controller.ts` 함수 9개·콜백 2개 해설 완료.
- DOM 문자열의 타입 단언과 런타임 검증 구분, 모든 슬롯 input 복사와 활성 번호 범위 검사, default 동기화와 tuplet 도구 전환의 차이를 설명했다.
- SELECT ROW의 AUTO 본문/pitch 해소·삭제의 빈 슬롯 처리·주석 제외·@n 행 MIDI 부여와 슬롯 DOM 직접 쓰기/초안 재독을 구분했다.
- parser를 통한 머리 셀 확인, 첫 음표 슬롯의 @n 위치를 같은 stringId 안에서 찾는 배치 보정, 전부 쉼인 경우 원래 hit 유지와 음역 밖 거절을 설명했다.
- 일반 click helper는 busy일 때 상태를 보존하고 나머지는 선택/안내만 갱신한다. 기존 JSDoc의 mutation 표현을 실제 동작에 맞춰 정정했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 52/108 파일 완료. 다음 7F는 `edit_commit_effects.ts`의 편집 확정 후 재생/화면 동기화 효과이며, 이후 이력·범위 선택·binding을 진행한다.

### 2026-10-16 7D-2 완료

- `edit_interaction.ts` 함수 4개·콜백 1개·결과/옵션 타입 2개 해설 완료.
- 첫 활성 트랙 선택과 기본값, 전역/트랙별 기존 원문 조회, 클릭의 모드 검사→강제 삭제→전역 숫자→tuplet 슬롯→도구 합성 순서를 설명했다.
- SELECT ROW의 슬롯 DOM/초안 갱신과 경고 상태 반환, tuplet 머리 위치 보정, 실패 경로별 반복 클릭 상태 보존/초기화를 구분했다.
- 드래그의 보조 버튼 삭제/전역 숫자가 모드 검사보다 앞서는 순서와 기존 셀 기준 순환, 주석 원문 제외 조건을 명시했다. 실제 score 변경은 후속 적용 경로의 책임이다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 51/108 파일 완료. 다음 7E는 `edit_controller.ts`의 도구 패널/tuplet 초안 제어부터 진행한다.

### 2026-10-16 7D-1 완료

- interaction이 호출하는 공용 `edit_pointer.ts`부터 전체 함수 8개·상태/입력 타입 3개·callback 계약 2개 해설 완료. interaction 본문은 다음 단위로 남겼다.
- 반복 클릭의 대상/패널 원문 일치 조건과 다음 단계, 기존 셀 prefix 기반 drag 순환, 패널 원문의 pitch suffix 추출 한계, CSS px 이동 거리 판정을 설명했다.
- drag의 행 종류 잠금·같은 행 양끝 포함 열 보간·중복 key 제외·Map 직접 변경·이번 추가 목록 반환과 lastHit 갱신을 구분했다.
- 이전 계획의 “좌표 변환” 표현은 실제 역할에 맞춰 정정한다. 이 파일은 이미 hit test된 행/열을 받아 명령을 만들며 픽셀→악보 변환은 담당하지 않는다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 50/108 파일 완료. 다음 7D-2는 `edit_interaction.ts`의 대표 트랙/기존 원문 조회와 단일 클릭·드래그 명령 해석이다.


### 2026-10-16 7C 완료

- `edit_number.ts` 함수 5개·콜백 2개와 `edit_tuplet.ts` 함수 1개·콜백 2개·타입 3개 해설 완료.
- ramp 버튼의 DOM/aria 상태와 fallback, 문자 제거 정규화와 값 검증의 차이, 실제 global 행 재조회·BPM/dynamics만 ramp 허용·원문 suffix 합성을 설명했다.
- tuplet 초안 인덱스와 배열 순서 구분, 누락 슬롯 빈 값·중복 첫 항목·범위 밖 무시, activeSlotIndex 미사용, wrapper 포함 길이 제한과 슬롯 parser 검증 경계를 설명했다.
- 두 파일 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 49/108 파일 완료. 다음 7D는 `edit_interaction.ts`의 모드별 클릭/드래그 편집 해석과 `edit_pointer.ts` 좌표 변환이며, 이후 controller/확정 효과/이력/범위와 binding을 진행한다.


### 2026-10-16 7B 완료

- `edit_core.ts` 함수 1개·요청/결과 타입 2개와 `edit_default.ts` 함수 12개·입력 타입 4개·escape 집합 2개 해설 완료.
- default/tuplet 요청과 apply/delete/blocked 결과, 검증 후 합성·빈 custom 삭제 조건, 도구 모드별 본문 선택과 예약문자 escape·토큰 순서를 설명했다.
- MIDI/cent의 공백 허용·문법/범위 검사와 effective token 판정의 차이, AUTO◇ 내부 표식, 0 suffix 생략, comment/eraser/holdStart의 별도 경로 및 token 배열 변경 부수 효과를 명시했다.
- 두 파일 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 47/108 파일 완료. 다음 7C는 `edit_number.ts`와 `edit_tuplet.ts`의 전역 숫자 입력·tuplet 초안/확정 원문 생성이다.


### 2026-10-16 7A 완료

- `edit_apply.ts` 전체 함수 11개·콜백 6개·결과/그룹 타입 2개 해설 완료.
- 모든 요청의 길이/전역 0열 삭제 검증, gap 거절·트랙 존재 확인, 저장 영역별 그룹화, 대상 컨테이너 복사와 기존 셀 참조 공유를 설명했다.
- 좌표별 마지막 요청과 원본 원문 비교, 없는 셀 삭제/원복 batch의 무변경, 원본 score 반환 계약, updated=요청 수와 isDelete=전체 요청 삭제의 차이를 명시했다.
- note 이름의 wrapper가 공용 경로에 위임하는 범위와 parser/모든 좌표 검증을 담당하지 않는 한계, 후보 복사본만 변경하고 상태 확정은 외부 책임인 점을 구분했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 45/108 파일 완료. 다음 7B는 `edit_core.ts`와 `edit_default.ts`의 도구 입력·원문 구성 경계부터 진행한다.


### 2026-10-16 6D 완료 — 앱 상태·산출물 단계 종료

- 부분 재계산 모듈은 진입부와 재사용 helper를 함께 검토해 전체 함수 9개·콜백 10개·입출력 타입 2개 해설 완료.
- note/global/mixed 분류와 null fallback, 트랙 전체 재파싱/분석·누락 트랙 추가, 전역 타임라인 재생성과 tick 이벤트 재사용을 2.8 최신 계약에 맞춰 설명했다.
- 최상위 Readonly와 중첩 참조 공유, Map 복사/트랙 결과 교체, 편집 트랙만 renderer에 전달하는 분석 view, 새/기존 아이템 병합과 공용 정렬·전역/노트 marker 분리를 명시했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 44/108 파일, 6단계 4개 파일 완료. 다음 7A는 `app/edit/edit_apply.ts`의 편집 입력/검증·원문 반영 계약부터 진행하고, 편집 core/도구·확정/이력·입력 binding으로 이어간다.


### 2026-10-16 6C 완료

- `canvas_renderer_adapter.ts` 전체 함수 1개·콜백 1개·전역 라벨 map 해설 완료.
- global/note/gap 타입 좁히기, ID/표시 라벨/MIDI/높이 전달, 원본 순서의 새 행 객체/배열 생성, 빈 열 포함 columnCount와 zoom 전 px 폭을 설명했다.
- 2.1 명세 및 coordinate 소비 코드에 맞춰 셀/분석 아이템 추가와 zoom/픽셀 계산의 별도 책임을 구분했다. 이 adapter는 RuntimeDocument의 indexes를 사용하지 않는다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 43/108 파일 완료. 다음 6D-1은 `orchestration/partial_rebuild/partial_rebuild_artifacts.ts`의 입력/출력 계약·부분 계산 진입부이며 영향 범위별 재사용 helper를 나누어 진행한다.


### 2026-10-16 6B-3 완료 — 앱 runtime 종료

- `applyMusicDataEditToState`부터 마지막 batch wrapper까지 함수 7개·콜백 5개·결과 유니온 해설 완료. `app_runtime.ts` 전체 함수 20개·콜백 14개를 마쳤다.
- metadata 교체의 기존 인덱스 유효성, YouTube 동일값 원본 반환과 수정 시각 갱신, 레이아웃 검증/삭제 허용·전체 재생성·좌표/이력 정리를 설명했다.
- 단일 note 전체 계산과 batch 부분 계산, 원본 score 참조 기반 무변경 판정, 마지막 명령 선택, null fallback과 예외 거절의 차이, 후보 반환/상위 확정 책임을 구분했다.
- 기존 단일 편집 wrapper 설명을 실제 idle 반환에 맞췄다. 오류 처리에서 unknown 좁히기와 원본 문서/산출물/이력 보존을 명시했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 42/108 파일 완료. 다음 6C는 `canvas_renderer_adapter.ts`의 score→renderer source 변환이며 이후 partial rebuild 모듈을 진행한다.


### 2026-10-16 6B-2 완료

- `applyActiveTrackIdsToState`부터 `loadScoreTextAsInitialState`까지 함수 7개·콜백 7개 해설 완료. runtime 누적 함수 13개·콜백 9개이며 파일 전체 완료는 아니다.
- 표시 옵션 변경의 문서/분석 재사용, 열 확장/축소의 정수·상한/최소 열 검증, 전체 산출물 재생성, 오른쪽 셀 필터·삭제 개수 집계와 원본 셀 참조 공유를 설명했다.
- 구조 변경의 이력/loop 초기화, 단일/범위 선택 정리와 clipboard 유지, Clear All의 layout/instData/트랙 설정 보존·전역 0열 초기화·metadata 교체를 명시했다.
- JSON 로드 결과 유니온과 이후 산출물 생성 예외의 별도 경계, 후보 상태 반환과 실제 draw/오디오 갱신의 책임을 구분했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·해설 범위 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 전체 완료 파일은 41/108 유지. 다음 6B-3은 `applyMusicDataEditToState`부터 metadata·셀 편집·레이아웃 및 나머지 helper이다.


### 2026-10-16 6B-1 완료

- `app_runtime.ts` 모듈·기본값 3개와 `createDefaultMusicData`부터 `createInitialState`까지 함수 6개·콜백 2개 해설 완료. 파일 전체 완료는 아니다.
- 기본 전역 원문·metadata 시간/영상 설정, 전체 파싱→분석→렌더 입력, marker 분리/새 배열 정렬, 표시용 행 반전의 원본 배열 보존·객체 공유를 설명했다.
- 초기 문서/산출물 참조·활성 배열/loop 복사, 브라우저 보정값 로드, 새 이력/선택 초기화, 실제 픽셀 layout 미생성과 기본 복귀 layout 구분을 설명했다. 빠진 activeTrackIds/reverseRows 인수 JSDoc도 보완했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·해설 범위 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 전체 완료 파일은 41/108 유지. 다음 6B-2는 `applyActiveTrackIdsToState`부터 표시 옵션/악보 로드·편집 상태 갱신 함수군이다.


### 2026-10-16 6A-3 완료 — 앱 타입 종료

- AppDom 196개 요소 참조를 검토하고 컨테이너/입력/표시/대화상자별 필요한 해설을 보강했다. `app_types.ts` 전체 타입 20개 완료.
- scroll/Canvas stage와 label 동기화, typed DOM 참조와 실제 데이터의 차이, 편집 원문/미리보기·배열 입력, 파일/로컬 저장 경로, loop·Practice 입력/화면 보정과 실시간/결과 표시를 설명했다.
- zoom/speed 퍼센트와 보정 ms, YouTube 악보/local offset 및 player mount, 레이아웃 초안/프리셋 제어와 실제 renderer target을 구분했다. 이름과 주변 설명만으로 명확한 버튼은 반복 설명을 생략했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·전체 타입 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 41/108 파일 완료. 다음 6B-1은 `app_runtime.ts`의 초기값·문서 파생 산출물 생성·초기 상태 구성부터 진행한다.


### 2026-10-16 6A-2 완료

- `AppState`의 전체 필드 해설 완료. app_types 누적 19개 타입이며 AppDom은 다음 단위로 남아 있다.
- 확정 document와 parsed/analysis/renderInput/layout의 역할, outputSyncError의 확정 후 복구 정책, 활성 트랙/표시/속도/loop 상태, 단일·범위 선택과 클립보드/preview의 null 의미를 설명했다.
- Practice 입력/화면 보정과 YouTube 로컬 보정의 ms 단위·저장 경계, history/mode/busy의 역할, defaultLayoutDraft의 기본 복귀 기준을 실제 초기화·사용 지점과 대조했다. 내부 필드 블록 주석은 가이드에 맞춰 //로 정리했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 전체 완료 파일은 40/108 유지. 다음 6A-3은 AppDom의 화면 컨테이너·편집/저장/Practice/YouTube 제어 요소 참조 계약이다.


### 2026-10-16 6A-1 완료

- `app_types.ts`의 UiStatusLevel부터 UndoHistoryState까지 공용 타입 18개 해설 완료. AppState/AppDom은 다음 단위이며 파일 전체 완료는 아니다.
- 상태/도구 유니온 각 경우, number ramp 토큰, hit/선택 좌표, 범위의 배타적 끝, sparse clipboard의 원본 행 목록·상대 열·선택적 track, 미리보기 null을 설명했다.
- scoreOrigin에 따른 저장 timestamp 정책, loop 경계 선택 상태, 이력의 셀 부재 null과 한 조작의 patch 묶음·stack 한도를 실제 편집/저장 helper와 대조했다. 2.2의 최신 확정/출력 오류 정책도 확인했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·타입 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 전체 완료 파일은 40/108 유지. 다음 6A-2는 AppState의 문서·파생 산출물·사용자 설정·편집/Practice 상태 계약이다. 큰 AppDom 묶음은 그 다음 단위로 진행한다.


### 2026-10-16 5G 완료 — 오디오 단계 종료

- controller는 입력/계약부터 타이머·loop helper까지 함께 검토하여 전체를 완료했다. `playback_controller.ts` 함수 9개·반환 메서드 11개·타입 메서드 계약 11개·측정 콜백 17개 해설 완료.
- 상태별 위치와 audio/score 기준점, generation 기반 비동기 시작 취소, 실제 음원 정지와 예약 키 초기화의 분리, pause/resume/seek/stop/dispose, 현재 clock 차이·loop 회차/나머지·범위 정규화를 설명했다.
- 자연 종료는 악보 끝에 위치를 두고 타이머만 멈추며, 명시적 stop은 음원/키 정리와 0초 복귀를 수행한다. getState는 내부 객체 참조를 반환하고 dispose는 scheduler 키를 비우지 않는다.
- 검토 사항: 비재생 seek 경로는 generation을 증가시키지 않아 준비 중 play의 후속 시작을 취소하지 않을 수 있다. 실제 코드를 설명하고 후속 기능 검토 사항으로 남겼으며 이번에 수정하지 않았다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·전체 함수/메서드/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 40/108 파일, 5단계 오디오 7개 파일 완료. 다음 6A는 `app/app_types.ts`의 앱 상태/산출물 계약이며 이후 app_runtime·renderer adapter·partial rebuild를 진행한다.


### 2026-10-16 5F-4 완료 — backend 종료

- `clampEffectTimeRange`부터 마지막 정규화 helper까지 함수 9개 해설 완료. backend 전체 함수 25개·메서드 6개·콜백 13개와 타입/상수 해설을 마쳤다.
- 악보 초→AudioContext 절대 초 변환·발음 범위 교집합·null 반환, 원본 값/참조 미변경, 표준/webkit 생성자 선택과 타입 단언, compressor 설정/연결 책임을 설명했다.
- UI volume과 자동화 gain의 서로 다른 비유한 기본값, master gain 제곱, 0초 옵션 대체·fallback 미검증·양수 상한 없음 등 실제 정규화 범위를 명시했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·전체 함수/메서드/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 39/108 파일 완료. 다음 5G-1은 `playback_controller.ts`의 입력/상태·재생 제어 진입부이며 타이머/loop/clock helper를 나누어 이어간다.


### 2026-10-16 5F-3 완료

- `applyVibratoEffects`부터 `createEdgeEnvelope`까지 함수 7개·콜백 7개 해설 완료. backend 누적 함수 16개·메서드 6개·콜백 13개이며 파일 전체 완료는 아니다.
- vibrato LFO/depth 생성·detune 연결·효과 구간 on/off·수명 등록, 강약/동시 발음 gain의 필터/타입 좁히기/새 배열 정렬·배율 제한·instant/linear 예약을 설명했다.
- tremolo의 다음 효과 간격과 gain 복귀, tick×division 기반 pulse 수 보정/상한·균등 초 분할·gate duty/ramp, envelope의 상승/유지/하강 및 짧은 발음 경계 제한을 설명했다.
- 시간 clip 자체는 값 재보간을 하지 않으며 scheduler와 책임을 나눈다. 기존 Tone.js 비교 문구는 외부 재사용 근거로 확대하지 않고 실제 LFO 동작 설명으로 교체했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·해설 범위 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 전체 완료 파일은 38/108 유지. 다음 5F-4는 `clampEffectTimeRange`부터 시간 교집합·context 생성자·limiter·gain/옵션 정규화 helper 및 backend 전체 검토이다.


### 2026-10-16 5F-2 완료

- backend의 `scheduleNoteEvent`·`scheduleGlissEvent`·`scheduleGlissChainEvent`·`scheduleGlissChainFrequency` 4개 함수·콜백 6개 해설 완료. 누적 함수 9개·메서드 6개·콜백 6개이며 파일 전체 완료는 아니다.
- 발음 수 상한·현재 clock+offset·note 최소 길이·gliss 원래 길이·양끝 fade 제한, 노드 생성/소유 묶음, 효과·강약·보정·envelope 역할과 연결 순서, ended 정리 및 끝+20 ms stop을 설명했다.
- 이전 MIN_NOTE_SECONDS 주석을 실제 일반 note에만 적용되는 범위로 정정했다. chain은 입력 순서의 끝 Hz ramp를 연결하며 정렬/틈 보정을 하지 않는다.
- 비교 확인: scheduler의 재개/clip은 반음 단위 선형 보간이고 backend 출력은 Hz 선형 ramp이다. 두 곡선이 같다고 설명하지 않으며 실제 구현을 각각 해설했다. 음정 연속성의 기능 검토는 후속 범위이고 이번 작업에서 코드/명세는 수정하지 않았다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·해설 범위 JSDoc·typecheck/build 통과.
- 전체 완료 파일은 38/108 유지. 다음 5F-3은 `applyVibratoEffects`부터 강약/동시 발음 자동화·tremolo gate 및 envelope helper이다.


### 2026-10-16 5F-1 완료

- `oscillator_backend.ts` 모듈·옵션/노드/발음/edge 타입 4개·상수 18개와 `midiToFrequency`, 생성 함수, context/master 조회, cleanup 함수 5개·반환 메서드 6개 해설 완료. 발음 예약 함수군은 아직 남아 있다.
- MIDI/cent→Hz, UI 음량 제곱과 옵션 정규화, 개별 gain 역할, 지연 context 생성·master/limiter 출력 연결, 미래 예약도 포함하는 active Set을 설명했다.
- stopAll의 automation 취소·주/보조 oscillator 정지·즉시 disconnect, cleanup의 노드별 예외 격리와 Set 제거, dispose의 비동기 close 미대기·참조 초기화 및 this 사용을 구분했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·해설 범위 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 전체 완료 파일은 38/108 유지. 다음 5F-2는 `scheduleNoteEvent`·`scheduleGlissEvent`·`scheduleGlissChainEvent`·`scheduleGlissChainFrequency`의 실제 발음 노드 생성/연결/예약이다.


### 2026-10-16 5E-2 완료 — scheduler 종료

- `createResumedScheduleEvent`부터 마지막 `clamp`까지 20개 함수·콜백 15개 해설 완료. scheduler 전체 25개 함수·메서드 3개·콜백 21개를 마쳤다.
- note/gliss/chain 중간 재개와 loop 끝 자르기, 초 진행률에 따른 음정 보간·MIDI/cent 재분리, gain/pitch 자동화의 경계값 보간, 빈 구간 제외와 타입 좁히기를 설명했다.
- 복사/원본 반환·effect 참조 공유, 초 경계 변경과 tick 경계 보존을 구분했다. 재개 효과는 끝난 항목만 제거하고 loop clip은 끝 초만 바꾸며 tremolo durationTicks는 재계산하지 않는 실제 동작을 기록했다. backend가 효과 시간을 발음 범위로 제한하는 것도 확인했다.
- 비유한 입력·길이 없는 구간·instant gain·음수 경계 허용 범위와 generic 배열 타입 단언을 설명했다. 제품 기능은 수정하지 않았다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·전체 함수/메서드/콜백 JSDoc·typecheck/build 통과.
- 누적 38/108 파일 완료. 다음 5F-1은 `oscillator_backend.ts`의 설정/노드 계약·생성/수명 관리 진입부이며, 실제 note/gliss 발음 및 automation/effect helper를 나누어 이어간다.


### 2026-10-16 5E-1 완료

- `audio_scheduler.ts` 입력/조회 창 타입 2개와 진입부부터 `createResumedEventKey`까지 함수 5개·메서드 3개·콜백 6개 해설 완료. 파일 전체 완료는 아니다.
- 진행 중 음 재개/새 시작 예약, null 후보 제외와 loop 끝 clip, 악보 절대 초→현재 기준 offset, backend 호출 후 key 기록을 설명했다.
- 현재/다음 회차 창과 한 회차까지만 넘기는 범위, 회차별 일반/재개 key, 직전·현재·미래 key 유지, reset과 음원 중단의 별도 책임을 명시했다. 실제 인수에 없는 window JSDoc도 제거했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·해설 범위 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 전체 완료 파일은 37/108 유지. 다음 5E-2는 `createResumedScheduleEvent`부터 note/gliss/chain 재개와 loop 끝 clip helper이다.


### 2026-10-16 5D 완료

- `audio_event_queue.ts` 전체 함수 3개·객체 메서드 3개·콜백 2개 해설 완료.
- 배열 복사/원소 참조 공유·생성 후 변경 반영 범위, 시작 반열린 범위와 겹침 조회, 동일 양끝 시각으로 진행 중 음을 찾는 scheduler 호출, 전체 건수·범위 검증·정렬 순서를 설명했다.
- 이전 다음 범위 기록의 “예약 키 관리”는 실제로 scheduler 책임이다. 큐에는 cursor나 예약 상태가 없고 매 조회에서 전체 배열을 필터링한다. 2.3의 초기 seek cursor 표현 대신 실제 구현을 해설하며 명세 기능 변경은 하지 않는다.
- 제품 원본 snapshot hash·주석 제외 TypeScript 구문 동일성·모든 함수/메서드/콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 37/108 파일 완료. 다음 5E-1은 `audio_scheduler.ts` 입력/조회 창 계약과 scheduler 진입·예약 키 관리이며 이후 재개/loop clip helper를 나누어 진행한다.


### 2026-10-16 5C-7 완료 — 일정 생성기 종료

- `buildDynamicsGainAutomation`부터 마지막 비교 함수까지 12개 함수·콜백 3개 해설 완료. `audio_schedule_builder.ts` 전체 51개 함수·콜백 31개 해설을 마쳤다.
- 강약 구간 교집합·tick 보간·초 변환·gain 정규화, gliss 시작 anchor의 첫 tremolo 조회와 전체 gliss 범위 확장, 연장 note 효과 보존, 좌표/범위/정렬 helper를 설명했다.
- 보간값 자체의 clamp 없음, 강약 gain 변환의 유한값 검사와 clamp, 효과 목록의 정렬/clip 미수행, source 좌표 비교와 객체 복사 경계를 구분했다.
- 2.3 명세의 초기 효과 보존 단계 표현과 현재 backend의 실제 gain gate 구현은 시점이 다르다. 현재 코드 해설에는 실제 소비 구현을 적용하고 초기 문서는 역사적 단계로 유지한다. 이번 작업에서 기능/명세 변경은 필요하지 않다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·51개 함수/31개 콜백 JSDoc·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 누적 36/108 파일 완료. 다음 5D는 `audio_event_queue.ts`의 시간 창 조회와 예약 키 관리이며 이후 scheduler를 진행한다.


### 2026-10-16 5C-6 완료

- `createAudioGlissScheduleEvent`부터 `getAudioGlissStartTick`까지 8개 함수·콜백 3개 해설 완료. 누적 39개 함수·콜백 28개이며 파일 전체 완료는 아니다.
- 단일 셀 시작 보정과 원본 anchor 유지, 체인 양끝 연장·중간 bridge의 고정 음정 구간, 악보 절대 초와 MIDI/cent 끝점, null 구간 제외를 설명했다.
- 효과 배열 연결 순서와 정렬/중복 제거 없음, 전체 발음 범위의 강약 자동화, 원본 분수 참조/복사 차이를 명시했다. 누락된 dynamicsTimeline/noteEvents 인수 설명도 보완했다.
- 제품 원본 snapshot hash·주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 전체 완료 파일은 35/108 유지. 다음 5C-7은 `buildDynamicsGainAutomation`부터 강약 자동화·효과 및 나머지 helper이다.


### 2026-10-16 해설 5C-5 완료

- 5C-5 `createAudioNoteScheduleEvent`부터 `getClippedNoteEndTick`까지 7개 함수·콜백 4개 해설 완료. 누적 31개 함수·콜백 25개이며 파일 전체 완료는 아니다.
- note의 유효 tick/score 초·발음 음정·트랙 gain·원본 효과/잘린 강약 구간, 동일 note의 최대 도착/최소 출발 clip Map, 원본 anchor ID/역할/좌표 조회를 설명했다.
- Map key와 반환 note의 객체 참조, 시간 분수 복사, 범위 밖 후보의 원본 유지, 양끝 포함과 최종 양수 길이 검사 위치를 구분했다. 시작 clip 설명을 실제 모든 gliss/startAnchorTick 사용에 맞췄다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 35/108 유지. 다음 5C-6는 `createAudioGlissScheduleEvent`부터 fallback/chain 발음 일정과 pitch segment 조립 함수군이다.

### 2026-10-16 해설 5C-4 완료

- 5C-4 `isSingleCellGlissAnchorNote`부터 `isGlissEvent`까지 경계/연장/연결/타입 좁히기 8개 함수·콜백 2개 해설 검토 완료. 누적 24개 함수·콜백 21개이며 파일 전체 완료는 아니다.
- 일반 source 하나와 정확한 한 열 발음 범위, 슬롯 제외, gliss 원본/역할 매칭과 같은 트랙 목록 전제, 일반 col/col+1 대 슬롯 실제 접속 tick, 원본 note 참조 반환을 설명했다.
- 체인 연결의 숫자 시간 정확 비교·발음 MIDI/cent·trem 유무 일치와 trem 분할 수 미비교를 구분했다. 명확한 eventKind 판별에는 불필요한 내부 주석을 추가하지 않았다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 35/108 유지. 다음 5C-5는 `createAudioNoteScheduleEvent`부터 note 발음 일정·gliss 시작/끝 clip Map·anchor 조회 helper이다.

### 2026-10-16 해설 5C-3 완료

- 5C-3 `buildConnectedGlissChains`부터 `buildMutedGlissAnchorNoteSet`까지 6개 함수·콜백 2개 해설 완료. 누적 16개 함수·콜백 19개이며 파일 전체 완료는 아니다.
- 인접 gliss의 track/id/tick/발음/trem 연결 조건, 단독 gliss의 긴 note 연장, 원본 객체 identity Set과 공유 note 병합, N-1 bridge 위치 정규화·null 채움, 흡수된 note의 독립 발음 제외를 설명했다.
- 조립 함수와 실제 연결/연장 판정 helper를 대조했다. 새 배열/객체 생성과 원본 gliss/note 참조 공유, 입력 events 배열 보관을 구분했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 35/108 유지. 다음 5C-4는 `isSingleCellGlissAnchorNote`부터 원본 셀/slot 경계·긴 note 연장·연결 판정과 타입 좁히기 helper이다.

### 2026-10-16 해설 5C-2 완료

- 5C-2 `buildGainScaleSpans`부터 `mergeAdjacentConstantGainScaleAutomation`까지 7개 함수·콜백 2개 해설 완료. 누적 10개 함수·콜백 17개이며 파일 전체 완료는 아니다.
- 동일 시각 경계의 delta 합산, pitch별 발음 수와 Map 크기의 차이, 중복 1/N 및 3그룹 이상 제곱근 화음 감쇠, 이벤트별 교집합 자동화와 시작 탐색 인덱스를 설명했다.
- 시각→pitch key→delta 정렬, 바로 직전 출력 span만 병합하는 범위, MIDI/cent 정확 key와 gliss별 독립 key, 출력 객체 복사 및 상수 자동화 병합 전제를 명시했다. 빠진 startSpanIndex 인수 설명도 보완했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 35/108 유지. 다음 5C-3는 `buildConnectedGlissChains`부터 gliss 체인·긴 note 연장/bridge 조립 함수군이다.

### 2026-10-16 해설 5C-1 완료

- 5C-1 `audio_schedule_builder.ts`의 모듈·상수 4개·내부 타입 3개와 buildAudioSchedule/buildAudioScheduleWithMapper/applyOverlapGainScaleAutomation 3개 함수·콜백 15개 해설 완료. 파일 전체 완료는 아니다.
- 활성 트랙별 note/gliss 수집, 원본 객체 key의 시작/끝 clip Map과 중복 제외 Set, gliss 체인/연장 조립, null 발음 제외, 전체 트랙 정렬 후 gain 보정 순서를 설명했다.
- 일정 길이와 마지막 발음 끝의 차이, 자동화 부착 시 새 객체/배열과 중첩 참조 공유, 시간순 span 후보 커서, pitch 그룹/화음 보정 타입 의미를 실제 helper와 대조했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·콜백 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 35/108 유지. 다음 5C-2는 `buildGainScaleSpans`부터 sweep 경계·화음 보정·자동화 병합 helper이며 이후 gliss 체인 함수군을 진행한다.

### 2026-10-16 해설 5B 완료

- 5B `tick_time_mapper.ts` 전체 함수 13개·반환 객체 메서드 3개·정렬 콜백 1개 해설 완료.
- 구간 배열 복사/원본 참조·누적 초, 상수 BPM 식과 tick 선형 BPM의 로그 적분/지수 역변환, 오차 기준·소수 여섯 자리 분수 근사·약분을 설명했다.
- 빈 map 조회 실패/길이 0 반환, 경계 포함 규칙, seconds clamp와 tick 외삽의 차이, 구간 틈/중복 미보정과 실제 검증 범위를 명시했다. 기능 수정은 하지 않았다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·함수/메서드/콜백 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 35/108 파일 완료. 다음 5C는 `audio_schedule_builder.ts`의 일정 생성 진입부부터이며 큰 파일을 활성 트랙/동시 발음 보정·gliss 체인·note/효과/자동화 함수군으로 나누어 진행한다.

### 2026-10-16 해설 5A 완료

- 5A-2 자동화·loop/재생 상태·옵션·backend/lookahead 계약을 마쳐 `audio_types.ts` 전체 18개 타입·메서드 계약 15개 해설 완료.
- score 초/오디오 clock 기준점과 offset, gainRamp/gainScale 노드 역할, loop 회차, 예약 key 수와 실제 발음 수 구분, key reset과 음원 중단의 별도 책임, context 생성/해제의 부수 효과를 설명했다.
- AudioSchedulerOptions는 미사용 선언이며 noteReleaseSeconds는 backend releaseSeconds에 연결되지 않는다. pitchRamp는 scheduler 변환이 있지만 현재 builder 생성/oscillator 직접 소비가 없는 계약임을 실제 사용 검색으로 확인했다.
- 제품 원본 snapshot hash·전체 주석 제외 TypeScript 구문 동일성·18개 타입/15개 메서드 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 34/108 파일 완료. 다음 5B는 `tick_time_mapper.ts`의 tempo 구간 정규화·tick↔초 변환이며 이후 일정 조립을 진행한다.

### 2026-10-16 해설 5A-1 완료

- 5A-1 `audio/audio_types.ts`의 모듈 및 AudioBuildInput부터 AudioScheduleEffect까지 첫 12개 타입 해설 완료. 파일 전체 완료는 아니다.
- 악보 tick/score 초/AudioContext 시각의 경계, mapper/queue 메서드, 시작 범위와 이미 진행 중인 긴 음 조회, 활성 트랙·원본 참조·발음 gain·note/gliss/chain·효과 구간을 설명했다.
- 2.3 명세와 실제 queue/scheduler/builder/backend를 대조했다. 현재 native oscillator 구현과 Tone.js 대체 후보를 구분하고 fade·trem tick 길이의 소비를 확인했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 33/108 유지. 다음 5A-2는 AudioAutomationEvent부터 loop/재생 상태·scheduler 옵션·backend/lookahead 메서드 계약이며 실제 사용 여부를 대조한다.

### 2026-10-16 해설 4단계 완료

- 4G-4 크기 조정·재사용 비교·입력 getter·marker 분리 helper와 전체 누락 점검을 마쳐 `canvas_score_renderer.ts` 전체 12개 함수·콜백 69개 해설 완료.
- 고정 label/동적 4개 canvas 준비, 재사용 비교의 실제 필드와 미비교 표시 속성, 유니온 필드 존재 확인·입력 배열 참조·빈 목록, 전역 marker fallback과 gliss 분리를 설명했다.
- 파일 원본 snapshot hash·주석 제외 TypeScript 구문 동일성·모든 함수/콜백 인수·반환값 JSDoc·typecheck/build 통과. 4단계 renderer 12개 파일 전체의 원본 hash·주석 제외 구문 동일성도 대조했다. 제품 코드·동작·타입 변경 없음.
- 4단계 렌더러 12/12 파일 완료, 누적 33/108 파일 완료. 다음 5A는 `audio/audio_types.ts`의 일정·재생·backend 계약이며 이후 tick 시간 변환→일정 조립→queue/scheduler→backend/controller 순으로 진행한다.

### 2026-10-16 해설 4G-2·4G-3 완료

- 4G-2 dynamic viewport 및 4G-3 일반 부분 갱신을 함께 마쳐 `renderCanvasScorePartial` 전체와 콜백 37개(계측 33개·gliss 4개) 해설 완료. 파일 전체 완료는 아니다.
- 새 layout 계산/재사용 실패 시 전체 fallback, viewport에서 dirtyTickRange 대신 가시 영역 갱신, base bitmap 변경 시에만 배경 draw, note/global scope의 noteMarker 재사용 차이를 설명했다.
- 일반 note의 범위 없음/gliss 존재/범위 제한 분기와 일반 global의 marker·전역 행 문구 갱신을 구분했다. dynamicViewport!의 분기 보장, 계측 콜백의 즉시 실행/반환과 canvas 부수 효과를 설명했다.
- 제품 원본 snapshot hash·전체 파일 주석 제외 TypeScript 구문 동일성·37개 콜백 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 32/108 유지. 다음 4G-4는 `resizeCanvasLayersToDynamicViewport`부터 재사용 비교·입력 getter·marker 분리 helper와 파일 전체 누락 점검이다.

### 2026-10-16 해설 4G-1 완료

- 4G-1 `canvas_score_renderer.ts`의 모듈과 `renderCanvasScore` 전체 진입점 및 콜백 29개(계측 27개·중간 gliss 2개) 해설 완료. 파일 전체 완료는 아니다.
- DTO/getter와 layout 경계, loop 목록 결합, viewport 후보 선택·DPR 대체·5개 canvas 준비, 정적 배경/동적 열 격자/전역 marker 공유, gliss 중간 삽입과 tuplet 마지막 overlay 순서를 설명했다.
- 전체 폭 경로의 필터 미사용과 base 격자 배치를 구분했다. measurePerf가 콜백을 즉시 실행해 반환값을 전달함을 실제 profiler와 대조하고 콜백별 반환/그리기 부수 효과를 기록했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 32/108 유지. 다음 4G-2는 `renderCanvasScorePartial`의 layout 재사용/전체 fallback 및 dynamic viewport 분기부터이며 이후 일반 부분 갱신과 공통 helper를 진행한다.

### 2026-10-16 해설 4F 완료

- 4F-2 종류별 그리기와 4F-3 좌표/색/두께 helper를 마쳐 `canvas_marker_renderer.ts` 전체 26개 함수·콜백 4개 해설 완료.
- 박자/마디/BPM 선의 색·폭·dash 상태, 강약 값의 유한성/범위 제한과 행 높이 비례 도형, gliss 접속 tick/cent·alpha·trem 점선, orphan의 S/M/E별 바깥 반 열 선을 설명했다.
- tuplet의 시간 폭·행 중심·고정 대비 alpha·점선 복원·null 라벨 생략·글꼴 배율, MIDI 방향별 최근접 행 보간과 범위 끝 외삽을 설명했다. note renderer와 같은 좌표 helper는 주석을 대조해 일관성을 유지했다.
- 제품 원본 snapshot hash·주석 제외 전체 TypeScript 구문 동일성·전체 함수/콜백 인수·반환값 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 32/108 파일 완료. 다음 4G는 `canvas_score_renderer.ts`의 전체/부분 렌더 orchestration과 레이어 갱신이며 큰 함수는 처리 구간별로 나누어 진행한다.

### 2026-10-16 해설 4F-1 완료

- 4F-1 `canvas_marker_renderer.ts`의 모듈·트랙/점선 상수와 전체/부분 marker·overlay·gliss 진입부, 행 Map·범위·loop 경계·clip까지 첫 11개 함수 해설 완료. 파일 전체 완료는 아니다.
- 강약→박자→loop→BPM/gliss/orphan 그리기 순서, preserveExisting과 tuplet 표시 옵션, note 도형/문구 사이 gliss 경로, 원본 행 참조와 종류별 tick 범위를 설명했다. 실제 score renderer 호출과 대조했다.
- 지우기/clip의 CSS 여유와 원래 dirty tick 후보 선택 차이, 경계 접촉 포함, orphan 실제 선폭 미반영, loop 라벨 실측/고정 크기/위치 제한, context clip 수명을 설명했다. 빠져 있던 options 인수 설명 3개를 보완했다.
- 제품 원본 snapshot hash·전체 파일 주석 제외 TypeScript 구문 동일성·첫 11개 함수 인수/반환값 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 31/108 유지. 다음 4F-2는 `drawTimingLineMarker`부터 박자/BPM/강약·gliss/orphan·tuplet 표시 함수이며 이후 좌표 helper와 전체 누락을 확인한다.

### 2026-10-16 해설 4E 완료

- 4E-3 효과·4E-4 공통 helper를 마쳐 `canvas_note_renderer.ts` 전체 34개 함수·콜백 4개·내부 타입 2개 해설 완료.
- trem 표시 구간과 배경색 절단선, square 전체 폭/rect 교집합, vib 후보의 시작·정확 인접 병합·종료·마지막 출력, 원본 tick 기준 주기 수, 시각 진폭·표본 분할·양끝 중심선 처리를 설명했다.
- 남은 문구 배치·긴 슬롯 판정·범위 겹침·배율·트랙 색상 helper와 내부 타입을 점검했다. effect insetX 및 wave cycleCount 인수와 VibDrawRange 반환 설명을 보완했다.
- 제품 원본 snapshot hash·주석 제외 전체 TypeScript 구문 동일성·전체 함수/콜백 인수·반환값 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 31/108 파일 완료. 다음 4F는 `canvas_marker_renderer.ts`의 전체/부분 marker 그리기 진입부와 박자/BPM/강약/gliss/tuplet helper이며 함수군별로 진행한다.

### 2026-10-16 해설 4E-2 완료

- 4E-2 `canvas_note_renderer.ts`의 좌표 배치·cent 보간/외삽·도형/테두리·note/mute/global 문구 9개 함수와 콜백 4개 해설 완료. 누적 20개 함수·4개 콜백이며 파일 전체 완료는 아니다.
- square의 시작 열 반 tick 위치, 왼쪽 확장과 오른쪽 끝 보존, 얕은 복사, MIDI 방향별 최근접 행과 화면 y 방향, cent 비율 보간과 경계 외삽을 설명했다.
- 발음 MIDI 색상, 변별 테두리 생략, 문구 anchor 미존재 시 대체 없음, square/긴 슬롯/일반 문구의 배치 차이, 문구 넘침, mute 고정 글꼴과 전역 문구 배율을 설명했다. 기존 중심 정렬 설명을 실제 helper 분기에 맞췄다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 30/108 유지. 다음 4E-3는 `drawNoteEffects`부터 trem/vib 범위·그리기·표본 helper이며 이어 문구 배치 등 남은 공통 helper와 파일 전체를 점검한다.

### 2026-10-16 해설 4E-1 완료

- 4E-1 `canvas_note_renderer.ts`의 모듈·트랙 식별자와 전체/부분 draw·전역 문구 갱신·행 Map·dirty 범위 helper까지 첫 11개 함수 해설 완료. 파일 전체 완료는 아니다.
- 도형/효과→overlay→문구 순서, note/mute 숨김과 전역 원문 구분, 아이템 alpha의 save/restore, 원본 행 참조, 지우기와 clip 범위 및 수명을 설명했다. 누락된 선택적 인수 6개의 JSDoc을 보완했다.
- 부분 갱신의 고정 여유 폭·tick 환산·경계 접촉 후보 포함, y 높이 확장과 cent 개별 측정 미수행, 후보 끝 범위와 실제 CSS clip의 차이를 설명했다.
- 제품 원본 snapshot hash·전체 파일 주석 제외 TypeScript 구문 동일성·첫 11개 함수 인수/반환값 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 30/108 유지. 다음 4E-2는 `createNoteLayoutItem`부터 좌표 배치·행/cent 위치·note 도형 및 문구 처리이며 이후 효과 helper를 진행한다.

### 2026-10-16 해설 4D 완료

- 4D `canvas_grid_renderer.ts` 전체 8개 함수 해설 완료. 라벨 음급 색·문구 정렬·여백 구분선·오른쪽 여백 반폭 표시, 전체 grid 및 정적 행 배경/동적 열선 분리를 설명했다.
- CSS pixel과 호출자 DPR/좌표 변환 경계, 반 pixel 선 위치, 글꼴 기반 배율 역산, 바깥 정수 열까지 확장한 가시 후보, 별도 clip 미설정, context 스타일의 변경/복원을 구분했다. 실제 score renderer의 resize→배경→열선→marker 호출을 대조했다.
- 제품 원본 snapshot hash·주석 제외 TypeScript 구문 동일성·8개 함수 인수/반환값 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 30/108 파일 완료. 다음 4E는 `canvas_note_renderer.ts`이며 전체/부분 draw 진입부와 배치·문구·효과 helper를 함수군으로 나누어 진행한다.

### 2026-10-16 해설 4C-8 완료

- 4C-8 `canvas_item_order.ts`, `canvas_note_colors.ts`, `canvas_theme.ts` 전체 해설 완료. 정렬 함수/helper 5개·콜백 2개, 색상 함수 5개와 팔레트/자연음 집합, 공용 색상/치수 객체를 검토했다.
- 입력 배열 제자리 정렬·동순위 순서 보존, 실제 layout 행순서와 rowId 문자열 순서의 차이, marker 종류별 시간/행/트랙 기준, MIDI 음급/자연음·변화음 선택과 정수 입력 전제를 설명했다.
- 소비 코드와 대조하여 CSS pixel·zoom 기준값·고정 글꼴·곡선 표본 수/간격을 구분했다. 객체에 붙어 있던 함수형 인수/반환값 설명은 객체 계약으로 정리하고 as const의 타입 효과를 설명했다.
- 세 파일 제품 원본 snapshot hash·주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 29/108 파일 완료. 4C 아이템 조립/정렬/색상/테마 완료. 다음 4D는 `canvas_grid_renderer.ts`의 라벨·배경·격자 그리기이며 이후 note/marker/score renderer 순으로 진행한다.

### 2026-10-16 해설 4C-6·4C-7 완료

- 4C-6 박자/마디선과 구간 helper, 4C-7 trem/gliss 대응·원본 key·범위·타입 좁히기·시간 변환을 마쳐 `canvas_item_builder.ts` 전체 39개 함수·20개 콜백·내부 타입 1개 해설 완료.
- 박자/step이 같은 인접 구간의 출력 객체 병합, 구간 시작 기준 간격 누적, 배타적 끝점, 소수 6자리 key와 실제 좌표의 차이, 같은 구간에서 마디선 우선 처리를 설명했다.
- note 원본 참조 수집, 시작 원본/track/glissId/역할/slot 대응, trem 구간 겹침, 일반 셀과 0번 슬롯 구분을 설명했다. createGlissAnchorKey의 실제 source 인수와 다르던 JSDoc을 수정하고 전체 함수의 인수·반환값 설명을 확인했다.
- 제품 원본 snapshot hash·주석 제외 전체 TypeScript 구문 동일성·39개 함수/20개 콜백 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 26/108 파일 완료. 다음 4C-8은 `canvas_item_order.ts`, `canvas_note_colors.ts`, `canvas_theme.ts`의 정렬·색상·테마이며 이후 grid/note/marker/score 그리기를 진행한다.

### 2026-10-16 해설 4C-4·4C-5 완료

- `canvas_item_builder.ts`의 4C-4 전역/노트 marker 조립 3개 함수와 4C-5 BPM·강약 marker 및 ramp 경계 helper 6개 함수, 콜백 3개 해설 완료. 누적 22개 함수·17개 콜백이며 파일 전체 완료는 아니다.
- gliss 연결 원본 Set과 두 번의 순회, tuplet 그룹/미소비 연장 container, 시각 anchor tick과 orphan 중심 tick의 차이, 시작 anchor trem 조회, 트랙 alpha 및 정렬을 설명했다. app_runtime과 marker renderer의 실제 소비 경로를 대조했다.
- BPM 초기 구간 제외, 직전 원소 참조, ramp 시작/연속/종료와 방향, 정확 시간 비교와 BPM 오차 허용, 첫 source 셀의 원문 경계 판정, 강약 가이드의 근거 행/양수 길이 조건을 설명했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 25/108 유지. 다음 4C-6는 `buildTimingLineMarkerItems`부터 박자/마디선과 구간 helper이며, 이어 공통 helper와 파일 전체 누락을 확인한다.

### 2026-10-16 해설 4C-2·4C-3 완료

- `canvas_item_builder.ts`의 4C-2 anchor 후보·기본 square 판정·별도 square·효과 변환·시간 비교/길이 6개 함수와 4C-3 mute·전역 텍스트 2개 함수 및 콜백 8개 해설 완료. 누적 13개 함수·14개 콜백이며 파일 전체 완료는 아니다.
- 긴 tuplet S/M 후보의 원본 참조, 원본 좌표별 문구 선택, note 발음 MIDI와 anchor 표시 위치의 분리, S의 왼쪽 테두리/연결 확장, 전체 효과 목록과 후속 draw 범위 계산의 경계를 설명했다.
- 정확한 number 시간 비교, tick/초 구분, mute의 비활성 alpha, 전역 셀의 공백 필터와 원문 보존, 새 표시 배열의 제자리 정렬을 설명했다. 실제 note renderer·track alpha·source 비교 helper 및 2.1 명세와 대조했다.
- 제품 원본 snapshot hash·전체 파일 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 25/108 유지. 다음 4C-4는 `buildCanvasMarkerItems`부터 전역/노트 marker 조립이며 이후 BPM·강약·박자 및 공통 helper를 해설한다.

### 2026-10-16 해설 4C-1 완료

- `canvas_item_builder.ts`의 첫 5개 함수와 6개 콜백 해설 완료. note 필터·활성 트랙 alpha, 기본 도형/별도 anchor 선택, 원본 문구 선택과 효과 전달, 내부 anchor 구간 차감·cursor·테두리 생략을 설명했다. 파일 전체 완료는 아니다.
- 실제 정렬 helper와 대조하여 시작 tick·rowId 문자열·track 표시 순서 및 동순위 입력 순서 보존을 명시했다. 분수 tick의 number 변환은 초/CSS 좌표 변환과 구분했다.
- 제품 원본 snapshot hash·파일 전체 주석 제외 TypeScript 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 25/108 유지. 다음 4C-2는 `getTupletGlissAnchorSquareCandidates`부터 anchor square·효과·시간 비교 helper이며, 이후 mute·전역 텍스트·marker 조립을 진행한다.

### 2026-10-16 해설 4B-2 완료

- `canvas_visible_range.ts` 전체 8개 함수·6개 콜백·3개 내부 타입과 캐시 선언 해설 완료. note/mute 인덱스와 직접 필터의 차이, marker 범위 정규화, 배열 identity WeakMap, 누적 최대 끝점, 이진 탐색/역탐색, 원래 draw 순서 복구를 설명했다.
- 인덱스는 원본 객체 참조와 별도의 tick 복사본을 유지하며 같은 배열 내부 변경을 자동 감지하지 않는다. 입력 배열을 새로 전달해야 갱신된 좌표로 인덱싱되는 계약을 명시했다.
- 원본 snapshot hash·주석 제외 TS 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 4B 좌표/viewport/visible range 3개 파일 전체 완료, 누적 25/108 파일 완료. 다음은 4C `canvas_item_builder.ts`의 이벤트→표시 아이템 변환이며 이후 item order·색상·테마를 다룬다.


### 2026-10-16 해설 4B-1 완료

- 4B-1 `canvas_coordinate.ts`와 `canvas_viewport.ts` 전체 해설 완료. 옵션 정규화·행 누적·열/x 변환, CSS 크기와 bitmap 해상도, context 초기화, 동적 canvas 이동/역방향 좌표 변환, 가시 tick 범위와 경계 접촉을 설명했다.
- 최소 배율 0.25가 있으므로 bitmap 치수 기준이 절대 상한은 아님을 실제 식대로 설명했다. didResize는 CSS 이동이 아닌 bitmap 치수 변경 여부이며, 세로 viewport 제한은 수행하지 않는다.
- 두 파일 원본 snapshot hash·주석 제외 TS 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 24/108 파일 완료. 다음 4B-2는 `canvas_visible_range.ts`의 아이템 필터·WeakMap 인덱스·범위 검색이다.


### 2026-10-16 해설 4A-2 완료

- `canvas_types.ts`의 남은 표시 아이템·marker·결과·부분 redraw 10개 타입을 보강해 전체 23개 타입 해설 완료. 원문/표시 위치, tick/CSS pixel, 발음 MIDI 색상, 도형 경계 생략·접속, 문구 anchor와 효과, 선택 alpha·track, marker 각 경우를 설명했다.
- 실제 item builder/note renderer/score renderer를 대조했다. gliss marker tick은 시각 연결점이며 dirty 범위가 있어도 gliss 또는 동적 viewport 경로에서 갱신 범위가 달라질 수 있음을 구분했다.
- 앞부분 텍스트 보존·원본 snapshot hash·파일 전체 주석 제외 TS 구문 동일성·23개 타입 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 22/108 파일 완료. 다음 4B는 `canvas_coordinate.ts`, `canvas_viewport.ts`, `canvas_visible_range.ts`의 좌표·가시 범위 계산이며 큰 파일은 함수군으로 나누어 진행한다.


### 2026-10-16 해설 4A-1 완료

- `canvas_types.ts`의 모듈 및 CanvasSourceRowKind부터 CanvasViewport까지 13개 타입 해설 완료. 입력 행/열·아이템 묶음·배율/표시 옵션·가시 범위·5개 canvas target·CSS 좌표 모델을 설명했다.
- 2.1 명세와 coordinate/viewport/visible range/score renderer 및 adapter 호출을 대조했다. CSS 좌표와 bitmap 해상도, dynamic 경로의 레이어 역할, marker 분리/통합 목록, 미연결 CanvasViewport를 구분했다. 타입 선언의 불필요한 인수/반환값 형식도 일반 계약 설명으로 정리했다.
- 후반부 텍스트 보존·원본 snapshot hash·주석 제외 TS 구문 동일성·13개 타입 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 전체 완료 파일은 21/108 유지. 다음 4A-2는 CanvasNoteRenderItem부터 note/문구/효과/mute/전역 텍스트/marker/결과/부분 redraw 계약을 실제 소비 코드와 대조한다.


### 2026-10-16 해설 3G 완료 — 분석기 단계 종료

- `analyze_gliss_event.ts` 전체 19개 함수·정렬 콜백·2개 타입 해설 완료. note/트랙 anchor 이중 보관, 원본 시간과 병합 시간, 정렬·중복 key, S/M/E 후보 교체·연결·해제, 관계 범위와 표시 tick, attack/legato 및 release/holdContinue를 설명했다.
- 기존 createGlissAnchorTick 반환 설명을 실제 짧은 슬롯 중심/긴 슬롯 반 tick 위치에 맞췄다. 중복 판정 설명에 slotIndex를 포함했다. 동작은 변경하지 않았다.
- 원본 snapshot hash·주석 제외 TS 구문 동일성·함수 인수/반환값 JSDoc·typecheck/build 통과. 3단계 분석기 9개 파일 모두 완료, 누적 21/108 파일 완료.
- 다음은 4A `renderer/canvas_types.ts`의 입력·아이템·좌표 계약이다. 이후 좌표/viewport/visible range → 아이템 조립/순서/색상/테마 → grid/note/marker/score 렌더 순서로 진행하며 큰 파일은 함수군으로 나눈다.


### 2026-10-16 해설 3F 완료

- `analyze_tuplet_event.ts` 전체 20개 함수·5개 콜백·슬롯 분석 함수 타입 해설 완료. head/연장 길이, 같은 현의 표시 행, 슬롯 시간 분할, note/rest/invalid/merged, 소비 집합과 orphan 연속 구간을 설명했다.
- 그룹 구조와 슬롯 이벤트의 별도 목록, 원문 head 좌표와 슬롯 순번, 분수 tick 계산식, 시간 복제와 source 배열 공유, ID와 좌표 key를 구분했다. 표시 행 조회 실패 null의 반환 설명도 보완했다.
- 원본 snapshot hash·주석 제외 TS 구문 동일성·모든 함수 인수/반환값 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 20/108 파일 완료. 다음은 3G `analyze_gliss_event.ts`의 anchor 누적·연결·좌표/접속 처리이며 이를 마치면 3단계 분석기가 완료된다.


### 2026-10-16 해설 3E 전체 완료

- 3E-2의 연결 조회·표시·발음 helper와 3E-3의 원본/문구/시간 복사·효과·ID helper를 완료하여 `analyze_note_event.ts` 전체 26개 함수·2개 타입 해설을 마쳤다.
- 분수→number의 정확 비교, 표시/발음 key, @p 대체와 @m 보정, source 및 시간 복제, 효과 객체 참조, trem 상속/명시값 우선, vib 머리 확장의 부수 효과, 최초 원문 기반 ID를 설명했다. 누락된 parsedCell 인수 설명도 보완했다.
- 앞선 진입부 텍스트 보존, 원본 snapshot hash·파일 전체 주석 제외 TS 구문 동일성·모든 함수 인수/반환값 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 19/108 파일 완료. 다음은 3F `analyze_tuplet_event.ts`의 그룹 길이·슬롯 시간·rest·orphan extend 처리이며 이후 3G gliss 분석을 진행한다.


### 2026-10-16 해설 3E-1 완료

- `analyze_note_event.ts`의 모듈·HoldConnectionKey/ActiveNoteMap 및 `deleteExpiredActiveNotes`, `analyzeParsedNoteEntry`, `analyzeTupletSlotNote` 3개 함수 해설 완료. 파일 전체 완료는 아니다.
- 트랙별 Map의 공유 참조, 표시/발음 key, 만료 후보 제거, 일반 셀과 슬롯 사이 hold 병합, 원본별 문구/효과/anchor, @n의 같은 현 조회, 시간 복제와 membership 참조, null/merged 반환 계약을 설명했다.
- 1.7의 hold·음정·효과 경계와 실제 하위 helper·gliss append·tuplet 호출 경로를 확인했다. 효과 상속 helper 자체는 후속 범위로 남긴다.
- 후반부 텍스트 보존, 원본 snapshot hash·전체 파일 주석 제외 TS 구문 동일성·typecheck/build 통과. 제품 동작·타입 변경 없음.
- 전체 완료 파일은 18/108 유지. 다음 3E-2는 `fractionToNumber`부터 `createHoldConnectionKey`까지 연결 조회·표시·발음 처리이며, 3E-3에서 원본/문구/시간 복사·효과·ID helper와 파일 전체 누락을 확인한다.


### 2026-10-16 해설 3D 완료

- `analyze_track.ts` 전체 해설 완료. 공개 arrow 진입점 1개·이름 있는 helper 12개·콜백 4개에 대해 entry 범위/정렬, 후보 Map 수명, 일반 note와 슬롯의 상태 공유, mute 표시, orphan extend/gliss 후처리, 최종 이벤트 정렬을 설명했다.
- 누락된 rowOrderById·cellsByCol·consumedPletExtendCellKeys 인수 설명을 보완했다. 범위 끝 포함, 전체 Map의 orphan 조회, 원본 참조 유지와 제자리 정렬을 구분했다.
- 원본 snapshot hash·주석 제외 TS 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 18/108 파일 완료. 다음은 3E `analyze_note_event.ts`의 note 생성·hold 병합·표시/발음·효과 helper이며 실제 함수군으로 나누어 진행한다.

- 행 동순위 비교의 정적 검토 사항은 4.2 기록에 남겼으며 제품 기능은 수정하지 않았다.


### 2026-10-16 해설 3C 완료

- `analyze_global_segments.ts` 전체 16개 함수·6개 콜백·8개 타입 해설 완료. 유효 entry 필터/정렬, 경계 합집합, ramp 쌍 생성, 포함 구간 탐색, 열 기준 보간, 직전값·기본값, source 참조 중복 제거를 설명했다.
- 상수 셀의 열린 후보 취소, 연속 시작 후보 교체, endStart의 닫기/다시 열기, 미완성 후보 제외, 같은 값의 instant 처리, 0 보존과 객체 참조를 실제 구현에 맞춰 구분했다.
- 원본 snapshot hash·파일 전체 주석 제외 TS 구문 동일성·함수/타입 JSDoc·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 17/108 파일 완료. 다음은 3D `analyze_track.ts`의 트랙 순회·이벤트 조립이며, 이후 note·tuplet·gliss 세부 처리 순으로 진행한다.


### 2026-10-16 해설 3B 완료

- `analyze_full.ts`, `analyze_timing.ts`, `analyze_dynamics.ts` 전체 해설 완료. 공개 함수 3개와 트랙 map 콜백, 기본값 상수, 결과 필드를 검토했다.
- 모든 트랙 순회와 전역 결과 조립, 유효 entry 수집, 경계 합집합과 [startCol, endCol) 구간, ramp/직전값/기본값 조회, 근거 셀 합치기, 현재 range 미사용과 빈 진단 배열을 설명했다.
- 구간 helper의 실제 반환을 대조했다. 이 단계는 초 변환·gain 변환·인접 동값 구간 병합을 수행하지 않으며 helper 자체의 주석 완료는 3C에서 다룬다.
- 세 파일 원본 snapshot hash·주석 제외 TS 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 누적 16/108 파일 완료. 다음은 3C `analyze_global_segments.ts`의 전역 구간 계산 helper이다.


### 2026-10-16 해설 3A-2 완료

- `core/analyze/types.ts`의 남은 16개 타입을 보강해 전체 40개 타입 해설 완료. 시간/강약 구간, 진단, 셀 입력, 범위·함수 계약, 캐시 선언을 설명했다.
- 실제 전역 함수는 range를 사용하지 않으며, track range는 양 끝 열을 포함하는 entry 필터이고 연결 의존 범위 확장을 보장하지 않는다. orphan extend는 전체 열 Map을 조회한다. 이를 완성된 부분 분석기로 설명하지 않았다.
- `AnalyzeDocumentPartialFn`·`AnalyzePartialRequest`·`AnalysisCache`·셀 입력 별칭은 현재 사용 경로가 연결되지 않은 선언임을 확인했다. 실제 부분 갱신은 orchestration에서 변경 트랙 전체 또는 전역 타임라인을 다시 계산한다. 진단 코드도 현재 전체 진입점의 빈 issues와 구분했다.
- 원본 snapshot hash·파일 전체 주석 제외 TS 구문 동일성·40개 타입 JSDoc·typecheck/build 통과. 이후 중첩 필드 들여쓰기만 정리했다. 제품 동작·타입 변경 없음.
- 누적 13/108 파일 완료. 다음 3B는 `analyze_full.ts`, `analyze_timing.ts`, `analyze_dynamics.ts`의 조립 흐름이며, 3C에서 `analyze_global_segments.ts`의 세부 구간 계산을 해설한다.


### 2026-10-16 해설 3A-1 완료

- 3A-1 `core/analyze/types.ts`의 모듈 설명 및 `AnalyzeContext`부터 `TupletSlotInfo`까지 24개 타입 해설 완료. 입력·결과·이벤트 공통 필드, 유리수 tick, 표시/발음 경계, hold 병합과 텍스트/effect/gliss anchor, tuplet 구조와 슬롯 상태를 설명했다.
- 1.7 명세와 실제 note·gliss·tuplet 생성 및 전체 analyzer 진입점을 대조했다. `analysisIssues`는 현재 전체 진입점에서 빈 배열을 반환한다는 구현 상태를 구분했다. 관련 구현 함수 자체의 해설 완료로 세지는 않는다.
- 원본 snapshot hash·주석 제외 TS 구문 동일성·24개 타입 JSDoc·후반부 텍스트 보존·typecheck/build 통과. 동작·타입 변경 없음.
- 전체 완료 파일은 12/108 유지. 다음 3A-2는 `AnalyzedTimeSegment`부터 타임라인·진단·부분 갱신·함수 계약·캐시 선언까지이며 실제 사용 여부를 확인한다.


### 2026-10-16 해설 2C·2D 완료 — 파서 단계 종료

- 2C `parse_global_cell.ts`의 18개 함수·숫자 결과 타입·상수 전체 해설 완료. 원문 유지, rowId에서 종류 유도, 숫자 표기/종류별 범위 분리, 끝의 ramp 후보 분리, 오류 위치 추정과 타입 좁히기를 설명했다.
- 2D `build_parsed_document.ts`의 7개 함수 전체 해설 완료. 트랙/열/행 배열과 전역 종류/열 Map, 입력 순서 유지, invalid 보관, 전역 행이 아닌 입력의 생략, 같은 종류·열 덮어쓰기, 객체 참조와 타입 단언의 한계를 설명했다.
- 1.6/1.8 명세와 전역 analyzer 소비 경로를 확인했다. 전역 parser는 ramp 연결을 확정하지 않으며 문서 조립은 열 정렬·중복 검증을 담당하지 않는다.
- 두 파일 원본 snapshot hash·주석 제외 TS 구문 동일성·함수 JSDoc 계약 확인, 해설본 typecheck/build 통과. 제품 코드·런타임·타입 계약 변경 없음.
- 2단계 파서 4개 파일 전체 완료, 누적 12/108 파일 완료. 다음은 3A `core/analyze/types.ts`의 analyzer 계약부터 시작하고 실제 분량에 따라 세부 단위를 나눈다.


### 2026-10-16 해설 2B-6 완료 — 노트 파서 전체 완료

- `parse_note_cell.ts`의 남은 14개 보조 함수와 내부 타입 12개를 검토·보강하여 파일 전체 34개 함수 해설을 완료했다. 후보 검사와 구문 확정, 타입 술어, 표시값 우선순위, 수식어 객체 존재, 원문 오류 위치, 성공/실패 계약을 설명했다.
- 전체 함수·타입 선언 JSDoc 및 함수의 인수/반환값 설명을 확인했다. 원본 snapshot hash·파일 전체 주석 제외 TS 구문 동일성·typecheck/build 통과. 최초 주석 항목 검사 명령은 PowerShell 파이프의 한글 인코딩 때문에 실패했으며 검사 문자열을 Unicode escape로 바꾼 재검증은 통과했다. 소스 오류가 아니며 기능 변경 없음.
- 전체 10/108 파일 완료. 다음은 2C `parse_global_cell.ts`이며 실제 함수군을 확인해 분할한다.


### 2026-10-16 자동 진행 목표 등록·해설 2B-5 완료

사용자가 4.2 계획 전체 완료까지 자동 진행을 선택했다. Goal 등록 완료, 각 단위 검증과 기록을 유지한다.

- `findMatchingParen`, `splitTupletSlots`, `scanDefaultText`, `unescapeText`, `readEscapedChar` 다섯 함수 해설 완료. 괄호 깊이·escape 건너뛰기와 검증의 분리, 빈 슬롯 보존, 원문 위치와 표시 문자열 길이의 차이, 오류 offset 보정을 설명했다.
- 편집 영역 밖 텍스트 보존, 원본 snapshot hash·주석 제외 TS 구문 동일성·typecheck/build 통과. 제품 코드·동작·타입 변경 없음.
- 노트 파서 누적 20개 함수 완료. 전체 파일 완료 수는 9/108 유지하며 다음은 2B-6 판별·값·오류 helper와 내부 타입 및 파일 전체 누락 확인이다.


### 2026-10-16 해설 2B-4 완료

- 해설본 `parse_note_cell.ts`의 수식어 인수 처리와 오류 분류 여섯 함수를 보강했다. 원문 표기·범위 검사·첫 닫는 괄호 검색·위치 기준·중복과 순서 판정을 설명했다.
- 원본 hash·파일 전체 주석 제외 TS 구문 동일성·typecheck/build 통과. 제품 코드와 동작 변경 없음.
- 노트 파서 누적 15개 함수 완료, 전체 완료 파일은 9개 유지. 다음은 2B-5 구조·문자열 스캔 다섯 함수이다.



### 2026-10-16 해설 2B-3 완료

- 새 해설본의 `parsePletSlot`·`parsePletSlotNote`·`parseTupletPosition` 전체 해설 완료. rest·슬롯 상대/원문 위치·필수 @n과 MIDI 검사·analyzer 경계를 설명했다.
- 제품 원본 hash·파일 전체 주석 제외 TS 구문 동일성·해설본 typecheck/build 통과. 동작 및 입출력 계약 변경 없음.
- 노트 파서 누적 9개 함수 완료이며 파일 전체는 진행 중이다. 다음은 2B-4 `parseGliss`부터 `classifyRemainingModifierError`까지 6개 함수이다. 전체 완료 파일 수 9개 유지.


### 2026-10-16 해설 2B-2 완료

- 새 해설본 `parse_note_cell.ts`의 `parseNoteText`·`parseModifiers` 전체를 보강했다. 원문 위치·표시값·수식어 순서와 오류 전파·슬롯 @n 경계를 설명했다.
- 원본 hash·파일 전체 주석 제외 TS 구문 동일성·해설본 typecheck/build 통과. 제품 기능과 타입 계약 변경 없음.
- 노트 파서 누적 6개 함수 완료이며 파일 전체는 진행 중이다. 전체 완료 파일 수 9개 유지. 다음은 2B-3 `parsePletSlot`·`parsePletSlotNote`·`parseTupletPosition`이다.


### 2026-10-16 해설 2B-1 완료

- 새 해설본 `parse_note_cell.ts`의 모듈·상수, 공개 진입점 및 mute/pletExtend/pletHead 함수 4개를 보강했다. 판별 순서·원문 위치·슬롯 실패 전파·analyzer 경계를 설명한다.
- 원본 hash·주석 제외 TS 구문 동일성, 나머지 함수 텍스트 동일성(줄바꿈 통일), 해설본 typecheck/build 통과. 동작 변경 없음.
- 파일 전체 완료는 아니며 전체 완료 파일 수는 9개로 유지한다. 다음은 2B-2 `parseNoteText`·`parseModifiers`이다. 남은 함수군 순서는 4.2 계획에 기록했다.


### 2026-10-16 해설 2A 완료

- 새 해설본 `core/parse/types.ts`의 43개 타입 계약 전체를 보강했다. parser/analyzer 책임, 표시 위치와 발음 음정, 오류 위치, 문서 Map과 미연결 범위 파싱·캐시 선언을 구분했다.
- 1.5/1.6/1.8 명세 및 실제 parser/문서 조립/부분 산출물 소비 경로 대조. 원본 hash·주석 제외 TS 선언 동일성·해설본 typecheck/build 통과. 제품 기능·계약 변경 없음.
- 총 9개 파일 완료. 다음은 2B `core/parse/parse_note_cell.ts`의 상수·공개 진입점·mute/pletExtend/pletHead 처리이며 이후 함수군별로 진행한다.


### 2026-10-16 해설 1C 완료·1단계 종료

- 새 해설본 `core/score/build_score_indexes.ts`, `score_text_edit.ts`, `layout_preset.ts` 전체 해설을 완료했다. 1단계 8개 파일 완료이며 제품 동작은 변경하지 않았다.
- 세 파일의 원본 snapshot hash·주석 제외 TS 구문 동일성 확인, 해설본 typecheck/build 통과.
- 프리셋의 openMidi 필수 조건 및 gap 경계 중복 검사의 명세 차이는 [4.2 계획](4.2-code-commentary-plan.md)에 기록했다. 정적 검토이며 기능 수정은 하지 않았다.
- 다음은 2A `core/parse/types.ts`이다. 이후 note parser → global parser → parsed document 조립 순서이며 큰 파일은 함수군으로 나눈다.


### 2026-10-16 해설 1B-2 완료

- 새 해설본 `score_validate.ts`의 세부 검사·오류 helper 16개 함수를 보강해 앞선 2개 진입 함수와 함께 파일 전체 해설을 완료했다. 실제 검사 조건과 미검증 영역을 구분하며 제품 기능은 변경하지 않았다.
- 원본 snapshot hash·주석 제외 TS 구문 동일성 확인, 해설본 typecheck/build 통과. 단순 판별값의 반복 설명은 생략했다.
- 완료 파일은 5개이며 상세 범위·검증 한계는 [4.2 계획](4.2-code-commentary-plan.md)과 해설본 README를 따른다.
- 다음은 1C `build_score_indexes.ts` → `score_text_edit.ts` → `layout_preset.ts`이다. 아래 1B 미완료 표시는 당시 상태이다.


### 2026-10-16 해설 1B-1 완료

- 새 해설본의 `score_limits.ts`, `json_load.ts` 전체 및 `score_validate.ts`의 오류/결과 계약·상수 문맥·진입 함수·최상위 필수 필드 검사를 보강했다. 자명한 ok 판별값에는 설명을 반복하지 않았다.
- 세 파일의 원본 hash와 주석 제외 TS 구문 동일성 확인, 해설본 typecheck/build 통과. 제품 동작 변경 없음.
- 1.3 명세의 난이도·presetId 누락 검사와 실제 validator의 검사 누락은 [4.2 계획](4.2-code-commentary-plan.md)에 별도 기록했다. 이번에는 정적 확인이며 기능 수정은 하지 않았다.
- 다음은 1B-2 `validateYoutubeSyncShape`부터 마지막 `isRecord`까지이다. 검증 파일 전체 완료로 표시하지 않는다.


### 2026-10-16 단계별 해설 계획·1A 완료

- 사용자 요청으로 [4.2 단계별 해설 계획](4.2-code-commentary-plan.md)에 src TS 108개 파일을 13단계로 배정했다. 제품 구현 기준이 아닌 해설 작업 계획이다.
- 새 해설본의 `core/score/types.ts`와 `create_runtime_document.ts` 전체를 1A 단위로 보강했다. 저장/런타임 구분, 필드·유니온, 참조 공유, 로드 성공·실패 및 상태 확정 경계를 설명한다.
- 원본 manifest hash와 주석 제외 TS 구문 동일성 확인, 해설본 typecheck/build 통과. 기존 제품 node_modules를 로컬 junction으로 공유하며 제품·의존성·CREPE 실험은 변경하지 않았다.
- 다음은 1B `score_limits.ts` → `json_load.ts` → `score_validate.ts`이다. 상세 완료 범위는 해설본 README에 기록했다. 아래의 코드 주석 미착수 표시는 당시 상태다.

### 2026-10-16 구조 개선 배포 완료

- 사용자 요청으로 원본 `regression-code/`의 구조 개선을 배포 저장소 `regression-code-test-publish/`에 동기화했다. 원본 기준은 `8b14255`, 배포 커밋은 `bd5cd39` 및 설치 보완 `fe68974`이다. CREPE 실험과 해설용 복사본은 포함하지 않았다.
- 편집·이력 확정/복구, 공용 계약 분리, 중복 연산 개선, 비동기 요청 및 카운트다운 수명 보호, Practice 입력 기록 분리가 공개 버전에 반영되었다. 아래 과거 이력의 미배포 표시는 해당 시점의 상태다.
- [GitHub Pages 실행 38758129272](https://github.com/B935342LYS/spredtest/actions/runs/38758129272) 성공. [공개 페이지](https://b935342lys.github.io/spredtest/) HTTP 200, Canvas 5개, pageerror 및 실패 HTTP 응답 0개를 확인했다. 공개 JS `index-Xz1eNghB.js`는 해당 실행의 Pages artifact와 바이트 단위로 일치했다.
- 배포용 build 및 13개 test 명령 통과. `test:view`는 당시 Fit Height 기대값 불일치로 실패했다. 2026-10-20 확인: 제품 수정 후 테스트 기대값 미갱신 문제다. Chrome 비동기·카운트다운 검사는 대역을 이용해 통과했으며 실제 장치 청감 검증과 구분한다.
- 첫 CI 설치 실패 후 배포용 lock의 선택적 의존성 누락을 보완하고 `npm ci` workflow로 재배포했다. 원본 lock은 변경하지 않았으므로 원본 clean-install 문제는 별도다.
- 보고서: `docs/report-prep/implementation-records/2026-10-16-structural-improvements-deployment.md`. 근거: `docs/report-prep/deployment-2026-10-16/`. 주석 가이드와 해설용 복사본은 유지했으며 코드 주석 작성은 아직 시작하지 않았다.

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

### 현재 요약 — 2026-10-30

- **제품:** 악보 로드·검증·파싱·분석, Canvas 렌더링, Web Audio 재생, 편집/범위 선택/Undo·Redo, 레이아웃·트랙, YouTube 동기화, Practice, Examples 및 매뉴얼이 구현되어 있다. Loop 재생, Practice 난이도(easy/standard/pro), gliss/vib/trem 판정은 이미 구현된 경로다. 아래 초기 목록의 미구현 표현을 재개 목록으로 쓰지 않는다.
- **렌더링:** eventDiff 및 plan/patch 경로를 제거하고 재사용한 artifact의 완성된 renderInput을 직접 렌더한다. track/global 산출물 재사용과 viewport 가상화는 유지한다. `3.8` 부분 redraw 실험은 미채택 기록이다.
- **구조 개선:** 편집·이력 동시 확정과 출력 복구, 무변경 편집 생략, 이력 인덱스 재사용, 공용 편집·프리셋 계약 분리, Examples 권한 축소, marker 중복 생성 감소, metadata 인덱스 재사용, 비동기 요청·카운트다운 수명 보호, Practice 입력 기록 분리를 완료했다. 상세는 `3.10-code-structure-review.md`와 9절 날짜별 기록이다.
- **배포:** 2026-10-30 원본 제품 기준 `b73dda6`의 변경을 spredtest `1d8d7d4`에 반영·푸시했다. 검증 및 배포 결과는 9절의 최신 안정화 체크포인트를 따른다.
- **해설:** `4.1` 기준과 `4.2` 계획에 따라 `regression-code-report-commentary-2026-10-15/`의 108/108개 TS 파일 완료. 원본 167개 hash, 주석 제외 구문 동일성, 주석 계약, typecheck/build 통과 기록이 있다. dev 도구·테스트·HTML/CSS·매뉴얼은 해당 계획 밖이다.
- **음정 실험:** `D:/SPRED-crepe-pilot`에서 Pitchy와 CREPE tiny/small/medium/full을 비교했다. 기본음이 배음보다 빨리 감쇠하는 합성 입력에서 공통 옥타브 이탈을 확인했다. 실제 음색 변화의 원천과 제품 교체 이점은 미확정이다. detector 교체는 보류하며 전통 알고리즘·후처리·파인튜닝은 후속 검토 후보다.
- **검증 후속:** 10월 30일 원본·배포본 build 및 관련 6개 검사를 통과했다(9절 참조). test:view는 과거 기대값 미갱신 문제로 남겨 둔다. 배포용 lock/CI 보완은 원본 clean-install 문제 해결을 의미하지 않는다. 실제 장치·외부 서비스 검증은 자동/대역 검사와 구분한다.
- **다음 작업:** MIDI import 정책 협의. `3.11`의 일대일/다대일 배정 관계부터 확정하며, 활성 작업본 MIDI 구현은 미착수다. 아래 과거 대기 목록을 자동 재개하지 않는다.

### 과거 진행 기록 — 현재 작업 지시로 사용하지 않음

이하 기록의 당시 완료 여부와 다음 작업은 위 현재 요약 및 9절 최신 결정으로 대체한다.

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

Historical deferred work (당시 대기 목록; 현재 작업 목록 아님):
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

## 11. Historical Boundary Notes

초기 MVP 당시의 경계 설명이다. 아래 partially implemented/placeholder/future 표현은 현재 완료 상태를 뜻하지 않는다. 현재 경계는 active 명세와 실제 구현, 9·10절 최신 기록을 대조한다.

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
