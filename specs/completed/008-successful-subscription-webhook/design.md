# Design Plan: Pro Subscription Email Notification

Technical design for intercepting Hobby-to-Pro subscription upgrades in the Polar webhook and dispatching a welcome email using the Bravo (Brevo) API, with Effect.ts for robust error handling.

---

**1. Objective**

Architect a resilient webhook interceptor within the Convex backend that detects when a user upgrades from a Hobby to a Pro subscription. Upon detection, securely retrieve the user's email via a private Convex query and trigger a fire-and-forget action that dispatches a "Welcome to Pro" email via the Bravo (Brevo) API. All failures in fetching or sending the email must be handled gracefully without disrupting the core subscription tier update.

---

**2. Tech Stack**

| Layer          | Technology        | Version / Notes                                  |
| -------------- | ----------------- | ------------------------------------------------ |
| Frontend       | Next.js / React   | 16.2.6 / 19.2.6                                  |
| Backend        | Convex            | 1.39.1                                           |
| Error Handling | Effect.ts         | 4.0.0-beta.52 (Functional pipeline & fail-safes) |
| Email Provider | Bravo (Brevo) API | REST API for transactional emails                |

**Why this stack?**
Convex HTTP actions provide the exact entry point for the Polar webhook. Effect.ts is already standard in the project and is perfect for treating side-effects (like fetching user data and firing an email action) as safe, composable operations that will not throw unhandled exceptions and crash the payment reconciliation flow. The Bravo (Brevo) API provides a simple REST interface for transactional email delivery.

---

**3. High-Level Architecture**

| Layer                                    | Responsibilities                                                                                                                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Polar Webhook (Convex httpAction)** | Intercepts `subscription.*` events, fetches the user's current tier to detect a Hobby -> Pro transition, and invokes the email action if applicable before updating the tier. |
| **B. Convex Private Query**              | Securely looks up the user's current subscription tier and email address directly from the database using their `clerkId`.                                                    |
| **C. Convex Private Action**             | Executes the HTTP POST request to the Bravo (Brevo) API to send the transactional email.                                                                                      |

**Architecture Flow**

```
[Polar Event] → [Convex httpAction] → [Convex Private Query (getUserEmail)]
                                  ↳ (If Hobby -> Pro) → [Convex Private Action (sendProWelcome)] → [Bravo API]
                                  ↳ [Convex Mutation (updateSubscriptionTier)]
```

---

**4. Data Model**

We will leverage the existing Convex user schema but expose a focused, private internal query to retrieve the necessary fields without exposing sensitive user data to the client.

```ts
// convex/private/users.ts
import { v } from 'convex/values';
import { internalQuery } from '../_generated/server';
import { findUserByClerkId } from '../dal/users.dal';

export const getUserEmailAndTier = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await findUserByClerkId(ctx, args.clerkId);
    if (!user) {
      return null;
    }
    return {
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    };
  },
});
```

---

**5. Core Design Decisions**

| Decision                                                             | Rationale                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Effect.ts for all side-effects**                                   | Using `Effect.tryPromise` with a `catch` block guarantees that neither a Convex query failure nor a Bravo API timeout will throw standard JS errors, ensuring the core webhook always completes its primary job (updating the tier).                                                                                                                   |
| **Separate Private Query**                                           | Fetching the user's email and previous tier before updating ensures we can detect the exact moment of transition (Hobby to Pro) safely.                                                                                                                                                                                                                |
| **Sequential await with Effect failure handling instead of runFork** | Next.js/Convex HTTP endpoints may terminate early if background tasks aren't awaited. By awaiting the `runAction` but wrapping it in `Effect.tryPromise` returning a dummy success on error, we achieve "fire-and-forget" semantics (the main process ignores the failure) while keeping the execution context alive long enough to actually dispatch. |

---

**6. Core Functional Flows**

**A. Webhook Interceptor (Detecting the Transition)**

Triggered by a Polar webhook event. Intercepts the payload, fetches the current user tier, and triggers the email if a valid upgrade is detected.

```ts
// In convex/http.ts
import { internal } from './_generated/api';
// ... inside polar-webhook handler

if (event.type.startsWith('subscription.')) {
  const data = event.data;
  const clerkId = /* existing extraction logic */

  if (clerkId) {
    const newTier: SubscriptionTier = data.status === 'active' ? 'pro' : 'hobby';

    // 1. Fetch current user state gracefully
    const userInfo = yield* Effect.tryPromise({
      try: () => ctx.runQuery(internal.private.users.getUserEmailAndTier, { clerkId }),
      catch: (error) => {
        console.error('Failed to fetch user info for email dispatch:', error);
        return null;
      }
    });

    // 2. Detect transition and trigger email gracefully (Fire and Forget)
    if (userInfo && userInfo.subscriptionTier === 'hobby' && newTier === 'pro') {
      yield* Effect.tryPromise({
        try: () => ctx.runAction(internal.private.emails.sendProWelcome, { email: userInfo.email }),
        catch: (error) => {
          console.error('Failed to dispatch welcome email action:', error);
          return null; // Ignore failure, continue to tier update
        }
      });
    }

    // 3. Update the tier (existing logic)
    yield* Effect.tryPromise({
      try: () => ctx.runMutation(internal.users.updateSubscriptionTier, { /* args */ }),
      // ...
    });
  }
}
```

**B. Bravo API Dispatch Action**

Triggered by the webhook interceptor. Sends the actual welcome email via the Bravo (Brevo) REST API.

```ts
// convex/private/emails.ts
import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import { Effect } from 'effect';

export const sendProWelcome = internalAction({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const sendEmail = Effect.tryPromise({
      try: () =>
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.BRAVO_API_KEY!,
          },
          body: JSON.stringify({
            sender: { name: 'Promptamist', email: 'hello@promptamist.com' },
            to: [{ email: args.email }],
            subject: 'Welcome to Promptamist Pro!',
            htmlContent:
              '<h1>You are now a Pro!</h1><p>Enjoy your newly unlocked entitlements: unlimited prompts, unlimited public sharing, and unlimited static prompt creation.</p>',
          }),
        }),
      catch: (e) => new Error(`Bravo API Fetch Failure: ${e}`),
    });

    const program = Effect.gen(function* () {
      const response = yield* sendEmail;
      if (!response.ok) {
        yield* Effect.fail(
          new Error(
            `Bravo API Error: ${response.status} ${response.statusText}`,
          ),
        );
      }
      return response;
    }).pipe(
      Effect.catchAll((error) => {
        // Log the failure natively; action succeeds without crashing caller
        console.error('Failed to send Pro Welcome email:', error);
        return Effect.succeed(null);
      }),
    );

    await Effect.runPromise(program);
  },
});
```

---

**7. Skills & Tools for Implementation**

| Resource        | Why it's needed for this feature                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Skill: `convex` | Required to correctly implement internal queries and actions within the Convex backend architecture. |

---

**8. Development Plan**

| Phase | Area              | Tasks                                                                                                                     |
| ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1     | Database & Models | Create `convex/private/users.ts` and implement `getUserEmailAndTier`.                                                     |
| 2     | External API      | Create `convex/private/emails.ts` and implement the `sendProWelcome` action with Effect.ts and Bravo API logic.           |
| 3     | Webhooks          | Modify `convex/http.ts` to fetch user state, detect the Hobby -> Pro transition, and trigger the email action gracefully. |
| 4     | Configuration     | Ensure `BRAVO_API_KEY` is added to Convex environment variables.                                                          |
