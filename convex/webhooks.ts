/**
 * webhooks.ts — Shared webhook verification and payload types
 *
 * Centralises the Svix signature verification and HTTP→Effect error bridging
 * so each HTTP route handler only has to express dispatch logic.
 *
 * Exports:
 *   verifyWebhook   — verify a Svix-signed webhook and return the parsed payload
 *   toHttpResponse  — convert an Effect program into a HTTP Response
 *   ClerkWebhookPayload, PolarWebhookPayload  — typed payload shapes
 */

import { Webhook } from 'svix';
import { Effect } from 'effect';

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------

export interface ClerkWebhookPayload {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string;
  };
}

export interface PolarWebhookPayload {
  type: string;
  data: {
    id?: string;
    metadata?: Record<string, unknown>;
    customer?: {
      id?: string;
      external_id?: string | null;
      metadata?: Record<string, unknown>;
    };
    status?: string;
  };
}

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

/**
 * Verify a Svix-signed webhook request and return the parsed body.
 *
 * @param request    The incoming HTTP request.
 * @param secret     The raw webhook secret (will be used as-is).
 * @param encodeB64  When true, base64-encodes the secret before verification
 *                   (required by Polar's SDK).
 */
export function verifyWebhook<T>(
  request: Request,
  secret: string,
  encodeB64 = false,
): Effect.Effect<T, Response> {
  return Effect.gen(function* () {
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      yield* Effect.fail(new Response('Missing Svix headers', { status: 400 }));
    }

    const payload = yield* Effect.promise(() => request.text());

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const wh = new Webhook(encodeB64 ? btoa(secret) : secret);

    return yield* Effect.try({
      try: () => wh.verify(payload, headers) as T,
      catch: (error) => {
        console.error('Webhook verification failed:', error);
        return new Response('Invalid signature', { status: 400 });
      },
    });
  });
}

// ---------------------------------------------------------------------------
// HTTP↔Effect bridge
// ---------------------------------------------------------------------------

/**
 * Run an Effect program that can fail with a Response, and always
 * return a Response — either the failure value or the success value.
 */
export async function toHttpResponse(
  program: Effect.Effect<Response, Response>,
): Promise<Response> {
  return Effect.runPromise(
    program.pipe(
      Effect.match({
        onFailure: (err: Response) => err,
        onSuccess: (res: Response) => res,
      }),
    ),
  );
}
