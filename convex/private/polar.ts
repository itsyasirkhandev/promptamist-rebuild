'use node';

import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import { PolarBillingProvider } from '../billing/provider';

export const createPolarCustomerBackground = internalAction({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const billingProvider = new PolarBillingProvider();
    try {
      await billingProvider.ensureCustomer(
        ctx,
        args.clerkId,
        args.email,
        args.name ?? undefined,
      );
      console.log(
        `Successfully synced Polar customer in background for user ${args.clerkId}`,
      );
    } catch (error) {
      console.error(
        `Failed to create background Polar customer for ${args.clerkId}:`,
        error,
      );
    }
  },
});
