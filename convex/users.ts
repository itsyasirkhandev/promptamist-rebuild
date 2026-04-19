import { v } from 'convex/values';
import { authedQuery } from './authed/helpers';
import { internalMutation } from './_generated/server';

export const getCurrentUser = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', ctx.identity.subject))
      .first();
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
      .first();

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

    return await ctx.db.insert('users', {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
