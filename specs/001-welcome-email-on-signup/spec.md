# Welcome Email on Signup Specification

**1. Problem Statement**
Currently, when new users sign up for the platform, they do not receive any immediate confirmation or welcome message. Sending a welcome email is critical for engaging new users, verifying successful onboarding, and providing them with initial guidance or links to get started.

**2. Functional Requirements**

- The system must integrate with **Brevo** as the email service provider.
- A well-designed, modern HTML welcome email template must be created (including a greeting, a brief introduction, and a call-to-action like "Get Started").
- The email must be triggered automatically immediately after a new user record is successfully synced into our database via Convex.
- The email sending logic must be executed as a **Convex Action**, as Convex mutations cannot make external HTTP requests.

**3. Inputs and Outputs: Primary Actions**

- **USER ACTION:** A new user completes the sign-up process (via Clerk) and the user data is synced to the Convex database.
- **SYSTEM BEHAVIOR:**
  - The user is inserted into the `users` table.
  - The Convex backend triggers a Convex Action (either via a scheduled action or directly called from the user creation mutation/workflow).
  - The Convex Action sends a request to the Brevo API containing the user's email address and the welcome email template.
  - The user receives the welcome email in their inbox.

**4. Constraints**

- The email integration must use the Brevo API.
- Brevo API credentials must be securely stored as Convex Environment Variables.
- The email sending must not block the main user creation flow (it should be asynchronous).
- No complex retry mechanisms are required at this stage.

**5. Edge Cases and Error Handling**

- **Brevo API downtime/timeout:** If the email fails to send due to a Brevo issue, log the error in the Convex backend but do not revert or block the user creation.
- **Invalid Email Address:** If Brevo rejects the email address, log the failure.
- **Missing API Keys:** If the Brevo API key is not configured in Convex, the action should exit gracefully and log a descriptive warning.

**6. Acceptance Criteria**

- A new Convex Action (`sendWelcomeEmail` or similar) is implemented that successfully calls the Brevo API.
- The user creation flow in Convex (likely in `convex/users.ts`) triggers this action immediately after a new user is created.
- A polished welcome email template is drafted and included in the action.
- Creating a test user successfully delivers the welcome email to the provided email address.
- If the email fails to send, the error is logged, but the user is still created in the database without issues.
