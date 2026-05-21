/**
 * variable-presentation.ts — Pure HTML/token renderers for prompt variable presentation
 *
 * Contains framework-agnostic token logic and HTML string generators for
 * variable display. Only the HTML renderer is DOM-specific; tokenizeTemplate
 * is safe to call in any environment.
 *
 * Do NOT import React here. UI components consume these outputs directly.
 */

import { cn } from './utils';
import { VARIABLE_REGEX } from './variables';
import { getVariableColorConfig } from './variable-styles';
import type { Variable } from './variables';

export type TemplateToken =
  | { kind: 'text'; content: string }
  | { kind: 'variable'; name: string; variable: Variable | undefined };

/**
 * Splits a template string into an array of text and variable tokens.
 *
 * @param content - The raw template string (e.g. "Hello {{name}}!")
 * @param variables - The list of known variables to match against
 * @returns An ordered array of TemplateToken discriminated union objects
 */
export function tokenizeTemplate(
  content: string,
  variables: Variable[],
): TemplateToken[] {
  if (!content) return [];

  // Split on {{name}} patterns, keeping the delimiters in the result
  const parts = content.split(/({{[^{}]{1,64}}})/g);

  return parts
    .filter((part) => part !== '')
    .map((part): TemplateToken => {
      const match = /^{{([^{}]{1,64})}}$/.exec(part);
      if (match) {
        const name = match[1];
        const variable = variables.find((v) => v.name === name);
        return { kind: 'variable', name, variable };
      }
      return { kind: 'text', content: part };
    });
}

/**
 * Generates an HTML string suitable for use in a `contentEditable` div.
 *
 * Matched variables are rendered as non-editable styled spans with a
 * `data-variable-id` attribute. Unrecognised `{{name}}` tokens are left
 * as plain text so the editor can still display them.
 *
 * @param content - The raw template string
 * @param variables - The list of known variables used for look-up and styling
 * @returns An HTML string ready to be assigned to `element.innerHTML`
 */
export function renderEditorHtml(
  content: string,
  variables: Variable[],
): string {
  // Replicate the exact same output as the original formatContent in PromptEditor.tsx
  return content.replace(VARIABLE_REGEX, (match, name) => {
    const variable = variables.find((v) => v.name === name);
    if (variable) {
      const colors = getVariableColorConfig(variable.type);
      return `<span class="${cn('rounded px-1 font-mono select-all', colors.badge)}" data-variable-id="${variable.id}" contenteditable="false">${match}</span>`;
    }
    return match;
  });
}
