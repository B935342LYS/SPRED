# AGENTS.md

## Purpose

This repository contains the planning documents and implementation workspace for the web app `회귀 코드`.
The project refactors the legacy Google Sheets + Apps Script implementation `이세계 코드` into a TypeScript + HTML + CSS web application intended for GitHub Pages deployment.

This file defines the default behavior rules for AI coding agents operating in this repository.
For document navigation, baseline lists, and topic entry points, use `docs/HARNESS.md`.

## Repository Scope

The intended GitHub-facing structure is:

- `docs/`
  - selected development documents for `회귀 코드`
- `regression-code/`
  - actual implementation files
- repository root
  - `README.md`
  - `.gitignore`
  - `.gitattributes`
  - `AGENTS.md`

At the moment, some legacy source materials still live in the original local folders:

- `1. 개발문서`
- `0. 이세계 코드 (legacy)`

The preferred GitHub-facing implementation path is `regression-code/`.

For new work, prefer the GitHub-facing structure first. Only fall back to the original local folders when legacy reference is explicitly needed.

## Working and Explanation Copies

- `regression-code/` is the active working implementation.
  - Keep comments useful but not excessive.
  - Prefer function-level JSDoc and comments before complex behavior blocks.
  - Do not add line-by-line explanatory comments unless the logic is genuinely non-obvious.
- `regression-code-2026-06-19/` is an advisor-meeting explanation snapshot.
  - It may receive denser explanatory comments for human code reading.
  - Comment additions there are for explanation and review, not active product behavior.
  - Do not automatically backport explanation-only comments from this snapshot into `regression-code/`.
- When editing an explanation snapshot, preserve runtime behavior unless the user explicitly asks for a functional fix.

## Document Priority

When implementation guidance conflicts, use this priority order:

1. `docs/HARNESS.md`
2. `docs/1.8-parser-analyzer-pipeline-spec.md`
3. `docs/1.9-mvp-analyzer-renderer-ui-spec.md`
4. `docs/2.0-ui-mvp-spec.md`
5. `docs/2.2-ui-state-edit-mode-spec.md`
6. `docs/2.1-canvas-renderer-module-spec.md`
7. `docs/2.3-audio-playback-module-spec.md`
8. `docs/2.4-layout-edit-ui-spec.md`
9. `docs/2.5-layout-preset-format-spec.md`
10. `docs/2.6-track-layer-ui-spec.md`
11. `docs/2.7-youtube-sync-ui-spec.md`
12. `docs/2.8-edit-invalidation-and-partial-rebuild-spec.md`
13. `docs/2.9-range-selection-edit-spec.md`
14. `docs/2.10-undo-redo-edit-history-spec.md`
15. `docs/1.5-note-cell-parser-spec.md`
16. `docs/1.6-global-cell-parser-spec.md`
17. `docs/1.7-analyzer-event-list-spec.md`
18. `docs/1.3-score-json-format.md`
19. `docs/1.0-development-spec.md`

Background/reference documents:

- `docs/1.1-project-plan.md`
- `docs/1.2-master-spec.md`
- `docs/1.4-note-string-spec.md`
- `docs/a1.0-open-source-reference-survey.md`

Implementation memo documents:

- `docs/implementation-memo/`
  - user-authored design commentary / implementation notes
  - not part of the default implementation baseline
  - inspect only when the user explicitly asks for review or feedback on those files
  - when the user explicitly uses those memo files to propose implementation order, structure changes, or task planning, reflect that guidance in implementation planning unless it conflicts with active specifications

Deprioritized material:

- deleted transitional document formerly numbered `1.6`
- `0.x` legacy text files
- `0. 이세계 코드 (legacy)`
  - reference implementation only, not a compatibility target

## Role Split

- `docs/HARNESS.md`
  - document hub
  - implementation baseline list
  - topic entry points
  - document status classification
  - current working mode and implementation progress summary
- `docs/1.0-development-spec.md`
  - long-term development roadmap
  - stage goals and implementation direction
- `AGENTS.md`
  - agent behavior rules
  - change-scope limits
  - verification rules
  - conflict reporting rules
  - naming and language conventions

## Implementation Rules

- `회귀 코드` is a separate implementation from `이세계 코드`.
- Do not try to preserve source compatibility with the Google Sheets version unless explicitly requested.
- Prefer `TypeScript + HTML + CSS` web-app architecture decisions over legacy behavior.
- Keep parser, analyzer, renderer, and audio-generator boundaries aligned with the active documents.
- Prefer event-based downstream processing after analyzer output.

## Open Source Reference Policy

- The project should actively use open-source review as an implementation and report-writing aid, especially when a feature overlaps with existing public implementations.
- Before implementing a complex feature, consider whether relevant open-source projects, libraries, or reference implementations should be reviewed.
- Candidate reference domains are not limited to music notation. For example:
  - note/tie/gliss rendering: VexFlow, abcjs, OpenSheetMusicDisplay, MuseScore-related references
  - timeline or block connection logic: calendar, Gantt, video/audio timeline, block editor, spreadsheet merge-cell, or tilemap/autotiling projects
  - audio scheduling and synthesis: Web Audio API examples, Tone.js, MIDI libraries
  - pitch detection or game mode: pitchy, aubiojs, Meyda, or similar browser audio projects
- Distinguish clearly between:
  - direct dependency usage
  - source code copied or adapted into this project
  - algorithm or architecture idea referenced without code copying
  - comparison-only review used for report justification
- Check license compatibility before copying or adapting open-source code.
- Prefer MIT, Apache-2.0, BSD, or similarly permissive references for direct code reuse.
- Treat GPL/AGPL/LGPL or unclear-license code as comparison-only unless the user explicitly approves a compatible distribution plan.
- Do not imply that open-source code was used if it was only compared conceptually.
- When open-source review influences implementation, record the source, license if relevant, reviewed file or documentation URL, and how it affected the implementation or report.
- When no suitable open-source reference is found, state that explicitly in the implementation memo or report draft rather than forcing a weak citation.

## Change Procedure

- Before implementing a new feature or refactor, inspect the relevant active documents first.
- If a requested behavior or document interpretation remains ambiguous after checking the active documents, ask the user and wait for clarification before locking the implementation direction.
- Once the ambiguous point is clarified by the user, treat that answer as the task-local decision and then proceed with implementation.
- Before making edits, identify which boundaries are affected:
  - parser
  - analyzer
  - renderer
  - audio generator
  - storage / import / validation
- Prefer localized, narrow-scope changes over wide refactors.
- Do not perform opportunistic cleanup in unrelated modules unless explicitly requested.
- If a change crosses multiple boundaries, keep the reason for each boundary-crossing explicit.
- If the requested change can be completed without restructuring nearby code, do not expand scope.

## Current Project Decisions

- `cent_num` is a finite real number in the range `-100` to `100`.
- `cent_num` allows up to 1 fractional digit.
- cell `rawText` length limit: `200`
- `score comment` length limit: `100`
- JSON file size limit: `8MB`
- no global cell-count hard limit is imposed
- mobile target scope is view/load/play only
- mobile edit mode is out of scope for the initial version
- mult-string support is a later extension, not the first implementation target
- accompaniment playback is a later extension
- accompaniment should be split into:
  - phase 1: local/general audio synchronization
  - phase 2: YouTube integration
- game mode is a far-later extension and should be treated as the lowest-priority expansion feature
- game mode should use browser audio input and runtime pitch detection, not score JSON persistence
- first game-mode implementation should target desktop-class browsers and practical note-event judging, not mobile-wide or effect-accurate evaluation

## Layout and Import Policy

- score files store the base score layout
- user-specific layout customizations are stored separately
- user layout customization is stored per instrument preset
- zoom level and last scroll position are not persisted
- font size is user preference, not score data

For layout conflicts:

- simple visual differences such as row height or cell width can be handled at rendering level
- structural conflicts such as missing required rows, `rowId` kind mismatch, `rowId` count mismatch, or cells attached to removed `rowId`s should fail import in the first implementation
- a later reconciliation algorithm may repair such conflicts after explicit user confirmation and warning logs

## Documentation Rules

- Do not casually rewrite development documents without a clear reason.
- Prefer updating implementation files first unless the user explicitly requests documentation work.
- When changing documents, preserve the distinction between:
  - active implementation documents
  - reference/background documents
  - report/archive materials
- Treat `docs/implementation-memo/` as a separate memo/commentary area rather than as baseline specification.
- During implementation work, rely on the active specification documents first and do not read `docs/implementation-memo/` unless the user explicitly requests review of those memo files.
- If the user explicitly asks to use reviewed roadmap or design-memo content for implementation sequencing or structure decisions, treat it as task-local planning guidance while still resolving rule conflicts in favor of the active specification documents.
- If document numbering is discussed, note that current direction is to keep `1.1` and `1.2` as separate documents and keep the current `docs/` numbering.
- When adding a meaningful new implementation file or module, consider adding a corresponding `docs/implementation-memo/` document if the implementation introduces new flow, TypeScript syntax, data structures, or design decisions that will help later review and learning.
- Implementation memo documents should supplement active specs; they should not redefine storage format, parser/analyzer contracts, or project decisions that belong in active documents.
- For implementation memo filenames, follow the current numbered English kebab-case pattern such as `1.4-step1-build-score-indexes.md`.
- If open-source projects or public documentation were reviewed for an implementation, include a short source note in the relevant implementation memo or report draft.
- Open-source source notes should describe the reference, URL, license status when code reuse is possible, and whether the project used direct code, adapted code, or conceptual comparison only.

## Verification Rules

- After code changes, verify that TypeScript build or type structure remains consistent.
- If a project-level build or test command is formally defined, use it.
- If no build or test command is formally defined, do not guess arbitrary commands or tools.
- After parser or analyzer changes, re-check that output structures still match the active specs, especially:
  - `docs/1.7-analyzer-event-list-spec.md`
  - `docs/1.8-parser-analyzer-pipeline-spec.md`
  - `docs/1.9-mvp-analyzer-renderer-ui-spec.md`
  - `docs/2.0-ui-mvp-spec.md`
- If import failure conditions or structural constraints are changed, verify that error-handling behavior and document rules still match.
- If verification could not be performed, state that explicitly rather than implying success.

## GitHub Upload Guidance

Recommended first-upload include set:

- root metadata files
- selected `회귀 코드` docs
- actual implementation directory

Recommended first-upload exclude or delay set:

- local-only reference folders such as `0. 이세계 코드 (legacy)/` and `1. 개발문서/`
- `주간보고서/`
- `docx 제출용 보고서/`
- temporary extraction folders and zip files
- large local-only media assets
- `1.6` if deletion is confirmed before upload

## Agent Behavior

- Before major edits, inspect the active docs listed above.
- If a decision appears ambiguous, prefer the newest explicit project decision over older DOCX-era ideas.
- When a document still contains early-stage ideas that conflict with active docs, preserve it as historical context rather than treating it as binding.
- Surface conflicts explicitly instead of silently choosing a mixed interpretation.

## Conflict Reporting

When a document or implementation conflict is discovered, report it in this structure:

- conflicting documents or sources
- conflicting sentence, rule, or behavior
- interpretation adopted for the current task
- whether follow-up document updates are needed

If the conflict affects implementation safety, stop and surface it clearly before widening scope.

## Naming and Language Rules

- Code identifiers and type names should use English by default.
- Code comments and explanatory prose may use Korean when it improves clarity for the project owner.
- New files under `docs/` should follow the current numbering plus English kebab-case naming pattern.
- Project canonical names such as `이세계 코드` and `회귀 코드` should be preserved as-is.

## Comment Style

- TypeScript의 `export type`, 모든 함수, 주요 모듈 진입점에는 JSDoc 형태의 블록 주석을 작성한다.
- JSDoc 태그인 `@param`, `@returns`는 사용하지 않고, 가독성을 위해 일반 문자열 형식의 `- 인수 :`, `- 반환값 :`을 사용한다.
- 함수 주석에는 함수 설명, 인수, 반환값을 기록한다.
- 인수가 여러 개인 경우 `- 인수 : name : 설명` 형식으로 줄을 나누어 작성한다.
- 함수 내부 주석은 모든 줄에 달지 않고, 오류 처리, 타입 좁히기, 모듈 경계, 비직관적 분기, 주요 `for`/`if` 블록, 중요한 함수 호출 직전에 `//` 주석을 작성한다.
- 함수 내부의 핵심 동작 블록에는 `//` 주석으로 해당 블록이 수행하는 동작을 설명한다.
- 핵심 블록 주석은 `// rows에 layout의 row definition을 순회하며 각 row의 type에 따라 renderer source row로 변환한다.`처럼 실제 처리 대상, 순회/분기 조건, 저장/반환되는 값을 설명하는 방식으로 작성한다.
- 함수 내부의 `//` 주석은 coding convention의 블록 주석 기준에 맞춰 동작 해설을 우선하며, 설계 의도나 장기 판단 설명은 필요한 경우에만 짧게 덧붙인다.
- 코드 식별자와 타입명은 영어를 유지하고, 설명 주석은 한국어로 작성할 수 있다.
- 구현 메모 문서에는 코드에 사용된 주요 문법, 구현 판단, 모듈 흐름을 우선 기록한다.
- 함수별 상세 해설은 설계 문서에 길게 중복 작성하지 않고, 가능한 한 코드의 `/** ... */`와 필요한 `//` 주석에 둔다.
