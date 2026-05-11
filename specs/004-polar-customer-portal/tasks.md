# Polar Customer Portal Implementation Tasks

**Overview**
This implementation involves integrating the Polar.sh Hosted Customer Portal so users can manage their subscriptions. The tasks are divided into two main phases: Phase 1 focuses on the backend logic, specifically implementing a Next.js Server Action using Effect-TS to create a Polar customer session. Phase 2 focuses on creating the frontend UI button to trigger this action and integrating it into the billing/settings page.

## Phases

### Phase 1: Backend Setup & Server Actions

_(Sequential: Must be completed before Phase 2)_

- [ ] `[Phase 1]` Verify the `POLAR_ACCESS_TOKEN` in the environment variables has the `customer_sessions:write` scope enabled in the Polar.sh dashboard.
- [ ] `[Phase 1]` Create (or update) the `src/app/actions/polar.ts` file to include the required imports: `Polar` from `@polar-sh/sdk`, `Effect` from `effect`, `auth` from `@clerk/nextjs/server`, and `z` from `zod`.
- [ ] `[Phase 1]` Define the necessary custom error classes in `polar.ts` (`UnauthorizedError`, `EnvError`, `PolarApiError`) to adhere to the Effect-TS functional error handling pattern.
- [ ] `[Phase 1]` Define the Zod schema `envSchema` to validate `POLAR_ACCESS_TOKEN` and `NEXT_PUBLIC_APP_URL` (for the return URL).
- [ ] `[Phase 1]` Implement the `createCustomerPortalSession` server action function wrapped in `Effect.gen()`, utilizing `Effect.tryPromise` to verify the Clerk user, validate environment variables, instantiate the Polar client, and request `customerSessions.create` with the `userId` as the `externalCustomerId`.
- [ ] `[Phase 1]` Return the matching success or failure output from the server action utilizing `Effect.match()`, maintaining the discriminated union return type `{ success: true, url: string } | { success: false, error: string }`.

### Phase 2: Frontend UI & Integration

_(Sequential: Requires Phase 1 server action for actual integration)_

- [ ] `[Phase 2]` Create a new client component `ManageSubscriptionButton.tsx` (e.g., in `src/components/` or appropriate UI folder) that renders a button.
- [ ] `[Phase 2]` Implement `useTransition` inside `ManageSubscriptionButton.tsx` to display a loading state (e.g., a spinner or disabled state) when the button is clicked.
- [ ] `[Phase 2]` Hook up the button's `onClick` handler to invoke the `createCustomerPortalSession` server action.
- [ ] `[Phase 2]` Add logic to handle the server action response: if `success: true`, execute `window.location.href = result.url`; if `success: false`, trigger an error toast or UI notification with the error message.
- [ ] `[Phase 2]` Integrate the `ManageSubscriptionButton` into the appropriate Settings or Billing page of the application.
- [ ] `[Phase 2]` Perform an end-to-end test of clicking the button, verifying the redirect to Polar's Hosted Customer Portal, and utilizing the return button to navigate back to the application.

## Parallelization Strategy

- **Phase 1** and **Phase 2** can be parallelized if the frontend developer mocks the `createCustomerPortalSession` server action return type during Phase 2 development. However, full integration and E2E testing (the final tasks of Phase 2) must remain sequential and wait for Phase 1 to be fully completed.
