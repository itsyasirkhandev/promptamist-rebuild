# Pro Subscription Email Notification Specification

**1. Problem Statement**
When a user's subscription plan is upgraded from Hobby to Pro, they need to be immediately notified of their newly unlocked entitlements (unlimited prompts, sharing, and static prompts). Since the core subscription tier update is already handled automatically by the system, this feature focuses strictly on detecting the transition, accurately identifying the user from the Convex backend, and dispatching a welcome success email via the Bravo API.

---

**2. Functional Requirements**

The system should:

- Detect the specific event where a user's subscription status transitions from Hobby to Pro.
- Retrieve the user's current email address directly from the Convex backend using their account ID.
- Trigger a success email to that retrieved email address using the Bravo API.
- Handle any email delivery failures gracefully (fire-and-forget) without disrupting the existing subscription upgrade flow.

---

**3. Inputs and Outputs: Dispatch Pro Success Email**

|                              | Details                                                                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **USER ACTION (INPUT)**      | The user's subscription status officially changes from Hobby to Pro (triggered by the existing payment webhook flow).                   |
| **EXPECTED SYSTEM BEHAVIOR** | - Fetches the correct user email address from the Convex backend.<br>- Dispatches the 'Welcome to Pro' success email via the Bravo API. |

---

**4. Constraints**

| Constraint            | Requirement                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email Source of Truth | The email address MUST be fetched securely from the Convex backend user records to ensure accuracy, rather than solely relying on the payment provider's webhook payload. |
| Email Delivery        | Must exclusively use the Bravo API to send the success email.                                                                                                             |

---

**5. Edge Cases and Error Handling**

| Scenario                                                 | Expected Behavior                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Convex backend fails to return an email for the user ID  | Log the missing email error and abort the email dispatch; do not crash the webhook or upgrade flow. |
| Bravo API fails to send the email                        | Log the failure (fire-and-forget); do not attempt to rollback the user's Pro status.                |
| Status changes from Pro to Pro (e.g., a monthly renewal) | Do not send the success email; it must only fire on the initial Hobby -> Pro transition.            |

---

**6. Acceptance Criteria**

This feature is considered complete when **all** of the following are true:

- [ ] The system correctly fetches the user's email from the Convex backend specifically when the Hobby to Pro transition occurs.
- [ ] A success email is successfully dispatched via the Bravo API using the fetched email address.
- [ ] The success email is NOT sent during regular subscription renewals (e.g., Pro to Pro).
- [ ] If the Convex email fetch fails or the Bravo API fails, the error is safely logged without disrupting the main subscription status update.
