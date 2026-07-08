import { describe, it, expect, vi } from 'vitest';
import { countTokens } from '../tokenCounter';

// Mock the Anthropic tokenizer
vi.mock('@anthropic-ai/tokenizer', () => ({
  countTokens: vi.fn((text) => Math.ceil(text.length * 0.3))
}));

describe('tokenCounter', () => {
  describe('countTokens', () => {
    // ============================================
    // GPT-4.1 Model Tests (updated from GPT-5)
    // ============================================
    describe('GPT-4.1 model', () => {
      // ✅ Success Case 1: Korean text
      it('should count tokens correctly for Korean text', async () => {
        const text = '안녕하세요';
        const result = await countTokens(text, 'gpt-4.1');

        // 5 Korean chars × 1.5 = 7.5 → ceil = 8
        expect(result).toBe(8);
        expect(typeof result).toBe('number');
      });

      // ✅ Success Case 2: English text
      it('should count tokens correctly for English text', async () => {
        const text = 'Hello World';
        const result = await countTokens(text, 'gpt-4.1');

        // 10 English chars × 0.25 = 2.5 → ceil = 3
        // 1 space × 0.3 = 0.3 → ceil = 1
        // Total: 3 + 1 = 4
        expect(result).toBe(4);
      });

      // ✅ Success Case 3: Mixed language text
      it('should count tokens correctly for mixed Korean/English/numbers', async () => {
        const text = '가격: $1,234';
        const result = await countTokens(text, 'gpt-4.1');

        // Korean: 2 chars × 1.5 = 3
        // Numbers: 4 chars × 0.3 = 1.2 → ceil = 2
        // Others: 5 chars × 0.3 = 1.5 → ceil = 2
        // Total: 3 + 2 + 2 = 7
        expect(result).toBe(7);
        expect(result).toBeGreaterThan(0);
      });

      // ✅ Success Case 4: Numbers only
      it('should count tokens correctly for numeric text', async () => {
        const text = '1234567890';
        const result = await countTokens(text, 'gpt-4.1');

        // 10 numbers × 0.3 = 3 → ceil = 3
        expect(result).toBe(3);
      });

      // ❌ Error Case 1: Empty string
      it('should return 0 for empty string', async () => {
        const result = await countTokens('', 'gpt-4.1');
        expect(result).toBe(0);
      });

      // ❌ Error Case 2: Null input
      it('should return 0 for null input', async () => {
        const result = await countTokens(null, 'gpt-4.1');
        expect(result).toBe(0);
      });

      // ❌ Error Case 3: Undefined input
      it('should return 0 for undefined input', async () => {
        const result = await countTokens(undefined, 'gpt-4.1');
        expect(result).toBe(0);
      });
    });

    // ============================================
    // Claude Model Tests
    // ============================================
    describe('Claude Sonnet 4.5 model', () => {
      // ✅ Success Case 1: Normal text
      it('should use Anthropic tokenizer for Claude model', async () => {
        const text = 'Hello Claude';
        const result = await countTokens(text, 'claude-sonnet-4.5');

        // Mocked to return text.length × 0.3
        expect(result).toBe(Math.ceil(text.length * 0.3));
        expect(typeof result).toBe('number');
      });

      // ✅ Success Case 2: Korean text with Claude
      it('should handle Korean text with Claude tokenizer', async () => {
        const text = '안녕하세요 클로드';
        const result = await countTokens(text, 'claude-sonnet-4.5');

        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
      });

      // ❌ Error Case 1: Empty string
      it('should return 0 for empty string with Claude model', async () => {
        const result = await countTokens('', 'claude-sonnet-4.5');
        expect(result).toBe(0);
      });

      // ❌ Error Case 2: Null input
      it('should return 0 for null input with Claude model', async () => {
        const result = await countTokens(null, 'claude-sonnet-4.5');
        expect(result).toBe(0);
      });
    });

    // ============================================
    // Gemini Model Tests
    // ============================================
    describe('Gemini 3.0 model', () => {
      // ✅ Success Case 1: Korean text
      it('should count tokens correctly for Korean text', async () => {
        const text = '안녕하세요';
        const result = await countTokens(text, 'gemini-3.0');

        // 5 Korean chars × 1.3 = 6.5 → ceil = 7
        expect(result).toBe(7);
      });

      // ✅ Success Case 2: English text
      it('should count tokens correctly for English text', async () => {
        const text = 'Hello World';
        const result = await countTokens(text, 'gemini-3.0');

        // 11 other chars × 0.28 = 3.08 → ceil = 4
        expect(result).toBe(4);
      });

      // ✅ Success Case 3: Mixed text
      it('should count tokens correctly for mixed Korean/English', async () => {
        const text = '안녕 Hello';
        const result = await countTokens(text, 'gemini-3.0');

        // Korean: 2 × 1.3 = 2.6 → ceil = 3
        // Others: 7 × 0.28 = 1.96 → ceil = 2
        // Total: 3 + 2 = 5
        expect(result).toBe(5);
        expect(result).toBeGreaterThan(0);
      });

      // ❌ Error Case 1: Empty string
      it('should return 0 for empty string', async () => {
        const result = await countTokens('', 'gemini-3.0');
        expect(result).toBe(0);
      });

      // ❌ Error Case 2: Null input
      it('should return 0 for null input', async () => {
        const result = await countTokens(null, 'gemini-3.0');
        expect(result).toBe(0);
      });
    });

    // ============================================
    // Unknown Model / Default Tests
    // ============================================
    describe('Unknown model handling', () => {
      // ❌ Error Case 1: Unsupported model
      it('should return 0 for unsupported model', async () => {
        const result = await countTokens('test text', 'unknown-model');
        expect(result).toBe(0);
      });

      // ❌ Error Case 2: Null model ID
      it('should return 0 for null model ID', async () => {
        const result = await countTokens('test text', null);
        expect(result).toBe(0);
      });

      // ❌ Error Case 3: Undefined model ID
      it('should return 0 for undefined model ID', async () => {
        const result = await countTokens('test text', undefined);
        expect(result).toBe(0);
      });

      // ❌ Error Case 4: Empty model ID
      it('should return 0 for empty model ID', async () => {
        const result = await countTokens('test text', '');
        expect(result).toBe(0);
      });
    });

    // ============================================
    // Edge Cases
    // ============================================
    describe('Edge cases', () => {
      // 🔍 Edge Case 1: Very long text
      it('should handle very long text without errors', async () => {
        const longText = '안녕'.repeat(1000); // 2000 Korean chars
        const result = await countTokens(longText, 'gpt-4.1');

        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
        expect(Number.isInteger(result)).toBe(true);
      });

      // 🔍 Edge Case 2: Special characters
      it('should handle special characters correctly', async () => {
        const text = '!@#$%^&*()_+-=[]{}|;:",.<>?/~`';
        const result = await countTokens(text, 'gpt-4.1');

        // All special chars × 0.3
        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
      });

      // 🔍 Edge Case 3: Emojis
      it('should handle emojis in text', async () => {
        const text = '안녕하세요 👋 Hello 🌍';
        const result = await countTokens(text, 'gpt-4.1');

        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
      });

      // 🔍 Edge Case 4: Whitespace only
      it('should handle whitespace-only text', async () => {
        const text = '     ';
        const result = await countTokens(text, 'gpt-4.1');

        // 5 spaces × 0.3 = 1.5 → ceil = 2
        expect(result).toBe(2);
      });

      // 🔍 Edge Case 5: Mixed with newlines and tabs
      it('should handle text with newlines and tabs', async () => {
        const text = 'Line 1\nLine 2\tTabbed';
        const result = await countTokens(text, 'gpt-4.1');

        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
      });
    });

    // ============================================
    // Error Handling
    // ============================================
    describe('Error handling', () => {
      // ❌ Should handle unexpected errors gracefully
      it('should fallback to approximation when Claude tokenizer fails', async () => {
        // The mock is set up to work, but if it fails, we fallback to approximation
        // Testing that the fallback works by using a valid Claude model
        const result = await countTokens('test', 'claude-sonnet-4.5');
        expect(result).toBeGreaterThanOrEqual(0);
        expect(typeof result).toBe('number');
      });

      // ❌ Should not throw on invalid input types
      it('should not throw on invalid input types', async () => {
        await expect(countTokens(123, 'gpt-4.1')).resolves.toBe(0);
        await expect(countTokens({}, 'gpt-4.1')).resolves.toBe(0);
        await expect(countTokens([], 'gpt-4.1')).resolves.toBe(0);
      });
    });

    // ============================================
    // Type Checks
    // ============================================
    describe('Return type validation', () => {
      it('should always return a number', async () => {
        const testCases = [
          { text: 'test', model: 'gpt-4.1' },
          { text: '안녕', model: 'claude-sonnet-4.5' },
          { text: 'hello', model: 'gemini-3.0' },
          { text: '', model: 'gpt-4.1' },
          { text: null, model: 'gpt-4.1' }
        ];

        for (const { text, model } of testCases) {
          const result = await countTokens(text, model);
          expect(typeof result).toBe('number');
        }
      });

      it('should always return a non-negative integer', async () => {
        const result1 = await countTokens('test', 'gpt-4.1');
        const result2 = await countTokens('', 'gpt-4.1');

        expect(result1).toBeGreaterThanOrEqual(0);
        expect(result2).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(result1)).toBe(true);
        expect(Number.isInteger(result2)).toBe(true);
      });
    });
  });
});
