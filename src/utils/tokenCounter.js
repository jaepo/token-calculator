export async function countTokens(text, modelId) {
  if (!text) return 0;

  try {
    switch (modelId) {
      // OpenAI Models
      case 'gpt-4.1': {
        // GPT-4.1 uses o200k_base encoding
        // Approximate token counting based on character analysis
        // English: ~0.25 tokens per char (4 chars ≈ 1 token)
        // Korean: ~1.5 tokens per char
        // Numbers/Special: ~0.3 tokens per char
        const koreanChars = (text.match(/[가-힣]/g) || []).length;
        const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
        const numberChars = (text.match(/[0-9]/g) || []).length;
        const otherChars = text.length - koreanChars - englishChars - numberChars;

        const koreanTokens = Math.ceil(koreanChars * 1.5);
        const englishTokens = Math.ceil(englishChars * 0.25);
        const numberTokens = Math.ceil(numberChars * 0.3);
        const otherTokens = Math.ceil(otherChars * 0.3);

        return koreanTokens + englishTokens + numberTokens + otherTokens;
      }

      // Anthropic Models (all use same tokenizer)
      case 'claude-opus-4.8':
      case 'claude-sonnet-4.5':
      case 'claude-haiku-4.5': {
        // Dynamic import to handle WASM with top-level await in production build
        try {
          const { countTokens: countClaudeTokens } = await import('@anthropic-ai/tokenizer');
          return countClaudeTokens(text);
        } catch (importError) {
          console.warn('Claude tokenizer not available, using approximation');
          // Fallback approximation similar to other models
          const koreanChars = (text.match(/[가-힣]/g) || []).length;
          const otherChars = text.length - koreanChars;
          return Math.ceil(koreanChars * 1.3 + otherChars * 0.28);
        }
      }

      // Google Models
      case 'gemini-3.5-flash':
      case 'gemini-3.0': {
        // Gemini uses similar tokenization to BERT
        // Approximate: 1 token ≈ 4 characters for English, ≈ 1-2 characters for Korean
        const koreanChars = (text.match(/[가-힣]/g) || []).length;
        const otherChars = text.length - koreanChars;

        const koreanTokens = Math.ceil(koreanChars * 1.3);
        const otherTokens = Math.ceil(otherChars * 0.28);

        return koreanTokens + otherTokens;
      }

      // DeepSeek Models
      case 'deepseek-v4-flash': {
        // DeepSeek uses OpenAI-compatible tokenization (similar to GPT models)
        // Using similar approximation to GPT-4.1
        const koreanChars = (text.match(/[가-힣]/g) || []).length;
        const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
        const numberChars = (text.match(/[0-9]/g) || []).length;
        const otherChars = text.length - koreanChars - englishChars - numberChars;

        const koreanTokens = Math.ceil(koreanChars * 1.5);
        const englishTokens = Math.ceil(englishChars * 0.25);
        const numberTokens = Math.ceil(numberChars * 0.3);
        const otherTokens = Math.ceil(otherChars * 0.3);

        return koreanTokens + englishTokens + numberTokens + otherTokens;
      }

      default:
        return 0;
    }
  } catch (error) {
    console.error('Token counting error:', error);
    return 0;
  }
}
