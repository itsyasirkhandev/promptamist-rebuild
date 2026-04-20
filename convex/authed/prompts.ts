import { v } from 'convex/values';
import { authedMutation, authedQuery } from './helpers';
import { QueryCtx, MutationCtx } from '../_generated/server';

const getUserId = async (ctx: QueryCtx | MutationCtx, clerkId: string) => {
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
    .first();
  if (!user) {
    throw new Error('User not found');
  }
  return user._id;
};

export const createPrompt = authedMutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    isTemplate: v.boolean(),
    variables: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        type: v.union(
          v.literal('text'),
          v.literal('number'),
          v.literal('textarea'),
          v.literal('choices'),
          v.literal('list'),
        ),
        options: v.optional(v.array(v.string())),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx, ctx.identity.subject);
    return await ctx.db.insert('prompts', {
      userId,
      ...args,
    });
  },
});

export const getPrompts = authedQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx, ctx.identity.subject);
    return await ctx.db
      .query('prompts')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

export const getPromptById = authedQuery({
  args: { id: v.id('prompts') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx, ctx.identity.subject);
    const prompt = await ctx.db.get(args.id);
    if (!prompt || prompt.userId !== userId) {
      throw new Error('Prompt not found');
    }
    return prompt;
  },
});

export const updatePrompt = authedMutation({
  args: {
    id: v.id('prompts'),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    isTemplate: v.boolean(),
    variables: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        type: v.union(
          v.literal('text'),
          v.literal('number'),
          v.literal('textarea'),
          v.literal('choices'),
          v.literal('list'),
        ),
        options: v.optional(v.array(v.string())),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx, ctx.identity.subject);
    const prompt = await ctx.db.get(args.id);
    if (!prompt || prompt.userId !== userId) {
      throw new Error('Prompt not found');
    }
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deletePrompt = authedMutation({
  args: { id: v.id('prompts') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx, ctx.identity.subject);
    const prompt = await ctx.db.get(args.id);
    if (!prompt || prompt.userId !== userId) {
      throw new Error('Prompt not found');
    }
    await ctx.db.delete(args.id);
  },
});
