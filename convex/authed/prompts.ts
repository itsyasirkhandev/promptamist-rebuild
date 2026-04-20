import { v } from 'convex/values';
import { authedMutation, authedQuery, getUserId } from './helpers';
import { Effect } from 'effect';
import { NotFound } from '../errors';
import { runEffect } from '../effect';

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
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        return yield* Effect.promise(() =>
          ctx.db.insert('prompts', {
            userId,
            ...args,
          }),
        );
      }),
    );
  },
});

export const getPrompts = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        return yield* Effect.promise(() =>
          ctx.db
            .query('prompts')
            .withIndex('by_userId', (q) => q.eq('userId', userId))
            .order('desc')
            .collect(),
        );
      }),
    );
  },
});

export const getPromptById = authedQuery({
  args: { id: v.id('prompts') },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        const prompt = yield* Effect.promise(() => ctx.db.get(args.id));
        if (!prompt || prompt.userId !== userId) {
          yield* new NotFound({ message: 'Prompt not found' });
        }
        return prompt!;
      }),
    );
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
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        const prompt = yield* Effect.promise(() => ctx.db.get(args.id));
        if (!prompt || prompt.userId !== userId) {
          yield* new NotFound({ message: 'Prompt not found' });
        }
        const { id, ...updates } = args;
        yield* Effect.promise(() => ctx.db.patch(id, updates));
      }),
    );
  },
});

export const deletePrompt = authedMutation({
  args: { id: v.id('prompts') },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        const prompt = yield* Effect.promise(() => ctx.db.get(args.id));
        if (!prompt || prompt.userId !== userId) {
          yield* new NotFound({ message: 'Prompt not found' });
        }
        yield* Effect.promise(() => ctx.db.delete(args.id));
      }),
    );
  },
});
