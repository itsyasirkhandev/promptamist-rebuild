# Public Prompt Sharing Tasks

This document tracks the tasks required to implement the public prompt sharing feature, organized into distinct phases based on the technical design plan.

## [Phase 1] Database & Backend Implementation

- [ ] **1.1 Update Schema:** Update `convex/schema.ts` to add `isPublic` (boolean, optional) and `publicSlug` (string, optional) properties to the `prompts` table. Add a `by_publicSlug` index.
- [ ] **1.2 Update Authed Mutations:** Update `createPrompt` and `updatePrompt` in `convex/authed/prompts.ts` to accept `isPublic` and `publicSlug`. Implement server-side logic to generate a unique `publicSlug` (e.g., slugified title + short random ID) when `isPublic` transitions to true.
- [ ] **1.3 Create Public API:** Create `convex/publicPrompts.ts` and implement an unauthenticated `getPromptBySlug` query. This query should use the `by_publicSlug` index and verify that `isPublic` is true before returning the prompt; otherwise, return a "not found" or unauthorized error.

## [Phase 2] Frontend Editor Updates

- [ ] **2.1 Form Schema Updates:** Update the Zod schemas and form definitions in `src/app/(protected)/prompts/create/page.tsx` and `src/app/(protected)/prompts/[id]/page.tsx` to support the new `isPublic` boolean field.
- [ ] **2.2 Toggle UI:** Add a `Switch` component for the "Make Public" option within the prompt configuration/settings area on the create and edit pages.
- [ ] **2.3 Share Link UI:** Implement a UI element that conditionally displays the shareable public link (e.g., `/p/[slug]`) along with a "Copy Link" button (using `navigator.clipboard.writeText`) when the prompt is successfully saved as public.

## [Phase 3] Public Page & Interactive UI

- [ ] **3.1 Dynamic Route Setup:** Create the new Next.js 16 dynamic route at `src/app/p/[slug]/page.tsx`. Ensure it correctly `await`s the `params` object before passing the slug to the client component.
- [ ] **3.2 Public Client Component:** Create `src/components/prompts/PublicPromptClient.tsx`. This component should receive the slug and use the `api.publicPrompts.getPromptBySlug` query to fetch real-time prompt data.
- [ ] **3.3 Error Handling:** Implement "Not Found" or "Private Prompt" error states in `PublicPromptClient` if the backend query returns null or throws an error.
- [ ] **3.4 Dynamic Variable Form:** For dynamic prompts (`isTemplate: true`), render a form in `PublicPromptClient` that maps `prompt.variables` to appropriate shadcn/ui input fields.
- [ ] **3.5 Content Generation & Copy:** Implement the logic in `PublicPromptClient` to replace variable placeholders (e.g., `{{variable_name}}`) with the user's input values and provide a "Generate & Copy" (or just "Copy" for static prompts) button to copy the final prompt text to the clipboard.
