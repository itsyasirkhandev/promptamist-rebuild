import { v } from 'convex/values';
import { authedMutation, authedQuery, getUserId } from './helpers';
import { Effect } from 'effect';
import { runEffect } from '../effect';
import {
  generateUniqueSlug,
  getPromptForUser,
  updateUserPromptStats,
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

        yield* Effect.promise(() =>
          ctx.db.insert('prompts', {
            userId,
            ...args,
            publicSlug,
          }),
        );
        yield* updateUserPromptStats(ctx, userId, {
          total: 1,
          templates: args.isTemplate ? 1 : 0,
          public: args.isPublic ? 1 : 0,
        });
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

        const templateChange =
          (updates.isTemplate ? 1 : 0) - (prompt.isTemplate ? 1 : 0);
        const publicChange =
          (updates.isPublic ? 1 : 0) - (prompt.isPublic ? 1 : 0);

        if (templateChange !== 0 || publicChange !== 0) {
          yield* updateUserPromptStats(ctx, prompt.userId, {
            templates: templateChange,
            public: publicChange,
          });
        }
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
        yield* updateUserPromptStats(ctx, prompt.userId, {
          total: -1,
          templates: prompt.isTemplate ? -1 : 0,
          public: prompt.isPublic ? -1 : 0,
        });
      }),
    );
  },
});

export const getPromptStats = authedQuery({
  args: { oneWeekAgo: v.number() },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const user = yield* Effect.promise(() =>
          ctx.db
            .query('users')
            .withIndex('by_clerkId', (q) =>
              q.eq('clerkId', ctx.identity.subject),
            )
            .unique(),
        );

        if (!user) {
          return {
            total: 0,
            templates: 0,
            public: 0,
            newThisWeek: 0,
            lastActivityAt: null,
          };
        }

        const stats = user.promptStats ?? { total: 0, templates: 0, public: 0 };

        // Efficiently find only prompts from last week
        const recentPrompts = yield* Effect.promise(
          () =>
            ctx.db
              .query('prompts')
              .withIndex('by_userId', (q) =>
                q.eq('userId', user._id).gte('_creationTime', args.oneWeekAgo),
              )
              .take(100), // Safety cap
        );

        const lastPrompt = yield* Effect.promise(() =>
          ctx.db
            .query('prompts')
            .withIndex('by_userId', (q) => q.eq('userId', user._id))
            .order('desc')
            .first(),
        );

        return {
          total: stats.total,
          templates: stats.templates,
          public: stats.public,
          newThisWeek: recentPrompts.length,
          lastActivityAt: lastPrompt?._creationTime ?? null,
        };
      }),
    );
  },
});
