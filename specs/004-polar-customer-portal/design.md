# Polar Customer Portal Technical Design

**1. Objective**
Implement a server action and frontend component to integrate Polar.sh's Hosted Customer Portal, enabling authenticated users to manage their subscriptions. The implementation will strictly follow the project's Effect-TS error-handling paradigm.

**2. Tech Stack**

- Next.js 16.2 (App Router)
- Convex (Backend)
- Clerk (Auth)
- `@polar-sh/sdk` v0.47.1
- `effect` v4.0.0-beta.52
- Zod

**3. High-Level Architecture**

- **Frontend**: A React component (e.g., `ManageSubscriptionButton.tsx`) that calls the server action and handles the `useTransition` loading state and possible errors.
- **Backend (Next.js Server Action)**: A server action (`createPortalSessionAction`) in `src/app/actions/polar.ts` that verifies the user via Clerk, validates env variables, and calls the Polar API.

**4. Data Model**
No schema changes required. We will use the existing `users` table tracked in Convex, but the server action only requires the Clerk User ID to pass as `externalCustomerId` to Polar.

**5. Core Design Decisions**

- **Effect-TS for Error Handling**: The server action will be wrapped in `Effect.gen` and use custom error classes (`UnauthorizedError`, `EnvError`, `PolarApiError`).
- **`externalCustomerId` over Convex Query**: Since the prompt specifies we can use the clerk user ID directly as `externalCustomerId` during checkout and session creation, we avoid an unnecessary Convex DB roundtrip.
- **Return URL**: Setting the `returnUrl` property to our app's settings page ensures a seamless loop for the user.

**6. Core Functional Flows**

**Server Action Flow (`src/app/actions/polar.ts`)**

```typescript
import { Polar } from '@polar-sh/sdk';
import { Effect } from 'effect';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

class UnauthorizedError {
  readonly _tag = 'UnauthorizedError';
}
class EnvError {
  readonly _tag = 'EnvError';
  constructor(public readonly message: string) {}
}
class PolarApiError {
  readonly _tag = 'PolarApiError';
  constructor(public readonly message: string) {}
}

const envSchema = z.object({
  POLAR_ACCESS_TOKEN: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().min(1), // For returnUrl
});

export async function createCustomerPortalSession() {
  const program = Effect.gen(function* () {
    // 1. Authenticate User
    const { userId } = yield* Effect.tryPromise({
      try: () => auth(),
      catch: () => new UnauthorizedError(),
    });
    if (!userId) {
      return yield* Effect.fail(new UnauthorizedError());
    }

    // 2. Validate Env
    const envParse = envSchema.safeParse(process.env);
    if (!envParse.success) {
      return yield* Effect.fail(
        new EnvError('Missing or invalid environment variables.'),
      );
    }
    const env = envParse.data;

    // 3. Initialize Polar
    const polar = new Polar({
      accessToken: env.POLAR_ACCESS_TOKEN,
    });

    // 4. Create Session
    const result = yield* Effect.tryPromise({
      try: () =>
        polar.customerSessions.create({
          externalCustomerId: userId,
          returnUrl: `${env.NEXT_PUBLIC_APP_URL}/settings`,
        }),
      catch: (e) =>
        new PolarApiError(
          e instanceof Error ? e.message : 'Unknown Polar API Error',
        ),
    });

    return result.url;
  });

  return Effect.runPromise(
    Effect.match(program, {
      onFailure: (error) => {
        console.error('Portal Session Error:', error);
        return { success: false as const, error: error._tag };
      },
      onSuccess: (url) => ({ success: true as const, url }),
    }),
  );
}
```

**Frontend Flow (`ManageSubscriptionButton.tsx`)**

- Use `useTransition` to show a spinner.
- Call `createCustomerPortalSession()`.
- If `success: true`, `window.location.href = result.url`.
- If `success: false`, show an error toast.

**7. Development Plan**

1. Add/Verify `POLAR_ACCESS_TOKEN` scope (`customer_sessions:write`).
2. Implement `createCustomerPortalSession` server action in `src/app/actions/polar.ts` using Effect-TS.
3. Create the frontend component `ManageSubscriptionButton.tsx`.
4. Add the button to the Settings/Billing page.
5. Test end-to-end redirection and return flow.
