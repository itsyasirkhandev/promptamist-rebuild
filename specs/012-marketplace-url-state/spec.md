# Marketplace URL State Specification

## 1. Problem Statement

Currently, when users filter, search, or sort prompt templates on the public marketplace page (`/marketplace`), the UI state is maintained in local React state. This leads to the following issues:

- Users cannot share a link to a specific search query or category filter (e.g., sharing a list of "Development" templates).
- Refreshing the page resets all search inputs, active category filters, and sorting parameters back to their defaults.
- Navigating back/forward in the browser does not revert or step through previous search or filter states, causing a jarring navigation experience.

**Solution**: Migrate the marketplace search, category, and sorting filters from local state to typesafe URL state using `nuqs`.

## 2. Functional Requirements

The system should:

- Integrate `nuqs` for managing the URL state of the marketplace page.
- Synchronize three filters with URL search parameters:
  - `q`: Search query string (default: `""`).
  - `category`: Active filter category (default: `"all"`).
  - `sort`: Sorting order (default: `"recent"`, options: `"recent" | "a-z"`).
- Automatically clear parameters from the URL when their values match the defaults (e.g. if category is `"all"`, do not display `category=all` in the URL).
- Handle history behavior as follows:
  - `q`: Update the URL using `replace` mode to prevent polluting browser history with every keystroke.
  - `category`: Update the URL using `push` mode to enable standard browser back/forward navigation.
  - `sort`: Update the URL using `push` mode to enable standard browser back/forward navigation.
- Maintain high-performance updates using `nuqs`'s built-in `limitUrlUpdates` to rate-limit URL updates during rapid keystrokes.

## 3. Inputs and Outputs: URL Parameter Synchronization

**USER ACTION (INPUT)**

- A user types `"React"` into the search input.
- A user clicks the `"Development"` category button.
- A user changes the sorting dropdown to `"A-Z"`.

**EXPECTED SYSTEM BEHAVIOR**

- The URL updates dynamically to `/marketplace?q=React&category=development&sort=a-z`.
- The marketplace prompt list refreshes to show only prompts matching `"React"`, categorized as `"development"`, sorted alphabetically.
- If the user clicks the browser "Back" button:
  - The category reverts to its previous state (or `"all"`), and the sorting reverts to its previous state (or `"recent"`).
  - The query parameter `q` remains `"React"` (since it was updated with `replace`).
- If a user opens the link `/marketplace?q=React&category=development` in a new tab:
  - The search input is pre-filled with `"React"`.
  - The `"Development"` category is active.
  - The sorting dropdown displays `"Recently Published"` (default).
  - The correct list of prompts is fetched on initial render.

## 4. Constraints

- All query parameters must be type-safe and validated using `nuqs` standard parsers (`parseAsString`, etc.).
- Default values must be cleanly cleared from the URL path.
- The UI transitions must be smooth and not cause jarring layout shifts or double-rendering of components.

## 5. Edge Cases and Error Handling

- **Invalid query parameters in the URL (e.g. `?sort=invalid` or `?category=unknown`)**
  - Fall back to the default values gracefully: `sort` defaults to `"recent"`, and `category` defaults to `"all"`.
- **Rapid search typing**
  - Keystrokes must directly update the URL using `nuqs`'s built-in `limitUrlUpdates` rate-limiting (e.g., throttled to 50ms) to avoid browser history/rate-limiting errors.
- **Resetting filters**
  - Clicking the "Reset Filters" button must clear all query parameters from the URL, resetting the state to `/marketplace`.

## 6. Acceptance Criteria

This feature is considered complete if:

- `nuqs` is added as a dependency and initialized with `NuqsAdapter` in the root layout.
- The `/marketplace` page successfully syncs the search query (`q`), category (`category`), and sort order (`sort`) with the URL.
- Sharing a `/marketplace` link with specific parameters correctly restores the search input, selected category, selected sort order, and matches the correct search results.
- Changing search inputs updates the URL using `replace` navigation, whereas changing categories or sorting orders uses `push` navigation.
- Empty query values or default query values are excluded/cleared from the URL automatically.
- The project builds, runs, and passes all linting/formatting checks (`pnpm lint`, `pnpm typecheck`, `pnpm format`).

## 7. Relevant MCPs, Skills, and Tools

Model Context Protocols (MCPs):

- exa (web_search_exa): Utilized to look up latest `nuqs` documentation if needed.

Core Architecture & Implementation Skills:

- nuqs: Primary skill used to implement typesafe URL states.
- vercel-react-best-practices: Applied to ensure state updates do not trigger unnecessary re-renders or hydration mismatches.
