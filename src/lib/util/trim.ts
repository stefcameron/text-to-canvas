import { isWhitespace } from './whitespace';
import { Word } from '../model';

/**
 * Trims whitespace from the beginning and end of a `line`.
 * @param line
 * @param side Which side to trim.
 * @returns An object containing trimmed characters, and the new trimmed line.
 */
export const trimLine = (
  line: Word[],
  side: 'left' | 'right' | 'both' = 'both'
): {
  /**
   * New array containing what was trimmed from the left (empty if none).
   */
  trimmedLeft: Word[];
  /**
   * New array containing what was trimmed from the right (empty if none).
   */
  trimmedRight: Word[];
  /**
   * New array representing the trimmed line, even if nothing gets trimmed. Empty array if
   *  all whitespace.
   */
  trimmedLine: Word[];
} => {
  let leftTrim = 0;
  if (side === 'left' || side === 'both') {
    for (; leftTrim < line.length; leftTrim++) {
      if (!isWhitespace(line[leftTrim].text)) {
        break;
      }
    }

    if (leftTrim >= line.length) {
      // all whitespace
      return {
        trimmedLeft: line.concat(),
        trimmedRight: [],
        trimmedLine: [],
      };
    }
  }

  let rightTrim = line.length;
  if (side === 'right' || side === 'both') {
    rightTrim--;
    for (; rightTrim >= 0; rightTrim--) {
      if (!isWhitespace(line[rightTrim].text)) {
        break;
      }
    }
    rightTrim++; // back up one since we started one down for 0-based indexes

    if (rightTrim <= 0) {
      // all whitespace
      return {
        trimmedLeft: [],
        trimmedRight: line.concat(),
        trimmedLine: [],
      };
    }
  }

  return {
    trimmedLeft: line.slice(0, leftTrim),
    trimmedRight: line.slice(rightTrim),
    trimmedLine: line.slice(leftTrim, rightTrim),
  };
};
