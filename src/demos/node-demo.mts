import fs from 'node:fs';
import path from 'node:path';
import { drawText, textToWords } from '../lib/index';

/* eslint-disable no-console */

const OUT_FILEPATH = './demo/node-demo-output.png';

async function main() {
  let createCanvas;
  try {
    // @ts-expect-error -- `canvas` package is an optional dependency so may not exist, hence this dynamic import
    ({ createCanvas } = await import('canvas'));
  } catch {
    console.error(
      "ERROR: Failed to load the `canvas` module: Make sure it's installed by first running `npm install`"
    );
    process.exit(1);
  }

  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');

  const text =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin convallis eros.';
  const words = textToWords(text);
  words.forEach((word) => {
    if (word.text === 'ipsum') {
      word.format = { fontStyle: 'italic', fontColor: 'red' };
    } else if (word.text === 'consectetur') {
      word.format = { fontWeight: '700', fontColor: 'blue' };
    }
  });

  let height;
  try {
    // NOTE: text-to-canvas does not formally support Node, nor `node-canvas`, nor does
    // `node-canvas` claim to support the full `HTMLCanvasElement` API; but it supports enough
    //  of it that this should work :) -- if it fails, we'll need to find another Node-based
    //  Canvas library that has more complete support for the Web Canvas API.
    ({ height } = drawText(ctx, words, {
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      fontSize: 24,
      fontFamily: 'Times New Roman, serif',
      fontWeight: '400',
      debug: true,
    }));
  } catch (err) {
    console.warn(
      `WARNING: Encountered an error in drawText() using the 2D context obtained from node-canvas (make sure it supports the HTMLCanvasElement API): "${err instanceof Error ? err.message : (err as string)}"`
    );
  }

  // convert the canvas to a buffer in PNG format
  const buffer = canvas.toBuffer('image/png');

  fs.mkdirSync(path.dirname(OUT_FILEPATH), { recursive: true });
  if (fs.existsSync(OUT_FILEPATH)) {
    fs.unlinkSync(OUT_FILEPATH);
  }
  fs.writeFileSync(OUT_FILEPATH, buffer);

  if (height !== undefined) {
    console.log(
      `Total height (px) = ${height}\nDemo output in ${OUT_FILEPATH}`
    );
  }
}

void main();
