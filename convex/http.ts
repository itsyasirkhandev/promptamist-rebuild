import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { Webhook } from 'svix';
import { Effect } from 'effect';

interface ClerkWebhookPayload {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string;
  };
}

interface PolarWebhookPayload {
  type: string;
  data: {
    id?: string;
    metadata?: Record<string, unknown>;
    customer?: {
      id?: string;
      external_id?: string | null;
      metadata?: Record<string, unknown>;
    };
    status?: string;
  };
}

const http = httpRouter();

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const program = Effect.gen(function* () {
      const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return yield* Effect.fail(
          new Response('Configuration error', { status: 500 }),
        );
      }

      const svixId = request.headers.get('svix-id');
      const svixTimestamp = request.headers.get('svix-timestamp');
      const svixSignature = request.headers.get('svix-signature');

      if (!svixId || !svixTimestamp || !svixSignature) {
        return yield* Effect.fail(
          new Response('Missing Svix headers', { status: 400 }),
        );
      }

      const payload = yield* Effect.promise(() => request.text());
      const wh = new Webhook(webhookSecret);

      const event = yield* Effect.try({
        try: () =>
          wh.verify(payload, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
          }) as ClerkWebhookPayload,
        catch: (error) => {
          console.error('Clerk webhook verification failed:', error);
          return new Response('Invalid signature', { status: 400 });
        },
      });

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
    });

    return await Effect.runPromise(
      program.pipe(
        Effect.match({
          onFailure: (error: Response) => error,
          onSuccess: (response: Response) => response,
        }),
      ),
    );
  }),
});

http.route({
  path: '/polar-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const program = Effect.gen(function* () {
      const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return yield* Effect.fail(
          new Response('Configuration error', { status: 500 }),
        );
      }

      const payload = yield* Effect.promise(() => request.text());
      const headers: Record<string, string> = {};
      request.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const wh = new Webhook(btoa(webhookSecret));
      const event = yield* Effect.try({
        try: () => wh.verify(payload, headers) as PolarWebhookPayload,
        catch: (error) => {
          console.error('Polar webhook verification failed:', error);
          return new Response('Invalid signature', { status: 400 });
        },
      });

      if (event.type.startsWith('subscription.')) {
        const data = event.data;
        const clerkId = (data.metadata?.clerkId ||
          data.customer?.metadata?.clerkId ||
          data.customer?.external_id) as string | undefined | null;
        const status = data.status;

        if (clerkId) {
          const tier = status === 'active' ? 'pro' : 'hobby';

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
    });

    return await Effect.runPromise(
      program.pipe(
        Effect.match({
          onFailure: (error: Response) => error,
          onSuccess: (response: Response) => response,
        }),
      ),
    );
  }),
});

export default http;
