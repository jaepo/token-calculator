import { describe, it, expect } from 'vitest';
import { analyzeCharacters, getCharacterMatches, TEXT_PATTERNS } from '../textAnalyzer.js';

describe('textAnalyzer', () => {
  describe('TEXT_PATTERNS', () => {
    it('should define Korean pattern', () => {
      expect(TEXT_PATTERNS.KOREAN).toBeInstanceOf(RegExp);
      expect(TEXT_PATTERNS.KOREAN.global).toBe(true);
    });

    it('should define English pattern', () => {
      expect(TEXT_PATTERNS.ENGLISH).toBeInstanceOf(RegExp);
      expect(TEXT_PATTERNS.ENGLISH.global).toBe(true);
    });

    it('should define Number pattern', () => {
      expect(TEXT_PATTERNS.NUMBER).toBeInstanceOf(RegExp);
      expect(TEXT_PATTERNS.NUMBER.global).toBe(true);
    });

    it('should define Space pattern', () => {
      expect(TEXT_PATTERNS.SPACE).toBeInstanceOf(RegExp);
      expect(TEXT_PATTERNS.SPACE.global).toBe(true);
    });
  });

  describe('analyzeCharacters', () => {
    it('should return zero counts for empty string', () => {
      const result = analyzeCharacters('');
      expect(result).toEqual({
        korean: 0,
        english: 0,
        number: 0,
        space: 0,
        other: 0,
        total: 0
      });
    });

    it('should return zero counts for null', () => {
      const result = analyzeCharacters(null);
      expect(result).toEqual({
        korean: 0,
        english: 0,
        number: 0,
        space: 0,
        other: 0,
        total: 0
      });
    });

    it('should return zero counts for undefined', () => {
      const result = analyzeCharacters(undefined);
      expect(result).toEqual({
        korean: 0,
        english: 0,
        number: 0,
        space: 0,
        other: 0,
        total: 0
      });
    });

    it('should count Korean characters correctly', () => {
      const result = analyzeCharacters('안녕하세요');
      expect(result.korean).toBe(5);
      expect(result.total).toBe(5);
    });

    it('should count English characters correctly', () => {
      const result = analyzeCharacters('Hello');
      expect(result.english).toBe(5);
      expect(result.total).toBe(5);
    });

    it('should count numbers correctly', () => {
      const result = analyzeCharacters('12345');
      expect(result.number).toBe(5);
      expect(result.total).toBe(5);
    });

    it('should count spaces correctly', () => {
      const result = analyzeCharacters('Hello World');
      expect(result.space).toBe(1);
      expect(result.total).toBe(11);
    });

    it('should count mixed text correctly', () => {
      const result = analyzeCharacters('Hello 안녕 123');
      expect(result.korean).toBe(2);
      expect(result.english).toBe(5);
      expect(result.number).toBe(3);
      expect(result.space).toBe(2);
      expect(result.other).toBe(0);
      expect(result.total).toBe(12);
    });

    it('should count emojis as other characters', () => {
      const result = analyzeCharacters('😀🎯💡');
      expect(result.other).toBeGreaterThan(0);
      expect(result.korean).toBe(0);
      expect(result.english).toBe(0);
    });

    it('should count special characters as other', () => {
      const result = analyzeCharacters('Hello! @#$');
      expect(result.english).toBe(5);
      expect(result.other).toBeGreaterThan(0); // !, @, #, $
    });

    it('should handle complex multilingual text', () => {
      const text = '안녕하세요! AI 토큰 계산기입니다.';
      const result = analyzeCharacters(text);

      expect(result.korean).toBeGreaterThan(0);
      expect(result.english).toBeGreaterThan(0);
      expect(result.space).toBeGreaterThan(0);
      expect(result.total).toBe(text.length);

      // Sum should equal total
      const sum = result.korean + result.english + result.number + result.space + result.other;
      expect(sum).toBe(result.total);
    });
  });

  describe('getCharacterMatches', () => {
    it('should return empty arrays for empty string', () => {
      const result = getCharacterMatches('');
      expect(result).toEqual({
        korean: [],
        english: [],
        number: [],
        space: []
      });
    });

    it('should return empty arrays for null', () => {
      const result = getCharacterMatches(null);
      expect(result).toEqual({
        korean: [],
        english: [],
        number: [],
        space: []
      });
    });

    it('should return Korean character array', () => {
      const result = getCharacterMatches('안녕');
      expect(result.korean).toEqual(['안', '녕']);
      expect(result.english).toEqual([]);
    });

    it('should return English character array', () => {
      const result = getCharacterMatches('Hi');
      expect(result.english).toEqual(['H', 'i']);
      expect(result.korean).toEqual([]);
    });

    it('should return number character array', () => {
      const result = getCharacterMatches('123');
      expect(result.number).toEqual(['1', '2', '3']);
    });

    it('should return space character array', () => {
      const result = getCharacterMatches('A B C');
      expect(result.space).toEqual([' ', ' ']);
    });

    it('should return all character types correctly', () => {
      const result = getCharacterMatches('Hello 안녕 123');

      expect(result.korean).toHaveLength(2);
      expect(result.english).toHaveLength(5);
      expect(result.number).toHaveLength(3);
      expect(result.space).toHaveLength(2);
    });

    it('should handle text with no Korean characters', () => {
      const result = getCharacterMatches('Hello 123');
      expect(result.korean).toEqual([]);
      expect(result.english).toHaveLength(5);
    });

    it('should handle text with only emojis', () => {
      const result = getCharacterMatches('😀🎯');
      expect(result.korean).toEqual([]);
      expect(result.english).toEqual([]);
      expect(result.number).toEqual([]);
    });
  });
});
