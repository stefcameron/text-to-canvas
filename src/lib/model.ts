// NOTE: `node-canvas` adds some custom properties/methods to its version of
//  `CanvasRenderingContext2D` and does not support the full `CanvasRenderingContext2D`
//  Web API type, so we have to be careful to support only what they have in common;
// NOTE: `OffscreenCanvasRenderingContext2D` is supported because it inherits from
//  `CanvasRenderingContext2D`
// this indirection gives us the flexibility to tweak the context type later on,
//  if necessary, without having to update types everywhere
export type CanvasRenderContext = CanvasRenderingContext2D;

/**
 * Identifies the minimum Canvas `TextMetrics` properties required by this library. This is
 *  important for serialization across the main thread to a Web Worker thread (or vice versa)
 *  as the native `TextMetrics` object fails to get serialized by `Worker.postMessage()`,
 *  causing an exception.
 */
export interface TextMetricsLike {
  readonly fontBoundingBoxAscent: number;
  readonly fontBoundingBoxDescent: number;
  readonly width: number;
}

export type CanvasTextMetrics = TextMetrics | TextMetricsLike;

// NOTE: line height is not currently supported
export interface TextFormat {
  /** Font family (CSS value). */
  fontFamily?: string;

  // TODO: rendering words at different sizes doesn't render well per baseline
  /**
   * Font size (px).
   *
   * Base text format defaults to 14px. Otherwise, defaults to base text format.
   *
   * ❗️ Rendering words at different sizes currently does not render well per text baseline.
   *  Prefer setting a common size as the base formatting for all text instead of setting
   *  a different size for a subset of Words.
   */
  fontSize?: number;

  /** Font weight (CSS value). */
  fontWeight?: string;

  /** Font style (CSS value) */
  fontStyle?: string;

  // per spec, only CSS 2.1 values are supported
  // @see https://developer.mozilla.org/en-US/docs/Web/CSS/font
  /** Font variant (CSS value). */
  fontVariant?: 'normal' | 'small-caps' | '';

  /**
   * CSS color value.
   *
   * Defaults to base text format color (black).
   */
  fontColor?: string;

  /**
   * CSS color value.
   *
   * Defaults to base text format color (black).
   */
  strokeColor?: string;

  /**
   * Stroke width in pixels. `>= 0`, can be fractional.
   *
   * Base text format defaults to 0, which means no stroke/outline. Otherwise, defaults to
   *  base text format.
   */
  strokeWidth?: number;

  /**
   * Specifies the underline text style. True will underline with all defaults. Use the
   *  object form for customization.
   */
  underline?:
    | boolean
    | {
        /**
         * CSS color value.
         *
         * Defaults to base text format color (black).
         */
        color?: string;

        /**
         * Thickness of the line in pixels. `>= 0`, can be fractional. `0` effectively means
         *  "no underline". Defaults to a number based on `fontSize` that aims to be balanced
         *  (bigger/smaller the font, thicker/thinner the underline).
         */
        thickness?: number;

        /**
         * Offset, positive (move down, away from text) or negative (move up, toward text) to tweak
         *  the exact position of the underline with respect to the text. Use this if the font
         *  you're using is not working well with the default position.
         */
        offset?: number;
      };

  /**
   * Specifies the strikethrough text style. True will strikethrough with all defaults. Use the
   *  object form for customization.
   */
  strikethrough?:
    | boolean
    | {
        /**
         * CSS color value.
         *
         * Defaults to base text format color (black).
         */
        color?: string;

        /**
         * Thickness of the line in pixels. `>= 0`, can be fractional. `0` effectively means
         *  "no strikethrough". Defaults to a number based on `fontSize` that aims to be balanced
         *  (bigger/smaller the font, thicker/thinner the strikethrough).
         */
        thickness?: number;

        /**
         * Offset, positive (move down, away from text) or negative (move up, toward text) to tweak
         *  the exact position of the strikethrough with respect to the text. Use this if the font
         *  you're using is not working well with the default position.
         */
        offset?: number;
      };
}

/**
 * @private
 * {@link TextFormat.underline} as object only.
 */
type _UnderlineObj = NonNullable<Exclude<TextFormat['underline'], boolean>>;

/**
 * @private
 * {@link TextFormat.strikethrough} as object only.
 */
type _StrikethroughObj = NonNullable<
  Exclude<TextFormat['strikethrough'], boolean>
>;

/**
 * Version of {@link TextFormat} with all properties required, and `underline` only as its
 *  full object form with all properties required.
 */
export type RequiredTextFormat = Required<
  Omit<TextFormat, 'underline' | 'strikethrough'>
> & {
  underline: Required<_UnderlineObj>;
  strikethrough: Required<_StrikethroughObj>;
};

export interface Word {
  /** The word. Can also be whitespace. */
  text: string;
  /** Optional formatting. If unspecified, base format defaults will be used. */
  format?: TextFormat;
  /**
   * Optional metrics for this Word if it has __already been measured__ on canvas.
   *
   * ❗️ This is an optimization to increase performance of subsequent splitting of words.
   *  If specified, it's assumed that the `text` and `format` __have not changed__ since
   *  the last time the word was measured. Also that other aspects of the canvas related
   *  to rendering, such as aspect ratio, that could affect measurements __have not changed__.
   *
   * If not specified, this member __will be added__ by `splitWords()` once the word is measured
   *  so that it's easy to feed the same word back into `splitWords()` at a later time if its
   *  `text` and `format` remain the same. If they change, simply set this property to `undefined`
   *  to force it to be re-measured.
   */
  metrics?: CanvasTextMetrics; // NOTE: all properties are flagged as `readonly` (good!)
}

export type PlainText = string;

export type Text = PlainText | Word[];

export interface DrawTextConfig extends TextFormat {
  /**
   * Width of box (px) at X/Y in 2D context within which text should be rendered. This will affect
   *  text wrapping, but will not necessarily constrain the text because, at minimum, one word,
   *  regardless of its width, will be rendered per line.
   */
  width: number;
  /**
   * Height of box (px) at X/Y in 2D context within which text should be rendered. While this
   *  __will not constrain how the text is rendered__, it will determine how it's positioned
   *  given the alignment specified (`align` and `vAlign`). All the text is rendered, and may
   *  be rendered above/below the box defined in part by this dimension if it's too long to
   *  fit within the specified `boxWidth`.
   */
  height: number;

  /** Absolute X coordinate (px) in 2D context where text should be rendered. Defaults to `0`. */
  x?: number;
  /** Absolute Y coordinate (px) in 2D context where text should be rendered. Defaults to `0`. */
  y?: number;

  /** Horizontal alignment. Defaults to 'center'. */
  align?: 'left' | 'center' | 'right';
  /** Vertical alignment. Defaults to 'middle'. */
  vAlign?: 'top' | 'middle' | 'bottom';
  /** True if text should be justified within the `boxWidth` to fill the hole width. */
  justify?: boolean;

  /**
   * True indicates `text` is a `Word` array that contains _mostly_ visible words and
   *  whitespace should be inferred _unless a word is whitespace (e.g. a new line or tab)_, based
   *  on the context's general text formatting style (i.e. every space will use the font style set
   *  on the context). This makes it easier to provide a `Word[]` because whitespace can be omitted
   *  if it's just spaces, and only informative whitespace is necessary (e.g. hard line breaks
   *  as Words with `text="\n"`).
   *
   * False indicates that `words` contains its own whitespace and it shouldn't be inferred.
   *
   * ❗️ Applies only if `text`, given to `drawText()`, is a `Word[]`. Ignored if it's
   *  a `string`.
   */
  inferWhitespace?: boolean;

  /** True if debug lines should be rendered behind the text. */
  debug?: boolean;

  /**
   * True (default) if the text should overflow the box's boundaries when it's either too
   *  tall or too wide to fit.
   *
   * False if the text should be clipped to the box's boundaries.
   */
  overflow?: boolean;
}

export interface BaseSplitProps {
  ctx: CanvasRenderContext;

  /** Absolute X coordinate (px) in 2D context where text should be rendered. */
  x: number;
  /** Absolute Y coordinate (px) in 2D context where text should be rendered. */
  y: number;
  /**
   * Width of box (px) at X/Y in 2D context within which text should be rendered. This will affect
   *  text wrapping, but will not necessarily constrain the text because, at minimum, one word,
   *  regardless of its width, will be rendered per line.
   */
  width: number;
  /**
   * Height of box (px) at X/Y in 2D context within which text should be rendered. While this
   *  __will not constrain how the text is rendered__, it will determine how it's positioned
   *  given the alignment specified (`align` and `vAlign`). All the text is rendered, and may
   *  be rendered above/below the box defined in part by this dimension if it's too long to
   *  fit within the specified `boxWidth`.
   */
  height: number;

  /** Horizontal alignment. Defaults to 'center'. */
  align?: 'left' | 'center' | 'right';
  /** Vertical alignment. Defaults to 'middle'. */
  vAlign?: 'top' | 'middle' | 'bottom';
  /** True if text should be justified within the `boxWidth` to fill the hole width. */
  justify?: boolean;

  /**
   * Base/default font styles. These will be used for any word that doesn't have specific
   *  formatting overrides. It's basically how "plain text" should be rendered.
   */
  format?: TextFormat;
}

// props for a public API function
export interface SplitTextProps extends BaseSplitProps {
  /**
   * Text to render. Newlines are interpreted as hard breaks. Whitespace is preserved __only
   *  within the string__ (whitespace on either end is trimmed). Text will always wrap at max
   *  width regardless of newlines.
   */
  text: PlainText;
}

// props for a public API function
export interface SplitWordsProps extends BaseSplitProps {
  /** For hard breaks, include words that are newline characters as their `text`. */
  words: Word[];

  /**
   * True (default) indicates `words` contains _mostly_ visible words and whitespace should be
   *  inferred _unless a word is whitespace (e.g. a new line or tab)_, based on the context's
   *  general text formatting style (i.e. every space will use the font style set on the context).
   *
   * False indicates that `words` contains its own whitespace and it shouldn't be inferred.
   */
  inferWhitespace?: boolean;
}

/** Hash representing a `Word` and its associated `TextFormat`. */
export type WordHash = string;

/**
 * Maps a `Word` to its measured `metrics` and the font `format` used to measure it (if the
 *  `Word` specified a format to use; undefined means the base formatting, as set on the canvas
 *  2D context, was used).
 */
export type WordMap = Map<
  WordHash,
  { metrics: CanvasTextMetrics; format?: RequiredTextFormat }
>;

/**
 * A `Word` along with its __relative__ position along the X/Y axis within the bounding box
 *  in which it is to be drawn.
 *
 * It's the caller's responsibility to render each Word onto the Canvas, as well as to calculate
 *  each Word's location in the Canvas' absolute space.
 */
export interface PositionedWord {
  /** Reference to a `Word` given to `splitWords()`. */
  readonly word: Word;

  /**
   * Full formatting used to measure/position the `word`, __if a `word.format` partial
   *  was specified.__
   *
   * ❗️ __Use this for actual rendering__ instead of the original `word.format`.
   */
  readonly format?: Readonly<RequiredTextFormat>;

  /** X position (px) relative to render box within 2D context. */
  readonly x: number;
  /** Y position (px) relative to render box within 2D context. */
  readonly y: number;
  /** Width (px) used to render text. */
  readonly width: number;
  /** Height (px) used to render text. */
  readonly height: number;

  /**
   * True if this `word` is non-visible whitespace (per a Regex `^\s+$` match) and so
   *  __could be skipped when rendering__.
   */
  readonly isWhitespace: boolean;
}

/** Supported text baselines, subset of `CanvasTextBaseline`. */
export type RenderTextBaseline = 'top' | 'bottom';

/**
 * Specifies how to render the text as a whole onto Canvas.
 */
export interface RenderSpec {
  /**
   * Words split into lines as they would be visually wrapped on canvas if rendered
   *  to their prescribed positions.
   */
  readonly lines: PositionedWord[][];

  /**
   * Baseline to use when rendering text based on alignment settings.
   *
   * ❗️ Set this on the 2D context __before__ rendering the Words in the `lines`.
   */
  readonly textBaseline: RenderTextBaseline;

  /**
   * Alignment to use when rendering text based on alignment settings.
   *
   * ❗️ Set this on the 2D context __before__ rendering the Words in the `lines`.
   */
  readonly textAlign: CanvasTextAlign;

  /**
   * Total required width (px) to render all the lines as wrapped (i.e. the original
   *  `width` used to split the words.
   */
  readonly width: number;

  /** Total required height (px) to render all lines. */
  readonly height: number;
}
