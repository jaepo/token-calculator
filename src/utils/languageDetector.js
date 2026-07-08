export function analyzeLanguage(text) {
  if (!text) {
    return {
      korean: 0,
      english: 0,
      numbers: 0,
      spaces: 0,
      special: 0,
      total: 0
    };
  }

  const koreanRegex = /[가-힣]/g;
  const englishRegex = /[a-zA-Z]/g;
  const numberRegex = /[0-9]/g;
  const spaceRegex = /\s/g;

  const korean = text.match(koreanRegex) || [];
  const english = text.match(englishRegex) || [];
  const numbers = text.match(numberRegex) || [];
  const spaces = text.match(spaceRegex) || [];

  const knownChars = korean.length + english.length + numbers.length + spaces.length;
  const special = text.length - knownChars;

  return {
    korean: korean.length,
    english: english.length,
    numbers: numbers.length,
    spaces: spaces.length,
    special: special,
    total: text.length
  };
}

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

  // Fallback estimation
  // Korean: ~1.5 tokens per character
  // English: ~0.25 tokens per character (4 chars = 1 token)
  const koreanTokens = Math.ceil(chars.korean * 1.5);
  const englishTokens = Math.ceil(chars.english * 0.25);
  const otherTokens = Math.ceil((chars.numbers + chars.special + chars.spaces) * 0.3);

  return {
    korean: koreanTokens,
    english: englishTokens,
    other: otherTokens
  };
}
