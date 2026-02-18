
import { ModelType, TokenStats } from '../types';
import { MODEL_CONFIGS } from '../constants';

export const estimateTokens = (text: string, modelType: ModelType): TokenStats => {
  if (!text) {
    return { tokens: 0, words: 0, characters: 0, estimatedCost: 0 };
  }

  const characters = text.length;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  
  // High-fidelity heuristic: 
  // LLM tokenizers vary, but ~4 characters per token is a standard baseline.
  // We use a slightly more nuanced approach for better estimation.
  const config = MODEL_CONFIGS[modelType];
  const tokenHeuristic = characters * config.tokensPerChar;
  const tokens = Math.ceil(tokenHeuristic);

  const estimatedCost = (tokens / 1000000) * config.costPerMillionInput;

  return {
    tokens,
    words,
    characters,
    estimatedCost
  };
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4
  }).format(num);
};
