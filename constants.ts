
import { ModelType, ModelConfig } from './types';

export const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  [ModelType.GEMINI_3_FLASH]: {
    name: 'Gemini 3 Flash',
    tokensPerChar: 0.25,
    costPerMillionInput: 0.075,
    costPerMillionOutput: 0.30
  },
  [ModelType.GEMINI_3_PRO]: {
    name: 'Gemini 3 Pro',
    tokensPerChar: 0.25,
    costPerMillionInput: 1.25,
    costPerMillionOutput: 5.00
  },
  [ModelType.GPT_4O]: {
    name: 'GPT-4o (Omni)',
    tokensPerChar: 0.26,
    costPerMillionInput: 5.00,
    costPerMillionOutput: 15.00
  },
  [ModelType.GPT_5_2]: {
    name: 'GPT-5.2 (Future Tier)',
    tokensPerChar: 0.28,
    costPerMillionInput: 15.00,
    costPerMillionOutput: 45.00
  },
  [ModelType.CLAUDE_3_5_SONNET]: {
    name: 'Claude 3.5 Sonnet',
    tokensPerChar: 0.25,
    costPerMillionInput: 3.00,
    costPerMillionOutput: 15.00
  },
  [ModelType.GROK_2]: {
    name: 'Grok-2 (xAI)',
    tokensPerChar: 0.25,
    costPerMillionInput: 5.00,
    costPerMillionOutput: 15.00
  },
  [ModelType.SOLAR_PRO]: {
    name: 'Solar Pro (Upstage)',
    tokensPerChar: 0.24,
    costPerMillionInput: 0.25,
    costPerMillionOutput: 0.25
  },
  [ModelType.LLAMA_3_1_405B]: {
    name: 'Llama 3.1 405B',
    tokensPerChar: 0.25,
    costPerMillionInput: 5.00,
    costPerMillionOutput: 15.00
  }
};

export const MAX_TOKENS = 1000000;
