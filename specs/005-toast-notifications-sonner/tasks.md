# Tasks: Shadcn Sonner Toast Notifications

## [Phase 1] - Foundation & Setup

- [ ] [Phase 1] Install `sonner` package using `pnpm add sonner`.
- [ ] [Phase 1] Verify or install the Shadcn `Toaster` component in `src/components/ui/sonner.tsx`.
- [ ] [Phase 1] Integrate `<Toaster />` into the root layout in `src/app/layout.tsx` within the provider tree.
- [ ] [Phase 1] Configure `<Toaster />` properties for consistent styling, including theme support and rich icons.

## [Phase 2] - Prompt Management Notifications

- [ ] [Phase 2] Implement success and error toasts for the Prompt Creation flow in `CreatePromptPage`.
- [ ] [Phase 2] Implement success and error toasts for the Prompt Update flow in `EditPromptPage`.
- [ ] [Phase 2] Implement success and error toasts for the Prompt Deletion action.
- [ ] [Phase 2] Add a success toast when a prompt's content is successfully copied to the clipboard.

## [Phase 3] - Variable Management Notifications

- [ ] [Phase 3] Add a success toast in `PromptEditor` when a new variable is successfully added.
- [ ] [Phase 3] Add a success toast in `VariableConfigModal` (or parent) when a variable's configuration is updated.
- [ ] [Phase 3] Add an information toast when a variable is removed from the list in `CreatePromptPage` or `EditPromptPage`.

## [Phase 4] - Quality Assurance & Polish

- [ ] [Phase 4] Verify toast positioning and appearance on mobile devices (should be bottom-center).
- [ ] [Phase 4] Ensure toast colors and icons correctly match light and dark themes.
- [ ] [Phase 4] Test rapid successive actions to ensure toasts stack and dismiss correctly without layout shift.
