import { calculateTokensDetailed, calculateTokensSimple, TOKEN_COEFFICIENTS } from './tokenStrategies.js';

/**
 * Count tokens for a given text and model
 *
 * Uses model-specific tokenization strategies to estimate token count.
 * Falls back to approximation for models without native tokenizers.
 *
 * @param {string} text - Text to tokenize
 * @param {string} modelId - AI model identifier
 * @returns {Promise<number>} Estimated token count
 */
export async function countTokens(text, modelId) {
  if (!text) return 0;

  try {
    switch (modelId) {
      // OpenAI Models - Detailed tokenization
      case 'gpt-4.1':
        return calculateTokensDetailed(text, TOKEN_COEFFICIENTS.GPT_DETAILED);

      // Anthropic Models - Use native tokenizer with fallback
      case 'claude-opus-4.8':
      case 'claude-sonnet-4.5':
      case 'claude-haiku-4.5':
        try {
          const { countTokens: countClaudeTokens } = await import('@anthropic-ai/tokenizer');
          return countClaudeTokens(text);
        } catch (importError) {
          console.warn('Claude tokenizer not available, using approximation');
          return calculateTokensSimple(text, TOKEN_COEFFICIENTS.GEMINI_SIMPLE);
        }

      // Google Models - Simple tokenization
      case 'gemini-3.5-flash':
      case 'gemini-3.0':
        return calculateTokensSimple(text, TOKEN_COEFFICIENTS.GEMINI_SIMPLE);

      // DeepSeek Models - Detailed tokenization (GPT-compatible)
      case 'deepseek-v4-flash':
        return calculateTokensDetailed(text, TOKEN_COEFFICIENTS.GPT_DETAILED);

      default:
        return 0;
    }
  } catch (error) {
    console.error('Token counting error:', error);
    return 0;
  }
}
