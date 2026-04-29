# Tasks: Robust Variable Parsing and Consistency

This document outlines the phased implementation of robust variable parsing and consistency across the application, as defined in `spec.md` and `design.md`.

## Phase 1: Shared Infrastructure

### [Phase 1.1] Create Shared Variable Utility

- **Task**: Create `src/lib/variables.ts` to centralize variable logic.
- **Details**:
  - Define `VARIABLE_NAME_PATTERN = '[a-zA-Z0-9_]{1,64}'`.
  - Define `VARIABLE_REGEX = new RegExp(`{{(${VARIABLE_NAME_PATTERN})}}`, 'g')`.
  - Implement `isValidVariableName(name: string): boolean`.
  - Implement `extractVariables(text: string): string[]`.
  - Implement `interpolateVariables(template: string, values: Record<string, string>, options?: { fallback?: 'keep' | 'empty' }): string`.
- **Verification**: File exists and exports all required utilities with correct types.

### [Phase 1.2] Add Unit Tests for Utility

- **Task**: Create `src/lib/__tests__/variables.test.ts` (or equivalent test location).
- **Details**:
  - Test `extractVariables` with: unique names, duplicates, invalid patterns (spaces, special chars), and empty strings.
  - Test `interpolateVariables` with: valid matches, missing values (check 'keep' vs 'empty' fallback), and special characters in the _replacement values_ (to ensure no regex injection during replacement).
  - Test `isValidVariableName` with valid and invalid inputs.
- **Verification**: Run tests and ensure 100% pass rate for variable logic.

## Phase 2: UI Validation & Configuration

### [Phase 2.1] Update Variable Validation in Modals

- **Task**: Update `src/components/prompts/VariableConfigModal.tsx` to enforce strict naming.
- **Details**:
  - Update the Zod schema for the variable name: `.regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscores allowed")` and `.max(64)`.
- **Verification**: Open the variable config modal in the app and attempt to save a variable with a space or a dash. It should show a validation error.

### [Phase 2.2] Audit Variable List UI

- **Task**: Ensure `src/components/prompts/VariableList.tsx` or related components handle the new constraints gracefully.
- **Verification**: Verify that the UI displays variable names correctly without breaking layouts.

## Phase 3: Editor & Preview Integration

### [Phase 3.1] Refactor PromptEditor Highlighting

- **Task**: Update `src/components/prompts/PromptEditor.tsx` to use the shared `VARIABLE_REGEX`.
- **Details**:
  - Replace any local regex definitions with the import from `@/lib/variables`.
  - Ensure the `formatContent` logic (or equivalent) that wraps variables in `<span>` tags uses the centralized regex.
- **Verification**: Type `{{test_var}}` in the editor and ensure it highlights. Type `{{test-var}}` (invalid) and ensure it does NOT highlight.

### [Phase 3.2] Refactor Public Preview Interpolation

- **Task**: Update `src/components/prompts/PublicPromptClient.tsx` to use `interpolateVariables`.
- **Details**:
  - Replace manual string replacement or `new RegExp` loops with the shared utility.
- **Verification**: View a public prompt, enter variable values, and verify the "Live Preview" updates correctly and safely.

### [Phase 3.3] Refactor "Use" Page Interpolation

- **Task**: Update the interpolation logic in `src/app/(protected)/use/page.tsx` (or the component it uses).
- **Details**:
  - Replace manual interpolation logic with `interpolateVariables`.
- **Verification**: Navigate to the "Use" page for a prompt, fill in variables, and verify the resulting text is correct.

## Phase 4: Hardening & Cleanup

### [Phase 4.1] Remove Unsafe Regex Construction

- **Task**: Search the entire codebase for `new RegExp` calls that involve `{{` or variable names.
- **Details**:
  - Eliminate any instances of `new RegExp('{{' + ...)` or similar dynamic construction.
- **Verification**: `grep` search returns no instances of dynamic regex construction for prompt variables.

### [Phase 4.2] Final Integration Testing

- **Task**: Perform an end-to-end smoke test.
- **Details**:
  - Create a new prompt.
  - Add a variable `user_name`.
  - Use it in the template: `Hello {{user_name}}!`.
  - Go to the "Use" page, type "Alice", and verify it says "Hello Alice!".
- **Verification**: Entire flow works seamlessly with the new utility.

### [Phase 4.3] Lint, Format, and Typecheck

- **Task**: Run project-wide checks.
- **Details**:
  - `pnpm lint`
  - `pnpm format`
  - `pnpm typecheck`
- **Verification**: All commands pass without errors.
