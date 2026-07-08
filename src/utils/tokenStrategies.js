/**
 * Token Calculation Strategies
 *
 * Implements different tokenization strategies for various AI models.
 * Uses the Strategy Pattern to eliminate code duplication.
 */

import { analyzeCharacters } from './textAnalyzer.js';

/**
 * Token coefficients for different models
 *
 * These coefficients represent approximate tokens-per-character ratios:
 * - Korean characters are typically 1.3-1.5 tokens per character
 * - English characters are typically 0.25 tokens per character (4 chars = 1 token)
 * - Numbers and special characters are typically 0.28-0.3 tokens per character
 */
export const TOKEN_COEFFICIENTS = {
  /**
   * Detailed tokenization (GPT, DeepSeek)
   * Counts each character type separately for better accuracy
   */
  GPT_DETAILED: {
    korean: 1.5,
    english: 0.25,
    number: 0.3,
    other: 0.3
  },

  /**
   * Simple tokenization (Gemini, Claude fallback)
   * Groups non-Korean characters together
   */
  GEMINI_SIMPLE: {
    korean: 1.3,
    other: 0.28
  }
};

/**
 * Calculate tokens using detailed character analysis
 *
 * Used by: GPT-4.1, DeepSeek V4 Flash
 *
 * @param {string} text - Text to tokenize
 * @param {Object} coefficients - Token coefficients for each character type
 * @returns {number} Estimated token count
 *
 * @example
 * calculateTokensDetailed('Hello 안녕', TOKEN_COEFFICIENTS.GPT_DETAILED);
 * // Returns: ~10 tokens
 */
export function calculateTokensDetailed(text, coefficients) {
  const chars = analyzeCharacters(text);

  const koreanTokens = Math.ceil(chars.korean * coefficients.korean);
  const englishTokens = Math.ceil(chars.english * coefficients.english);
  const numberTokens = Math.ceil(chars.number * coefficients.number);
  const otherTokens = Math.ceil((chars.space + chars.other) * coefficients.other);

  return koreanTokens + englishTokens + numberTokens + otherTokens;
}

/**
 * Calculate tokens using simple character analysis
 *
 * Used by: Gemini 3.5 Flash, Gemini 3.0 Pro, Claude fallback
 *
 * @param {string} text - Text to tokenize
 * @param {Object} coefficients - Token coefficients (korean, other)
 * @returns {number} Estimated token count
 *
 * @example
 * calculateTokensSimple('Hello 안녕', TOKEN_COEFFICIENTS.GEMINI_SIMPLE);
 * // Returns: ~8 tokens
 */
export function calculateTokensSimple(text, coefficients) {
  const chars = analyzeCharacters(text);

  // Combine all non-Korean characters
  const otherChars = chars.english + chars.number + chars.space + chars.other;

  const koreanTokens = Math.ceil(chars.korean * coefficients.korean);
  const otherTokens = Math.ceil(otherChars * coefficients.other);

  return koreanTokens + otherTokens;
}

/**
 * Get appropriate tokenization strategy for a model
 *
 * @param {string} modelId - Model identifier
 * @returns {Object} Strategy function and coefficients
 *
 * @example
 * const strategy = getTokenizationStrategy('gpt-4.1');
 * const tokens = strategy.calculate(text);
 */
export function getTokenizationStrategy(modelId) {
  const detailedModels = ['gpt-4.1', 'deepseek-v4-flash'];
  const simpleModels = ['gemini-3.5-flash', 'gemini-3.0'];

  if (detailedModels.includes(modelId)) {
    return {
      calculate: (text) => calculateTokensDetailed(text, TOKEN_COEFFICIENTS.GPT_DETAILED),
      coefficients: TOKEN_COEFFICIENTS.GPT_DETAILED,
      type: 'detailed'
    };
  }

  if (simpleModels.includes(modelId)) {
    return {
      calculate: (text) => calculateTokensSimple(text, TOKEN_COEFFICIENTS.GEMINI_SIMPLE),
      coefficients: TOKEN_COEFFICIENTS.GEMINI_SIMPLE,
      type: 'simple'
    };
  }

  // Default fallback
  return {
    calculate: (text) => calculateTokensSimple(text, TOKEN_COEFFICIENTS.GEMINI_SIMPLE),
    coefficients: TOKEN_COEFFICIENTS.GEMINI_SIMPLE,
    type: 'simple'
  };
}
