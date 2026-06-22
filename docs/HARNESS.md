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
- `docs/2.1-canvas-renderer-module-spec.md`
- `docs/2.2-ui-state-edit-mode-spec.md`
- `docs/2.3-audio-playback-module-spec.md`
- `docs/2.4-layout-edit-ui-spec.md`
- `docs/2.5-layout-preset-format-spec.md`
- `docs/2.6-track-layer-ui-spec.md`
- `docs/3.0-extendplan-game-mode.md`
- `docs/3.1-extension-roadmap.md`
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

`docs/3.0-extendplan-game-mode.md` : `extension-plan`
- game mode expansion plan

`docs/3.1-extension-roadmap.md` : `extension-plan`
- MVP 이후 확장 후보와 우선순위 정리

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
4. `docs/2.2-ui-state-edit-mode-spec.md`
5. `docs/2.1-canvas-renderer-module-spec.md`
6. `docs/2.3-audio-playback-module-spec.md`
7. `docs/2.4-layout-edit-ui-spec.md`
8. `docs/2.5-layout-preset-format-spec.md`
9. `docs/2.6-track-layer-ui-spec.md`
10. `docs/1.5-note-cell-parser-spec.md`
11. `docs/1.6-global-cell-parser-spec.md`
12. `docs/1.7-analyzer-event-list-spec.md`
13. `docs/1.3-score-json-format.md`
14. `docs/1.0-development-spec.md`

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

Extensions:
- `docs/3.0-extendplan-game-mode.md`
- `docs/3.1-extension-roadmap.md`

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

`reference`
- `1.1-project-plan.md`
- `1.2-master-spec.md`
- `1.4-note-string-spec.md`

`appendix`
- `a1.0-open-source-reference-survey.md`

`extension-plan`
- `3.0-extendplan-game-mode.md`
- `3.1-extension-roadmap.md`

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
- current focus is layout stabilization documentation and report preparation, followed by track layer planning, audio verification, and YouTube mode planning
- Default/Long/Gliss/Trem/Pitch modifier UI input is now mostly wired for rawText creation, and Number UI input can edit global rows
- Score JSON file load is limited to 8 MiB, local score save is limited to 3 MiB, and stored cell rawText is limited to 100 characters
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
- `regression-code/dev/test_cases/minimal-valid-score.json` is the current score load fixture
- `regression-code/dev/test_score.ts` verifies the fixture through `loadRuntimeDocument()`
- `regression-code/dev/test_parse.ts` verifies fixture global cells through `parseGlobalCell()`, fixture track cells through `parseNoteCell()`, direct note modifier samples, direct pletHead samples, and `buildParsedDocument()`
- TypeScript verification has been introduced through `regression-code/tsconfig.json`, `npm run typecheck`, and `npm run test:score`
- parser verification has been introduced through `npm run test:parse`
- current near-term focus is documenting the completed layout preset stabilization pass and preparing the next track layer feature step
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
- edit-mode mutation currently performs full rebuild: `ScoreFile` mutation -> `createRuntimeDocument()` -> `buildParsedDocument()` -> `analyzeDocument()` -> canvas item builders -> `renderCanvasScore()`
- edit-mode mutation now supports note/global batch edits so drag input can update many cells before a single full rebuild
- `src/app/edit/` now separates edit logic into `edit_core.ts`, `edit_default.ts`, `edit_tuplet.ts`, and `edit_apply.ts`
- `edit_core.ts` returns apply/delete/blocked commands, `edit_default.ts` handles defaultText escaping and note rawText composition, `edit_tuplet.ts` handles tuplet draft/finalize helpers, and `edit_apply.ts` applies note/global cell upsert/delete to `ScoreFile`
- score pointer coordinate resolution currently uses the graphics UI convention name `hitTestScoreCell()` and edit-mode hit testing can use nearest-note row slop for thin note rows
- `main.ts` has been partially modularized into `app_types.ts`, `app_dom.ts`, `app_runtime.ts`, `app_ui_sync.ts`, `app_controller.ts`, `pitch_label.ts`, and `score_hit_test.ts`
- edit mode now supports Default AUTO sharp/flat, CUSTOM, comment, eraser, long hold, vibrato hold, Gliss input controls, Trem input controls, absolutePitch dropdown, and microPitch normalization
- edit mode now supports same-cell click cycle `currentText -> - -> ~ -> currentText`, left-drag install, right-drag delete, and per-cell drag loop based on existing rawText
- Number UI is always available in edit mode for global rows; `bpm` and `dynamics` accept ramp tokens while `beatsPerBar` and `stepsPerBeat` remain numeric-only
- CUSTOM defaultText input is limited to 10 characters and escapes parser reserved characters at rawText composition time
- tuplet slot input is limited to 30 characters, and composed tuplet rawText is blocked above the 100-character cell limit
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
- long tuplet slot gliss start/mid notes use `anchorSquare` display while short slots and end anchors keep normal rectangles; long slot text is left-aligned in the renderer
- renderer now displays `globalLines.cells` rawText as white text on global rows through `CanvasGlobalTextRenderItem`
- audio module first pass is implemented under `regression-code/src/audio/` with schedule building, tick/seconds mapping, event queue, lookahead scheduler, oscillator backend, and playback controller
- UI playback buttons now connect basic note events to Web Audio oscillator playback and scroll the score so the layout/score boundary acts as the playback reference line
- current audio backend supports basic note playback, vibrato detune LFO, tremolo gain gating, and gliss fallback bridge playback; dynamics automation, sampled instrument playback, and full voice-span gliss merging remain later backend extensions
- `PlaybackController` now tracks `stopped`, `playing`, and `paused` states and supports `playFromStart()`, `playFromSeconds()`, `pause()`, `resume()`, `seekToSeconds()`, and `stop()`
- seek UI is connected to score seconds and displays `mm:ss`; the former stepMs display now shows the current BPM derived from the timing timeline at the current score time
- app playback-related modules have been moved under `regression-code/src/app/playback/` to keep playback orchestration separate from general app wiring
- edit mode pointer input can preview the touched note row pitch through Web Audio, with row-level drag throttling to reduce overlapping preview artifacts
- Fit Height, Fullscreen, zoom floor handling, and edit-mode auto Fit Height are connected as score view helpers
- the edit panel uses a single-row grid layout with horizontal overflow so smaller desktop screens can keep edit controls on one line
- center player metadata now reads from `ScoreFile.musicData`, and the Details dialog can edit musicData fields except creation/update timestamps
- beat and bar marker rendering now uses timing row data, treats bar markers as stronger than beat markers at the same tick, and does not let BPM-only segment changes reset the beat/bar grid
- `docs/1.3-score-json-format.md` now records the future layout replacement policy: incompatible cells may be deleted only after explicit user confirmation, while external JSON import still fails on invalid row references
- `docs/2.4-layout-edit-ui-spec.md` defines the layout editor UI, simplified draft-bundle apply flow, deletion confirmation boundary, and reusable existing module boundaries
- `docs/2.5-layout-preset-format-spec.md` defines the Local/File layout preset JSON format and the fixed 3-slot localStorage policy per `instrumentPresetId`
- `docs/2.6-track-layer-ui-spec.md`는 첫 active track UI와 active track 대상 edit/playback, inactive track 반투명 render, `extra -> optional -> basic` draw order, 동일 track gain 정책, `src/track/track_control.ts` 공용 정책 모듈 후보를 정의한다
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
- `docs/implementation-memo/1.22-step4-basic-audio-effects.md` records vibrato, tremolo, and gliss fallback audio effect implementation decisions
- `docs/implementation-memo/1.25-step5-layout-editor-ui-shell.md` records the layout editor UI shell, current placeholder boundaries, and the next layout draft step
- `docs/implementation-memo/1.26-step5-layout-draft-apply-preset.md` records the layout draft, apply, local slot preset, file preset, and toolbar preset implementation decisions
- `docs/implementation-memo/1.27-step5-layout-storage-constraints-cleanup.md` records layout preset limits, score/localStorage limits, structural-sharing apply, playback reset, validation boundaries, cleanup, and the next work order
- `docs/implementation-memo/1.28-step6-track-layer-spec-decisions.md` records the finalized active track policy, inactive render/audio behavior, playing-state toggle rule, and `src/track/track_control.ts` module decision before implementation
- `docs/2.3-audio-playback-module-spec.md` defines the audio generator, playback controller, lookahead scheduler, and Web Audio backend structure
- latest verified commands: `npx tsc --noEmit --noUnusedLocals --noUnusedParameters`, `npm run typecheck`, `npm run test:score`, `npm run test:parse`, `npm run test:edit`, `npm run test:layout`, `npm run build`

Deferred planned work:
- verify the current edit/analyze/render path through JSON download/load round trip with saved local files
- implement active track UI, active track 대상 batch edit/playback, inactive track 반투명 render, and `src/track/track_control.ts` over the existing fixed `basic`, `optional`, and `extra` tracks
- expand manual and browser-level tests for vibrato, tremolo, gliss fallback, seek, pause/resume, and layout-change playback reset behavior
- prepare a basic audio verification checklist before YouTube mode
- connect dynamics automation and refined tuplet timing behavior to the audio generator
- evaluate whether gliss fallback needs note ducking or selective voice-span merging after listening tests
- add loop playback range selection and scheduler/controller support
- evaluate Tone.js or sampled-instrument backends after the native Web Audio event path is stable
- continue visual hit-test/edit UX tuning for tuplet containers and complex token anchors
- add undo or pending-edit grouping if direct batch edit becomes too risky for larger editing sessions
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
