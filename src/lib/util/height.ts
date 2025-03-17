import { getTextStyle } from './style';
import { CanvasRenderContext, Word } from '../model';

/** @private */
const _getHeight = (ctx: CanvasRenderContext, text: string, style?: string) => {
  const previousTextBaseline = ctx.textBaseline;
  const previousFont = ctx.font;

  ctx.textBaseline = 'bottom';
  if (style) {
    ctx.font = style;
  }

  // NOTE: this API does NOT account for the `lineWidth` used to add the stroke
  //  effect via `strokeText()`; the stroke will bleed out of the measured box
  const { actualBoundingBoxAscent: height } = ctx.measureText(text);

  // Reset baseline
  ctx.textBaseline = previousTextBaseline;
  if (style) {
    ctx.font = previousFont;
  }

  return height;
};

/**
 * Gets the measured height of a given `Word` using its text style.
 * @returns {number} Height in pixels.
 */
export const getWordHeight = ({
  ctx,
  word,
}: {
  ctx: CanvasRenderContext;
  /**
   * Note: If the word doesn't have a `format`, current `ctx` font settings/styles are used.
   */
  word: Word;
}) => {
  return _getHeight(ctx, word.text, word.format && getTextStyle(word.format));
};

/**
 * Gets the measured height of a given `string` using a given text style.
 *
 * 🔺 This function does not measure multi-line text. It only ever measures the first
 *  line in the `text` as it uses the `CanvasRenderingContext2D.measureText()` API,
 *  which does not account for text layout.
 *
 * @returns {number} Height in pixels.
 */
export const getTextHeight = ({
  ctx,
  text,
  style,
}: {
  ctx: CanvasRenderContext;
  /**
   * Text to measure.
   *
   * 🔺 Newline characters will be ignored. The `CanvasRenderingContext2D.measureText()` API
   *  is used to measure the text, and it does not account for text layout.
   */
  text: string;
  /**
   * CSS font. Same syntax as CSS font specifier. If not specified, current `ctx` font
   *  settings/styles are used.
   */
  style?: string;
}) => {
  return _getHeight(ctx, text, style);
};
