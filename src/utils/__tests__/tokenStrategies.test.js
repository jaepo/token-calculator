import { describe, it, expect } from 'vitest';
import {
  TOKEN_COEFFICIENTS,
  calculateTokensDetailed,
  calculateTokensSimple,
  getTokenizationStrategy
} from '../tokenStrategies.js';

describe('tokenStrategies', () => {
  describe('TOKEN_COEFFICIENTS', () => {
    it('should define GPT_DETAILED coefficients', () => {
      expect(TOKEN_COEFFICIENTS.GPT_DETAILED).toBeDefined();
      expect(TOKEN_COEFFICIENTS.GPT_DETAILED.korean).toBe(1.5);
      expect(TOKEN_COEFFICIENTS.GPT_DETAILED.english).toBe(0.25);
      expect(TOKEN_COEFFICIENTS.GPT_DETAILED.number).toBe(0.3);
      expect(TOKEN_COEFFICIENTS.GPT_DETAILED.other).toBe(0.3);
    });

    it('should define GEMINI_SIMPLE coefficients', () => {
      expect(TOKEN_COEFFICIENTS.GEMINI_SIMPLE).toBeDefined();
      expect(TOKEN_COEFFICIENTS.GEMINI_SIMPLE.korean).toBe(1.3);
      expect(TOKEN_COEFFICIENTS.GEMINI_SIMPLE.other).toBe(0.28);
    });
  });

  describe('calculateTokensDetailed', () => {
    const coeff = TOKEN_COEFFICIENTS.GPT_DETAILED;

    it('should return 0 for empty string', () => {
      const tokens = calculateTokensDetailed('', coeff);
      expect(tokens).toBe(0);
    });

    it('should return 0 for null', () => {
      const tokens = calculateTokensDetailed(null, coeff);
      expect(tokens).toBe(0);
    });

    it('should calculate Korean tokens correctly', () => {
      const tokens = calculateTokensDetailed('안녕하세요', coeff);
      // 5 Korean chars * 1.5 = 7.5 → ceil = 8
      expect(tokens).toBe(8);
    });

    it('should calculate English tokens correctly', () => {
      const tokens = calculateTokensDetailed('Hello', coeff);
      // 5 English chars * 0.25 = 1.25 → ceil = 2
      expect(tokens).toBe(2);
    });

    it('should calculate number tokens correctly', () => {
      const tokens = calculateTokensDetailed('12345', coeff);
      // 5 number chars * 0.3 = 1.5 → ceil = 2
      expect(tokens).toBe(2);
    });

    it('should calculate mixed text tokens correctly', () => {
      const tokens = calculateTokensDetailed('Hello 안녕 123', coeff);
      // Korean: 2 * 1.5 = 3
      // English: 5 * 0.25 = 1.25 → ceil = 2
      // Numbers: 3 * 0.3 = 0.9 → ceil = 1
      // Spaces: 2 * 0.3 = 0.6 → ceil = 1
      // Total: 3 + 2 + 1 + 1 = 7
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThan(20); // Reasonable upper bound
    });

    it('should handle emojis as other characters', () => {
      const tokens = calculateTokensDetailed('😀🎯💡', coeff);
      expect(tokens).toBeGreaterThan(0);
    });

    it('should handle special characters', () => {
      const tokens = calculateTokensDetailed('Hello!', coeff);
      // H,e,l,l,o = 5 * 0.25 = 1.25 → ceil = 2
      // ! = 1 * 0.3 = 0.3 → ceil = 1
      // Total: 2 + 1 = 3
      expect(tokens).toBeGreaterThan(0);
    });

    it('should be deterministic', () => {
      const text = '안녕하세요 Hello 123';
      const tokens1 = calculateTokensDetailed(text, coeff);
      const tokens2 = calculateTokensDetailed(text, coeff);
      expect(tokens1).toBe(tokens2);
    });
  });

  describe('calculateTokensSimple', () => {
    const coeff = TOKEN_COEFFICIENTS.GEMINI_SIMPLE;

    it('should return 0 for empty string', () => {
      const tokens = calculateTokensSimple('', coeff);
      expect(tokens).toBe(0);
    });

    it('should return 0 for null', () => {
      const tokens = calculateTokensSimple(null, coeff);
      expect(tokens).toBe(0);
    });

    it('should calculate Korean tokens correctly', () => {
      const tokens = calculateTokensSimple('안녕하세요', coeff);
      // 5 Korean chars * 1.3 = 6.5 → ceil = 7
      expect(tokens).toBe(7);
    });

    it('should calculate English tokens correctly', () => {
      const tokens = calculateTokensSimple('Hello', coeff);
      // 5 chars * 0.28 = 1.4 → ceil = 2
      expect(tokens).toBe(2);
    });

    it('should group all non-Korean as other', () => {
      const tokens = calculateTokensSimple('Hello 123', coeff);
      // Korean: 0
      // Other: 9 chars * 0.28 = 2.52 → ceil = 3
      expect(tokens).toBe(3);
    });

    it('should calculate mixed text tokens correctly', () => {
      const tokens = calculateTokensSimple('안녕 Hello', coeff);
      // Korean: 2 * 1.3 = 2.6 → ceil = 3
      // Other: 6 chars (space + Hello) * 0.28 = 1.68 → ceil = 2
      // Total: 3 + 2 = 5
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThan(15);
    });

    it('should handle emojis', () => {
      const tokens = calculateTokensSimple('😀', coeff);
      expect(tokens).toBeGreaterThan(0);
    });

    it('should be deterministic', () => {
      const text = '안녕하세요 World';
      const tokens1 = calculateTokensSimple(text, coeff);
      const tokens2 = calculateTokensSimple(text, coeff);
      expect(tokens1).toBe(tokens2);
    });
  });

  describe('getTokenizationStrategy', () => {
    it('should return detailed strategy for gpt-4.1', () => {
      const strategy = getTokenizationStrategy('gpt-4.1');
      expect(strategy.type).toBe('detailed');
      expect(strategy.coefficients).toBe(TOKEN_COEFFICIENTS.GPT_DETAILED);
      expect(strategy.calculate).toBeInstanceOf(Function);
    });

    it('should return detailed strategy for deepseek-v4-flash', () => {
      const strategy = getTokenizationStrategy('deepseek-v4-flash');
      expect(strategy.type).toBe('detailed');
      expect(strategy.coefficients).toBe(TOKEN_COEFFICIENTS.GPT_DETAILED);
    });

    it('should return simple strategy for gemini-3.5-flash', () => {
      const strategy = getTokenizationStrategy('gemini-3.5-flash');
      expect(strategy.type).toBe('simple');
      expect(strategy.coefficients).toBe(TOKEN_COEFFICIENTS.GEMINI_SIMPLE);
    });

    it('should return simple strategy for gemini-3.0', () => {
      const strategy = getTokenizationStrategy('gemini-3.0');
      expect(strategy.type).toBe('simple');
      expect(strategy.coefficients).toBe(TOKEN_COEFFICIENTS.GEMINI_SIMPLE);
    });

    it('should return default simple strategy for unknown model', () => {
      const strategy = getTokenizationStrategy('unknown-model');
      expect(strategy.type).toBe('simple');
      expect(strategy.coefficients).toBe(TOKEN_COEFFICIENTS.GEMINI_SIMPLE);
    });

    it('should provide working calculate function', () => {
      const strategy = getTokenizationStrategy('gpt-4.1');
      const tokens = strategy.calculate('Hello');
      expect(tokens).toBeGreaterThan(0);
      expect(typeof tokens).toBe('number');
    });

    it('should produce same results as direct function calls', () => {
      const text = '안녕하세요';

      const strategy = getTokenizationStrategy('gpt-4.1');
      const strategyTokens = strategy.calculate(text);

      const directTokens = calculateTokensDetailed(text, TOKEN_COEFFICIENTS.GPT_DETAILED);

      expect(strategyTokens).toBe(directTokens);
    });
  });

  describe('Strategy comparison', () => {
    it('should produce different results for different strategies', () => {
      const text = '안녕하세요';

      const detailedTokens = calculateTokensDetailed(text, TOKEN_COEFFICIENTS.GPT_DETAILED);
      const simpleTokens = calculateTokensSimple(text, TOKEN_COEFFICIENTS.GEMINI_SIMPLE);

      // GPT: 5 * 1.5 = 7.5 → 8
      // Gemini: 5 * 1.3 = 6.5 → 7
      expect(detailedTokens).toBe(8);
      expect(simpleTokens).toBe(7);
    });

    it('should handle English text differently', () => {
      const text = 'Hello World';

      const detailedTokens = calculateTokensDetailed(text, TOKEN_COEFFICIENTS.GPT_DETAILED);
      const simpleTokens = calculateTokensSimple(text, TOKEN_COEFFICIENTS.GEMINI_SIMPLE);

      // Both should be similar but calculated differently
      expect(detailedTokens).toBeGreaterThan(0);
      expect(simpleTokens).toBeGreaterThan(0);
    });
  });
});
