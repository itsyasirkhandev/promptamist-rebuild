/**
 * promptOwnership.ts — Authorization and validation for prompt writes
 *
 * Answers the single question: "is this actor allowed to act on this prompt?"
 * All prompt write paths must go through these guards before touching the DAL.
 *
 * Exports:
 *   validatePromptArgs  — input validation (title/content length)
 *   getPromptForUser    — ownership check (fetches prompt, asserts caller owns it)
 */

import { Effect } from 'effect';
import { Id } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';
import { NotFound, ValidationError } from '../errors';
import { UserIdentity } from 'convex/server';
import { getUserId } from './helpers';
import { findPromptById } from '../dal/prompts.dal';

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
