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
        // In Effect v4, TaggedErrorClass constructors are themselves Schemas
        const schema = error.constructor as unknown as Schema.Codec<
          unknown,
          unknown,
          never
        >;
        const plainError = Schema.encodeSync(schema)(error);
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
