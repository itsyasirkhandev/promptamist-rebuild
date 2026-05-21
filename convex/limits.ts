/**
 * limits.ts — Authoritative prompt constraint constants
 *
 * Both the backend Effect validators and the frontend Zod schema import
 * from here. Changing a limit here propagates everywhere automatically.
 */

/** Maximum character length for a prompt title. */
export const PROMPT_TITLE_MAX_LENGTH = 300;

/** Maximum character length for prompt content. */
export const PROMPT_CONTENT_MAX_LENGTH = 50_000;

/** Free-tier maximum number of prompts a user may create. */
export const FREE_TIER_PROMPT_LIMIT = 50;
