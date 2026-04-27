# Private Prompt "Use" Page Tasks

## Phase 1: Component Creation

- [ ] [Phase 1] Create `PromptUseSidebar` component (`src/components/prompts/use/PromptUseSidebar.tsx`) following the design specs with search input and `ScrollArea`.
- [ ] [Phase 1] Create `PromptUseMobileSwitcher` component (`src/components/prompts/use/PromptUseMobileSwitcher.tsx`) using `shadcn/ui` `Select` component for mobile navigation.
- [ ] [Phase 1] Create `PromptUseLayout` component (`src/components/prompts/use/PromptUseLayout.tsx`) to serve as the responsive wrapper combining the sidebar, mobile switcher, and main content.

## Phase 2: Data Integration & State Logic

- [ ] [Phase 2] In `PromptUseLayout`, implement data fetching using Convex query `api.authed.prompts.getPrompts`.
- [ ] [Phase 2] Implement client-side filtering in `PromptUseLayout` to ensure only prompts with `isTemplate === true` are passed to child components.
- [ ] [Phase 2] Implement search filtering logic within `PromptUseSidebar` to filter the passed prompts based on the search query.
- [ ] [Phase 2] Implement Next.js `useRouter` routing logic in `PromptUseMobileSwitcher` to navigate on selection change.
- [ ] [Phase 2] Set up loading states with `Skeleton` components in `PromptUseLayout` while prompts are being fetched.

## Phase 3: Page Integration & Layout Construction

- [ ] [Phase 3] Update `src/app/(protected)/prompts/[id]/use/page.tsx` to wrap its existing content within `PromptUseLayout`.
- [ ] [Phase 3] Pass the current `activeId` (from the page's route parameters) down to `PromptUseLayout`.
- [ ] [Phase 3] Ensure correct CSS display toggling: `PromptUseSidebar` is hidden on mobile (`lg:flex`), and `PromptUseMobileSwitcher` is hidden on desktop (`lg:hidden`).
- [ ] [Phase 3] Verify that the desktop layout properly presents a three-column structure (App Sidebar, Prompt Use Sidebar, Main Content Form).

## Phase 4: UI/UX Polish

- [ ] [Phase 4] Verify that the currently active prompt is clearly highlighted in both `PromptUseSidebar` and `PromptUseMobileSwitcher`.
- [ ] [Phase 4] Ensure long prompt titles are gracefully truncated using Tailwind's `truncate` utility in both components.
- [ ] [Phase 4] Verify that `ScrollArea` properly manages overflow in the `PromptUseSidebar` for users with many prompts.
- [ ] [Phase 4] Test responsiveness and ensure the layout behaves correctly across standard breakpoints (especially crossing the `lg` threshold).

## Phase 5: Testing and QA

- [ ] [Phase 5] Run `pnpm format` to format the newly created and modified files.
- [ ] [Phase 5] Run `pnpm lint` and `pnpm typecheck` to catch and fix any issues.
- [ ] [Phase 5] Manually verify the public prompt "use" page is completely unaffected by the new layout components.
- [ ] [Phase 5] Test edge case: ensure correct behavior when the user has only 1 template prompt.
