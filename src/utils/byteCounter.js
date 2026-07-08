/**
 * Count bytes in a text string
 * FIXED: Now handles abnormal inputs safely
 */
export function countBytes(text) {
  // Fix: Validate input type and handle edge cases
  if (text === null || text === undefined) {
    return 0;
  }

  // Fix: Convert non-string types to string
  if (typeof text !== 'string') {
    text = String(text);
  }

  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  return encoded.length;
}

import { getCharacterMatches } from './textAnalyzer.js';

/**
 * Get byte statistics for different character types
 * FIXED: Now handles edge cases with defensive programming
 */
export function getByteStats(text) {
  // Fix: Validate and normalize input
  if (text === null || text === undefined) {
    return {
      total: 0,
      korean: 0,
      english: 0,
      numbers: 0,
      other: 0
    };
  }

  // Fix: Convert to string if needed
  if (typeof text !== 'string') {
    text = String(text);
  }

  const totalBytes = countBytes(text);

  // Use shared character matching logic
  const matches = getCharacterMatches(text);

  const koreanBytes = countBytes(matches.korean.join(''));
  const englishBytes = countBytes(matches.english.join(''));
  const numberBytes = countBytes(matches.number.join(''));

  return {
    total: totalBytes,
    korean: koreanBytes,
    english: englishBytes,
    numbers: numberBytes,
    other: totalBytes - koreanBytes - englishBytes - numberBytes
  };
}
