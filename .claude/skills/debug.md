---
name: debug
description: Quick debugging skill for finding and fixing bugs in the current codebase
triggers:
  - "debug"
  - "fix bug"
  - "error"
  - "not working"
  - "broken"
---

# Debug Skill

Quick debugging workflow for common issues.

## Usage

Invoke when you encounter:
- Runtime errors or exceptions
- Unexpected behavior or output
- Test failures
- API errors
- Build/compilation errors

## Quick Debug Steps

### 1. Identify the Error

First, gather error information:

```bash
# Check recent logs
tail -n 50 *.log

# For Node.js apps
npm run dev 2>&1 | tee debug.log

# Check test output
npm test -- --verbose
```

### 2. Common Issue Checklist

#### JavaScript/TypeScript
- [ ] Check for typos in variable/function names
- [ ] Verify imports are correct
- [ ] Check for missing await on async functions
- [ ] Verify object/array keys exist before access
- [ ] Check for type mismatches

#### React
- [ ] Check useEffect dependencies
- [ ] Verify state updates are immutable
- [ ] Check for missing keys in lists
- [ ] Verify props are being passed correctly
- [ ] Check component lifecycle issues

#### API/Backend
- [ ] Verify environment variables are set
- [ ] Check database connection
- [ ] Verify request payload format
- [ ] Check CORS configuration
- [ ] Verify authentication tokens

#### Build Issues
- [ ] Run `npm install` / `npm ci`
- [ ] Clear cache: `rm -rf node_modules && npm install`
- [ ] Check Node.js version compatibility
- [ ] Verify all dependencies are installed

### 3. Add Debug Logging

```javascript
// Add strategic console.logs
console.log('🔍 Debug - Input:', input);
console.log('🔍 Debug - State:', state);
console.log('🔍 Debug - Result:', result);

// Use console.trace for call stack
console.trace('Execution path');

// Use console.table for arrays/objects
console.table(data);
```

### 4. Isolation Testing

Create minimal reproduction:

```javascript
// Test function in isolation
async function testIsolated() {
  const input = { /* test data */ };
  const result = await problematicFunction(input);
  console.log('Result:', result);
}

testIsolated();
```

### 5. Common Fixes

#### Null/Undefined Errors
```javascript
// Before
const value = obj.property.nested;

// After - Optional chaining
const value = obj?.property?.nested;

// After - With default
const value = obj?.property?.nested ?? 'default';
```

#### Async Errors
```javascript
// Before
function getData() {
  fetch('/api').then(res => res.json());
}

// After
async function getData() {
  try {
    const res = await fetch('/api');
    return await res.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

#### React Re-render Issues
```javascript
// Before - Creates new function on every render
<Child onClick={() => handleClick(id)} />

// After - Memoized
const handleClickMemo = useCallback(() => handleClick(id), [id]);
<Child onClick={handleClickMemo} />
```

#### State Update Issues
```javascript
// Before - Mutating state
items.push(newItem);
setItems(items);

// After - Immutable update
setItems([...items, newItem]);
```

## Error Message Decoder

### Common Error Patterns

| Error | Common Cause | Solution |
|-------|-------------|----------|
| `undefined is not a function` | Method doesn't exist | Check spelling, imports |
| `Cannot read property 'x' of undefined` | Object is undefined | Add null check |
| `Maximum update depth exceeded` | State update in render | Move to useEffect |
| `CORS error` | Missing headers | Configure server CORS |
| `ECONNREFUSED` | Server not running | Start the server |
| `MODULE_NOT_FOUND` | Missing dependency | `npm install` |
| `Port already in use` | Port occupied | Kill process or use different port |

## Quick Commands

```bash
# Find error in logs
grep -r "Error" logs/

# Check what's running on a port
lsof -i :3000

# Kill process on port
kill -9 $(lsof -t -i:3000)

# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json && npm install

# Run with verbose logging
DEBUG=* npm run dev

# Check TypeScript errors
npx tsc --noEmit

# Run specific test
npm test -- --grep "test name"
```

## Debugging Workflow Script

Save as `debug.sh`:

```bash
#!/bin/bash

echo "🔍 Starting Debug Session..."
echo ""

echo "1️⃣ Environment Check"
node --version
npm --version
echo ""

echo "2️⃣ Running Linter"
npm run lint 2>&1 | head -20
echo ""

echo "3️⃣ TypeScript Check"
npx tsc --noEmit 2>&1 | head -20
echo ""

echo "4️⃣ Running Tests"
npm test 2>&1 | head -30
echo ""

echo "✅ Debug session complete"
```

## When to Use Debugger Agent

For complex issues, spawn the debugger agent:

```
/Agent debugger "Investigate why API returns 500 error on user creation"
```

The debugger agent provides:
- Deeper root cause analysis
- Systematic bug isolation
- Comprehensive fix verification
- Detailed debugging reports

## Prevention Tips

After fixing a bug:

1. **Add a test** - Prevent regression
2. **Add error handling** - Graceful degradation
3. **Document edge cases** - Help future developers
4. **Review similar code** - Fix related issues

## Example Debug Session

```typescript
// 1. Identify the problem
console.log('🔍 Debugging signup API');

// 2. Add logging
export async function POST(request: NextRequest) {
  console.log('📥 Request received');
  
  const body = await request.json();
  console.log('📋 Body:', body);
  
  const validation = schema.safeParse(body);
  console.log('✅ Validation:', validation);
  
  // ... rest of code
}

// 3. Test with curl
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}' \
  -v

// 4. Check server logs for the console.log output

// 5. Fix the issue

// 6. Remove debug logs (or keep strategic ones)

// 7. Add test to prevent regression
```

---

Remember: **Reproduce → Isolate → Fix → Verify → Test**
