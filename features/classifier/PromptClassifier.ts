import type { CategorySlug, ClassificationResult } from '@/types/prompt';

const KEYWORD_MAP: Record<CategorySlug, string[]> = {
  programming: [
    'code', 'function', 'api', 'database', 'react', 'typescript', 'python',
    'javascript', 'flutter', 'css', 'html', 'component', 'debug', 'algorithm',
    'class', 'interface', 'module', 'endpoint', 'backend', 'frontend', 'server',
    'client', 'deploy', 'git', 'docker', 'test', 'unit test', 'integration',
    'sql', 'nosql', 'mongodb', 'postgres', 'mysql', 'redis', 'graphql', 'rest',
    'webpack', 'vite', 'node', 'express', 'django', 'flask', 'spring', 'java',
    'rust', 'go', 'swift', 'kotlin', 'php', 'ruby', 'c++', 'c#', '.net',
    'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'tailwind', 'sass',
    'variable', 'loop', 'array', 'object', 'string', 'boolean', 'regex',
    'authentication', 'authorization', 'middleware', 'route', 'controller',
    'model', 'view', 'template', 'compiler', 'interpreter', 'binary',
    'refactor', 'optimize', 'performance', 'cache', 'async', 'await',
    'promise', 'callback', 'event', 'listener', 'hook', 'state', 'props',
    'scaffold', 'boilerplate', 'cli', 'terminal', 'shell', 'script',
    'firebase', 'supabase', 'aws', 'azure', 'gcp', 'lambda', 'microservice',
  ],
  writing: [
    'write', 'article', 'blog', 'essay', 'story', 'novel', 'poem', 'script',
    'content', 'copywriting', 'headline', 'paragraph', 'draft', 'edit',
    'proofread', 'grammar', 'tone', 'style', 'narrative', 'character',
    'dialogue', 'plot', 'setting', 'theme', 'metaphor', 'creative writing',
    'fiction', 'nonfiction', 'journalism', 'report', 'summary', 'abstract',
    'introduction', 'conclusion', 'thesis', 'argument', 'persuasive',
    'descriptive', 'expository', 'letter', 'email', 'newsletter', 'press release',
    'social media', 'caption', 'tagline', 'slogan', 'brand voice',
    'seo', 'keyword', 'meta description', 'title tag', 'alt text',
    'translation', 'localization', 'rewrite', 'paraphrase', 'summarize',
  ],
  'image-generation': [
    'image', 'photo', 'illustration', 'artwork', 'painting', 'drawing',
    'render', 'visual', 'graphic', 'portrait', 'landscape', 'abstract',
    'realistic', 'photorealistic', 'digital art', 'concept art', '3d',
    'midjourney', 'dall-e', 'stable diffusion', 'sdxl', 'flux',
    'leonardo', 'firefly', 'ideogram', 'playground',
    'negative prompt', 'seed', 'cfg scale', 'steps', 'sampler',
    'resolution', 'aspect ratio', 'style', 'lighting', 'composition',
    'texture', 'color palette', 'background', 'foreground', 'bokeh',
    'cinematic', 'ethereal', 'surreal', 'minimalist', 'detailed',
    'high quality', '4k', '8k', 'hdr', 'ultra detailed',
    'lora', 'controlnet', 'img2img', 'inpainting', 'outpainting',
  ],
  'video-generation': [
    'video', 'animation', 'motion', 'clip', 'footage', 'film',
    'cinematic', 'frame', 'fps', 'transition', 'scene', 'cut',
    'sora', 'runway', 'pika', 'kling', 'luma', 'gen-2', 'gen-3',
    'animate', 'morph', 'interpolate', 'keyframe', 'timeline',
    'storyboard', 'b-roll', 'slow motion', 'time-lapse', 'tracking shot',
    'pan', 'zoom', 'tilt', 'dolly', 'crane shot', 'aerial',
    'vfx', 'sfx', 'compositing', 'green screen', 'chroma key',
    'subtitle', 'voiceover', 'soundtrack', 'sound design',
  ],
  'ui-ux-design': [
    'ui', 'ux', 'design', 'wireframe', 'mockup', 'prototype', 'figma',
    'sketch', 'layout', 'responsive', 'mobile', 'desktop', 'tablet',
    'navigation', 'sidebar', 'header', 'footer', 'modal', 'card',
    'button', 'input', 'form', 'dropdown', 'menu', 'tab', 'tooltip',
    'icon', 'typography', 'font', 'color scheme', 'dark mode', 'light mode',
    'spacing', 'grid', 'flexbox', 'breakpoint', 'accessibility', 'a11y',
    'wcag', 'contrast', 'user flow', 'user journey', 'persona',
    'usability', 'heuristic', 'interaction', 'microinteraction',
    'design system', 'component library', 'style guide', 'brand',
    'dashboard', 'landing page', 'onboarding', 'empty state',
  ],
  'research-analysis': [
    'research', 'analysis', 'data', 'report', 'study', 'survey',
    'statistics', 'hypothesis', 'methodology', 'findings', 'conclusion',
    'literature review', 'case study', 'comparison', 'benchmark',
    'trend', 'forecast', 'predict', 'insight', 'metric', 'kpi',
    'market research', 'competitive analysis', 'swot', 'pest',
    'financial', 'economic', 'demographic', 'psychographic',
    'sentiment', 'opinion', 'poll', 'feedback', 'evaluation',
    'framework', 'model', 'theory', 'concept', 'strategy', 'plan',
    'decision', 'recommendation', 'risk', 'opportunity', 'gap analysis',
    'qualitative', 'quantitative', 'mixed methods', 'meta-analysis',
  ],
  general: [
    'help', 'explain', 'describe', 'list', 'suggest', 'recommend',
    'brainstorm', 'idea', 'plan', 'organize', 'schedule', 'task',
    'productivity', 'workflow', 'process', 'template', 'format',
    'convert', 'calculate', 'compare', 'review', 'check', 'verify',
  ],
};

const TOOL_PATTERNS: Record<string, string[]> = {
  'ChatGPT': ['chatgpt', 'gpt-4', 'gpt-3.5', 'gpt4', 'openai'],
  'Claude': ['claude', 'anthropic', 'claude-3', 'sonnet', 'opus', 'haiku'],
  'Gemini': ['gemini', 'google ai', 'bard', 'gemini pro', 'gemini ultra'],
  'Midjourney': ['midjourney', 'mj', '--v 6', '--ar', '--style'],
  'DALL-E': ['dall-e', 'dalle', 'dall·e'],
  'Stable Diffusion': ['stable diffusion', 'sdxl', 'sd 1.5', 'sd xl', 'comfyui', 'automatic1111'],
  'Flux': ['flux', 'flux.1', 'flux pro', 'flux dev'],
  'Sora': ['sora'],
  'Runway': ['runway', 'gen-2', 'gen-3'],
  'Cursor': ['cursor', 'cursor ai'],
  'GitHub Copilot': ['copilot', 'github copilot'],
  'Flutter': ['flutter', 'dart', 'widget'],
  'React': ['react', 'jsx', 'tsx', 'next.js', 'nextjs'],
  'Python': ['python', 'pip', 'django', 'flask', 'fastapi'],
};

const TECH_KEYWORDS: string[] = [
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TypeScript', 'JavaScript',
  'Python', 'Java', 'Kotlin', 'Swift', 'Rust', 'Go', 'C++', 'C#', 'PHP',
  'Ruby', 'Flutter', 'Dart', 'React Native', 'Node.js', 'Express', 'Django',
  'Flask', 'FastAPI', 'Spring', 'Laravel', '.NET', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Firebase', 'Supabase', 'MongoDB', 'PostgreSQL',
  'MySQL', 'Redis', 'GraphQL', 'REST', 'gRPC', 'Tailwind CSS', 'SASS',
  'Webpack', 'Vite', 'Git', 'GitHub', 'GitLab', 'Figma', 'Sketch',
  'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Jupyter', 'Selenium',
  'Cypress', 'Jest', 'Vitest', 'Playwright', 'Storybook', 'Prisma',
  'Drizzle', 'tRPC', 'Zustand', 'Redux', 'Jotai', 'MobX',
];

function scoreCategory(content: string): CategorySlug {
  const lower = content.toLowerCase();
  const scores: Record<CategorySlug, number> = {
    programming: 0,
    writing: 0,
    'image-generation': 0,
    'video-generation': 0,
    'ui-ux-design': 0,
    'research-analysis': 0,
    general: 0,
  };

  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        scores[category as CategorySlug] += keyword.length > 5 ? 2 : 1;
      }
    }
  }

  let maxCategory: CategorySlug = 'general';
  let maxScore = 0;

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category as CategorySlug;
    }
  }

  return maxCategory;
}

function detectTool(content: string): string {
  const lower = content.toLowerCase();
  let bestMatch = '';
  let bestScore = 0;

  for (const [tool, patterns] of Object.entries(TOOL_PATTERNS)) {
    let score = 0;
    for (const pattern of patterns) {
      if (lower.includes(pattern)) {
        score += pattern.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = tool;
    }
  }

  return bestMatch;
}

function detectTechnologies(content: string): string[] {
  const found: string[] = [];
  const lower = content.toLowerCase();

  for (const tech of TECH_KEYWORDS) {
    if (lower.includes(tech.toLowerCase())) {
      found.push(tech);
    }
  }

  return [...new Set(found)].slice(0, 10);
}

function generateTitle(content: string): string {
  const lines = content.trim().split('\n').filter((l) => l.trim().length > 0);
  const firstLine = lines[0] || '';

  // If first line is short enough, use it
  if (firstLine.length > 5 && firstLine.length <= 80) {
    return firstLine.replace(/^[#*\->]+\s*/, '').trim();
  }

  // Extract key phrases
  const words = content.slice(0, 200).split(/\s+/).filter((w) => w.length > 3);
  const meaningful = words.slice(0, 6).join(' ');
  return meaningful.length > 5 ? meaningful.slice(0, 60) : 'Untitled Prompt';
}

function extractTags(content: string, category: CategorySlug): string[] {
  const lower = content.toLowerCase();
  const tags: string[] = [];

  // Extract from category keywords
  const categoryKeywords = KEYWORD_MAP[category] || [];
  for (const kw of categoryKeywords) {
    if (lower.includes(kw) && kw.length > 3) {
      tags.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  // Deduplicate and limit
  return [...new Set(tags)].slice(0, 8);
}

function inferSubcategory(content: string, category: CategorySlug): string {
  const lower = content.toLowerCase();

  const subcategoryMap: Partial<Record<CategorySlug, Record<string, string[]>>> = {
    programming: {
      'Frontend Development': ['react', 'vue', 'angular', 'svelte', 'css', 'html', 'dom'],
      'Backend Development': ['server', 'api', 'database', 'endpoint', 'middleware', 'express', 'django'],
      'Mobile Development': ['flutter', 'react native', 'swift', 'kotlin', 'ios', 'android'],
      'DevOps & Cloud': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'deploy'],
      'Data Science': ['pandas', 'numpy', 'tensorflow', 'pytorch', 'machine learning', 'data'],
      'General Programming': [],
    },
    writing: {
      'Blog & Articles': ['blog', 'article', 'post'],
      'Creative Writing': ['story', 'fiction', 'novel', 'poem', 'creative'],
      'Marketing Copy': ['copy', 'headline', 'tagline', 'ad', 'marketing', 'seo'],
      'Technical Writing': ['documentation', 'readme', 'guide', 'tutorial', 'technical'],
      'General Writing': [],
    },
    'image-generation': {
      'Photo-realistic': ['photo', 'realistic', 'photorealistic', 'portrait'],
      'Digital Art': ['art', 'illustration', 'digital', 'concept art'],
      'Logo & Brand': ['logo', 'brand', 'icon', 'emblem'],
      'General Image': [],
    },
  };

  const subcategories = subcategoryMap[category];
  if (!subcategories) return 'General';

  for (const [subcat, keywords] of Object.entries(subcategories)) {
    if (keywords.length === 0) continue;
    for (const kw of keywords) {
      if (lower.includes(kw)) return subcat;
    }
  }

  const fallbackKey = Object.keys(subcategories).pop();
  return fallbackKey || 'General';
}

export function classifyPrompt(content: string, existingTitle?: string): ClassificationResult {
  const category = scoreCategory(content);
  const tool = detectTool(content);
  const technologies = detectTechnologies(content);
  const tags = extractTags(content, category);
  const subcategory = inferSubcategory(content, category);
  const title = existingTitle?.trim() || generateTitle(content);

  // Generate purpose from content
  const firstSentence = content.split(/[.!?\n]/).find((s) => s.trim().length > 10);
  const purpose = firstSentence?.trim().slice(0, 150) || 'General purpose prompt';

  // Generate description
  const description = content.length > 100
    ? content.slice(0, 120).trim() + '…'
    : content.trim();

  return {
    title,
    category,
    subcategory,
    tool,
    technologies,
    tags,
    purpose,
    description,
  };
}
