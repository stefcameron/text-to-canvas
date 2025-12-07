import { RequiredTextFormat, TextFormat } from '../model';

export const DEFAULT_FONT_FAMILY = 'Arial';
export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_FONT_COLOR = 'black';
export const DEFAULT_STROKE_COLOR = DEFAULT_FONT_COLOR;
export const DEFAULT_STROKE_WIDTH = 0;
export const DEFAULT_STROKE_JOIN = 'round';

/**
 * Shallow-merges `TextFormat` sources into `target` while ignoring source properties that are
 *  `undefined`, but deep-merges the `underline` and `strikethrough` properties if they are objects
 *  on both.
 * @param sources `TextFormat` sources to merge. Falsy sources are ignored/skipped.
 * @returns Merged fully-spec'ed text format. Underline and strikethrough `thickness` will be
 *  `NaN` if they should be set to whatever the relative thickness should be. `offset` will be
 *  `NaN` if they should be set according to the current font.
 */
const _formatMerge = (
  ...sources: Array<TextFormat | null | undefined | false | 0 | ''>
): RequiredTextFormat => {
  const target: RequiredTextFormat = {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
    fontWeight: '400',
    fontStyle: '',
    fontVariant: '',
    fontColor: DEFAULT_FONT_COLOR,
    strokeColor: DEFAULT_STROKE_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    underline: {
      color: DEFAULT_FONT_COLOR,
      thickness: 0,
      offset: 0,
    },
    strikethrough: {
      color: DEFAULT_FONT_COLOR,
      thickness: 0,
      offset: 0,
    },
  };

  const targetSpecified = {
    underline: {
      color: false,
      offset: false,
      thickness: false,
    },
    strikethrough: {
      color: false,
      offset: false,
      thickness: false,
    },
  };

  sources.forEach((source) => {
    if (source && typeof source === 'object' && !Array.isArray(source)) {
      Object.entries(source).forEach(([sourceKey, sourceValue]) => {
        if (sourceValue !== undefined) {
          // deep-merge underline and strikethrough objects
          if (sourceKey === 'underline' || sourceKey === 'strikethrough') {
            if (typeof sourceValue === 'boolean') {
              if (sourceValue) {
                // NOTE: using empty string as TBD once we know font color
                target[sourceKey].color = '';
                // NOTE: using NaN as TBD once we know font size/family
                target[sourceKey].thickness = NaN;
                target[sourceKey].offset = NaN;

                targetSpecified[sourceKey].color = true;
                targetSpecified[sourceKey].thickness = true;
                targetSpecified[sourceKey].offset = true;
              } else {
                // explicitly set thickness to 0 since the style is disabled
                target[sourceKey].thickness = 0;
                targetSpecified[sourceKey].thickness = true;
              }
            } else if (
              sourceValue &&
              typeof sourceValue === 'object' &&
              !Array.isArray(sourceValue)
            ) {
              const underStrikeSource = sourceValue as Partial<
                RequiredTextFormat[typeof sourceKey]
              >;

              // get a list of keys that don't have `undefined` values (considering `undefined`
              //  values the equivalent of the absence of the key)
              const underStrikeSourceKeys = (
                Object.keys(
                  underStrikeSource
                ) as (keyof RequiredTextFormat['underline'])[]
              ).filter((k) => underStrikeSource[k] !== undefined);

              // apply all non-undefined values to the target
              underStrikeSourceKeys.concat().forEach((k) => {
                (target[sourceKey] as Record<string, unknown>)[k] =
                  underStrikeSource[k];
                targetSpecified[sourceKey][k] = true;
              });

              if (
                !underStrikeSourceKeys.includes('color') &&
                !targetSpecified[sourceKey].color
              ) {
                // since source specified an object (which enables underline) but did not
                //  specify a color, set it to empty string so we know we need to set it to the
                //  general font color once we're done
                target[sourceKey].color = '';
                targetSpecified[sourceKey].color = true;
              }
              if (
                !underStrikeSourceKeys.includes('thickness') &&
                !targetSpecified[sourceKey].thickness
              ) {
                // since source specified an object (which enables underline) but did not
                //  specify a thickness, set it to NaN so we know we need to set it to the
                //  relative thickness once we're done
                target[sourceKey].thickness = NaN;
                targetSpecified[sourceKey].thickness = true;
              }
              if (
                !underStrikeSourceKeys.includes('offset') &&
                !targetSpecified[sourceKey].offset
              ) {
                // since source specified an object (which enables underline) but did not
                //  specify a offset, set it to NaN so we know we need to set it to the
                //  font-specific offset once we're done
                target[sourceKey].offset = NaN;
                targetSpecified[sourceKey].offset = true;
              }
            }
            // else, `sourceValue` is not boolean and not object: ignore
          } else {
            (target as Record<string, unknown>)[sourceKey] = sourceValue;
          }
        }
      });
    }
  });

  return target;
};

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
  const underStrikeProps: Array<'underline' | 'strikethrough'> = [
    'underline',
    'strikethrough',
  ];

  const result = _formatMerge(baseFormat, format);

  // NOTE: thickness and offset are subjective to the font being used, and in empirical testing
  //  thus far, it looks like 1px thickness is good at 24px font size, and then it's directly
  //  proportionate to the font size from there; it also looks to be the same directly proportionate
  //  tweak for the offset based on 24px font size (i.e. certain fonts will require certain offsets
  //  at 24px size, and then the offset should grow/shrink from there with the same factor as the
  //  thickness)
  const fontSizeFactor = result.fontSize / 24;

  underStrikeProps.forEach((prop) => {
    if (result[prop].color === '') {
      result[prop].color = result.fontColor;
    }

    if (Number.isNaN(result[prop].thickness)) {
      result[prop].thickness = fontSizeFactor;
    }

    // ❗️ IMPORTANT: always set the offset based on 24px FONT SIZE as that is the "zero"; offset
    //  should be larger/smaller directly proportionate to the font size from that basis
    if (Number.isNaN(result[prop].offset)) {
      if (
        result.fontFamily.startsWith('Roboto') ||
        result.fontFamily.startsWith('Verdana')
      ) {
        result[prop].offset = -2;
      } else if (
        result.fontFamily === 'Inter' ||
        result.fontFamily.startsWith('Montserrat')
      ) {
        result[prop].offset = -1;
      } else if (result.fontFamily.startsWith('Comic Sans')) {
        result[prop].offset = -5;
      } else {
        result[prop].offset = 0;
      }

      result[prop].offset *= fontSizeFactor;
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
