# Block Temporary Emails Specification

## 1. Problem Statement

As users interact with the application, some registers/sign up using temporary or disposable email addresses. This leads to:

- High volumes of spam accounts
- Low-quality user databases
- Inaccurate usage analytics
- Potential abuse of application resources (e.g., limits, features)

Solution: Prevent users from signing up using temporary or disposable email addresses at the authentication layer using Clerk's native restriction features.

## 2. Functional Requirements

The system should:

- Block sign-ups from known temporary/disposable email domains (e.g., mailinator.com, 10minutemail.com, etc.).
- Block sign-ups that use email subaddressing (e.g., `user+spam@gmail.com`) to prevent single users from creating multiple accounts.
- Return a clear, human-readable validation error to the user on the sign-up page when a blocked domain or subaddress is used.

## 3. Inputs and Outputs: Sign-Up Behavior

**USER ACTION (INPUT)**
A user attempts to sign up with a temporary email (e.g., `test@10minutemail.com`) or a subaddress (e.g., `test+sub@gmail.com`).

**EXPECTED SYSTEM BEHAVIOR**

- Clerk intercepts the registration request.
- Clerk rejects the sign-up attempt.
- The sign-up interface displays a validation error message:
  - For disposable emails: "Disposable email addresses are not allowed." (or Clerk's standard error).
  - For subaddresses: "Email subaddresses are not allowed." (or Clerk's standard error).
- No verification code is sent, and no user record is created in Clerk or synced to the Convex database.

## 4. Constraints

- The blocking logic must run at the authentication/gateway layer (Clerk) before user creation.
- The list of disposable email domains should be automatically updated by Clerk to avoid manual maintenance overhead.
- The restrictions must apply globally to all email/password and email verification sign-ups.

## 5. Edge Cases and Error Handling

- **Third-Party OAuth Providers (e.g., Google, GitHub)**
  - Users signing up via OAuth do not typically use disposable emails. If they do, OAuth provider validation applies first.
- **Legitimate Domains Flagged as Disposable**
  - If a legitimate user's domain is falsely flagged, they will need to contact support or use a different well-known provider.
- **Subaddressing for Testing**
  - Subaddress blocking prevents developers/testers from creating multiple test accounts using `+` suffixes on their primary email. Testers must use unique email addresses.

## 6. Acceptance Criteria

This feature is considered complete if:

- The Clerk Dashboard is configured to enable "Block disposable email addresses".
- The Clerk Dashboard is configured to enable "Block email subaddresses".
- Attempting to sign up with a disposable email address (e.g., using `mailinator.com`) is blocked, and an error message is displayed.
- Attempting to sign up with a subaddress (e.g., `test+123@gmail.com`) is blocked, and an error message is displayed.
- Attempting to sign up with a standard Gmail address (e.g., `test@gmail.com`) is allowed to proceed to the verification step.

## 8. Relevant MCPs, Skills, and Tools

Model Context Protocols (MCPs)

- exa (web_search_exa): Utilized to look up Clerk's restriction capabilities and documentation for blocking disposable emails and subaddresses.

Core Architecture & Implementation Skills

- clerk-setup: Used to understand the Clerk dashboard settings, API behaviors, and restrictions.
- review: Used to verify settings and walkthrough steps.
