# Changelog

All notable changes to this project will be documented in this file.

The format is inspired from [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## UNRELEASED

- __Breaking:__ The `RenderSpec.textBaseline` property type has changed from `CanvasTextBaseline` to `RenderTextBaseline` which is a narrowing of possible baselines used for actual rendering.
- Added new `TextFormat.underline` and `TextFormat.strikethrough` options.
    - Set to true to enable with all defaults, or specify an object with `{ color?, thickness?, offset? }` properties to have more customization.
    - By default, the thickness scales with the font size where `24px` font size yields a `1px` thick line. This simply seemed to be the best balance for the handful of fonts that were tested (Times New Roman, Arial, and Georgia). Tweak as needed for the font(s) you will use.

## v2.0.0

- **Breaking:** Updated minimum supported of Node to `>=22` and builds now target `ES2022` at minimum.

## v1.2.1

- Added warning in TypeScript/JSDoc for the exported `getTextHeight()` function about it not supporting multi-line text.

## v1.2.0

- New `strokeColor` and `strokeWidth` text formatting options to control the outline of the text ([#292](https://github.com/stefcameron/text-to-canvas/issues/292)).
  - Note that due to how the `strokeText()` and `measureText()` Canvas APIs work, the stroke is **not considered** in text placement. Setting a large width will result in the stroke "bleeding" outside the text box.

## v1.1.2

- Fixed bug where `drawText()` config `fontColor` option was not being included in the base font format used to render the text ([#64](https://github.com/stefcameron/text-to-canvas/issues/64)).

## v1.1.1

### Changed

- README updated to include the new `overflow` option in the API docs.

## v1.1.0

### Added

- New `overflow?: boolean` config parameter for `drawText()` API: True (default) to allow overflow; false to clip text to box.

## v1.0.0

- First official release 🎉
