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
  args: { searchQuery: v.optional(v.string()) },
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
    } else {
      prompts = await ctx.db
        .query('prompts')
        .filter((q) => q.eq(q.field('isPublic'), true))
        .order('desc')
        .take(50);
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
