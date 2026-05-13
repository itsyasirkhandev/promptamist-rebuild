import { v } from 'convex/values';
import { query } from './_generated/server';
import { toPublicPromptDTO } from './dto';
import { findPromptBySlug } from './dal/prompts.dal';

export const getPromptBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const prompt = await findPromptBySlug(ctx, args.slug);

    if (!prompt || !prompt.isPublic) {
      return null;
    }

    // DTO: strip userId and any internal fields before sending to unauthenticated clients
    return toPublicPromptDTO(prompt);
  },
});
