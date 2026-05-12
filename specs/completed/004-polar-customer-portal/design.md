# Polar Customer Portal Technical Design

**1. Objective**
Implement a backend Server Action to generate a session for the Polar Hosted Customer Portal. This allows authenticated users to manage their subscriptions, payment methods, and billing history directly on Polar's hosted infrastructure.

**2. Tech Stack**

- **Next.js 16 (App Router)**: Server Actions for secure backend execution.
- **Polar SDK (v0.47.1)**: To interact with Polar's API for session creation.
- **Effect (v4.0.0-beta.52)**: Functional programming library for robust error handling and control flow.
- **Clerk**: Authentication provider to identify the current user.
- **Zod**: Schema validation for environment variables.

**3. High-Level Architecture**

- **Backend (Server Action)**: `createCustomerPortalSession` will reside in `src/app/actions/polar.ts`.
- **Logic Flow**:
  1. Authenticate user via Clerk.
  2. Validate Environment variables.
  3. Initialize Polar client.
  4. Request a customer session from Polar using the user's `clerkId` as the `externalCustomerId`.
  5. Extract the portal URL and redirect the user.

**4. Data Model**
The implementation relies on existing user data mappings:

- `user.id` (Clerk) is mapped to Polar's `externalCustomerId`.
- Polar internal `customer_id` is linked via the `externalCustomerId` provided during checkout/session creation.

**5. Core Design Decisions**

- **Effect Pattern Consistency**: Replicate the `Effect.gen` and `Effect.match` pattern used in `createCheckoutSession` for consistent error handling and logging.
- **Type Safety**: Define a `PortalError` class to differentiate portal-specific failures from checkout failures.
- **Redirect Handling**: Maintain the pattern of calling `redirect()` outside the `Effect` pipeline to correctly handle Next.js's internal redirect mechanics.
- **URL Construction**: The Polar SDK `customerSessions.create` return value will be inspected for a direct `customerPortalUrl`. In SDK v0.47.1, this is the standard field returned in the `customerSession` object.

**6. Core Functional Flows**

**A. Portal Session Generation**

```typescript
// Proposed Implementation in src/app/actions/polar.ts

class PortalError {
  readonly _tag = 'PortalError';
  constructor(readonly cause: unknown) {}
}

export async function createCustomerPortalSession() {
  const program = Effect.gen(function* () {
    const user = yield* Effect.promise(() => currentUser());

    if (!user || !user.id) {
      return yield* Effect.fail(new UnauthorizedError());
    }

    const env = yield* Effect.try({
      try: () => envSchema.parse(process.env),
      catch: (e) => new EnvError(`Environment validation failed: ${e}`),
    });

    const polar = new Polar({
      accessToken: env.POLAR_ACCESS_TOKEN,
      server: env.POLAR_ENVIRONMENT,
    });

    const sessionResponse = yield* Effect.tryPromise({
      try: () =>
        polar.customerSessions.create({
          externalCustomerId: user.id,
        }),
      catch: (error) => new PortalError(error),
    });

    // Extract URL from the response
    const portalUrl = sessionResponse.customerSession?.customerPortalUrl;

    if (!portalUrl) {
      return yield* Effect.fail(
        new PortalError('No portal URL returned by Polar'),
      );
    }

    return portalUrl;
  }).pipe(
    // Match the existing pattern for consistent UI messaging
    Effect.match({
      onFailure: (error) => {
        console.error('Polar Portal Error:', error);
        return {
          success: false as const,
          error: (function () {
            if (error._tag === 'UnauthorizedError')
              return 'You must be logged in to manage your subscription.';
            if (error._tag === 'EnvError')
              return `Configuration error: ${error.message}`;

            const cause = error.cause;
            const causeMessage =
              // Handle error cause serialization
              typeof cause === 'object' && cause !== null
                ? (cause as Error).message || String(cause)
                : String(cause || 'Unknown error');

            return `Portal access failed: ${causeMessage}`;
          })(),
        };
      },
      onSuccess: (url) => ({ success: true as const, url }),
    }),
  );

  const result = await Effect.runPromise(program);

  // Externalize redirect to avoid throwing within the Effect generator
  if (result.success && result.url) {
    redirect(result.url);
  }

  return result;
}
```

**7. Development Plan**

1. **Refine src/app/actions/polar.ts**:
   - Add `PortalError` class.
   - Implement `createCustomerPortalSession` function following the established pattern.
2. **Verification**:
   - Run `pnpm lint` to ensure no syntax or code style issues.
   - Run `pnpm typecheck` to verify SDK method signatures and return types.
