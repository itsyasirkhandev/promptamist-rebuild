# Tasks: Dashboard Statistics

## Phase 1: Preparation

- [ ] [Phase 1] Review the technical design plan in `specs/005-dashboard-stats/design.md`.
- [ ] [Phase 1] Ensure necessary components are available in `src/components/ui/` (specifically `card.tsx` and `skeleton.tsx`). If missing, add them using shadcn/ui CLI.

## Phase 2: Backend Implementation

- [ ] [Phase 2] Open `convex/authed/prompts.ts`.
- [ ] [Phase 2] Import required modules: `authedQuery`, `getUserId`, `Effect`, `runEffect` if not already present.
- [ ] [Phase 2] Implement the `getPromptStats` query function. Fetch the current user's prompts, limit the result to 1000 items, and count `total`, `templates` (where `isTemplate` is true), and `public` (where `isPublic` is true).
- [ ] [Phase 2] Export the `getPromptStats` query to make it available via the Convex API.

## Phase 3: Frontend Implementation

- [ ] [Phase 3] Open `src/components/HomeClient.tsx`.
- [ ] [Phase 3] Add imports for `useQuery` from `convex/react`, and `api` from `../../convex/_generated/api`.
- [ ] [Phase 3] Add imports for `Card`, `CardContent`, `CardHeader`, `CardTitle` from `@/components/ui/card`.
- [ ] [Phase 3] Add import for `Skeleton` from `@/components/ui/skeleton`.
- [ ] [Phase 3] Add imports for `FileText`, `LayoutTemplate`, `Globe` from `lucide-react`.
- [ ] [Phase 3] Create a new `DashboardStats` component at the bottom of the file. Implement loading state (using Skeletons) and the final populated 3-column card layout displaying the stats.
- [ ] [Phase 3] Update the `<Authenticated>` block inside the `HomeClient` component to render `<DashboardStats />` below the welcome message.

## Phase 4: Testing & Validation

- [ ] [Phase 4] Run `npx convex dev --until-success` (or `npx convex typegen`) to generate Convex types.
- [ ] [Phase 4] Run `pnpm lint` and fix any errors. Use `--fix` if applicable.
- [ ] [Phase 4] Run `pnpm format` to ensure files are properly formatted.
- [ ] [Phase 4] Run `pnpm typecheck` to verify there are no TypeScript errors.
- [ ] [Phase 4] Start the Next.js development server.
- [ ] [Phase 4] Log in and verify that the dashboard statistics cards are displayed correctly on the home page.
- [ ] [Phase 4] Verify the skeleton loaders appear briefly before the data loads.
- [ ] [Phase 4] Test with an account that has no prompts to ensure the numbers default securely to `0`.
