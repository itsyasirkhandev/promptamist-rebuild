import { v } from 'convex/values';
import { authedQuery, getUser } from './authed/helpers';
import { internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import { Effect } from 'effect';
import { runEffect } from './effect';
import { toUserDTO } from './dto';
import {
  findUserByClerkId,
  insertUser,
  patchUserProfile,
  patchUserSubscription,
} from './dal/users.dal';

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const getCurrentUser = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const user = yield* getUser(ctx, ctx.identity.subject);
        if (!user) return null;
        // DTO: strip internal/sensitive fields before sending to client
        return toUserDTO(user);
      }),
    );
  },
});

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

    return id;
  },
});

export const updateSubscriptionTier = internalMutation({
  args: {
    clerkId: v.string(),
    tier: v.string(),
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
