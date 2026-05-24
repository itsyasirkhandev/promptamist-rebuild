# Technical Design Plan: Polar Customer Synchronization

Technical specification for implementing automated and on-demand synchronization of native Polar.sh Customers with the Promptamist Clerk-Convex user system.

## 1. Objective

- Asynchronously create native Polar Customers for new users during signup to enable direct, robust customer association on Polar.
- Persist the returned `polarCustomerId` in the Convex `users` database table.
- Fallback to dynamically creating the Polar Customer on-demand during checkout and billing portal creation if it's missing (e.g., for legacy users or recovery from past network/API failures).
- Update `createCheckoutSession` and `createCustomerPortalSession` server actions to use the native `customerId` instead of relying solely on `externalCustomerId`.
- Ensure that the `polarCustomerId` is kept private and never exposed to the client in standard user DTOs.

---

## 2. Tech Stack

- **Frontend/Server Actions**: Next.js 16 (App Router, Server Actions)
- **Backend**: Convex 1.39 (Queries, Mutations, and Actions)
- **Identity**: Clerk (Clerk webhook & `@clerk/nextjs/server`)
- **Billing Service**: Polar.sh SDK (`@polar-sh/sdk` 0.47+)
- **Data Flow Control**: `Effect.ts` (Functional pipeline & runtime validation)

### Why this stack?

- **Effect.ts** is the core functional architecture of this codebase, allowing us to build predictable, error-safe, and typed action pipelines.
- **Convex Actions** provide a Node.js environment capable of making external HTTP fetch requests to Polar.sh, isolated from V8 mutations.
- **Clerk webhook routing** in Convex HTTP actions allows seamless, low-overhead reactive integration at the moment of user signup.

---

## 3. High-Level Architecture

The synchronization is divided into two distinct lifecycle flows:

### Flow A: Asynchronous Signup Synchronization (Webhook-based)

```
[ Clerk Webhook ] --(user.created)--> [ Convex HTTP Action: http.ts ]
                                                   |
                                            (upsert mutation)
                                                   |
                                                   v
                                     [ Convex Table: users ]
                                                   |
                                          (ctx.scheduler.runAfter)
                                                   |
                                                   v
                                 [ Convex Action: private/users.ts ]
                                                   |
                                           (calls Polar API)
                                                   |
                                                   v
                                      [ Polar.sh Customers ]
                                                   |
                                             (updates ID)
                                                   |
                                                   v
                                     [ Convex Table: users ]
```

### Flow B: On-Demand Checkout / Portal Synchronization (Server Action-based)

```
[ User clicks Upgrade/Portal ] ---> [ Server Action: src/app/actions/polar.ts ]
                                                   |
                                           (Queries Convex)
                                                   |
                                      [ Yes: polarCustomerId exists ] -> [ Polar API: Session with customerId ]
                                      [ No: polarCustomerId missing ] -> [ Polar API: Create Customer ]
                                                                                   |
                                                                           (Saves ID to Convex)
                                                                                   |
                                                                         [ Polar API: Session with new customerId ]
```

---

## 4. Data Model & Schema Changes

The Convex `users` table already has the `polarCustomerId` field defined under `convex/schema.ts`, so no structural table additions are needed.

### DAL (Data Access Layer) Additions

We will add a specific, isolated helper inside `convex/dal/users.dal.ts` to patch only the `polarCustomerId` field on the user document without altering other parameters.

```typescript
// In convex/dal/users.dal.ts

/** Patch polarCustomerId on an existing user. */
export async function patchUserPolarCustomerId(
  ctx: MutationCtx,
  userId: Id<'users'>,
  polarCustomerId: string,
) {
  return ctx.db.patch(userId, {
    polarCustomerId,
    updatedAt: Date.now(),
  });
}
```

---

## 5. Core Design Decisions

### Decision 1: Create Polar Customers Asynchronously via Convex Action Scheduler

- _Why_: If we call the Polar API synchronously inside the Clerk webhook execution context, network delays or transient API downtime from Polar will fail the Clerk webhook request. Clerk will retry, leading to potentially duplicate side-effects. By returning HTTP 200 to Clerk immediately and executing the Polar Customer creation as a scheduled background Convex action, user signup is non-blocking and robust.

### Decision 2: Implement Dynamic Fallback (On-Demand) Creation in Server Actions

- _Why_: Legacy users created prior to this implementation will lack a `polarCustomerId`. By checking for `polarCustomerId` when creating checkout or portal sessions and dynamically creating the Polar Customer on the fly if missing, we ensure 100% backward compatibility and automated recovery without needing a manual migration.

### Decision 3: Exclude `polarCustomerId` from the User DTO (`toUserDTO`)

- _Why_: Security-by-design dictates that internal vendor references, customer IDs, and database identifiers should not be leaked to the frontend/browser client unless strictly necessary. The Server Actions run entirely on the server and retrieve the ID via authenticated Convex client calls, keeping this sensitive reference server-bound.

---

## 6. Core Functional Flows

### A. Data Access Layer (DAL) Helper

Add the database write helper in `convex/dal/users.dal.ts`:

```typescript
// convex/dal/users.dal.ts
export async function patchUserPolarCustomerId(
  ctx: MutationCtx,
  userId: Id<'users'>,
  polarCustomerId: string,
) {
  return ctx.db.patch(userId, {
    polarCustomerId,
    updatedAt: Date.now(),
  });
}
```

### B. Convex Queries & Mutations for Polar Customers

We will expose an authenticated query and mutation to the server action, and internal queries/mutations to the background action.

```typescript
// convex/authed/users.ts

/** Exposes the current user's polarCustomerId to authenticated clients/server actions */
export const getPolarCustomerId = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const user = yield* getUser(ctx, ctx.identity.subject);
        if (!user) return null;
        return user.polarCustomerId ?? null;
      }),
    );
  },
});

/** Saves the user's polarCustomerId from authenticated clients/server actions */
export const savePolarCustomerIdClient = authedMutation({
  args: { polarCustomerId: v.string() },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        yield* Effect.promise(() =>
          patchUserPolarCustomerId(ctx, userId, args.polarCustomerId),
        );
      }),
    );
  },
});
```

```typescript
// In convex/users.ts (Internal Mutations called from Background Action)

export const savePolarCustomerIdInternal = internalMutation({
  args: { clerkId: v.string(), polarCustomerId: v.string() },
  handler: async (ctx, args) => {
    const user = await findUserByClerkId(ctx, args.clerkId);
    if (!user) {
      console.warn(`User not found to save Polar customer ID: ${args.clerkId}`);
      return;
    }
    await patchUserPolarCustomerId(ctx, user._id, args.polarCustomerId);
  },
});
```

```typescript
// In convex/private/users.ts (Internal Query)

export const getUserInfoForPolar = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await findUserByClerkId(ctx, args.clerkId);
    if (!user) return null;
    return {
      userId: user._id,
      polarCustomerId: user.polarCustomerId ?? null,
    };
  },
});
```

### C. Background Customer Sync (Convex Action)

Define the background creation in `convex/private/users.ts`:

```typescript
// In convex/private/users.ts

import { Polar } from '@polar-sh/sdk';
import { internalAction } from '../_generated/server';
import { internal } from '../_generated/api';

export const createPolarCustomerBackground = internalAction({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Fetch Convex user info
    const userInfo = await ctx.runQuery(
      internal.private.users.getUserInfoForPolar,
      {
        clerkId: args.clerkId,
      },
    );

    if (!userInfo) {
      console.warn(
        `Aborting Polar customer creation: Convex user not found for ${args.clerkId}`,
      );
      return;
    }

    if (userInfo.polarCustomerId) {
      console.log(
        `User ${args.clerkId} already has Polar customer ID: ${userInfo.polarCustomerId}`,
      );
      return;
    }

    // 2. Initialize Polar SDK
    const polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: (process.env.POLAR_ENVIRONMENT as any) || 'sandbox',
    });

    try {
      // 3. Create native Polar customer
      const customer = await polar.customers.create({
        email: args.email,
        name: args.name || undefined,
        metadata: {
          clerkId: args.clerkId,
          convexUserId: String(userInfo.userId),
        },
      });

      // 4. Store customer ID back into Convex
      await ctx.runMutation(internal.users.savePolarCustomerIdInternal, {
        clerkId: args.clerkId,
        polarCustomerId: customer.id,
      });

      console.log(
        `Successfully synced Polar customer ${customer.id} for user ${args.clerkId}`,
      );
    } catch (error) {
      console.error(
        `Failed to create background Polar customer for ${args.clerkId}:`,
        error,
      );
    }
  },
});
```

### D. Triggering Background Sync in Webhook

We update the Clerk webhook upsert handler to schedule the action on successful user insertion.

```typescript
// In convex/users.ts -> upsertFromClerk mutation handler:

// ... (after user creation)
const id = await insertUser(ctx, {
  clerkId: args.clerkId,
  email: args.email,
  name: args.name,
  imageUrl: args.imageUrl,
});

// Schedule background Polar customer sync
await ctx.scheduler.runAfter(
  0,
  internal.private.users.createPolarCustomerBackground,
  {
    clerkId: args.clerkId,
    email: args.email,
    name: args.name,
  },
);
```

### E. Next.js Server Actions Updates (`src/app/actions/polar.ts`)

We update both Server Actions to query Convex for `polarCustomerId`. If not present, dynamically create it on the fly and save it.

```typescript
// Snippet for dynamic fallback logic in Server Actions:

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { auth } from '@clerk/nextjs/server';

// helper inside Server Action Effect pipeline to fetch or dynamically create customer ID:
const getOrCreatePolarCustomerId = (polarClient: Polar, clerkUser: any) =>
  Effect.gen(function* () {
    const { getToken } = yield* Effect.promise(() => auth());
    const token = yield* Effect.promise(() => getToken({ template: 'convex' }));

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    if (token) {
      convex.setAuth(token);
    }

    // 1. Fetch polarCustomerId from Convex
    const storedCustomerId = yield* Effect.promise(() =>
      convex.query(api.authed.users.getPolarCustomerId),
    );

    if (storedCustomerId) {
      return storedCustomerId;
    }

    // 2. Missing: Create customer dynamically on Polar
    console.log(
      `Dynamic fallback: creating Polar customer for user ${clerkUser.id}`,
    );
    const customer = yield* Effect.tryPromise({
      try: () =>
        polarClient.customers.create({
          email: clerkUser.primaryEmailAddress?.emailAddress!,
          name: clerkUser.fullName || undefined,
          metadata: {
            clerkId: clerkUser.id,
          },
        }),
      catch: (e) =>
        new Error(`Failed to create Polar Customer dynamically: ${e}`),
    });

    // 3. Save to Convex
    yield* Effect.promise(() =>
      convex.mutation(api.authed.users.savePolarCustomerIdClient, {
        polarCustomerId: customer.id,
      }),
    );

    return customer.id;
  });
```

These IDs will then be passed directly into:

- **Checkout creation**: `polar.checkouts.create({ products: [...], customerId: polarCustomerId })`
- **Portal creation**: `polar.customerSessions.create({ customerId: polarCustomerId })`

---

## 7. Development Plan

1. **DAL Update**: Add `patchUserPolarCustomerId` database write logic in `convex/dal/users.dal.ts`.
2. **Convex Authed & Private Additions**: Implement the client/internal queries and mutations for Polar Customer IDs under `convex/authed/users.ts` and `convex/private/users.ts`.
3. **Background Convex Action**: Implement `createPolarCustomerBackground` action in `convex/private/users.ts`.
4. **Trigger Webhook Integration**: Update `upsertFromClerk` under `convex/users.ts` to schedule the background action on signup.
5. **Server Actions Modernization**: Refactor `createCheckoutSession` and `createCustomerPortalSession` inside `src/app/actions/polar.ts` to use `getOrCreatePolarCustomerId` and pass `customerId` to Polar APIs.
6. **Validation & Verification**: Run typechecking, formatting, and verify complete compatibility.
