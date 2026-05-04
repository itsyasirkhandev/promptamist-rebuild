# Polar.sh Payments Integration Specification

**1. Problem Statement**
The application currently does not have a monetization strategy or usage limits. We need to integrate Polar.sh for payments to introduce a "Pro" subscription. By default, users will be placed on a free "Hobby" tier which restricts the total number of prompts they can create. The paid "Pro" tier removes these restrictions, offering an unlimited experience.

**2. Functional Requirements**

- **Payment Gateway**: Integrate Polar.sh for handling subscriptions.
- **Product ID**: Use `c398bd70-7ccc-4190-8c31-01d274e3c8a4` for the "Pro" tier subscription.
- **Subscription Tiers**:
  - **Hobby Tier (Default/Free)**: The default state for all users upon sign up/login. Users on this tier can create a maximum of 50 prompts in total (inclusive of public, static, and dynamic prompts).
  - **Pro Tier ($5/month)**: Users on this paid tier have unlimited prompt creation capabilities.
- **Webhook Integration**: Listen for Polar.sh webhook events to securely update user subscription status in the Convex database.
- **Usage Enforcement**: When creating a prompt (public, static, or dynamic), the backend must check the user's current subscription tier and their current active prompt count.
  - Deleting a prompt reduces the user's current prompt count, freeing up quota for the 50-prompt limit.
  - If the limit is reached, block prompt creation and return a specific error indicating the limit has been reached.
- **User Interface**:
  - Display a pricing page or upgrade modal with an option to subscribe to the Pro tier via Polar.sh checkout.
  - Display current usage (e.g., "30/50 prompts used") for users on the Hobby tier.

**3. Inputs and Outputs: Primary Actions**

- **USER ACTION**: Click "Upgrade to Pro"
  - **SYSTEM BEHAVIOR**: Redirect user to the Polar.sh checkout session for the Pro tier.
- **USER ACTION**: Successfully complete checkout
  - **SYSTEM BEHAVIOR**: Polar.sh sends a webhook -> System verifies the webhook and updates the user's `subscriptionTier` (to 'pro') and `subscriptionId` in Convex.
- **USER ACTION**: Attempt to create a new prompt
  - **SYSTEM BEHAVIOR**:
    - Query the user's current total prompt count and subscription tier.
    - If Hobby tier and current count >= 50: Deny creation, return a limit-reached error, and show an upgrade prompt in the UI.
    - If Pro tier: Allow creation.

**4. Constraints**

- The prompt creation limit check must happen securely on the Convex backend. Client-side checks are insufficient.
- Webhooks must be cryptographically verified using the Polar.sh webhook secret.
- Subscriptions state must stay in sync with Polar.sh. In case of discrepancies, Polar.sh is the source of truth.

**5. Edge Cases and Error Handling**

- **Webhook Failures or Delays**: User pays but the webhook is delayed. The UI might still show them on the old tier. A manual "refresh" or optimistic UI update post-checkout might be needed.
- **Subscription Cancellation**: When a user cancels, they should retain their Pro tier until the end of the billing period. We need to handle `subscription.revoked` or `subscription.canceled` webhooks properly to revert them to 'hobby' at the end of the period.
- **Downgrading (Pro to Hobby)**: If a Pro user reverts to the Hobby tier and they currently have > 50 prompts, they retain all existing prompts. However, they are blocked from creating _new_ prompts until they delete enough existing prompts to drop their total count below 50.
- **Quota Release**: Deleting a prompt correctly decrements the current usage count, seamlessly opening up quota for Hobby tier users.

**6. Acceptance Criteria**

- New users are placed on the "Hobby" tier by default.
- Users can view subscription options and initiate a checkout for the Pro tier via Polar.sh.
- Upon successful payment, the user's account in Convex is automatically updated to 'pro' via webhooks.
- Users on the Hobby tier are strictly restricted from creating more than 50 total prompts.
- Deleting prompts frees up space towards the 50-prompt limit.
- Users on the Pro tier can create an unlimited number of prompts.
- Downgraded users with > 50 prompts are prevented from making new ones until under the limit.
- The UI gracefully handles limit-reached scenarios by showing a clear upgrade call-to-action.
- Webhooks for subscription creation, update, and cancellation are handled securely and update the database accordingly.
