'use server';

import { Polar } from '@polar-sh/sdk';
import { auth, currentUser, type User } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Effect } from 'effect';
import { z } from 'zod';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { POLAR_CONFIG } from '../../../convex/billing/config';

class UnauthorizedError {
  readonly _tag = 'UnauthorizedError';
}

class CheckoutError {
  readonly _tag = 'CheckoutError';
  constructor(readonly cause: unknown) {}
}

class EnvError {
  readonly _tag = 'EnvError';
  constructor(readonly message: string) {}
}

class PortalError {
  readonly _tag = 'PortalError';
  constructor(readonly cause: unknown) {}
}

const envSchema = z.object({
  POLAR_ACCESS_TOKEN: z.string().min(1, 'Polar access token is required'),
  POLAR_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

const getOrCreatePolarCustomerId = (
  polar: Polar,
  clerkUser: User,
): Effect.Effect<string, Error, never> =>
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
        polar.customers.create({
          email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
          name: clerkUser.fullName || undefined,
          externalId: clerkUser.id,
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
  }) as Effect.Effect<string, Error, never>;

export async function createCheckoutSession(clientOrigin?: string) {
  const program = Effect.gen(function* () {
    const user = yield* Effect.promise(() => currentUser());

    if (!user || !user.id) {
      return yield* Effect.fail(new UnauthorizedError());
    }

    const env = yield* Effect.try({
      try: () => envSchema.parse(process.env),
      catch: (e) => new EnvError(`Environment validation failed: ${e}`),
    });

    const headersList = yield* Effect.promise(() => headers());
    const host = headersList.get('host');
    const protocol =
      headersList.get('x-forwarded-proto') ||
      (host?.includes('localhost') ? 'http' : 'https');

    const appUrl =
      clientOrigin ||
      env.NEXT_PUBLIC_APP_URL ||
      (host ? `${protocol}://${host}` : null) ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null) ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      'http://localhost:3000';

    const polar = new Polar({
      accessToken: env.POLAR_ACCESS_TOKEN,
      server: env.POLAR_ENVIRONMENT,
    });

    const polarCustomerId = yield* getOrCreatePolarCustomerId(polar, user).pipe(
      Effect.match({
        onFailure: (err) => {
          console.warn(
            `Dynamic Polar customer creation failed, falling back to externalCustomerId:`,
            err,
          );
          return null;
        },
        onSuccess: (id) => id,
      }),
    );

    const checkout = yield* Effect.tryPromise({
      try: () => {
        if (polarCustomerId) {
          return polar.checkouts.create({
            products: [POLAR_CONFIG.productId],
            customerId: polarCustomerId,
            successUrl: `${appUrl}${POLAR_CONFIG.successPath}`,
          });
        } else {
          return polar.checkouts.create({
            products: [POLAR_CONFIG.productId],
            externalCustomerId: user.id,
            customerEmail: user.primaryEmailAddress?.emailAddress,
            customerName: user.fullName || undefined,
            metadata: { clerkId: user.id },
            customerMetadata: { clerkId: user.id },
            successUrl: `${appUrl}${POLAR_CONFIG.successPath}`,
          });
        }
      },
      catch: (error) => new CheckoutError(error),
    });

    if (!checkout.url) {
      return yield* Effect.fail(
        new CheckoutError('No checkout URL returned by Polar'),
      );
    }

    return checkout.url;
  }).pipe(
    Effect.match({
      onFailure: (error: {
        _tag?: string;
        message?: string;
        cause?: unknown;
      }) => {
        console.error('Polar Checkout Error:', error);
        return {
          success: false as const,
          error: (function () {
            if (error._tag === 'UnauthorizedError')
              return 'You must be logged in to subscribe.';
            if (error._tag === 'EnvError')
              return `Checkout configuration error: ${error.message}`;

            const cause = error.cause;
            const causeMessage =
              typeof cause === 'object' && cause !== null
                ? (cause as Error).message || String(cause)
                : String(cause || 'Unknown error');

            return `Checkout failed: ${causeMessage}`;
          })(),
        };
      },
      onSuccess: (url) => ({ success: true as const, url }),
    }),
  );

  const result = await Effect.runPromise(program);

  // Next.js redirect must be called outside of Effect pipeline because it throws an internal error to break control flow
  if (result.success && result.url) {
    redirect(result.url);
  }

  return result;
}

export async function createCustomerPortalSession(options?: {
  shouldRedirect?: boolean;
}) {
  const shouldRedirect = options?.shouldRedirect ?? true;
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

    const polarCustomerId = yield* getOrCreatePolarCustomerId(polar, user).pipe(
      Effect.match({
        onFailure: (err) => {
          console.warn(
            `Dynamic Polar customer creation for portal failed, falling back to externalCustomerId:`,
            err,
          );
          return null;
        },
        onSuccess: (id) => id,
      }),
    );

    const sessionResponse = yield* Effect.tryPromise({
      try: () => {
        if (polarCustomerId) {
          return polar.customerSessions.create({
            customerId: polarCustomerId,
          });
        } else {
          return polar.customerSessions.create({
            externalCustomerId: user.id,
          });
        }
      },
      catch: (error) => new PortalError(error),
    });

    // Extract URL from the response
    const portalUrl = sessionResponse.customerPortalUrl;

    if (!portalUrl) {
      return yield* Effect.fail(
        new PortalError('No portal URL returned by Polar'),
      );
    }

    return portalUrl;
  }).pipe(
    // Match the existing pattern for consistent UI messaging
    Effect.match({
      onFailure: (error: {
        _tag?: string;
        message?: string;
        cause?: unknown;
      }) => {
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
  if (result.success && result.url && shouldRedirect) {
    redirect(result.url);
  }

  return result;
}
