import { authedQuery, getUser } from './helpers';
import { runEffect } from '../effect';
import { Effect } from 'effect';
import { toUserDTO } from '../dto';

export const getCurrentUser = authedQuery({
  args: {},
  handler: async (ctx) => {
    return await runEffect(
      Effect.gen(function* () {
        const user = yield* getUser(ctx, ctx.identity.subject);
        if (!user) return null;
        // DTO: strip internal/sensitive fields before sending to client
        return toUserDTO(user);
      }),
    );
  },
});
