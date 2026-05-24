/**
 * users.dal.ts — Data Access Layer for the `users` table
 *
 * All raw `ctx.db` operations on the users table must go through here.
 * Business logic (queries/mutations) must NEVER call ctx.db for users directly.
 *
 * Naming convention:
 *   find*   → read operations (return Doc | null)
 *   insert* → create operations
 *   patch*  → partial update operations
 */

import { MutationCtx, QueryCtx } from '../_generated/server';
import { Id } from '../_generated/dataModel';
import { type SubscriptionTier, DEFAULT_TIER } from '../subscription';

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

/** Find a user by their Clerk ID. Returns null if not found. */
export async function findUserByClerkId(
  ctx: QueryCtx | MutationCtx,
  clerkId: string,
) {
  return ctx.db
    .query('users')
    .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
    .unique();
}

/** Find a user by their Convex document ID. Returns null if not found. */
export async function findUserById(
  ctx: QueryCtx | MutationCtx,
  userId: Id<'users'>,
) {
  return ctx.db.get(userId);
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

/** Insert a new user document and return its ID. */
export async function insertUser(
  ctx: MutationCtx,
  data: {
    clerkId: string;
    email: string;
    name?: string;
    imageUrl?: string;
  },
) {
  return ctx.db.insert('users', {
    ...data,
    subscriptionTier: DEFAULT_TIER,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

/** Patch basic profile fields on an existing user. */
export async function patchUserProfile(
  ctx: MutationCtx,
  userId: Id<'users'>,
  data: { email: string; name?: string; imageUrl?: string },
) {
  return ctx.db.patch(userId, {
    ...data,
    updatedAt: Date.now(),
  });
}

/** Patch subscription-related fields on an existing user. */
export async function patchUserSubscription(
  ctx: MutationCtx,
  userId: Id<'users'>,
  data: {
    subscriptionTier: SubscriptionTier;
    polarCustomerId?: string;
    polarSubscriptionId?: string;
  },
) {
  return ctx.db.patch(userId, {
    ...data,
    updatedAt: Date.now(),
  });
}

/** Patch the denormalized prompt stats counter on a user. */
export async function patchUserPromptStats(
  ctx: MutationCtx,
  userId: Id<'users'>,
  stats: {
    total: number;
    templates: number;
    public: number;
    newThisWeek?: number;
    lastActivityAt?: number;
  },
) {
  return ctx.db.patch(userId, { promptStats: stats });
}
