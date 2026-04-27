# Tasks: Dashboard Statistics

## [Phase 1] Setup Dependencies

- [x] Install `@iconify/react` using `pnpm add @iconify/react`.

## [Phase 2] Update Backend (Convex)

- [x] Modify `convex/authed/prompts.ts` to update the `getPromptStats` query.
- [x] Iterate through the fetched prompts and calculate `newThisWeek` by comparing `_creationTime` to a one week ago timestamp.
- [x] Calculate `lastActivityAt` by finding the maximum `_creationTime`.
- [x] Return the complete stats object: `{ total, templates, public, newThisWeek, lastActivityAt }`.

## [Phase 3] Frontend Utilities

- [x] Update `src/lib/utils.ts` to include the `formatRelativeTime` utility function.
- [x] Ensure `formatRelativeTime` uses `Intl.RelativeTimeFormat` to return a human-readable relative string.

## [Phase 4] Update Frontend UI

- [x] Modify `src/components/HomeClient.tsx` to update the `DashboardStats` component.
- [x] Import `Icon` from `@iconify/react` and `formatRelativeTime` from `@/lib/utils`.
- [x] Render 4 metric cards: "Total Prompts", "Template Prompts", "Public Prompts", and "New This Week".
- [x] Add a full-width footer card below the metrics to show the relative time of the most recent prompt creation (using `formatRelativeTime` and `lastActivityAt`).
- [x] Handle the zero-state edge case (0 prompts) by showing a "No activity yet" message instead of a timestamp.

## [Phase 5] Validation

- [x] Run `pnpm lint`, check for errors, and fix them.
- [x] Run `pnpm typecheck` to ensure no TypeScript type mismatches exist.
- [x] Run `pnpm format` to enforce consistent code styling.
