import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { Webhook } from 'svix';

const http = httpRouter();

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

export default http;
