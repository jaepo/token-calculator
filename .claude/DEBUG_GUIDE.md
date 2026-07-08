# 🔍 디버깅 가이드

이 프로젝트에는 강력한 디버깅 도구가 포함되어 있습니다.

## 🤖 디버깅 에이전트

전문 디버깅 에이전트를 사용하여 복잡한 버그를 조사하고 수정할 수 있습니다.

### 사용 방법

```bash
# Claude Code에서
/Agent debugger "버그 설명 또는 에러 메시지"
```

### 예시

```bash
# 예시 1: API 에러 디버깅
/Agent debugger "POST /api/signup이 500 에러를 반환합니다"

# 예시 2: React 렌더링 이슈
/Agent debugger "컴포넌트가 무한 리렌더링됩니다"

# 예시 3: 빌드 실패
/Agent debugger "npm run build 실패 - TypeError at line 42"

# 예시 4: 테스트 실패
/Agent debugger "토큰 계산 테스트가 실패합니다"
```

### 에이전트 기능

- ✅ **에러 분석**: 스택 트레이스 및 에러 메시지 해석
- ✅ **근본 원인 파악**: 증상이 아닌 원인 찾기
- ✅ **체계적 조사**: 재현 → 격리 → 분석 → 수정
- ✅ **수정 검증**: 테스트 케이스 생성 및 검증
- ✅ **상세 리포트**: 문제, 원인, 수정사항 문서화

## ⚡ 빠른 디버그 스킬

간단한 문제 해결을 위한 스킬과 스크립트입니다.

### 디버그 스크립트 사용

```bash
# 전체 진단 실행
./.claude/skills/debug.sh all

# 특정 진단만 실행
./.claude/skills/debug.sh env        # 환경 체크
./.claude/skills/debug.sh deps       # 의존성 체크  
./.claude/skills/debug.sh types      # TypeScript 체크
./.claude/skills/debug.sh test       # 테스트 실행
./.claude/skills/debug.sh logs       # 로그 확인
./.claude/skills/debug.sh processes  # 실행 중인 프로세스
./.claude/skills/debug.sh network    # 네트워크 진단
./.claude/skills/debug.sh fixes      # 빠른 수정 제안
```

### 출력 예시

```
╔══════════════════════════════════════╗
║      🔍 Debug Diagnostic Tool        ║
╚══════════════════════════════════════╝

═══════════════════════════════════════
Environment Check
═══════════════════════════════════════

Node.js version: v22.17.0
npm version: 10.9.2
✓ Found package.json
Project: ai-token-counter
Version: 1.0.0

═══════════════════════════════════════
Dependencies Check
═══════════════════════════════════════

✓ node_modules exists
✓ All packages up to date
found 0 vulnerabilities
```

## 🛠️ 일반적인 문제 해결

### 문제 1: 서버가 시작되지 않음

```bash
# 진단
./.claude/skills/debug.sh processes

# 포트 확인
lsof -i :5173

# 포트가 사용 중이면 프로세스 종료
kill -9 $(lsof -t -i:5173)

# 서버 재시작
npm run dev
```

### 문제 2: 모듈을 찾을 수 없음

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 정리
npm cache clean --force
```

### 문제 3: TypeScript 에러

```bash
# TypeScript 체크
./.claude/skills/debug.sh types

# 또는 직접
npx tsc --noEmit
```

### 문제 4: 빌드 실패

```bash
# 빌드 캐시 정리
rm -rf dist

# 재빌드
npm run build
```

### 문제 5: 테스트 실패

```bash
# 테스트 실행 및 진단
./.claude/skills/debug.sh test

# 특정 테스트만 실행
npm test -- token-calculator.spec.js
```

## 📝 디버깅 체크리스트

버그를 발견했을 때 이 체크리스트를 따르세요:

### 1단계: 정보 수집
- [ ] 에러 메시지 복사
- [ ] 재현 단계 기록
- [ ] 예상 동작 vs 실제 동작 확인
- [ ] 환경 정보 수집 (`./.claude/skills/debug.sh env`)

### 2단계: 격리
- [ ] 최소 재현 케이스 만들기
- [ ] 관련 없는 코드 제거
- [ ] 입력/출력 확인

### 3단계: 분석
- [ ] 로그 추가 (console.log, console.trace)
- [ ] 변수 상태 확인
- [ ] 실행 흐름 추적

### 4단계: 수정
- [ ] 근본 원인 파악
- [ ] 최소한의 수정 적용
- [ ] 에러 처리 추가 (필요시)

### 5단계: 검증
- [ ] 원래 문제 해결 확인
- [ ] 엣지 케이스 테스트
- [ ] 회귀 테스트 (다른 기능 영향 확인)
- [ ] 테스트 케이스 추가

## 🔬 디버깅 기법

### Console Logging

```javascript
// 기본 로그
console.log('🔍 Debug:', { variable, state });

// 호출 스택 추적
console.trace('Execution path');

// 테이블 형식
console.table(arrayData);

// 그룹화
console.group('API Call');
console.log('Request:', request);
console.log('Response:', response);
console.groupEnd();
```

### React DevTools

```javascript
// useEffect 디버깅
useEffect(() => {
  console.log('🔍 Effect triggered', { dependencies });
  return () => console.log('🔍 Effect cleanup');
}, [dependencies]);

// State 디버깅
const [state, setState] = useState(initialState);
console.log('🔍 State updated:', state);
```

### Network 디버깅

```bash
# curl로 API 테스트
curl -X POST http://localhost:3000/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"data": "value"}' \
  -v

# jq로 JSON 파싱
curl http://localhost:3000/api/endpoint | jq .
```

## 🆘 도움 받기

### 에이전트 사용이 적합한 경우

- 복잡한 버그 (여러 파일/모듈 관련)
- 근본 원인 파악이 어려운 경우
- 체계적인 조사가 필요한 경우
- 상세한 문서화가 필요한 경우

```bash
/Agent debugger "상세한 문제 설명"
```

### 빠른 스크립트가 적합한 경우

- 환경 문제
- 의존성 문제
- 간단한 설정 오류
- 일반적인 문제

```bash
./.claude/skills/debug.sh all
```

## 📚 추가 리소스

### 로그 파일 위치

- 애플리케이션 로그: `*.log`
- npm 디버그 로그: `npm-debug.log`
- 빌드 로그: `dist/` 또는 `.next/`

### 유용한 명령어

```bash
# 실행 중인 Node 프로세스
ps aux | grep node

# 포트 사용 확인
lsof -i -P | grep LISTEN

# 패키지 버전 확인
npm list --depth=0

# Git 상태
git status

# 최근 커밋
git log --oneline -5

# 변경 사항 확인
git diff
```

## 🎯 프로젝트별 팁

### Token Calculator 프로젝트

이 프로젝트는 React + Vite를 사용합니다:

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# E2E 테스트
npm run test:e2e
```

### 일반적인 이슈

1. **토크나이저 에러**: `@anthropic-ai/tokenizer` WASM 로딩 실패
   - 해결: Vite 설정 확인, fallback 구현 확인

2. **모델 선택 버그**: 드롭다운이 작동하지 않음
   - 해결: `localStorage` 확인, 기본값 확인

3. **가격 계산 오류**: 잘못된 비용 표시
   - 해결: `constants.js`의 가격 정보 확인

---

**Happy Debugging! 🐛🔨**

문제가 해결되지 않으면 디버깅 에이전트를 사용하세요:
```bash
/Agent debugger "여기에 문제 설명"
```
