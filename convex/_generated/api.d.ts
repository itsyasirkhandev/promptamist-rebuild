/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as authed_helpers from "../authed/helpers.js";
import type * as authed_polar from "../authed/polar.js";
import type * as authed_promptOwnership from "../authed/promptOwnership.js";
import type * as authed_prompts from "../authed/prompts.js";
import type * as authed_userStats from "../authed/userStats.js";
import type * as authed_users from "../authed/users.js";
import type * as billing_provider from "../billing/provider.js";
import type * as dto from "../dto.js";
import type * as effect from "../effect.js";
import type * as emails from "../emails.js";
import type * as errors from "../errors.js";
import type * as http from "../http.js";
import type * as limits from "../limits.js";
import type * as migrations from "../migrations.js";
import type * as private_emails from "../private/emails.js";
import type * as private_helpers from "../private/helpers.js";
import type * as private_polar from "../private/polar.js";
import type * as private_users from "../private/users.js";
import type * as publicPrompts from "../publicPrompts.js";
import type * as slugs from "../slugs.js";
import type * as subscription from "../subscription.js";
import type * as users from "../users.js";
import type * as validators from "../validators.js";
import type * as webhooks from "../webhooks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "authed/helpers": typeof authed_helpers;
  "authed/polar": typeof authed_polar;
  "authed/promptOwnership": typeof authed_promptOwnership;
  "authed/prompts": typeof authed_prompts;
  "authed/userStats": typeof authed_userStats;
  "authed/users": typeof authed_users;
  "billing/provider": typeof billing_provider;
  dto: typeof dto;
  effect: typeof effect;
  emails: typeof emails;
  errors: typeof errors;
  http: typeof http;
  limits: typeof limits;
  migrations: typeof migrations;
  "private/emails": typeof private_emails;
  "private/helpers": typeof private_helpers;
  "private/polar": typeof private_polar;
  "private/users": typeof private_users;
  publicPrompts: typeof publicPrompts;
  slugs: typeof slugs;
  subscription: typeof subscription;
  users: typeof users;
  validators: typeof validators;
  webhooks: typeof webhooks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
