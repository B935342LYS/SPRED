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
- `3. 이세계 코드`
- `4. 회귀 코드`

The preferred GitHub-facing implementation path is `regression-code/`.

For new work, prefer the GitHub-facing structure first. Only fall back to the original local folders when legacy reference is explicitly needed.

## Document Priority

When implementation guidance conflicts, use this priority order:

1. `docs/HARNESS.md`
2. `docs/1.8-parser-analyzer-pipeline-spec.md`
3. `docs/1.5-note-cell-parser-spec.md`
4. `docs/1.6-global-cell-parser-spec.md`
5. `docs/1.7-analyzer-event-list-spec.md`
6. `docs/1.3-score-json-format.md`
7. `docs/1.0-development-spec.md`

Background/reference documents:

- `docs/1.1-project-plan.md`
- `docs/1.2-master-spec.md`
- `docs/1.4-note-string-spec.md`
- `docs/a1.0-open-source-reference-survey.md`

Deprioritized material:

- deleted transitional document formerly numbered `1.6`
- `0.x` legacy text files
- `3. 이세계 코드`
  - reference implementation only, not a compatibility target

## Role Split

- `docs/HARNESS.md`
  - document hub
  - implementation baseline list
  - topic entry points
  - document status classification
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

## Change Procedure

- Before implementing a new feature or refactor, inspect the relevant active documents first.
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
- `cent_num` allows up to 2 fractional digits.
- cell `rawText` length limit: `100`
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
- If document numbering is discussed, note that current direction is to keep `1.1` and `1.2` as separate documents and keep the current `docs/` numbering.

## Verification Rules

- After code changes, verify that TypeScript build or type structure remains consistent.
- If a project-level build or test command is formally defined, use it.
- If no build or test command is formally defined, do not guess arbitrary commands or tools.
- After parser or analyzer changes, re-check that output structures still match the active specs, especially:
  - `docs/1.7-analyzer-event-list-spec.md`
  - `docs/1.8-parser-analyzer-pipeline-spec.md`
- If import failure conditions or structural constraints are changed, verify that error-handling behavior and document rules still match.
- If verification could not be performed, state that explicitly rather than implying success.

## GitHub Upload Guidance

Recommended first-upload include set:

- root metadata files
- selected `회귀 코드` docs
- actual implementation directory

Recommended first-upload exclude or delay set:

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
