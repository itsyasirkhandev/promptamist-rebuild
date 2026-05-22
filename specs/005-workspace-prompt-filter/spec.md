# Workspace Prompt Filter Specification

**1. Problem Statement**
Users currently find the workspace filter UI disconnected from the prompt searching experience. On the `/prompts` page, tags are used as filters right below the search input, creating a cohesive experience. In the workspace (`/use`), filtering is done via a separate dropdown button outside the search popover, and users find this unintuitive since switching between prompts relies on both searching and filtering simultaneously.

**2. Functional Requirements**

- Relocate the tag filter functionality directly inside the `PromptSwitcher` combobox popover, immediately beneath the command input.
- Allow users to select and toggle multiple tags to filter the list of prompts (maintaining current multi-select behavior).
- Remove the existing standalone filter icon button from the workspace.
- The list of available tags inside the popover should match the tags available from all user prompts.
- Provide a horizontal scroll area for the tag badges (like on the `/prompts` page) to prevent the popover from overflowing if there are many tags.

**3. Inputs and Outputs: Primary Actions**

- USER ACTION: Clicks the Prompt Switcher to open the combobox popover.
- SYSTEM BEHAVIOR: Opens the popover displaying the search input, a row of selectable tag badges, and the list of prompts.
- USER ACTION: Clicks on a tag badge.
- SYSTEM BEHAVIOR: Toggles the tag selection state (multi-select supported). Filters the prompt list in the combobox to only show prompts containing all selected tags.
- USER ACTION: Types in the search input while tags are selected.
- SYSTEM BEHAVIOR: Filters the prompt list by both the selected tags AND the search text.

**4. Constraints**

- UI Consistency: The visual presentation of the tag badges should closely match the `Badge` implementation found on the `/prompts` page (e.g., using `ScrollArea` and `Badge` components).
- Real-time Filtering: Filtering prompts by tags and search text must happen instantaneously on the client side.

**5. Edge Cases and Error Handling**

- No Tags Available: If the user has no prompts with tags, the tag filter section (ScrollArea and Badges) should not render.
- No Prompts Match: If the combination of selected tags and search text yields no results, display the standard "No prompt found." empty state.
- Very Long Tag Names: Badge layout should gracefully handle long individual tag names without breaking the popover layout.

**6. Acceptance Criteria**

- The external filter button next to the Prompt Switcher is completely removed.
- A horizontally scrollable list of tag badges appears inside the Prompt Switcher popover beneath the search input.
- Users can click multiple tags to toggle them on and off (multi-select).
- The displayed prompts are accurately filtered down to those containing all active tags.
- The user can concurrently search by text, which narrows down the tag-filtered results further.
