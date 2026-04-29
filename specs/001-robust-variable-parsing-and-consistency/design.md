# Design 001: Robust Variable Parsing and Consistency

## 1. Objective

Eliminate security risks associated with dynamic regular expression construction (Regex Injection/ReDoS) and ensure consistent variable detection and interpolation across the entire application (Editor, Usage Page, Public View, and Backend).

## 2. Tech Stack

- **TypeScript**: For type-safe utility functions.
- **Zod**: For enforcing variable name constraints in the UI.
- **React (Next.js)**: For UI components.
- **Convex**: For backend consistency (shared logic).

## 3. High-Level Architecture

The logic for variable handling will be centralized in a shared utility module. This module will be used by all layers of the application to ensure that "what you see is what you get" (WYSIWYG) consistency.

- **Shared Utility (`src/lib/variables.ts`)**: Contains the source of truth for the variable regex, extraction, and interpolation logic.
- **Frontend (UI Components)**: Uses the utility for real-time validation, syntax highlighting in the editor, and live preview interpolation.
- **Backend (Convex)**: Although currently primarily handled on the client, the utility is designed to be imported into Convex functions for server-side validation or processing if needed.

## 4. Data Model

While the schema in `convex/schema.ts` remains unchanged, the **validation logic** applied to the `variables` array in the `prompts` table will be tightened.

### Variable Name Constraints

- **Character Set**: Alphanumeric (`a-z`, `A-Z`, `0-9`) and Underscores (`_`).
- **Length**: 1 to 64 characters.
- **Regex Enforcement**: `/^[a-zA-Z0-9_]{1,64}$/`.

## 5. Core Design Decisions

### 5.1 Static vs. Dynamic Regex

We will move away from `new RegExp('{{' + name + '}}')`.

- **Why**: Dynamic construction is prone to Regex Injection if the `name` contains special characters (e.g., `{{.*}}`). Even if names are validated, a static regex is more performant and less error-prone.
- **Solution**: Use a single static regex `/{{([a-zA-Z0-9_]{1,64})}}/g` to find all placeholders and handle the logic in the replacement callback.

### 5.2 Single Source of Truth for Patterns

The pattern `{{name}}` is hardcoded in the static regex. This ensures that the parser used for highlighting in the editor is identical to the one used for interpolation in the preview.

### 5.3 Shared Utility Location

The utility will be placed in `src/lib/variables.ts`.
_Note: For Convex to use this, it should be portable. We will ensure it has no browser-only dependencies._

## 6. Core Functional Flows

### 6.1 Variable Utility (`src/lib/variables.ts`)

```typescript
export const VARIABLE_NAME_PATTERN = '[a-zA-Z0-9_]{1,64}';
export const VARIABLE_REGEX = new RegExp(`{{(${VARIABLE_NAME_PATTERN})}}`, 'g');

/**
 * Validates if a variable name meets the strict constraints.
 */
export function isValidVariableName(name: string): boolean {
  return new RegExp(`^${VARIABLE_NAME_PATTERN}$`).test(name);
}

/**
 * Extracts unique variable names from a string.
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
 * Interpolates values into a template.
 * Safely replaces {{name}} with values[name].
 */
export function interpolateVariables(
  template: string,
  values: Record<string, string>,
  options: { fallback?: 'keep' | 'empty' } = { fallback: 'keep' },
): string {
  return template.replace(VARIABLE_REGEX, (match, name) => {
    if (Object.prototype.hasOwnProperty.call(values, name)) {
      return values[name];
    }
    return options.fallback === 'empty' ? '' : match;
  });
}
```

### 6.2 Editor Syntax Highlighting (`PromptEditor.tsx`)

The editor will use the `VARIABLE_REGEX` to transform raw text into styled spans.

```typescript
const formatContent = (rawContent: string) => {
  return rawContent.replace(VARIABLE_REGEX, (match, name) => {
    const variable = variables.find((v) => v.name === name);
    if (variable) {
      return `<span class="..." data-variable-id="${variable.id}" ...>${match}</span>`;
    }
    // Optional: Highlight unknown variables differently or keep as text
    return match;
  });
};
```

### 6.3 UI Validation (`VariableConfigModal.tsx`)

Update Zod schema to enforce the character set and length.

```typescript
const variableSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(64, 'Name is too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed'),
  // ...
});
```

### 6.4 Safe Interpolation (`UseTemplatePage.tsx`, `PublicPromptClient.tsx`)

Replace manual loops and `new RegExp` calls with `interpolateVariables`.

```typescript
const interpolatedContent = useMemo(() => {
  return interpolateVariables(prompt.content, formValues);
}, [prompt.content, formValues]);
```

## 7. Security Detail

### 7.1 Prevention of Regex Injection

By never passing user input into the `RegExp` constructor, we eliminate the risk of users providing patterns like `{{.*}}` or `{{.+}}` which could be used to bypass validation or craft malicious matchers.

### 7.2 ReDoS Protection

The `VARIABLE_REGEX` uses a simple, non-nested quantifier `[a-zA-Z0-9_]{1,64}`. This pattern is deterministic and performs a linear scan of the input. There is no risk of exponential backtracking (catastrophic backtracking) regardless of the input text or variable names.

## 8. Development Plan

### Phase 1: Shared Infrastructure

1. Create `src/lib/variables.ts` with the regex and utility functions.
2. Add comprehensive unit tests for the utility.

### Phase 2: UI Updates

1. Update `VariableConfigModal.tsx` to enforce the new validation rules.
2. Update `PromptEditor.tsx` to use the shared regex for formatting.
3. Update `UseTemplatePage.tsx` and `PublicPromptClient.tsx` to use `interpolateVariables`.

### Phase 3: Migration & Consistency

1. Verify that existing prompts with spaces in variables are handled gracefully (they may need manual renaming if they no longer match the regex).
2. Perform a final audit of all `new RegExp` calls in the codebase related to prompt variables.

## 9. Testing Strategy

- **Unit Tests (`variables.test.ts`)**:
  - `extractVariables`: verify it finds multiple vars, ignores invalid ones, handles duplicates.
  - `interpolateVariables`: verify it replaces correctly, handles missing values, and is immune to regex-special-characters in the _values_.
- **E2E Tests**:
  - Create a prompt with a variable.
  - Go to "Use" page.
  - Fill value and verify preview updates correctly.
  - Attempt to create a variable with a space and verify it's blocked.
