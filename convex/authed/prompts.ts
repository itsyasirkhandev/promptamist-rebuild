import { v } from 'convex/values';
import { authedMutation, authedQuery, getUserId } from './helpers';
import { Effect } from 'effect';
import { runEffect } from '../effect';
import {
  generateUniqueSlug,
  getPromptForUser,
  validatePromptArgs,
} from './promptHelpers';
import { promptArgsValidator } from '../validators';

export const createPrompt = authedMutation({
  args: promptArgsValidator,
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        yield* validatePromptArgs(args);

        const userId = yield* getUserId(ctx, ctx.identity.subject);

        let publicSlug: string | undefined = undefined;
        if (args.isPublic) {
          publicSlug = yield* generateUniqueSlug(ctx, args.title);
        }

        return yield* Effect.promise(() =>
          ctx.db.insert('prompts', {
            userId,
            ...args,
            publicSlug,
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
            .take(100),
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
        return yield* getPromptForUser(ctx, args.id);
      }),
    );
  },
});

export const updatePrompt = authedMutation({
  args: {
    id: v.id('prompts'),
    ...promptArgsValidator,
  },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        yield* validatePromptArgs(args);

        const prompt = yield* getPromptForUser(ctx, args.id);

        const { id, ...updates } = args;

        let publicSlug = prompt.publicSlug;
        if (updates.isPublic && !prompt.isPublic) {
          // Transitioned to public, generate a unique slug if it doesn't have one
          if (!publicSlug) {
            publicSlug = yield* generateUniqueSlug(ctx, updates.title);
          }
        }

        yield* Effect.promise(() =>
          ctx.db.patch(id, { ...updates, publicSlug }),
        );
      }),
    );
  },
});

export const deletePrompt = authedMutation({
  args: { id: v.id('prompts') },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const prompt = yield* getPromptForUser(ctx, args.id);
        yield* Effect.promise(() => ctx.db.delete(prompt._id));
      }),
    );
  },
});

export const getPromptStats = authedQuery({
  args: { oneWeekAgo: v.number() },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);

        const prompts = yield* Effect.promise(() =>
          ctx.db
            .query('prompts')
            .withIndex('by_userId', (q) => q.eq('userId', userId))
            .take(1000),
        );

        let total = 0;
        let templates = 0;
        let publicCount = 0;
        let newThisWeek = 0;
        let lastActivityAt: number | null = null;

        for (const prompt of prompts) {
          total++;
          if (prompt.isTemplate) templates++;
          if (prompt.isPublic) publicCount++;

          if (prompt._creationTime >= args.oneWeekAgo) {
            newThisWeek++;
          }

          if (!lastActivityAt || prompt._creationTime > lastActivityAt) {
            lastActivityAt = prompt._creationTime;
          }
        }

        return {
          total,
          templates,
          public: publicCount,
          newThisWeek,
          lastActivityAt,
        };
      }),
    );
  },
});
