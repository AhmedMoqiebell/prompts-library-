export interface PromptVariable {
  name: string;
  label: string;
  defaultValue: string;
  raw: string; // e.g. "{{topic:web development}}"
}

/**
 * Extracts variables matching {{variable_name}} or {{variable_name:default_value}}
 */
export function extractVariables(content: string): PromptVariable[] {
  if (!content) return [];
  const regex = /\{\{([a-zA-Z0-9_\-\s]+?)(?::([^}]*))?\}\}/g;
  const variablesMap = new Map<string, PromptVariable>();

  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const raw = match[0];
    const rawName = match[1].trim();
    const defaultValue = match[2] ? match[2].trim() : '';

    // Create a human-friendly label (e.g. "target_audience" -> "Target Audience")
    const label = rawName
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    if (!variablesMap.has(rawName)) {
      variablesMap.set(rawName, {
        name: rawName,
        label,
        defaultValue,
        raw,
      });
    }
  }

  return Array.from(variablesMap.values());
}

/**
 * Replaces all instances of {{variable}} or {{variable:default}} with provided values.
 */
export function substituteVariables(
  content: string,
  values: Record<string, string>,
): string {
  if (!content) return '';
  return content.replace(
    /\{\{([a-zA-Z0-9_\-\s]+?)(?::([^}]*))?\}\}/g,
    (match, p1, p2) => {
      const name = p1.trim();
      const fallback = p2 !== undefined ? p2.trim() : match;
      const userValue = values[name];
      if (userValue !== undefined && userValue.trim() !== '') {
        return userValue;
      }
      return fallback;
    },
  );
}

/**
 * Checks if a string contains any prompt variables.
 */
export function hasVariables(content: string): boolean {
  return /\{\{[a-zA-Z0-9_\-\s]+?(?::[^}]*)?\}\}/.test(content);
}
