import { RequiredTextFormat, TextFormat } from '../model';

export const DEFAULT_FONT_FAMILY = 'Arial';
export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_FONT_COLOR = 'black';
export const DEFAULT_STROKE_COLOR = DEFAULT_FONT_COLOR;
export const DEFAULT_STROKE_WIDTH = 0;
export const DEFAULT_STROKE_JOIN = 'round';
export const DEFAULT_UNDERLINE_COLOR = DEFAULT_FONT_COLOR;
export const DEFAULT_UNDERLINE_OFFSET = 0;
export const DEFAULT_STRIKETHROUGH_COLOR = DEFAULT_FONT_COLOR;
export const DEFAULT_STRIKETHROUGH_OFFSET = 0;

/**
 * Generates a text format based on defaults and any provided overrides.
 * @param format Overrides to `baseFormat` and default format.
 * @param baseFormat Overrides to default format.
 * @returns Full text format (all properties specified).
 */
export const getTextFormat = (
  format?: TextFormat,
  baseFormat?: TextFormat
): RequiredTextFormat => {
  const defaultFormat = {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
    fontWeight: '400',
    fontStyle: '',
    fontVariant: '',
    fontColor: DEFAULT_FONT_COLOR,
    strokeColor: DEFAULT_STROKE_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    underline: {
      color: DEFAULT_UNDERLINE_COLOR,
      thickness: 0,
      offset: DEFAULT_UNDERLINE_OFFSET,
    },
    strikethrough: {
      color: DEFAULT_STRIKETHROUGH_COLOR,
      thickness: 0,
      offset: DEFAULT_STRIKETHROUGH_OFFSET,
    },
  };

  const result = Object.assign({}, defaultFormat, baseFormat, format);

  // NOTE: relative thickness is very likely subjective to the font being used,
  //  (i.e. some thinner fonts may find 1px thinkness at 24px font size still
  //  too thick) but for now, short of testing and mapping thousands of fonts,
  //  we get a 1px thickness at 24px font size and thinner/thicker otherwise
  const relativeThickness = result.fontSize / 24;

  const props: Array<'underline' | 'strikethrough'> = [
    'underline',
    'strikethrough',
  ];
  props.forEach((prop) => {
    const baseProp =
      typeof baseFormat?.[prop] === 'object' ? baseFormat[prop] : {};

    if (format?.[prop] === true) {
      // result[prop] will be true as well
      result[prop] = {
        ...defaultFormat[prop],
        ...baseProp,
        thickness: relativeThickness,
      };
    } else if (
      format?.[prop] === false ||
      format?.[prop] === undefined ||
      // check for case where `format[prop]` is explicitly set to `undefined`,
      //  which would have overwrite the default in `result` coming from `defaultFormat`
      //  per rules of `Object.assign()`
      result[prop] === undefined
    ) {
      result[prop] = {
        ...defaultFormat[prop],
        ...baseProp,
        thickness: 0,
      };
    } else {
      // we have to have an object now for `result.underline` but it may be incomplete
      //  if it came from `format.underline` which doesn't have to specify all properties
      //  or could have set some of them explicitly to `undefined`
      // NOTE: make sure underline/strikethrough property is a NEW object cloned from the
      //  source one so that we don't inadvertently modify the source
      result[prop] = {
        ...(result[prop] || {}),
      } as RequiredTextFormat[typeof prop];
      if (result[prop].color === undefined) {
        result[prop].color =
          prop === 'underline'
            ? DEFAULT_UNDERLINE_COLOR
            : DEFAULT_STRIKETHROUGH_COLOR;
      }
      if (result[prop].offset === undefined) {
        result[prop].offset =
          prop === 'underline'
            ? DEFAULT_UNDERLINE_OFFSET
            : DEFAULT_STRIKETHROUGH_OFFSET;
      }
      if (result[prop].thickness === undefined) {
        result[prop].thickness = relativeThickness;
      }
    }
  });

  return result;
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
