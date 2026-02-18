
export enum ModelType {
  GEMINI_3_FLASH = 'gemini-3-flash-preview',
  GEMINI_3_PRO = 'gemini-3-pro-preview',
  GPT_4O = 'gpt-4o',
  GPT_5_2 = 'gpt-5.2',
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet',
  GROK_2 = 'grok-2',
  SOLAR_PRO = 'solar-pro',
  LLAMA_3_1_405B = 'llama-3.1-405b'
}

export interface TokenStats {
  tokens: number;
  words: number;
  characters: number;
  estimatedCost: number;
}

export interface ModelConfig {
  name: string;
  tokensPerChar: number;
  costPerMillionInput: number;
  costPerMillionOutput: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  text: string;
  tokens: number;
  type: 'input' | 'output';
}
