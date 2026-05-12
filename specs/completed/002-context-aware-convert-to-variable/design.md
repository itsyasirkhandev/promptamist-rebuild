# Context-Aware Convert to Variable Technical Design

**1. Objective**
Enable the "Convert to Variable" button to work without requiring text selection. It will insert a new variable at the user's current cursor position within the `PromptEditor`. The button will remain fully enabled regardless of text selection state, and the UI will gracefully adapt to mobile devices.

**2. Tech Stack**

- **Framework**: React 19 / Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (`Button`), Lucide/Iconify (icons)
- **APIs**: Native DOM `window.getSelection()` and `Range` APIs for tracking cursor within a `contentEditable` div.

**3. High-Level Architecture**

- **UI Component (`PromptEditor.tsx`)**:
  - Remove conditionals that disable or hide the "Convert to Variable" button when no text is selected.
  - Implement a more robust selection change handler that captures the cursor's `Range` regardless of whether text is highlighted (collapsed range).
  - Add logic to append the variable to the end of the editor if no cursor position was previously captured.
- **Parent Component (`PromptForm.tsx`)**:
  - Automatically enable the `isTemplate` switch if a user inserts a variable while the switch is off (to satisfy the "State Independence" requirement where the button functions regardless of the switch state).

**4. Data Model**
No database schema or type changes are required. We will reuse the existing `Variable` and `PromptFormValues` interfaces.

**5. Core Design Decisions**

- **Cursor Tracking**: We use `window.getSelection()` and `selection.getRangeAt(0)` to grab the `Range` inside the `contentEditable` div. We'll capture this during `onKeyUp`, `onMouseUp`, `onFocus`, and `onBlur`. Crucially, we must capture it even if `selection.isCollapsed === true` (no text selected).
- **Mobile Button Visibility**: Previously, the mobile button only appeared if `selectedText` was truthy. We will change it to always display when applicable, positioning it fixed at the bottom (e.g., above the keyboard) to avoid obscuring the text area.
- **Appending Fallback**: If the user has never focused the editor but clicks "Convert to Variable", we will fallback to appending the new variable `<span>` to the end of the editor's innerDOM.

**6. Core Functional Flows**

_Flow 1: Cursor Tracking_

1. User clicks or types in `.prompt-editor`.
2. `handleSelection` fires. It checks if `selection.anchorNode` is inside `editorRef.current`.
3. If inside, it calls `setSavedRange(selection.getRangeAt(0).cloneRange())` and updates `selectedText`. It does this **even if** `text` is empty.

_Flow 2: Button Interaction & State Independence_

1. The "Convert to Variable" button is rendered without `disabled={!selectedText}`.
2. If `isTemplate` is false, the button may still be shown (or its usage will implicitly turn `isTemplate` on).
3. On click, `openVariableModal` opens the `VariableConfigModal`.

_Flow 3: Variable Insertion (Preserving Text Replacement)_

1. User submits the modal. `handleAddVariable` is triggered.
2. If `savedRange` exists:
   - We clear the current window selection.
   - We create the `<span>` element for the variable.
   - **Crucially, we call `savedRange.deleteContents()` to remove highlighted text, if any. This explicitly preserves the existing feature where selected text is replaced by the new variable.**
   - We call `savedRange.insertNode(span)`.
   - We create a new empty text node or move the cursor immediately after the inserted span to ensure the user can keep typing.
3. If `savedRange` does not exist:
   - We append the `<span>` as a child to `editorRef.current`.
4. Finally, `handleInput()` is called to sync the raw `{{variable}}` text back to the `content` form state.

**7. Development Plan**

- **Phase 1: State Tracking Update**
  - Modify `PromptEditor.tsx` `handleSelection` to store `savedRange` for collapsed selections (zero-length). Ensure the check `closest('.prompt-editor')` correctly validates the node is within the editor.
- **Phase 2: UI Updates**
  - Remove `disabled={!selectedText}` from the desktop button in `PromptEditor.tsx`.
  - Remove the `&& selectedText` condition for rendering the mobile floating button.
  - Ensure the button is conditionally rendered based on sensible logic (e.g., always visible if `isTemplate` is true, or always visible).
- **Phase 3: Insertion Logic Updates**
  - Update `handleAddVariable` in `PromptEditor.tsx` to handle insertion at a collapsed range or append to the end of the container.
  - Ensure the cursor is placed after the newly inserted badge.
- **Phase 4: Parent Form State (Optional but recommended)**
  - In `PromptForm.tsx`, when `onVariablesChange` is fired, if `!isTemplate`, optionally call `setValue('isTemplate', true)` so the UI state remains consistent with the presence of variables.
