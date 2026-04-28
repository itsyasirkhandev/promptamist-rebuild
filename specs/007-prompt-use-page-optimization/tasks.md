# Tasks: Prompt "Use" Page Optimization

## Phase 1: Layout Restructuring

- [ ] [Phase 1] Create `src/app/(protected)/prompts/[id]/use/layout.tsx` to export a `UseTemplateLayout` that wraps its children with `PromptUseLayout`.
- [ ] [Phase 1] Refactor `src/components/prompts/use/PromptUseLayout.tsx` to remove the `activeId` prop. Use `useParams()` from `next/navigation` to read the `id` from the URL to determine the active state.

## Phase 2: Localized Loading State

- [ ] [Phase 2] Update `src/app/(protected)/prompts/[id]/use/page.tsx` to remove the `<PromptUseLayout>` wrapper from the return statement.
- [ ] [Phase 2] Update the loading state (`if (prompt === undefined)`) in `src/app/(protected)/prompts/[id]/use/page.tsx` to render a localized skeleton UI that fits within the main container (e.g., Breadcrumb, Form, Preview skeletons) instead of a full-page skeleton.

## Phase 3: Convex Prefetching & Mobile Switcher Updates

- [ ] [Phase 3] Update `src/components/prompts/use/PromptUseSidebar.tsx` to import `useConvex` and add `onMouseEnter` and `onFocus` event handlers to the sidebar `<Link>` elements to prefetch prompt data.
- [ ] [Phase 3] Refactor `src/components/prompts/use/PromptUseMobileSwitcher.tsx` to use `useParams()` for the active state to ensure it updates instantly.
- [ ] [Phase 3] Implement Convex prefetching (`onMouseEnter`, `onFocus`) on the items within `src/components/prompts/use/PromptUseMobileSwitcher.tsx` to match the desktop sidebar behavior.
