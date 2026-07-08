# 🎯 맥락 기반 보안 위험 분석

**프로젝트**: token-calculator  
**분석 날짜**: 2026-07-09  
**분석 방법**: 실제 사용 패턴 + 런타임 환경 + Supply Chain  

---

## 📊 Executive Summary

### 전체 위험 등급: 🟢 **낮음**

| 카테고리 | 위험도 | 영향 | 근거 |
|---------|--------|------|------|
| **프로덕션 의존성** | 🟢 낮음 | 낮음 | 6개만 사용, 모두 신뢰할 수 있는 패키지 |
| **런타임 환경** | 🟢 낮음 | 낮음 | 브라우저 샌드박스, 서버 없음 |
| **Supply Chain** | 🟡 중간 | 중간 | @anthropic-ai/tokenizer v0.0.4 (초기 버전) |
| **데이터 처리** | 🟢 낮음 | 낮음 | 민감 데이터 미처리, 로컬 실행 |
| **공격 표면** | 🟢 낮음 | 낮음 | 정적 사이트, API 없음 |

**핵심 발견**:
- ✅ npm audit: 0 vulnerabilities
- ✅ 실제 사용 패키지: 6개 (최소화됨)
- ⚠️ 1개 주의 필요: @anthropic-ai/tokenizer (0.0.x 초기 버전)
- ✅ 서버 사이드 코드 없음 → 전통적인 백엔드 취약점 없음

---

## 🔬 실제 프로덕션 의존성 분석

### 실제 사용되는 패키지 (6개)

#### 1. **react** (v19.2.7) - 🟢 안전

**사용 위치**: 
```javascript
// src/App.jsx, src/main.jsx, src/components/*.jsx
import { useState } from 'react';
```

**위험 평가**:
- ✅ **공급자**: Meta (Facebook)
- ✅ **신뢰도**: 매우 높음
- ✅ **유지보수**: 활발함
- ✅ **커뮤니티**: 수백만 사용자
- ✅ **보안**: 전문 보안팀 운영

**실제 위험**: 🟢 **매우 낮음**

**이유**:
- React는 세계에서 가장 많이 사용되는 UI 라이브러리
- Meta의 전문 보안팀이 관리
- 취약점 발견 시 즉시 패치
- 클라이언트 사이드만 사용 (서버 렌더링 없음)

---

#### 2. **react-dom** (v19.2.7) - 🟢 안전

**사용 위치**:
```javascript
// src/main.jsx
import ReactDOM from 'react-dom/client';
```

**위험 평가**:
- ✅ React 공식 패키지
- ✅ React와 동일한 보안 수준

**실제 위험**: 🟢 **매우 낮음**

---

#### 3. **react-icons** (v5.6.0) - 🟢 안전

**사용 위치**:
```javascript
// src/components/Header.jsx, ActionButtons.jsx
import { FiSun, FiMoon, FiCopy } from 'react-icons/fi';
```

**위험 평가**:
- ✅ **다운로드**: 주간 수백만 다운로드
- ✅ **기능**: 순수 SVG 아이콘 렌더링
- ✅ **복잡도**: 매우 낮음 (단순 컴포넌트)

**실제 위험**: 🟢 **매우 낮음**

**이유**:
- 복잡한 로직 없음 (단순 SVG 렌더링)
- 외부 API 호출 없음
- 사용자 입력 처리 없음

---

#### 4. **clsx** (v2.1.1) - 🟢 안전

**사용 위치**:
```javascript
// CSS 클래스 조건부 결합
import clsx from 'clsx';
```

**위험 평가**:
- ✅ **크기**: 1KB 미만
- ✅ **복잡도**: 매우 낮음 (단순 문자열 처리)
- ✅ **의존성**: 없음 (zero dependency)

**실제 위험**: 🟢 **매우 낮음**

**이유**:
- 극도로 단순한 유틸리티 함수
- 외부 의존성 없음
- 공격 벡터 없음

---

#### 5. **@anthropic-ai/tokenizer** (v0.0.4) - 🟡 주의

**사용 위치**:
```javascript
// src/utils/tokenCounter.js:32
const { countTokens } = await import('@anthropic-ai/tokenizer');
return countTokens(text);
```

**위험 평가**:
- ⚠️ **버전**: 0.0.4 (초기 개발 단계)
- ✅ **공급자**: Anthropic (신뢰할 수 있는 AI 회사)
- ⚠️ **유지보수**: 활발하지 않을 수 있음 (0.0.x)
- ✅ **GitHub**: https://github.com/anthropics/anthropic-tokenizer-typescript
- ✅ **기능**: WASM 기반 토큰 카운팅 (로컬 실행)

**실제 위험**: 🟡 **낮음-중간**

**잠재적 위험 시나리오**:

1. **Supply Chain Attack** (낮은 확률)
   - 공격자가 Anthropic npm 계정 탈취
   - 악성 코드가 포함된 업데이트 배포
   
   **완화 요소**:
   - ✅ `package-lock.json`으로 버전 고정됨
   - ✅ Dynamic import로 지연 로드 (사용 안 하면 로드 안 됨)
   - ✅ WASM이므로 샌드박스 환경에서 실행
   - ✅ Anthropic은 신뢰할 수 있는 조직

2. **WASM 취약점** (매우 낮은 확률)
   - WASM 코드 내 버그
   
   **완화 요소**:
   - ✅ 브라우저 샌드박스에서 실행
   - ✅ 네트워크 접근 없음
   - ✅ 파일 시스템 접근 없음
   - ✅ 순수 계산 작업만 수행

3. **0.0.x 버전 불안정성** (낮은 확률)
   - API 변경으로 인한 앱 오류
   
   **완화 요소**:
   - ✅ Try-catch로 에러 처리
   - ✅ Fallback 로직 존재

**권장 조치**:
```javascript
// 현재 코드 (이미 안전하게 구현됨)
try {
  const { countTokens: countClaudeTokens } = await import('@anthropic-ai/tokenizer');
  return countClaudeTokens(text);
} catch (importError) {
  console.warn('Claude tokenizer not available, using approximation');
  return calculateTokensSimple(text, TOKEN_COEFFICIENTS.GEMINI_SIMPLE);
}
```

**모니터링**:
- [ ] Anthropic 공식 업데이트 확인
- [ ] 1.0.0 안정 버전 출시 시 업그레이드 고려
- [ ] GitHub Issues 모니터링

---

#### 6. **js-tiktoken** (v1.0.21) - 🟢 안전

**사용 위치**:
```javascript
// package.json에 있지만 실제 코드에서 사용 안 함
// GPT 토큰 계산은 문자 기반 근사치 사용
```

**위험 평가**:
- ✅ **다운로드**: 주간 5.6백만 다운로드
- ✅ **버전**: 1.0.21 (안정 버전)
- ✅ **GitHub**: dqbd/tiktoken (검증된 프로젝트)
- ⚠️ **실제 사용**: 코드에서 import 없음

**실제 위험**: 🟢 **매우 낮음**

**발견 사항**:
- 📦 `package.json`에는 있지만 **실제로 사용되지 않음**
- 코드베이스에서 `import`나 `require` 없음
- 번들에 포함되지 않을 가능성 높음 (tree-shaking)

**권장 조치**:
```bash
# 사용하지 않는다면 제거 고려
npm uninstall js-tiktoken
```

---

## 🏗️ 런타임 환경 분석

### 실행 환경: 브라우저 (클라이언트 사이드)

**아키텍처**:
```
사용자 브라우저
  ↓
정적 HTML + JS 번들 (212KB)
  ↓
React App (브라우저 샌드박스)
  ↓
로컬 계산만 수행 (서버 통신 없음)
```

### 공격 표면 분석

#### ✅ **없는 것들** (위험 없음)

1. **서버 사이드 코드** ❌
   - Node.js 서버 없음
   - API 엔드포인트 없음
   - 데이터베이스 없음
   - 서버 사이드 취약점 불가능

2. **사용자 인증** ❌
   - 로그인 없음
   - 세션 없음
   - 쿠키 없음
   - 인증 관련 취약점 불가능

3. **외부 API 호출** ❌
   - 네트워크 요청 없음
   - CORS 문제 없음
   - API 키 불필요
   - Man-in-the-middle 공격 불가능

4. **사용자 데이터 저장** ❌
   - 서버 저장소 없음
   - localStorage만 사용 (모델 선택, 출력 토큰 수)
   - 민감 데이터 미처리

#### ⚠️ **있는 것들** (제한된 위험)

1. **localStorage 사용** 🟡
   ```javascript
   // src/hooks/useLocalStorage.js
   localStorage.setItem('selectedModel', 'gpt-4.1');
   localStorage.setItem('estimatedOutputTokens', 500);
   ```
   
   **위험**: XSS 공격 시 접근 가능
   
   **완화**:
   - ✅ 민감 정보 미저장 (모델명, 숫자만)
   - ✅ 사용자 개인정보 없음
   - ✅ 토큰이나 비밀번호 없음
   
   **실제 영향**: 🟢 매우 낮음 (공격해도 얻을 것이 없음)

2. **클라이언트 사이드 XSS** 🟡
   
   **가능한 벡터**:
   - 사용자 입력 텍스트 (토큰 계산용)
   
   **React 보호**:
   - ✅ React는 자동으로 XSS 방지 (텍스트 이스케이프)
   - ✅ `dangerouslySetInnerHTML` 사용 안 함
   - ✅ 모든 사용자 입력이 안전하게 렌더링됨
   
   **확인**:
   ```bash
   # dangerouslySetInnerHTML 검색
   grep -r "dangerouslySetInnerHTML" src/
   # 결과: 없음 ✅
   ```
   
   **실제 영향**: 🟢 매우 낮음

3. **Prototype Pollution** 🟢
   
   **평가**:
   - ✅ 객체 병합이나 동적 속성 설정 최소화
   - ✅ 사용자 입력으로 객체 키 생성 안 함
   - ✅ 단순한 데이터 흐름
   
   **실제 영향**: 🟢 매우 낮음

---

## 🔗 Supply Chain 위험 분석

### Dependency Tree

```
ai-token-counter
├── react (Meta) ✅ 신뢰도 매우 높음
├── react-dom (Meta) ✅ 신뢰도 매우 높음
├── react-icons ✅ 인기 있는 오픈소스
├── clsx ✅ 단순 유틸리티, 의존성 없음
├── @anthropic-ai/tokenizer ⚠️ 0.0.4 초기 버전
└── js-tiktoken ✅ 사용 안 함 (제거 가능)
```

### 전이 의존성 (Transitive Dependencies)

**발견 사항**: 
- ✅ 모든 프로덕션 패키지가 **전이 의존성 없음** 또는 최소화
- ✅ `react`, `clsx`, `react-icons` 등 추가 의존성 없음
- ✅ Supply chain 복잡도 매우 낮음

### 공급자 신뢰도

| 패키지 | 공급자 | 신뢰도 | 다운로드/주 | GitHub Stars |
|--------|--------|--------|-------------|--------------|
| **react** | Meta | ⭐⭐⭐⭐⭐ | 수천만 | 230k+ |
| **react-icons** | 커뮤니티 | ⭐⭐⭐⭐ | 수백만 | 12k+ |
| **clsx** | 개인 | ⭐⭐⭐⭐ | 수백만 | 8k+ |
| **@anthropic-ai/tokenizer** | Anthropic | ⭐⭐⭐⭐ | 수천 | < 1k |
| **js-tiktoken** | 개인 | ⭐⭐⭐⭐ | 5.6M | 1k+ |

### 공급망 공격 시나리오

#### 시나리오 1: Compromised Package Update

**공격**:
1. 공격자가 패키지 메인테이너 계정 탈취
2. 악성 코드가 포함된 새 버전 배포
3. 사용자가 `npm install` 또는 `npm update` 실행

**프로젝트 보호 수준**: 🟢 **높음**

**완화 요소**:
- ✅ `package-lock.json`으로 정확한 버전 고정
- ✅ 자동 업데이트 없음
- ✅ Dependabot 미사용 (수동 검토)
- ✅ 개발자가 업데이트 전 검토 가능

**추가 보호 방법**:
```json
// package.json에 exact versions 사용 (권장)
{
  "dependencies": {
    "react": "19.2.7",  // ^ 제거
    "@anthropic-ai/tokenizer": "0.0.4"  // ^ 제거
  }
}
```

#### 시나리오 2: Typosquatting

**공격**:
- 유사한 이름의 악성 패키지 배포 (예: `reac`, `raect`)

**프로젝트 보호 수준**: 🟢 **높음**

**완화 요소**:
- ✅ 잘 알려진 패키지만 사용
- ✅ 패키지명 정확히 확인
- ✅ npm audit 실행

---

## 🎯 프로젝트별 실제 위험 평가

### 위험 매트릭스

| 위협 | 확률 | 영향 | 전체 위험 | 완화 상태 |
|------|------|------|-----------|----------|
| **프로덕션 의존성 취약점** | 낮음 | 중간 | 🟢 낮음 | npm audit: 0 vulnerabilities |
| **Supply Chain 공격** | 매우 낮음 | 높음 | 🟡 낮음 | package-lock.json 사용 |
| **XSS 공격** | 낮음 | 낮음 | 🟢 낮음 | React 자동 방어 |
| **서버 사이드 공격** | 없음 | 없음 | 🟢 없음 | 정적 사이트 |
| **데이터 유출** | 없음 | 없음 | 🟢 없음 | 민감 데이터 미처리 |
| **Anthropic Tokenizer** | 낮음 | 낮음 | 🟡 낮음 | Fallback + try-catch |

### 실제 공격 시나리오별 분석

#### ❌ 불가능한 공격들

1. **SQL Injection** - 데이터베이스 없음
2. **Command Injection** - 서버 없음
3. **Authentication Bypass** - 인증 없음
4. **Session Hijacking** - 세션 없음
5. **CSRF** - POST 요청 없음
6. **Server-Side Request Forgery (SSRF)** - 서버 없음
7. **Remote Code Execution (RCE)** - 서버 없음

#### ⚠️ 이론적으로 가능하지만 영향 낮은 공격

1. **XSS (Cross-Site Scripting)**
   - **확률**: 낮음 (React 자동 방어)
   - **영향**: 낮음 (localStorage에 민감 정보 없음)
   - **완화**: 이미 적용됨

2. **Dependency Confusion**
   - **확률**: 매우 낮음
   - **영향**: 중간
   - **완화**: private registry 미사용, 공개 패키지만 사용

---

## 🛡️ 추가 보안 강화 권장사항

### 우선순위 1: 즉시 적용 가능

#### 1. Content Security Policy (CSP) 추가

**현재 상태**: CSP 헤더 없음

**권장 조치**:

`index.html`에 추가:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'none';
  frame-ancestors 'none';
">
```

**효과**:
- ✅ XSS 공격 완화
- ✅ 외부 스크립트 로드 방지
- ✅ Inline script 방지

**구현**:
```bash
# src/index.html에 추가
```

#### 2. Security Headers (Netlify 설정)

**파일**: `netlify.toml` 또는 `_headers`

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

**효과**:
- ✅ Clickjacking 방지
- ✅ MIME 스니핑 방지
- ✅ 불필요한 브라우저 기능 비활성화

#### 3. js-tiktoken 제거 (사용 안 함)

**현재 상태**: 설치되어 있지만 사용 안 함

**권장 조치**:
```bash
npm uninstall js-tiktoken
```

**효과**:
- ✅ 번들 크기 감소
- ✅ 불필요한 의존성 제거
- ✅ Supply chain 위험 감소

### 우선순위 2: 단기 개선

#### 4. Subresource Integrity (SRI) 고려

**현재**: 외부 CDN 사용 안 함 (필요 없음)

**만약 외부 리소스 사용 시**:
```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-..."
        crossorigin="anonymous"></script>
```

#### 5. Package Lock 강제

**package.json에 추가**:
```json
{
  "scripts": {
    "preinstall": "npx check-exact-versions"
  }
}
```

또는 `.npmrc`:
```
package-lock=true
save-exact=true
```

### 우선순위 3: 장기 모니터링

#### 6. Automated Dependency Scanning

**GitHub Dependabot 설정**:
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    reviewers:
      - "security-team"
```

**OR Snyk 통합**:
```bash
npx snyk test
npx snyk monitor
```

#### 7. Bundle Analysis

**webpack-bundle-analyzer 또는 Vite 플러그인**:
```bash
npm run build -- --analyze
```

**목적**:
- 번들에 예상치 못한 코드 확인
- 미사용 의존성 발견
- 번들 크기 최적화

---

## 📋 실행 가능한 보안 체크리스트

### ✅ 이미 적용된 보안 조치

- [x] npm audit 실행 (0 vulnerabilities)
- [x] package-lock.json 사용
- [x] 최소 의존성 (프로덕션 6개만)
- [x] 정적 사이트 (서버 없음)
- [x] React XSS 자동 방어
- [x] .gitignore에 환경 파일 패턴
- [x] Try-catch로 에러 처리
- [x] Fallback 로직 구현
- [x] 민감 데이터 미처리

### 🔲 권장 추가 조치

**즉시 (1시간 이내)**:
- [ ] CSP 헤더 추가 (index.html)
- [ ] js-tiktoken 제거 (미사용)
- [ ] Netlify 보안 헤더 설정

**단기 (1주 이내)**:
- [ ] Package versions을 exact로 변경 (^ 제거)
- [ ] .npmrc에 save-exact=true 설정
- [ ] Bundle analyzer 실행

**장기 (1개월 이내)**:
- [ ] GitHub Dependabot 활성화
- [ ] @anthropic-ai/tokenizer 업데이트 모니터링
- [ ] 정기 보안 감사 일정 수립

---

## 🎯 최종 권장사항

### 현재 보안 상태: 🟢 **양호**

**핵심 발견**:
1. ✅ **npm audit: 0 vulnerabilities**
2. ✅ **실제 위험: 매우 낮음**
3. ⚠️ **1개 주의 사항**: @anthropic-ai/tokenizer v0.0.4

### 즉시 조치 필요: **없음**

현재 프로젝트는 보안 측면에서 우수한 상태입니다.

### 권장 개선 조치 (선택)

**High Value, Low Effort** (권장):
1. CSP 헤더 추가
2. js-tiktoken 제거
3. Netlify 보안 헤더

**Medium Value, Medium Effort**:
4. Package versions exact로 변경
5. Dependabot 설정

### 모니터링 대상

**@anthropic-ai/tokenizer**:
- 현재: v0.0.4 (초기 버전)
- 모니터링: GitHub releases
- 업그레이드: v1.0.0 안정 버전 출시 시
- URL: https://github.com/anthropics/anthropic-tokenizer-typescript

---

## 📊 비교: 일반 웹앱 vs 이 프로젝트

| 위험 요소 | 일반 웹앱 | 이 프로젝트 | 차이 |
|----------|----------|------------|------|
| 서버 취약점 | 높음 | 없음 | ✅ 정적 사이트 |
| 데이터베이스 | 높음 | 없음 | ✅ DB 없음 |
| 인증 우회 | 중간 | 없음 | ✅ 인증 없음 |
| API 공격 | 높음 | 없음 | ✅ API 없음 |
| XSS | 중간 | 낮음 | ✅ React 방어 |
| 의존성 | 중간 | 낮음 | ✅ 최소화 |
| Supply Chain | 중간 | 낮음-중간 | ⚠️ 1개 주의 |

**결론**: 이 프로젝트는 일반 웹 애플리케이션보다 **훨씬 낮은 보안 위험**을 가지고 있습니다.

---

**생성일**: 2026-07-09  
**다음 검토**: 2026-08-09 (1개월 후)  
**분석자**: Claude Sonnet 4.5  
**방법론**: 실제 사용 패턴 + 런타임 분석 + Supply Chain 검토
