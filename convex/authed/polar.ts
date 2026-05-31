import { authedAction } from './helpers';
import { v } from 'convex/values';
import { PolarBillingProvider } from '../billing/provider';
import { POLAR_CONFIG } from '../billing/config';

const billingProvider = new PolarBillingProvider();

export const generateCheckoutUrl = authedAction({
  args: {
    clientOrigin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clerkId = ctx.identity.subject;
    return await billingProvider.createCheckoutSession(ctx, clerkId, {
      productId: POLAR_CONFIG.productId,
      clientOrigin: args.clientOrigin,
    });
  },
});

export const generatePortalUrl = authedAction({
  args: {},
  handler: async (ctx) => {
    const clerkId = ctx.identity.subject;
    return await billingProvider.createPortalSession(ctx, clerkId);
  },
});
