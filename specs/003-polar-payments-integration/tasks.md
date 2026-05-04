# Polar.sh Payments Integration Tasks

**Overview**
This document outlines the tasks required to integrate Polar.sh subscriptions and enforce prompt creation limits. The implementation is divided into three main phases: Backend mutations and webhooks, usage enforcement in prompt creation, and Next.js/React frontend integration. This structure allows the database layer to be prepared before the frontend consumes the checkout session logic.

## Phases

### Phase 1: Database Mutations & Webhook Infrastructure

_(Sequential: Must be completed before Phase 2 & 3)_

- [ ] `[Phase 1]` Create `updateSubscriptionTier` mutation in `convex/users.ts` to accept a `clerkId` and `tier` string ('pro' or 'hobby') and patch the corresponding user's `subscriptionTier`.
- [ ] `[Phase 1]` Add `/polar-webhook` HTTP route to `convex/http.ts`. Ensure it handles POST requests.
- [ ] `[Phase 1]` In `/polar-webhook`, use `svix` `Webhook` instance to securely verify the Polar webhook signature using standard `svix-id`, `svix-timestamp`, and `svix-signature` headers mapped from incoming `webhook-*` headers.
- [ ] `[Phase 1]` In `/polar-webhook`, process `subscription.created`, `subscription.updated`, and `subscription.revoked` events, extracting `clerkId` from the payload's `customer_metadata`.
- [ ] `[Phase 1]` In `/polar-webhook`, execute the internal `updateSubscriptionTier` mutation based on the subscription status ('active' -> 'pro', otherwise -> 'hobby').

### Phase 2: Backend Usage Enforcement

_(Sequential: Relies on the user subscription tier field being properly established)_

- [ ] `[Phase 2]` Modify `createPrompt` in `convex/authed/prompts.ts` to extract the `subscriptionTier` from the fetched user record.
- [ ] `[Phase 2]` Modify `createPrompt` to extract `promptStats.total` (defaulting to 0) from the user record.
- [ ] `[Phase 2]` Add logic in `createPrompt`: if the `subscriptionTier` is not 'pro' and the `total` is >= 50, throw a specific `Effect.fail(new Error(...))` blocking the prompt creation.

### Phase 3: Frontend Server Actions & UI

_(Parallelizable with Phase 1 & 2 if the Server Action does not strictly rely on Convex types)_

- [ ] `[Phase 3]` Install `@polar-sh/sdk` if not already installed (`pnpm add @polar-sh/sdk`).
- [ ] `[Phase 3]` Create a Next.js Server Action in `src/app/actions/polar.ts` (or similar).
- [ ] `[Phase 3]` In the Server Action, instantiate the Polar client with `POLAR_ACCESS_TOKEN`.
- [ ] `[Phase 3]` In the Server Action, fetch the current user's ID via Clerk (`auth()`), and initiate a checkout session using Product ID `c398bd70-7ccc-4190-8c31-01d274e3c8a4`, passing `clerkId` into `customerMetadata`.
- [ ] `[Phase 3]` In the Server Action, redirect the user to the generated checkout URL upon success.
- [ ] `[Phase 3]` Update the `SubscriptionButton` component to trigger the Server Action instead of a placeholder or static link.
- [ ] `[Phase 3]` Display the current prompt count usage against the 50 limit for Hobby users within the UI (using existing Convex queries if needed, or augmenting the UI state).

## Parallelization Strategy

- **Phase 1** and **Phase 2** can be done sequentially by a backend-focused engineer. They involve pure Convex mutations, queries, and edge handlers.
- **Phase 3** can be done perfectly in parallel with the backend work by a frontend engineer. The Next.js Server Action uses Polar's API and Clerk's auth, neither of which strictly block on the Convex webhook integration or the `prompts.ts` mutation edits being finished.
