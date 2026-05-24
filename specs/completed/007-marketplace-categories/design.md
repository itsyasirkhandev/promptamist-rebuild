# Marketplace Categories Technical Design

**1. Objective**
The objective is to implement a category classification and filtering system for the public prompt marketplace in Promptamist. This will allow prompt owners to categorize their prompts upon publishing, default to a `'general'` category if no category is assigned, and enable marketplace visitors to filter prompts by categories via a premium, responsive horizontal row of category pills.

**2. Tech Stack**

- **Frontend**: React 19, Next.js 16 (App Router), Tailwind CSS v4 (with OKLCH colors and modern theme transitions)
- **State Management & UI**: React Hook Form, Radix UI Primitives (Select, ScrollArea), Lucide React
- **Backend & Database**: Convex (real-time queries, mutations, type-safe schema index, search index)
- **Architecture patterns**: Data Access Layer (DAL), Data Transfer Object (DTO) mapping, and `effect` library error/context handling.

**3. High-Level Architecture**
The architecture is divided into three layers matching the existing codebase structure:

1. **Database Layer (Convex Schema)**:
   - Extend the `prompts` table with an optional `category` field.
   - Add a fast index `by_isPublic` on the `isPublic` field in the `prompts` table to optimize un-searched marketplace fetches and avoid complete table scans.
2. **Backend API & DAL Layer (Convex Functions & DTOs)**:
   - Update `promptArgsValidator` to validate the optional `category` field.
   - Update `insertPrompt` and `patchPrompt` in `convex/dal/prompts.dal.ts` to persist `category` to the database.
   - Update the DTO serialization layer (`convex/dto.ts`) to default missing or undefined categories to `'general'`.
   - Enhance the query handler `listPublicPrompts` in `convex/publicPrompts.ts` to accept a `category` filter and perform optimized real-time filtering in JavaScript (handling both the exact category filter and dynamic `'general'` fallback for existing records).
3. **Frontend Presentation & Forms Layer (Next.js & shadcn/ui)**:
   - **Prompt Form**: Update Zod schema and defaults to support `category`, defaulting it to `'general'`.
   - **Settings Panel**: Update `SettingsSection.tsx` to display a Radix UI `Select` component populated with our 6 standard categories, appearing _only_ when `isPublic` is toggled ON.
   - **Marketplace Filters**: In `MarketplaceSearch.tsx`, introduce a smooth, scrollable row of category pills (All, General, Productivity, Development, Marketing, Creative, Education) and bind it to the Convex query parameters.

---

**4. Data Model**

### `convex/schema.ts`

Modify the `prompts` table to add `category` and the `by_isPublic` index:

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
    category: v.optional(v.string()), // NEW: Category field
    searchableText: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_and_title', ['userId', 'title'])
    .index('by_publicSlug', ['publicSlug'])
    .index('by_isPublic', ['isPublic']) // NEW: Fast index for marketplace queries
    .searchIndex('search_all', {
      searchField: 'searchableText',
      filterFields: ['isPublic'],
    }),
```

---

**5. Core Design Decisions**

- **DTO-level Dynamic Fallback**: Rather than executing a locking database migration to add `category: "general"` to all historical public prompts, we perform a lightweight dynamic fallback in `toPromptDTO` and `toPublicPromptDTO`: `category: prompt.category ?? 'general'`. This ensures backward compatibility, zero downtime, and keeps the code robust.
- **Client-Side/JS Filtering for Search and Capped Sets**: The marketplace reads are limited to a max pagination count of 50. By querying the top 100 most recent public prompts from the `by_isPublic` index (or 50 from the `search_all` index) and filtering by category in the Convex JS runtime, we completely avoid complex database queries that fail to index dynamically defaulted fields while keeping the read latencies in the single-digit milliseconds.
- **Contextual UI Form Display**: Displaying the Category select dropdown _only_ when the prompt is made public avoids visual noise for draft or template-only prompts that aren't listed on the marketplace.

---

**6. Core Functional Flows**

### A. Saving a Categorized Public Prompt

1. User toggles "Make Public" in the prompt form UI.
2. The UI renders the dropdown selecting "General" by default.
3. User edits the category (e.g. to "Development") and saves.
4. Zod parses `category: "development"` and sends it in the `updatePrompt` mutation.
5. In `convex/authed/prompts.ts`, the mutation invokes:
   ```typescript
   yield *
     Effect.promise(() =>
       patchPrompt(ctx, id, { ...updates, publicSlug, searchableText }),
     );
   ```
6. The DAL updates the record in the database.

### B. Querying Public Prompts on the Marketplace

1. Marketplace page mounts; `activeCategory` state is `'all'` by default.
2. `useQuery` calls `api.publicPrompts.listPublicPrompts` with `category: activeCategory` and `searchQuery`.
3. In `convex/publicPrompts.ts`, the query performs:
   - **If searchQuery is present**: Fetches top 50 matches using search index, then filters matching category in JS if `category` is not `'all'` or undefined.
   - **If searchQuery is absent**: Fetches top 100 most recent items using `by_isPublic` index, filters matching category in JS, and slices to 50.
4. Mappers convert them using `toPublicPromptDTO(prompt, author)` where `category` defaults to `'general'` if missing.
5. Frontend renders the card layout with category labels and responsive filters.

---

**7. Development Plan**

### Phase 1: Database & Backend (Convex)

1. **Schema Update**:
   - Add `category: v.optional(v.string())` and `.index('by_isPublic', ['isPublic'])` to `convex/schema.ts`.
2. **Validators**:
   - Add `category: v.optional(v.string())` to `promptArgsValidator` in `convex/validators.ts`.
3. **Data Access Layer**:
   - Update `insertPrompt` and `patchPrompt` in `convex/dal/prompts.dal.ts` to accept and write `category`.
4. **DTO Mappings**:
   - Update `toPromptDTO` and `toPublicPromptDTO` in `convex/dto.ts` to output `category ?? 'general'`.
5. **API Query Layer**:
   - Refactor `listPublicPrompts` in `convex/publicPrompts.ts` to accept `category?: string` and use the optimized `by_isPublic` index for unsearched queries, combined with dynamic JS filtering.

### Phase 2: Frontend Forms & UI Customization

1. **Prompt Form Schema**:
   - Update Zod validator schema `promptFormSchema` in `src/components/prompts/PromptForm.tsx` to include `category: z.string().optional()`.
   - Update `defaultValues` to set `category: 'general'`.
   - Hook up default mappings in `React.useEffect` synchronizing initial data.
2. **Settings Section**:
   - Enhance `SettingsSectionProps` with `category` and `setCategory` in `src/components/prompts/form/SettingsSection.tsx`.
   - Import Radix `Select` primitives and render the selector when `isPublic` is `true`.
3. **PromptForm Integration**:
   - Pass monitored `category` value and setter down to `SettingsSection`.

### Phase 3: Marketplace UI & Filtering

1. **Category Pills Row**:
   - Add `activeCategory` state to `MarketplaceSearch.tsx`.
   - Implement the row of scrollable category pills/tabs: **All**, **General**, **Productivity**, **Development**, **Marketing**, **Creative**, **Education**.
   - Style active/inactive pills using modern Tailwind v4 properties, OKLCH, and hover micro-animations.
2. **Query Bindings**:
   - Update `useQuery` call inside `MarketplaceSearch.tsx` to pass the `activeCategory` filter down to the Convex API.
3. **Verify & Clean up**:
   - Run typechecks and lint checks.
