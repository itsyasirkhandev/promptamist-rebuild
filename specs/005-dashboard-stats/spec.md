# Specification: Dashboard Statistics on Authenticated Home Page

## 1. Problem Statement

Currently, when users log in and land on the authenticated home screen, they see a blank or generic starting point. There is no immediate visibility into the overall scale and composition of the prompts they have created over time.

This makes it difficult for users to:

- Quickly understand how many prompts they have stored.
- Differentiate how many of those prompts are templates versus regular prompts.
- See how many of their prompts are shared publicly.

**Solution:** Introduce a "Dashboard Statistics" section on the authenticated home screen (`HomeClient.tsx`) that retrieves and displays these three key metrics to give users a quick overview of their prompt repository.

## 2. Functional Requirements

The system should:

- Display a prominent dashboard or card section at the top of the authenticated home page (`src/components/HomeClient.tsx`).
- Display the **Total number of prompts** the user owns.
- Display the **Total number of template prompts** (`isTemplate: true`).
- Display the **Total number of public prompts** (`isPublic: true`).
- Fetch this data securely from the Convex backend based on the authenticated user.
- Reflect changes dynamically (e.g., if a user navigates away, creates a prompt, and comes back, or if real-time subscriptions update the count).
- Use modern React, Next.js, and TailwindCSS patterns for the UI component.

## 3. Inputs and Outputs: System Behavior

### User Action (Input)

- A user successfully authenticates and navigates to the application's root home page (`/`), loading the `HomeClient.tsx` component.

### Expected System Behavior

- The system calls a new Convex query (e.g., `getPromptStats`) for the currently authenticated user.
- The UI shows a loading state (e.g., skeleton loaders or a spinner) while the statistics are being fetched.
- Once fetched, the UI renders three statistic cards/indicators:
  - Total Prompts
  - Total Templates
  - Public Prompts
- If the user has 0 prompts, the stats should still display `0` correctly.

## 4. Technical Details & Implementation

### Convex Backend Update

- **File:** `convex/authed/prompts.ts` (or equivalent file for authed prompt queries).
- **New Query:** `getPromptStats`
  - Needs to filter the `prompts` table by the current authenticated user (`userId`).
  - Should calculate the counts. Since Convex queries can run JavaScript, it can either use `.collect()` and calculate lengths in memory (if prompt count is relatively small), or use a more optimized approach if necessary, though `.filter()` and `.collect().length` is standard for standard use cases.
  - Return shape: `{ total: number, templates: number, public: number }`

### Client Update

- **File:** `src/components/HomeClient.tsx`
- **Hook:** Use `useQuery(api.authed.prompts.getPromptStats)`
- **UI:** Integrate Shadcn UI components (e.g., `Card`, `CardHeader`, `CardTitle`, `CardContent`) to display the metrics in a clean, responsive grid layout.

## 5. Constraints

- The query must execute quickly and be strictly limited to the authenticated user's own data to ensure privacy and security.
- The UI should be responsive and look good on both mobile and desktop screens (e.g., a 1-column layout on mobile, 3-column layout on desktop).
- Must adhere to the project's design guidelines, including TailwindCSS for styling and avoiding custom CSS.

## 6. Edge Cases and Error Handling

- **No Prompts Exist:**
  - Behavior: Display `0` for all statistics.
- **Unauthenticated User:**
  - Behavior: The `HomeClient` is only rendered for authenticated users. The query will fail or return `null`/error if accessed without authentication, which is handled by the Convex authed setup.
- **Query Fails to Load:**
  - Behavior: Display an error state or a generic "Unable to load stats" message within the card area, rather than crashing the entire home page.
- **Large Number of Prompts:**
  - Behavior: Ensure the query does not timeout. If `.collect()` becomes a bottleneck for users with thousands of prompts, consider creating a dedicated aggregation structure in Convex, though basic counting is likely sufficient for MVP.

## 7. Acceptance Criteria

This feature is considered complete if:

- A new Convex query `getPromptStats` successfully returns the three required counts for the logged-in user.
- The `HomeClient` component displays these three numbers accurately.
- The layout is responsive and styled using TailwindCSS.
- Creating a new prompt, toggling a prompt's public state, or setting a prompt as a template instantly updates the respective statistics on the dashboard.
- Loading states (skeletons) are displayed while the data is fetching.

## 8. Out of Scope

- Detailed charts or graphs showing prompt creation over time.
