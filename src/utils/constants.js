export const MODELS = [
  // OpenAI Models
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "OpenAI",
    tokenizer: "o200k_base",
    pricing: {
      input: 0.002,    // $2.00/M tokens
      output: 0.008    // $8.00/M tokens
    },
    contextWindow: 200000
  },
  // Anthropic Models
  {
    id: "claude-opus-4.8",
    name: "Claude Opus 4.8",
    provider: "Anthropic",
    tokenizer: "claude",
    pricing: {
      input: 0.005,    // $5.00/M tokens
      output: 0.025    // $25.00/M tokens
    },
    contextWindow: 200000
  },
  {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    tokenizer: "claude",
    pricing: {
      input: 0.003,    // $3.00/M tokens
      output: 0.015    // $15.00/M tokens
    },
    contextWindow: 200000
  },
  {
    id: "claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    tokenizer: "claude",
    pricing: {
      input: 0.001,    // $1.00/M tokens
      output: 0.005    // $5.00/M tokens
    },
    contextWindow: 200000
  },
  // Google Models
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    provider: "Google",
    tokenizer: "gemini",
    pricing: {
      input: 0.0015,   // $1.50/M tokens
      output: 0.009    // $9.00/M tokens
    },
    contextWindow: 1000000
  },
  {
    id: "gemini-3.0",
    name: "Gemini 3.0 Pro",
    provider: "Google",
    tokenizer: "gemini",
    pricing: {
      input: 0.001,    // $1.00/M tokens (legacy)
      output: 0.003    // $3.00/M tokens
    },
    contextWindow: 2000000
  },
  // DeepSeek Models
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "DeepSeek",
    tokenizer: "deepseek",
    pricing: {
      input: 0.00014,  // $0.14/M tokens
      output: 0.00028  // $0.28/M tokens
    },
    contextWindow: 1000000
  }
];

export const EXCHANGE_RATE_USD_TO_KRW = 1330; // 2026년 예상 환율

export const SAMPLE_TEXTS = {
  korean: `안녕하세요! AI 토큰 계산기입니다.
이 도구는 프롬프트의 토큰 수를 실시간으로 계산해서 API 비용을 예측할 수 있도록 도와줍니다.
GPT-4.1, Claude Opus 4.8, Claude Sonnet 4.5, Claude Haiku 4.5, Gemini 3.5 Flash, DeepSeek V4 Flash 등 7개 최신 모델을 지원합니다.`,

  english: `Hello! This is the AI Token Counter.
This tool helps you calculate token counts in real-time and estimate API costs.
It supports 7 latest models: GPT-4.1, Claude Opus 4.8, Claude Sonnet 4.5, Claude Haiku 4.5, Gemini 3.5 Flash, Gemini 3.0 Pro, and DeepSeek V4 Flash.`,

  chinese: `你好！这是AI令牌计算器。
此工具可帮助您实时计算令牌数量并估算API成本。
它支持7种最新模型：GPT-4.1、Claude Opus 4.8、Claude Sonnet 4.5、Claude Haiku 4.5、Gemini 3.5 Flash、Gemini 3.0 Pro和DeepSeek V4 Flash。`,

  mixed: `안녕하세요! Welcome to AI Token Counter.
한글과 영문을 혼합해서 작성한 프롬프트의 토큰 수를 정확하게 계산할 수 있습니다.
This mixed-language prompt demonstrates how different languages affect token counts.
각 언어별 토큰 효율성을 비교해보세요! Compare price-to-performance ratios across OpenAI, Anthropic, Google, and DeepSeek models.`
};
