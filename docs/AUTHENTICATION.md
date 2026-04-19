# Authentication Guide

This document describes the authentication setup for Promptamist, built with **Clerk**, **Next.js**, and **Convex**.

## 1. Overview

The application uses Clerk to handle authentication (sign up, sign in, OAuth) and Convex to securely access the database. The frontend is protected using a Next.js middleware, and the backend is protected by checking the user's identity on every function call.

## 2. Protected Routes

To add a new protected route:

1. Simply place your page inside an `app/(protected)/...` folder. The `src/proxy.ts` middleware by default protects everything except paths defined in the `isPublicRoute` matcher.
2. In your React components, use `<Authenticated>`, `<Unauthenticated>`, and `<AuthLoading>` from `convex/react` to manage UI states.

## 3. Accessing User Data in Convex

In any Convex query or mutation, fetch the current user's identity:

```ts
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error('Unauthenticated');
```

To fetch custom app-specific user fields (like preferences or subscription tier):

```ts
const user = await ctx.db
  .query('users')
  .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
  .first();
```

## 4. Webhooks

Clerk sends webhooks to `POST /api/webhooks/clerk` whenever a user is created or updated. This is used to synchronize users from Clerk into the Convex `users` table.

- To test locally, you must use something like `ngrok` or `localtunnel` and configure the webhook URL in the Clerk dashboard.
- Set your `CLERK_WEBHOOK_SECRET` in your `.env.local` file.
