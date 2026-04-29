export const VARIABLE_NAME_PATTERN = /^[^{}]{1,64}$/;
export const VARIABLE_REGEX = /{{([^{}]{1,64})}}/g;

/**
 * Validates if a string is a valid variable name.
 * A valid variable name is 1-64 characters long and does not contain curly braces.
 */
export function isValidVariableName(name: string): boolean {
  return VARIABLE_NAME_PATTERN.test(name);
}

/**
 * Extracts all unique variable names from a template string.
 * Variables are in the format {{variable_name}}.
 */
export function extractVariables(text: string): string[] {
  const matches = text.matchAll(VARIABLE_REGEX);
  const variables = new Set<string>();
  for (const match of matches) {
    variables.add(match[1]);
  }
  return Array.from(variables);
}

/**
 * Interpolates variables in a template string with provided values.
 *
 * @param template The template string containing variables like {{name}}.
 * @param values A record of variable names and their replacement values.
 * @param options Options for interpolation.
 * @param options.fallback What to do if a variable is missing in values.
 *                         'keep' (default): Keep the {{variable}} in the text.
 *                         'empty': Replace the variable with an empty string.
 */
export function interpolateVariables(
  template: string,
  values: Record<string, string>,
  options: { fallback?: 'keep' | 'empty' } = {},
): string {
  const { fallback = 'keep' } = options;

  return template.replace(VARIABLE_REGEX, (match, name) => {
    const value = values[name];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
    return fallback === 'keep' ? match : '';
  });
}

import type { Doc } from '../../convex/_generated/dataModel';

export type VariableType = Doc<'prompts'>['variables'][number]['type'];

export const variableTypeColors: Record<
  VariableType,
  { badge: string; input: string }
> = {
  text: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    input: 'focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50',
  },
  number: {
    badge:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    input:
      'focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50',
  },
  textarea: {
    badge:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    input:
      'focus-visible:ring-purple-500/50 dark:focus-visible:ring-purple-500/50',
  },
  choices: {
    badge:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    input:
      'focus-visible:ring-orange-500/50 dark:focus-visible:ring-orange-500/50',
  },
  list: {
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    input: 'focus-visible:ring-rose-500/50 dark:focus-visible:ring-rose-500/50',
  },
} as const;

export function isVariableType(type: string): type is VariableType {
  return type in variableTypeColors;
}

export function getVariableColorConfig(type: string | VariableType) {
  if (isVariableType(type)) {
    return variableTypeColors[type];
  }
  return {
    badge: 'bg-secondary/30 text-muted-foreground',
    input: 'focus-visible:ring-ring', // standard default
  };
}
