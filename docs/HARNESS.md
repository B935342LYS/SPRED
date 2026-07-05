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

- `regression-code/` is the stable SPRED working root for `B935342LYS/SPRED`
- higher-risk MIDI / audio-to-score import experiments have been split into local `regression-code-extend/` and remote `B935342LYS/SPRED_extend`
- the root `.gitignore` excludes `regression-code-extend/` to prevent accidental staging through top-level `git add .`
- implementation work has started in `regression-code/`
- current work follows the first-stage roadmap in `docs/implementation-memo/1.0-roadmap.md`
- `docs/implementation-memo/` is being used for implementation notes and design commentary
- current focus has moved from additional 2nd-extension implementation to report preparation for the 2026-06-19 이후 2차 구현 work
- `docs/report-prep/` now contains mechanically extracted Codex session logs, git logs, session summaries, a daily timeline, and the first time-sequence + feature-group report outline
- implementation changes are paused unless new real-use test issues are found; near-term work should use the report-prep materials to draft the 2nd-extension report before broad refactoring
- the previous implementation focus moved from track/audio/YouTube stabilization to first user-test deployment follow-up, practice-mode stabilization, Examples / Manual support, and GitHub Pages deployment
- after the latest deployment sync, implementation work is temporarily paused for advisor meeting preparation
- meeting preparation uses `regression-code-2026-06-19/` as a readable historical snapshot because the latest version contains too many follow-up features to explain within the meeting time
- the immediate code-review focus is the 2026-06-19 renderer, audio, and UI layer structure
- current partial rebuild work has moved past note/global invalidation and canvas layer separation into partial parsed-document reuse, edited-track analyzer/render item rebuild, and drag input batching
- Default/Long/Gliss/Trem/Pitch modifier UI input is now mostly wired for rawText creation, and Number UI input can edit global rows
- Score JSON file load is limited to 8 MiB, local score save is limited to 3 MiB, and stored cell rawText is limited to 200 characters
- gliss, mute, trem/vib, tuplet analyzer/render connections, basic Web Audio playback, pause/seek state, metadata/details editing, and edit UX helpers have first-pass implementations

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
