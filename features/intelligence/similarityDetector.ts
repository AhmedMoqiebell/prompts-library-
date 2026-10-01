import type { Prompt, DuplicateDetectionResult, SimilarPromptMatch } from '@/types/prompt';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'this', 'that',
  'these', 'those', 'it', 'its', 'you', 'your', 'we', 'our', 'from', 'into',
]);

function normalizeContent(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractWordTokens(text: string): Set<string> {
  const words = normalizeContent(text)
    .split(' ')
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

function extractTrigrams(text: string): Set<string> {
  const clean = normalizeContent(text).replace(/\s+/g, ' ');
  const trigrams = new Set<string>();
  for (let i = 0; i <= clean.length - 3; i++) {
    trigrams.add(clean.slice(i, i + 3));
  }
  return trigrams;
}

function calculateJaccard<T>(setA: Set<T>, setB: Set<T>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function detectDuplicatesAndSimilar(
  content: string,
  allPrompts: Prompt[],
  currentPromptId?: string,
): {
  duplicate: DuplicateDetectionResult;
  similarPrompts: SimilarPromptMatch[];
} {
  const trimmed = content.trim();
  if (trimmed.length < 15) {
    return {
      duplicate: { isExactDuplicate: false },
      similarPrompts: [],
    };
  }

  const normalizedInput = normalizeContent(trimmed);
  const inputWords = extractWordTokens(trimmed);
  const inputTrigrams = extractTrigrams(trimmed);

  let exactDuplicatePrompt: Prompt | null = null;
  const similarList: SimilarPromptMatch[] = [];

  for (const p of allPrompts) {
    if (currentPromptId && p.id === currentPromptId) continue;

    const normalizedP = normalizeContent(p.content);

    // Exact match check
    if (normalizedP === normalizedInput) {
      exactDuplicatePrompt = p;
      continue;
    }

    // Similarity calculations
    const pWords = extractWordTokens(p.content);
    const pTrigrams = extractTrigrams(p.content);

    const wordSim = calculateJaccard(inputWords, pWords);
    const trigramSim = calculateJaccard(inputTrigrams, pTrigrams);

    // Combined content score
    const combinedScore = wordSim * 0.5 + trigramSim * 0.5;

    // Check shared technologies
    const matchedReasons: string[] = [];

    if (combinedScore > 0.35) {
      matchedReasons.push(`${Math.round(combinedScore * 100)}% structural content similarity`);

      // Shared technologies check
      const sharedTechs = p.technologies.filter((t) =>
        trimmed.toLowerCase().includes(t.toLowerCase()),
      );
      if (sharedTechs.length > 0) {
        matchedReasons.push(`Shares ${sharedTechs.length} technologies: ${sharedTechs.slice(0, 3).join(', ')}`);
      }

      // Shared tags check
      const sharedTags = p.tags.filter((tag) =>
        trimmed.toLowerCase().includes(tag.toLowerCase()),
      );
      if (sharedTags.length > 0) {
        matchedReasons.push(`Shares tags: ${sharedTags.slice(0, 3).join(', ')}`);
      }

      similarList.push({
        prompt: p,
        similarityScore: Math.min(0.99, Number(combinedScore.toFixed(2))),
        matchReasons: matchedReasons,
      });
    }
  }

  // Sort similar prompts by score descending
  similarList.sort((a, b) => b.similarityScore - a.similarityScore);

  return {
    duplicate: {
      isExactDuplicate: !!exactDuplicatePrompt,
      matchedPrompt: exactDuplicatePrompt
        ? {
            id: exactDuplicatePrompt.id,
            title: exactDuplicatePrompt.title,
            category: exactDuplicatePrompt.category,
            content: exactDuplicatePrompt.content,
          }
        : undefined,
    },
    similarPrompts: similarList.slice(0, 5),
  };
}
