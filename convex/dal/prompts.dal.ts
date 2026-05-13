/**
 * prompts.dal.ts — Data Access Layer for the `prompts` table
 *
 * All raw `ctx.db` operations on the prompts table must go through here.
 * Business logic (queries/mutations) must NEVER call ctx.db for prompts directly.
 *
 * Naming convention:
 *   find*   → read operations (return Doc | null)
 *   list*   → read operations returning arrays
 *   insert* → create operations
 *   patch*  → partial update operations
 *   delete* → delete operations
 */

import { MutationCtx, QueryCtx } from '../_generated/server';
import { Id, Doc } from '../_generated/dataModel';

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

/** Get a single prompt by its Convex document ID. Returns null if not found. */
export async function findPromptById(
  ctx: QueryCtx | MutationCtx,
  id: Id<'prompts'>,
): Promise<Doc<'prompts'> | null> {
  return ctx.db.get(id);
}

/** Find a prompt by its public slug. Returns null if not found. */
export async function findPromptBySlug(
  ctx: QueryCtx | MutationCtx,
  slug: string,
): Promise<Doc<'prompts'> | null> {
  return ctx.db
    .query('prompts')
    .withIndex('by_publicSlug', (q) => q.eq('publicSlug', slug))
    .unique();
}

/** List the most recent prompts for a user (bounded, desc order). */
export async function listPromptsByUser(
  ctx: QueryCtx | MutationCtx,
  userId: Id<'users'>,
  limit = 100,
): Promise<Doc<'prompts'>[]> {
  return ctx.db
    .query('prompts')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .order('desc')
    .take(limit);
}

/** List prompts created after a given timestamp for a user (for weekly stats). */
export async function listRecentPromptsByUser(
  ctx: QueryCtx | MutationCtx,
  userId: Id<'users'>,
  since: number,
  limit = 100,
): Promise<Doc<'prompts'>[]> {
  return ctx.db
    .query('prompts')
    .withIndex('by_userId', (q) =>
      q.eq('userId', userId).gte('_creationTime', since),
    )
    .take(limit);
}

/** Get the most recently created prompt for a user. */
export async function findLastPromptByUser(
  ctx: QueryCtx | MutationCtx,
  userId: Id<'users'>,
): Promise<Doc<'prompts'> | null> {
  return ctx.db
    .query('prompts')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .order('desc')
    .first();
}

/** Check whether a public slug is already taken. */
export async function isSlugTaken(
  ctx: QueryCtx | MutationCtx,
  slug: string,
): Promise<boolean> {
  const existing = await ctx.db
    .query('prompts')
    .withIndex('by_publicSlug', (q) => q.eq('publicSlug', slug))
    .unique();
  return existing !== null;
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

/** Insert a new prompt document and return its ID. */
export async function insertPrompt(
  ctx: MutationCtx,
  data: {
    userId: Id<'users'>;
    title: string;
    content: string;
    tags: string[];
    isTemplate: boolean;
    variables: Doc<'prompts'>['variables'];
    isPublic?: boolean;
    publicSlug?: string;
  },
) {
  return ctx.db.insert('prompts', data);
}

/** Patch fields on an existing prompt. */
export async function patchPrompt(
  ctx: MutationCtx,
  id: Id<'prompts'>,
  data: Partial<
    Pick<
      Doc<'prompts'>,
      | 'title'
      | 'content'
      | 'tags'
      | 'isTemplate'
      | 'variables'
      | 'isPublic'
      | 'publicSlug'
    >
  >,
) {
  return ctx.db.patch(id, data);
}

/** Delete a prompt by its ID. */
export async function deletePrompt(
  ctx: MutationCtx,
  id: Id<'prompts'>,
) {
  return ctx.db.delete(id);
}
