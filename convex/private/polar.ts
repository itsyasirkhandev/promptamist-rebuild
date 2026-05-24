"use node";

import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import { internal } from '../_generated/api';
import { Polar } from '@polar-sh/sdk';

export const createPolarCustomerBackground = internalAction({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Fetch user info
    const userInfo = await ctx.runQuery(internal.private.users.getUserInfoForPolar, {
      clerkId: args.clerkId,
    });

    if (!userInfo) {
      console.warn(
        `Aborting Polar customer creation: Convex user not found for ${args.clerkId}`
      );
      return;
    }

    if (userInfo.polarCustomerId) {
      console.log(
        `User ${args.clerkId} already has Polar customer ID: ${userInfo.polarCustomerId}`
      );
      return;
    }

    // 2. Initialize Polar SDK
    const polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: (process.env.POLAR_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    });


    try {
      // 3. Create native customer
      const customer = await polar.customers.create({
        email: args.email,
        name: args.name || undefined,
        metadata: {
          clerkId: args.clerkId,
          convexUserId: String(userInfo.userId),
        },
      });

      // 4. Save ID back to Convex
      await ctx.runMutation(internal.users.savePolarCustomerIdInternal, {
        clerkId: args.clerkId,
        polarCustomerId: customer.id,
      });

      console.log(
        `Successfully synced Polar customer ${customer.id} for user ${args.clerkId}`
      );
    } catch (error) {
      console.error(
        `Failed to create background Polar customer for ${args.clerkId}:`,
        error
      );
    }
  },
});
