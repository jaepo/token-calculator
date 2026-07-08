---
name: generate-tests
description: 새로 작성된 함수나 컴포넌트에 대한 Jest 단위 테스트를 자동으로 생성합니다. export된 모든 함수를 식별하고 성공/에러 케이스를 포함한 포괄적인 테스트를 작성합니다.
---

# Auto Generate Jest Tests

## 목적
개발자가 비즈니스 로직 작성을 마친 직후, 포괄적인 Jest 단위 테스트를 자동으로 생성하여 테스트 커버리지를 높이고 개발 속도를 향상시킵니다.

## 실행 방법

사용자가 `/generate-tests <파일경로>` 를 실행하면:

1. **대상 파일 읽기**: 지정된 파일을 읽어 분석합니다.
2. **함수 식별**: export된 모든 함수와 컴포넌트를 찾습니다.
3. **테스트 생성**: 각 함수/컴포넌트에 대한 테스트 작성
4. **테스트 파일 저장**: `__tests__` 폴더에 저장

## 테스트 생성 규칙

### 1. 파일 구조 분석
```javascript
// 찾아야 할 패턴:
export function functionName()        // named export 함수
export const functionName = ()        // named export 화살표 함수
export default function Component()   // default export
export async function asyncFunc()     // async 함수
export class ClassName                // 클래스
```

### 2. 각 함수별 테스트 케이스

**최소 요구사항:**
- ✅ 성공 케이스: 최소 2개
- ❌ 에러 케이스: 최소 2개
- 🔄 엣지 케이스: 가능하면 추가

**테스트 구조:**
```javascript
describe('functionName', () => {
  // 성공 케이스 1
  it('should [expected behavior] when [condition]', () => {
    // arrange
    // act
    // assert
  });

  // 성공 케이스 2
  it('should [expected behavior] when [different condition]', () => {
    // arrange
    // act
    // assert
  });

  // 에러 케이스 1
  it('should throw/return error when [invalid input]', () => {
    // arrange
    // act
    // assert
  });

  // 에러 케이스 2
  it('should handle [error condition] gracefully', () => {
    // arrange
    // act
    // assert
  });
});
```

### 3. 함수 타입별 테스트 전략

#### 📌 일반 함수
```javascript
// 원본: export function add(a, b) { return a + b; }

// 테스트:
- 정상적인 숫자 입력
- 음수 입력
- null/undefined 입력
- 타입 불일치 입력
```

#### 📌 비동기 함수
```javascript
// 원본: export async function fetchData(url) { ... }

// 테스트:
- 성공적인 데이터 fetch
- 다양한 response 타입
- 네트워크 에러
- timeout 에러
- 잘못된 URL
```

#### 📌 React 컴포넌트
```javascript
// 원본: export default function Button({ onClick, label }) { ... }

// 테스트:
- 정상 렌더링 확인
- props 전달 확인
- 클릭 이벤트 동작
- props 누락 시 동작
- 조건부 렌더링
```

#### 📌 상태 관리 함수
```javascript
// 원본: export function updateState(state, action) { ... }

// 테스트:
- 각 액션 타입별 상태 변경
- 초기 상태 처리
- 잘못된 액션 타입
- immutability 확인
```

### 4. 테스트 파일 위치 규칙

```
원본 파일 위치별 테스트 파일 생성:

src/utils/tokenCounter.js
  → src/utils/__tests__/tokenCounter.test.js

src/components/Button.tsx
  → src/components/__tests__/Button.test.tsx

lib/helpers.js
  → lib/__tests__/helpers.test.js
```

**디렉토리 생성:**
- `__tests__` 폴더가 없으면 자동 생성
- 테스트 파일명: `[원본파일명].test.[확장자]`

### 5. 테스트 파일 템플릿

```javascript
import { functionName1, functionName2 } from '../파일명';

// Mock 설정 (필요한 경우)
jest.mock('../의존성모듈');

describe('파일명', () => {
  describe('functionName1', () => {
    // 성공 케이스
    it('should return correct result with valid input', () => {
      const result = functionName1(validInput);
      expect(result).toBe(expectedOutput);
    });

    it('should handle edge case correctly', () => {
      const result = functionName1(edgeCase);
      expect(result).toEqual(expectedResult);
    });

    // 에러 케이스
    it('should throw error when input is invalid', () => {
      expect(() => functionName1(invalidInput)).toThrow();
    });

    it('should return default value when input is null', () => {
      const result = functionName1(null);
      expect(result).toBe(defaultValue);
    });
  });

  describe('functionName2', () => {
    // ... 동일한 패턴 반복
  });
});
```

### 6. React 컴포넌트 테스트 템플릿

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  // 성공 케이스
  it('should render correctly with props', () => {
    render(<ComponentName prop1="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 에러 케이스
  it('should render fallback when prop is missing', () => {
    render(<ComponentName />);
    expect(screen.getByText('default text')).toBeInTheDocument();
  });

  it('should not crash with invalid props', () => {
    expect(() => render(<ComponentName prop1={null} />)).not.toThrow();
  });
});
```

### 7. 실행 절차

1. **파일 분석**
   ```bash
   Read 원본 파일
   → export 문 추출
   → 함수 시그니처 분석
   → 의존성 파악
   ```

2. **테스트 케이스 설계**
   - 함수 로직 이해
   - 입력/출력 타입 파악
   - 가능한 에러 조건 식별
   - 엣지 케이스 도출

3. **테스트 코드 작성**
   - import 문 생성
   - describe 블록 구조화
   - 각 테스트 케이스 작성
   - Mock 필요 여부 판단

4. **파일 저장**
   ```bash
   mkdir -p [원본디렉토리]/__tests__
   Write [테스트파일경로]
   ```

5. **테스트 실행 (옵션)**
   ```bash
   npm test [테스트파일]
   ```

## 출력 형식

테스트 생성 완료 후 다음 정보를 제공:

```markdown
✅ Jest 테스트 생성 완료!

📁 원본 파일: src/utils/tokenCounter.js
📝 테스트 파일: src/utils/__tests__/tokenCounter.test.js

🔍 생성된 테스트:
  ├─ countTokens (4 tests)
  │  ├─ ✓ GPT-5 모델 토큰 카운트
  │  ├─ ✓ Claude 모델 토큰 카운트
  │  ├─ ✗ 빈 텍스트 처리
  │  └─ ✗ 지원하지 않는 모델 처리
  │
  └─ calculateCost (4 tests)
     ├─ ✓ 정상 비용 계산
     ├─ ✓ 소수점 처리
     ├─ ✗ 음수 토큰 처리
     └─ ✗ null 입력 처리

📊 총 8개 테스트 케이스 생성

💡 다음 단계:
  npm test src/utils/__tests__/tokenCounter.test.js
```

## 주의사항

### ⚠️ 자동 생성의 한계
- 비즈니스 로직의 세부 요구사항은 개발자가 검토 필요
- Mock 데이터는 실제 사용 케이스에 맞게 조정 필요
- 복잡한 의존성은 수동으로 Mock 설정 필요

### ✅ 모범 사례
- **AAA 패턴**: Arrange, Act, Assert 구조 유지
- **명확한 테스트명**: "should ... when ..." 형식 사용
- **독립성**: 각 테스트는 독립적으로 실행 가능해야 함
- **의미있는 assertion**: toEqual, toBe, toThrow 등 적절히 사용

### 🔧 커스터마이징 필요한 경우
- API 호출이 있는 함수 (fetch mock 필요)
- 데이터베이스 연동 함수 (DB mock 필요)
- 시간 의존적 함수 (jest.useFakeTimers 필요)
- 파일 시스템 접근 (fs mock 필요)

## 예시

### 입력
```bash
/generate-tests src/utils/tokenCounter.js
```

### 출력 (생성된 테스트 파일)
```javascript
import { countTokens } from '../tokenCounter';

describe('tokenCounter', () => {
  describe('countTokens', () => {
    it('should count tokens correctly for GPT-5 with Korean text', async () => {
      const result = await countTokens('안녕하세요', 'gpt-5');
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    it('should count tokens correctly for mixed language text', async () => {
      const result = await countTokens('Hello 안녕 123', 'gpt-5');
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for empty text', async () => {
      const result = await countTokens('', 'gpt-5');
      expect(result).toBe(0);
    });

    it('should return 0 for unsupported model', async () => {
      const result = await countTokens('test', 'unknown-model');
      expect(result).toBe(0);
    });

    it('should handle null input gracefully', async () => {
      const result = await countTokens(null, 'gpt-5');
      expect(result).toBe(0);
    });
  });
});
```

---

**사용 예시:**
- `/generate-tests src/components/TokenCalculator.tsx`
- `/generate-tests lib/utils/helper.js`
- `/generate-tests` (현재 열려있는 파일에 대해 실행)
