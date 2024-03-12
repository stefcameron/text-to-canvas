import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from 'canvas';
import { drawText, textToWords } from '../lib/index';

const OUT_FILEPATH = './demo/node-demo-output.png';

function main() {
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
    // @ts-expect-error -- text-to-canvas does not formally support Node, nor `node-canvas`
    // `node-canvas` does not support the full HTMLCanvasElement API, but supports enough
    //  of it that this works :)
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
    // eslint-disable-next-line no-console
    console.warn(
      `⚠️ Encountered an error in drawText() using the 2D context obtained from node-canvas (make sure it supports the HTMLCanvasElement API): "${err instanceof Error ? err.message : (err as string)}"`
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
    // eslint-disable-next-line no-console
    console.log(
      `Total height (px) = ${height}\nDemo output in ${OUT_FILEPATH}`
    );
  }
}

main();
