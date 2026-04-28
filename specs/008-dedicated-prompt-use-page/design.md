# Technical Design: Dedicated Prompt Use Page

## 1. Objective
Implement a general "Workspace" or "Prompt Use" entry point from the global sidebar and allow contextual visibility of the localized prompt-switching sidebar based on how the user navigated to the prompt execution view.

## 2. Architecture & Routing Strategy
To satisfy the requirement of having two distinct views (a general workspace with a localized sidebar, and a focused specific view without it) without duplicating the complex prompt execution logic, we will use a **URL Search Parameter** (`?mode=focused`) coupled with a **new entry route** (`/use`).

*   **Global Navigation (`/use`):** A new route that serves as the entry point for the general Workspace. It will determine if the user has template prompts and redirect them to the first available prompt (`/prompts/[id]/use`), allowing the localized sidebar to display naturally.
*   **Focused Navigation (`?mode=focused`):** When accessing a specific prompt directly from a prompt card, the application will append `?mode=focused` to the URL (e.g., `/prompts/[id]/use?mode=focused`). The layout component will read this parameter and hide the localized sidebar.

This approach ensures the state is bookmarkable, avoids duplicated route structures, and aligns with Next.js App Router patterns for UI state derived from the URL.

## 3. Component Updates

### A. Navigation Configuration (`src/lib/navigation.ts`)
*   Add a new `NavigationItem` for the Workspace/Prompt Use page.
*   **Properties:** `title: 'Workspace'`, `href: '/use'`, `icon: 'lucide:monitor-play'`, `requireAuth: true`.

### B. Prompt Card (`src/components/prompts/PromptCard.tsx`)
*   Locate the "Use Template" `<Link>` inside the card.
*   Update the `href` to append the query parameter: `` href={`/prompts/${prompt._id}/use?mode=focused`} ``.

### C. General Use Entry Page (`src/app/(protected)/use/page.tsx`)
*   Create a new client component page.
*   Use `useQuery(api.authed.prompts.getPrompts)` to fetch the user's prompts.
*   Filter for `isTemplate === true`.
*   **Loading State:** Show a loading skeleton if the query is undefined.
*   **Empty State:** If no templates exist, render a user-friendly empty state with a call-to-action button linking to `/prompts/create`.
*   **Redirect:** If templates exist, use `router.replace(`/prompts/${templates[0]._id}/use`)` to seamlessly drop the user into the first template. Since no `?mode=focused` is appended, the localized sidebar will be visible.

### D. Prompt Use Layout (`src/components/prompts/use/PromptUseLayout.tsx`)
*   Import `useSearchParams` from `next/navigation`.
*   Extract the mode: `const searchParams = useSearchParams(); const isFocusedMode = searchParams.get('mode') === 'focused';`.
*   **Conditional Rendering:**
    *   If `isFocusedMode` is true, return only the main content wrapper (bypassing `PromptUseSidebar` and `PromptUseMobileSwitcher`).
    *   If false, return the existing layout structure which includes the localized sidebars.
*   *Note:* Ensure `PromptUseLayout` correctly handles the suspense boundary around `useSearchParams` by either wrapping its usage in a `<Suspense>` boundary higher up (e.g., in `layout.tsx`) or acknowledging that Next.js handles it cleanly for client components if they are dynamically rendered. In our case, the layout is under an authed route and is client-side rendered.

### E. Sidebar Context
*   The global application sidebar (`src/components/layout/Sidebar.tsx`) remains unaffected and will naturally persist across all these routes because it is defined in the root `AppLayout`.

## 4. State Management
*   **Sidebar Visibility:** Completely derived from the URL (`?mode=focused`). No React Context or local `useState` is necessary. This prevents state mismatch on hard reloads and keeps the components decoupled.
*   **Active Prompt Identification:** Remains derived from the route parameters (`useParams().id`).

## 5. Edge Cases Addressed
*   **No Templates Available:** The `/use` route explicitly handles the empty state rather than relying on the specific `[id]/use` route to fail.
*   **Deleted Prompt Accessed via URL:** The existing `[id]/use/page.tsx` already handles the `prompt === null` scenario by displaying a "Prompt not found" error and a button to return to the dashboard.
