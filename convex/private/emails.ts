import { v } from 'convex/values';
import { internalAction } from '../_generated/server';
import { Effect } from 'effect';

export const sendProWelcome = internalAction({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const sendEmail = Effect.tryPromise({
      try: () =>
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY!,
          },
          body: JSON.stringify({
            sender: { name: 'Promptamist Team', email: 'yasirwebio@gmail.com' },
            to: [{ email: args.email }],
            subject: 'Welcome to Promptamist Pro!',
            htmlContent:
              '<h1>You are now a Pro!</h1><p>Enjoy your newly unlocked entitlements: unlimited prompts, unlimited public sharing, and unlimited static prompt creation.</p>',
          }),
        }),
      catch: (e) => new Error(`Bravo API Fetch Failure: ${e}`),
    });

    const program = Effect.gen(function* () {
      const response = yield* sendEmail;
      if (!response.ok) {
        return yield* Effect.fail(
          new Error(`Bravo API Error: ${response.status} ${response.statusText}`)
        );
      }
      return response;
    }).pipe(
      Effect.match({
        onFailure: (error) => {
          console.error('Failed to send Pro Welcome email:', error);
          return null;
        },
        onSuccess: (res) => res,
      })
    );

    await Effect.runPromise(program);
  },
});
