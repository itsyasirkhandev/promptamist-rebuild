# Context-Aware Convert to Variable Implementation Tasks

**Overview**
This implementation focuses on updating the React frontend (`PromptEditor` and `PromptForm`) to support context-aware variable insertion without requiring text selection. The work is divided into updating the selection tracking logic, modifying button UI constraints, implementing the DOM `Range` insertion logic, and ensuring the parent form's template state stays synchronized.

## Phases

### Phase 1: Selection & State Tracking Update

_(Sequential: Must be completed before Phase 3)_

- [ ] `[Phase 1]` In `src/components/prompts/PromptEditor.tsx`, modify the `handleSelection` function to always update `savedRange` and `selectedText` (even if empty) as long as the `selection.anchorNode` is contained within the `.prompt-editor` container. This ensures we track collapsed selections (cursor position) **while preserving the existing functionality that captures highlighted text.**

### Phase 2: UI & Accessibility Updates

_(Parallelizable with Phase 1)_

- [ ] `[Phase 2]` In `src/components/prompts/PromptEditor.tsx`, remove the `disabled={!selectedText}` property from the desktop "Convert to Variable" button.
- [ ] `[Phase 2]` In `src/components/prompts/PromptEditor.tsx`, remove the `&& selectedText` condition from the mobile floating button so it is always accessible when the editor is in template mode.

### Phase 3: DOM Insertion Logic

_(Sequential: Relies on Phase 1 state tracking)_

- [ ] `[Phase 3]` In `src/components/prompts/PromptEditor.tsx`, update `handleAddVariable` to insert the new variable `<span>` at `savedRange` using `savedRange.insertNode()`. **Ensure any currently selected text is deleted first via `savedRange.deleteContents()`, exactly preserving the previous text-replacement behavior.**
- [ ] `[Phase 3]` In `src/components/prompts/PromptEditor.tsx`, implement a fallback in `handleAddVariable` to append the variable `<span>` as a child to the end of `editorRef.current` if no valid `savedRange` exists.
- [ ] `[Phase 3]` In `src/components/prompts/PromptEditor.tsx`, after insertion, utilize the Selection API to move the user's cursor immediately after the newly inserted variable badge so typing can continue seamlessly.

### Phase 4: Parent Form State Synchronization

_(Parallelizable with Phase 1-3)_

- [ ] `[Phase 4]` In `src/components/prompts/PromptForm.tsx`, update the `onVariablesChange` callback passed to `PromptEditor`. If `vars.length > variables.length` and `isTemplate` is currently false, automatically call `setValue('isTemplate', true)` to keep the switch state synchronized with the presence of variables.

## Parallelization Strategy

- **Phase 1 and Phase 2** can be implemented in parallel as they touch independent aspects of the `PromptEditor.tsx` file (event handler logic vs. JSX markup).
- **Phase 4** can be done entirely independently from Phases 1-3, as it involves the parent component (`PromptForm.tsx`).
- **Phase 3** should ideally follow Phase 1 to ensure the `savedRange` is reliably captured before attempting to test the precise cursor insertion logic.
