# Implementation Tasks: Dedicated Prompt Use Page

## Phase 1: Navigation Updates

- [ ] 1. Update `src/lib/navigation.ts` to include a new `NavigationItem` for the "Workspace" feature. The new item should have `title: 'Workspace'`, `href: '/use'`, `icon: 'lucide:monitor-play'`, and `requireAuth: true`.
- [ ] 2. Update `src/components/prompts/PromptCard.tsx` to modify the "Use Template" link. Change the `href` to append the `?mode=focused` query parameter: `` href={`/prompts/${prompt._id}/use?mode=focused`} ``.

## Phase 2: General Workspace Route

- [ ] 1. Create a new directory and file `src/app/(protected)/use/page.tsx` as a client component (`'use client'`).
- [ ] 2. Inside `src/app/(protected)/use/page.tsx`, import and use the Convex query `api.authed.prompts.getPrompts`.
- [ ] 3. Filter the returned prompts to get only those where `isTemplate === true`.
- [ ] 4. Implement a loading state in `src/app/(protected)/use/page.tsx` using `Skeleton` from `@/components/ui/skeleton` when prompts are `undefined`.
- [ ] 5. Implement an empty state in `src/app/(protected)/use/page.tsx` when no templates exist (prompts exist but `templatePrompts.length === 0`). Display a message and a call-to-action button linking to `/prompts/create`.
- [ ] 6. Implement the redirection logic using `useRouter` from `next/navigation`. If templates exist, call `router.replace(`/prompts/${templates[0]._id}/use`)` to automatically navigate the user to the first template in workspace mode.

## Phase 3: Layout Contextual State

- [ ] 1. In `src/app/(protected)/prompts/[id]/use/layout.tsx`, wrap the `<PromptUseLayout>` component with `<Suspense fallback={<div className="h-full w-full" />}>` to safely use `useSearchParams` in its children without causing de-opts in Next.js.
- [ ] 2. Update `src/components/prompts/use/PromptUseLayout.tsx` to import `useSearchParams` from `next/navigation`.
- [ ] 3. Add logic in `PromptUseLayout` to extract the URL state: `const searchParams = useSearchParams(); const isFocusedMode = searchParams.get('mode') === 'focused';`.
- [ ] 4. Modify the `return` statement of `PromptUseLayout`. If `isFocusedMode` is true, render a simplified wrapper that ONLY outputs `{children}` within a basic `div` container. If false, return the existing layout that includes `PromptUseSidebar` and `PromptUseMobileSwitcher`.
