# 🎯 AI Token Counter

실시간 프롬프트 토큰 계산 및 API 비용 예측 웹 애플리케이션

## ✨ 주요 기능

- **실시간 토큰 계산**: 타이핑과 동시에 토큰 수를 즉시 계산
- **다중 모델 지원**: 7개 최신 모델 (OpenAI, Anthropic, Google, DeepSeek)
- **언어별 분석**: 한글/영문 토큰 수 및 비율 분석
- **비용 예측**: 실시간 API 비용 계산 (USD, KRW)
- **다크 모드**: 눈에 편한 다크/라이트 테마 지원
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 http://localhost:5173 에서 실행됩니다.

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 🧪 테스트

### E2E 테스트 실행

```bash
# 기본 테스트 (headless)
npm run test:e2e

# UI 모드로 테스트 (추천)
npm run test:e2e:ui

# 브라우저 창을 보면서 테스트
npm run test:e2e:headed

# 테스트 리포트 보기
npm run test:e2e:report
```

### 테스트 범위

본 프로젝트는 Playwright를 사용한 포괄적인 E2E 테스트를 포함합니다:

- ✅ 메인 화면 로드 및 UI 컴포넌트 확인
- ✅ 실시간 토큰 계산 기능
- ✅ 텍스트 복사/삭제 기능
- ✅ 샘플 텍스트 로드
- ✅ 모델 선택 및 전환
- ✅ 출력 토큰 조정
- ✅ 비용 계산기 표시
- ✅ 다크모드 토글
- ✅ 긴 텍스트 처리
- ✅ 모델별 토큰 카운트 차이
- ✅ 로컬 스토리지 데이터 영속성
- ✅ 페이지 새로고침 후 설정 유지

**총 12개 테스트, 모두 통과 ✨**

자세한 내용은 [e2e/README.md](e2e/README.md)를 참조하세요.

## 🛠️ 기술 스택

- **React 18** - UI 프레임워크
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **tiktoken** - GPT 토큰화
- **@anthropic-ai/tokenizer** - Claude 토큰화
- **react-icons** - 아이콘
- **Playwright** - E2E 테스팅

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Header.jsx
│   ├── ModelSelector.jsx
│   ├── TextInput.jsx
│   ├── ActionButtons.jsx
│   ├── TokenStats.jsx
│   ├── StatCard.jsx
│   ├── ProgressBar.jsx
│   ├── CostCalculator.jsx
│   └── OutputSlider.jsx
├── contexts/           # React Context
│   └── ThemeContext.jsx
├── hooks/             # 커스텀 훅
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   └── useTokenCount.js
├── utils/            # 유틸리티 함수
│   ├── constants.js
│   ├── tokenCounter.js
│   ├── languageDetector.js
│   └── costCalculator.js
├── App.jsx          # 메인 앱
└── main.jsx         # 진입점
```

## 💡 사용 방법

1. **모델 선택**: 상단 드롭다운에서 AI 모델 선택 (7개 모델 지원)
2. **텍스트 입력**: 프롬프트를 입력 영역에 작성
3. **토큰 확인**: 실시간으로 토큰 수와 언어별 분석 확인
4. **비용 계산**: 예상 출력 토큰 수를 조정하여 총 비용 예측
5. **샘플 사용**: Sample 버튼으로 예제 텍스트 로드
6. **가격 비교**: 같은 프롬프트로 모델 간 비용 차이 확인

## 🎨 테마

- **다크 모드** (기본): 눈에 편한 어두운 테마
- **라이트 모드**: 밝은 테마

우측 상단 테마 토글 버튼으로 전환 가능. 사용자 선택은 자동으로 저장됩니다.

## 📊 지원 모델 (2026년 7월 기준)

### OpenAI
- **GPT-4.1**: Input $0.002/1K | Output $0.008/1K | Context: 200K tokens

### Anthropic
- **Claude Opus 4.8**: Input $0.005/1K | Output $0.025/1K | Context: 200K tokens
- **Claude Sonnet 4.5**: Input $0.003/1K | Output $0.015/1K | Context: 200K tokens
- **Claude Haiku 4.5**: Input $0.001/1K | Output $0.005/1K | Context: 200K tokens

### Google
- **Gemini 3.5 Flash**: Input $0.0015/1K | Output $0.009/1K | Context: 1M tokens
- **Gemini 3.0 Pro**: Input $0.001/1K | Output $0.003/1K | Context: 2M tokens

### DeepSeek
- **DeepSeek V4 Flash**: Input $0.00014/1K | Output $0.00028/1K | Context: 1M tokens
  - 💡 가장 저렴한 모델! 캐시 히트 시 98% 할인

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Built with ❤️ by AI Token Counter Team
