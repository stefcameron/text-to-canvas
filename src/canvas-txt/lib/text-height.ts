import { getTextStyle } from './get-style';
import { CanvasRenderContext, Word } from './models';

interface GetWordHeightProps {
  ctx: CanvasRenderContext;
  word: Word;
}

interface GetTextHeightProps {
  ctx: CanvasRenderContext;
  text: string;

  /**
   * CSS font. Same syntax as CSS font specifier. If not specified, current `ctx` font
   *  settings/styles are used.
   */
  style?: string;
}

const getHeight = (ctx: CanvasRenderContext, text: string, style?: string) => {
  const previousTextBaseline = ctx.textBaseline;
  const previousFont = ctx.font;

  ctx.textBaseline = 'bottom';
  if (style) {
    ctx.font = style;
  }
  const { actualBoundingBoxAscent: height } = ctx.measureText(text);

  // Reset baseline
  ctx.textBaseline = previousTextBaseline;
  if (style) {
    ctx.font = previousFont;
  }

  return height;
};

export const getWordHeight = ({ ctx, word }: GetWordHeightProps) => {
  return getHeight(ctx, word.text, word.format && getTextStyle(word.format));
};

export const getTextHeight = ({ ctx, text, style }: GetTextHeightProps) => {
  return getHeight(ctx, text, style);
};
