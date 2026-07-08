import { EXCHANGE_RATE_USD_TO_KRW } from './constants';

export function calculateCost(inputTokens, outputTokens, model) {
  if (!model) {
    return {
      input: 0,
      output: 0,
      total: 0,
      totalKRW: 0
    };
  }

  // Calculate cost per 1K tokens
  const inputCost = (inputTokens / 1000) * model.pricing.input;
  const outputCost = (outputTokens / 1000) * model.pricing.output;
  const totalUSD = inputCost + outputCost;
  const totalKRW = Math.ceil(totalUSD * EXCHANGE_RATE_USD_TO_KRW);

  return {
    input: inputCost,
    output: outputCost,
    total: totalUSD,
    totalKRW: totalKRW
  };
}

export function formatCost(cost, currency = 'USD') {
  if (currency === 'KRW') {
    return `₩${cost.toLocaleString('ko-KR')}`;
  }
  return `$${cost.toFixed(4)}`;
}
