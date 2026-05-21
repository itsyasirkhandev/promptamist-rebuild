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
import { Unauthorized, NotFound } from '../errors';
import { Effect } from 'effect';
import { findUserByClerkId } from '../dal/users.dal';
import { runEffect } from '../effect';

export const getUser = (ctx: QueryCtx | MutationCtx, clerkId: string) =>
  Effect.gen(function* () {
    return yield* Effect.promise(() => findUserByClerkId(ctx, clerkId));
  });

export const getUserId = (ctx: QueryCtx | MutationCtx, clerkId: string) =>
  Effect.gen(function* () {
    const user = yield* getUser(ctx, clerkId);
    if (!user) {
      yield* new NotFound({ message: 'User not found' });
    }
    return user!._id;
  });

const validateIdentity = (ctx: QueryCtx | MutationCtx | ActionCtx) =>
  Effect.gen(function* () {
    const identity = yield* Effect.promise(() => ctx.auth.getUserIdentity());
    if (identity === null) {
      yield* new Unauthorized({ message: 'Unauthorized' });
    }
    // Non-null assertion: Effect type system doesn't narrow after yield* of a
    // TaggedError, but we know identity is non-null at this point.
    return identity!;
  });

export const authedQuery = customQuery(query, {
  args: {},
  input: async (ctx) => {
    const identity = await runEffect(validateIdentity(ctx));
    return { ctx: { ...ctx, identity }, args: {} };
  },
});

export const authedMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const identity = await runEffect(validateIdentity(ctx));
    return { ctx: { ...ctx, identity }, args: {} };
  },
});

export const authedAction = customAction(action, {
  args: {},
  input: async (ctx) => {
    const identity = await runEffect(validateIdentity(ctx));
    return { ctx: { ...ctx, identity }, args: {} };
  },
});

/**
 * Returns the user document for the given Clerk ID or fails with NotFound.
 * Use this in handlers that require an existing user record.
 */
export const getRequiredUser = (ctx: QueryCtx | MutationCtx, clerkId: string) =>
  Effect.gen(function* () {
    const user = yield* Effect.promise(() => findUserByClerkId(ctx, clerkId));
    if (!user) {
      yield* new NotFound({ message: 'User not found' });
    }
    // Non-null assertion: Effect type system doesn't narrow after yield* of a
    // TaggedError, but we know user is non-null at this point.
    return user!;
  });
