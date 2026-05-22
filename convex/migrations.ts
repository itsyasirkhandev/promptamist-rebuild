import { mutation } from './_generated/server';

export const backfillSearchableText = mutation({
  args: {},
  handler: async (ctx) => {
    const prompts = await ctx.db.query('prompts').collect();
    let updated = 0;
    for (const prompt of prompts) {
      if (!prompt.searchableText) {
        const title = prompt.title || '';
        const content = prompt.content || '';
        const tags = (prompt.tags || []).join(' ');
        const searchableText = `${title} ${content} ${tags}`;
        await ctx.db.patch(prompt._id, { searchableText });
        updated++;
      }
    }
    return `Updated ${updated} prompts with searchableText.`;
  },
});
