# Design Plan: Variable Reordering with Drag and Drop

Technical design for implementing drag-and-drop reordering for dynamic variables in prompt creation and editing pages using `@dnd-kit`.

### 1. Objective

Enable users to reorder dynamic variables in the sidebar list. The order of variables in the sidebar determines the order they appear when "using" the prompt. This improves the user experience by allowing logical grouping and sequence of input fields.

### 2. Tech Stack

- **Libraries:**
  - `@dnd-kit/core`: Core drag-and-drop primitives.
  - `@dnd-kit/sortable`: Sortable list abstractions.
  - `@dnd-kit/utilities`: Utility functions for transformations and styles.
  - `react-hook-form`: Form state management using `useFieldArray` for efficient array operations.
- **Why this stack?**:
  - `@dnd-kit` is lightweight, highly customizable, and provides excellent accessibility (keyboard support, screen reader announcements) out of the box.
  - `react-hook-form`'s `useFieldArray` is designed specifically for dynamic lists in forms, offering a `move` method that integrates perfectly with `dnd-kit`'s reordering logic.

### 3. High-Level Architecture

- **Frontend**:
  - **VariableList**: A shared component that wraps the variable items in a `DndContext` and `SortableContext`.
  - **SortableVariableItem**: Individual list item component using the `useSortable` hook.
- **State Management**: `react-hook-form` maintains the authoritative state of the variables array. Reordering triggers a `move` operation in `useFieldArray`.
- **Backend**: Convex stores the variables as an array. The order is preserved implicitly by the array index.

**ARCHITECTURE FLOW**:
`User Drags Item` -> `dnd-kit onDragEnd` -> `useFieldArray.move(oldIndex, newIndex)` -> `Form State Update` -> `React Re-render` -> `Submit Form` -> `Backend Save`.

### 4. Data Model

The existing variable schema remains unchanged, but the management shifts to `useFieldArray`.

```typescript
// From promptFormSchema in create/page.tsx
variables: z.array(
  z.object({
    id: z.string(), // Stable UUID
    name: z.string(),
    type: z.enum(['text', 'number', 'textarea', 'choices', 'list']),
    options: z.array(z.string()).optional(),
  }),
);
```

### 5. Core Design Decisions

- **Decision 1: Extract `VariableList` Component**: To ensure consistency between Create and Edit pages and reduce code duplication.
- **Decision 2: Use `useFieldArray`**: Instead of manually managing the array with `watch`/`setValue`, `useFieldArray` provides specialized methods (`move`, `remove`, `append`) that are optimized for form performance and provide stable keys (`field.id`).
- **Decision 3: Drag Handle vs. Row Drag**: Implement a specific drag handle (grip icon) to allow clicking the "Edit" and "Delete" buttons without accidentally triggering a drag operation.
- **Decision 4: Activation Constraint**: Configure a `PointerSensor` with a distance constraint (e.g., 8px) to prevent accidental drags during simple clicks.

### 6. Core Functional Flows

- **A. Initialize List**:
  - Parent component passes `control` from `useForm` to `VariableList`.
  - `VariableList` calls `useFieldArray({ control, name: 'variables' })`.
- **B. Reorder Interaction**:
  - `handleDragEnd` receives `active` (dragged item) and `over` (target position) IDs.
  - Find indices of these IDs within the `fields` array.
  - Call `move(oldIndex, newIndex)`.
- **C. Delete Variable**:
  - Call `remove(index)`.
  - Update prompt content to remove associated placeholders (Regex replacement).

### 7. Development Plan

1.  **Dependencies**: Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
2.  **Sortable Item Component**: Create `src/components/prompts/SortableVariableItem.tsx` with `useSortable`.
3.  **Variable List Component**: Create `src/components/prompts/VariableList.tsx` implementing `DndContext` and `SortableContext`.
4.  **Refactor Create Page**:
    - Implement `useFieldArray` in `src/app/(protected)/prompts/create/page.tsx`.
    - Update `PromptEditor`'s `onVariablesChange` to use `append` from `useFieldArray` instead of `setValue` for adding new variables.
    - Replace manual variables map with `<VariableList />`.
5.  **Refactor Edit Page**:
    - Repeat the same refactoring for `src/app/(protected)/prompts/[id]/edit/page.tsx`.
    - Ensure `reset()` from `react-hook-form` correctly populates the field array when data is loaded from Convex.
6.  **Testing**:
    - Verify smooth drag-and-drop in both pages.
    - Verify keyboard reordering (Space, Arrows, Enter).
    - Ensure "Edit" and "Delete" buttons remain functional.
    - Confirm reordered state persists after saving and reloading.
