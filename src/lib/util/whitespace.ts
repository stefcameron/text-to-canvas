/**
 * @private
 * List of characters considered line breaks.
 */
const _lineBreaks = [
  '\n', // LF (line feed)
  '\u2028', // LS (line separator)
  '\u2029', // PS (paragraph separator)
];

/**
 * @private
 * Regex that matches any supported {@link _lineBreaks} character.
 */
const _lineBreakRE = new RegExp(`[${_lineBreaks.join('')}]`);

/**
 * @returns List of characters considered line breaks.
 */
export const getLineBreaks = () => _lineBreaks.concat(); // shallow clone to keep it safe from manipulation

/**
 * Determines if some text includes at least one supported line break character.
 * @param text Text to test
 * @returns True if the text contains at least one supported line break character; false if not.
 */
export const hasLineBreak = (text: string) => {
  return _lineBreakRE.test(text);
};

/**
 * Determines if the __single__ character is considered a line break or not.
 * @param char Character to test.
 * @returns True if it's considered a line break; false otherwise.
 */
export const isLineBreak = (char: string) => {
  // NOTE: CR (\r) is not considered a line break in this library; these are treated
  //  as normal whitespace or outright ignored
  return char.length === 1 && hasLineBreak(char);
};

/**
 * Determines if a string is only whitespace (one or more characters of it).
 * @param text
 * @returns True if `text` is one or more characters of whitespace, only, including
 *  LF (line feed), CR (carriage return), LS (line separator), PS (paragraph separator),
 *  VT (vertical tab), FF (form feed), if any.
 */
export const isWhitespace = (text: string) => {
  return !!text.match(/^\s+$/);
};
