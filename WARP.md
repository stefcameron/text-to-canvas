# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository: text-to-canvas — TypeScript library to render plain or rich text into textboxes on HTML Canvas with automatic line wrapping. Includes a Vue-based docs/demo app and a Node demo (Node canvas not officially supported).

Environment
- Node >= 22 and npm >= 10 (enforced via package.json engines)
- Install dependencies (include optional deps for Node demo):
  - npm install --include=optional

Common commands
- Build library (cleans and builds all bundles + types):
  - npm run build
- Build docs app (outputs to ./dist-docs):
  - npm run docs
- Run docs app locally (Vite dev server, typically at http://localhost:5173/):
  - npm start
- Lint (ESLint + type-check via tsc + formatting check):
  - npm run lint
  - Code-only lint: npm run lint:code
  - Types-only: npm run lint:types
- Format with Prettier:
  - Check: npm run fmt:check
  - Write: npm run fmt
- Tests
  - Full test pipeline: npm test (runs lint, test:unit, build)
  - Unit tests: npm run test:unit (currently a stub; no unit tests yet)
  - Node demo (manual verification; writes ./demo/node-demo-output.png):
    - npm run demo:node
    - Note: Requires optional dependency "canvas" to be installed/compiled. See README “Compilation of canvas package”.
- CI-oriented scripts:
  - npm run ci:build, npm run ci:lint, npm run ci:test

High-level architecture
- Public API (src/lib/index.ts)
  - drawText(ctx, text, config): High-level render function. Accepts a string or Word[] and a DrawTextConfig (width/height, x/y, align/vAlign, justify, inferWhitespace, base TextFormat, debug, overflow). Internally:
    - Normalizes base text formatting via getTextFormat/getTextStyle
    - Delegates layout to splitWords(...), then renders each PositionedWord
    - Applies per-word formatting overrides safely (save/restore), fillText then optional strokeText
    - Optional clipping when overflow=false; optional debug overlays (box and alignment guides)
    - Returns total render height for the laid-out text block
  - Re-exports utilities and types for non-imperative usage:
    - splitText, splitWords, textToWords, wordsToJson, specToJson
    - getTextHeight, getWordHeight
    - getTextStyle, getTextFormat
    - All public types from ./model
- Data model and types (src/lib/model.ts)
  - Core types: Text (string | Word[]), Word, TextFormat, DrawTextConfig, Split* props
  - RenderSpec and PositionedWord define layout results for rendering (lines of words with x/y/width/height, plus textAlign/textBaseline)
  - CanvasRenderContext is aliased to CanvasRenderingContext2D (kept narrow for cross-env compatibility)
- Layout and measurement pipeline (src/lib/util)
  - split.ts: Core of layout
    - textToWords(): Splits a trimmed string into Word[] preserving internal whitespace
    - splitWords():
      1. Trims leading/trailing whitespace at line edges
      2. Splits into hard lines using newline Word(s)
      3. Measures words (ctx.measureText) with format-aware caching (WordMap keyed by text+format)
         - Detects support for TextMetrics.fontBoundingBoxAscent/Descent; polyfills fallback when absent
         - For fallback, temporarily uses textBaseline='bottom' to approximate metrics in older envs/Node canvas
      4. Wraps to width with minimum one word per line, no intra-word breaking
      5. Optional justification (justify=true): inserts hair spaces (U+200A) between visible words to reach box width; measures newly inserted spacers
      6. Generates RenderSpec via _generateSpec(): computes line heights, positions words based on align/vAlign into box (x,y,width,height), returns lines + textAlign/textBaseline + total height
    - specToJson()/wordsToJson(): JSON serialization helpers that handle non-serializable TextMetrics (for Worker postMessage)
  - justify.ts: Line justification by distributing hair spaces between visible words
  - trim.ts: Trims non-visible whitespace at left/right ends without disturbing internal whitespace
  - height.ts: Independent measurement helpers (getTextHeight/getWordHeight) using getTextStyle
  - style.ts: Default text styling constants and helpers (getTextFormat, getTextStyle)
  - whitespace.ts: Utility to detect all-whitespace strings
- Docs/demo app (src/docs — Vue 3 + Element Plus)
  - index.html + index.js bootstrap a small SPA; App.vue composes layout; AppCanvas.vue:
    - Creates a Canvas 2D context, uses textToWords/drawText to render
    - Provides interactive controls (font size, stroke, alignment, justify, debug, overflow, box position/size)
    - Debounces redraws and logs render timing
  - Docs serve/build via Vite (build/vite.config.docs.mts)
- Build system
  - Vite configs in build/ produce bundles for:
    - ESM (text-to-canvas.esm.min.js) and CJS (text-to-canvas.min.js) for browsers/bundlers
    - Node-targeted builds (text-to-canvas.mjs/.cjs)
    - Docs app
  - Type declarations emitted to dist/types via tsc (build:types)
  - tsconfig.json uses "paths" to map "text-to-canvas" to src/lib/index.ts for local docs/demo without publishing
  - package.json exports map selects appropriate entry per environment and exposes types

Key notes from README/CONTRIBUTING
- Node demo: The library focuses on HTMLCanvasElement. Node is not officially supported; the demo works if the chosen canvas lib sufficiently implements the browser Canvas API. The optional "canvas" dependency may require platform-specific compilation; see README “Compilation of canvas package”.
- Worker/OffscreenCanvas support: When passing data across postMessage, use wordsToJson/specToJson because native TextMetrics is not serializable.
- Testing: There are no unit tests yet (test:unit is a placeholder). Manual verification is via the docs app (npm start) and the Node demo (npm run demo:node).

