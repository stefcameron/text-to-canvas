import {
  specToJson,
  splitWords,
  splitText,
  textToWords,
  wordsToJson,
} from './util/split';
import { getTextHeight, getWordHeight } from './util/height';
import {
  getTextStyle,
  getTextFormat,
  DEFAULT_FONT_COLOR,
  DEFAULT_STROKE_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_STROKE_JOIN,
} from './util/style';
import {
  CanvasRenderContext,
  DrawTextConfig,
  PositionedWord,
  RenderTextBaseline,
  RequiredTextFormat,
  Text,
} from './model';

/**
 * @private
 * Draws an underline on the Word, if necessary.
 */
const _drawUnderline = ({
  pw,
  textBaseline,
  baseFormat,
  ctx,
}: {
  /** Word to render. */
  pw: PositionedWord;
  /** Text baseline used to render the Word. */
  textBaseline: RenderTextBaseline;
  /** Base format when the Word doesn't specify a format override. */
  baseFormat: RequiredTextFormat;
  /** 2D canvas on which to render. */
  ctx: CanvasRenderContext;
}) => {
  const lineWidth =
    pw.format?.underline.thickness ?? baseFormat.underline.thickness;
  if (lineWidth <= 0) {
    return; // no underline
  }

  ctx.save();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = pw.format?.underline.color ?? baseFormat.underline.color;

  let underlineY = pw.y;
  switch (textBaseline) {
    case 'top':
      underlineY += pw.height - (pw.word.metrics?.fontBoundingBoxDescent ?? 0);
      break;
    case 'bottom':
      underlineY -= (pw.word.metrics?.fontBoundingBoxDescent ?? 0) / 2;
      break;
    default: {
      // this will flag as an error if a new value is added to the `RenderTextBaseline`
      //  union that we aren't handling in a case above
      const never: never = textBaseline;
      return never;
    }
  }

  underlineY += pw.format?.underline.offset ?? baseFormat.underline.offset;

  ctx.beginPath();
  ctx.moveTo(pw.x, underlineY);
  ctx.lineTo(pw.x + pw.width, underlineY);
  ctx.stroke();
  ctx.restore();
};

/**
 * @private
 * Draws a strikethrough on the Word, if necessary.
 */
const _drawStrikethrough = ({
  pw,
  textBaseline,
  baseFormat,
  ctx,
}: {
  /** Word to render. */
  pw: PositionedWord;
  /** Text baseline used to render the Word. */
  textBaseline: RenderTextBaseline;
  /** Base format when the Word doesn't specify a format override. */
  baseFormat: RequiredTextFormat;
  /** 2D canvas on which to render. */
  ctx: CanvasRenderContext;
}) => {
  const lineWidth =
    pw.format?.strikethrough.thickness ?? baseFormat.strikethrough.thickness;
  if (lineWidth <= 0) {
    return; // no strikethrough
  }

  ctx.save();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle =
    pw.format?.strikethrough.color ?? baseFormat.strikethrough.color;

  let strikethroughY = pw.y;
  switch (textBaseline) {
    case 'top':
      strikethroughY += pw.height / 2;
      break;
    case 'bottom':
      strikethroughY -=
        pw.height / 2 - (pw.word.metrics?.fontBoundingBoxDescent ?? 0) / 3;
      break;
    default: {
      // this will flag as an error if a new value is added to the `RenderTextBaseline`
      //  union that we aren't handling in a case above
      const never: never = textBaseline;
      return never;
    }
  }

  strikethroughY +=
    pw.format?.strikethrough.offset ?? baseFormat.strikethrough.offset;

  ctx.beginPath();
  ctx.moveTo(pw.x, strikethroughY);
  ctx.lineTo(pw.x + pw.width, strikethroughY);
  ctx.stroke();
  ctx.restore();
};

const drawText = (
  ctx: CanvasRenderContext,
  text: Text,
  config: DrawTextConfig
) => {
  const baseFormat = getTextFormat({
    fontFamily: config.fontFamily,
    fontSize: config.fontSize,
    fontStyle: config.fontStyle,
    fontVariant: config.fontVariant,
    fontWeight: config.fontWeight,
    fontColor: config.fontColor,
    strokeColor: config.strokeColor,
    strokeWidth: config.strokeWidth,
    underline: config.underline,
    strikethrough: config.strikethrough,
  });

  const {
    width: boxWidth,
    height: boxHeight,
    x: boxX = 0,
    y: boxY = 0,
  } = config;

  const {
    lines: richLines,
    height: totalHeight,
    textBaseline,
    textAlign,
  } = splitWords({
    ctx,
    words: Array.isArray(text) ? text : textToWords(text),
    inferWhitespace: Array.isArray(text)
      ? config.inferWhitespace === undefined || config.inferWhitespace
      : undefined, // ignore since `text` is a string; we assume it already has all the whitespace it needs
    x: boxX,
    y: boxY,
    width: config.width,
    height: config.height,
    align: config.align,
    vAlign: config.vAlign,
    justify: config.justify,
    format: baseFormat,
  });

  ctx.save();
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = getTextStyle(baseFormat);
  ctx.fillStyle = baseFormat.fontColor || DEFAULT_FONT_COLOR;
  ctx.strokeStyle = baseFormat.strokeColor || DEFAULT_STROKE_COLOR;
  ctx.lineJoin = DEFAULT_STROKE_JOIN; // for now, this is not configurable; if it becomes so, would have to also add config for `miterLimit`

  // NOTE: setting `ctx.lineWidth` to a number <=0 results in the value being IGNORED (and default
  //  value of 1 used); for now, just capture what the requested base stroke width is
  const baseStrokeWidth = baseFormat.strokeWidth ?? DEFAULT_STROKE_WIDTH;

  if (config.overflow === false) {
    ctx.beginPath();
    ctx.rect(boxX, boxY, boxWidth, boxHeight);
    ctx.clip(); // part of saved context state
  }

  richLines.forEach((line) => {
    line.forEach((pw) => {
      if (!pw.isWhitespace) {
        // NOTE: don't use the `pw.word.format` as this could be incomplete; use `pw.format`
        //  if it exists as this will always be the __full__ TextFormat used to measure the
        //  Word, and so should be what is used to render it
        if (pw.format) {
          ctx.save();
          ctx.font = getTextStyle(pw.format);
          if (pw.format.fontColor) {
            ctx.fillStyle = pw.format.fontColor;
          }
          if (pw.format.strokeColor) {
            ctx.strokeStyle = pw.format.strokeColor;
          }
        }

        ctx.fillText(pw.word.text, pw.x, pw.y);

        // stroke AFTER fill so it goes on top
        const lineWidth =
          typeof pw.format?.strokeWidth === 'number'
            ? pw.format.strokeWidth
            : baseStrokeWidth;
        if (lineWidth > 0) {
          ctx.lineWidth = lineWidth;
          ctx.strokeText(pw.word.text, pw.x, pw.y);
        }

        if (pw.format) {
          ctx.restore();
        }
      }

      _drawUnderline({ pw, textBaseline, baseFormat, ctx });
      _drawStrikethrough({ pw, textBaseline, baseFormat, ctx });
    });
  });

  if (config.debug) {
    const xEnd = boxX + boxWidth;
    const yEnd = boxY + boxHeight;

    let textAnchor: number;
    if (config.align === 'right') {
      textAnchor = xEnd;
    } else if (config.align === 'left') {
      textAnchor = boxX;
    } else {
      textAnchor = boxX + boxWidth / 2;
    }

    let debugY = boxY;
    if (config.vAlign === 'bottom') {
      debugY = yEnd;
    } else if (config.vAlign === 'middle') {
      debugY = boxY + boxHeight / 2;
    }

    const debugColor = '#0C8CE9';

    // Text box
    ctx.lineWidth = 1;
    ctx.strokeStyle = debugColor;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.lineWidth = 1;

    if (!config.align || config.align === 'center') {
      // Horizontal Center
      ctx.strokeStyle = debugColor;
      ctx.beginPath();
      ctx.moveTo(textAnchor, boxY);
      ctx.lineTo(textAnchor, yEnd);
      ctx.stroke();
    }

    if (!config.vAlign || config.vAlign === 'middle') {
      // Vertical Center
      ctx.strokeStyle = debugColor;
      ctx.beginPath();
      ctx.moveTo(boxX, debugY);
      ctx.lineTo(xEnd, debugY);
      ctx.stroke();
    }
  }

  ctx.restore();

  return { height: totalHeight };
};

export {
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
};
export * from './model';
