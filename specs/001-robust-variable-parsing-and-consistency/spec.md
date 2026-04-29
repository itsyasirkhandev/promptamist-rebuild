# Spec 001: Robust Variable Parsing and Consistency

## 1. Problem Statement

The current implementation of variable parsing in the prompt editor and template usage pages relies on dynamic regular expression creation using user-provided variable names. This presents a security risk, specifically Regex Injection and potential Regular Expression Denial of Service (ReDoS). Furthermore, the logic for detecting and extracting variables from prompt content is duplicated and inconsistent across different parts of the application (e.g., `PromptEditor.tsx`, `use/page.tsx`, and `PublicPromptClient.tsx`).

## 2. Goals

- Eliminate the risk of Regex Injection by moving away from dynamic, unescaped `new RegExp()` calls.
- Define a strict, safe character set for variable names.
- Centralize variable extraction and interpolation logic into a shared utility used by both the frontend and backend.
- Ensure consistent behavior for variable detection (e.g., `{{variable_name}}`) throughout the system.

## 3. Functional Requirements

### 3.1 Variable Name Constraints

- Variable names MUST only contain alphanumeric characters (`a-z`, `A-Z`, `0-9`) and underscores (`_`).
- Variable names MUST NOT contain spaces, special characters, or regex reserved characters.
- Variable names MUST be between 1 and 64 characters long.
- _Rationale_: Restricting the character set simplifies parsing and completely avoids injection risks during string-to-regex conversion.

### 3.2 Shared Variable Utility

A shared utility module (e.g., `src/lib/variables.ts`) will be created to handle all variable-related operations:

- **`extractVariables(text: string): string[]`**: Finds all unique variable names within `{{name}}` placeholders.
- **`interpolateVariables(template: string, values: Record<string, string>): string`**: Replaces all placeholders with provided values safely.
- \*\*`VARIABLE_REGEX`: A static regular expression for matching `{{name}}` placeholders based on the defined constraints.

### 3.3 Robust Parsing Rules

- The parser MUST use a fixed regular expression that matches the `{{name}}` pattern where `name` follows the constraints in 3.1.
- Example regex: `/{{([a-zA-Z0-9_]+)}}/g`.
- The parser MUST NOT use dynamic regex construction (e.g., `new RegExp('{{' + name + '}}')`) unless the name is strictly validated or escaped first.

### 3.4 UI & UX Requirements

- **Validation**: The `VariableConfigModal` must enforce the new name constraints. Existing variables that don't match should be flagged or automatically migrated.
- **Auto-detection**: The `PromptEditor` should use the shared `extractVariables` logic to identify placeholders and apply styling (spans).
- **Consistency**: The "Live Preview" on the usage page and the public view must use the same `interpolateVariables` logic.

## 4. User Stories & Use Cases

### 4.1 Creating a Variable

**As a prompt engineer**, I want to create a variable named `tone_of_voice` so that I can dynamically change the output.

- **Input**: User types "tone of voice" in the name field.
- **System Behavior**: The UI shows a validation error because spaces are not allowed.
- **Input**: User types "tone_of_voice".
- **System Behavior**: Validation passes, and the variable is added as `{{tone_of_voice}}`.

### 4.2 Handling Malicious Input

**As a malicious user**, I try to create a variable named `.*` to cause a ReDoS or bypass security filters.

- **Input**: User attempts to save a variable with name `.*`.
- **System Behavior**: The system rejects the name based on the strict alphanumeric + underscore constraint.

### 4.3 Consistent Rendering

**As a user**, I expect that a placeholder like `{{user_name}}` works exactly the same in the editor, the preview, and the final exported prompt.

- **System Behavior**: All three components use the same shared utility to find and replace `{{user_name}}`.

## 5. Technical Constraints

- **Environment**: The shared utility must be compatible with both the browser (Next.js client components) and the Convex environment (Node.js/V8 runtime).
- **Performance**: Variable extraction must be efficient even for large prompt templates (up to 50,000 characters).
- **No Dependencies**: The core parsing logic should ideally rely on native JavaScript `String` and `RegExp` methods to avoid heavy dependencies.

## 6. Edge Cases and Error Handling

- **Nested Braces**: `{{ {{var}} }}` should be handled gracefully (inner-most match or ignore). Standard behavior: match `{{var}}` only if name constraints are met.
- **Unclosed Braces**: `{{var` should be ignored and treated as plain text.
- **Missing Values**: If a variable is present in the text but no value is provided during interpolation, it should either remain as `{{name}}` or be replaced with an empty string (configurable, default: remain).
- **Overlapping Names**: (No longer an issue with strict extraction, but worth noting).

## 7. Acceptance Criteria

- [ ] A shared utility `src/lib/variables.ts` (or similar) is implemented.
- [ ] `extractVariables` correctly identifies all `{{alpha_numeric_underscore}}` patterns.
- [ ] `interpolateVariables` replaces placeholders without using `new RegExp(user_input)`.
- [ ] `VariableConfigModal` validation matches the spec (alphanumeric + underscore).
- [ ] `PromptEditor` styling uses the shared extraction logic.
- [ ] `UseTemplatePage` (interpolation) uses the shared utility.
- [ ] `PublicPromptClient` uses the shared utility.
- [ ] Unit tests verify that names like `{{constructor}}`, `{{__proto__}}`, or regex-breaking characters are handled safely.
