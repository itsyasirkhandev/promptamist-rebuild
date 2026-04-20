### 1. Problem Statement

While the codebase already calls `toast()` from the `sonner` library during prompt actions (creation, update, deletion, and copy to clipboard), the feedback is not visible to the user. This is because the mandatory `<Toaster />` component has not been integrated into the root layout of the application. Without visible confirmation, users are left uncertain if their actions (like saving a complex template or deleting a prompt) were successful.

### 2. Functional Requirements

- **Integrate Toaster Component**: Mount the `shadcn/ui` (Sonner) `<Toaster />` component in the root layout to enable global notification visibility.
- **Global Feedback**: Ensure all primary actions (Create, Update, Delete) display success/error notifications.
- **Copy Feedback**: Provide immediate confirmation when a prompt or its content is copied to the clipboard.
- **Interactive Variable Feedback**: Display notifications when variables are added, updated, or removed in the `PromptEditor`.
- **Consistent Styling**: Ensure notifications are correctly styled using the application's theme variables and icons.

### 3. Inputs and Outputs / Interaction Behavior

| USER ACTION (INPUT)         | EXPECTED SYSTEM BEHAVIOR (OUTPUT)          | TOAST MESSAGE (EXAMPLE)                         |
| :-------------------------- | :----------------------------------------- | :---------------------------------------------- |
| Click "Save Prompt" (New)   | Prompt is created in DB and page redirects | "Prompt created successfully" (Success)         |
| Click "Save Changes" (Edit) | Prompt is updated in DB and page redirects | "Prompt updated successfully" (Success)         |
| Click "Delete" and Confirm  | Prompt is removed from DB                  | "Prompt deleted" (Success)                      |
| Click "Copy"                | Content is added to clipboard              | "Copied to clipboard" (Success)                 |
| Convert text to Variable    | Variable is added to the editor            | "Variable '{{name}}' added" (Info/Success)      |
| Click "Update Variable"     | Variable settings are modified             | "Variable updated" (Info)                       |
| Remove Variable             | Variable is deleted from list/content      | "Variable removed" (Warning/Info)               |
| Failed DB Operation         | Error caught in catch block                | "Failed to [action]. Please try again." (Error) |

### 4. Constraints

- **Mounting Location**: The `<Toaster />` must be placed at the root level (e.g., in `RootLayout`) to ensure it persists across page transitions.
- **Duration**: Toasts should stay visible for approximately 3-5 seconds.
- **Responsiveness**: Notifications must be positioned correctly on both mobile (bottom center) and desktop (bottom right).
- **Performance**: Sonner is highly optimized; ensure its integration doesn't cause unnecessary re-renders in the main layout.

### 5. Edge Cases and Error Handling

- **Rapid Multiple Actions**: If a user clicks "Copy" multiple times, toasts should stack or update gracefully without cluttering the screen.
- **Long Messages**: Very long toast messages should wrap correctly or be truncated with an ellipsis.
- **Theme Switching**: Toasts must adapt their colors if the user switches between light and dark modes (handled by `next-themes` integration in `sonner.tsx`).
- **Network Failure**: If a mutation fails (e.g., timeout), an error toast must be shown with a descriptive message instead of a generic "Something went wrong" if possible.

### 6. Acceptance Criteria

- The `<Toaster />` component is present in `src/app/layout.tsx`.
- A success toast appears when a new prompt is created.
- A success toast appears when an existing prompt is updated.
- A success toast appears when a prompt is deleted.
- A success toast appears when content is copied to the clipboard in both `PromptCard` and `UseTemplatePage`.
- A toast notification appears when a variable is created or updated in the `PromptEditor`.
- Error toasts appear if any of the above operations fail.
- Toasts are properly styled with icons (success/error/info) as defined in `src/components/ui/sonner.tsx`.
