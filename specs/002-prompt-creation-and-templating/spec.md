### 1. Problem Statement

Users frequently use similar prompts with minor variations, leading to repetitive typing and inefficiency. Currently, there is no system to save prompts, categorize them, or create reusable templates with dynamic variables, slowing down the workflow.
**Solution:** This feature introduces a comprehensive prompt creation and management system, allowing users to save both static prompts and dynamic templates, along with tags for easy categorization and a dedicated interface for filling out template variables.

### 2. Functional Requirements

- Provide a `/create` page to author new prompts.
- Allow users to set a Prompt Title, Prompt Content, and add Tags.
- Include a toggle switch to enable/disable "Templating" (Dynamic Prompt mode).
- When templating is enabled, provide a mechanism (button in the bottom right corner) to convert selected text within the content area into a dynamic field.
- Require text selection to enable the "convert to variable" button.
- Display a modal to configure the dynamic field: Field Name and Field Type (text, number, textarea, choices (single select), list (multiple select)).
- Display an "Add Options" button for single/multi-select field types within the modal.
- Visually highlight dynamic fields within the prompt content area when added.
- Display a list of defined dynamic fields on the `/create` page with their Name, Type, and options to Edit or Delete them.
- Allow changing Name and Type when editing a field.
- Provide a `/prompts` page to list all saved prompts (both static and dynamic).
- Display Prompt Title, Creation Time, and Tags on each prompt list item.
- Provide a "Use template" button for dynamic prompts that navigates to a usage page.
- Provide a "Copy prompt" button directly on the `/prompts` list for static prompts.
- Provide a "Delete" button with a confirmation dialog for all prompts.
- Provide a dedicated Use Template page with a split-screen layout: an input form for defined fields on the left, and a live preview of the generated prompt on the right.
- Ensure clear, easy navigation (back/forward) across all prompt-related pages to enhance the user experience.

### 3. Inputs and Outputs / Interaction Behavior

**USER ACTION (INPUT):** User selects text in the content area and clicks the "Convert to Variable" button (templating enabled).
**EXPECTED SYSTEM BEHAVIOR:**

- Open a modal to configure the variable.
- Prepare the selected text to be replaced by the variable placeholder.

**USER ACTION (INPUT):** User configures a dynamic field (Name: "Tone", Type: "choices") and clicks "Add Field".
**EXPECTED SYSTEM BEHAVIOR:**

- Close the modal.
- Replace the selected text in the content area with a highlighted placeholder (e.g., `{{Tone}}`).
- Add the field to the list of defined fields below the content area.

**USER ACTION (INPUT):** User clicks "Use template" on a dynamic prompt card on the `/prompts` page.
**EXPECTED SYSTEM BEHAVIOR:**

- Navigate to the Use Template page.
- Render input fields on the left side based on the template's defined variables (e.g., a dropdown for "Tone").
- Display the prompt template on the right side with placeholders.

**USER ACTION (INPUT):** User fills in data on the Use Template page form.
**EXPECTED SYSTEM BEHAVIOR:**

- Instantly update the live preview on the right side, replacing placeholders with the entered data.

### 4. Constraints

- The application must handle text selection reliably within the content area for converting to variables (may require a custom rich text editor or overlay).
- The Use Template page split-screen layout must be responsive (e.g., stack vertically on mobile screens).
- Highlighting variables within a standard textarea may be technically difficult; a specialized component or rich text editor is required to support partial text styling.
- Navigation should feel seamless, utilizing client-side routing.

### 5. Edge Cases and Error Handling

- **No text selected:** If the user clicks "Convert to variable" without selecting text, the system should show a toast notification: "Please select text in the prompt content first."
- **Duplicate field names:** If a user tries to create a variable with a name that already exists in the current prompt, show an error message: "A field with this name already exists."
- **Deleting a field used in content:** If a user deletes a field from the list, remove its highlighting in the content area and revert it to plain text or a broken placeholder state, and warn the user.
- **Empty required fields on Use Template page:** If the user tries to copy the generated prompt without filling all required template variables, show a warning or highlight the missing fields.
- **Overlapping variables:** Prevent users from selecting text that already contains a variable placeholder to create a nested variable.
- **Large number of fields:** The list of fields on `/create` should scroll independently to not affect the overall page layout.

### 6. Acceptance Criteria

- Users can successfully navigate to the `/create` page and save a static prompt.
- Users can enable templating and convert selected text into a dynamic variable with a modal.
- Users can add single/multi-select options to variables in the modal.
- Added dynamic variables are visually highlighted in the content area.
- The `/prompts` page lists all prompts correctly with titles, times, and tags.
- Static prompts have a "Copy prompt" button directly on the `/prompts` list.
- Dynamic prompts have a "Use template" button on the `/prompts` list.
- Clicking "Use template" opens a split-screen layout with an input form on the left and a live preview on the right.
- The Use Template page successfully replaces placeholders with user input in real-time.
- Users can copy the generated prompt from the Use Template page.
- Deleting a prompt prompts a confirmation dialog.
- The interface features easy back/forward navigation and enhanced UX across all prompt-related pages.
