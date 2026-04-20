import { Effect, Exit, Cause, Result, Schema } from 'effect';
import { ConvexError, Value } from 'convex/values';
import { InternalError } from './errors';

export const runEffect = async <A, E>(effect: Effect.Effect<A, E, never>) => {
  const exit = await Effect.runPromiseExit(effect);

  if (Exit.isFailure(exit)) {
    const errorResult = Cause.findError(exit.cause);

    if (Result.isSuccess(errorResult)) {
      const error = errorResult.success;
      // Propagate typed errors as ConvexError data
      if (
        error &&
        typeof error === 'object' &&
        '_tag' in error &&
        'constructor' in error
      ) {
        // Use the instance's constructor as the schema if it looks like a TaggedErrorClass
        const ctor = error.constructor as unknown as Schema.Schema<
          unknown,
          unknown
        >;
        const plainError = Schema.encodeSync(ctor)(error);
        throw new ConvexError(plainError as Value);
      }
    }

    // Generic fallback for defects
    const message = Cause.pretty(exit.cause);
    console.error('Effect defect:', message);
    throw new ConvexError(
      Schema.encodeSync(InternalError)(
        new InternalError({
          message: 'An unexpected error occurred',
        }),
      ) as Value,
    );
  }

  return exit.value;
};
