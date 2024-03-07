/**
 * Determines if a string is only whitespace (one or more characters of it).
 * @param text
 * @returns True if `text` is one or more characters of whitespace, only.
 */
export const isWhitespace = (text: string) => {
  return !!text.match(/^\s+$/);
};
