/**
 * userStats.ts — Denormalized prompt-stat maintenance for the user document
 *
 * The `updateUserPromptStats` generator is the single authoritative place for
 * updating the `users.promptStats` counters. Any authed mutation that creates,
 * updates, or deletes a prompt must go through this function rather than
 * computing stat deltas inline.
 *
 * Behaviour:
 *   - Reads the current user doc via the DAL.
 *   - Resets the `newThisWeek` counter if the weekly window has rolled over.
 *   - Applies the provided deltas and writes back via the DAL.
 *   - Is a no-op when the user doc cannot be found.
 */

import { Effect } from 'effect';
import { Id } from '../_generated/dataModel';
import { MutationCtx } from '../_generated/server';
import { findUserById, patchUserPromptStats } from '../dal/users.dal';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Apply stat deltas to the authenticated user's denormalized prompt counters.
 *
 * Pass positive values when adding (create), negative when removing (delete),
 * and the signed diff when toggling a flag (update).
 */
export function* updateUserPromptStats(
  ctx: MutationCtx,
  userId: Id<'users'>,
  changes: { total?: number; templates?: number; public?: number },
) {
  const user = yield* Effect.promise(() => findUserById(ctx, userId));
  if (!user) return;

  const now = Date.now();

  const currentStats = user.promptStats ?? {
    total: 0,
    templates: 0,
    public: 0,
    newThisWeek: 0,
    lastActivityAt: now,
  };

  // Reset weekly counter if the window has rolled over
  const lastActivityAt = currentStats.lastActivityAt ?? now;
  const isNewWeek = now - lastActivityAt > ONE_WEEK_MS;
  const currentNewThisWeek = isNewWeek ? 0 : (currentStats.newThisWeek ?? 0);

  const totalDelta = changes.total ?? 0;

  const nextStats = {
    total: currentStats.total + (changes.total ?? 0),
    templates: currentStats.templates + (changes.templates ?? 0),
    public: currentStats.public + (changes.public ?? 0),
    // Only increment weekly counter on new prompts (positive total delta)
    newThisWeek: currentNewThisWeek + (totalDelta > 0 ? totalDelta : 0),
    lastActivityAt: now,
  };

  yield* Effect.promise(() => patchUserPromptStats(ctx, userId, nextStats));
}
