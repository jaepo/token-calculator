import { analyzeCharacters } from './textAnalyzer.js';
import { TOKEN_COEFFICIENTS } from './tokenStrategies.js';

/**
 * Analyze language composition of text
 *
 * @param {string} text - Text to analyze
 * @returns {Object} Character counts by type
 */
export function analyzeLanguage(text) {
  const chars = analyzeCharacters(text);

  // Map to legacy property names for backward compatibility
  return {
    korean: chars.korean,
    english: chars.english,
    numbers: chars.number,  // Note: 'number' -> 'numbers' for backward compatibility
    spaces: chars.space,     // Note: 'space' -> 'spaces' for backward compatibility
    special: chars.other,    // Note: 'other' -> 'special' for backward compatibility
    total: chars.total
  };
}

/**
 * Estimate token distribution by language
 *
 * @param {Object} chars - Character counts from analyzeLanguage
 * @param {number} totalTokens - Total token count (if available)
 * @returns {Object} Estimated tokens by language type
 */
export function estimateTokensByLanguage(chars, totalTokens) {
  // If we have actual token count, calculate ratio
  if (totalTokens > 0 && chars.total > 0) {
    const ratio = totalTokens / chars.total;

    return {
      korean: Math.ceil(chars.korean * ratio),
      english: Math.ceil(chars.english * ratio),
      other: Math.ceil((chars.numbers + chars.special + chars.spaces) * ratio)
    };
  }

  // Fallback estimation using GPT coefficients (most common)
  const coeff = TOKEN_COEFFICIENTS.GPT_DETAILED;

  const koreanTokens = Math.ceil(chars.korean * coeff.korean);
  const englishTokens = Math.ceil(chars.english * coeff.english);
  const otherTokens = Math.ceil((chars.numbers + chars.special + chars.spaces) * coeff.other);

  return {
    korean: koreanTokens,
    english: englishTokens,
    other: otherTokens
  };
}
