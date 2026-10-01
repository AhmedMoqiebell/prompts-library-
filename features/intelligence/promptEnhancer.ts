import type { CategorySlug } from '@/types/prompt';

export type EnhancementStyle = 'structured' | 'concise' | 'creative';

export interface EnhancementResult {
  style: EnhancementStyle;
  enhancedContent: string;
  keyImprovements: string[];
  roleAdopted: string;
  formatSpecified: string;
}

const CATEGORY_ROLE_MAP: Record<CategorySlug, string> = {
  programming: 'Principal Software Engineer & Technical Architect',
  writing: 'Elite Content Strategist & Senior Editor',
  'image-generation': 'Master Visual Director & Digital Concept Artist',
  'video-generation': 'Cinematic Video Producer & Storyboard Specialist',
  'ui-ux-design': 'Lead Product Designer & UX Researcher',
  'research-analysis': 'Senior Intelligence & Quantitative Research Analyst',
  general: 'Specialized Subject-Matter Expert & Strategic Consultant',
};

/**
 * Intelligent prompt optimizer that transforms raw prompts into high-performance prompts
 * based on proven prompt engineering principles (Persona, Objective, Constraints, Output Specification).
 */
export function enhancePrompt(
  rawContent: string,
  category: CategorySlug = 'general',
  style: EnhancementStyle = 'structured',
  title?: string,
): EnhancementResult {
  const content = rawContent.trim();
  const role = CATEGORY_ROLE_MAP[category] || CATEGORY_ROLE_MAP.general;

  const keyImprovements: string[] = [];
  let enhancedContent = '';
  let formatSpecified = '';

  if (style === 'concise') {
    keyImprovements.push('Removed ambiguity and conversational fluff');
    keyImprovements.push('Focused on direct, high-signal actionable directives');
    keyImprovements.push('Set clear constraints on answer density');

    formatSpecified = 'Bullet points and code snippets only; zero preamble';

    enhancedContent = `Role: ${role}

Task:
${content}

Core Directives & Constraints:
- Be direct, authoritative, and concise. No conversational filler or introductory preamble.
- Highlight edge cases, performance considerations, and best practices.
- If code or structured data is required, deliver production-ready, clean, well-commented blocks.

Output Requirement:
Direct answer formatted with clear headers and bullet points.`;
  } else if (style === 'creative') {
    keyImprovements.push('Added immersive persona and creative context');
    keyImprovements.push('Introduced multi-perspective exploration');
    keyImprovements.push('Enhanced sensory and stylistic details');

    formatSpecified = 'Engaging, nuanced narrative with examples and alternatives';

    enhancedContent = `You are a world-class ${role}. You approach this challenge with deep domain mastery, creative originality, and keen attention to detail.

Context & Challenge:
${content}

Guiding Principles:
1. Depth & Originality: Avoid generic or clichéd suggestions. Explore unconventional angles and fresh perspectives.
2. Emotional & Practical Resonance: Blend aesthetic appeal with rigorous functionality and strategic clarity.
3. Multi-Scenario Options: Provide a primary recommended approach accompanied by 2 high-potential alternatives.

Desired Deliverable:
- Comprehensive breakdown with rich detail
- Practical, implementable steps or variations
- Explanations of why each creative choice was made`;
  } else {
    // Default: 'structured'
    keyImprovements.push('Assigned authoritative expert persona');
    keyImprovements.push('Structured prompt into Context, Directives, and Guardrails');
    keyImprovements.push('Added explicit negative constraints (what to avoid)');
    keyImprovements.push('Specified exact expected output architecture');

    formatSpecified = 'Structured Markdown with executive summary, implementation details, and verification steps';

    enhancedContent = `Act as an expert ${role}.

## Context & Objective
${content}

## Instructions & Execution Steps
1. Analyze the core requirements and identify any implicit assumptions or potential bottlenecks.
2. Formulate a robust, step-by-step solution adhering strictly to industry standards.
3. Ensure every recommendation is justified with actionable reasoning.

## Constraints & Guardrails
- Maintain extreme clarity and accuracy; do NOT hallucinate facts or unsupported patterns.
- Do not repeat the prompt instructions in your response.
- Provide concrete examples or code blocks wherever applicable rather than abstract descriptions.

## Expected Output Format
Deliver your response using clean Markdown:
- **Executive Summary / Direct Answer**: Brief 1-2 sentence core resolution.
- **Detailed Solution**: Structured sections with headers and bullet points.
- **Key Takeaways & Verification**: 2-3 checklist items to confirm success.`;
  }

  return {
    style,
    enhancedContent,
    keyImprovements,
    roleAdopted: role,
    formatSpecified,
  };
}
