# 코드베이스 중복 및 결합도 분석 리포트

생성일: 2026-07-09
프로젝트: token-calculator

---

## 📊 분석 요약

### 발견된 주요 문제

1. **높은 중복도**: 문자 카운팅 로직이 4곳에서 반복됨
2. **중간 결합도**: 유틸리티 모듈 간 의존성 존재
3. **매직 넘버**: 토큰 계수가 여러 곳에 하드코딩됨

---

## 🔴 심각도: HIGH - 중복 코드

### 1. 토큰 카운터의 문자 분석 로직 중복

**위치**: `src/utils/tokenCounter.js`

**중복 횟수**: 4회 (GPT-4.1, Claude fallback, Gemini, DeepSeek)

#### 중복 코드 패턴:

```javascript
// 패턴 1: 상세 분석 (GPT-4.1, DeepSeek) - 2회 중복
const koreanChars = (text.match(/[가-힣]/g) || []).length;
const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
const numberChars = (text.match(/[0-9]/g) || []).length;
const otherChars = text.length - koreanChars - englishChars - numberChars;

const koreanTokens = Math.ceil(koreanChars * 1.5);
const englishTokens = Math.ceil(englishChars * 0.25);
const numberTokens = Math.ceil(numberChars * 0.3);
const otherTokens = Math.ceil(otherChars * 0.3);

return koreanTokens + englishTokens + numberTokens + otherTokens;
```

**라인 번호**:
- GPT-4.1: 13-23 (11줄)
- DeepSeek: 61-71 (11줄)
- **총 중복**: 22줄

```javascript
// 패턴 2: 간단 분석 (Claude fallback, Gemini) - 2회 중복
const koreanChars = (text.match(/[가-힣]/g) || []).length;
const otherChars = text.length - koreanChars;

const koreanTokens = Math.ceil(koreanChars * 1.3);
const otherTokens = Math.ceil(otherChars * 0.28);

return koreanTokens + otherTokens;
```

**라인 번호**:
- Claude fallback: 37-39 (3줄, 인라인 계산)
- Gemini: 48-54 (7줄)
- **총 중복**: 10줄

#### 추가 중복

**정규식 패턴**: 동일한 정규식이 여러 위치에서 반복
```javascript
/[가-힣]/g      // 4회 사용
/[a-zA-Z]/g     // 2회 사용
/[0-9]/g        // 2회 사용
```

### 2. 문자 분석 로직 중복 (tokenCounter vs languageDetector)

**파일**:
- `src/utils/tokenCounter.js` - 토큰 계산용 문자 분석
- `src/utils/languageDetector.js` - 언어 통계용 문자 분석

**중복 내용**:
```javascript
// tokenCounter.js (4곳)
const koreanChars = (text.match(/[가-힣]/g) || []).length;
const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
const numberChars = (text.match(/[0-9]/g) || []).length;

// languageDetector.js:13-22
const koreanRegex = /[가-힣]/g;
const englishRegex = /[a-zA-Z]/g;
const numberRegex = /[0-9]/g;
const spaceRegex = /\s/g;

const korean = text.match(koreanRegex) || [];
const english = text.match(englishRegex) || [];
const numbers = text.match(numberRegex) || [];
const spaces = text.match(spaceRegex) || [];
```

**문제점**:
- 동일한 작업(문자 카운팅)이 두 모듈에서 각각 구현됨
- 정규식 패턴이 중복 정의됨
- 유지보수 시 두 곳을 동시에 수정해야 함

### 3. ByteCounter와 TokenCounter의 유사 로직

**파일**: 
- `src/utils/byteCounter.js:45-47`
- `src/utils/tokenCounter.js:13-16`

**중복 패턴**:
```javascript
// byteCounter.js
const koreanMatch = text.match(/[가-힣]/g) || [];
const englishMatch = text.match(/[a-zA-Z]/g) || [];
const numberMatch = text.match(/[0-9]/g) || [];

// tokenCounter.js
const koreanChars = (text.match(/[가-힣]/g) || []).length;
const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
const numberChars = (text.match(/[0-9]/g) || []).length;
```

---

## 🟡 심각도: MEDIUM - 높은 결합도

### 1. Constants 모듈 의존성

**파일**: `src/utils/constants.js`

**의존 컴포넌트** (2개):
- `src/components/ModelSelector.jsx:2` - MODELS import
- `src/components/ActionButtons.jsx:2` - SAMPLE_TEXTS import

**의존 훅**:
- `src/hooks/useTokenCount.js` - MODELS import (간접)

**의존 유틸리티**:
- `src/utils/costCalculator.js` - EXCHANGE_RATE 사용 (간접)

**문제점**:
- constants.js 변경 시 여러 모듈 영향
- MODELS 배열이 여러 곳에서 직접 참조됨
- 가격 정보 변경 시 영향 범위 파악 어려움

### 2. LanguageDetector 중복 사용

**사용처** (2곳):
- `src/components/TokenStats.jsx:2`
- `src/hooks/useTokenCount.js` (간접적으로 동일 로직 수행)

**문제점**:
- TokenStats와 useTokenCount가 동일한 문자 분석 수행
- 데이터 흐름이 비효율적 (중복 계산)

---

## 🟢 심각도: LOW - 매직 넘버

### 토큰 계수 하드코딩

**위치**: `src/utils/tokenCounter.js`

```javascript
// GPT-4.1 & DeepSeek
koreanTokens = Math.ceil(koreanChars * 1.5);     // 라인 18, 66
englishTokens = Math.ceil(englishChars * 0.25);  // 라인 19, 67
numberTokens = Math.ceil(numberChars * 0.3);     // 라인 20, 68
otherTokens = Math.ceil(otherChars * 0.3);       // 라인 21, 69

// Gemini & Claude fallback
koreanTokens = Math.ceil(koreanChars * 1.3);     // 라인 39, 51
otherTokens = Math.ceil(otherChars * 0.28);      // 라인 39, 52
```

**동일 계수가 languageDetector.js에도 존재**:
```javascript
// languageDetector.js:51-53
const koreanTokens = Math.ceil(chars.korean * 1.5);
const englishTokens = Math.ceil(chars.english * 0.25);
const otherTokens = Math.ceil((chars.numbers + chars.special + chars.spaces) * 0.3);
```

**문제점**:
- 계수 변경 시 여러 파일 수정 필요
- 모델별 계수 관리 어려움
- 일관성 유지 어려움

---

## 📈 코드 메트릭

### 파일 크기 (상위 10개)

| 파일 | 라인 수 | 비고 |
|------|---------|------|
| `src/utils/__tests__/tokenCounter.test.js` | 294 | 테스트 파일 |
| `src/utils/constants.js` | 104 | 설정 파일 |
| `src/components/ActionButtons.jsx` | 92 | UI 컴포넌트 |
| `src/utils/tokenCounter.js` | **81** | **중복 많음** |
| `src/components/TokenStats.jsx` | 80 | UI 컴포넌트 |
| `src/App.jsx` | 76 | 메인 앱 |
| `src/utils/__tests__/byteCounter.test.js` | 68 | 테스트 파일 |
| `src/components/CostCalculator.jsx` | 68 | UI 컴포넌트 |
| `src/hooks/useTokenCount.js` | 64 | 커스텀 훅 |
| `src/utils/languageDetector.js` | **60** | **중복 많음** |

### 중복 패턴 통계

| 패턴 | 중복 횟수 | 영향받는 파일 |
|------|-----------|---------------|
| 한글 정규식 `/[가-힣]/g` | 6회 | tokenCounter.js(4), byteCounter.js(1), languageDetector.js(1) |
| 영문 정규식 `/[a-zA-Z]/g` | 4회 | tokenCounter.js(2), byteCounter.js(1), languageDetector.js(1) |
| 숫자 정규식 `/[0-9]/g` | 4회 | tokenCounter.js(2), byteCounter.js(1), languageDetector.js(1) |
| `Math.ceil` 토큰 계산 | 11회 | tokenCounter.js(8), languageDetector.js(3) |
| 문자 카운팅 로직 | 6회 | tokenCounter.js(4), languageDetector.js(1), byteCounter.js(1) |

---

## 🎯 리팩토링 우선순위

### Priority 1: HIGH (즉시 수정 권장)

#### ✅ 문자 분석 로직 통합

**현재 문제**: 동일한 문자 카운팅 로직이 3개 파일에 분산됨

**리팩토링 방안**:
```javascript
// 새 파일: src/utils/textAnalyzer.js
export const TEXT_PATTERNS = {
  KOREAN: /[가-힣]/g,
  ENGLISH: /[a-zA-Z]/g,
  NUMBER: /[0-9]/g,
  SPACE: /\s/g,
};

export function analyzeCharacters(text) {
  if (!text) return { korean: 0, english: 0, number: 0, other: 0, total: 0 };
  
  const korean = (text.match(TEXT_PATTERNS.KOREAN) || []).length;
  const english = (text.match(TEXT_PATTERNS.ENGLISH) || []).length;
  const number = (text.match(TEXT_PATTERNS.NUMBER) || []).length;
  const space = (text.match(TEXT_PATTERNS.SPACE) || []).length;
  const other = text.length - korean - english - number - space;
  
  return { korean, english, number, space, other, total: text.length };
}
```

**수정 필요 파일**:
- `src/utils/tokenCounter.js` - analyzeCharacters 사용
- `src/utils/languageDetector.js` - analyzeCharacters 재사용
- `src/utils/byteCounter.js` - analyzeCharacters 재사용

**예상 효과**:
- **중복 코드 제거**: ~40줄
- **유지보수성 향상**: 단일 진실 공급원(Single Source of Truth)
- **일관성 보장**: 모든 모듈이 동일한 로직 사용

---

### Priority 2: HIGH (즉시 수정 권장)

#### ✅ 토큰 계산 전략 패턴 적용

**현재 문제**: GPT와 DeepSeek의 토큰 계산 로직이 100% 동일 (22줄 중복)

**리팩토링 방안**:
```javascript
// src/utils/tokenStrategies.js
import { analyzeCharacters } from './textAnalyzer.js';

export const TOKEN_COEFFICIENTS = {
  GPT_DETAILED: {
    korean: 1.5,
    english: 0.25,
    number: 0.3,
    other: 0.3
  },
  GEMINI_SIMPLE: {
    korean: 1.3,
    other: 0.28
  }
};

export function calculateTokensDetailed(text, coefficients) {
  const chars = analyzeCharacters(text);
  
  return Math.ceil(chars.korean * coefficients.korean) +
         Math.ceil(chars.english * coefficients.english) +
         Math.ceil(chars.number * coefficients.number) +
         Math.ceil(chars.other * coefficients.other);
}

export function calculateTokensSimple(text, coefficients) {
  const chars = analyzeCharacters(text);
  const other = chars.english + chars.number + chars.space + chars.other;
  
  return Math.ceil(chars.korean * coefficients.korean) +
         Math.ceil(other * coefficients.other);
}
```

**tokenCounter.js 수정 예시**:
```javascript
import { calculateTokensDetailed, calculateTokensSimple, TOKEN_COEFFICIENTS } from './tokenStrategies.js';

export async function countTokens(text, modelId) {
  if (!text) return 0;
  
  try {
    switch (modelId) {
      case 'gpt-4.1':
      case 'deepseek-v4-flash':
        return calculateTokensDetailed(text, TOKEN_COEFFICIENTS.GPT_DETAILED);
      
      case 'gemini-3.5-flash':
      case 'gemini-3.0':
        return calculateTokensSimple(text, TOKEN_COEFFICIENTS.GEMINI_SIMPLE);
      
      case 'claude-opus-4.8':
      case 'claude-sonnet-4.5':
      case 'claude-haiku-4.5':
        try {
          const { countTokens: countClaudeTokens } = await import('@anthropic-ai/tokenizer');
          return countClaudeTokens(text);
        } catch (importError) {
          return calculateTokensSimple(text, TOKEN_COEFFICIENTS.GEMINI_SIMPLE);
        }
      
      default:
        return 0;
    }
  } catch (error) {
    console.error('Token counting error:', error);
    return 0;
  }
}
```

**예상 효과**:
- **중복 코드 제거**: ~35줄
- **파일 크기 감소**: 81줄 → ~46줄 (43% 감소)
- **확장성 향상**: 새 모델 추가 시 계수만 정의
- **테스트 용이성**: 전략별 단위 테스트 가능

---

### Priority 3: MEDIUM (권장)

#### ✅ 모델 설정 중앙화

**현재 문제**: 토큰 계수가 코드에 하드코딩됨

**리팩토링 방안**:
```javascript
// src/utils/constants.js 확장
export const MODELS = [
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "OpenAI",
    tokenizer: "detailed",  // 전략 지정
    coefficients: {         // 계수 추가
      korean: 1.5,
      english: 0.25,
      number: 0.3,
      other: 0.3
    },
    pricing: { input: 0.002, output: 0.008 },
    contextWindow: 200000
  },
  // ... 다른 모델들
];
```

**예상 효과**:
- **설정 중앙화**: 모델 관련 모든 정보가 한 곳에
- **유지보수성**: 가격, 계수 변경 시 한 곳만 수정
- **일관성**: 계수 변경이 즉시 전체에 반영

---

### Priority 4: LOW (선택적)

#### ✅ Constants 의존성 감소

**현재 문제**: 2개 컴포넌트가 constants.js 직접 import

**리팩토링 방안**:
```javascript
// src/hooks/useModels.js (새 파일)
import { MODELS } from '../utils/constants';

export function useModels() {
  return MODELS;
}

export function useModel(modelId) {
  return MODELS.find(m => m.id === modelId);
}

// src/hooks/useSamples.js (새 파일)
import { SAMPLE_TEXTS } from '../utils/constants';

export function useSamples() {
  return SAMPLE_TEXTS;
}
```

**예상 효과**:
- **결합도 감소**: 컴포넌트와 constants 간 간접 의존
- **테스트 용이성**: 훅 모킹으로 쉽게 테스트
- **재사용성**: 동일 로직을 여러 컴포넌트에서 활용

---

## 📋 리팩토링 체크리스트

### Phase 1: 중복 제거 (1-2시간)
- [ ] `src/utils/textAnalyzer.js` 생성
- [ ] `analyzeCharacters` 함수 구현
- [ ] `TEXT_PATTERNS` 상수 정의
- [ ] `tokenCounter.js` 마이그레이션
- [ ] `languageDetector.js` 마이그레이션
- [ ] `byteCounter.js` 마이그레이션
- [ ] 기존 테스트 통과 확인

### Phase 2: 전략 패턴 적용 (2-3시간)
- [ ] `src/utils/tokenStrategies.js` 생성
- [ ] `TOKEN_COEFFICIENTS` 정의
- [ ] `calculateTokensDetailed` 구현
- [ ] `calculateTokensSimple` 구현
- [ ] `tokenCounter.js` 리팩토링
- [ ] 단위 테스트 작성
- [ ] E2E 테스트 통과 확인

### Phase 3: 설정 중앙화 (1시간)
- [ ] `MODELS` 배열에 tokenizer, coefficients 추가
- [ ] `tokenCounter.js`에서 모델 설정 읽기
- [ ] `languageDetector.js`에서 모델 설정 읽기
- [ ] 테스트 업데이트

### Phase 4: 의존성 개선 (선택, 1시간)
- [ ] `useModels` 훅 생성
- [ ] `useSamples` 훅 생성
- [ ] 컴포넌트 업데이트
- [ ] 테스트 작성

---

## 📊 리팩토링 전후 비교 (예상)

| 메트릭 | Before | After | 개선율 |
|--------|--------|-------|--------|
| 총 코드 라인 | ~1,386 | ~1,250 | **-10%** |
| tokenCounter.js | 81줄 | ~46줄 | **-43%** |
| 중복 코드 블록 | 6개 | 0개 | **-100%** |
| 정규식 중복 정의 | 14회 | 4회 | **-71%** |
| 매직 넘버 | 16개 | 0개 | **-100%** |
| 파일 간 결합도 | Medium | Low | ✅ |
| 테스트 커버리지 | ~70% | ~85% | **+15%** |
| 새 모델 추가 시간 | ~15분 | ~5분 | **-67%** |

---

## 🎓 코드 품질 개선 효과

### 유지보수성
- ✅ 단일 진실 공급원으로 버그 수정 용이
- ✅ 모델 추가 시 설정만 변경하면 됨
- ✅ 토큰 계수 조정이 한 곳에서 가능

### 가독성
- ✅ 전략 패턴으로 의도가 명확해짐
- ✅ 매직 넘버 제거로 이해도 향상
- ✅ 파일 크기 감소로 코드 파악 쉬움

### 테스트 용이성
- ✅ 순수 함수로 단위 테스트 작성 용이
- ✅ 전략별 독립 테스트 가능
- ✅ 모킹이 쉬워짐

### 확장성
- ✅ 새 토큰화 전략 추가 용이
- ✅ 새 언어 지원 추가 간단
- ✅ 계수 튜닝 실험 가능

---

## ⚠️ 리팩토링 주의사항

### 테스트 필수
1. 기존 기능 동작 확인 (회귀 테스트)
2. 각 모델별 토큰 수 정확성 검증
3. 엣지 케이스 테스트 (null, 빈 문자열, 이모지 등)

### 점진적 마이그레이션
1. 새 모듈 먼저 생성 및 테스트
2. 기존 코드 유지하면서 병행 운영
3. 검증 완료 후 기존 코드 제거

### 문서화
1. 새 유틸리티 함수 JSDoc 작성
2. 전략 패턴 사용법 문서화
3. 계수 변경 가이드 작성

---

## 🏁 결론

### 발견된 문제점
- ❌ **높은 중복도**: 문자 카운팅 로직 6회 중복
- ❌ **매직 넘버**: 토큰 계수 16곳에 하드코딩
- ⚠️  **중간 결합도**: Constants 의존성 분산

### 개선 방향
- ✅ **textAnalyzer.js**: 문자 분석 통합
- ✅ **tokenStrategies.js**: 전략 패턴 적용
- ✅ **모델 설정 중앙화**: 계수를 MODELS에 통합
- ✅ **훅 기반 의존성**: 결합도 감소

### 예상 효과
- 📉 코드 라인 **10% 감소**
- 🚀 새 모델 추가 시간 **67% 단축**
- 🔍 테스트 커버리지 **15% 향상**
- 🎯 유지보수성 **대폭 개선**

---

**다음 단계**: 이 리포트를 바탕으로 리팩토링 작업을 진행하시겠습니까?
