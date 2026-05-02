'use server';

import { Polar } from '@polar-sh/sdk';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Effect } from 'effect';
import { z } from 'zod';

class UnauthorizedError {
  readonly _tag = "UnauthorizedError";
}

class CheckoutError {
  readonly _tag = "CheckoutError";
  constructor(readonly cause: unknown) {}
}

class EnvError {
  readonly _tag = "EnvError";
  constructor(readonly message: string) {}
}

const envSchema = z.object({
  POLAR_ACCESS_TOKEN: z.string().min(1, "Polar access token is required"),
  POLAR_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export async function createCheckoutSession(clientOrigin?: string) {
  const program = Effect.gen(function* () {
    const user = yield* Effect.promise(() => currentUser());
    
    if (!user || !user.id) {
      return yield* Effect.fail(new UnauthorizedError());
    }

    const env = yield* Effect.try({
      try: () => envSchema.parse(process.env),
      catch: (e) => new EnvError(`Environment validation failed: ${e}`)
    });

    const headersList = yield* Effect.promise(() => headers());
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
    
    const appUrl = clientOrigin 
      || env.NEXT_PUBLIC_APP_URL 
      || (host ? `${protocol}://${host}` : null)
      || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || 'http://localhost:3000';

    const polar = new Polar({ 
      accessToken: env.POLAR_ACCESS_TOKEN,
      server: env.POLAR_ENVIRONMENT,
    });
    
    const checkout = yield* Effect.tryPromise({
      try: () => polar.checkouts.create({
        products: ['c398bd70-7ccc-4190-8c31-01d274e3c8a4'],
        externalCustomerId: user.id,
        customerEmail: user.primaryEmailAddress?.emailAddress,
        customerName: user.fullName || undefined,
        metadata: { clerkId: user.id },
        customerMetadata: { clerkId: user.id },
        successUrl: `${appUrl}/?success=true`,
      }),
      catch: (error) => new CheckoutError(error)
    });

    if (!checkout.url) {
      return yield* Effect.fail(new CheckoutError("No checkout URL returned by Polar"));
    }

    return checkout.url;
  }).pipe(
    Effect.match({
      onFailure: (error) => {
        console.error("Polar Checkout Error:", error);
        return { 
          success: false as const, 
          error: (function() {
            if (error._tag === "UnauthorizedError") return "You must be logged in to subscribe.";
            if (error._tag === "EnvError") return `Checkout configuration error: ${error.message}`;
            
            const cause = error.cause;
            const causeMessage = typeof cause === 'object' && cause !== null 
              ? ((cause as Error).message || String(cause))
              : String(cause || "Unknown error");
              
            return `Checkout failed: ${causeMessage}`;
          })()
        };
      },
      onSuccess: (url) => ({ success: true as const, url })
    })
  );

  const result = await Effect.runPromise(program);

  // Next.js redirect must be called outside of Effect pipeline because it throws an internal error to break control flow
  if (result.success && result.url) {
    redirect(result.url);
  }

  return result;
}
