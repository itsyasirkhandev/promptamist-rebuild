# Polar.sh Payment Integration Setup Guide

This document outlines the configuration and security settings used for the Polar.sh integration in the Promptamist application.

## 1. Personal Access Token (PAT)

The Personal Access Token is used by the Next.js Server Actions to create secure checkout sessions.

- **Token Name**: `Promptamist-Backend-Integration`
- **Permissions (Scopes)**:
  - `checkouts:write`: Mandatory for generating checkout sessions.
  - `subscriptions:read`: Used for verifying user tier status.
  - `orders:read`: (Optional) For future billing history features.
- **Environment Variable**: `POLAR_ACCESS_TOKEN`
- **Expiry Date**: `2026-08-02` (90-day rotation recommended)

## 2. Webhook Configuration

The webhook ensures that when a user pays on Polar, their `subscriptionTier` in Convex is updated automatically.

- **Webhook Name**: `Convex-Sync-Endpoint`
- **Endpoint URL**: `https://<your-convex-deployment>.convex.site/polar-webhook`
- **Enabled Events**:
  - `subscription.created`
  - `subscription.updated`
  - `subscription.active`
  - `subscription.canceled`
  - `subscription.revoked`
- **Environment Variable**: `POLAR_WEBHOOK_SECRET`
- **Verification Method**: HMAC SHA256 (via `svix` library)

## 3. User Reconciliation (Architecture)

The application uses the **`external_customer_id`** parameter within the Polar Checkout Session API. This is the primary method for linking Polar customers to local Clerk users.

- **Mechanism**: When a checkout is initialized, the `userId` (Clerk ID) is passed as `externalCustomerId`.
- **Polar Side**: Polar creates/updates a customer with this ID as their `external_id`.
- **Webhook Processing**: The webhook handler in `convex/http.ts` extracts the user ID from three possible locations (in order of priority):
  1. `event.data.customer_metadata.clerkId` (Legacy support)
  2. `event.data.external_customer_id` (Direct checkout link)
  3. `event.data.customer.external_id` (Standard object reference)

## 4. Product Configuration

- **Product Name**: Pro Plan
- **Product ID**: `bdea346d-5096-4cf7-b21c-f355ee41eaa4`
- **Pricing**: $5.00 / month

## 5. Environment Variables Reference

### Next.js (`.env.local`)

| Variable              | Description                                    |
| :-------------------- | :--------------------------------------------- |
| `POLAR_ACCESS_TOKEN`  | The PAT from Step 1.                           |
| `NEXT_PUBLIC_APP_URL` | Your base URL (e.g., `http://localhost:3000`). |

### Convex (Backend)

| Variable               | Description                                   |
| :--------------------- | :-------------------------------------------- |
| `POLAR_WEBHOOK_SECRET` | The secret used to sign Polar webhook events. |

## 6. Security & Best Practices

- **Error Handling**: Implemented via `Effect.ts`. The system uses a functional pipeline to catch and tag errors (e.g., `CheckoutError`, `UnauthorizedError`) before they reach the UI.
- **Type Safety**: `Zod` schemas validate environment variables at runtime and incoming webhook payloads, ensuring strict data integrity.
- **O(1) Enforcement**: User prompt limits are validated on the backend in Convex mutations using atomic counters, preventing race conditions or tier bypasses.

---

_Last Updated: 2026-05-02_
