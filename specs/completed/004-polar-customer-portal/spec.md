# Polar Customer Portal Specification

**1. Overview**
Provide a way for users to manage their active subscriptions and billing information using Polar.sh's Hosted Customer Portal.

**2. User Stories**

- As a subscriber, I want to manage my billing details so that I can update my payment method.
- As a subscriber, I want to view my active subscriptions so that I can track my expenses.
- As a subscriber, I want to cancel or upgrade my subscription through a secure portal.

**3. Functional Requirements**

- Authenticate the user using Clerk.
- Generate a secure Customer Session token from Polar using the user's `clerkId`.
- Redirect the user to the Polar Hosted Customer Portal.
- Handle errors gracefully using the existing `Effect` pattern.

**4. Technical Requirements**

- Integration with `@polar-sh/sdk`.
- Secure handling of `POLAR_ACCESS_TOKEN`.
- Type-safe implementation using TypeScript and `Effect`.

**5. Success Criteria**

- The user is successfully redirected to their personalized Polar billing portal.
- Unauthorized users receive a clear error message.
- Configuration errors are logged and reported correctly.
