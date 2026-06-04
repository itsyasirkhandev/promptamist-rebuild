# Marketplace Sort and Filter Specification

## 1. Problem Statement

As users browse the Marketplace Prompts, they only see prompts sorted by recency. There is no way to sort them alphabetically or quickly clear selected categories to start over.

This makes it difficult for users to:

- Find a specific prompt by name if it's older
- Reset their view quickly without manually clicking "All" and clearing the search text
- Manage their browsing experience effectively

Solution: This feature introduces a "Sort By" dropdown and a "Reset Filters" button, while updating backend queries for scalable server-side sorting.

## 2. Functional Requirements

The system should:

- Provide a "Sort By" dropdown in the Marketplace Search UI with options: "Recently Published" (default) and "A-Z"
- Provide a "Reset Filters" button next to the filters
- Sort prompts alphabetically on the backend when "A-Z" is selected
- Update the search state to empty, category to "All", and sort to "Recently Published" when the "Reset Filters" button is clicked
- Maintain UI responsiveness and premium aesthetics (anti-slop, clean borders, accessible contrast)
- Execute sort and fetch efficiently via backend indexing

## 3. inputs and outputs: Sort and Filter Behavior

**USER ACTION (INPUT)**
When a user selects "A-Z" from the Sort By dropdown

**EXPECTED SYSTEM BEHAVIOR**

- Backend query fetches prompts ordered alphabetically by title
- UI updates to reflect the sorted list of prompts
- Active category and search query filters are maintained alongside the new sort

**USER ACTION (INPUT)**
When a user clicks "Reset Filters"

**EXPECTED SYSTEM BEHAVIOR**

- Search input is cleared
- Category selection resets to "All"
- Sort selection resets to "Recently Published"
- UI displays the default prompt list

## 4. Constraints

- Backend sorting must rely on an index (e.g., `by_isPublic_and_title`) for scalability; client-side sorting of all prompts is not permitted
- React rendering must be optimized (e.g., using proper state and debouncing) to prevent unnecessary re-renders
- The UI must use Shadcn `Select` or `DropdownMenu` and a subtle button for reset

## 5. Edge Cases and Error Handling

- **Text search and A-Z sort combined**
- Convex `withSearchIndex` returns relevance-scored results. If A-Z sort is requested alongside a text search, the system must apply the A-Z sort to the search results in-memory after fetching the bounded set.
- **No prompts found after filtering**
- Display the existing empty state component.
- **Database latency during sort**
- Display the existing loading state component while the new query resolves.

## 6. Acceptance Criteria

This feature is considered complete if:

- Users can select between "Recently Published" and "A-Z" sorting
- The prompt list accurately reflects the selected sort order
- The "Reset Filters" button correctly clears all filter states to their defaults
- The Convex schema includes a new index for public prompts by title
- The UI design meets the `design-taste-frontend` premium visual standards
