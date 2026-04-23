# Docs Harness

## 1. Purpose

This document is the hub for the `docs/` directory.

As the number of documents increased, the following problems emerged.

1. It became harder to tell which document is the current implementation baseline.
2. Related topics became split across multiple files, increasing consistency-check cost.
3. Implementation work required extra time to determine which document should be read first.

Therefore this document serves as more than a table of contents.

- current implementation-baseline guidance
- topic entry points
- document status classification
- document relationships and cleanup notes

## 2. Current Implementation Baseline

For the current TypeScript implementation, the following documents should be read first.

1. `1.8-parser-analyzer-pipeline-spec.md`
2. `1.5-note-cell-parser-spec.md`
3. `1.6-global-cell-parser-spec.md`
4. `1.7-analyzer-event-list-spec.md`
5. `1.3-score-json-format.md`
6. `1.0-development-spec.md`

Interpretation rules:

- actual runtime types and function signatures follow `1.8` first
- note parser details follow `1.5` first
- global parser details follow `1.6` first
- analyzer result structures follow `1.7` first
- score storage format follows `1.3` first
- runtime boundaries between stages follow `1.8` first
- current stage and next work items follow `1.0` first

## 3. Topic Entry Points

### 3.1. Project Overview

- `1.0-development-spec.md`
- `1.1-project-plan.md`
- `1.2-master-spec.md`

### 3.2. Storage Structure

- `1.3-score-json-format.md`

### 3.3. Note String and Parser

- `1.4-note-string-spec.md`
- `1.5-note-cell-parser-spec.md`

### 3.4. Global String and Parser

- `1.6-global-cell-parser-spec.md`

### 3.5. Analyzer and Event Structures

- `1.7-analyzer-event-list-spec.md`

### 3.6. Parser-Analyzer Pipeline

- `1.8-parser-analyzer-pipeline-spec.md`

### 3.7. Appendix / Reference

- `a1.0-open-source-reference-survey.md`

## 4. Document Status

Document status is classified as follows.

- `active`
  - directly used as the current implementation baseline
- `reference`
  - background or comparison material
- `appendix`
  - appendix, survey, or supplementary reference
- `archive`
  - intentionally excluded or deprecated material not kept in `docs/`

Current classification:

### 4.1. active

- `1.0-development-spec.md`
- `1.3-score-json-format.md`
- `1.5-note-cell-parser-spec.md`
- `1.6-global-cell-parser-spec.md`
- `1.7-analyzer-event-list-spec.md`
- `1.8-parser-analyzer-pipeline-spec.md`

### 4.2. reference

- `1.1-project-plan.md`
- `1.2-master-spec.md`
- `1.4-note-string-spec.md`
- `0. 이세계 코드 (legacy)`

### 4.3. appendix

- `a1.0-open-source-reference-survey.md`

### 4.4. archive

- legacy `0.x` text documents
- deleted transitional document formerly numbered `1.6`
- report-only folders such as weekly reports and submission-only materials

## 5. Document Relationships

Core flow:

1. `1.3`
   - score storage format
2. `1.5`, `1.6`
   - note/global parser result structures
3. `1.7`
   - analyzer result structures
4. `1.8`
   - end-to-end pipeline interfaces

Supporting flow:

- `1.4` provides note-string grammar background and earlier-stage explanation.
- `1.1`, `1.2` provide higher-level planning and requirements context.
- `a1.0` preserves comparative reasoning and open-source survey notes.

## 6. Current Cleanup Principles

Even if more documents are added, keep these rules.

1. Before creating a new document, first check whether the content can be absorbed into an existing active document.
2. Keep the implementation baseline concentrated in as few active documents as practical.
3. If background explanation conflicts with implementation baseline, prefer active documents.
4. Do not promote appendix or survey documents into implementation-baseline documents without explicit reason.
5. When the implementation stage changes significantly, update both `1.0` and this harness.

## 7. Current Boundary Notes

The following overlaps or boundaries still require attention.

1. `1.4` and `1.5`
   - note-string explanation partially overlaps
   - implementation baseline is `1.5`

2. `1.3` and `1.8`
   - `1.3` covers storage format
   - `1.8` covers runtime interfaces and pipeline boundaries

3. `1.7` and actual code implementation
   - `sourceCells`, partial analysis, and cache structures are broadly defined in the document
   - the first implementation can still apply them in stages by priority

4. `1.0` and current implementation state
   - `1.0` should track actual implementation progress, not remain in design-stage wording
   - keep `1.0` synchronized when parser/analyzer implementation milestones move

## 8. Implementation Checkpoints

When looking up documents during implementation, use this order.

1. Is the current issue about parser input/output types?
   - `1.5`, `1.6`, `1.8`
2. Is the current issue about storage structure or indexes?
   - `1.3`, `1.8`
3. Is the current issue about analyzer result structures?
   - `1.7`, `1.8`
4. Is the current issue about overall priority or roadmap?
   - `1.0`

Current implementation snapshot:

- `ScoreIndexes`, `RuntimeDocument`, `ParsedScoreDocument`, `AnalysisResult` type skeletons exist in `regression-code/src/core/types/`
- `build_score_indexes.ts`, `create_runtime_document.ts`, `parse_document.ts` are implemented as first-pass full-build modules
- `parse_note_cell.ts` and `parse_global_cell.ts` now contain first-pass real parser logic aligned to `1.5` and `1.6`
- `parse_document_range.ts` still falls back to full rebuild and should not be mistaken for completed partial parse support
- analyzer files are not yet implemented; `1.7` remains the design baseline rather than current runtime behavior

## 9. Update Rules

Update this harness when one of the following happens.

1. an active document is added or removed
2. implementation priority changes
3. a new overlap or contradiction is found
4. the center of reference for implementation work shifts significantly
