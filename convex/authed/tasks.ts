import { authedQuery } from './helpers';

export const get = authedQuery({
  args: {},
  handler: async (ctx) => {
    // You now have access to ctx.identity if needed
    return await ctx.db.query('tasks').collect();
  },
});
