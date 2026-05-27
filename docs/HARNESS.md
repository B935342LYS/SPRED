# Docs Harness

## 1. Purpose

Hub / index / current-state summary for this repository.

## 2. Current Paths

Active implementation root:
- `regression-code/`

Archived implementation roots:
- `0. 이세계 코드 (legacy)/`
- `1. 개발문서/`

Primary spec roots:
- `docs/1.3-score-json-format.md`
- `docs/1.5-note-cell-parser-spec.md`
- `docs/1.6-global-cell-parser-spec.md`
- `docs/1.7-analyzer-event-list-spec.md`
- `docs/1.8-parser-analyzer-pipeline-spec.md`
- `docs/1.9-mvp-analyzer-renderer-ui-spec.md`
- `docs/2.0-ui-mvp-spec.md`
- `docs/1.0-development-spec.md`

Memo roots:
- `docs/implementation-memo/`

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

`docs/1.1-project-plan.md` : `reference`
`docs/1.2-master-spec.md` : `reference`
`docs/1.4-note-string-spec.md` : `reference`
`docs/a1.0-open-source-reference-survey.md` : `appendix`
`docs/implementation-memo/` : `memo`
`regression-code/` : `active`
`0. 이세계 코드 (legacy)/` : `archive`
`1. 개발문서/` : `archive`

## 4. Current Implementation Baseline

Read in this order for implementation work:

1. `docs/1.8-parser-analyzer-pipeline-spec.md`
2. `docs/1.9-mvp-analyzer-renderer-ui-spec.md`
3. `docs/2.0-ui-mvp-spec.md`
4. `docs/1.5-note-cell-parser-spec.md`
5. `docs/1.6-global-cell-parser-spec.md`
6. `docs/1.7-analyzer-event-list-spec.md`
7. `docs/1.3-score-json-format.md`
8. `docs/1.0-development-spec.md`

Interpretation rules:

- runtime types and function signatures follow `1.8` first
- first analyzer / renderer / UI MVP implementation scope follows `1.9` first
- first UI layout, state, and event-action scope follows `2.0` first
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

`reference`
- `1.1-project-plan.md`
- `1.2-master-spec.md`
- `1.4-note-string-spec.md`

`appendix`
- `a1.0-open-source-reference-survey.md`

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
- `src/core/`
  - `common.types.ts`
  - `index.ts`
  - `score/`
  - `parse/`
  - `analyze/`

## 8. Path Use Rules

Default implementation target:
- `regression-code/`

Open on explicit review request only:
- `docs/implementation-memo/`

Reference only, not current implementation target:
- `0. 이세계 코드 (legacy)/`
- `1. 개발문서/`

If memo content is explicitly adopted by the user for implementation order or structure planning:
- use it as task-local planning guidance
- still resolve rule conflicts in favor of the active specification documents

## 9. Current Working Mode

- implementation work has started in `regression-code/`
- current work follows the first-stage roadmap in `docs/implementation-memo/1.0-roadmap.md`
- `docs/implementation-memo/` is being used for implementation notes and design commentary
- current focus is preparing the first analyzer implementation after parser assembly

## 10. Current Progress Summary

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
- `regression-code/src/core/parse/build_parsed_document.ts` now assembles single-cell parser results into `ParsedScoreDocument`
- `regression-code/dev/test_cases/minimal-valid-score.json` is the current score load fixture
- `regression-code/dev/test_score.ts` verifies the fixture through `loadRuntimeDocument()`
- `regression-code/dev/test_parse.ts` verifies fixture global cells through `parseGlobalCell()`, fixture track cells through `parseNoteCell()`, direct note modifier samples, direct pletHead samples, and `buildParsedDocument()`
- TypeScript verification has been introduced through `regression-code/tsconfig.json`, `npm run typecheck`, and `npm run test:score`
- parser verification has been introduced through `npm run test:parse`
- latest verified commands: `npm run typecheck`, `npm run test:score`, `npm run test:parse`
- current near-term focus is starting the analyzer implementation from parsed document input
- the first analyzer MVP scope is fixed to default note text and `"-"` hold only
- UI layout customization MVP now distinguishes original `instData.presetId` from user-created `layoutPresetId`
- `score_validate.ts` now rejects ScoreFiles without any of the fixed `basic`, `optional`, and `extra` tracks

Deferred planned work:
- add a minimal `Vite + TypeScript` web-app build skeleton for `regression-code/`
- define a production build path that strips or minifies comments for GitHub Pages deployment

## 11. Current Boundary Notes

- `1.4` and `1.5`
  - note-string explanation overlaps, implementation baseline is `1.5`
- `1.3` and `1.8`
  - `1.3` covers storage format, `1.8` covers runtime interfaces
- `1.7` and actual code implementation
  - analyzer type contracts now include `sourceCells`, partial analysis, and cache structures, but analyzer algorithms remain unimplemented
- `1.9` and actual MVP implementation
  - `1.9` intentionally narrows the broad analyzer/renderer/audio goals to default note text, `"-"` hold, minimum renderer, and basic audio/playback
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
