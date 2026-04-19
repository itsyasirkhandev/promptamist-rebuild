# **Actionable TODOs for Handoff**

The following tasks have been broken down into phases for handoff to different engineers or agents. They indicate which phases are sequential bottlenecks and which tasks can be parallelized.

### **Phase 1: Foundation Setup** _(Sequential - Prerequisite)_

- [x] **[Phase 1]** Task 1.1: Configure Environment Variables (`.env.local` template, `.env.example`).
- [x] **[Phase 1]** Task 1.2: Set up `proxy.ts` for route protection at network boundary.
- [x] **[Phase 1]** Task 1.3: Configure Convex Auth (`convex/auth.config.ts`).

### **Phase 2: Provider Integration** _(Sequential - Prerequisite for UI)_

- [x] **[Phase 2]** Task 2.1: Create `components/ConvexClientProvider.tsx` wrapper.
- [x] **[Phase 2]** Task 2.2: Integrate `<ClerkProvider>` and `<ConvexClientProvider>` into `app/layout.tsx` root layout.

### **Phase 3: Authentication Pages** _(Parallelizable - UI tasks can be done concurrently)_

- [x] **[Phase 3]** Task 3.1: Create custom Sign-In page at `app/sign-in/[[...sign-in]]/page.tsx`.
- [x] **[Phase 3]** Task 3.2: Create custom Sign-Up page at `app/sign-up/[[...sign-up]]/page.tsx`.
- [x] **[Phase 3]** Task 3.3: Create shared appearance config at `lib/clerk-appearance.ts` to ensure styling consistency.

### **Phase 4: Protected Routes & Auth State** _(Parallelizable - Frontend vs Backend)_

- [x] **[Phase 4]** Task 4.1: Update `app/page.tsx` with `<Authenticated>`, `<Unauthenticated>`, and `<AuthLoading>` states.
- [x] **[Phase 4]** Task 4.2: Create an example protected route at `app/(protected)/prompts/page.tsx` showcasing user info retrieval.
- [x] **[Phase 4]** Task 4.3: Implement Convex user functions (`convex/users.ts`) including `getCurrentUser` and `upsertFromClerk` for webhooks.
- [x] **[Phase 4]** Task 4.4: Set up the Clerk Webhook route handler at `app/api/webhooks/clerk/route.ts` to sync users to Convex.

### **Phase 5: Polish & Edge Cases** _(Parallelizable)_

- [x] **[Phase 5]** Task 5.1: Implement `components/AuthErrorBoundary.tsx` for graceful error handling.
- [x] **[Phase 5]** Task 5.2: Perform Accessibility (a11y) & Keyboard Navigation audits for all auth pages.
- [x] **[Phase 5]** Task 5.3: Add Playwright E2E tests for sign-up flow and protected route redirects.

### **Phase 6: Documentation & Handoff** _(Sequential - Finalization)_

- [x] **[Phase 6]** Task 6.1: Create `docs/AUTHENTICATION.md` covering architecture, protected routes, and webhook setups.
- [x] **[Phase 6]** Task 6.2: Prepare team training materials, walkthroughs, and Q&A sessions.
