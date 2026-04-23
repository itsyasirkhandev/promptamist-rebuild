Design Plan: Public Prompt Sharing

Technical specification for implementing public prompt sharing with React, Next.js, and Convex.

1. Objective

Implement a public prompt sharing feature that allows users to:

- Make any prompt (static or dynamic) publicly accessible.
- Share prompts via a unique, human-readable URL slug.
- View and interact with dynamic prompts without authentication.
- Ensure all real-time updates made by the author instantly reflect on the public page.
- Easily copy the generated customized prompt or static prompt.

2. Tech Stack

Frontend: React 19, Next.js 16.2.4
Backend: Convex
Styling: Tailwind CSS, shadcn/ui

Why this stack?

- Next.js App Router (16.2.4) allows efficient route handling and layout management.
- Convex provides real-time, reactive queries naturally, satisfying the requirement that changes by the author instantly reflect on the public page.
- React Hook Form and Zod are already in use for form handling, which will easily adapt to dynamic prompt variable inputs on the public page.

3. High-Level Architecture

The feature involves adding a public access layer to the existing prompt architecture:

A. Database (Convex Schema)

- Extend the `prompts` table to include `isPublic` and `publicSlug`.
- Add an index for fast lookups by `publicSlug`.

B. Backend APIs (Convex)

- Authed Mutations (`convex/authed/prompts.ts`): Update to handle toggling `isPublic` and server-side generation of `publicSlug` to ensure uniqueness.
- Public Queries (`convex/publicPrompts.ts`): New unauthenticated query to fetch a prompt by its slug.

C. Frontend UI (Next.js)

- Editor Pages: Add "Make Public" switch and "Copy Public Link" button in the prompt creation/editing forms.
- Public Route (`/p/[slug]`): A new dynamic route. It must await `params` (Next.js 16 breaking change) and render a client component that subscribes to the Convex query.

4. Data Model

We will extend the existing `prompts` table in `convex/schema.ts`.

TYPESCRIPT (CONVEX SCHEMA)

```typescript
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ... users table ...

  prompts: defineTable({
    userId: v.id('users'),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    isTemplate: v.boolean(),
    variables: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        type: v.union(
          v.literal('text'),
          v.literal('number'),
          v.literal('textarea'),
          v.literal('choices'),
          v.literal('list'),
        ),
        options: v.optional(v.array(v.string())),
      }),
    ),
    // New fields
    isPublic: v.optional(v.boolean()),
    publicSlug: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_and_title', ['userId', 'title'])
    // New index for visitor access
    .index('by_publicSlug', ['publicSlug']),
});
```

5. Core Design Decisions

Decision 1: Generate `publicSlug` server-side upon making it public
Why: Generating the slug on the backend ensures uniqueness (e.g., `slugify(title) + '-' + shortRandomId`) without race conditions. It simplifies frontend logic and prevents manual tampering or duplicate slugs.

Decision 2: Use Convex reactive queries (`useQuery`) for the public page
Why: The spec requires that changes by the author instantly reflect on the public page. Convex's real-time WebSocket connection ensures visitors see live updates without needing to refresh.

Decision 3: Separate public queries into `convex/publicPrompts.ts`
Why: To enforce security boundaries. The existing `authedQuery` helper requires authentication. Creating a separate file utilizing Convex's standard unauthenticated `query` ensures visitors cannot access protected endpoints by accident.

Decision 4: Next.js 16 Async Route Parameters
Why: Next.js 16 introduced breaking changes where route parameters (`params` and `searchParams`) must be accessed asynchronously. The `/p/[slug]/page.tsx` must `await params` before passing the slug to the client component.

6. Core Functional Flows

A. Making a Prompt Public

1. User toggles "Make Public" in `/prompts/create` or `/prompts/[id]`.
2. Form submits `isPublic: true` to `createPrompt` or `updatePrompt` mutation.
3. Backend checks if `isPublic` is true and `publicSlug` is missing. If so, it generates a unique slug.
4. UI displays the generated link (`/p/generated-slug`) with a "Copy Link" button.

B. Visitor Accessing Public Link

1. Visitor navigates to `/p/[slug]`.
2. Next.js Server Component `await params` and renders `PublicPromptClient`.
3. `PublicPromptClient` calls `api.publicPrompts.getPromptBySlug` with the slug.
4. Backend retrieves the prompt using the `by_publicSlug` index. If `!prompt.isPublic`, it throws a NotFound error.
5. Frontend handles the response:
   - If static (`!isTemplate`), renders the content with a "Copy" button.
   - If dynamic (`isTemplate`), renders a form based on `prompt.variables` with a "Generate & Copy" button.

6. Development Plan

Step 1: Database & Backend Implementation

- Update `convex/schema.ts` to add `isPublic` and `publicSlug` properties to the `prompts` table, plus the `by_publicSlug` index.
- Update `createPrompt` and `updatePrompt` in `convex/authed/prompts.ts` to accept the new fields and generate the slug.
- Create `convex/publicPrompts.ts` and implement the unauthenticated `getPromptBySlug` query.

Step 2: Frontend Editor Updates

- Update the Zod schema in `src/app/(protected)/prompts/create/page.tsx` and `[id]/page.tsx`.
- Add a `Switch` component for "Make Public" under the "Settings" card.
- If a prompt is public, display its shareable link with a copy-to-clipboard button using `navigator.clipboard.writeText`.

Step 3: Public Page & Interactive UI

- Create the Next.js 16 route: `src/app/p/[slug]/page.tsx`.
- Build `src/components/prompts/PublicPromptClient.tsx` to consume the slug.
- Implement error states (404 / Private Prompt).
- Render the dynamic form mapping variables to appropriate shadcn/ui inputs.
- Implement the "Generate & Copy" logic that replaces `{{variable_name}}` with form values and copies the result.
