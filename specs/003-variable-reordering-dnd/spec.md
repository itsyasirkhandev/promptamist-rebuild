### 1. Problem Statement
When creating or editing a prompt template, users define multiple dynamic variables. Currently, these variables are listed in the order they were created. There is no way for users to reorder them. Reordering is important because it dictates the sequence in which variables are presented to the user when they "use" the prompt (e.g., in a form). Without reordering, users must delete and recreate variables to achieve a specific logical flow.

**Solution:** This feature introduces a drag-and-drop interface in the "Defined Variables" list on both the Create and Edit prompt pages to allow users to reorder variables easily.

### 2. Functional Requirements
* **Drag-and-Drop Interaction:** Implement a drag handle for each variable item in the sidebar list.
* **Array Reordering:** Allow users to drag a variable to a new position within the list, which immediately updates the underlying `variables` array in the `react-hook-form` state.
* **Persistent State:** Ensure the new order is saved to the database when the form is submitted.
* **Visual Feedback:** Provide clear visual indicators during the drag-and-drop process, including:
    * Change in cursor to `grabbing`.
    * A "ghost" or "placeholder" item indicating the original position or the potential drop target.
    * Highlighting the item currently being dragged.
* **Accessibility:** Support keyboard reordering (e.g., Space to pick up, Arrows to move, Space/Enter to drop) to ensure compliance with accessibility standards.
* **Code Reusability:** Extract the variables list into a shared Client Component (e.g., `VariableList`) to be used in both `src/app/(protected)/prompts/create/page.tsx` and `src/app/(protected)/prompts/[id]/edit/page.tsx`.

### 3. Inputs and Outputs / Interaction Behavior
**USER ACTION (INPUT):** User clicks and holds the drag handle of a variable.
**EXPECTED SYSTEM BEHAVIOR:**
* The selected item enters an "active" state and follows the mouse cursor.
* A visual placeholder or ghosting effect appears in the list to indicate the item's original position.
* Other items in the list shift dynamically to show where the active item would land if dropped.

**USER ACTION (INPUT):** User releases the item over a new position.
**EXPECTED SYSTEM BEHAVIOR:**
* The item snaps into the new position within the list.
* The `variables` array in the form state (controlled by `react-hook-form`) is updated to reflect the new order.
* The UI immediately reflects the updated order.

**USER ACTION (INPUT):** User uses keyboard controls (Space to pick up, Up/Down arrows to move, Space to drop).
**EXPECTED SYSTEM BEHAVIOR:**
* Screen reader announcements (if supported by the library) notify the user of the item's current position and movement.
* The item moves logically up or down in the list.
* The form state is updated once the user "drops" the item.

### 4. Constraints
* **Performance:** Drag-and-drop operations must be smooth (60fps) even with multiple variables.
* **Stability:** The layout must remain stable during dragging, avoiding sudden jumps or unexpected shifts in the sidebar.
* **Scrollable Context:** Reordering must work correctly within the `ScrollArea` component used in the sidebar.
* **Library Selection:** Use `@dnd-kit/core` and `@dnd-kit/sortable` as the recommended library for its modularity, performance, and built-in accessibility support.

### 5. Edge Cases and Error Handling
* **Drop Outside List:** If an item is dropped outside the list's valid drop zone, it must return to its original position without updating the state.
* **Single Variable:** If only one variable exists, the drag handle should still be visible but dragging should have no effect on the order.
* **Deleting while Dragging:** The system should handle potential state conflicts gracefully if an item were somehow removed while being dragged (though the current UI makes this difficult).
* **Keyboard Interruptions:** Pressing `Escape` while dragging (via mouse or keyboard) should cancel the operation and return the item to its original position.

### 6. Acceptance Criteria
* Users can reorder variables using mouse drag-and-drop.
* Users can reorder variables using keyboard shortcuts.
* The order of variables is correctly updated in the form state and persists after saving the prompt.
* Visual indicators (active state, ghosting, cursor changes) are clearly visible and intuitive.
* The variables list code is refactored into a reusable component.
* The implementation uses `dnd-kit` and follows its best practices for accessibility and performance.
* Empty states (when no variables are defined) continue to work as expected.
