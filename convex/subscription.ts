/**
 * subscription.ts — Subscription tier domain model
 *
 * The single authoritative source for the set of valid tiers and all
 * tier-gated predicates. Adding a new tier (e.g. 'team') only requires
 * changes here — no scattered string comparisons to hunt down.
 *
 * Tiers:
 *   'hobby' — default for every new user; subject to prompt-count limits.
 *   'pro'   — granted on successful Polar.sh checkout; unlimited prompts.
 */

import { v } from 'convex/values';

// ---------------------------------------------------------------------------
// Type + validator
// ---------------------------------------------------------------------------

/** All valid subscription tiers. Used as the TypeScript type throughout the app. */
export type SubscriptionTier = 'hobby' | 'pro';

/** Default tier assigned to every new user (no payment required). */
export const DEFAULT_TIER: SubscriptionTier = 'hobby';

/**
 * Convex value validator for the subscriptionTier field.
 * Use this in schema.ts and in internalMutation args to enforce the enum at runtime.
 */
export const subscriptionTierValidator = v.union(
  v.literal('hobby'),
  v.literal('pro'),
);

// ---------------------------------------------------------------------------
// Predicates
// ---------------------------------------------------------------------------

/**
 * Returns true when the tier grants unlimited prompt creation.
 * All tier-gating logic for prompt limits must call this instead of
 * comparing strings directly.
 */
export function canCreateUnlimitedPrompts(tier: SubscriptionTier): boolean {
  return tier === 'pro';
}
