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

        // DTO: strip userId and any internal fields before sending to unauthenticated clients
        return toPublicPromptDTO(prompt);
      }),
    );
  },
});
