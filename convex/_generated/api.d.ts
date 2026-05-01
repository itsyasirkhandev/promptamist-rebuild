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
import type * as authed_promptHelpers from "../authed/promptHelpers.js";
import type * as authed_prompts from "../authed/prompts.js";
import type * as effect from "../effect.js";
import type * as emails from "../emails.js";
import type * as errors from "../errors.js";
import type * as http from "../http.js";
import type * as private_helpers from "../private/helpers.js";
import type * as publicPrompts from "../publicPrompts.js";
import type * as users from "../users.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "authed/helpers": typeof authed_helpers;
  "authed/promptHelpers": typeof authed_promptHelpers;
  "authed/prompts": typeof authed_prompts;
  effect: typeof effect;
  emails: typeof emails;
  errors: typeof errors;
  http: typeof http;
  "private/helpers": typeof private_helpers;
  publicPrompts: typeof publicPrompts;
  users: typeof users;
  validators: typeof validators;
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
