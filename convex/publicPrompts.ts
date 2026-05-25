import { v } from 'convex/values';
import { query } from './_generated/server';
import { toPublicPromptDTO } from './dto';
import {
  findPublicPromptWithAuthor,
  listPublicPromptsWithAuthors,
} from './dal/prompts.dal';
import { runEffect } from './effect';
import { Effect } from 'effect';

export const getPromptBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const result = yield* Effect.promise(() =>
          findPublicPromptWithAuthor(ctx, args.slug),
        );

        if (!result) {
          return null;
        }

        // DTO: strip userId and any internal fields before sending to unauthenticated clients
        return toPublicPromptDTO(result.prompt, result.author);
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
    const results = await listPublicPromptsWithAuthors(ctx, {
      searchQuery: args.searchQuery,
      category: args.category,
    });

    return results.map(({ prompt, author }) =>
      toPublicPromptDTO(prompt, author),
    );
  },
});
