import { v } from 'convex/values';
import { authedQuery, getUser } from './authed/helpers';
import { internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import { Effect } from 'effect';
import { runEffect } from './effect';

export const getCurrentUser = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        return yield* getUser(ctx, ctx.identity.subject);
      }),
    );
  },
});

export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (existingUser) {
      const id = existingUser._id;
      if (
        existingUser.email !== args.email ||
        existingUser.name !== args.name ||
        existingUser.imageUrl !== args.imageUrl
      ) {
        await ctx.db.patch(id, {
          email: args.email,
          name: args.name,
          imageUrl: args.imageUrl,
          updatedAt: Date.now(),
        });
      }
      return id;
    }

    const id = await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (!user) {
      console.warn(`User not found for clerkId: ${args.clerkId}`);
      return;
    }

    await ctx.db.patch(user._id, {
      subscriptionTier: args.tier,
      updatedAt: Date.now(),
    });
  },
});
