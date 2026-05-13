import { Effect } from 'effect';
import { Id } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';
import { NotFound, ValidationError } from '../errors';
import { UserIdentity } from 'convex/server';
import { getUserId } from './helpers';
import { findPromptById, isSlugTaken } from '../dal/prompts.dal';
import {
  findUserById as findUser,
  patchUserPromptStats,
} from '../dal/users.dal';

export type AuthedQueryCtx = QueryCtx & { identity: UserIdentity };
export type AuthedMutationCtx = MutationCtx & { identity: UserIdentity };

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function* validatePromptArgs(args: { title: string; content: string }) {
  if (args.title.length > 300) {
    yield* new ValidationError({
      message: 'Title must be less than 300 characters',
    });
  }
  if (args.content.length > 50000) {
    yield* new ValidationError({
      message: 'Content must be less than 50000 characters',
    });
  }
}

// ---------------------------------------------------------------------------
// Authorization
// ---------------------------------------------------------------------------

/** Fetch a prompt only if it belongs to the authenticated user. */
export function* getPromptForUser(
  ctx: AuthedQueryCtx | AuthedMutationCtx,
  id: Id<'prompts'>,
) {
  const userId = yield* getUserId(ctx, ctx.identity.subject);
  const prompt = yield* Effect.promise(() => findPromptById(ctx, id));
  if (!prompt || prompt.userId !== userId) {
    yield* new NotFound({ message: 'Prompt not found' });
  }
  return prompt!;
}

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------

/** Generate a unique public slug for a prompt title (max 5 attempts + fallback). */
export function* generateUniqueSlug(ctx: MutationCtx, title: string) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let attempts = 0;
  while (attempts < 5) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const candidate = `${baseSlug}-${randomSuffix}`;
    const taken = yield* Effect.promise(() => isSlugTaken(ctx, candidate));
    if (!taken) {
      return candidate;
    }
    attempts++;
  }

  return `${baseSlug}-${Date.now().toString(36)}`;
}

// ---------------------------------------------------------------------------
// Denormalized stats
// ---------------------------------------------------------------------------

/** Atomically increment/decrement the denormalized prompt stats on a user. */
export function* updateUserPromptStats(
  ctx: MutationCtx,
  userId: Id<'users'>,
  changes: { total?: number; templates?: number; public?: number },
) {
  const user = yield* Effect.promise(() => findUser(ctx, userId));
  if (!user) return;

  const currentStats = user.promptStats ?? {
    total: 0,
    templates: 0,
    public: 0,
  };
  const nextStats = {
    total: currentStats.total + (changes.total ?? 0),
    templates: currentStats.templates + (changes.templates ?? 0),
    public: currentStats.public + (changes.public ?? 0),
  };

  yield* Effect.promise(() => patchUserPromptStats(ctx, userId, nextStats));
}
