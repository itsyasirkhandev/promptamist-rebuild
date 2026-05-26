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
import { findUserById } from './users.dal';
import { updateUserPromptStats } from '../authed/userStats';

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
    category?: string;
    searchableText?: string;
  },
) {
  const promptId = await ctx.db.insert('prompts', data);
  await updateUserPromptStats(ctx, data.userId, {
    total: 1,
    templates: data.isTemplate ? 1 : 0,
    public: data.isPublic ? 1 : 0,
  });
  return promptId;
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
      | 'category'
      | 'searchableText'
    >
  >,
) {
  const existing = await ctx.db.get(id);
  if (!existing) {
    return ctx.db.patch(id, data);
  }

  await ctx.db.patch(id, data);

  const templateChange =
    (data.isTemplate !== undefined ? (data.isTemplate ? 1 : 0) : (existing.isTemplate ? 1 : 0)) -
    (existing.isTemplate ? 1 : 0);

  const publicChange =
    (data.isPublic !== undefined ? (data.isPublic ? 1 : 0) : (existing.isPublic ? 1 : 0)) -
    (existing.isPublic ? 1 : 0);

  if (templateChange !== 0 || publicChange !== 0) {
    await updateUserPromptStats(ctx, existing.userId, {
      templates: templateChange,
      public: publicChange,
    });
  }
}

/** Delete a prompt by its ID. */
export async function deletePrompt(ctx: MutationCtx, id: Id<'prompts'>) {
  const existing = await ctx.db.get(id);
  if (existing) {
    await ctx.db.delete(id);
    await updateUserPromptStats(ctx, existing.userId, {
      total: -1,
      templates: existing.isTemplate ? -1 : 0,
      public: existing.isPublic ? -1 : 0,
    });
  }
}

// ---------------------------------------------------------------------------
// Compound / Aggregation Lookups
// ---------------------------------------------------------------------------

/** Find a public prompt and its author by public slug. Returns null if not found or not public. */
export async function findPublicPromptWithAuthor(
  ctx: QueryCtx | MutationCtx,
  slug: string,
): Promise<{ prompt: Doc<'prompts'>; author: Doc<'users'> | null } | null> {
  const prompt = await findPromptBySlug(ctx, slug);
  if (!prompt || !prompt.isPublic) {
    return null;
  }
  const author = await findUserById(ctx, prompt.userId);
  return { prompt, author };
}

/** Fetch a list of public prompts along with their authors, optionally filtering by search query and category. */
export async function listPublicPromptsWithAuthors(
  ctx: QueryCtx | MutationCtx,
  options: {
    searchQuery?: string;
    category?: string;
    limit?: number;
  },
): Promise<{ prompt: Doc<'prompts'>; author: Doc<'users'> | null }[]> {
  let prompts: Doc<'prompts'>[] = [];
  const limit = options.limit ?? 50;

  if (options.searchQuery) {
    prompts = await ctx.db
      .query('prompts')
      .withSearchIndex('search_all', (q) =>
        q
          .search('searchableText', options.searchQuery as string)
          .eq('isPublic', true),
      )
      .take(limit);

    if (options.category && options.category !== 'all') {
      prompts = prompts.filter(
        (p) => (p.category ?? 'general') === options.category,
      );
    }
  } else {
    const rawPrompts = await ctx.db
      .query('prompts')
      .withIndex('by_isPublic', (q) => q.eq('isPublic', true))
      .order('desc')
      .take(100);

    if (options.category && options.category !== 'all') {
      prompts = rawPrompts
        .filter((p) => (p.category ?? 'general') === options.category)
        .slice(0, limit);
    } else {
      prompts = rawPrompts.slice(0, limit);
    }
  }

  const results = await Promise.all(
    prompts.map(async (p) => {
      const author = await findUserById(ctx, p.userId);
      return { prompt: p, author };
    }),
  );

  return results;
}
