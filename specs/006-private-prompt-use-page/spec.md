# Specification: Private Prompt "Use" Page Enhancements

## 1. Problem Statement

Currently, users interacting with their private dynamic prompts face accessibility and usability friction on the "use prompt" page. They cannot easily view or switch between all their available dynamic prompts without navigating away from the current prompt they are using. This breaks their workflow, especially when users want to rapidly execute different prompts.

This makes it difficult for users to:

- Discover and access their other private prompts quickly.
- Switch from one prompt to another seamlessly.
- Maintain context and workflow efficiency, particularly across different screen sizes (desktop vs. mobile).

**Solution:** This feature introduces a dual-view or sidebar approach on desktop and a mobile-friendly switching mechanism on smaller screens, exclusively for the private "use" page.

## 2. Functional Requirements

The system should:

- **Desktop View:** Display a responsive sidebar or split view on the private "use" page that lists all available private dynamic prompts.
- **Mobile View:** Implement a switching mechanism (such as a bottom sheet, dropdown, or horizontally scrollable tab list) to change the active prompt while staying on the same "use" page.
- **Active State:** Clearly highlight the currently active prompt in the list.
- **Scope Restriction:** Ensure these changes apply _only_ to the private prompt "use" page. The public prompt use page must remain entirely unchanged.
- **Seamless Navigation:** Clicking a prompt in the list/dropdown should load the new prompt's dynamic fields and details without requiring a full page reload, or transition smoothly to the appropriate URL.

## 3. Inputs and Outputs: Prompt Switching Behavior

**USER ACTION (INPUT)**

- User clicks on a different prompt from the desktop sidebar.
- User selects a different prompt from the mobile switcher.

**EXPECTED SYSTEM BEHAVIOR**

- The main content area updates to display the selected prompt's details and dynamic input fields.
- The URL updates to reflect the newly selected prompt (e.g., via Next.js routing/Link).
- The selected prompt becomes highlighted in the sidebar (desktop) or switcher (mobile).
- Any entered data in the previously active prompt is discarded (standard navigation behavior).

## 4. Components and Layout

- **Desktop Layout (e.g., `md` breakpoints and up):**
  - **Sidebar:** A scrollable list of private prompts. Displays the prompt title and optionally a brief description or tags.
  - **Main Content Area:** The form to fill in dynamic variables and view/copy the generated prompt output.
- **Mobile Layout (below `md` breakpoints):**
  - **Header/Switcher:** A trigger button that opens a Drawer/Sheet or a Dropdown Menu containing the list of private prompts.
  - **Main Content Area:** The form to fill in dynamic variables.
- **Data Fetching:**
  - Use Convex queries (likely from `src/convex/authed/...`) to fetch the list of the user's private prompts.
  - Ensure the query handles pagination or reasonable limits if the user has a large number of prompts.

## 5. Constraints

- The sidebar/switcher must load quickly, fetching the list of prompts efficiently.
- UI must be built using Tailwind CSS and existing `shadcn/ui` components in the project (e.g., `Sheet`, `DropdownMenu`, `Sidebar`, `ScrollArea`).
- Zero impact on the public prompt page component tree. The layout wrapper for private prompts should be distinct from the public ones.
- Must function flawlessly on standard mobile device dimensions.

## 6. Edge Cases and Error Handling

- **User has only one private prompt:**
  - Desktop: The sidebar shows the single prompt.
  - Mobile: The switcher indicates it's the only prompt available, or is optionally disabled.
- **Prompt fails to load:**
  - Show a toast error ("Failed to load prompt details") and keep the previous prompt active.
- **List of prompts fails to load:**
  - Show an inline error in the sidebar/switcher area with a retry button.
- **Large number of prompts:**
  - Ensure the sidebar and mobile list (e.g., `Sheet`) are properly scrollable.
  - Implement search/filtering within the sidebar if the list exceeds a certain threshold (optional enhancement).

## 7. Acceptance Criteria

This feature is considered complete if:

- On desktop, users see a sidebar listing their private prompts alongside the active prompt form.
- On mobile, users have a clear, accessible way (e.g., a dropdown or sheet) to switch prompts without leaving the "use" page layout context.
- The active prompt is clearly visually indicated in the list/switcher.
- Clicking/selecting a different prompt updates the main view and URL correctly.
- The public prompt page remains entirely untouched and exhibits its original behavior.
- The feature is fully responsive, handling transitions between mobile and desktop gracefully.
- Edge cases (empty states, loading errors) are handled smoothly without crashing the app.
