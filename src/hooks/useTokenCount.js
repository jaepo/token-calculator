import { useState, useEffect } from 'react';
import { countTokens } from '../utils/tokenCounter';
import { analyzeLanguage, estimateTokensByLanguage } from '../utils/languageDetector';
import { useDebounce } from './useDebounce';

export function useTokenCount(text, modelId) {
  const [tokenData, setTokenData] = useState({
    total: 0,
    korean: 0,
    english: 0,
    other: 0,
    isCalculating: false
  });

  const debouncedText = useDebounce(text, 300);

  useEffect(() => {
    let isMounted = true;

    async function calculateTokens() {
      if (!debouncedText) {
        setTokenData({
          total: 0,
          korean: 0,
          english: 0,
          other: 0,
          isCalculating: false
        });
        return;
      }

      setTokenData(prev => ({ ...prev, isCalculating: true }));

      try {
        const total = await countTokens(debouncedText, modelId);
        const chars = analyzeLanguage(debouncedText);
        const languageTokens = estimateTokensByLanguage(chars, total);

        if (isMounted) {
          setTokenData({
            total,
            korean: languageTokens.korean,
            english: languageTokens.english,
            other: languageTokens.other,
            isCalculating: false
          });
        }
      } catch (error) {
        console.error('Token calculation error:', error);
        if (isMounted) {
          setTokenData(prev => ({ ...prev, isCalculating: false }));
        }
      }
    }

    calculateTokens();

    return () => {
      isMounted = false;
    };
  }, [debouncedText, modelId]);

  return tokenData;
}
