/**
 * Text Analysis Utility
 *
 * Provides character-level analysis for text processing.
 * Centralizes regex patterns and counting logic to eliminate duplication.
 */

/**
 * Regular expression patterns for different character types
 */
export const TEXT_PATTERNS = {
  KOREAN: /[가-힣]/g,
  ENGLISH: /[a-zA-Z]/g,
  NUMBER: /[0-9]/g,
  SPACE: /\s/g,
};

/**
 * Analyze character composition of text
 *
 * @param {string} text - Text to analyze
 * @returns {Object} Character counts by type
 * @returns {number} return.korean - Count of Korean characters
 * @returns {number} return.english - Count of English letters
 * @returns {number} return.number - Count of numeric digits
 * @returns {number} return.space - Count of whitespace characters
 * @returns {number} return.other - Count of other characters (special chars, emoji, etc)
 * @returns {number} return.total - Total character count
 *
 * @example
 * analyzeCharacters('Hello 안녕 123');
 * // Returns: { korean: 2, english: 5, number: 3, space: 2, other: 0, total: 12 }
 */
export function analyzeCharacters(text) {
  if (!text) {
    return {
      korean: 0,
      english: 0,
      number: 0,
      space: 0,
      other: 0,
      total: 0
    };
  }

  const korean = (text.match(TEXT_PATTERNS.KOREAN) || []).length;
  const english = (text.match(TEXT_PATTERNS.ENGLISH) || []).length;
  const number = (text.match(TEXT_PATTERNS.NUMBER) || []).length;
  const space = (text.match(TEXT_PATTERNS.SPACE) || []).length;

  const known = korean + english + number + space;
  const other = text.length - known;

  return {
    korean,
    english,
    number,
    space,
    other,
    total: text.length
  };
}

/**
 * Get character matches by type
 *
 * @param {string} text - Text to analyze
 * @returns {Object} Arrays of matched characters
 *
 * @example
 * getCharacterMatches('Hello 안녕');
 * // Returns: { korean: ['안', '녕'], english: ['H','e','l','l','o'], ... }
 */
export function getCharacterMatches(text) {
  if (!text) {
    return {
      korean: [],
      english: [],
      number: [],
      space: []
    };
  }

  return {
    korean: text.match(TEXT_PATTERNS.KOREAN) || [],
    english: text.match(TEXT_PATTERNS.ENGLISH) || [],
    number: text.match(TEXT_PATTERNS.NUMBER) || [],
    space: text.match(TEXT_PATTERNS.SPACE) || []
  };
}
