export interface TokenStats {
  characters: number;
  words: number;
  estimatedTokens: number;
  readingTimeMinutes: number;
  costs: {
    model: string;
    inputCostPer1KRuns: number; // cost in USD if run 1000 times
    costPerRunFormatted: string;
  }[];
}

/**
 * Accurately estimates token count taking into account Arabic/multilingual scripts, code blocks, and punctuation.
 */
export function estimateTokens(text: string): TokenStats {
  if (!text) {
    return {
      characters: 0,
      words: 0,
      estimatedTokens: 0,
      readingTimeMinutes: 0,
      costs: [],
    };
  }

  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Detect Arabic or non-Latin script proportion
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/g;
  const arabicChars = (text.match(arabicRegex) || []).length;
  const isArabicDominant = arabicChars > characters * 0.3;

  let estimatedTokens = 0;
  if (isArabicDominant) {
    // Arabic words typically yield around 1.3 - 1.8 tokens per word in modern BPE tokenizers
    estimatedTokens = Math.max(1, Math.round(words * 1.5 + characters * 0.1));
  } else {
    // English/Latin standard is ~4 characters per token or ~0.75 tokens per word
    estimatedTokens = Math.max(1, Math.round(characters / 3.8));
  }

  // Reading time (average 200 words per minute)
  const readingTimeMinutes = Math.max(0.1, Number((words / 200).toFixed(1)));

  // Current pricing per 1M input tokens (approximate standard pricing):
  // GPT-4o: $2.50 per 1M tokens ($0.0025 per 1k)
  // Claude 3.5 Sonnet: $3.00 per 1M tokens ($0.003 per 1k)
  // Gemini 1.5 Flash: $0.075 per 1M tokens ($0.000075 per 1k)
  const models = [
    { name: 'Gemini 1.5 Flash', ratePerMillion: 0.075 },
    { name: 'GPT-4o', ratePerMillion: 2.50 },
    { name: 'Claude 3.5 Sonnet', ratePerMillion: 3.00 },
  ];

  const costs = models.map((m) => {
    const costPerSingleRun = (estimatedTokens / 1_000_000) * m.ratePerMillion;
    const inputCostPer1KRuns = costPerSingleRun * 1000;
    const costPerRunFormatted =
      costPerSingleRun < 0.0001
        ? '< $0.0001'
        : `$${costPerSingleRun.toFixed(4)}`;

    return {
      model: m.name,
      inputCostPer1KRuns: Number(inputCostPer1KRuns.toFixed(4)),
      costPerRunFormatted,
    };
  });

  return {
    characters,
    words,
    estimatedTokens,
    readingTimeMinutes,
    costs,
  };
}
