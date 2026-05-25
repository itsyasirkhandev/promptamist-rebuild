'use node';

import { ActionCtx } from '../_generated/server';
import { internal } from '../_generated/api';
import { Polar } from '@polar-sh/sdk';

export interface BillingProvider {
  ensureCustomer(
    ctx: ActionCtx,
    clerkId: string,
    email: string,
    name?: string,
  ): Promise<string>;

  createCheckoutSession(
    ctx: ActionCtx,
    clerkId: string,
    options: {
      productId: string;
      clientOrigin?: string;
    },
  ): Promise<{ url: string }>;

  createPortalSession(
    ctx: ActionCtx,
    clerkId: string,
  ): Promise<{ url: string }>;
}

export class PolarBillingProvider implements BillingProvider {
  private getPolarClient() {
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
  }

  async ensureCustomer(
    ctx: ActionCtx,
    clerkId: string,
    email: string,
    name?: string,
  ): Promise<string> {
    // 1. Fetch user info from Convex
    const userInfo = await ctx.runQuery(
      internal.private.users.getUserInfoForPolar,
      {
        clerkId,
      },
    );

    if (!userInfo) {
      throw new Error(`User not found: ${clerkId}`);
    }

    if (userInfo.polarCustomerId) {
      return userInfo.polarCustomerId;
    }

    // 2. Initialize Polar client and create customer
    const polar = this.getPolarClient();
    console.log(`Creating Polar customer for user ${clerkId}`);

    const customer = await polar.customers.create({
      email: userInfo.email || email,
      name: userInfo.name || name || undefined,
      externalId: clerkId,
      metadata: {
        clerkId,
        convexUserId: String(userInfo.userId),
      },
    });

    const polarCustomerId = customer.id;

    // 3. Save ID back to Convex
    await ctx.runMutation(internal.users.savePolarCustomerIdInternal, {
      clerkId,
      polarCustomerId,
    });

    return polarCustomerId;
  }

  async createCheckoutSession(
    ctx: ActionCtx,
    clerkId: string,
    options: {
      productId: string;
      clientOrigin?: string;
    },
  ): Promise<{ url: string }> {
    // 1. Ensure user has a customer ID
    const userInfo = await ctx.runQuery(
      internal.private.users.getUserInfoForPolar,
      {
        clerkId,
      },
    );

    if (!userInfo) {
      throw new Error(`User not found: ${clerkId}`);
    }

    const polarCustomerId = await this.ensureCustomer(
      ctx,
      clerkId,
      userInfo.email,
      userInfo.name || undefined,
    );

    // 2. Determine application origin URL
    const appUrl =
      options.clientOrigin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';

    // 3. Create checkout session
    const polar = this.getPolarClient();
    const checkout = await polar.checkouts.create({
      products: [options.productId],
      customerId: polarCustomerId,
      successUrl: `${appUrl}/?success=true`,
    });

    if (!checkout.url) {
      throw new Error('No checkout URL returned by Polar');
    }

    return { url: checkout.url };
  }

  async createPortalSession(
    ctx: ActionCtx,
    clerkId: string,
  ): Promise<{ url: string }> {
    // 1. Ensure user has a customer ID
    const userInfo = await ctx.runQuery(
      internal.private.users.getUserInfoForPolar,
      {
        clerkId,
      },
    );

    if (!userInfo) {
      throw new Error(`User not found: ${clerkId}`);
    }

    const polarCustomerId = await this.ensureCustomer(
      ctx,
      clerkId,
      userInfo.email,
      userInfo.name || undefined,
    );

    // 2. Create customer session portal URL
    const polar = this.getPolarClient();
    const sessionResponse = await polar.customerSessions.create({
      customerId: polarCustomerId,
    });

    const portalUrl = sessionResponse.customerPortalUrl;

    if (!portalUrl) {
      throw new Error('No portal URL returned by Polar');
    }

    return { url: portalUrl };
  }
}
