# Polar.sh Payments Integration Technical Design

**1. Objective**
Integrate Polar.sh to monetize the application, introducing a default free "Hobby" tier (limited to 50 total prompts) and a paid "$5/month Pro" tier with unlimited prompts. This requires integrating Polar's checkout system, a webhook handler to keep Convex synchronized with subscription states, and enforcing the new prompt creation limits.

**2. Tech Stack**

- **Frontend/Backend**: Next.js 14+ with React Server Actions for creating secure checkout sessions (`@polar-sh/sdk`).
- **Database/Backend**: Convex for secure, scalable data storage and limit enforcement.
- **Webhooks**: Convex HTTP Actions (`convex/http.ts`) using the `svix` (Standard Webhooks) library for payload verification.

**3. High-Level Architecture**

- **Frontend**: A dedicated React component (`SubscriptionButton` or `PricingModal`) triggers a Next.js Server Action when the user clicks "Upgrade".
- **Next.js Server Action**: Uses the `@polar-sh/sdk` to securely create a checkout session. The current user's `clerkId` is embedded securely in the `metadata` of the checkout session to ensure the webhook can identify the user. Uses `next/navigation` `redirect` to send the user to the Polar checkout.
- **Convex Backend (Webhooks)**: An HTTP endpoint `/polar-webhook` receives standard webhook events (`subscription.created`, `subscription.updated`, `subscription.revoked`). It validates the signature and triggers an internal mutation to update the user's `subscriptionTier` field.
- **Convex Backend (Enforcement)**: The `createPrompt` mutation reads the existing user profile (specifically `promptStats.total`) and throws an error if a Hobby-tier user exceeds the 50 prompt limit.

**4. Data Model**
No new tables are required. We leverage existing fields with minor updates:

_Convex `users` Table:_

- `subscriptionTier: v.optional(v.string())` — Already exists. Will be updated to `"pro"` or `"hobby"`.
- `polarSubscriptionId: v.optional(v.string())` — Optional addition to track the active subscription ID for debugging or cancellation checks.
- `promptStats: v.optional(v.object({ total: v.number(), ... }))` — Already exists. Used for O(1) read operations when enforcing limits.

**5. Core Design Decisions**

- **O(1) Limit Enforcement (Convex Best Practice)**: Following `@/convex-performance-audit` guidelines to prevent _read amplification_, we **will not** run `.collect().length` on the `prompts` table to count prompts. We will use the existing `user.promptStats.total` digest field. This ensures prompt creation remains extremely fast and cheap, regardless of how many prompts exist in the database.
- **Next.js Server Actions for Checkout (Vercel Best Practice)**: Following `@/vercel-react-best-practices` (`server-auth-actions`), we will generate checkout sessions purely on the server. This hides our Polar access tokens and allows us to securely inject the authenticated user's ID without client-side tampering.
- **Standard Webhook Verification**: Polar uses the Standard Webhooks specification. We can reuse the `Webhook` class from the `svix` library already installed in the project (used for Clerk) to verify Polar signatures, as both conform to the same standard.

**6. Core Functional Flows**

**A. Initiating Checkout (Next.js Server Action)**

```typescript
// src/app/actions/polar.ts
'use server';
import { Polar } from '@polar-sh/sdk';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function createCheckoutSession() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const polar = new Polar({ accessToken: process.env.POLAR_ACCESS_TOKEN });

  const checkout = await polar.checkouts.custom.create({
    productId: 'bdea346d-5096-4cf7-b21c-f355ee41eaa4',
    customerMetadata: { clerkId: userId },
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/?success=true`,
  });

  redirect(checkout.url);
}
```

**B. Handling Webhooks (Convex HTTP Action)**

```typescript
// convex/http.ts
http.route({
  path: '/polar-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Standard Webhooks headers: webhook-id, webhook-timestamp, webhook-signature
    const payload = await request.text();
    const wh = new Webhook(process.env.POLAR_WEBHOOK_SECRET!);

    let evt;
    try {
      evt = wh.verify(payload, {
        'svix-id': request.headers.get('webhook-id')!,
        'svix-timestamp': request.headers.get('webhook-timestamp')!,
        'svix-signature': request.headers.get('webhook-signature')!,
      });
    } catch (err) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = evt as any;
    if (event.type.startsWith('subscription.')) {
      const { customer_metadata, status } = event.data;
      const clerkId = customer_metadata?.clerkId;

      if (clerkId) {
        const tier = status === 'active' ? 'pro' : 'hobby';
        await ctx.runMutation(internal.users.updateSubscriptionTier, {
          clerkId,
          tier,
        });
      }
    }
    return new Response('OK', { status: 200 });
  }),
});
```

**C. Limit Enforcement (Convex Mutation)**

```typescript
// convex/authed/prompts.ts (inside createPrompt handler)
const user = yield * getUser(ctx, ctx.identity.subject);

const isPro = user.subscriptionTier === 'pro';
const totalPrompts = user.promptStats?.total ?? 0;

if (!isPro && totalPrompts >= 50) {
  // Enforce Hobby Tier limits securely
  yield *
    Effect.fail(
      new Error(
        'Prompt limit reached. Upgrade to Pro to create unlimited prompts.',
      ),
    );
}

// ... proceed with insert ...
```

**7. Development Plan**

1. **Database & Backend**: Add `internal.users.updateSubscriptionTier` mutation to `convex/users.ts`.
2. **Backend**: Add the `/polar-webhook` route to `convex/http.ts`.
3. **Backend**: Update the `createPrompt` mutation in `convex/authed/prompts.ts` to enforce the limits based on `promptStats.total`.
4. **Next.js Action**: Create `src/app/actions/polar.ts` for generating checkout sessions.
5. **UI**: Update the UI to show the 50 limit and wire up the Upgrade button to call the Server Action.
