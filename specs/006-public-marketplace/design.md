# Public Marketplace Technical Design

**1. Objective**
Implement a publicly accessible Next.js route (`/marketplace`) allowing users to discover, search, and utilize public prompts. The marketplace requires real-time, debounced full-text search and seamless integration with existing public prompt usage flows.

**2. Tech Stack**

- **Framework**: Next.js 16 App Router (React 19)
- **Styling**: Tailwind CSS
- **Backend & Database**: Convex
- **Authentication**: Clerk (Middleware configuration required for public access)

**3. High-Level Architecture**

- **Frontend Layer**:
  - A Next.js page at `src/app/marketplace/page.tsx` (or `src/app/(public)/marketplace/page.tsx`).
  - A Client Component (`MarketplaceSearch`) containing the Search Input and Prompt List.
  - Custom `useDebounce` hook to delay search query state updates.
- **Backend Layer (Convex)**:
  - A new query function `listPublicPrompts` in `convex/publicPrompts.ts`.
  - The query uses Convex's full-text search index to filter results efficiently on the server.
- **Routing Layer**:
  - `src/middleware.ts` updated to allow unauthenticated access to `/marketplace`.

**4. Data Model**
To support full-text search across Title, Content (description), and Tags, we will augment the Convex schema. Convex's `.searchIndex()` indexes a single string field.
_Updates to `convex/schema.ts`:_

```typescript
prompts: defineTable({
  userId: v.id('users'),
  title: v.string(),
  content: v.string(),
  tags: v.array(v.string()),
  isTemplate: v.boolean(),
  variables: promptVariablesValidator,
  isPublic: v.optional(v.boolean()),
  publicSlug: v.optional(v.string()),
  // NEW: Combined text field for efficient full-text search
  searchableText: v.optional(v.string()),
})
  .index('by_userId', ['userId'])
  .index('by_userId_and_title', ['userId', 'title'])
  .index('by_publicSlug', ['publicSlug'])
  // NEW: Search index for marketplace
  .searchIndex('search_all', {
    searchField: 'searchableText',
    filterFields: ['isPublic'],
  });
```

_Note_: Existing `prompts` will need a backfill/mutation to populate `searchableText` (i.e., `${title} ${content} ${tags.join(' ')}`). New and updated prompts will maintain this field automatically upon save.

**5. Core Design Decisions**

- **Search Strategy (`searchableText` field)**: Instead of filtering all records in memory (which won't scale), we add a `searchableText` field to concatenate title, content, and tags. This allows us to use Convex's native high-performance `.searchIndex()`.
- **AbortController vs Convex Reactive Queries**: The specification mentions aborting requests when the user types again. By using Convex's `useQuery`, we inherently get query deduplication, caching, and race-condition prevention out of the box when reactive parameters (`searchQuery`) change. We only need to debounce the React state update.
- **Middleware Exemption**: Clerk `clerkMiddleware` defaults to either public or protected routes depending on setup. We will ensure `/marketplace` is explicitly added to `publicRoutes` or bypassed in the middleware matcher.

**6. Core Functional Flows**

_Search Flow:_

1. User types "React" into the search bar.
2. The `onChange` handler updates a local React state (`inputValue`).
3. A `useDebounce` hook listens to `inputValue` and updates `debouncedSearchQuery` after a 300ms delay.
4. `useQuery(api.publicPrompts.listPublicPrompts, { query: debouncedSearchQuery })` reacts to the new value.
5. Convex backend executes the `.withSearchIndex('search_all')` query on the database and returns the result.
6. The `PromptCard` list re-renders with the matching data.

_Use Dynamic Prompt Flow:_

1. User clicks the "Use" button on a prompt card (where `isTemplate` is true).
2. The `onClick` handler calls `window.open('/public/' + prompt.publicSlug, '_blank')`.
3. A new tab opens, reusing the existing public UI view for interacting with variables.

**7. Development Plan**

- **Phase 1: Database & Backend**
  - Update `schema.ts` to include `searchableText` and the search index.
  - Create a Convex mutation to backfill `searchableText` for existing public prompts.
  - Implement `listPublicPrompts` in `convex/publicPrompts.ts`.
- **Phase 2: Authentication Configuration**
  - Modify `src/middleware.ts` to explicitly mark `/marketplace` as public.
- **Phase 3: Frontend Implementation**
  - Build `MarketplaceSearch` component with debouncing.
  - Build/Reuse the `PromptCard` UI component to match the required fields (author, tags, copy, use buttons).
  - Create the `src/app/marketplace/page.tsx` wrapper.
- **Phase 4: Verification**
  - Verify searching correctly filters across tags, title, and content.
  - Verify unauthenticated users can load the page without redirects.
