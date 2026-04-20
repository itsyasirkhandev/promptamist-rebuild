# Tasks: Prompt Creation and Templating

## [Phase 1] - Convex Schema & Backend

- [ ] [Phase 1] Define the `prompts` table in `convex/schema.ts` with `userId`, `title`, `content`, `tags`, `isTemplate`, and `variables` array.
- [ ] [Phase 1] Add indices to the `prompts` table for `by_userId` and `by_userId_and_title`.
- [ ] [Phase 1] Create `src/convex/authed/prompts.ts` for public-facing mutations and queries.
- [ ] [Phase 1] Implement `createPrompt` mutation in `src/convex/authed/prompts.ts` with proper validation.
- [ ] [Phase 1] Implement `getPrompts` query to fetch prompts for the authenticated user.
- [ ] [Phase 1] Implement `getPromptById` query to fetch a single prompt by its ID.
- [ ] [Phase 1] Implement `updatePrompt` mutation to allow editing existing prompts.
- [ ] [Phase 1] Implement `deletePrompt` mutation to remove prompts.

## [Phase 2] - Prompt Editor (`/create`)

- [ ] [Phase 2] Create the `/prompts/create` page and basic form layout (Title, Tags, Template Toggle).
- [ ] [Phase 2] Build the `PromptEditor` component using a `contenteditable` div for rich interaction.
- [ ] [Phase 2] Implement text selection detection to enable/disable the "Convert to Variable" action.
- [ ] [Phase 2] Create `VariableConfigModal` to define variable properties (name, type, options for choices/list).
- [ ] [Phase 2] Implement the `insertVariable` logic to wrap selected text in a styled `<span>` with `{{variable_name}}` syntax.
- [ ] [Phase 2] Connect the `PromptEditor` to React Hook Form and sync `contenteditable` changes to form state.
- [ ] [Phase 2] Implement form submission to the `createPrompt` mutation and redirect on success.

## [Phase 3] - Prompt List (`/prompts`)

- [ ] [Phase 3] Build the `/prompts` dashboard to list all user prompts using the `getPrompts` query.
- [ ] [Phase 3] Implement a search bar and tag filter for the prompt list.
- [ ] [Phase 3] Create a `PromptCard` component to display summary info and action buttons.
- [ ] [Phase 3] Implement "Copy to Clipboard" functionality for static prompts.
- [ ] [Phase 3] Add "Edit" button that navigates to a pre-filled editor page.
- [ ] [Phase 3] Implement "Delete" action with a confirmation dialog (using shadcn/ui AlertDialog).

## [Phase 4] - Template Runner (`/prompts/[id]/use`)

- [ ] [Phase 4] Create the dynamic route `/prompts/[id]/use` and handle async `params` for Next.js 16.
- [ ] [Phase 4] Implement a split-screen layout using Tailwind CSS 4 Grid/Flexbox.
- [ ] [Phase 4] Build a dynamic form generator that renders input fields based on the prompt's `variables` array.
- [ ] [Phase 4] Implement the live interpolation logic to replace `{{name}}` placeholders with form values in real-time.
- [ ] [Phase 4] Add a "Live Preview" panel that displays the interpolated prompt text.
- [ ] [Phase 4] Add a "Copy Final Prompt" button to the preview panel with success feedback.

## [Phase 5] - Refinement & Testing

- [ ] [Phase 5] Add comprehensive Zod validation for prompt creation (unique variable names, valid types).
- [ ] [Phase 5] Handle edge cases in the editor (e.g., preventing duplicate variables, handling manual deletion of variable spans).
- [ ] [Phase 5] Integrate toast notifications for all CRUD actions and clipboard copies.
- [ ] [Phase 5] Add loading states and skeletons for the prompt list and template runner.
- [ ] [Phase 5] Perform a final UI/UX pass with Tailwind 4 for consistent spacing and responsive design.
- [ ] [Phase 5] Run `pnpm lint`, `pnpm format`, and `pnpm typecheck` to ensure code quality.
