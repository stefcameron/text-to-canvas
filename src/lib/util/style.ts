import { TextFormat } from '../model';

export const DEFAULT_FONT_FAMILY = 'Arial';
export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_FONT_COLOR = 'black';
export const DEFAULT_STROKE_COLOR = DEFAULT_FONT_COLOR;
export const DEFAULT_STROKE_WIDTH = 0;
export const DEFAULT_STROKE_JOIN = 'round';

/**
 * Generates a text format based on defaults and any provided overrides.
 * @param format Overrides to `baseFormat` and default format.
 * @param baseFormat Overrides to default format.
 * @returns Full text format (all properties specified).
 */
export const getTextFormat = (
  format?: TextFormat,
  baseFormat?: TextFormat
): Required<TextFormat> => {
  return Object.assign(
    {},
    {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize: DEFAULT_FONT_SIZE,
      fontWeight: '400',
      fontStyle: '',
      fontVariant: '',
      fontColor: DEFAULT_FONT_COLOR,
      strokeColor: DEFAULT_STROKE_COLOR,
      strokeWidth: DEFAULT_STROKE_WIDTH,
    },
    baseFormat,
    format
  );
};

/**
 * Generates a [CSS font](https://developer.mozilla.org/en-US/docs/Web/CSS/font) value.
 * @param format
 * @returns Style string to set on context's `font` property. Note this __does not include
 *  the font color__ as that is not part of the CSS font value. Color must be handled separately.
 */
export const getTextStyle = ({
  fontFamily,
  fontSize,
  fontStyle,
  fontVariant,
  fontWeight,
}: TextFormat) => {
  // per spec:
  // - font-style, font-variant and font-weight must precede font-size
  // - font-family must be the last value specified
  // @see https://developer.mozilla.org/en-US/docs/Web/CSS/font
  return `${fontStyle || ''} ${fontVariant || ''} ${
    fontWeight || ''
  } ${fontSize ?? DEFAULT_FONT_SIZE}px ${fontFamily || DEFAULT_FONT_FAMILY}`.trim();
};
