# E2E 테스트 가이드

이 프로젝트는 Playwright를 사용한 End-to-End 테스트를 포함하고 있습니다.

## 테스트 실행 방법

### 1. 기본 테스트 실행 (headless 모드)

```bash
npm run test:e2e
```

### 2. UI 모드로 테스트 실행 (추천)

```bash
npm run test:e2e:ui
```

UI 모드에서는 각 테스트를 시각적으로 확인하고 디버깅할 수 있습니다.

### 3. Headed 모드로 테스트 실행 (브라우저 창 보기)

```bash
npm run test:e2e:headed
```

### 4. 테스트 리포트 보기

```bash
npm run test:e2e:report
```

## 테스트 시나리오

### 1. 메인 화면 로드 테스트
- 헤더가 정상적으로 표시되는지 확인
- 주요 UI 컴포넌트들이 보이는지 확인
- 모델 선택기가 작동하는지 확인

### 2. 토큰 계산 기능 테스트
- 텍스트 입력시 토큰 카운트가 업데이트되는지 확인
- 문자 수가 정확히 표시되는지 확인
- 긴 텍스트에 대한 토큰 계산이 정확한지 확인

### 3. 사용자 인터랙션 테스트
- 복사 기능이 작동하는지 확인
- 클리어 기능이 작동하는지 확인
- 샘플 텍스트 버튼이 작동하는지 확인

### 4. 모델 전환 테스트
- 모델 선택이 정상적으로 작동하는지 확인
- 모델별 토큰 카운트 차이가 있는지 확인

### 5. 비용 계산기 테스트
- 출력 토큰 예상값 조정이 작동하는지 확인
- 비용 정보가 표시되는지 확인

### 6. 데이터 영속성 테스트
- 로컬 스토리지에 설정이 저장되는지 확인
- 페이지 새로고침 후에도 설정이 유지되는지 확인

### 7. 다크모드 테스트
- 다크모드 토글이 작동하는지 확인
- 테마 변경이 정상적으로 적용되는지 확인

## 테스트 파일 구조

```
e2e/
├── token-calculator.spec.js  # 메인 E2E 테스트 파일
└── README.md                  # 이 파일
```

## 테스트 작성 가이드

새로운 테스트를 추가하려면 `e2e/token-calculator.spec.js` 파일에 다음과 같이 추가하세요:

```javascript
test('테스트 설명', async ({ page }) => {
  // 테스트 코드 작성
  await page.goto('/');
  // ... 테스트 로직
});
```

## Playwright 브라우저 설치

처음 Playwright를 사용하는 경우, 브라우저를 설치해야 합니다:

```bash
npx playwright install
```

## CI/CD 통합

이 테스트는 GitHub Actions나 다른 CI/CD 파이프라인에서 실행할 수 있습니다:

```bash
CI=true npm run test:e2e
```

## 트러블슈팅

### 테스트가 실패하는 경우

1. **포트 충돌**: 5173 포트가 이미 사용 중인지 확인
2. **브라우저 미설치**: `npx playwright install` 실행
3. **타임아웃**: `playwright.config.js`에서 타임아웃 값 조정

### 디버깅

```bash
# 디버그 모드로 실행
npx playwright test --debug

# 특정 테스트만 실행
npx playwright test -g "메인 화면"
```

## 참고 자료

- [Playwright 공식 문서](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
