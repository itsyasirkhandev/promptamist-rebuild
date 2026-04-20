### 1. Problem Statement

The application currently only supports a single theme (likely light by default), which can be fatiguing for users who prefer dark mode or work in low-light environments. Adding theme support improves accessibility and user experience.

### 2. Functional Requirements

- Add support for switching between Light, Dark, and System themes.
- Persist theme preference across sessions using `next-themes`.
- Provide a UI toggle (Dropdown or Button) for users to switch themes.
- Ensure Clerk components (Sign-in, Sign-up, User Profile) adapt to the current theme.
- Ensure all `shadcn/ui` components respond correctly to theme changes.

### 3. Inputs and Outputs / Interaction Behavior

**USER ACTION (INPUT):** User clicks the theme toggle in the header/sidebar.
**EXPECTED SYSTEM BEHAVIOR:**

- Show options: "Light", "Dark", "System".
- When an option is selected, the application's CSS variables update immediately.
- The selection is saved in `localStorage`.
- The application should reflect the theme change across all components, including Clerk modals and buttons.

### 4. Constraints

- No "flash of unstyled content" (FOUC) when loading the theme.
- Consistent color palette across all pages.
- Accessible contrast ratios in both modes.

### 5. Edge Cases and Error Handling

- **System Preference Changes:** The app should react to OS-level theme changes when set to "System".
- **Clerk Loading States:** Ensure Clerk components don't flicker between themes during initialization.

### 6. Acceptance Criteria

- Theme toggle is accessible and functional.
- Dark mode colors are correctly applied to the entire UI.
- Light mode remains visually consistent.
- The user's theme choice is remembered on page reload.
- Clerk components match the selected theme.
