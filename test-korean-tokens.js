/**
 * Test Korean tokenization across all models
 * Run with: node test-korean-tokens.js
 */

import { countTokens } from './src/utils/tokenCounter.js';
import { MODELS } from './src/utils/constants.js';

console.log('🔍 Testing Korean tokenization across all models\n');

const testCases = [
  {
    name: 'Short Korean',
    text: '안녕하세요',
    expectedRange: [5, 10] // reasonable range for 5 characters
  },
  {
    name: 'Medium Korean',
    text: '안녕하세요! AI 토큰 계산기입니다.',
    expectedRange: [15, 30]
  },
  {
    name: 'Long Korean',
    text: '안녕하세요! AI 토큰 계산기입니다. 이 도구는 프롬프트의 토큰 수를 실시간으로 계산해서 API 비용을 예측할 수 있도록 도와줍니다.',
    expectedRange: [40, 80]
  },
  {
    name: 'Mixed Korean-English',
    text: 'Hello 안녕하세요 World',
    expectedRange: [8, 20]
  },
  {
    name: 'Only English',
    text: 'Hello World This is a test',
    expectedRange: [5, 10]
  }
];

async function testAllModels() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Model Comparison - Korean Tokenization');
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    console.log(`Text: "${testCase.text}"`);
    console.log(`Characters: ${testCase.text.length}`);
    console.log(`Expected tokens: ${testCase.expectedRange[0]}-${testCase.expectedRange[1]}\n`);

    const results = [];

    for (const model of MODELS) {
      try {
        const tokens = await countTokens(testCase.text, model.id);
        const ratio = (tokens / testCase.text.length).toFixed(2);

        results.push({
          provider: model.provider,
          name: model.name,
          tokens: tokens,
          ratio: ratio
        });

        const isInRange = tokens >= testCase.expectedRange[0] && tokens <= testCase.expectedRange[1];
        const status = isInRange ? '✅' : '⚠️ ';

        console.log(`${status} ${model.provider.padEnd(10)} ${model.name.padEnd(20)} → ${tokens.toString().padStart(4)} tokens (${ratio}x chars)`);
      } catch (error) {
        console.log(`❌ ${model.provider.padEnd(10)} ${model.name.padEnd(20)} → ERROR: ${error.message}`);
      }
    }

    // Find outliers
    const tokenCounts = results.map(r => r.tokens);
    const avg = tokenCounts.reduce((a, b) => a + b, 0) / tokenCounts.length;
    const outliers = results.filter(r => Math.abs(r.tokens - avg) > avg * 0.3);

    if (outliers.length > 0) {
      console.log(`\n🚨 Outliers detected (>30% from average ${avg.toFixed(1)}):`);
      outliers.forEach(o => {
        const diff = ((o.tokens - avg) / avg * 100).toFixed(1);
        console.log(`   - ${o.provider} ${o.name}: ${o.tokens} tokens (${diff}% from avg)`);
      });
    }

    console.log('\n' + '─'.repeat(65));
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('Analysis Complete');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

testAllModels().catch(console.error);
