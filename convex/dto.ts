/**
 * dto.ts — Data Transfer Objects
 *
 * Each mapper takes a raw Convex document (Doc<"table">) and returns
 * only the fields that are safe to send to the client. Internal IDs,
 * payment processor references, and other sensitive fields are stripped here.
 *
 * Rules:
 * - Never expose: polarCustomerId, polarSubscriptionId, clerkId
 * - Always use Doc<"tableName"> as the input type (full document)
 * - Export named types (UserDTO, PromptDTO, PublicPromptDTO) so the
 *   frontend can import them for type-safe consumption.
 */

import { Doc } from './_generated/dataModel';
import { DEFAULT_TIER, type SubscriptionTier } from './subscription';

// ---------------------------------------------------------------------------
// User DTO
// ---------------------------------------------------------------------------

/**
 * Safe user shape sent to the authenticated client.
 * Strips: clerkId, polarCustomerId, polarSubscriptionId, updatedAt, createdAt
 */
export function toUserDTO(user: Doc<'users'>) {
  return {
    _id: user._id,
    _creationTime: user._creationTime,
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
    subscriptionTier: (user.subscriptionTier ??
      DEFAULT_TIER) as SubscriptionTier,
    preferences: user.preferences ?? null,
    promptStats: user.promptStats ?? { total: 0, templates: 0, public: 0 },
  };
}

/** Inferred DTO type — import this on the frontend for type safety. */
export type UserDTO = ReturnType<typeof toUserDTO>;

// ---------------------------------------------------------------------------
// Prompt DTO (authenticated owner)
// ---------------------------------------------------------------------------

/**
 * Safe prompt shape for the authenticated owner of the prompt.
 * Strips: userId (internal Convex ID, redundant for the owner).
 * Strips: publicSlug when the prompt is not public (avoids leaking draft slugs).
 */
export function toPromptDTO(prompt: Doc<'prompts'>) {
  return {
    _id: prompt._id,
    _creationTime: prompt._creationTime,
    title: prompt.title,
    content: prompt.content,
    tags: prompt.tags,
    isTemplate: prompt.isTemplate,
    variables: prompt.variables,
    isPublic: prompt.isPublic ?? false,
    // Only expose the slug when the prompt is actually public.
    publicSlug: prompt.isPublic === true ? prompt.publicSlug : undefined,
  };
}

/** Inferred DTO type — import this on the frontend for type safety. */
export type PromptDTO = ReturnType<typeof toPromptDTO>;

// ---------------------------------------------------------------------------
// Public Prompt DTO (unauthenticated / shared view)
// ---------------------------------------------------------------------------

/**
 * Minimal safe shape for the public shared-prompt page.
 * Strips: userId, content is intentionally included (it's a shared prompt).
 * Does NOT expose any user-linking fields.
 */
export function toPublicPromptDTO(prompt: Doc<'prompts'>) {
  return {
    _id: prompt._id,
    _creationTime: prompt._creationTime,
    title: prompt.title,
    content: prompt.content,
    tags: prompt.tags,
    isTemplate: prompt.isTemplate,
    variables: prompt.variables,
    publicSlug: prompt.publicSlug,
  };
}

/** Inferred DTO type — import this on the frontend for type safety. */
export type PublicPromptDTO = ReturnType<typeof toPublicPromptDTO>;
