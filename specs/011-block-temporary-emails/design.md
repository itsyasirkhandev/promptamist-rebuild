# Block Temporary Emails Technical Design

## 1. Objective

Implement restriction settings within the Clerk authentication layer to automatically prevent users from signing up using disposable/temporary email addresses or email subaddresses (e.g., `user+spam@gmail.com`). This ensures only globally known, legitimate email domains are allowed to register, reducing spam and low-quality account creation.

## 2. Tech Stack

* **Clerk Authentication Platform**: Specifically Clerk's built-in **Restrictions** settings for sign-up validation.
* **Next.js & `@clerk/nextjs`**: Existing frontend integrations that render the `<SignUp />` component and automatically bubble up Clerk's validation error responses.

## 3. High-Level Architecture

```
User Attempting Sign-up
       │
       ▼ (Email: user@tempmail.com or user+sub@gmail.com)
┌───────────────────────────────────────────────┐
│              Clerk Edge API                   │
├───────────────────────────────────────────────┤
│ 1. Check disposable email block setting       │
│ 2. Check subaddress block setting             │
│ 3. Match against database of disposable hosts │
└──────────────────────┬────────────────────────┘
                       │
             ┌─────────┴─────────┐
             │                   │
    [Invalid Email]        [Valid Email]
             │                   │
             ▼                   ▼
    Reject Sign-up &        Create Clerk User &
    Return Validation Error   Trigger Convex Webhook
```

## 4. Configuration Instructions

To enable these restrictions, the application administrator must configure the Clerk project dashboard:

1. Log in to the [Clerk Dashboard](https://dashboard.clerk.com/).
2. Select the target project/application.
3. Navigate to **Configure** -> **User & authentication** -> **Restrictions**.
4. In the **Sign-ups** or **Restrictions** section:
   * **Block sign-ups that use a disposable email address**: Toggle this setting to **Enabled**.
   * **Block email subaddresses**: Toggle this setting to **Enabled** (if we want to prevent subaddressing spam).
5. Click **Save** to apply the changes globally.

## 5. Core Design Decisions

* **Clerk Dashboard Native Restriction vs. Code-based Validation**: 
  * *Decision*: Enabled native Clerk restrictions.
  * *Rationale*:
    1. **Pre-verification check**: Clerk validates the email *before* sending a verification code, which prevents wasting outbound email verification credits on spam attempts.
    2. **Zero Maintenance**: Clerk dynamically maintains and updates the database of disposable and temporary email hosts, avoiding the need for us to compile, update, and host a list of domains.
    3. **Standardized UI**: The pre-built `<SignUp />` component automatically formats and displays the Clerk restriction errors without requiring manual custom error handling or forms.

## 6. Core Functional Flows

_Flow: User Sign-Up Validation_

1. User enters `spam@10minutemail.com` on the sign-up page and submits.
2. Clerk's client SDK sends the sign-up request to the Clerk API.
3. Clerk's API evaluates the email address against its active restrictions:
   * Recognizes `10minutemail.com` as a disposable email domain.
4. The Clerk API rejects the request with a `400 Bad Request` or specific validation error code.
5. The `@clerk/nextjs` `<SignUp />` component receives the error and renders:
   * `"Disposable email addresses are not allowed."`
6. The flow stops, and no webhook event (`user.created`) is sent to the Convex backend.

## 7. Verification Plan

### Manual Verification Steps
1. Navigate to the sign-up page (e.g. `/sign-up`).
2. Attempt to sign up using a known disposable email domain (e.g., from `10minutemail.com`, `mailinator.com`, or another temporary provider).
3. Verify that the sign-up is blocked and an appropriate error message is displayed.
4. Attempt to sign up using a subaddress (e.g., `yourname+test@gmail.com`).
5. Verify that the sign-up is blocked and an appropriate error message is displayed.
6. Attempt to sign up using a standard email domain (e.g., `yourname@gmail.com`).
7. Verify that the sign-up is allowed to proceed to the email verification code page.
