import { v } from 'convex/values';
import { authedMutation, authedQuery, getUserId, getUser } from './helpers';
import { Effect } from 'effect';
import { runEffect } from '../effect';
import { validatePromptArgs, getPromptForUser } from './promptOwnership';
import { generateUniqueSlug } from '../slugs';
import { promptArgsValidator } from '../validators';
import { toPromptDTO } from '../dto';
import { LimitExceeded } from '../errors';
import {
  insertPrompt,
  listPromptsByUser,
  patchPrompt,
  deletePrompt as dalDeletePrompt,
} from '../dal/prompts.dal';
import {
  findUserById as findUser,
  patchUserPromptStats,
} from '../dal/users.dal';

/** Free-tier limit for the total number of prompts a user can create. */
const FREE_TIER_PROMPT_LIMIT = 50;

// ---------------------------------------------------------------------------
// Shared: update denormalized stats on the user doc
// ---------------------------------------------------------------------------

function* updateUserPromptStats(
  ctx: Parameters<typeof patchUserPromptStats>[0],
  userId: Parameters<typeof patchUserPromptStats>[1],
  changes: { total?: number; templates?: number; public?: number },
) {
  const user = yield* Effect.promise(() => findUser(ctx, userId));
  if (!user) return;

  const now = Date.now();
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  const currentStats = user.promptStats ?? {
    total: 0,
    templates: 0,
    public: 0,
    newThisWeek: 0,
    lastActivityAt: now,
  };

  // Reset weekly counter if the window has rolled over
  const lastActivityAt = currentStats.lastActivityAt ?? now;
  const isNewWeek = now - lastActivityAt > ONE_WEEK_MS;
  const currentNewThisWeek = isNewWeek ? 0 : (currentStats.newThisWeek ?? 0);

  const totalDelta = changes.total ?? 0;

  const nextStats = {
    total: currentStats.total + (changes.total ?? 0),
    templates: currentStats.templates + (changes.templates ?? 0),
    public: currentStats.public + (changes.public ?? 0),
    // Only increment weekly counter on new prompts (positive total delta)
    newThisWeek: currentNewThisWeek + (totalDelta > 0 ? totalDelta : 0),
    lastActivityAt: now,
  };

  yield* Effect.promise(() => patchUserPromptStats(ctx, userId, nextStats));
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const createPrompt = authedMutation({
  args: promptArgsValidator,
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        yield* validatePromptArgs(args);

        const user = yield* getUser(ctx, ctx.identity.subject);
        if (!user) {
          return yield* Effect.fail(new Error('User not found'));
        }

        const isPro = user.subscriptionTier === 'pro';
        const totalPrompts = user.promptStats?.total ?? 0;

        if (!isPro && totalPrompts >= FREE_TIER_PROMPT_LIMIT) {
          yield* new LimitExceeded({
            message:
              'Prompt limit reached. Upgrade to Pro to create unlimited prompts.',
            limit: FREE_TIER_PROMPT_LIMIT,
          });
        }

        const userId = user._id;

        let publicSlug: string | undefined = undefined;
        if (args.isPublic) {
          publicSlug = yield* generateUniqueSlug(ctx, args.title);
        }

        yield* Effect.promise(() =>
          insertPrompt(ctx, { userId, ...args, publicSlug }),
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
          // Transitioned to public — generate a unique slug if it doesn't have one
          if (!publicSlug) {
            publicSlug = yield* generateUniqueSlug(ctx, updates.title);
          }
        }

        yield* Effect.promise(() => patchPrompt(ctx, id, { ...updates, publicSlug }));

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
        yield* Effect.promise(() => dalDeletePrompt(ctx, prompt._id));
        yield* updateUserPromptStats(ctx, prompt.userId, {
          total: -1,
          templates: prompt.isTemplate ? -1 : 0,
          public: prompt.isPublic ? -1 : 0,
        });
      }),
    );
  },
});

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const getPrompts = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        const prompts = yield* Effect.promise(() =>
          listPromptsByUser(ctx, userId),
        );
        // DTO: strip userId and conditionally hide publicSlug
        return prompts.map(toPromptDTO);
      }),
    );
  },
});

export const getPromptById = authedQuery({
  args: { id: v.id('prompts') },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const prompt = yield* getPromptForUser(ctx, args.id);
        // DTO: strip userId and conditionally hide publicSlug
        return toPromptDTO(prompt);
      }),
    );
  },
});

/**
 * Returns the denormalized prompt stats from the user doc — a single read,
 * no extra queries. The weekly counter is maintained on writes in updateUserPromptStats.
 */
export const getPromptStats = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const user = yield* getUser(ctx, ctx.identity.subject);

        if (!user) {
          return {
            total: 0,
            templates: 0,
            public: 0,
            newThisWeek: 0,
            lastActivityAt: null,
          };
        }

        const stats = user.promptStats ?? {
          total: 0,
          templates: 0,
          public: 0,
          newThisWeek: 0,
          lastActivityAt: null,
        };

        return {
          total: stats.total,
          templates: stats.templates,
          public: stats.public,
          newThisWeek: stats.newThisWeek ?? 0,
          lastActivityAt: stats.lastActivityAt ?? null,
        };
      }),
    );
  },
});
