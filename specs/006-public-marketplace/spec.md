# Public Marketplace Specification

**1. Problem Statement**
Users need a publicly accessible marketplace at `/marketplace` to discover, search, and utilize public prompts. The page must be open to everyone without authentication barriers (bypassing middleware restrictions). Users should be able to view prompt details, copy static prompts, and interact with dynamic prompts directly from the marketplace.

**2. Functional Requirements**

- **Public Access:** The `/marketplace` route must be exempt from authentication middleware, allowing unauthenticated users to view the page.
- **Prompt Display:** Display public prompts as cards containing:
  - Title
  - Description
  - Author name and avatar
  - Tags
  - "Copy" button
  - "Use" button (only visible if the prompt is dynamic/template-based)
- **Search & Filtering:**
  - Provide a search bar for full-text search across prompt Title, Description, and Tags.
  - Implement real-time filtering as the user types.
  - Apply debouncing to search input to optimize performance.
  - Handle aborting of in-flight API requests if the user continues typing before the previous request resolves.
- **Dynamic Prompt Execution:**
  - Clicking the "Use" button on a dynamic prompt must open the prompt in a new tab.
  - The new tab must reuse the existing UI layout/components currently used for displaying public prompts.

**3. Inputs and Outputs: Primary Actions**

- **USER ACTION:** Navigate to `/marketplace`
  - **SYSTEM BEHAVIOR:** Load and display the marketplace page with a list of all public prompts without requiring sign-in.
- **USER ACTION:** Type in the search bar
  - **SYSTEM BEHAVIOR:** Wait for debounce threshold. Abort any pending search requests. Send a new search request matching Title, Description, and Tags. Update the prompt list in real-time.
- **USER ACTION:** Click "Copy" on a prompt card
  - **SYSTEM BEHAVIOR:** Copy the prompt content to the user's clipboard and show a success indicator (e.g., toast notification).
- **USER ACTION:** Click "Use" on a dynamic prompt card
  - **SYSTEM BEHAVIOR:** Open a new browser tab navigating to the specific prompt's usage page, rendering the existing public prompt UI.

**4. Constraints**

- The route `/marketplace` must strictly not trigger any auth redirects from Next.js middleware or Clerk.
- Search must be performant, relying on debouncing and AbortController to prevent race conditions and excessive API calls.
- The "Use" button flow must maintain UI consistency with existing public prompt pages.

**5. Edge Cases and Error Handling**

- **No Search Results:** Display a clear empty state (e.g., "No public prompts found matching your search.").
- **Empty Marketplace (No Public Prompts):** Display a placeholder state (e.g., "No public prompts available yet.").
- **Search API Failure:** Show an error message (e.g., "Unable to load search results. Please try again.") and perhaps a retry mechanism.
- **Copy Failure:** If clipboard API fails, provide a fallback or error toast.
- **Aborted Requests:** Aborted fetch requests should be handled silently without showing error toasts to the user.

**6. Acceptance Criteria**

- Unauthenticated users can successfully visit `/marketplace`.
- Prompt cards accurately display the title, description, author details, tags, copy button, and (conditionally) the use button.
- Typing in the search bar filters prompts in real-time by title, description, and tags, with verifiable debouncing and request cancellation.
- Clicking "Use" on a dynamic prompt opens a new tab with the correct public prompt UI.
- Clicking "Copy" successfully places the prompt text in the user's clipboard.
