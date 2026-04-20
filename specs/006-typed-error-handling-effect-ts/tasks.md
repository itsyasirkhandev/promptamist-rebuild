# Tasks: Typed Error Handling with Effect TS

## [Phase 1] - Setup and Definitions

- [ ] [Phase 1] Install Effect v4 beta dependency using `pnpm add effect@beta`.
  - **Verification**: Check `package.json` to ensure `effect` is installed with a version matching the v4 beta.
- [ ] [Phase 1] Create `convex/errors.ts` and define `Unauthorized`, `NotFound`, `ValidationError`, and `InternalError` using `Schema.TaggedErrorClass`.
  - **Verification**: Ensure each class has a `_tag` and a `message` field, and they are exported.
- [ ] [Phase 1] Create `convex/effect.ts` with the `runEffect` utility to execute Effect programs and map failures to `ConvexError`.
  - **Verification**: Test `runEffect` with a failing Effect and verify it throws a `ConvexError` containing the error's `_tag` and `message`.

## [Phase 2] - Backend Core (Runner & Helpers)

- [ ] [Phase 2] Refactor `convex/authed/helpers.ts` to wrap handlers with `runEffect`, supporting both standard and Effect-returning handlers.
  - **Verification**: Existing mutations in `convex/authed/prompts.ts` should still work without changes (backward compatibility).
- [ ] [Phase 2] Refactor `convex/private/helpers.ts` to use typed errors (e.g., `Unauthorized`) for API key validation.
  - **Verification**: Calling a private function with an invalid API key should return a structured `Unauthorized` error data in `ConvexError`.
- [ ] [Phase 2] Enhance `runEffect` in `convex/effect.ts` to catch unhandled defects and wrap them as `InternalError`.
  - **Verification**: Throwing a standard `new Error()` inside an Effect handler should result in a "InternalError" `ConvexError`.

## [Phase 3] - Refactoring Business Logic

- [ ] [Phase 3] Refactor `getUserId` in `convex/authed/helpers.ts` to return an `Effect<Id<"users">, NotFound>`.
  - **Verification**: Update usages of `getUserId` to use `yield*` or `Effect.runPromise`.
- [ ] [Phase 3] Refactor `convex/authed/prompts.ts` to use `Effect.gen` and `yield*` for all mutations (e.g., `createPrompt`, `updatePrompt`, `deletePrompt`).
  - **Verification**: `pnpm typecheck` should pass, confirming correct error propagation from `getUserId` and other operations.
- [ ] [Phase 3] Update prompt validation logic to use `ValidationError` instead of generic error throws.
  - **Verification**: Trigger a validation failure and check if the returned `ConvexError` has the `ValidationError` tag.

## [Phase 4] - Frontend Integration

- [ ] [Phase 4] Create `src/lib/error-handler.ts` with a `handleError` function that parses `ConvexError` and triggers `sonner` toasts.
  - **Verification**: The function should correctly switch on `_tag` and show different toast types (error, warning).
- [ ] [Phase 4] Update `src/components/prompts/PromptEditor.tsx` to use the global `handleError` in all `useMutation` catch blocks.
  - **Verification**: Manually trigger a `NotFound` or `ValidationError` and verify the corresponding `sonner` toast appears.
- [ ] [Phase 4] Update `src/components/prompts/VariableConfigModal.tsx` and other prompt-related components to use `handleError`.
  - **Verification**: Consistent error UI across all prompt management features.

## [Phase 5] - Verification and Cleanup

- [ ] [Phase 5] Run full project type checking using `pnpm typecheck`.
  - **Verification**: Zero type errors across `src/` and `convex/` directories.
- [ ] [Phase 5] Run linting and formatting using `pnpm lint` and `pnpm format`.
  - **Verification**: All files conform to project style guidelines.
- [ ] [Phase 5] Perform E2E manual test: Try to access/edit a non-existent prompt ID via the URL.
  - **Verification**: Confirm the UI displays a "Not Found" toast and gracefully handles the error.
