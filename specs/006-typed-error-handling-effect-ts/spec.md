### 1. Problem Statement

The current application uses standard JavaScript `throw new Error()` for handling failures in both backend (Convex) and frontend (Next.js) code. This approach lacks type safety, making it difficult for developers to know exactly which errors a function might return without inspecting the implementation. On the frontend, this results in generic error messages and inconsistent user feedback.

**Solution:** Implement typed error handling using **Effect TS v4 beta**. This will provide a robust, type-safe way to define, propagate, and handle errors across the entire stack, utilizing patterns like `Schema.TaggedErrorClass` and `Effect.gen`.

### 2. Functional Requirements

- **Centralized Error Definitions:** Define a core set of standard errors using `Schema.TaggedErrorClass`:
  - `Unauthorized`: For authentication failures.
  - `NotFound`: For missing resources (e.g., specific prompts or users).
  - `ValidationError`: For invalid user input or business rule violations.
  - `InternalError`: For unexpected system failures.
- **Convex Integration:**
  - Refactor `authedQuery`, `authedMutation`, and `authedAction` in `src/convex/authed/helpers.ts` to support Effect.
  - Update `private` helpers in `src/convex/private/helpers.ts` to use typed errors for API key validation.
  - Provide a utility function (e.g., `runEffect`) to execute Effect programs within Convex handlers and safely convert typed errors into `ConvexError` for client propagation.
- **Business Logic Refactoring:**
  - Convert existing handlers (e.g., `getUserId`, `getPromptById`) to return `Effect` types instead of throwing.
  - Use `Effect.gen` and `yield*` for readable, sequential logic that handles errors implicitly.
- **Frontend Error Handling:**
  - Implement a standardized error handler for the frontend that identifies `ConvexError` payloads mapped from Effect's `TaggedErrorClass`.
  - Automatically trigger `sonner` toasts with appropriate titles, descriptions, and styling based on the error type.

### 3. Inputs and Outputs / Interaction Behavior

**USER ACTION (INPUT):** A user submits a form to update a prompt that was recently deleted by another session.
**EXPECTED SYSTEM BEHAVIOR:**

- The `updatePrompt` mutation runs an Effect workflow.
- `yield* ctx.db.get(args.id)` (wrapped in Effect) fails to find the prompt.
- The workflow returns a `NotFound` error.
- The `runEffect` wrapper catches `NotFound` and throws a `ConvexError({ tag: 'NotFound', message: '...' })`.
- The frontend catch block identifies the `NotFound` tag.
- **Result:** A red toast appears saying "Prompt Not Found: The prompt you are trying to edit no longer exists."

**USER ACTION (INPUT):** A user attempts to save a prompt without a title.
**EXPECTED SYSTEM BEHAVIOR:**

- The backend validation (via Effect Schema or custom logic) fails.
- A `ValidationError` is propagated.
- **Result:** A yellow toast appears listing the specific validation errors.

### 4. Constraints

- **Effect Version:** Must strictly use **Effect TS v4 beta** features.
- **Convex Compatibility:** Since Convex functions must eventually return JSON or throw, Effect programs must be "run" and their results mapped before the function completes.
- **Performance:** The overhead of wrapping simple queries in Effect should be negligible (under 5ms).
- **Bundle Size:** Monitor the impact of adding Effect to the frontend bundle; use tree-shaking where possible.

### 5. Edge Cases and Error Handling

- **Unknown Errors:** If a third-party library throws a standard `Error`, it must be caught and wrapped in `InternalError` before reaching the client.
- **Parallel Execution:** Use `Effect.all` or `Effect.forEach` for parallel operations, ensuring all potential errors are aggregated or handled.
- **Stale Data:** Handle cases where a resource exists but the user no longer has permission to access it (`Unauthorized` or `Forbidden`).
- **Schema Evolution:** Ensure that adding new error types doesn't break existing frontend error-handling logic (use a default case in switches).

### 6. Acceptance Criteria

- Standard error classes are defined in a shared `errors.ts` (or similar) accessible to both backend and frontend.
- `authedMutation`, `authedQuery`, and `authedAction` can execute `Effect` programs.
- All `throw new Error` calls in `src/convex/authed/prompts.ts` are replaced with Effect-based error propagation.
- The frontend correctly differentiates between `NotFound`, `Unauthorized`, and `ValidationError` when displaying toasts.
- Code passes `pnpm typecheck` without any `any` types related to error handling.
- `pnpm lint` and `pnpm format` have been run and pass.
