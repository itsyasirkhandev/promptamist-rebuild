import { v } from 'convex/values';
import { internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import {
  findUserByClerkId,
  insertUser,
  patchUserProfile,
  patchUserSubscription,
  patchUserPolarCustomerId,
} from './dal/users.dal';
import { subscriptionTierValidator } from './subscription';


// ---------------------------------------------------------------------------
// Internal Mutations (called from Clerk webhook / Polar webhook)
// ---------------------------------------------------------------------------

export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await findUserByClerkId(ctx, args.clerkId);

    if (existingUser) {
      const hasProfileChanged =
        existingUser.email !== args.email ||
        existingUser.name !== args.name ||
        existingUser.imageUrl !== args.imageUrl;

      if (hasProfileChanged) {
        await patchUserProfile(ctx, existingUser._id, {
          email: args.email,
          name: args.name,
          imageUrl: args.imageUrl,
        });
      }
      return existingUser._id;
    }

    const id = await insertUser(ctx, {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
      email: args.email,
      name: args.name,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.private.polar.createPolarCustomerBackground,
      {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
      },
    );

    return id;

  },
});

export const updateSubscriptionTier = internalMutation({
  args: {
    clerkId: v.string(),
    tier: subscriptionTierValidator,
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await findUserByClerkId(ctx, args.clerkId);

    if (!user) {
      console.warn(`User not found for clerkId: ${args.clerkId}`);
      return;
    }

    await patchUserSubscription(ctx, user._id, {
      subscriptionTier: args.tier,
      polarCustomerId: args.polarCustomerId,
      polarSubscriptionId: args.polarSubscriptionId,
    });
  },
});

export const savePolarCustomerIdInternal = internalMutation({
  args: { clerkId: v.string(), polarCustomerId: v.string() },
  handler: async (ctx, args) => {
    const user = await findUserByClerkId(ctx, args.clerkId);
    if (!user) {
      console.warn(`User not found to save Polar customer ID: ${args.clerkId}`);
      return;
    }
    await patchUserPolarCustomerId(ctx, user._id, args.polarCustomerId);
  },
});

