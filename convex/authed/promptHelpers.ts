import { Effect } from 'effect';
import { Id } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';
import { NotFound, ValidationError } from '../errors';
import { UserIdentity } from 'convex/server';
import { Doc } from '../_generated/dataModel';

export type AuthedQueryCtx = QueryCtx & { identity: UserIdentity };
export type AuthedMutationCtx = MutationCtx & { identity: UserIdentity };

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

import { getUserId } from './helpers';

export function* getPromptForUser(
  ctx: AuthedQueryCtx | AuthedMutationCtx,
  id: Id<'prompts'>,
) {
  const userId = yield* getUserId(ctx, ctx.identity.subject);
  const prompt = yield* Effect.promise(() => ctx.db.get(id));
  if (!prompt || prompt.userId !== userId) {
    yield* new NotFound({ message: 'Prompt not found' });
  }
  return prompt!;
}

export function* generateUniqueSlug(ctx: MutationCtx, title: string) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let attempts = 0;
  while (attempts < 5) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const candidate = `${baseSlug}-${randomSuffix}`;
    const existing = yield* Effect.promise(() =>
      ctx.db
        .query('prompts')
        .withIndex('by_publicSlug', (q) => q.eq('publicSlug', candidate))
        .unique(),
    );
    if (!existing) {
      return candidate;
    }
    attempts++;
  }

  return `${baseSlug}-${Date.now().toString(36)}`;
}

export function* updateUserPromptStats(
  ctx: MutationCtx,
  userId: Id<'users'>,
  changes: { total?: number; templates?: number; public?: number },
) {
  const user = yield* Effect.promise(() => ctx.db.get(userId));
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

  yield* Effect.promise(() =>
    ctx.db.patch(userId, {
      promptStats: nextStats,
    }),
  );
}
