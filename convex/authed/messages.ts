import { authedQuery } from './helpers'

export const getForCurrentUser = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('author'), ctx.identity.email))
      .collect()
  },
})
