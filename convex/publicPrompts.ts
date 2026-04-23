import { v } from 'convex/values';
import { query } from './_generated/server';

export const getPromptBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const prompt = await ctx.db
      .query('prompts')
      .withIndex('by_publicSlug', (q) => q.eq('publicSlug', args.slug))
      .first();

    if (!prompt) {
      return null;
    }

    if (!prompt.isPublic) {
      return null;
    }

    // It shouldn't contain sensitive user details other than what's in the prompt.
    return {
      _creationTime: prompt._creationTime,
      title: prompt.title,
      content: prompt.content,
      tags: prompt.tags,
      isTemplate: prompt.isTemplate,
      variables: prompt.variables,
      isPublic: prompt.isPublic,
      publicSlug: prompt.publicSlug,
    };
  },
});
