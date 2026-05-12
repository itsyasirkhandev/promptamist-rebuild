# Polar Customer Portal Implementation Tasks

**Overview**
This implementation focuses exclusively on adding the backend Server Action to generate Polar Customer Portal sessions. The work is divided into implementation and verification phases to ensure architectural consistency and type safety.

## Phases

### Phase 1: Backend Implementation

_(Sequential: Core logic must be implemented first)_

- [x] `[Phase 1]` Add `PortalError` class to `src/app/actions/polar.ts` to handle portal-specific exceptions.
- [x] `[Phase 1]` Implement `createCustomerPortalSession` asynchronous function in `src/app/actions/polar.ts`.
- [x] `[Phase 1]` Integrate `currentUser()` from Clerk for session-based authentication within the action.
- [x] `[Phase 1]` Implement the `Effect.gen` pipeline to validate environment variables, initialize the Polar client, and request the customer session.
- [x] `[Phase 1]` Extract the `customerPortalUrl` from the Polar SDK response and handle the redirect outside the Effect pipeline.

### Phase 2: Verification & Quality Assurance

_(Sequential: Must be completed after implementation)_

- [x] `[Phase 2]` Run `pnpm lint` to ensure the new code adheres to the project's coding standards.
- [x] `[Phase 2]` Run `pnpm typecheck` to verify that the Polar SDK method signatures (`polar.customerSessions.create`) and return types are correctly handled.

## Parallelization Strategy

- Since this is a single-file backend update, tasks within Phase 1 should be handled sequentially.
- Phase 2 is strictly dependent on the completion of Phase 1.
