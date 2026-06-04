# Block Temporary Emails Implementation Tasks

**Overview**
This implementation involves configuring the Clerk dashboard to enable native disposable email and subaddress blocking, and verifying the configuration works correctly.

## Phases

### Phase 1: Clerk Configuration

- [x] Configure Clerk Dashboard: Go to **User & authentication** -> **Restrictions** -> Enable **Block sign-ups that use a disposable email address**.
- [x] Configure Clerk Dashboard: Go to **User & authentication** -> **Restrictions** -> Enable **Block email subaddresses**.

### Phase 2: Verification & Testing

- [ ] Manual test: Try to sign up with a disposable email address (e.g. from `10minutemail.com`) and verify it is blocked with a validation error.
- [ ] Manual test: Try to sign up with a subaddress (e.g., `yourname+test@gmail.com`) and verify it is blocked with a validation error.
- [ ] Manual test: Try to sign up with a standard email (e.g., `yourname@gmail.com`) and verify it is allowed.
