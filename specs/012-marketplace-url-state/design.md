# Design Plan: Marketplace URL State

Technical specification for implementing typesafe URL state management in the public marketplace using next.js and `nuqs`.

## 1. Objective

Migrate the marketplace search query, category filters, and sorting option from local React state to typesafe URL state parameters. This ensures:

- Users can copy and share marketplace links with pre-filled query, category, and sort parameters.
- Refreshing the page preserves all search inputs, active categories, and sorting selections.
- Browser navigation (back/forward) behaves naturally by stepping through category and sort updates.
- Clean URLs where default parameter values (e.g., query `""`, category `"all"`, sort `"recent"`) are automatically omitted.

## 2. Tech Stack

- **Next.js App Router (v15+)**: Framework providing routing capabilities.
- **nuqs**: Type-safe URL search parameters state manager for React and Next.js.
- **Convex**: Backend database and client-side reactive query hook (`useQuery`).

**Why this stack?**

- Next.js App Router handles server and client routing seamlessly, but native search param handlers (`useSearchParams`) trigger full client-side router navigation, which can feel heavy.
- `nuqs` simplifies state syncing, handles automatic serialization, offers built-in input rate-limiting/throttling, and allows fine-grained control over browser history behavior (push vs. replace).
- Convex React client updates reactively when hook dependencies change, allowing smooth UI updates without manual fetch triggers.

## 3. High-Level Architecture

The architecture delegates state and page updates through the following components:

**A. Root Layout (`src/app/layout.tsx`)**

- Wraps the application tree in `<NuqsAdapter>` to provide URL context to hooks in child components.

**B. Marketplace Page (`src/app/marketplace/page.tsx`)**

- Renders the marketplace layout and loads `<MarketplaceSearch />`.

**C. Marketplace Search Component (`src/components/marketplace/MarketplaceSearch.tsx`)**

- Replaces local states (`inputValue`, `activeCategory`, `sortBy`) with `nuqs` state variables.
- Binds the search field with a throttled URL state updater using `limitUrlUpdates: throttle(50)`.
- Computes a debounced value of the search query (`debouncedQ = useDebounce(q, 300)`) to reactively update the Convex data query.
- Renders loading, grid, and empty states based on the query results.

**ARCHITECTURE FLOW**

```
Browser URL /marketplace?q=React -> NuqsAdapter -> useQueryState('q') -> debouncedQ -> useQuery(listPublicPrompts) -> Convex DB
```

## 4. URL State Model

We define the following query parameters:

| Param      | Parser / Constraint                                | Default    | History Mode | Throttling / Rate-Limiting      |
| :--------- | :------------------------------------------------- | :--------- | :----------- | :------------------------------ |
| `q`        | `parseAsString`                                    | `""`       | `replace`    | `limitUrlUpdates: throttle(50)` |
| `category` | `parseAsString`                                    | `"all"`    | `push`       | None (instant URL update)       |
| `sort`     | `parseAsStringLiteral(['recent', 'a-z'] as const)` | `"recent"` | `push`       | None (instant URL update)       |

By default, all hooks will inherit `clearOnDefault: true` from `nuqs`, meaning default values are automatically omitted from the URL path.

## 5. Core Design Decisions

**Decision 1: Use `replace` history mode for search input `q` and `push` mode for categories and sort**

- _Why:_ Typing search queries character-by-character shouldn't bloat the browser back/forward history. Updating the search value should replace the current entry. Changing a category filter or sorting order, however, are discrete user selections that are natural points in browser navigation, warranting a new history entry.

**Decision 2: Combine `limitUrlUpdates: throttle(50)` with `useDebounce(q, 300)` for the Convex fetch**

- _Why:_ Throttling the URL updates at 50ms ensures the address bar updates smoothly and feels responsive during typing, avoiding browser history rate limit exceptions. Debouncing the Convex fetch by 300ms prevents a flood of database queries on every keystroke, dramatically reducing read amplification.

**Decision 3: Use `parseAsStringLiteral` for sorting query parameter**

- _Why:_ Validating sorting inputs against the exact values `['recent', 'a-z']` prevents security vulnerabilities or unexpected rendering bugs if the URL parameter is manipulated to an invalid string.

## 6. Core Functional Flows

### A. Initialization of URL Query States

In `src/components/marketplace/MarketplaceSearch.tsx`, initialize:

```typescript
const [q, setQ] = useQueryState(
  'q',
  parseAsString.withDefault('').withOptions({
    history: 'replace',
    limitUrlUpdates: throttle(50),
  }),
);

const [activeCategory, setActiveCategory] = useQueryState(
  'category',
  parseAsString.withDefault('all').withOptions({
    history: 'push',
  }),
);

const [sortBy, setSortBy] = useQueryState(
  'sort',
  parseAsStringLiteral(['recent', 'a-z'] as const)
    .withDefault('recent')
    .withOptions({
      history: 'push',
    }),
);
```

### B. Binding to UI Elements

- The search Input binds to `q` and updates using `setQ`:
  ```tsx
  <Input type="text" value={q} onChange={(e) => setQ(e.target.value)} />
  ```
- Selecting categories triggers `setActiveCategory(cat.id)`.
- Changing the sort dropdown triggers `setSortBy(val)`.
- Resetting filters calls:
  ```typescript
  const handleResetFilters = () => {
    setQ(null);
    setActiveCategory(null);
    setSortBy(null);
  };
  ```
  _(Passing `null` resets the parameters to their defaults and removes them from the URL)._

### C. Debouncing and Data Fetching

```typescript
const debouncedQuery = useDebounce(q, 300);

const prompts = useQuery(api.publicPrompts.listPublicPrompts, {
  searchQuery: debouncedQuery || undefined,
  category: activeCategory,
  sortBy,
});

const isSearchPending = q !== debouncedQuery;
```

## 7. Development Plan

1. **Install Dependencies:** Run `pnpm add nuqs` to install the library.
2. **Setup NuqsAdapter:** Import and wrap children inside `ConvexClientProvider` in `src/app/layout.tsx` with `<NuqsAdapter>`.
3. **Refactor MarketplaceSearch:** Migrate state management to `useQueryState`, replace local state reset with `null` parameter updates, and test behavior.
4. **Verification:** Validate URL parameters, back/forward history navigation, empty query fallback, invalid value overrides, and compile/lint check (`pnpm lint`, `pnpm typecheck`, `pnpm format`).

## 8. Relevant MCPs, Skills, and Tools

- **MCPs**:
  - `exa (web_search_exa)`: Utilized to search or verify specific `nuqs` API behaviors or features if needed.
- **Skills**:
  - `nuqs`: Governs the type-safe URL query parameter configuration, ensuring validation and clean history transitions.
  - `vercel-react-best-practices`: Followed to guarantee state changes occur cleanly without hydration mismatches or layout shifts.
