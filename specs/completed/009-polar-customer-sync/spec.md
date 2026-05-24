# Polar Customer Synchronization Specification

## 1. Problem Statement

Currently, the application relies on `externalCustomerId` (mapped to the Clerk user ID) when creating Polar checkouts and customer portal sessions. While this works as a basic integration, it has several limitations:

- It does not utilize Polar's native **Customer** entities fully, making customer reconciliation, analytics, and billing management in the Polar dashboard more difficult.
- If a customer object is not explicitly created first, we cannot easily pre-populate or maintain synchronized metadata (like both Clerk ID and Convex User ID) on the Polar customer profile.
- We lack a persistent, verified `polarCustomerId` in our local database that is populated at user registration, resulting in less robust checkout and customer portal session creation.

### Solution

This feature introduces automatic and on-demand synchronization of native Polar Customers:

1. **At Signup**: When a new user registers (handled via the Clerk webhook), the system asynchronously creates a native Customer in Polar.sh and stores the returned `polarCustomerId` in the Convex `users` table.
2. **On-Demand**: If a user does not have a `polarCustomerId` (e.g., legacy users or due to past background API failures) when they request a checkout session or billing portal, the system dynamically creates the Customer in Polar, saves the ID, and then generates the checkout or portal URL using that ID.

---

## 2. Functional Requirements

The system should:

- **Asynchronous Sign-up Synchronization**:
  - Upon receiving a `user.created` event from Clerk, immediately insert the user in the Convex database.
  - Schedule a background Convex action to call Polar's Customer Creation API.
  - Store the returned `polarCustomerId` in the Convex user's document.
  - Log any background errors gracefully without failing or blocking the main user signup process.

- **On-Demand Synchronization**:
  - Before generating a checkout session or a customer portal session, check if the user has a `polarCustomerId` in Convex.
  - If the ID is missing, dynamically call Polar's Customer Creation API to create the customer, save the returned `polarCustomerId` to the database, and then proceed using the new customer ID.

- **Metadata Mapping**:
  - When creating a Polar Customer (either during signup or on-demand), attach the following metadata fields to the customer record in Polar:
    - `clerkId`: The Clerk User ID.
    - `convexUserId`: The Convex User Document ID.

- **Name Handling**:
  - Omit the `name` field in the Polar customer payload if the user's name is not specified or is empty in Clerk. This ensures Polar defaults to using their email address as the display name rather than a placeholder.

- **Checkout URL Generation**:
  - Retrieve the user's `polarCustomerId` from Convex.
  - Use the `customerId` property in the Polar checkout creation API payload instead of only `externalCustomerId`.
  - Fallback gracefully if on-demand creation fails.

- **Customer Portal URL Generation**:
  - Retrieve the user's `polarCustomerId` from Convex.
  - Use the `customerId` property in Polar's Customer Portal Session creation API payload.

---

## 3. Inputs and Outputs: Checkout and Customer Portal Flows

### Scenario A: Creating a Checkout Session (User is logged in)

**USER ACTION (INPUT)**

- User clicks the "Upgrade to Pro" button in the application.

**EXPECTED SYSTEM BEHAVIOR**

1. Next.js Server Action `createCheckoutSession` is called.
2. The server action fetches the user's Convex record using Clerk authentication.
3. **If `polarCustomerId` exists**:
   - Use it directly to call Polar's `checkouts.create` API with `{ customerId: polarCustomerId }`.
4. **If `polarCustomerId` is missing**:
   - Call Polar's `customers.create` API to create a new customer with the user's email, name (if present), and metadata (`clerkId`, `convexUserId`).
   - Save the returned `polarCustomerId` to Convex.
   - Call Polar's `checkouts.create` API with `{ customerId: newPolarCustomerId }`.
5. The checkout session URL is returned, and the user is redirected to the Polar Checkout page.

---

### Scenario B: Accessing the Customer Billing Portal (User is logged in)

**USER ACTION (INPUT)**

- User clicks the "Manage Subscription" or "Billing Portal" button.

**EXPECTED SYSTEM BEHAVIOR**

1. Next.js Server Action `createCustomerPortalSession` is called.
2. The server action fetches the user's Convex record using Clerk authentication.
3. **If `polarCustomerId` exists**:
   - Call Polar's `customerSessions.create` API with `{ customerId: polarCustomerId }`.
4. **If `polarCustomerId` is missing**:
   - Call Polar's `customers.create` API to create the customer, save the ID to Convex, and then call Polar's `customerSessions.create` with `{ customerId: newPolarCustomerId }`.
5. The portal session URL is returned, and the user is redirected to their personal Polar Customer Portal.

---

## 4. Constraints

- **Non-blocking Registration**: The background Polar customer creation must never block or delay the HTTP response of the Clerk webhook.
- **Low Latency**: On-demand customer creation and URL generation during checkout/portal access must complete in under 2 seconds.
- **Database Isolation**: All operations on the Convex `users` table must go through the Data Access Layer (DAL).
- **DTO Security**: The `polarCustomerId` must remain a sensitive internal reference and must **never** be leaked in the public user DTO (`toUserDTO`) sent to the client frontend.

---

## 5. Edge Cases and Error Handling

- **Polar API is Down / Timed Out during Webhook**:
  - The background action should log the failure as a warning. The user registration remains successful.
  - When the user later attempts a checkout or portal access, the system will dynamically retry customer creation on-demand.

- **User has No Name in Clerk**:
  - Omit the `name` field in the Polar customer payload. Polar will automatically default to using the email address.

- **Polar API is Down during Checkout/Portal On-Demand Creation**:
  - If Polar customer creation fails during checkout, log the error and fallback to creating the checkout using `externalCustomerId: user.id` and `customerEmail: user.email` as a last resort, ensuring that the user can still complete their payment.
  - Show a user-friendly error message if both attempts fail.

- **Clerk Webhook Retries**:
  - If Clerk retries the `user.created` webhook, the internal Convex mutation (`upsertFromClerk`) will find the existing user and update the record if changed, but will NOT trigger or duplicate the background Polar customer creation if the `polarCustomerId` is already populated.

---

## 6. Acceptance Criteria

This feature is considered complete if:

- [ ] New users signing up have a corresponding Customer record automatically created in Polar.sh in the background.
- [ ] The Polar Customer ID (`polarCustomerId`) is successfully saved in the user's Convex document.
- [ ] Both `clerkId` and `convexUserId` are attached as metadata on the Polar Customer record.
- [ ] If the name is blank in Clerk, the customer's name field is omitted in the Polar payload.
- [ ] Legacy users without a `polarCustomerId` have one created dynamically and saved in Convex when they click "Upgrade" or "Manage Subscription".
- [ ] The generated Checkout session URL correctly links to the native Polar Customer using `customerId`.
- [ ] The generated Customer Portal session URL correctly links to the native Polar Customer using `customerId`.
- [ ] The user-facing UserDTO does NOT expose `polarCustomerId` or other internal payment processor references.
- [ ] Codebase conforms to all linting, formatting, and TypeScript type-checking checks.
