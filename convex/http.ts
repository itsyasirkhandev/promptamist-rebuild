import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { Webhook } from 'svix';
import { z } from 'zod';
import { Effect } from 'effect';

const http = httpRouter();

const PolarWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    status: z.string().optional(),
    customer_metadata: z.record(z.string(), z.any()).optional(),
    external_customer_id: z.string().nullable().optional(),
    customer: z.object({
      external_id: z.string().nullable().optional(),
    }).optional(),
  }).passthrough()
}).passthrough();

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET environment variable');
      return new Response('Configuration error', { status: 500 });
    }

    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing Svix headers', { status: 400 });
    }

    const payload = await request.text();
    const wh = new Webhook(webhookSecret);
    let evt: unknown;

    try {
      evt = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Invalid signature', { status: 400 });
    }

    const event = evt as { type: string; data: Record<string, unknown> };

    if (event.type === 'user.created' || event.type === 'user.updated') {
      const data = event.data as {
        id: string;
        email_addresses?: { email_address: string }[];
        first_name?: string | null;
        last_name?: string | null;
        image_url?: string;
      };
      const email = data.email_addresses?.[0]?.email_address;
      const name =
        [data.first_name, data.last_name].filter(Boolean).join(' ') ||
        undefined;

      if (!email) {
        return new Response('Email missing in webhook data', { status: 400 });
      }

      try {
        await ctx.runMutation(internal.users.upsertFromClerk, {
          clerkId: data.id,
          email: email,
          name: name,
          imageUrl: data.image_url,
        });
      } catch (err) {
        console.error('Error upserting user:', err);
        return new Response('Database error', { status: 500 });
      }
    }

    return new Response('Webhook processed', { status: 200 });
  }),
});

http.route({
  path: '/polar-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const program = Effect.gen(function* () {
      const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return yield* Effect.fail(new Response('Configuration error', { status: 500 }));
      }

      const webhookId = request.headers.get('webhook-id');
      const webhookTimestamp = request.headers.get('webhook-timestamp');
      const webhookSignature = request.headers.get('webhook-signature');

      if (!webhookId || !webhookTimestamp || !webhookSignature) {
        return yield* Effect.fail(new Response('Missing Webhook headers', { status: 400 }));
      }

      const payload = yield* Effect.promise(() => request.text());
      const wh = new Webhook(webhookSecret);
      
      const evt = yield* Effect.try({
        try: () => wh.verify(payload, {
          'svix-id': webhookId,
          'svix-timestamp': webhookTimestamp,
          'svix-signature': webhookSignature,
        }),
        catch: () => new Response('Invalid signature', { status: 400 })
      });

      const event = yield* Effect.try({
        try: () => PolarWebhookSchema.parse(evt),
        catch: () => new Response('Malformed payload', { status: 400 })
      });

      if (event.type.startsWith('subscription.')) {
        const clerkId = event.data?.customer_metadata?.clerkId || 
                        event.data?.external_customer_id || 
                        event.data?.customer?.external_id;
        const status = event.data?.status;

        if (clerkId) {
          const tier = status === 'active' ? 'pro' : 'hobby';
          
          yield* Effect.tryPromise({
            try: () => ctx.runMutation(internal.users.updateSubscriptionTier, { clerkId, tier }),
            catch: () => new Response('Database error', { status: 500 })
          });
        }
      }

      return new Response('Webhook processed', { status: 200 });
    });

    return await Effect.runPromise(
      program.pipe(
        Effect.match({
          onFailure: (error: Response) => error,
          onSuccess: (response: Response) => response
        })
      )
    );
  }),
});

export default http;
