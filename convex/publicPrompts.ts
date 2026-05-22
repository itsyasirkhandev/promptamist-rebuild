import { v } from 'convex/values';
import { query } from './_generated/server';
import { toPublicPromptDTO } from './dto';
import { findPromptBySlug } from './dal/prompts.dal';
import { runEffect } from './effect';
import { Effect } from 'effect';

export const getPromptBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const prompt = yield* Effect.promise(() =>
          findPromptBySlug(ctx, args.slug),
        );

        if (!prompt || !prompt.isPublic) {
          return null;
        }

        const author = yield* Effect.promise(() => ctx.db.get(prompt.userId));

        // DTO: strip userId and any internal fields before sending to unauthenticated clients
        return toPublicPromptDTO(prompt, author);
      }),
    );
  },
});

export const listPublicPrompts = query({
  args: {
    searchQuery: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let prompts;
    if (args.searchQuery) {
      prompts = await ctx.db
        .query('prompts')
        .withSearchIndex('search_all', (q) =>
          q
            .search('searchableText', args.searchQuery as string)
            .eq('isPublic', true),
        )
        .take(50);

      if (args.category && args.category !== 'all') {
        prompts = prompts.filter(
          (p) => (p.category ?? 'general') === args.category,
        );
      }
    } else {
      const rawPrompts = await ctx.db
        .query('prompts')
        .withIndex('by_isPublic', (q) => q.eq('isPublic', true))
        .order('desc')
        .take(100);

      if (args.category && args.category !== 'all') {
        prompts = rawPrompts
          .filter((p) => (p.category ?? 'general') === args.category)
          .slice(0, 50);
      } else {
        prompts = rawPrompts.slice(0, 50);
      }
    }

    const promptsWithAuthors = await Promise.all(
      prompts.map(async (p) => {
        const author = await ctx.db.get(p.userId);
        return toPublicPromptDTO(p, author);
      }),
    );

    return promptsWithAuthors;
  },
});
