import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { Effect } from 'effect';
import {
  verifyWebhook,
  toHttpResponse,
  type ClerkWebhookPayload,
  type PolarWebhookPayload,
} from './webhooks';
import { type SubscriptionTier } from './subscription';

const http = httpRouter();

// ---------------------------------------------------------------------------
// Clerk webhook — user lifecycle events
// ---------------------------------------------------------------------------

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    return toHttpResponse(
      Effect.gen(function* () {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
          return yield* Effect.fail(
            new Response('Configuration error', { status: 500 }),
          );
        }

        const event = yield* verifyWebhook<ClerkWebhookPayload>(
          request,
          webhookSecret,
        );

        if (event.type === 'user.created' || event.type === 'user.updated') {
          const data = event.data;
          const email = data.email_addresses?.[0]?.email_address;
          const name =
            [data.first_name, data.last_name].filter(Boolean).join(' ') ||
            undefined;

          if (!email) {
            return yield* Effect.fail(
              new Response('Email missing in webhook data', { status: 400 }),
            );
          }

          yield* Effect.tryPromise({
            try: () =>
              ctx.runMutation(internal.users.upsertFromClerk, {
                clerkId: data.id,
                email,
                name,
                imageUrl: data.image_url,
              }),
            catch: (error) => {
              console.error('Error upserting user:', error);
              return new Response('Database error', { status: 500 });
            },
          });
        }

        return new Response('Webhook processed', { status: 200 });
      }),
    );
  }),
});

// ---------------------------------------------------------------------------
// Polar webhook — subscription lifecycle events
// ---------------------------------------------------------------------------

http.route({
  path: '/polar-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    return toHttpResponse(
      Effect.gen(function* () {
        const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
        if (!webhookSecret) {
          return yield* Effect.fail(
            new Response('Configuration error', { status: 500 }),
          );
        }

        // Polar requires the secret to be base64-encoded before verification
        const event = yield* verifyWebhook<PolarWebhookPayload>(
          request,
          webhookSecret,
          true,
        );

        if (event.type.startsWith('subscription.')) {
          const data = event.data;
          const clerkId = (data.metadata?.clerkId ||
            data.customer?.metadata?.clerkId ||
            data.customer?.external_id) as string | undefined | null;

          if (clerkId) {
            const tier: SubscriptionTier =
              data.status === 'active' ? 'pro' : 'hobby';

            const userInfo = yield* Effect.tryPromise({
              try: () =>
                ctx.runQuery(internal.private.users.getUserEmailAndTier, {
                  clerkId,
                }),
              catch: (error) => new Error(`User fetch failed: ${error}`),
            }).pipe(
              Effect.match({
                onFailure: (error) => {
                  console.error(
                    'Failed to fetch user info for email dispatch:',
                    error,
                  );
                  return null;
                },
                onSuccess: (info) => info,
              }),
            );

            if (
              userInfo &&
              userInfo.subscriptionTier !== 'pro' &&
              tier === 'pro'
            ) {
              yield* Effect.tryPromise({
                try: () =>
                  ctx.runAction(internal.private.emails.sendProWelcome, {
                    email: userInfo.email,
                  }),
                catch: (error) => new Error(`Email dispatch failed: ${error}`),
              }).pipe(
                Effect.match({
                  onFailure: (error) => {
                    console.error(
                      'Failed to dispatch welcome email action:',
                      error,
                    );
                    return null;
                  },
                  onSuccess: (res) => res,
                }),
              );
            }

            yield* Effect.tryPromise({
              try: () =>
                ctx.runMutation(internal.users.updateSubscriptionTier, {
                  clerkId,
                  tier,
                  polarCustomerId: data.customer?.id,
                  polarSubscriptionId: data.id,
                }),
              catch: (error) => {
                console.error('Error updating subscription tier:', error);
                return new Response('Database error', { status: 500 });
              },
            });
          }
        }

        return new Response('Webhook processed', { status: 200 });
      }),
    );
  }),
});

export default http;
