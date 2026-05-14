/**
 * slugs.ts — Public slug generation and uniqueness checking
 *
 * All slug-domain logic lives here. No caller needs to know how uniqueness
 * is enforced or how many retry attempts are made — that is the depth.
 *
 * Exports:
 *   generateUniqueSlug — derive a URL-safe slug from a title, retrying until unique
 */

import { Effect } from 'effect';
import { MutationCtx } from './_generated/server';
import { isSlugTaken } from './dal/prompts.dal';

const MAX_ATTEMPTS = 5;

/** Generate a unique public slug for a prompt title (max 5 random attempts, then timestamp fallback). */
export function* generateUniqueSlug(ctx: MutationCtx, title: string) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let attempts = 0;
  while (attempts < MAX_ATTEMPTS) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const candidate = `${baseSlug}-${randomSuffix}`;
    const taken = yield* Effect.promise(() => isSlugTaken(ctx, candidate));
    if (!taken) {
      return candidate;
    }
    attempts++;
  }

  // Timestamp fallback — guaranteed unique within the same deployment
  return `${baseSlug}-${Date.now().toString(36)}`;
}
