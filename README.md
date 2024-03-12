[![CI](https://github.com/stefcameron/text-to-canvas/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/stefcameron/text-to-canvas/actions/workflows/ci.yml) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

# text-to-canvas

Render multiline plain or rich text into textboxes on HTML Canvas with automatic line wrapping.

## Origins and Differences

🙌 This library would not exist were it not for all the work done by its original author, [Geon George](https://geongeorge.com/), in his [canvas-txt](https://github.com/geongeorge/Canvas-Txt) library.

The main feature that sparked `text-to-canvas` is a significant update to (departure from) the original code base in order to support rich text formatting, which introduced the concept of a `Word` specifying both `text` and (optional) associated CSS-based `format` styles. A sentence is then simply a `Word[]` with/out whitespace (optionally inferred).

Plain text (i.e. a `string`) is still supported as a convenience via the `drawText()`, `splitText()`, and `textToWords()` [APIs](#api).

The main differences (at `v1.0.0`) between `canvas-txt` and this library are:

- Formal support for Node by `canvas-txt` vs this library's support solely focused on the [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement).
- This library's concerted effort to [support](#web-worker-and-offscreencanvas) [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and use of an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas), neither of which is formally supported by `canvas-txt`.

The feature gap may widen with future releases of both libraries.

While there is a [Node](#node) [demo](./src/demos/node-demo.mts), it only works because the `node-canvas` library being used supports enough of the `HTMLCanvasElement`'s API, not because this library formally supports Node, or `node-canvas`.

## Features

- ✅ Rich text formatting (with the exception of words with different font _sizes_ not yet working well in terms of text baseline alignment)
- ✅ Multiline text
- ✅ Auto line breaks
- ✅ Horizontal alignment
- ✅ Vertical alignment
- ✅ Justification
- ✅ Optimized performance with support for Web Workers and `OffscreenCanvas`

## Demo

See demo [here](https://stefcameron.github.io/text-to-canvas/).

# Installation

```bash
$ npm install text-to-canvas
# OR
$ yarn add text-to-canvas
```

> 💡 If this fails with a `node-pre-gyp` compilation error, please see [Compilation of the canvas package](#compilation-of-canvas-package) for help.

## Compilation of canvas package

This project __optionally__ depends on the [canvas](https://github.com/Automattic/node-canvas) package which enables it to be used in a Node [demo](#node).

Since this package needs to be compiled for use on the platform on which you intend to install/use it, the author must either include pre-built binaries specific to your OS when they make a [release](https://github.com/Automattic/node-canvas/releases), or a new binary must be compiled by your package manager (i.e. `npm`) upon installation.

If you're installing on a newer Apple M1, M2, or M3 computer, or if you're using a version of Node newer than v20 (the latest LTS at time of writing), you may experience a `node-pre-gyp` failure because `canvas` doesn't provide pre-built binaries for the ARM64 architecture, only providing x86-64 (Intel x64) binaries for Node v20.

> ❗️ __Before installing text-to-canvas__, refer to the `canvas` [compilation](https://github.com/Automattic/node-canvas?tab=readme-ov-file#compiling) page for your OS/architecture, especially if you aren't on an Apple computer.

For Apple M computers (ARM64), this worked for me using [HomeBrew](https://brew.sh/) and [pyenv](https://github.com/pyenv/pyenv) to install additional compiler dependencies:

```bash
$ brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
$ pyenv install 3.12.1  # install Python 3.12 on which `cairo` depends
$ pyenv local 3.12.1
$ npm install  # should succeed
```

# Usage

Use with a bundler (Webpack, Rollup, Vite, etc) or directly in a browser is supported.

Use in Node is only supported to the extent that appropriate bundles are provided. Make sure you use a Node-base Canvas library that supports the [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) API.

## Bundler

Two bundles are provided for this type of target:

- `./dist/text-to-canvas.esm.min.js` (ESM)
- `./dist/text-to-canvas.min.js` (CJS)

Used implicitly when using the library in a larger app bundled with a bundler like Webpack, Rollup, or Vite.

Declare a Canvas in your DOM (directly, via JSX, or other):

```html
<canvas id="my-canvas" width="500" height="500"></canvas>
```

Call the `drawText()` [API](#api):

```javascript
import { drawText, Word } from 'text-to-canvas';

const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, 500, 500);

// plain text
const text = 'Lorem ipsum dolor sit amet';
// OR with some formatting
const text: Word[] = [
  { text: 'Lorem' },
  { text: 'ipsum', format: { fontWeight: 'bold', color: 'red' } },
  { text: 'dolor', format: { fontStyle: 'italic' } },
  { text: 'sit' },
  { text: 'amet' },
];

drawText(ctx, text, {
  x: 100,
  y: 200,
  width: 200,
  height: 200,
  fontSize: 24,
});
```

If you need to know the total render height, `drawText()` returns it:

```javascript
const { height } = drawText(...);
```

> ⚠️ The library doesn't yet fully support varying font sizes, so you'll get best results by keeping the size consistent (via the [base font size](#drawtext-config)) and changing other formatting options on a per-`Word` basis.

## Browser

One bundle is provided for this type of target:

- `./dist/text-to-canvas.umd.min.js` (UMD)

Used implicitly when loading the library directly in a browser:

```html
<body>
  <canvas id="my-canvas" width="500" height="500"></canvas>
  <script src="//unpkg.com/text-to-canvas"></script>
  <script>
    const { drawText, getTextHeight, splitText } = window.textToCanvas;
    /// ...remainder is the same
  </script>
</body>
```

## Node

Two bundles are provided for this type of target:

- `./dist/text-to-canvas.mjs` (ESM/MJS)
- `./dist/text-to-canvas.cjs` (CJS)

> ⚠️ Other than the bundles, __Node is not formally supported by this library__, and neither is the `node-canvas` library used in the demo. Whatever "Node Canvas" library you use, make sure it supports the [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) API and it _should_ work.

Used implicitly when importing or requiring the library in your Node scripts:

```javascript
import { drawText } from 'text-to-canvas'; // MJS
// OR
const { drawText } = require('text-to-canvas'); // CJS
```

See Node demo in [./src/demo/node-demo.ts](https://github.com/stefcameron/text-to-canvas/blob/master/src/demos/node-demo.mts) for an example.

You can run this demo locally with `npm run node:demo`

# API

## drawText config

![](./src/docs/canvas.jpg)

|  Properties       |   Default    | Description                                                   |
| :---------------: | :----------: | :-----------------------------------------------------------: |
| `width`           | **Required** | Width of the text box.                                        |
| `height`          | **Required** | Height of the text box.                                       |
| `x`               | `0`          | X position of the text box.                                   |
| `y`               | `0`          | Y position of the text box.                                   |
| `align`           | `center`     | Text align. Other possible values: `left`, `right`.           |
| `vAlign`          | `middle`     | Text vertical align. Other possible values: `top`, `bottom`.  |
| `font`            | `Arial`      | Base font family of the text.                                 |
| `fontSize`        | `14`         | Base font size of the text in px.                             |
| `fontStyle`       | `''`         | Base font style, same as css font-style. Examples: `italic`, `oblique 40deg`. |
| `fontVariant`     | `''`         | Base font variant, same as css font-variant. Examples: `small-caps`. |
| `fontWeight`      | `'400'`      | Base font weight, same as css font-weight. Examples: `bold`, `100`. |
| `fontColor`       | `'black'`    | Base font color, same as css color. Examples: `blue`, `#00ff00`. |
| `justify`         | `false`      | Justify text if `true`, it will insert spaces between words when necessary. |
| `inferWhitespace` | `true`       | If whitespace in the text should be inferred. Only applies if the text given to `drawText()` is a `Word[]`. If the text is a `string`, this config setting is ignored. |
| `debug`           | `false`      | Draws the border and alignment lines of the text box for debugging purposes. |

## Functions

```js
import {
  drawText,
  specToJson,
  splitText,
  splitWords,
  textToWords,
  wordsToJson,
  getTextHeight,
  getWordHeight,
  getTextStyle,
  getTextFormat,
} from 'text-to-canvas'
```

> ⚠️ Varying font sizes on a `Word` level (as given to `drawText()` or `splitWords()`) is not supported very well at this time. For best results, keep the font size consistent by relying on a single base font size as specified in the `drawText()` [config options](#drawtext-config).

- `drawText()`: Draws text (`string` or `Word[]`) to a given Canvas.
- `specToJson()`: Converts a `RenderSpec` to a JSON string. Useful for sending it as a message through `Worker.postMessage()`.
- `splitText()`: Splits a given `string` into wrapped lines.
    - This is just a convenience over `splitWords()` if you aren't needing rich text. It's only real value is that it will return the input text as an array of strings according to how the text would be wrapped on Canvas.
- `splitWords()`: Splits a given `Word[]` into wrapped lines.
- `textToWords()`: Converts a `string` into a `Word[]`. Useful if you want to then apply rich formatting to certain words.
- `wordsToJson()`: Converts a `Word[]` to a JSON string. Useful for sending it as a message to a Worker thread via `Worker.postMessage()`.
- `getTextHeight()`: Gets the measured height of a given `string` using a given text style.
- `getWordHeight()`: Gets the measured height of a given `Word` using its text style.
- `getTextStyle()`: Generates a CSS Font `string` from a given `TextFormat` for use with `canvas.getContext('2d').font`
- `getTextFormat()`: Generates a "full" `TextFormat` object (all properties specified) given one with only partial properties using prescribed defaults.

TypeScript integration should provide helpful JSDocs for every function and each of its parameters to further help with their use.

# Examples

## Web Worker and OffscreenCanvas

If you want to draw the text yourself, or even offload the work of splitting the words to a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) using an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas), you can use the `splitWords()` [API](#api) directly.

> This requires using `wordsToJson()` and `specToJson()` APIs to ensure all required information is properly transferred between the UI/main thread and the worker thread, particularly concerning the cached [TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics).

<details>
<summary>Sample code</summary>
<br/>

Add a Canvas to your DOM:

```html
<canvas id="my-canvas" width="500" height="500"></canvas>
```

Define a Web Worker, `worker.js`:

```javascript
import { splitWords, specToJson } from 'text-to-canvas';

const wrapLines = ({ containerWidth, wordsStr, baseFormat }) => {
  // NOTE: height doesn't really matter (aside from being >0) as text won't be
  //  constrained by it; just affects alignment, especially if you're wanting to
  //  do bottom/middle vertical alignment; for top/left-aligned, height for
  //  splitting is basically inconsequential
  const canvas = new OffscreenCanvas(containerWidth, 100);
  const context = canvas.getContext('2d');

  const words = JSON.parse(wordsStr);
  const spec = splitWords({
    ctx: context,
    words,
    x: 0,
    y: 0,
    width: containerWidth,
    align: 'left',
    vAlign: 'top',
    format: baseFormat,
    // doesn't really matter (aside from being >0) as long as you only want
    //  top/left alignment
    height: 100,
  });

  self.postMessage({
    type: 'renderSpec',
    specStr: specToJson(spec), // because of `TextMetrics` objects that fail serialization
  });
};

self.onmessage = (event) => {
  if (event.data.type === 'split') {
    wrapLines(event.data);
  }
};

export {}; // make bundler consider this an ES Module
```

Use the Worker thread to offload the work of measuring and splitting the words:

```typescript
import { Word, RenderSpec, TextFormat, wordsToJson, getTextStyle } from 'text-to-canvas';

const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

const drawWords = (baseFormat: TextFormat, spec: RenderSpec) => {
  const {
    lines,
    height: totalHeight,
    textBaseline,
    textAlign,
  } = spec;

  ctx.save();
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = getTextStyle(baseFormat);
  ctx.fillStyle = baseFormat.fontColor;

  lines.forEach((line) => {
    line.forEach((pw) => {
      if (!pw.isWhitespace) {
        if (pw.format) {
          ctx.save();
          ctx.font = getTextStyle(pw.format);
          if (pw.format.fontColor) {
            ctx.fillStyle = pw.format.fontColor;
          }
        }
        ctx.fillText(pw.word.text, pw.x, pw.y);
        if (pw.format) {
          ctx.restore();
        }
      }
    });
  });
};

const words: Word[] = [
  { text: 'Lorem' },
  { text: 'ipsum', format: { fontWeight: 'bold', color: 'red' } },
  { text: 'dolor', format: { fontStyle: 'italic' } },
  { text: 'sit' },
  { text: 'amet' },
];

const baseFormat: TextFormat = {
  fontSize: 12,
  fontFamily: 'Times New Roman',
  fontColor: 'black',
};

// create a worker thread
const worker = new Worker('./worker.js', { type: 'module' });

// queue the worker to split and measure the words as necessary for the
//  specified width given base and any word-specific formatting
worker.postMessage({
  type: 'split',
  containerWidth: 500,
  wordsStr: wordsToJson(words),
  baseFormat,
});

// listen for the "done" signal from the worker
worker.onmessage = (event) => {
  if (event.data?.type === 'renderSpec') {
    worker.terminate();
    const spec: RenderSpec = JSON.parse(event.data.specStr);

    // render the spec (containing the `PositionedWord[]` with all the necessary
    //  information)
    drawWords(baseFormat, spec);
  }
};
```

</details>
