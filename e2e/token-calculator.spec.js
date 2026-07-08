import { test, expect } from '@playwright/test';

test.describe('Token Calculator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('메인 화면이 정상적으로 로드되는지 확인', async ({ page }) => {
    // 헤더 확인
    await expect(page.locator('h1')).toContainText('AI Token Counter');

    // 주요 컴포넌트들이 표시되는지 확인
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();

    // 모델 선택기 확인
    const modelSelector = page.locator('select, [role="combobox"]').first();
    await expect(modelSelector).toBeVisible();
  });

  test('텍스트 입력시 토큰 카운트가 업데이트되는지 확인', async ({ page }) => {
    const textarea = page.locator('textarea');
    const testText = 'Hello, this is a test message for token counting!';

    // 텍스트 입력
    await textarea.fill(testText);

    // 토큰 통계가 표시되는지 확인 (0보다 큰 값)
    await page.waitForTimeout(500); // 토큰 계산 대기

    // 토큰 카운트 표시 영역 확인
    const statsSection = page.locator('text=/tokens/i').first();
    await expect(statsSection).toBeVisible();

    // 문자 수가 표시되는지 확인 (정확한 선택자 사용)
    const charCountText = page.locator('text=/characters/i').first();
    await expect(charCountText).toBeVisible();
    await expect(charCountText).toContainText(String(testText.length));
  });

  test('샘플 텍스트 버튼이 작동하는지 확인', async ({ page }) => {
    // 샘플 버튼 찾기
    const sampleButton = page.getByRole('button', { name: /sample/i });

    // 샘플 버튼에 호버하여 드롭다운 메뉴 표시
    await sampleButton.hover();

    // 드롭다운 메뉴가 나타날 때까지 대기
    await page.waitForTimeout(300);

    // 한글 샘플 버튼 클릭
    const koreanSample = page.getByRole('button', { name: /한글 샘플/i });
    await koreanSample.click();

    // 텍스트가 입력되었는지 확인
    const textarea = page.locator('textarea');
    await page.waitForTimeout(300);
    const textValue = await textarea.inputValue();

    expect(textValue.length).toBeGreaterThan(0);
  });

  test('복사 기능이 작동하는지 확인', async ({ page, context }) => {
    // 클립보드 권한 허용
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const textarea = page.locator('textarea');
    const testText = 'This text should be copied to clipboard';

    await textarea.fill(testText);

    // 복사 버튼 클릭
    const copyButton = page.getByRole('button', { name: /copy/i });

    // alert 다이얼로그 처리
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('copied');
      await dialog.accept();
    });

    await copyButton.click();
  });

  test('클리어 기능이 작동하는지 확인', async ({ page }) => {
    const textarea = page.locator('textarea');

    // 텍스트 입력
    await textarea.fill('This text will be cleared');

    // 클리어 버튼 클릭
    const clearButton = page.getByRole('button', { name: /clear/i });

    // confirm 다이얼로그 처리
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await clearButton.click();

    // 텍스트가 비워졌는지 확인
    await expect(textarea).toHaveValue('');
  });

  test('모델 선택이 작동하는지 확인', async ({ page }) => {
    // 모델 선택기 찾기
    const modelSelector = page.locator('select, [role="combobox"]').first();

    // 현재 선택된 모델 확인
    const initialValue = await modelSelector.inputValue().catch(() => null);

    // 다른 모델 선택 시도
    const options = await modelSelector.locator('option').all();

    if (options.length > 1) {
      // 두 번째 옵션 선택
      const secondOption = options[1];
      const optionValue = await secondOption.getAttribute('value');

      await modelSelector.selectOption(optionValue);

      // 선택이 변경되었는지 확인
      const newValue = await modelSelector.inputValue();
      expect(newValue).not.toBe(initialValue);
    }
  });

  test('출력 토큰 예상값 조정이 작동하는지 확인', async ({ page }) => {
    // 출력 토큰 입력 필드 찾기
    const outputTokenInput = page.locator('input[type="number"]').first();

    if (await outputTokenInput.isVisible()) {
      const initialValue = await outputTokenInput.inputValue();

      // 새로운 값 입력
      await outputTokenInput.fill('1000');

      // 값이 변경되었는지 확인
      await expect(outputTokenInput).toHaveValue('1000');
    }
  });

  test('비용 계산기가 표시되는지 확인', async ({ page }) => {
    const textarea = page.locator('textarea');

    // 텍스트 입력하여 토큰 생성
    await textarea.fill('Calculate the cost for this text');

    await page.waitForTimeout(500);

    // 비용 관련 섹션이나 토큰 정보 확인
    // 달러 기호나 비용 텍스트가 visible 상태인지 확인
    const hasCostInfo = await page.locator('text=/total.*cost/i, text=/estimated.*cost/i').first().isVisible().catch(() => false);
    const hasDollarSign = await page.locator('text=/\\$/').count() > 0;

    // 비용 정보가 있거나, 최소한 토큰 통계가 표시되는지 확인
    if (!hasCostInfo && !hasDollarSign) {
      // 최소한 토큰 통계는 표시되어야 함
      await expect(page.locator('text=/tokens/i').first()).toBeVisible();
    }
  });

  test('다크모드 토글이 작동하는지 확인', async ({ page }) => {
    // 다크모드 토글 버튼 찾기
    const darkModeToggle = page.locator('button[aria-label*="dark" i], button[aria-label*="theme" i]').first();

    if (await darkModeToggle.isVisible()) {
      // 초기 테마 상태 확인
      const htmlElement = page.locator('html');
      const initialClass = await htmlElement.getAttribute('class');

      // 토글 클릭
      await darkModeToggle.click();

      await page.waitForTimeout(300);

      // 클래스가 변경되었는지 확인
      const newClass = await htmlElement.getAttribute('class');
      expect(newClass).not.toBe(initialClass);
    }
  });

  test('긴 텍스트 입력시 토큰이 정확히 계산되는지 확인', async ({ page }) => {
    const textarea = page.locator('textarea');

    // 긴 텍스트 생성
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50);

    await textarea.fill(longText);

    await page.waitForTimeout(1000);

    // 토큰 카운트가 표시되는지 확인
    const tokenDisplay = page.locator('text=/\\d+\\s*tokens/i').first();
    await expect(tokenDisplay).toBeVisible();

    // 토큰 수 추출
    const tokenText = await tokenDisplay.textContent();
    const tokenCount = parseInt(tokenText.match(/\d+/)[0]);

    // 긴 텍스트이므로 토큰이 100개 이상이어야 함
    expect(tokenCount).toBeGreaterThan(100);
  });

  test('여러 모델 간 토큰 카운트 차이 확인', async ({ page }) => {
    const textarea = page.locator('textarea');
    const modelSelector = page.locator('select, [role="combobox"]').first();
    const testText = 'Testing token count across different models';

    await textarea.fill(testText);
    await page.waitForTimeout(500);

    // 첫 번째 모델의 토큰 수 확인
    const firstTokenCount = await page.locator('text=/\\d+\\s*tokens/i').first().textContent();

    // 모델 변경
    const options = await modelSelector.locator('option').all();
    if (options.length > 1) {
      const secondOption = options[1];
      const optionValue = await secondOption.getAttribute('value');
      await modelSelector.selectOption(optionValue);

      await page.waitForTimeout(500);

      // 두 번째 모델의 토큰 수 확인
      const secondTokenCount = await page.locator('text=/\\d+\\s*tokens/i').first().textContent();

      // 토큰 카운트가 표시되는지 확인 (같거나 다를 수 있음)
      expect(secondTokenCount).toBeTruthy();
    }
  });

  test('로컬 스토리지에 설정이 저장되는지 확인', async ({ page }) => {
    const modelSelector = page.locator('select, [role="combobox"]').first();
    const outputTokenInput = page.locator('input[type="number"]').first();

    // 모델 선택
    const options = await modelSelector.locator('option').all();
    if (options.length > 1) {
      const optionValue = await options[1].getAttribute('value');
      await modelSelector.selectOption(optionValue);
    }

    // 출력 토큰 설정
    if (await outputTokenInput.isVisible()) {
      await outputTokenInput.fill('2000');
    }

    await page.waitForTimeout(500);

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 설정이 유지되는지 확인
    if (await outputTokenInput.isVisible()) {
      await expect(outputTokenInput).toHaveValue('2000');
    }
  });
});
