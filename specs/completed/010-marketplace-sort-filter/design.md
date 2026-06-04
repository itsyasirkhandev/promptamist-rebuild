---

## Design Plan: Marketplace Sort and Filter

Technical specification for implementing a scalable sorting and filtering mechanism for Marketplace Prompts using React and Convex.

## 1. Objective

Implement a robust filter and sorting system for the Marketplace Prompts that allows users to:

- Sort prompts by "Recently Published" (default) or alphabetically ("A-Z").
- Easily clear all active filters (search query, category, and sort) with a single "Reset Filters" button.
- Execute sorting efficiently via Convex database indexing to ensure scalability.
- Maintain a premium, anti-slop visual aesthetic.

## 2. Tech Stack

- **Frontend:** React / Next.js
- **Backend:** Convex
- **UI Components:** Shadcn UI (Select, Button), Tailwind CSS

**Why this stack?**

- React is excellent for dynamic search and filter interfaces where state updates frequently.
- Convex provides real-time query reactivity and native database indexing, ideal for server-side sorting.
- Shadcn UI offers accessible, unstyled primitives that can be easily customized to fit premium design tastes.

## 3. High-Level Architecture

The feature is divided into three distinct layers of responsibility:

**A. Frontend (React)**

- Render the Search Input, Category Tabs, and the newly added Filter Row (Sort By Select & Reset Button).
- Track active filter state (`inputValue`, `activeCategory`, `sortBy`).
- Pass active filter state to the Convex `useQuery` hook.

**B. Backend (Convex)**

- Accept `sortBy` as a parameter in the `listPublicPrompts` query.
- Branch logic based on whether a text search is active (handling relevance vs. index sorting).
- Return sorted and filtered prompt data.

**C. Database**

- Store prompts with `isPublic` and `title` properties.
- Maintain a compound index `by_isPublic_title` to support fast alphabetical retrieval.

**ARCHITECTURE FLOW**
Frontend (React) -> Backend Query (Convex) -> Database Indexes (Convex)

## 4. Data Model

We need to update the `prompts` table definition in the Convex schema to include a new index for alphabetical sorting.

```typescript
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ... other tables
  prompts: defineTable({
    // ... fields
    title: v.string(),
    isPublic: v.optional(v.boolean()),
    // ... other fields
  })
    // Existing indexes
    .index('by_isPublic', ['isPublic'])
    // NEW Index for alphabetical sorting
    .index('by_isPublic_title', ['isPublic', 'title']),
});
```

## 5. Core Design Decisions

**Decision 1: Place Sort and Reset between Search and Categories**
_Why:_ Based on the Interactive Interview, placing the Sort dropdown and Reset button in a dedicated new row between the Search Input and Category Tabs creates a clean, logical hierarchy for the filter tools without cluttering the main navigation.

**Decision 2: In-memory A-Z sort when text search is active**
_Why:_ Convex's `withSearchIndex` inherently returns results ordered by relevance score. If a user combines a Text Search with an "A-Z" sort, the system will fetch the top 50 relevance-matched results and sort them alphabetically in-memory. This prevents unscalable full-table scans while providing expected behavior.

**Decision 3: Use Shadcn `Select` for the Sort Dropdown**
_Why:_ `Select` is semantically correct for choosing a single value from a list of options, ensuring proper accessibility and form behavior.

## 6. Core Functional Flows

**A. A-Z Sorting Without Text Search**
Triggered when the user selects "A-Z" and the search input is empty. The backend queries the new index.

```typescript
prompts = await ctx.db
  .query('prompts')
  .withIndex('by_isPublic_title', (q) => q.eq('isPublic', true))
  .order('asc')
  .take(limit);
```

**B. A-Z Sorting With Text Search**
Triggered when the user has typed a search query and selected "A-Z". The backend uses the search index, then sorts the relevance-based results in memory.

```typescript
prompts = await ctx.db
  .query('prompts')
  .withSearchIndex('search_all', (q) =>
    q.search('searchableText', searchQuery).eq('isPublic', true),
  )
  .take(limit);

if (sortBy === 'a-z') {
  prompts.sort((a, b) => a.title.localeCompare(b.title));
}
```

**C. Resetting Filters**
Triggered when the "Reset Filters" button is clicked. The React component state resets.

```typescript
const handleResetFilters = () => {
  setInputValue('');
  setActiveCategory('all');
  setSortBy('recent');
};
```

## 7. Development Plan

1. **Database schema:** Add the `by_isPublic_title` index to `convex/schema.ts`.
2. **Backend DAL:** Update `listPublicPromptsWithAuthors` in `convex/dal/prompts.dal.ts` to accept the `sortBy` option and implement the branching logic for index sorting vs in-memory sorting.
3. **Backend API:** Update the `listPublicPrompts` query in `convex/publicPrompts.ts` to pass the `sortBy` argument to the DAL.
4. **Frontend UI:** In `MarketplaceSearch.tsx`, introduce a `sortBy` state. Add a new row containing the Shadcn `Select` component and the "Reset Filters" ghost button. Connect the states and the `useQuery` call.

## 8. Relevant MCPs, Skills, and Tools

Core Architecture & Implementation Skills:

- **design-taste-frontend:** Applied during the React UI implementation phase to construct a high-fidelity, polished filter row that seamlessly integrates the Select and Button components into the existing premium layout.
- **vercel-react-best-practices:** Leveraged to implement top-tier UI optimization patterns, ensuring state operations and component rerenders (such as debouncing the search input) remain highly performant.

Essential Development Tools:

- **Convex Database Indexes:** For defining compound indexes that support efficient, scalable sorting.
- **Shadcn UI (`Select`, `Button`):** For accessible, consistent frontend primitives.
- **Tailwind CSS:** For styling the new layout elements seamlessly.
