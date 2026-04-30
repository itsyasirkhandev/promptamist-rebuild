import {
  customAction,
  customMutation,
  customQuery,
} from 'convex-helpers/server/customFunctions';
import {
  action,
  mutation,
  query,
  QueryCtx,
  MutationCtx,
  ActionCtx,
} from '../_generated/server';
import { ConvexError } from 'convex/values';
import { Unauthorized, NotFound } from '../errors';
import { Effect, Schema } from 'effect';

export const getUserId = (ctx: QueryCtx | MutationCtx, clerkId: string) =>
  Effect.gen(function* () {
    const user = yield* Effect.promise(() =>
      ctx.db
        .query('users')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
        .unique(),
    );
    if (!user) {
      yield* new NotFound({ message: 'User not found' });
    }
    return user!._id;
  });

async function validateIdentity(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new ConvexError(
      Schema.encodeSync(Unauthorized)(
        new Unauthorized({
          message: 'Unauthorized',
        }),
      ),
    );
  }
  return identity;
}

export const authedQuery = customQuery(query, {
  args: {},
  input: async (ctx) => {
    const identity = await validateIdentity(ctx);
    return { ctx: { ...ctx, identity }, args: {} };
  },
});

export const authedMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const identity = await validateIdentity(ctx);
    return { ctx: { ...ctx, identity }, args: {} };
  },
});

export const authedAction = customAction(action, {
  args: {},
  input: async (ctx) => {
    const identity = await validateIdentity(ctx);
    return { ctx: { ...ctx, identity }, args: {} };
  },
});
