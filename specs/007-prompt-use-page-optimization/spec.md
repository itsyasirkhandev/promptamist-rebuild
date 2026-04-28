# Specification: Prompt "Use" Page Optimization

## 1. Problem Statement

Currently, when a user switches between dynamic prompts using the sidebar on the private "use" page, the entire sidebar list and the dynamic prompt form display skeleton loading states. This causes a jarring and poor user experience, as the UI flickers and disrupts the visual flow.

This makes it difficult for users to:

- Maintain visual context when rapidly switching between prompts.
- Enjoy a seamless and fast navigation experience.
- Trust the responsiveness of the application, as full-page loading states imply heavy fetching even for cached or lightweight data.

**Solution:** Optimize the transition between prompts by leveraging better state management, layout structures, prefetching, and optimistic UI updates to prevent full skeleton loading states on the sidebar and form during navigation.

## 2. Functional Requirements

The system should:

- **Preserve Sidebar State:** The sidebar listing all available dynamic prompts should _never_ show a skeleton loading state when navigating between individual prompts. The list of prompts should persist and remain interactive.
- **Smooth Form Transition:** The dynamic prompt form should transition smoothly. If the next prompt's data is not yet available, show a localized loading state (e.g., inside the form area only, or dimming the current form) rather than replacing the entire component with a skeleton.
- **Prefetching:** Implement prefetching for prompts visible in the sidebar to ensure near-instantaneous loading when clicked.
- **Next.js & Convex Best Practices:** Utilize Next.js App Router mechanisms (Layouts, `useTransition`) and Convex's built-in reactivity/caching to minimize visual latency during navigation.
- **Active State Update:** Ensure the active state in the sidebar updates immediately upon click.

## 3. Inputs and Outputs: Transition Behavior

**USER ACTION (INPUT)**

- User clicks on a different prompt from the sidebar.

**EXPECTED SYSTEM BEHAVIOR**

- The sidebar remains fully visible without reverting to a loading skeleton.
- The clicked prompt immediately becomes highlighted as active.
- The URL updates to reflect the new prompt.
- The main content area updates the form smoothly. If data is pending, display a subtle localized loading state rather than tearing down the whole UI.
- Once data is loaded (or instantly if cached), the form is fully interactive with the new prompt's variables.

## 4. Technical Implementation & Components

- **Layout Architecture:**
  - Ensure the sidebar is part of a parent Layout component (`layout.tsx`) that wraps the individual prompt page (`page.tsx`). This Next.js pattern inherently prevents the sidebar from re-rendering/re-fetching on child route navigations.
- **Data Fetching & State:**
  - The layout component (or a client wrapper within it) should execute the Convex query for the prompt list. This ensures the list stays mounted.
  - The individual prompt page should only fetch data for the specific prompt.
- **Transition Handling:**
  - Use React's `useTransition` hook or Next.js built-in loading UI (`loading.tsx` scoped to the prompt page, not the layout) to handle pending states gracefully.
- **Next.js Routing:**
  - Utilize the Next.js `<Link>` component's default prefetching behavior to preload linked pages in the background.

## 5. Constraints

- The optimization must not introduce stale data issues.
- Must adhere to the existing Next.js App Router patterns and Convex AI guidelines.
- The changes must be backwards-compatible with the existing mobile switcher implementation (which should also benefit from the layout structure).
- Zero impact on the public prompt page component tree.

## 6. Edge Cases and Error Handling

- **Slow Network Connection:**
  - The localized loading state in the form area should clearly indicate progress without hiding the sidebar navigation.
- **Failed Fetch for Next Prompt:**
  - If navigating to a prompt fails, show an error boundary/message within the form area, but keep the sidebar fully functional.
- **Prompt Deleted in Background:**
  - If a user clicks a prefetched prompt that was just deleted, handle the "not found" state gracefully with a specific error message and allow the user to select another prompt.

## 7. Acceptance Criteria

This feature is considered complete if:

- Clicking between prompts in the sidebar does not trigger a skeleton loading state for the sidebar itself.
- The transition between forms is smooth, avoiding jarring full-component replacements with skeletons.
- The active state in the sidebar updates instantly upon click.
- The solution correctly relies on Next.js Layouts and React transition states.
- The application remains stable and responsive under varying network conditions.
- Edge cases (failed loads, slow networks) provide user-friendly feedback without breaking the layout.
