import { v } from 'convex/values';
import { internalQuery } from '../_generated/server';
import { findUserByClerkId } from '../dal/users.dal';

export const getUserEmailAndTier = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await findUserByClerkId(ctx, args.clerkId);
    if (!user) {
      return null;
    }
    return {
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    };
  },
});
