# Welcome Email on Signup Implementation Tasks

**Overview**
This implementation involves adding a new backend Convex action to send an email via the Brevo API, and wiring it up to trigger asynchronously whenever a new user is synced from Clerk to the Convex database.

## Phases

### Phase 1: Environment & Setup

_(Sequential: Must be completed before Phase 2)_

- [ ] `[Phase 1]` Add `BREVO_API_KEY` to the Convex environment variables via the Convex dashboard.
- [ ] `[Phase 1]` Create a new file `convex/emails.ts` to host email-related background actions.

### Phase 2: Backend Email Action

_(Sequential: Depends on Phase 1)_

- [ ] `[Phase 2]` In `convex/emails.ts`, import `internalAction` from `./_generated/server` and define `sendWelcomeEmail`.
- [ ] `[Phase 2]` Define the arguments for `sendWelcomeEmail`: `email` (string) and `name` (optional string).
- [ ] `[Phase 2]` Implement a basic HTML template inside the action (e.g. greeting the user by name or defaulting to "there").
- [ ] `[Phase 2]` Implement the `fetch` POST request to `https://api.brevo.com/v3/smtp/email` using the `BREVO_API_KEY`, sending the appropriate headers (`api-key`, `content-type`, `accept`) and JSON body.
- [ ] `[Phase 2]` Add error handling to gracefully log any fetch failures or missing API keys without crashing.

### Phase 3: Database Integration & Trigger

_(Sequential: Must be completed after Phase 2)_

- [ ] `[Phase 3]` In `convex/users.ts`, import `internal` from `./_generated/api`.
- [ ] `[Phase 3]` In the `upsertFromClerk` mutation, locate the block where a new user is inserted (when `existingUser` is false).
- [ ] `[Phase 3]` Immediately after the `ctx.db.insert('users', ...)` call, add `await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, { email: args.email, name: args.name });`.

## Parallelization Strategy

- **Phase 1** and **Phase 2** can be developed independently of **Phase 3**. One developer can mock the email action and design the HTML template, while another developer modifies the `users.ts` logic to fire the event. Since this is a relatively small and isolated feature, it is also highly suited for a single agent to execute sequentially from Phase 1 to Phase 3.
