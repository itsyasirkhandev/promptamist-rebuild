import { v } from 'convex/values';
import {
  authedMutation,
  authedQuery,
  getUserId,
  getUser,
  getRequiredUser,
} from './helpers';
import { Effect } from 'effect';
import { runEffect } from '../effect';
import { validatePromptArgs, getPromptForUser } from './promptOwnership';
import { generateUniqueSlug } from '../slugs';
import { promptArgsValidator } from '../validators';
import { toPromptDTO } from '../dto';
import { LimitExceeded } from '../errors';
import { FREE_TIER_PROMPT_LIMIT } from '../limits';
import {
  DEFAULT_TIER,
  type SubscriptionTier,
  canCreateUnlimitedPrompts,
} from '../subscription';
import {
  insertPrompt,
  listPromptsByUser,
  patchPrompt,
  deletePrompt as dalDeletePrompt,
} from '../dal/prompts.dal';
import { updateUserPromptStats } from './userStats';

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const createPrompt = authedMutation({
  args: promptArgsValidator,
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        yield* validatePromptArgs(args);

        const user = yield* getRequiredUser(ctx, ctx.identity.subject);

        const tier = (user.subscriptionTier ??
          DEFAULT_TIER) as SubscriptionTier;
        const totalPrompts = user.promptStats?.total ?? 0;

        if (
          !canCreateUnlimitedPrompts(tier) &&
          totalPrompts >= FREE_TIER_PROMPT_LIMIT
        ) {
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

        const searchableText = `${args.title} ${args.content} ${(args.tags || []).join(' ')}`;

        yield* Effect.promise(() =>
          insertPrompt(ctx, { userId, ...args, publicSlug, searchableText }),
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

        let searchableText = prompt.searchableText;
        if (
          updates.title !== undefined ||
          updates.content !== undefined ||
          updates.tags !== undefined
        ) {
          const newTitle = updates.title ?? prompt.title;
          const newContent = updates.content ?? prompt.content;
          const newTags = updates.tags ?? prompt.tags;
          searchableText = `${newTitle} ${newContent} ${(newTags || []).join(' ')}`;
        }

        yield* Effect.promise(() =>
          patchPrompt(ctx, id, { ...updates, publicSlug, searchableText }),
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

/**
 * Returns the N most recent prompts for the authenticated user.
 * Prefer this over getPrompts + client-side slice when only a preview is needed
 * (e.g. the home-page dashboard) — the limit is pushed down to the DAL query.
 */
export const getRecentPrompts = authedQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        const prompts = yield* Effect.promise(() =>
          listPromptsByUser(ctx, userId, args.limit ?? 3),
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
