import type {
  CategorySlug,
  TagSuggestion,
  TitleSuggestion,
  CategoryCorrectionSuggestion,
} from '@/types/prompt';

const CATEGORY_VOCABULARY: Record<CategorySlug, { keywords: string[]; name: string }> = {
  programming: {
    name: 'Programming',
    keywords: [
      'code', 'function', 'api', 'database', 'react', 'typescript', 'python',
      'javascript', 'backend', 'frontend', 'sql', 'docker', 'endpoint', 'component',
      'refactor', 'test', 'unittest', 'algorithm', 'git', 'css', 'html', 'node',
      'express', 'fastapi', 'django', 'graphql', 'rest', 'async', 'await', 'rust',
      'golang', 'prisma', 'tailwind', 'bugs', 'debug', 'middleware', 'schema',
    ],
  },
  writing: {
    name: 'Writing',
    keywords: [
      'write', 'article', 'blog', 'essay', 'copywriting', 'story', 'novel',
      'email', 'newsletter', 'headline', 'paragraph', 'tone', 'voice',
      'narrative', 'proofread', 'grammar', 'fiction', 'seo', 'editorial',
      'dialogue', 'character', 'synopsis', 'press release', 'speech', 'script',
    ],
  },
  'image-generation': {
    name: 'Image Generation',
    keywords: [
      'photo', 'image', 'photorealistic', 'portrait', 'illustration', 'render',
      'octane', 'unreal engine', 'cinematic lighting', 'aspect ratio', '--ar',
      'midjourney', 'dall-e', 'stable diffusion', 'flux', 'lens', 'bokeh',
      'volumetric', '8k', 'digital art', 'concept art', 'anime', 'composition',
    ],
  },
  'video-generation': {
    name: 'Video Generation',
    keywords: [
      'video', 'animation', 'cinematic', 'camera pan', 'drone shot', 'slow motion',
      'fps', 'keyframes', 'sora', 'runway', 'gen-3', 'pika', 'kling', 'luma',
      'morph', 'transition', 'b-roll', 'timeline', 'footage', 'tracking shot',
    ],
  },
  'ui-ux-design': {
    name: 'UI/UX & Design',
    keywords: [
      'wireframe', 'mockup', 'prototype', 'figma', 'design system', 'user flow',
      'ux', 'ui', 'microinteraction', 'onboarding', 'heuristic', 'wcag',
      'contrast', 'glassmorphism', 'typography', 'color palette', 'component library',
      'landing page', 'dashboard layout', 'navigation', 'responsive layout',
    ],
  },
  'research-analysis': {
    name: 'Research & Analysis',
    keywords: [
      'research', 'analysis', 'data', 'statistics', 'survey', 'benchmark',
      'market research', 'swot', 'financial', 'kpi', 'metric', 'trends',
      'literature review', 'hypothesis', 'competitive analysis', 'forecast',
      'methodology', 'qualitative', 'quantitative', 'deep dive', 'findings',
    ],
  },
  general: {
    name: 'General / Other',
    keywords: [
      'summarize', 'explain', 'help', 'ideas', 'brainstorm', 'plan',
      'checklist', 'organize', 'productivity', 'guide', 'steps',
    ],
  },
};

const EXTENDED_TOOLS: Record<string, string[]> = {
  'ChatGPT / GPT-4o': ['chatgpt', 'gpt-4', 'gpt-4o', 'openai', 'gpt4'],
  'Claude 3.5 Sonnet': ['claude', 'anthropic', 'sonnet', 'opus', 'haiku', 'claude-3'],
  'DeepSeek V3 / R1': ['deepseek', 'deepseek-r1', 'r1', 'deepseek-v3'],
  'Gemini 2.0 / Pro': ['gemini', 'google ai', 'bard', 'gemini 1.5', 'gemini 2.0'],
  'Midjourney v6': ['midjourney', '--v 6', '--ar', '--stylize', 'mj v6', '--chaos'],
  'DALL-E 3': ['dall-e', 'dalle 3', 'dalle', 'dall·e'],
  'Flux.1 Pro': ['flux', 'flux.1', 'flux pro', 'flux dev', 'black forest labs'],
  'Stable Diffusion XL': ['stable diffusion', 'sdxl', 'sd 1.5', 'comfyui', 'automatic1111', 'lora'],
  'Runway Gen-3': ['runway', 'gen-3', 'gen-2', 'runwayml'],
  'Sora': ['sora', 'openai sora'],
  'Cursor': ['cursor', 'cursor.sh', 'cursor rules'],
  'GitHub Copilot': ['copilot', 'github copilot'],
  'Perplexity': ['perplexity', 'pplx'],
};

const EXTENDED_TECHS: string[] = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'TypeScript', 'JavaScript',
  'Python', 'FastAPI', 'Django', 'Flask', 'Node.js', 'Express.js', 'NestJS',
  'Go', 'Rust', 'Java', 'Kotlin', 'Swift', 'Flutter', 'Dart', 'React Native',
  'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'Supabase', 'Firebase',
  'Tailwind CSS', 'Figma', 'Prisma', 'Drizzle', 'tRPC', 'Zustand', 'PyTorch',
  'TensorFlow', 'Pandas', 'NumPy', 'Playwright', 'Jest', 'Vitest', 'Cypress',
];

export function detectToolsDetailed(content: string): string[] {
  const lower = content.toLowerCase();
  const matched: string[] = [];

  for (const [toolName, patterns] of Object.entries(EXTENDED_TOOLS)) {
    if (patterns.some((p) => lower.includes(p))) {
      matched.push(toolName);
    }
  }

  return matched;
}

export function detectTechnologiesDetailed(content: string): string[] {
  const lower = content.toLowerCase();
  const matched: string[] = [];

  for (const tech of EXTENDED_TECHS) {
    const techLower = tech.toLowerCase();
    // Word boundary or containment check
    const regex = new RegExp(`\\b${techLower.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(content) || lower.includes(techLower)) {
      matched.push(tech);
    }
  }

  return [...new Set(matched)].slice(0, 10);
}

export function generateTitleSuggestions(content: string, category: CategorySlug): TitleSuggestion[] {
  const clean = content.trim();
  const firstLine = clean.split('\n')[0].replace(/^[#*->]+\s*/, '').trim();

  // 1. Action-oriented title
  let actionTitle = 'Optimized Prompt Template';
  const actionMatch = clean.match(/(?:write|create|build|generate|design|develop|analyze|implement|explain)\s+(?:an?|the)?\s*([a-zA-Z0-9_\-\s]{4,45})/i);
  if (actionMatch && actionMatch[1]) {
    const topic = actionMatch[1].trim();
    actionTitle = `${topic.charAt(0).toUpperCase() + topic.slice(1)} Generator`;
  } else if (firstLine.length > 8 && firstLine.length <= 60) {
    actionTitle = firstLine;
  }

  // 2. Persona-oriented title
  let personaTitle = 'Expert Task Workflow';
  const personaMatch = clean.match(/(?:act as|you are|assume the role of)\s+(?:an?|the)?\s*([a-zA-Z0-9_\-\s]{3,35})/i);
  if (personaMatch && personaMatch[1]) {
    personaTitle = `${personaMatch[1].trim()} Prompt`;
  } else {
    const catName = CATEGORY_VOCABULARY[category]?.name || 'Specialist';
    personaTitle = `${catName} Master Template`;
  }

  // 3. Concise summary title
  const words = clean.split(/\s+/).filter((w) => w.length > 3 && !['with', 'from', 'that', 'this', 'your'].includes(w.toLowerCase()));
  const keyWords = words.slice(0, 4).join(' ');
  const conciseTitle = keyWords.length > 4 ? `${keyWords} Blueprint` : 'AI Prompt';

  return [
    { title: actionTitle.slice(0, 65), type: 'action' },
    { title: personaTitle.slice(0, 65), type: 'persona' },
    { title: conciseTitle.slice(0, 65), type: 'concise' },
  ];
}

export function generateDescriptionSummary(content: string, category: CategorySlug): string {
  const clean = content.trim().replace(/\s+/g, ' ');
  const firstSentence = clean.split(/[.!?\n]/).find((s) => s.trim().length > 15);

  if (firstSentence) {
    const s = firstSentence.trim();
    if (s.length <= 150) return s;
    return s.slice(0, 140).trimEnd() + '…';
  }

  const catName = CATEGORY_VOCABULARY[category]?.name || 'general';
  return `Comprehensive ${catName} prompt engineered for reliable, production-ready AI outputs.`;
}

export function suggestTags(
  content: string,
  category: CategorySlug,
  existingTags: string[] = [],
): TagSuggestion[] {
  const lower = content.toLowerCase();
  const suggestions: TagSuggestion[] = [];
  const existingSet = new Set(existingTags.map((t) => t.toLowerCase()));

  // 1. Technology tags
  const techs = detectTechnologiesDetailed(content);
  for (const tech of techs) {
    if (!existingSet.has(tech.toLowerCase())) {
      suggestions.push({
        tag: tech,
        reason: 'Detected in prompt code/stack',
        source: 'technology',
      });
    }
  }

  // 2. Domain keywords
  const catInfo = CATEGORY_VOCABULARY[category];
  if (catInfo) {
    for (const kw of catInfo.keywords) {
      if (kw.length > 4 && lower.includes(kw) && !existingSet.has(kw.toLowerCase())) {
        const formatted = kw.charAt(0).toUpperCase() + kw.slice(1);
        suggestions.push({
          tag: formatted,
          reason: `Matches ${catInfo.name} vocabulary`,
          source: 'domain',
        });
      }
    }
  }

  // 3. Intent / pattern tags
  const intentMap = [
    { pattern: /\b(refactor|optimize|cleanup)\b/i, tag: 'Refactoring', reason: 'Focuses on code improvement' },
    { pattern: /\b(test|unit test|integration test|mock)\b/i, tag: 'Testing', reason: 'Includes test suite requirements' },
    { pattern: /\b(api|rest|endpoint|crud)\b/i, tag: 'API Design', reason: 'Defines endpoints or backend interfaces' },
    { pattern: /\b(json|schema|pydantic|zod)\b/i, tag: 'Structured Data', reason: 'Specifies structured schema outputs' },
    { pattern: /\b(system prompt|instructions|persona)\b/i, tag: 'System Prompt', reason: 'Role or meta-instruction structure' },
    { pattern: /\b(seo|ranking|keywords|serp)\b/i, tag: 'SEO', reason: 'Optimized for search engines' },
    { pattern: /\b(copywriting|conversion|ad copy|tagline)\b/i, tag: 'Copywriting', reason: 'Marketing & conversion copy' },
    { pattern: /\b(wireframe|component|design system)\b/i, tag: 'Design System', reason: 'UI architecture & components' },
  ];

  for (const item of intentMap) {
    if (item.pattern.test(content) && !existingSet.has(item.tag.toLowerCase())) {
      suggestions.push({
        tag: item.tag,
        reason: item.reason,
        source: 'intent',
      });
    }
  }

  // Deduplicate and return top suggestions
  const seen = new Set<string>();
  const unique: TagSuggestion[] = [];
  for (const s of suggestions) {
    if (!seen.has(s.tag.toLowerCase())) {
      seen.add(s.tag.toLowerCase());
      unique.push(s);
    }
  }

  return unique.slice(0, 8);
}

export function suggestCategoryCorrection(
  content: string,
  currentCategory: CategorySlug,
): CategoryCorrectionSuggestion {
  const lower = content.toLowerCase();
  const scores: Record<CategorySlug, { score: number; hits: string[] }> = {
    programming: { score: 0, hits: [] },
    writing: { score: 0, hits: [] },
    'image-generation': { score: 0, hits: [] },
    'video-generation': { score: 0, hits: [] },
    'ui-ux-design': { score: 0, hits: [] },
    'research-analysis': { score: 0, hits: [] },
    general: { score: 0, hits: [] },
  };

  for (const [slug, data] of Object.entries(CATEGORY_VOCABULARY)) {
    for (const kw of data.keywords) {
      if (lower.includes(kw)) {
        scores[slug as CategorySlug].score += kw.length > 5 ? 2 : 1;
        if (scores[slug as CategorySlug].hits.length < 4) {
          scores[slug as CategorySlug].hits.push(kw);
        }
      }
    }
  }

  let bestCat: CategorySlug = currentCategory;
  let maxScore = scores[currentCategory]?.score || 0;

  for (const [slug, item] of Object.entries(scores)) {
    if (item.score > maxScore) {
      maxScore = item.score;
      bestCat = slug as CategorySlug;
    }
  }

  const isDifferent = bestCat !== currentCategory && maxScore >= 4;
  const currentHits = scores[currentCategory]?.hits || [];
  const bestHits = scores[bestCat]?.hits || [];

  const confidence = Math.min(0.96, Math.max(0.5, Number((maxScore / (maxScore + 2)).toFixed(2))));
  const catName = CATEGORY_VOCABULARY[bestCat]?.name || bestCat;

  let reason = '';
  if (isDifferent) {
    reason = `Contains strong signals for ${catName} (${bestHits.slice(0, 3).join(', ')}), while current category has fewer matching keywords.`;
  } else {
    reason = `Matches current category with keywords: ${currentHits.slice(0, 3).join(', ') || 'general task'}`;
  }

  return {
    currentCategory,
    suggestedCategory: bestCat,
    confidence,
    reason,
    isDifferent,
  };
}
