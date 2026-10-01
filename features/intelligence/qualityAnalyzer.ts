import type { PromptQualityAnalysis, QualityFinding } from '@/types/prompt';

export function analyzePromptQuality(content: string): PromptQualityAnalysis {
  const text = content.trim();
  const lower = text.toLowerCase();
  const detected: QualityFinding[] = [];
  const missing: QualityFinding[] = [];
  const warnings: QualityFinding[] = [];
  const suggestions: QualityFinding[] = [];

  // ─── 1. Role Definition ───
  const rolePatterns = [
    /(?:act as|you are|assume the role of|persona:|pretend you are|take on the persona of)\s+(?:an?|the)?\s*([a-zA-Z0-9_\-\s]{3,40})/i,
    /(?:expert|senior|specialist|lead|consultant|architect|copywriter|researcher)\s+(?:in|for|of)?/i,
  ];
  const roleMatch = rolePatterns[0].exec(text);

  if (roleMatch || rolePatterns[1].test(text)) {
    const roleName = roleMatch ? roleMatch[1].trim() : 'Specialist persona';
    detected.push({
      dimension: 'role-definition',
      title: 'Clear Role Definition',
      detail: `Role assigned: "${roleName}". Specifying an expert persona grounds the model's tone and domain knowledge.`,
      snippet: roleMatch ? roleMatch[0] : undefined,
    });
  } else {
    missing.push({
      dimension: 'role-definition',
      title: 'Role / Persona Definition',
      detail: 'No persona or role defined. AI models produce more authoritative, calibrated output when given a dedicated domain role.',
      suggestedAction: 'Assign an expert role (e.g., "Act as a Principal Software Architect...")',
      insertableTemplate: 'Act as a senior specialist in this domain. ',
    });
  }

  // ─── 2. Structure & Organization ───
  const hasHeadings = /^#{1,4}\s+.+$/m.test(text);
  const hasBulletPoints = /^[\s]*[-*•]\s+.+$/m.test(text) || /^\d+\.\s+.+$/m.test(text);
  const hasDelimiters = /(?:```|"""|---|===|<[a-zA-Z0-9_-]+>)/.test(text);
  const hasSectionLabels = /(?:context|task|instructions|constraints|output format|requirements|guidelines):/i.test(text);

  if (hasHeadings || hasDelimiters || (hasBulletPoints && hasSectionLabels)) {
    const structuralElements: string[] = [];
    if (hasHeadings) structuralElements.push('markdown headings');
    if (hasDelimiters) structuralElements.push('explicit delimiters (` ``` `, `"""`, or XML tags)');
    if (hasBulletPoints) structuralElements.push('bulleted/numbered lists');
    if (hasSectionLabels) structuralElements.push('labeled task sections');

    detected.push({
      dimension: 'structure',
      title: 'Structured Organization',
      detail: `Prompt is organized with ${structuralElements.join(', ')}. Clear boundaries minimize hallucination and instruction drift.`,
    });
  } else {
    missing.push({
      dimension: 'structure',
      title: 'Structural Delimiters',
      detail: 'Prompt is written as an unformatted block. LLMs process tasks better when context, constraints, and instructions are clearly partitioned.',
      suggestedAction: 'Separate the prompt into sections like Context, Objective, Instructions, and Constraints.',
      insertableTemplate: '\n\n## Context\n[Provide background context here]\n\n## Instructions\n1. [Step 1]\n2. [Step 2]\n',
    });
  }

  // ─── 3. Ambiguous Instructions & Clarity ───
  const ambiguousPhrases = [
    { pattern: /\b(make it good|do your best|as best as you can)\b/i, label: 'Subjective quality phrase ("make it good")' },
    { pattern: /\b(etc\.?|and so on|stuff like that)\b/i, label: 'Indefinite list tail ("etc." / "and so on")' },
    { pattern: /\b(clean code|nice design|modern look)\b/i, label: 'Unquantified aesthetic ("clean code" / "nice design")' },
    { pattern: /\b(as appropriate|as needed|if necessary)\b/i, label: 'Ambiguous discretionary phrase ("as appropriate")' },
    { pattern: /\b(quick|fast|soon)\b/i, label: 'Vague speed/scope indicator ("quick")' },
  ];

  const foundAmbiguities: string[] = [];
  for (const item of ambiguousPhrases) {
    if (item.pattern.test(text)) {
      foundAmbiguities.push(item.label);
    }
  }

  if (foundAmbiguities.length > 0) {
    warnings.push({
      dimension: 'ambiguous-instructions',
      title: 'Ambiguous Phrasing Detected',
      detail: `Found phrases that leave too much to model assumption: ${foundAmbiguities.join(', ')}. Replace subjective terms with measurable standards.`,
      suggestedAction: 'Replace vague phrases with explicit criteria or acceptance rules.',
    });
  } else if (text.length > 80) {
    detected.push({
      dimension: 'clarity',
      title: 'Direct & Unambiguous Instructions',
      detail: 'Instructions use direct, concrete imperatives without vague filler or subjective quality terms.',
    });
  }

  // ─── 4. Missing Context & Target Audience ───
  const audiencePatterns = [
    /(?:target audience|for beginners|for developers|for executives|intended for|readers are|for non-technical|stakeholders|user persona)/i,
    /(?:audience:|readers?:|users?:)/i,
  ];
  const contextPatterns = [
    /(?:background|context:|we are building|the scenario is|currently our stack|environment:|prerequisites:)/i,
    /(?:in our company|for our project|system architecture)/i,
  ];

  const hasAudience = audiencePatterns.some((p) => p.test(text));
  const hasContext = contextPatterns.some((p) => p.test(text));

  if (hasAudience && hasContext) {
    detected.push({
      dimension: 'missing-context',
      title: 'Context & Target Audience Provided',
      detail: 'Explicit target audience and environmental context are specified, allowing calibrated technical depth.',
    });
  } else if (!hasAudience && !hasContext) {
    missing.push({
      dimension: 'missing-context',
      title: 'Target Audience & Background Context',
      detail: 'No target audience or operational context found. AI output may misjudge the required technical depth or tone.',
      suggestedAction: 'Define who the output is for and the environment in which it operates.',
      insertableTemplate: '\n\n**Target Audience:** [e.g. Senior Backend Engineers / First-time users]\n**Environment:** [e.g. Production Next.js App / Internal Wiki]',
    });
  } else if (!hasAudience) {
    missing.push({
      dimension: 'missing-context',
      title: 'Target Audience Specification',
      detail: 'Target reader/user is not specified. State whether output is for novices, senior specialists, or cross-functional stakeholders.',
      suggestedAction: 'Specify target audience (e.g., "Audience: Senior developers").',
      insertableTemplate: '\n\n**Target Audience:** [Specify reader/user level]',
    });
  }

  // ─── 5. Output Requirements (Length, Tone, Style) ───
  const outputRequirementPatterns = [
    /(?:concise|detailed|in-depth|exhaustive|brief|under \d+ words|within \d+ paragraphs|\d+ to \d+ sentences)/i,
    /(?:tone:|style:|tone should be|written in a|voice:|professional tone|casual tone|academic tone)/i,
    /(?:single paragraph|bullet points only|step-by-step guide|cheat sheet|executive summary)/i,
  ];
  const hasOutputReqs = outputRequirementPatterns.some((p) => p.test(text));

  if (hasOutputReqs) {
    detected.push({
      dimension: 'output-requirements',
      title: 'Output Requirements & Constraints',
      detail: 'Length, depth, or tone expectations are clearly specified.',
    });
  } else {
    missing.push({
      dimension: 'output-requirements',
      title: 'Output Length & Tone Requirements',
      detail: 'No length or tone bounds provided. The model may generate responses that are either overly terse or exhaustively long.',
      suggestedAction: 'Add desired response length, tone, and depth.',
      insertableTemplate: '\n\n## Output Requirements\n- Length: [e.g., concise, under 300 words]\n- Tone: [e.g., professional, direct, no fluff]\n',
    });
  }

  // ─── 6. Negative Constraints (What NOT to do) ───
  const constraintPatterns = [
    /(?:do not|don't|avoid|never|without using|must not|prohibited|exclude|strictly no|do not include)/i,
    /(?:constraints:|negative constraints:|rules:|limitations:)/i,
  ];
  const hasConstraints = constraintPatterns.some((p) => p.test(text));

  if (hasConstraints) {
    detected.push({
      dimension: 'constraints',
      title: 'Negative Constraints & Boundaries',
      detail: 'Explicit negative constraints ("do not", "avoid") prevent common failure modes and unwanted model behaviors.',
    });
  } else {
    missing.push({
      dimension: 'constraints',
      title: 'Negative Constraints',
      detail: 'No negative constraints specified. Telling the model what NOT to do is one of the highest-impact prompt engineering techniques.',
      suggestedAction: 'Add 2-3 negative constraints (e.g., "Do not use deprecated APIs, do not omit error handling").',
      insertableTemplate: '\n\n## Constraints\n- Do not include conversational filler or pleasantries.\n- Do not use placeholder code or "// TODO" comments.\n',
    });
  }

  // ─── 7. Expected Format ───
  const formatPatterns = [
    /(?:json|yaml|markdown|csv|html|xml|typescript|python|sql|table|interface|schema)\b/i,
    /(?:format as|output format|return as a|respond with only|in the form of)/i,
    /(?:return a json|markdown table|pure code|fenced code block)/i,
  ];
  const hasFormat = formatPatterns.some((p) => p.test(text));

  if (hasFormat) {
    detected.push({
      dimension: 'expected-format',
      title: 'Expected Format Specified',
      detail: 'Explicit response format requested (e.g. JSON, Markdown, Table, Code block).',
    });
  } else {
    missing.push({
      dimension: 'expected-format',
      title: 'Expected Format',
      detail: 'No specific data structure or format requested. The model may alternate between chat prose, code blocks, or narrative.',
      suggestedAction: 'Specify exact output format (e.g. JSON schema, Markdown table, or code-only block).',
      insertableTemplate: '\n\n## Expected Format\nReturn the output in Markdown with headers and bullet points. If providing code, include type annotations.\n',
    });
  }

  // ─── Actionable Synthesis & Suggestions ───
  // Convert top missing elements into actionable suggestions with 1-click templates
  for (const m of missing) {
    if (m.insertableTemplate) {
      suggestions.push({
        dimension: m.dimension,
        title: `Add ${m.title}`,
        detail: m.detail,
        suggestedAction: m.suggestedAction,
        insertableTemplate: m.insertableTemplate,
      });
    }
  }

  return {
    detected,
    missing,
    warnings,
    suggestions,
    analyzedAt: new Date().toISOString(),
  };
}
