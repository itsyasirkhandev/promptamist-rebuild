import { v } from 'convex/values';
import { query } from './_generated/server';
import { toPublicPromptDTO } from './dto';

export const getPromptBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const prompt = await ctx.db
      .query('prompts')
      .withIndex('by_publicSlug', (q) => q.eq('publicSlug', args.slug))
      .unique();

    if (!prompt || !prompt.isPublic) {
      return null;
    }

    // DTO: strip userId and any internal fields before sending to unauthenticated clients
    return toPublicPromptDTO(prompt);
  },
});
