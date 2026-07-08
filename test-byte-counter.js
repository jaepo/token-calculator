/**
 * Manual test script to reproduce countBytes bugs
 * Run with: node test-byte-counter.js
 */

// Import the buggy functions
import { countBytes, getByteStats } from './src/utils/byteCounter.js';

console.log('🔍 Testing countBytes with abnormal inputs...\n');

// Test cases - Updated after fix
const tests = [
  { name: 'Normal text', input: 'Hello', shouldFail: false },
  { name: 'Korean text', input: '안녕하세요', shouldFail: false },
  { name: 'Null input', input: null, shouldFail: false }, // FIXED: now returns 0
  { name: 'Undefined input', input: undefined, shouldFail: false }, // FIXED: now returns 0
  { name: 'Number input', input: 12345, shouldFail: false }, // FIXED: converts to string
  { name: 'Object input', input: {}, shouldFail: false }, // FIXED: converts to string
  { name: 'Array input', input: [], shouldFail: false }, // FIXED: converts to string
  { name: 'Empty string', input: '', shouldFail: false },
  { name: 'Emoji', input: '😀🎯💡', shouldFail: false },
];

console.log('═══════════════════════════════════════');
console.log('TEST 1: countBytes Function');
console.log('═══════════════════════════════════════\n');

tests.forEach((test, index) => {
  try {
    const result = countBytes(test.input);
    if (test.shouldFail) {
      console.log(`❌ Test ${index + 1} FAILED: ${test.name}`);
      console.log(`   Expected: Error`);
      console.log(`   Got: ${result} (no error thrown)\n`);
    } else {
      console.log(`✅ Test ${index + 1} PASSED: ${test.name}`);
      console.log(`   Input: ${JSON.stringify(test.input)}`);
      console.log(`   Bytes: ${result}\n`);
    }
  } catch (error) {
    if (test.shouldFail) {
      console.log(`🐛 Test ${index + 1} BUG REPRODUCED: ${test.name}`);
      console.log(`   Input: ${JSON.stringify(test.input)}`);
      console.log(`   Error: ${error.message}\n`);
    } else {
      console.log(`❌ Test ${index + 1} UNEXPECTED ERROR: ${test.name}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
});

console.log('\n═══════════════════════════════════════');
console.log('TEST 2: getByteStats Function');
console.log('═══════════════════════════════════════\n');

const statsTests = [
  { name: 'Mixed text', input: 'Hello 안녕 123', shouldFail: false },
  { name: 'Null input', input: null, shouldFail: false }, // FIXED: returns zero stats
  { name: 'Only English', input: 'Hello', shouldFail: false }, // FIXED: handles missing matches
  { name: 'Only Korean', input: '안녕하세요', shouldFail: false }, // FIXED: handles missing matches
  { name: 'Only numbers', input: '12345', shouldFail: false }, // FIXED: handles missing matches
  { name: 'Only emojis', input: '😀🎯💡', shouldFail: false }, // FIXED: handles missing matches
];

statsTests.forEach((test, index) => {
  try {
    const result = getByteStats(test.input);
    if (test.shouldFail) {
      console.log(`❌ Test ${index + 1} FAILED: ${test.name}`);
      console.log(`   Expected: Error`);
      console.log(`   Got: ${JSON.stringify(result)}\n`);
    } else {
      console.log(`✅ Test ${index + 1} PASSED: ${test.name}`);
      console.log(`   Stats: ${JSON.stringify(result)}\n`);
    }
  } catch (error) {
    if (test.shouldFail) {
      console.log(`🐛 Test ${index + 1} BUG REPRODUCED: ${test.name}`);
      console.log(`   Input: ${JSON.stringify(test.input)}`);
      console.log(`   Error: ${error.message}\n`);
    } else {
      console.log(`❌ Test ${index + 1} UNEXPECTED ERROR: ${test.name}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
});

console.log('═══════════════════════════════════════');
console.log('Bug Reproduction Complete');
console.log('═══════════════════════════════════════');
