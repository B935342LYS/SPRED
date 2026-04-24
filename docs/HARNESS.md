# Docs Harness

## 1. Purpose

Hub / index / current-state summary for this repository.

## 2. Current Paths

Active implementation root:
- `regression-code/`

Archived implementation roots:
- `regression-code-legacy/`
- `0. 이세계 코드 (legacy)/`
- `1. 개발문서/`

Primary spec roots:
- `docs/1.3-score-json-format.md`
- `docs/1.5-note-cell-parser-spec.md`
- `docs/1.6-global-cell-parser-spec.md`
- `docs/1.7-analyzer-event-list-spec.md`
- `docs/1.8-parser-analyzer-pipeline-spec.md`
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

`docs/1.1-project-plan.md` : `reference`
`docs/1.2-master-spec.md` : `reference`
`docs/1.4-note-string-spec.md` : `reference`
`docs/a1.0-open-source-reference-survey.md` : `appendix`
`docs/implementation-memo/` : `memo`
`regression-code/` : `active`
`regression-code-legacy/` : `archive`
`0. 이세계 코드 (legacy)/` : `archive`
`1. 개발문서/` : `archive`

## 4. Current Implementation Baseline

Read in this order for implementation work:

1. `docs/1.8-parser-analyzer-pipeline-spec.md`
2. `docs/1.5-note-cell-parser-spec.md`
3. `docs/1.6-global-cell-parser-spec.md`
4. `docs/1.7-analyzer-event-list-spec.md`
5. `docs/1.3-score-json-format.md`
6. `docs/1.0-development-spec.md`

Interpretation rules:

- runtime types and function signatures follow `1.8` first
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
- `sheet.json`
- `styles/`
- `src/core/`
  - `common.types.ts`
  - `index.ts`
  - `score/`
  - `parse/`
  - `analyze/`

`regression-code-legacy/`
- early experimental implementation snapshot
- reference only

## 8. Path Use Rules

Default implementation target:
- `regression-code/`

Open on explicit review request only:
- `docs/implementation-memo/`

Reference only, not current implementation target:
- `regression-code-legacy/`
- `0. 이세계 코드 (legacy)/`
- `1. 개발문서/`

If memo content is explicitly adopted by the user for implementation order or structure planning:
- use it as task-local planning guidance
- still resolve rule conflicts in favor of the active specification documents

## 9. Current Working Mode

- implementation work is temporarily paused
- the user is directly reading and reviewing the current code and algorithm structure
- `docs/implementation-memo/` is being used for implementation-interpretation notes and design commentary
- the current implementation direction follows the reviewed roadmap in `docs/implementation-memo/1.0-roadmap.md`

## 10. Current Progress Summary

- active specification documents `1.3`, `1.5`, `1.6`, `1.7`, `1.8` are prepared
- the early experimental implementation was separated into `regression-code-legacy/`
- a reinitialized `regression-code/` now exists as the active implementation path
- the project is reorganizing implementation order and folder structure to match the documented pipeline more closely
- current near-term focus is the first increment roadmap and the `score -> parse` path
- analyzer, UI, renderer, and audio implementation remain later stages

Deferred planned work:
- add a minimal `Vite + TypeScript` web-app build skeleton for `regression-code/`
- define a production build path that strips or minifies comments for GitHub Pages deployment

## 11. Current Boundary Notes

- `1.4` and `1.5`
  - note-string explanation overlaps, implementation baseline is `1.5`
- `1.3` and `1.8`
  - `1.3` covers storage format, `1.8` covers runtime interfaces
- `1.7` and actual code implementation
  - `sourceCells`, partial analysis, and cache structures are still broader than current implementation
- `1.0` and current implementation state
  - `1.0` keeps long-term stage goals, current-state tracking belongs here in `HARNESS`

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
