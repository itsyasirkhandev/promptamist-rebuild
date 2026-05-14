/**
 * variable-styles.ts — UI color/styling config for prompt variable types
 *
 * Keeps Tailwind class strings isolated from pure string-logic functions.
 * Only import this from UI components — never from server-side or test code.
 */

import type { Doc } from '../../convex/_generated/dataModel';

export type VariableType = Doc<'prompts'>['variables'][number]['type'];

const variableTypeColors: Record<
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

function isVariableType(type: string): type is VariableType {
  return type in variableTypeColors;
}

export function getVariableColorConfig(type: string | VariableType) {
  if (isVariableType(type)) {
    return variableTypeColors[type];
  }
  return {
    badge: 'bg-secondary/30 text-muted-foreground',
    input: 'focus-visible:ring-ring',
  };
}
