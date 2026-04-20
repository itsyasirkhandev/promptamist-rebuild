# Design Plan: Typed Error Handling with Effect TS v4 Beta

Technical specification for implementing a type-safe error handling system using Effect TS v4 beta across the Convex backend and Next.js frontend, replacing generic `throw new Error()` calls with structured, serializable error classes.

### 1. Objective

Improve developer experience and application robustness by introducing typed errors. This allows the backend to propagate specific error types (Unauthorized, NotFound, ValidationError) to the frontend, which can then provide tailored user feedback using `sonner` toasts.

### 2. Tech Stack

- **Effect TS v4 Beta**: Specifically leveraging `Schema.TaggedErrorClass` and the new "Yieldable" trait for ergonomic error propagation in generators.
- **Convex**: Utilizing `customMutation` and `customQuery` wrappers to automatically execute Effect programs and map errors to `ConvexError`.
- **Next.js 16 / React 19**: Modern frontend patterns for catching and displaying server-side errors.
- **Sonner**: For consistent, accessible toast notifications.

**Why this stack?** Effect v4 beta offers significant bundle size improvements (~70% reduction) and a unified `effect` package. `Schema.TaggedErrorClass` provides built-in serialization, making it perfect for Convex's wire protocol.

### 3. High-Level Architecture

- **A. Error Layer (`convex/errors.ts`)**: Central definition of all domain errors as Schema-based classes.
- **B. Effect Runner (`convex/effect.ts`)**: A utility to run Effect programs in Convex and map failures to `ConvexError` with appropriate metadata.
- **C. Context Wrappers (`convex/authed/helpers.ts`)**: Enhanced versions of `authedMutation` and `authedQuery` that accept handlers returning `Effect` types.
- **D. Frontend Handler (`src/lib/error-handler.ts`)**: A global utility to intercept `ConvexError` and trigger UI notifications.

**ARCHITECTURE FLOW**:
`Effect.gen` (Backend) -> `runEffect` -> `ConvexError` -> `useMutation` (Frontend) -> `catch` -> `handleError` -> `sonner` toast.

### 4. Data Model

Errors are defined using `Schema.TaggedErrorClass` in `convex/errors.ts`:

```typescript
import { Schema } from 'effect';

export class Unauthorized extends Schema.TaggedErrorClass('Unauthorized')({
  message: Schema.String,
}) {}

export class NotFound extends Schema.TaggedErrorClass('NotFound')({
  message: Schema.String,
  resource: Schema.optional(Schema.String),
}) {}

export class ValidationError extends Schema.TaggedErrorClass('ValidationError')(
  {
    message: Schema.String,
    fields: Schema.optional(
      Schema.Record({ key: Schema.String, value: Schema.String }),
    ),
  },
) {}

export class InternalError extends Schema.TaggedErrorClass('InternalError')({
  message: Schema.String,
}) {}
```

### 5. Core Design Decisions

- **Decision 1: Use `Schema.TaggedErrorClass`**: Unlike `Data.TaggedError`, these are full schemas that can be automatically validated and serialized. In v4 beta, they implement `Yieldable`, allowing `yield* new NotFound(...)` syntax.
- **Decision 2: Wrapper-based Integration**: Instead of manually calling `runEffect` in every handler, we update `authedMutation` and `authedQuery` to detect if a handler returns an Effect and handle it automatically.
- **Decision 3: Map Failure to `ConvexError`**: All typed failures are wrapped in a `ConvexError` before leaving the backend. This ensures they are properly serialized as JSON and can be inspected by the frontend client.
- **Decision 4: Handle Defects as InternalError**: Any unhandled non-Effect errors (defects) are caught by `runEffect` and converted to a generic `InternalError` to avoid leaking system details.

### 6. Core Functional Flows

#### A. Backend Execution (`runEffect`)

```typescript
import { Effect, Exit, Cause, Either } from 'effect';
import { ConvexError } from 'convex/values';

export const runEffect = async <A, E>(effect: Effect.Effect<A, E>) => {
  const exit = await Effect.runPromiseExit(effect);

  if (Exit.isFailure(exit)) {
    const failure = Cause.failureOrCause(exit.cause);
    if (Either.isLeft(failure)) {
      const error = failure.left;
      // Propagate typed errors as ConvexError data
      if (error && typeof error === 'object' && '_tag' in error) {
        throw new ConvexError(error);
      }
    }
    // Generic fallback for defects
    throw new ConvexError({
      _tag: 'InternalError',
      message: 'An unexpected error occurred',
    });
  }

  return exit.value;
};
```

#### B. Logic Refactoring Example

```typescript
// Nested helper refactored to return Effect
const getUserId = (ctx: QueryCtx | MutationCtx, clerkId: string) =>
  Effect.gen(function* () {
    const user = yield* Effect.promise(() =>
      ctx.db.query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
        .first()
    );
    if (!user) {
      yield* new NotFound({ message: "User not found" });
    }
    return user._id;
  });

// Mutation using the helper
export const createPrompt = authedMutation({
  args: { ... },
  handler: (ctx, args) => Effect.gen(function* () {
    const userId = yield* getUserId(ctx, ctx.identity.subject);

    return yield* Effect.promise(() =>
      ctx.db.insert("prompts", {
        userId,
        ...args,
      })
    );
  }),
});
```

#### C. Frontend Error Handling

```typescript
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

export const handleError = (err: unknown) => {
  if (err instanceof ConvexError) {
    const data = err.data as { _tag: string; message: string };
    switch (data._tag) {
      case 'Unauthorized':
        toast.error('Unauthorized', { description: data.message });
        break;
      case 'NotFound':
        toast.error('Not Found', { description: data.message });
        break;
      case 'ValidationError':
        toast.warning('Validation Error', { description: data.message });
        break;
      default:
        toast.error('Error', { description: data.message });
    }
  } else {
    toast.error('Critical Failure', { description: 'Please contact support.' });
  }
};
```

### 7. Development Plan

1.  **Package Setup**:
    - Install Effect beta: `pnpm add effect@beta`
2.  **Define Error Classes**:
    - Create `convex/errors.ts` and define `Unauthorized`, `NotFound`, `ValidationError`, and `InternalError`.
3.  **Implement Runner Utility**:
    - Create `convex/effect.ts` with the `runEffect` helper.
4.  **Update Convex Helpers**:
    - Refactor `convex/authed/helpers.ts` to wrap handlers with `runEffect`.
    - Refactor `convex/private/helpers.ts` to use typed errors for API key validation.
5.  **Refactor Business Logic**:
    - Update `getUserId` in `convex/authed/prompts.ts` to return `Effect<Id<'users'>, NotFound>`.
    - Update `createPrompt` to use `Effect.gen` and `yield*`.
6.  **Frontend Integration**:
    - Create `src/lib/error-handler.ts`.
    - Update a component (e.g., `PromptEditor.tsx`) to use the new error handler in its `catch` block.
7.  **Verification**:
    - Run `pnpm typecheck` and `pnpm lint`.
    - Trigger a "Not Found" error manually to verify the `sonner` toast.
