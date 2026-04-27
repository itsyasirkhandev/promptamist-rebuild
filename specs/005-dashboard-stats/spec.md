# Specification: Dashboard Statistics on Authenticated Home Page

## 1. Problem Statement

Currently, when users log in and land on the authenticated home screen, they see a generic starting point. There is no immediate visibility into the overall scale, composition, and recent activity of their created prompts.

This makes it difficult for users to:

- Quickly understand how many prompts they have stored.
- Differentiate how many of those prompts are templates versus regular prompts.
- See how many of their prompts are shared publicly.
- Know how active they have been recently (new prompts this week).
- Quickly see when their last activity (prompt creation) occurred.

**Solution:** Introduce a comprehensive "Dashboard Statistics" section on the authenticated home screen that retrieves and displays key metrics and recent activity to give users a quick overview of their prompt repository.

## 2. Functional Requirements

The system should:

- Display a prominent dashboard or card section at the top of the authenticated home page (`src/components/HomeClient.tsx`).
- Display the **Total number of prompts** the user owns.
- Display the **Total number of template prompts** (`isTemplate: true`).
- Display the **Total number of public prompts** (`isPublic: true`).
- Display **New Prompts This Week**, showing the count of prompts created within the last 7 days.
- Display **Most Recent Activity**, showing a human-readable relative time of when the last prompt was created (e.g., "Last prompt created 2 days ago.").
- Fetch this data securely from the Convex backend based on the authenticated user.
- Reflect changes dynamically (e.g., if a user navigates away, creates a prompt, and comes back, or via real-time subscriptions).
- Use modern React, Next.js, and TailwindCSS patterns for the UI component.

## 3. Inputs and Outputs: System Behavior

**USER ACTION (INPUT)**
When a user successfully authenticates and navigates to the application's root home page (`/`), loading the `HomeClient.tsx` component.

**EXPECTED SYSTEM BEHAVIOR**

- The system calls a Convex query (e.g., `getPromptStats`) for the currently authenticated user.
- The UI shows a loading state (e.g., skeleton loaders) while statistics are being fetched.
- Once fetched, the UI renders the statistics cards:
  - Total Prompts
  - Total Templates
  - Public Prompts
  - New Prompts This Week
  - Most Recent Activity text (e.g., in a footer or as a separate card/label).
- If the user has 0 prompts, the stats should correctly display `0`, and recent activity should state "No activity yet".

## 4. Technical Details & Implementation

### Convex Backend Update

- **File:** `convex/authed/prompts.ts` (or equivalent file for authed prompt queries).
- **New/Updated Query:** `getPromptStats`
  - Needs to filter the `prompts` table by the current authenticated user (`userId`).
  - Calculate total counts (Total, Templates, Public).
  - Calculate "New Prompts This Week" by comparing the prompt's creation time (`_creationTime`) against a timestamp representing exactly 7 days ago.
  - Find the most recent prompt by ordering by `_creationTime` descending and taking the first one to determine the "Most Recent Activity" timestamp.
  - Return shape: `{ total: number, templates: number, public: number, newThisWeek: number, lastActivityAt: number | null }`

### Client Update

- **File:** `src/components/HomeClient.tsx`
- **Dependencies:** Use `date-fns` (or similar utility) to format the `lastActivityAt` timestamp into a relative string (e.g., `formatDistanceToNow`).
- **Hook:** Use `useQuery(api.authed.prompts.getPromptStats)`.
- **UI:** Integrate Shadcn UI components (`Card`, `CardHeader`, `CardTitle`, `CardContent`) to display the metrics in a clean, responsive grid layout (e.g., 2x2 or 4 columns on desktop).

## 5. Constraints

- The query must execute quickly and be strictly limited to the authenticated user's own data to ensure privacy and security.
- The UI should be responsive and look good on both mobile and desktop screens (e.g., 1-column layout on mobile, multi-column layout on desktop).
- The relative time for recent activity should be easily understandable.
- Must adhere to the project's design guidelines, including TailwindCSS for styling and avoiding custom CSS.

## 6. Edge Cases and Error Handling

- **No Prompts Exist**
  - Behavior: Display `0` for all statistics and "No activity yet" for the most recent activity.
- **Unauthenticated User**
  - Behavior: The `HomeClient` is only rendered for authenticated users. The query will fail or return `null`/error if accessed without authentication, which is handled by the Convex authed setup.
- **Query Fails to Load**
  - Behavior: Display an error state or a generic "Unable to load stats. Please try again." message within the card area, rather than crashing the entire home page.
- **Large Number of Prompts**
  - Behavior: Ensure the query does not timeout or cause performance issues.

## 7. Acceptance Criteria

This feature is considered complete if:

- A Convex query `getPromptStats` successfully returns the counts (Total, Templates, Public, New This Week) and the `lastActivityAt` timestamp for the logged-in user.
- The `HomeClient` component displays these statistics accurately.
- The "Most Recent Activity" shows a human-readable relative string (e.g., "Last prompt created 2 days ago.").
- The layout is responsive and styled using TailwindCSS.
- Creating a new prompt instantly updates "New Prompts This Week" and "Most Recent Activity" stats.
- Toggling a prompt's public state or template status updates respective statistics instantly.
- Loading states (skeletons) are displayed while data is fetching.
- Empty states and errors are handled smoothly.

## 8. Out of Scope

- Detailed charts or graphs showing prompt creation over time.
- Tracking activity other than prompt creation (e.g., prompt execution or edits).
