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

/**
 * Safely renames a variable in the template content.
 * It strictly matches {{oldName}} and replaces it with {{newName}}.
 */
export function renameVariableInContent(
  content: string,
  oldName: string,
  newName: string,
): string {
  return content.replace(VARIABLE_REGEX, (match, name) => {
    if (name === oldName) {
      return `{{${newName}}}`;
    }
    return match;
  });
}

/**
 * Safely removes a variable from the template content.
 * It strictly matches {{variableName}} and removes it completely.
 */
export function removeVariableFromContent(
  content: string,
  variableName: string,
): string {
  return content.replace(VARIABLE_REGEX, (match, name) => {
    if (name === variableName) {
      return '';
    }
    return match;
  });
}
