# Welcome Email on Signup Technical Design

**1. Objective**
Implement an automated welcome email sent to new users immediately upon account creation, utilizing the Brevo API and a Convex Action triggered during the Clerk user sync process.

**2. Tech Stack**

- **Convex Actions**: For asynchronous, side-effect execution (HTTP request to Brevo) without blocking the database mutation.
- **Brevo API (via Fetch API)**: Using the standard Web Fetch API built into the Convex runtime to hit `https://api.brevo.com/v3/smtp/email`. Avoiding installing the `brevo` SDK keeps the bundle lightweight and is sufficient for a simple email sending endpoint.
- **Clerk Webhooks**: Existing infrastructure that syncs new users to the Convex database.

**3. High-Level Architecture**

- **Trigger**: The existing Clerk webhook (`/clerk-users-webhook` in `convex/http.ts`) triggers the internal mutation `users.upsertFromClerk`.
- **Database Layer**: `convex/users.ts` inserts the new user into the database and uses `ctx.scheduler.runAfter(0, ...)` to fire the email action asynchronously.
- **Backend (Convex Action)**: A new file `convex/emails.ts` will contain an `internalAction` called `sendWelcomeEmail` that performs the actual HTTP POST request to Brevo.

**4. Data Model**
No changes are required to the existing `users` table schema, but we will utilize the `email` and `name` properties of the inserted user document.

**5. Core Design Decisions**

- **Fetch API vs Brevo SDK**: Decided to use `fetch` instead of adding the official Brevo SDK dependency. The Convex environment fully supports `fetch`, and for a simple transactional email, standard fetch minimizes dependencies and bundle size.
- **Event-Driven via Scheduler**: We use `ctx.scheduler.runAfter` inside the `users.upsertFromClerk` mutation rather than awaiting the action or running it in the webhook directly. This guarantees the email is only queued if the database transaction (user insert) succeeds, and it decouples the email sending from the Clerk webhook response latency.
- **Graceful Failure**: The `sendWelcomeEmail` action will swallow/log errors if the Brevo API fails or if `BREVO_API_KEY` is not set, preventing any downstream failures since it's already running asynchronously in the background.

**6. Core Functional Flows**

_Flow: User Sync to Welcome Email_

1. Clerk sends a `user.created` or `user.updated` event to `/clerk-users-webhook`.
2. The webhook verifies the payload and calls `internal.users.upsertFromClerk` with `clerkId`, `email`, `name`, `imageUrl`.
3. In `convex/users.ts` (`upsertFromClerk`):
   - We check if the user already exists.
   - If **not**, we insert the new user.
   - Immediately after insert, we schedule the email:
     ```typescript
     await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
       email: args.email,
       name: args.name,
     });
     ```
   - Return the new `_id`.
4. The Convex Scheduler executes `internal.emails.sendWelcomeEmail` (in `convex/emails.ts`).
   - Retrieves `process.env.BREVO_API_KEY`.
   - Constructs a polished HTML payload.
   - Executes a `fetch` POST to `https://api.brevo.com/v3/smtp/email`.
   - Logs success or failure.

**7. Development Plan**

1. **Environment Variables**: Add `BREVO_API_KEY` to the Convex environment (via Convex dashboard).
2. **Action Implementation**: Create `convex/emails.ts` and define `internalAction("sendWelcomeEmail")` with HTML template and Fetch logic.
3. **Database Integration**: Update `convex/users.ts` -> `upsertFromClerk` to schedule the email only on fresh inserts.
4. **Testing**: Run a sign-up flow or trigger the Clerk webhook locally to verify email delivery.
