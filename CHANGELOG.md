# Changelog

All notable changes to this project will be documented in this file.

The format is inspired from [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v1.1.1

### Changed

- README updated to include the new `overflow` option in the API docs.
- Fixed bug where `drawText()` config `fontColor` option was not being included in the base font format used to render the text ([#64](https://github.com/stefcameron/text-to-canvas/issues/64)).

## v1.1.0

### Added

- New `overflow?: boolean` config parameter for `drawText()` API: True (default) to allow overflow; false to clip text to box.

## v1.0.0

- First official release 🎉
