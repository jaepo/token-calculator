# PRD: AI 토큰 계산기 (Token Counter)

## 1. 프로젝트 개요

### 1.1 프로젝트 명
**AI Token Counter** - 실시간 프롬프트 토큰 계산 웹 애플리케이션

### 1.2 목적
LLM(Large Language Model) API 사용 시 프롬프트의 토큰 사용량을 실시간으로 계산하여, 사용자가 API 비용을 예측하고 프롬프트를 최적화할 수 있도록 지원합니다.

### 1.3 핵심 가치
- **실시간 계산**: 타이핑과 동시에 토큰 수 표시
- **다국어 지원**: 한글과 영문 각각 정확한 토큰 계산
- **비용 예측**: 토큰당 비용 기반 예상 API 비용 표시
- **사용자 친화적**: 직관적인 UI/UX

## 2. 기술 스택

### 2.1 Core
- **Framework**: React 18+
- **Language**: JavaScript (또는 TypeScript)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite (권장) 또는 Create React App

### 2.2 Dependencies
- **Tokenizer**: 
  - `tiktoken` (OpenAI GPT tokenizer)
  - `@anthropic-ai/tokenizer` (Claude tokenizer)
  - `@google/generative-ai` (Gemini tokenizer)
- **Utilities**:
  - `clsx` - 조건부 클래스 네임 관리
  - `react-icons` - 아이콘 라이브러리 (FiSun, FiMoon for theme toggle)

## 3. 기능 요구사항

### 3.1 핵심 기능

#### F1. 텍스트 입력 영역
- 멀티라인 textarea (최소 높이 200px, 자동 확장)
- 실시간 문자 수 카운팅
- Placeholder: "프롬프트를 입력하세요..."
- 최대 길이 제한: 100,000자

#### F2. 토큰 계산
- **실시간 계산**: 입력 변경 시 즉시 토큰 수 업데이트 (debounce 300ms)
- **다중 모델 지원**:
  - GPT-5 (o200k_base encoding)
  - Claude Sonnet 4.5 (Claude tokenizer)
  - Gemini 3.0 (Gemini tokenizer)
- **언어별 분석**:
  - 한글 문자 수 및 토큰 수
  - 영문 문자 수 및 토큰 수
  - 숫자 및 특수문자 수
  - 공백 수

#### F3. 통계 대시보드
표시 항목:
- 총 문자 수
- 총 토큰 수
- 한글 토큰 수 / 비율
- 영문 토큰 수 / 비율
- 평균 토큰/문자 비율

#### F4. 비용 계산
- 선택한 모델의 토큰당 비용 표시
- 입력 토큰 비용 계산
- 예상 출력 토큰 수 입력 (슬라이더)
- 총 예상 비용 표시 (USD, KRW)

#### F5. 모델 선택
드롭다운으로 선택 가능한 최신 모델 (2026년 6월 기준):

**OpenAI**
- **GPT-5** (input: $0.02/1K, output: $0.06/1K)
  - Tokenizer: o200k_base
  - Context: 200K tokens

**Anthropic**
- **Claude Sonnet 4.5** (input: $0.003/1K, output: $0.015/1K)
  - Tokenizer: Claude tokenizer
  - Context: 200K tokens

**Google**
- **Gemini 3.0 Pro** (input: $0.001/1K, output: $0.003/1K)
  - Tokenizer: Gemini tokenizer
  - Context: 2M tokens

### 3.2 부가 기능

#### F6. 복사 기능
- 입력 텍스트 복사 버튼
- 통계 정보 복사 버튼

#### F7. 초기화
- "Clear" 버튼으로 입력 영역 및 통계 초기화

#### F8. 샘플 텍스트
- "Sample" 버튼으로 예제 프롬프트 로드
- 한글 샘플, 영문 샘플, 혼합 샘플

#### F9. 다크 모드 (필수 기능)
- **우측 상단 테마 토글 버튼**
  - 라이트 모드: ☀️ 태양 아이콘
  - 다크 모드: 🌙 달 아이콘
- **부드러운 전환 애니메이션** (transition-colors duration-200)
- **로컬스토리지 저장**: 사용자 선택 기억
- **시스템 설정 감지**: `prefers-color-scheme` 초기값 반영
- **모든 컴포넌트 지원**: 일관된 테마 적용

## 4. 컴포넌트 구조

```
src/
├── App.jsx                      # 메인 앱 컴포넌트
├── components/
│   ├── Header.jsx               # 헤더 (제목, 테마 토글)
│   ├── TextInput.jsx            # 텍스트 입력 영역
│   ├── ModelSelector.jsx        # 모델 선택 드롭다운
│   ├── TokenStats.jsx           # 토큰 통계 대시보드
│   │   ├── StatCard.jsx         # 개별 통계 카드
│   │   └── ProgressBar.jsx      # 비율 표시 프로그레스 바
│   ├── CostCalculator.jsx       # 비용 계산기
│   │   └── OutputSlider.jsx     # 출력 토큰 수 슬라이더
│   ├── LanguageBreakdown.jsx    # 언어별 분석 차트
│   └── ActionButtons.jsx        # 액션 버튼 (복사, 초기화, 샘플)
├── utils/
│   ├── tokenCounter.js          # 토큰 계산 로직
│   ├── languageDetector.js      # 한글/영문 감지 및 분리
│   ├── costCalculator.js        # 비용 계산 로직
│   └── constants.js             # 모델 정보, 가격 등 상수
├── hooks/
│   ├── useTokenCount.js         # 토큰 계산 커스텀 훅
│   ├── useDebounce.js           # Debounce 훅
│   └── useLocalStorage.js       # 로컬스토리지 훅
└── styles/
    └── index.css                # Tailwind 설정 및 글로벌 스타일
```

## 5. 데이터 모델

### 5.1 State 구조

```javascript
{
  // 입력
  inputText: "",
  selectedModel: "gpt-5",  // "gpt-5" | "claude-sonnet-4.5" | "gemini-3.0"
  estimatedOutputTokens: 500,
  
  // 계산 결과
  tokens: {
    total: 0,
    korean: 0,
    english: 0,
    other: 0
  },
  
  // 문자 통계
  chars: {
    total: 0,
    korean: 0,
    english: 0,
    numbers: 0,
    spaces: 0,
    special: 0
  },
  
  // 비용
  cost: {
    input: 0,      // USD
    output: 0,     // USD
    total: 0,      // USD
    totalKRW: 0    // KRW (환율 적용)
  },
  
  // UI 설정
  theme: "dark"   // "light" | "dark" (기본값: dark)
}
```

### 5.2 모델 정보 구조

```javascript
const MODELS = [
  {
    id: "gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    tokenizer: "o200k_base",
    pricing: {
      input: 0.02,    // per 1K tokens
      output: 0.06
    },
    contextWindow: 200000
  },
  {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    tokenizer: "claude",
    pricing: {
      input: 0.003,
      output: 0.015
    },
    contextWindow: 200000
  },
  {
    id: "gemini-3.0",
    name: "Gemini 3.0 Pro",
    provider: "Google",
    tokenizer: "gemini",
    pricing: {
      input: 0.001,
      output: 0.003
    },
    contextWindow: 2000000
  }
];
```

## 6. UI/UX 요구사항

### 6.1 레이아웃
- **반응형 디자인**: 모바일(< 640px), 태블릿(640-1024px), 데스크톱(> 1024px)
- **최대 너비**: 1200px (중앙 정렬)
- **간격**: 일관된 spacing (Tailwind의 4px 단위)

### 6.2 색상 팔레트

**Light Mode:**
- Primary: Blue-600 (#2563eb)
- Secondary: Violet-600 (#7c3aed)
- Accent: Emerald-600 (#059669)
- Background: Gray-50 (#f9fafb)
- Card: White (#ffffff)
- Text: Gray-900 (#111827)
- Text Secondary: Gray-600 (#4b5563)
- Border: Gray-200 (#e5e7eb)

**Dark Mode (기본 테마):**
- Primary: Blue-400 (#60a5fa)
- Secondary: Violet-400 (#a78bfa)
- Accent: Emerald-400 (#34d399)
- Background: Gray-950 (#030712)
- Card: Gray-900 (#111827)
- Text: Gray-50 (#f9fafb)
- Text Secondary: Gray-400 (#9ca3af)
- Border: Gray-800 (#1f2937)
- Subtle Glow: rgba(96, 165, 250, 0.1) on interactive elements

### 6.3 타이포그래피
- **제목 (H1)**: 2.5rem (40px), font-bold
- **섹션 제목 (H2)**: 1.5rem (24px), font-semibold
- **본문**: 1rem (16px), font-normal
- **Small**: 0.875rem (14px), font-normal
- **Font Family**: Inter, system-ui, sans-serif

### 6.4 인터랙션
- **Hover**: 버튼 밝기 증가, 카드 그림자 강화
- **Focus**: 파란색 outline (ring-2 ring-blue-500)
- **Transition**: 모든 상태 변화 200-300ms ease
- **Dark Mode Toggle**: 부드러운 아이콘 전환 애니메이션 (rotate + fade)
- **Theme Switch**: 모든 색상 200ms transition
- **Loading**: 계산 중 스켈레톤 UI 또는 스피너

## 7. 토큰 계산 로직

### 7.1 토큰화 알고리즘

```javascript
// GPT-5 토큰화 (o200k_base encoding)
import { Tiktoken } from 'tiktoken/lite';
import o200k_base from 'tiktoken/encoders/o200k_base.json';

function countGPT5Tokens(text) {
  const encoder = new Tiktoken(
    o200k_base.bpe_ranks,
    o200k_base.special_tokens,
    o200k_base.pat_str
  );
  const tokens = encoder.encode(text);
  encoder.free();
  return tokens.length;
}

// Claude Sonnet 4.5 토큰화
import { countTokens } from '@anthropic-ai/tokenizer';

function countClaudeTokens(text) {
  return countTokens(text);
}

// Gemini 3.0 토큰화
import { GoogleGenerativeAI } from '@google/generative-ai';

async function countGeminiTokens(text) {
  // Note: Gemini uses similar tokenization to BERT
  // Approximate: 1 token ≈ 4 characters for English, ≈ 1-2 characters for Korean
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3.0-pro" });
  const result = await model.countTokens(text);
  return result.totalTokens;
}
```

### 7.2 언어 감지 및 분리

```javascript
function analyzeLanguage(text) {
  const koreanRegex = /[가-힣]/g;
  const englishRegex = /[a-zA-Z]/g;
  const numberRegex = /[0-9]/g;
  const spaceRegex = /\s/g;
  
  const korean = text.match(koreanRegex) || [];
  const english = text.match(englishRegex) || [];
  const numbers = text.match(numberRegex) || [];
  const spaces = text.match(spaceRegex) || [];
  
  return {
    korean: korean.length,
    english: english.length,
    numbers: numbers.length,
    spaces: spaces.length,
    total: text.length
  };
}

// 한글/영문 토큰 비율 추정
function estimateTokensByLanguage(chars) {
  // 한글: 평균 1.5 토큰/문자
  // 영문: 평균 0.25 토큰/문자 (4문자 = 1토큰)
  const koreanTokens = Math.ceil(chars.korean * 1.5);
  const englishTokens = Math.ceil(chars.english * 0.25);
  
  return {
    korean: koreanTokens,
    english: englishTokens
  };
}
```

### 7.3 Debounce 최적화

```javascript
// 300ms debounce로 과도한 재계산 방지
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

## 8. 성능 요구사항

### 8.1 응답 시간
- 토큰 계산: < 100ms (10,000자 기준)
- UI 업데이트: < 16ms (60fps)
- Debounce 지연: 300ms

### 8.2 메모리
- 최대 입력 크기: 100,000자
- Tokenizer 인스턴스 재사용 (메모리 누수 방지)

### 8.3 번들 크기
- 초기 로드: < 500KB (gzipped)
- Lazy loading: 필요시 tokenizer 라이브러리 동적 로드

## 9. 접근성 (A11y)

- **Keyboard Navigation**: Tab으로 모든 인터랙티브 요소 접근
- **ARIA Labels**: 스크린 리더 지원
  - 테마 토글: `aria-label="Toggle dark mode"`
  - 모델 선택: `aria-label="Select AI model"`
- **Color Contrast**: 
  - Light Mode: WCAG AA (4.5:1)
  - Dark Mode: WCAG AAA (7:1) - 더 높은 대비
- **Focus Indicators**: 명확한 포커스 표시 (ring-2)
- **Reduced Motion**: `prefers-reduced-motion` 지원

## 10. 확장 가능성

### 10.1 Phase 2 기능
- 파일 업로드 (.txt, .md, .json)
- 프롬프트 히스토리 저장 (IndexedDB)
- 여러 프롬프트 비교 (탭 또는 분할 뷰)
- 토큰 최적화 제안 (긴 프롬프트 압축)

### 10.2 Phase 3 기능
- 사용자 계정 및 클라우드 저장
- 팀 협업 기능
- API 통합 (실제 API 호출 및 실시간 토큰 추적)
- 통계 및 분석 대시보드

## 11. 개발 우선순위

### P0 (필수 - MVP)
1. 텍스트 입력 및 실시간 토큰 계산 (F1, F2)
   - GPT-5, Claude Sonnet 4.5, Gemini 3.0 지원
2. 토큰 통계 표시 (F3)
3. 모델 선택 드롭다운 (F5)
4. **다크 모드 구현** (F9) - 기본 테마
5. 비용 계산 (F4)

### P1 (중요)
6. 복사 및 초기화 (F6, F7)
7. 언어별 분석 (한글/영문 분리)
8. 반응형 레이아웃

### P2 (선택)
9. 샘플 텍스트 (F8)
10. 언어별 차트 시각화 (프로그레스 바)
11. 출력 토큰 슬라이더
12. 애니메이션 및 세부 UX 개선

## 12. 테스트 요구사항

### 12.1 단위 테스트
- 토큰 계산 정확성
- 언어 감지 로직
- 비용 계산 로직

### 12.2 통합 테스트
- 입력 → 토큰 계산 → 통계 표시 전체 플로우
- 모델 변경 시 재계산

### 12.3 E2E 테스트
- 사용자 시나리오: 텍스트 입력 → 모델 선택 → 비용 확인 → 복사

## 13. 배포

### 13.1 호스팅
- Vercel, Netlify, GitHub Pages (정적 호스팅)

### 13.2 도메인
- 예시: `tokencounter.dev`, `promptcost.app`

### 13.3 환경 변수
- `VITE_EXCHANGE_RATE_API_KEY` (환율 API)
- `VITE_GA_TRACKING_ID` (Google Analytics, 선택)

## 14. 성공 지표

- **사용성**: 평균 세션 시간 > 3분
- **정확성**: 실제 API 토큰과 ±5% 이내 오차
- **성능**: 99% 요청 < 100ms 응답
- **채택률**: 월 활성 사용자 1,000명 (3개월 내)

---

## 부록: 예제 UI 스케치

### Dark Mode (기본)
```
┌─────────────────────────────────────────────────────┐
│  🎯 AI Token Counter                   🌙 → ☀️    │  ← Theme Toggle
├─────────────────────────────────────────────────────┤
│  [Dark Background: #030712]                         │
│                                                     │
│  Model: [GPT-5 ▼]  [Claude Sonnet 4.5]  [Gemini 3.0]│
│         ↑ Active model with blue glow               │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ 프롬프트를 입력하세요...                        │ │
│  │ [Card: #111827, Border: #1f2937]              │ │
│  │                                               │ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  [📋 Copy] [🗑️ Clear] [📝 Sample]                  │
│   Blue-400 on hover                                 │
│                                                     │
│  📊 Token Statistics                                │
│  ┌─────────────────────────────────────────────┐   │
│  │ Total Tokens    1,234 tokens               │   │
│  │                 [Primary: #60a5fa]         │   │
│  ├─────────────────────────────────────────────┤   │
│  │ Total Chars     5,678 characters           │   │
│  ├─────────────────────────────────────────────┤   │
│  │ Korean 🇰🇷      ████████░░ 80% (987 tokens)│   │
│  │                 [Gradient: Blue → Violet]  │   │
│  ├─────────────────────────────────────────────┤   │
│  │ English 🇺🇸     ██░░░░░░░░ 20% (247 tokens)│   │
│  │                 [Accent: #34d399]          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  💰 Cost Estimation                                │
│  ┌───────────────────────────────────────────────┐ │
│  │ Input:  $0.025 (1,234 tokens × $0.02/1K)     │ │
│  │ Output: ~500 tokens ├──────────┤ $0.030      │ │
│  │                      ↑ Slider                │ │
│  │ ───────────────────────────────────────────  │ │
│  │ Total:  $0.055 USD  ≈  ₩73 KRW              │ │
│  │         [Large, Bold, Glowing]               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Model Info: GPT-5 • 200K context • OpenAI         │
│             [Small, Gray-400]                       │
└─────────────────────────────────────────────────────┘
```

### Light Mode
```
┌─────────────────────────────────────────────────────┐
│  🎯 AI Token Counter                   ☀️ → 🌙    │
├─────────────────────────────────────────────────────┤
│  [Light Background: #f9fafb]                        │
│                                                     │
│  [Same layout, lighter colors]                      │
│  Card: #ffffff, Border: #e5e7eb                     │
│  Text: #111827, Secondary: #4b5563                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 부록 2: 다크 모드 구현 가이드

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563eb',
          dark: '#60a5fa'
        },
        // ... other colors
      }
    }
  }
}
```

### Theme Context
```javascript
// contexts/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### Theme Toggle Button Component
```javascript
// components/ThemeToggle.jsx
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="p-2 rounded-lg transition-all duration-200
                 bg-gray-100 dark:bg-gray-800
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 border border-gray-200 dark:border-gray-700"
    >
      {theme === 'dark' ? (
        <FiSun className="w-5 h-5 text-yellow-500 transition-transform duration-200 rotate-0 hover:rotate-90" />
      ) : (
        <FiMoon className="w-5 h-5 text-blue-600 transition-transform duration-200 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
```

---

**문서 버전**: 1.1 (Updated)
**작성일**: 2026-06-29  
**수정일**: 2026-06-29 (모델 업데이트 및 다크 모드 강화)
**작성자**: Product Team
