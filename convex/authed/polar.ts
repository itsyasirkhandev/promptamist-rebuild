import { authedAction } from './helpers';
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { Polar } from '@polar-sh/sdk';

// Helper to initialize Polar SDK in Convex
const getPolarClient = () => {
  const token = process.env.POLAR_ACCESS_TOKEN;
  const env =
    (process.env.POLAR_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';

  if (!token) {
    throw new Error(
      'POLAR_ACCESS_TOKEN is not configured in the Convex dashboard settings.',
    );
  }

  return new Polar({
    accessToken: token,
    server: env,
  });
};

export const generateCheckoutUrl = authedAction({
  args: {
    clientOrigin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clerkId = ctx.identity.subject;

    // 1. Fetch user info
    const userInfo = await ctx.runQuery(
      internal.private.users.getUserInfoForPolar,
      {
        clerkId,
      },
    );

    if (!userInfo) {
      throw new Error(`User not found: ${clerkId}`);
    }

    const polar = getPolarClient();
    let polarCustomerId = userInfo.polarCustomerId;

    // 2. Missing: Create customer dynamically on Polar
    if (!polarCustomerId) {
      console.log(
        `Dynamic fallback: creating Polar customer for user ${clerkId}`,
      );
      const customer = await polar.customers.create({
        email: userInfo.email,
        name: userInfo.name || undefined,
        externalId: clerkId,
        metadata: {
          clerkId,
          convexUserId: String(userInfo.userId),
        },
      });

      polarCustomerId = customer.id;

      // 3. Save ID back to Convex
      await ctx.runMutation(internal.users.savePolarCustomerIdInternal, {
        clerkId,
        polarCustomerId,
      });
    }

    // Determine application origin
    const appUrl =
      args.clientOrigin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';

    // 4. Create checkout session
    const checkout = await polar.checkouts.create({
      products: ['bdea346d-5096-4cf7-b21c-f355ee41eaa4'], // Your Polar product ID
      customerId: polarCustomerId,
      successUrl: `${appUrl}/?success=true`,
    });

    if (!checkout.url) {
      throw new Error('No checkout URL returned by Polar');
    }

    return { url: checkout.url };
  },
});

export const generatePortalUrl = authedAction({
  args: {},
  handler: async (ctx) => {
    const clerkId = ctx.identity.subject;

    // 1. Fetch user info
    const userInfo = await ctx.runQuery(
      internal.private.users.getUserInfoForPolar,
      {
        clerkId,
      },
    );

    if (!userInfo) {
      throw new Error(`User not found: ${clerkId}`);
    }

    const polar = getPolarClient();
    let polarCustomerId = userInfo.polarCustomerId;

    // 2. Missing: Create customer dynamically on Polar
    if (!polarCustomerId) {
      console.log(
        `Dynamic fallback: creating Polar customer for user ${clerkId}`,
      );
      const customer = await polar.customers.create({
        email: userInfo.email,
        name: userInfo.name || undefined,
        externalId: clerkId,
        metadata: {
          clerkId,
          convexUserId: String(userInfo.userId),
        },
      });

      polarCustomerId = customer.id;

      // 3. Save ID back to Convex
      await ctx.runMutation(internal.users.savePolarCustomerIdInternal, {
        clerkId,
        polarCustomerId,
      });
    }

    // 4. Create customer session portal URL
    const sessionResponse = await polar.customerSessions.create({
      customerId: polarCustomerId,
    });

    const portalUrl = sessionResponse.customerPortalUrl;

    if (!portalUrl) {
      throw new Error('No portal URL returned by Polar');
    }

    return { url: portalUrl };
  },
});
