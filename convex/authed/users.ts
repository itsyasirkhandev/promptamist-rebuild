import { authedQuery, authedMutation, getUser, getUserId } from './helpers';
import { runEffect } from '../effect';
import { Effect } from 'effect';
import { toUserDTO } from '../dto';
import { v } from 'convex/values';
import { patchUserPolarCustomerId } from '../dal/users.dal';

export const getCurrentUser = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const user = yield* getUser(ctx, ctx.identity.subject);
        if (!user) return null;
        // DTO: strip internal/sensitive fields before sending to client
        return toUserDTO(user);
      }),
    );
  },
});

export const getPolarCustomerId = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const user = yield* getUser(ctx, ctx.identity.subject);
        if (!user) return null;
        return user.polarCustomerId ?? null;
      }),
    );
  },
});

export const savePolarCustomerIdClient = authedMutation({
  args: { polarCustomerId: v.string() },
  handler: async (ctx, args) => {
    return await runEffect(
      Effect.gen(function* () {
        const userId = yield* getUserId(ctx, ctx.identity.subject);
        yield* Effect.promise(() =>
          patchUserPolarCustomerId(ctx, userId, args.polarCustomerId),
        );
      }),
    );
  },
});
