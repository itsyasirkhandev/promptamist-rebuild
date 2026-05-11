# Polar.sh Hosted Customer Portal Specification

**1. Problem Statement**
Users need a way to manage their subscription details, update billing information, and view past invoices. Since we use Polar.sh for billing and they do not support embedding the portal via iframe for PCI compliance, we must provide a seamless redirect to Polar's Hosted Customer Portal from our application.

**2. Functional Requirements**

- Provide a "Manage Subscription" (or "Billing Dashboard") button in the application settings/billing area.
- Upon clicking the button, a server action is triggered to generate a Customer Portal Session URL via Polar API.
- The UI must display a loading state while the URL is being fetched.
- The user's browser is redirected to the newly created Portal URL.
- Once finished, the user should be able to click a back button in the Polar portal to return to our application (via `returnUrl`).

**3. Inputs and Outputs: Primary Actions**

- USER ACTION: Click "Manage Subscription" button.
- SYSTEM BEHAVIOR: Show loading state, call Convex/Effect server action. The server action calls `polar.customerSessions.create` using the Clerk user ID as `externalCustomerId`. On success, redirect the user to `result.url`.

**4. Constraints**

- The server action must be wrapped in `Effect.gen()` using the `effect` v4.0.0-beta.52 library to handle errors functionally.
- Environment variables (`POLAR_ACCESS_TOKEN`, etc.) must be validated via Zod.
- Polar Personal Access Token requires the `customer_sessions:write` scope.
- Must use `@polar-sh/sdk` v0.47.1 API patterns.

**5. Edge Cases and Error Handling**

- Missing Environment Variables: Server action should fail predictably and log the Zod validation error; UI shows "Unable to load billing portal".
- Polar API Failure or Missing Auth: Return a structured error via `Effect.match()`. UI gracefully handles the error and allows retry.
- Clerk User Not Found/Logged In: Return Unauthorized error.

**6. Acceptance Criteria**

- A user can click "Manage Subscription" and be redirected to Polar's portal.
- The server action returns `{ success: true, url: string }` or `{ success: false, error: string }`.
- The frontend correctly handles loading and error states without crashing.
