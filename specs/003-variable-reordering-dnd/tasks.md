# Tasks: Variable Reordering with Drag and Drop

## [Phase 1] - Foundation & Dependencies
- [x] [Phase 1] Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` packages.
- [x] [Phase 1] Verify `react-hook-form` is correctly configured in the project to support `useFieldArray`.

## [Phase 2] - Core Components Implementation
- [x] [Phase 2] Create `src/components/prompts/SortableVariableItem.tsx` using `useSortable` hook.
- [x] [Phase 2] Implement drag handle (grip icon) in `SortableVariableItem` to prevent accidental drags on buttons.
- [x] [Phase 2] Create `src/components/prompts/VariableList.tsx` to wrap items in `DndContext` and `SortableContext`.
- [x] [Phase 2] Implement `handleDragEnd` logic in `VariableList` using `useFieldArray`'s `move` method.
- [x] [Phase 2] Configure `PointerSensor` with an 8px distance constraint in `VariableList`.

## [Phase 3] - Refactor Create Prompt Page
- [x] [Phase 3] Refactor `src/app/(protected)/prompts/create/page.tsx` to use `useFieldArray` for managing the `variables` field.
- [x] [Phase 3] Update `PromptEditor` integration to use `append` from `useFieldArray` when new variables are detected in the prompt text.
- [x] [Phase 3] Replace the manual variable mapping logic with the new `<VariableList />` component.
- [x] [Phase 3] Ensure "Edit" and "Delete" actions in the sidebar correctly trigger `useFieldArray` methods.

## [Phase 4] - Refactor Refactor Edit Prompt Page
- [x] [Phase 4] Refactor `src/app/(protected)/prompts/[id]/page.tsx` (or edit page) to use `useFieldArray`.
- [x] [Phase 4] Ensure `form.reset()` correctly initializes the `useFieldArray` state when prompt data is loaded from Convex.
- [x] [Phase 4] Replace the manual variable mapping logic with the new `<VariableList />` component.
- [x] [Phase 4] Verify that reordering variables updates the form state correctly before submission.

## [Phase 5] - Verification & Testing
- [x] [Phase 5] Verify smooth drag-and-drop functionality in both Create and Edit pages.
- [x] [Phase 5] Test keyboard accessibility for reordering (using Space, Arrow keys, and Enter).
- [x] [Phase 5] Confirm that "Edit" and "Delete" buttons on variable items remain fully functional and don't trigger drags.
- [x] [Phase 5] Verify that the new variable order is persisted in the database after saving and survives page refreshes.
