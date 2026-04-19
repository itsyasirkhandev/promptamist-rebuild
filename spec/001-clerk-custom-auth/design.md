# **Design Plan: Custom Authentication System**

## Technical specification for implementing secure, custom sign-in/sign-up pages with Clerk authentication integrated with Convex backend for the Promptamist application.

---

## **1. Objective**

Implement a custom authentication system that allows users to:

- ✅ Sign in with email/password or social providers (Google, GitHub, etc.)
- ✅ Create new accounts with email verification support
- ✅ Seamlessly transition between sign-in and sign-up flows
- ✅ Maintain persistent sessions across page refreshes
- ✅ Access protected routes only when authenticated
- ✅ Integrate authentication state with Convex real-time backend
- ✅ Customize UI to match Promptamist's design system

**Frontend:** Next.js 16 (App Router) + React 19  
**Authentication:** Clerk v7  
**Backend:** Convex (Real-time Database)  
**Styling:** Tailwind CSS v4 + shadcn/ui

---

## **2. Tech Stack**

### **Core Technologies**

| Technology         | Version  | Purpose                              |
| ------------------ | -------- | ------------------------------------ |
| **Next.js**        | 16.2.4   | Full-stack framework with App Router |
| **React**          | 19.2.4   | UI library with concurrent features  |
| **@clerk/nextjs**  | ^7.2.3   | Authentication & user management     |
| **convex**         | ^1.35.1  | Real-time backend database           |
| **convex-helpers** | ^0.1.114 | Convex utilities (pagination, etc.)  |
| **TypeScript**     | ^5       | Type safety across stack             |
| **Tailwind CSS**   | v4       | Utility-first styling                |
| **shadcn/ui**      | ^4.3.0   | Component library                    |
| **Zod**            | ^4.3.6   | Schema validation                    |

### **Why This Stack?**

**Next.js 16** - Provides App Router with server components, file-based routing, and built-in middleware (now `proxy.ts`) perfect for route protection at the network boundary.

**Clerk v7** - Enterprise-grade auth solution handling passwords, social logins, sessions, MFA, and JWT issuance out-of-the-box. Reduces auth implementation from weeks to hours.

**Convex** - Real-time database with built-in auth integration via `ConvexProviderWithClerk`. Seamless JWT-based authentication between frontend and backend functions.

**React 19** - Concurrent features enable smooth loading states without blocking UI during auth checks.

**TypeScript** - Catches configuration errors at compile time; essential for complex auth setup with multiple environment variables and provider hierarchies.

---

## **3. High-Level Architecture**

The feature is divided into **four distinct layers of responsibility**:

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: PRESENTATION                     │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │   Sign-In Page   │  │   Sign-Up Page   │                   │
│  │   /sign-in      │  │   /sign-up       │                   │
│  │                 │  │                  │                   │
│  │  <SignIn />     │  │  <SignUp />     │                   │
│  │  (Clerk Comp)   │  │  (Clerk Comp)   │                   │
│  └────────┬────────┘  └────────┬────────┘                   │
│           └──────────┬─────────┘                            │
│                      ▼                                      │
│           ┌──────────────────┐                              │
│           │  Protected Pages │  ← Uses <Authenticated>      │
│           │  /prompts        │    <Unauthenticated>         │
│           │  /chat/*         │    useConvexAuth()            │
│           └──────────────────┘                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 2: STATE MANAGEMENT                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              app/layout.tsx                         │   │
│  │                                                     │   │
│  │   <ClerkProvider>                                   │   │
│  │     └─ <ConvexClientProvider>                       │   │
│  │           └─ <ConvexProviderWithClerk>              │   │
│  │                 ├─ useAuth() from @clerk/nextjs    │   │
│  │                 └─ ConvexReactClient               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  • Manages auth session state                               │
│  • Provides JWT tokens to Convex client                     │
│  • Handles token refresh automatically                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 3: ROUTE PROTECTION                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              proxy.ts (Next.js 16)                  │   │
│  │                                                     │   │
│  │   clerkMiddleware(async (auth, req) => {            │   │
│  │     if (!isPublicRoute(req)) {                      │   │
│  │       await auth.protect()                          │   │
│  │     }                                               │   │
│  │   })                                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  • Intercepts ALL requests before routes                   │
│  • Validates Clerk session cookies/tokens                  │
│  • Redirects unauthenticated users → /sign-in             │
│  • Allows public routes: /, /sign-in/*, /sign-up/*        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              LAYER 4: BACKEND AUTHENTICATION                 │
│  ┌──────────────────┐    ┌──────────────────────────┐       │
│  │   CLERK SERVERS  │    │     CONVEX BACKEND       │       │
│  │                  │    │                          │       │
│  │  • User DB       │───▶│  • Auth Config           │       │
│  │  • Sessions      │ JWT│  • Validate Tokens       │       │
│  │  • JWT Issuance  │    │  • ctx.auth.getUserIdentity()│   │
│  │  • MFA/SSO       │    │  • Enforce Rules          │       │
│  └──────────────────┘    └──────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### **ARCHITECTURE FLOW**

```
USER ACTION          FRONTEND              PROXY.TS           CLERK          CONVEX
    │                   │                    │                 │              │
    │ Visit /prompts    │                    │                 │              │
    │──────────────────▶│                    │                 │              │
    │                   │                    │                 │              │
    │                   │  ◀─── INTERCEPT ───│                 │              │
    │                   │     Request        │                 │              │
    │                   │                    │                 │              │
    │                   │                    ├── Check Session ─▶│              │
    │                   │                    │   Cookie/Token   │  Validate    │
    │                   │                    │                 │              │
    │                   │     No Session     │◀── Invalid ─────│              │
    │                   │  ◀─── REDIRECT ────│                 │              │
    │◀── /sign-in?redirect_url=/prompts     │                 │              │
    │                   │                    │                 │              │
    │ Enter Credentials │                    │                 │              │
    │──────────────────▶│                    │                 │              │
    │                   │                    │                 │              │
    │                   │                    │   Authenticate ─▶│              │
    │                   │                    │   Credentials    │  Create      │
    │                   │                    │                 │  Session     │
    │                   │                    │                 │  Issue JWT   │
    │                   │                    │◀── Success/JWT ──│              │
    │                   │  ◀─── SUCCESS ─────│                 │              │
    │◀── Set Session Cookie                  │                 │              │
    │                   │                    │                 │              │
    │ Redirect to /     │                    │                 │              │
    │ prompts           │                    │                 │              │
    │──────────────────▶│                    │                 │              │
    │                   │                    │                 │              │
    │                   │                    ├── Check Session ─▶│              │
    │                   │                    │   Valid Cookie   │  Validate    │
    │                   │                    │                 │  ✓ Pass      │
    │                   │  ◀─── ALLOW ──────│                 │              │
    │                   │                    │                 │              │
    │ Render Prompts    │                    │                 │              │
    │                   │                    │                 │              │
    │ Load Convex Data  │                    │                 │              │
    │─────────────────────────────────────────────────────────▶│              │
    │                   │                    │                 │  Attach JWT  │
    │                   │                    │                 │  Verify Sig  │
    │                   │                    │                 │  Return Data │
    │◀─────────────────────────────────────────────────────────│              │
    │                   │                    │                 │              │
```

---

## **4. Data Model**

### **4.1 Authentication Data Flow**

While Clerk manages users and sessions internally, we need to mirror essential user data in Convex for our application logic:

**CONVEX SCHEMA (TypeScript)**

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Users table - mirrors Clerk user data for app-specific needs
  users: defineTable({
    clerkId: v.string(), // Clerk user ID (subject from JWT)
    email: v.string(), // User's email
    name: v.optional(v.string()), // Display name
    imageUrl: v.optional(v.string()), // Profile picture URL
    createdAt: v.number(), // Timestamp (Date.now())
    updatedAt: v.number(), // Last updated timestamp

    // App-specific fields
    subscriptionTier: v.optional(v.string()), // "free", "pro", "enterprise"
    preferences: v.optional(
      // JSON-like user preferences
      v.object({
        theme: v.optional(v.string()), // "light", "dark", "system"
        notificationsEnabled: v.boolean(),
      }),
    ),
  })
    .index('by_clerkId', ['clerkId']) // Fast lookups by Clerk ID
    .index('by_email', ['email']), // Unique email queries

  // Example: Chat history table (for your sidebar feature)
  chats: defineTable({
    userId: v.id('users'), // Foreign key to users table
    title: v.string(), // Chat title
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId']) // Get all chats for a user
    .index('by_userId_updated', ['userId', 'updatedAt']), // Sorted retrieval

  messages: defineTable({
    chatId: v.id('chats'), // Foreign key to chats table
    role: v.union(
      // Message role
      v.literal('user'),
      v.literal('assistant'),
      v.literal('system'),
    ),
    content: v.string(), // Message text
    createdAt: v.number(),
  }).index('by_chatId', ['chatId']), // Get messages for a chat
});
```

### **4.2 Clerk User Object Structure**

When Convex authenticates via Clerk JWT, this is what `ctx.auth.getUserIdentity()` returns:

```typescript
// Shape of identity object available in Convex functions
interface UserIdentity {
  subject: string; // Unique Clerk user ID (e.g., "user_2p345...")
  issuer: string; // Always "https://clerk.com" or custom domain
  tokenIdentifier: string; // Token identifier string
  name?: string; // Full name (if provided)
  givenName?: string; // First name
  familyName?: string; // Last name
  nickname?: string; // Username/nickname
  email?: string; // Primary email
  emailVerified?: boolean; // Whether email is verified
  imageUrl?: string; // Profile picture URL
  publicKey?: string; // Public key (for end-to-end encryption)

  // Custom claims (if configured in Clerk Dashboard)
  // e.g., metadata.orgId, metadata.role, etc.
}
```

### **4.3 Environment Variables Schema**

```typescript
// types/env.d.ts (for TypeScript IntelliSense)

interface ImportMetaEnv {
  // Clerk Authentication (PUBLIC - exposed to browser)
  readonly NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  readonly NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
  readonly NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
  readonly NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string;
  readonly NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: string;
  readonly NEXT_PUBLIC_CONVEX_URL: string;

  // Clerk Secrets (SERVER-SIDE ONLY - never exposed to browser)
  readonly CLERK_SECRET_KEY: string;
  readonly CLERK_FRONTEND_API_URL: string;

  // Convex
  readonly CONVEX_DEPLOY_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## **5. Core Design Decisions**

### **Decision 1: Use Clerk Prebuilt Components vs. Custom Forms**

**Choice:** Use Clerk's `<SignIn />` and `<SignUp />` prebuilt components with appearance customization

**Why:**

- ✅ **Security**: Clerk handles password hashing, MFA, brute-force protection, session management
- ✅ **Speed**: Implement in hours vs. weeks for custom auth forms
- ✅ **Maintenance**: Clerk updates security patches automatically
- ✅ **Features**: Social login, magic links, TOTP, passkeys included free
- ✅ **Compliance**: SOC2, GDPR, HIPAA-ready out of box

**Trade-off:** Less control over exact form markup, but `appearance` prop provides sufficient styling flexibility for 95% of use cases.

**When to override:** Only if you need completely custom UX (e.g., multi-step onboarding wizard). In that case, use Clerk Elements (`@clerk/elements`).

---

### **Decision 2: Separate Sign-In and Sign-Up Pages vs. Combined Flow**

**Choice:** Separate `/sign-in` and `/sign-up` pages with toggle links

**Why:**

- ✅ **Clear UX**: Users know exactly which action they're performing
- ✅ **SEO**: Each page has distinct metadata and purpose
- ✅ **Analytics**: Track conversion funnels separately
- ✅ **Flexibility**: Can add different features to each page (e.g., SSO options on sign-in only)

**Alternative considered:** Single `/auth` page with tabs. Rejected because Clerk's components already handle the toggle internally via footer links, making separate pages cleaner.

---

### **Decision 3: Route Protection via proxy.ts vs. Client-Side Checks**

**Choice:** Server-side protection using Next.js 16's `proxy.ts` (formerly middleware.ts)

**Why:**

- ✅ **Security**: Runs before any client code executes; no flash of protected content
- ✅ **Performance**: Redirects happen at edge/network layer, not after hydration
- ✅ **Reliability**: Works even if JavaScript fails/disabled
- ✅ **SEO**: Search bots see redirects, not login walls

**Implementation:**

```typescript
// proxy.ts - Network boundary protection
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect(); // Redirects to NEXT_PUBLIC_CLERK_SIGN_IN_URL
  }
});
```

**Supplement with client-side guards** for better UX (show sign-in button instead of blank screen):

```tsx
// Client-side conditional rendering
<Authenticated>
  <Dashboard />
</Authenticated>
<Unauthenticated>
  <SignInButton />
</Unauthenticated>
```

---

### **Decision 4: ConvexProviderWithClerk vs. Manual Token Management**

**Choice:** Use `ConvexProviderWithClerk` wrapper component

**Why:**

- ✅ **Automatic**: Handles JWT fetching, refresh, and attachment to requests
- ✅ **Type-safe**: Properly typed hooks (`useConvexAuth()`)
- ✅ **Integrated**: Works seamlessly with Clerk's `useAuth()` hook
- ✅ **Battle-tested**: Official integration maintained by both Clerk and Convex teams

**Manual approach rejected:** Would require manually calling `fetchToken()` from Clerk and passing to `ConvexReactClient.setAuth()`. Error-prone and harder to maintain.

---

### **Decision 5: Store User Data in Convex vs. Rely Solely on Clerk API**

**Choice:** Mirror essential user data in Convex database

**Why:**

- ✅ **Performance**: No extra HTTP calls to Clerk API during queries
- ✅ **Offline Support**: Convex can serve cached data during brief outages
- ✅ **Joins/Relations**: Can join users with chats, messages, etc. in single query
- ✅ **Custom Fields**: Add app-specific fields (subscription tier, preferences) not in Clerk
- ✅ **Real-time Updates**: Subscribe to user changes reactively

**Sync strategy:** Use Clerk Webhooks to keep Convex in sync, or upsert on each authenticated request.

---

## **6. Core Functional Flows**

### **Flow A: Initial Application Load (Cold Start)**

```
TRIGGER: User opens https://promptamist.app

SEQUENCE DIAGRAM:

Browser              Next.js (Server)         proxy.ts           Clerk
  │                        │                    │                 │
  │  GET /                 │                    │                 │
  │───────────────────────▶│                    │                 │
  │                        │                    │                 │
  │                        │  ◀─── INTERCEPT ──│                 │
  │                        │     (public route) │                 │
  │                        │  ◀─── ALLOW ──────│                 │
  │                        │                    │                 │
  │  HTML Response         │                    │                 │
  │◀───────────────────────│                    │                 │
  │                        │                    │                 │
  │  [Render HTML]         │                    │                 │
  │  [Load JS/CSS]         │                    │                 │
  │  [Hydrate React]       │                    │                 │
  │                        │                    │                 │
  │  [ClerkProvider Mount] │                    │                 │
  │  [Check Session Cookie]│────────────────────────────────────▶│
  │                        │                    │                 │
  │                        │                    │          [Validate]
  │                        │                    │          [Return Session]
  │                        │◀────────────────────────────────────│
  │  [Session Valid?]      │                    │                 │
  │                        │                    │                 │
  │  IF YES:               │                    │                 │
  │  └─ isAuthenticated=true│                   │                 │
  │  └─ Fetch Convex JWT   │────────────────────────────────────▶│
  │  │                     │                    │          [Issue JWT]
  │  │◀──────────────────────────────────────────────────────────│
  │  └─ Connect to Convex  │                    │                 │
  │  └─ Render <Authenticated> content          │                 │
  │                        │                    │                 │
  │  IF NO:                │                    │                 │
  │  └─ isAuthenticated=false│                  │                 │
  │  └─ Render <Unauthenticated> content        │                 │
  │  └─ Show landing/CTA   │                    │                 │
```

**CODE IMPLEMENTATION:**

```tsx
// app/page.tsx (Landing/Home page)
'use client';

import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="border-border border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Promptamist
          </Link>

          <div className="flex items-center gap-4">
            <Authenticated>
              <Link href="/prompts" className="btn btn-ghost">
                Prompts
              </Link>
              <UserButton afterSignOutUrl="/" />
            </Authenticated>

            <Unauthenticated>
              <div className="flex gap-2">
                <Link href="/sign-in" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            </Unauthenticated>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <AuthLoading>
          <div className="flex justify-center py-20">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        </AuthLoading>

        <Authenticated>
          <section className="py-20 text-center">
            <h1 className="mb-4 text-4xl font-bold">
              Welcome back to Promptamist!
            </h1>
            <p className="text-muted-foreground mb-8">
              Continue managing your AI prompts
            </p>
            <Link href="/prompts" className="btn btn-lg btn-primary">
              Go to Prompts →
            </Link>
          </section>
        </Authenticated>

        <Unauthenticated>
          <section className="py-20 text-center">
            <h1 className="mb-6 text-5xl font-bold">
              AI-Powered Prompt Management
            </h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
              Organize, test, and optimize your AI prompts with our intelligent
              platform built for power users.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/sign-up" className="btn btn-lg btn-primary">
                Start Free Trial
              </Link>
              <Link href="/sign-in" className="btn btn-lg btn-outline">
                Sign In
              </Link>
            </div>
          </section>
        </Unauthenticated>
      </main>
    </div>
  );
}
```

---

### **Flow B: User Sign-In Process**

```
TRIGGER: User navigates to /sign-in or clicks "Sign In" button

PRECONDITIONS:
- User has existing account (or will click "Sign Up" link)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is configured
- Clerk SignIn component is mounted

STEPS:

1. RENDER SIGN-IN PAGE
   ┌──────────────────────────────────────────┐
   │  app/sign-in/[[...sign-in]]/page.tsx     │
   │                                          │
   │  <div className="min-h-screen flex...">  │
   │    <SignIn                               │
   │      appearance={{ ...custom styles }}   │
   │    />                                    │
   │  </div>                                  │
   └──────────────────────────────────────────┘

2. USER ENTERS CREDENTIALS
   ┌─────────────────────────────────────┐
   │  ┌─────────────────────────────┐   │
   │  │  📧 Email                    │   │
   │  │  ┌─────────────────────┐    │   │
   │  │  │ user@example.com    │    │   │
   │  │  └─────────────────────┘    │   │
   │  │                             │   │
   │  │  🔒 Password                │   │
   │  │  ┌─────────────────────┐    │   │
   │  │  │ •••••••••           │    │   │
   │  │  └─────────────────────┘    │   │
   │  │                             │   │
   │  │  [ Continue → ]             │   │
   │  │                             │   │
   │  │  ── or continue with ──     │   │
   │  │  [ G ] [ GitHub ]           │   │
   │  │                             │   │
   │  │  Don't have an account?     │   │
   │  │  Sign up →                 │   │
   │  └─────────────────────────────┘   │
   └─────────────────────────────────────┘

3. VALIDATE & AUTHENTICATE (handled by Clerk)

   Browser                    Clerk API
     │                             │
     │  POST /v1/client/sign_ins   │
     │────────────────────────────▶│
     │  {                          │
     │    "identifier": "email",   │
     │    "password": "..."        │
     │  }                          │
     │                             │
     │                    [Validate credentials]
     │                    [Check password hash]
     │                    [Verify email confirmed]
     │                    [Check MFA requirements]
     │                             │
     │  ◀── Success Response ──────│
     │  {                          │
     │    "status": "complete",    │
     │    "created_session_id":    │
     │      "sess_abc123...",      │
     │    "user_id": "user_xyz..." │
     │  }                          │
     │                             │

4. SET SESSION & REDIRECT

   Browser sets:
   - __session cookie (HttpOnly, Secure, SameSite=Strict)
   - __client_uat cookie (timestamp)

   Then redirects to:
   - redirect_url param (if present in ?redirect_url=...)
   - Or NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL (/prompts)
   - Or last visited protected route

5. POST-AUTHENTICATION STATE

   ┌──────────────────────────────────────┐
   │  useConvexAuth() returns:            │
   │  {                                  │
   │    isLoading: false,                 │
   │    isAuthenticated: true,           │
   │  }                                  │
   │                                      │
   │  ctx.auth.getUserIdentity():         │
   │  {                                  │
   │    subject: "user_2p345...",         │
   │    email: "user@example.com",       │
   │    name: "John Doe",                │
   │    ...                              │
   │  }                                  │
   └──────────────────────────────────────┘
```

**ERROR HANDLING:**

```typescript
// Error scenarios handled by Clerk automatically:

const errorStates = {
  // Form validation errors (shown inline)
  form_identifier_invalid: 'Invalid email format',
  form_password_invalid: 'Password must be at least 8 characters',

  // Authentication failures
  form_password_incorrect: 'Password is incorrect',
  form_identifier_not_found: 'No account found with this email',

  // Account status issues
  email_not_verified: 'Please verify your email first. Resend?',
  account_disabled: 'This account has been disabled. Contact support.',

  // Rate limiting
  rate_limit_exceeded: 'Too many attempts. Try again in 60 seconds.',

  // Network errors
  network_error: 'Network error. Please check your connection.',
};
```

---

### **Flow C: User Sign-Up Process**

```
TRIGGER: User navigates to /sign-up or clicks "Sign Up" link

PRECONDITIONS:
- User wants new account
- Email/password sign-up enabled in Clerk Dashboard
- (Optional) Email verification required

STEPS:

1. RENDER SIGN-UP PAGE
   ┌──────────────────────────────────────────┐
   │  app/sign-up/[[...sign-up]]/page.tsx     │
   │                                          │
   │  <SignUp                                │
   │    appearance={{ ... }}                  │
   │    // Optional: Force redirect URL      │
   │    forceRedirectUrl="/prompts"           │
   │  />                                     │
   └──────────────────────────────────────────┘

2. USER FILLS REGISTRATION FORM
   ┌─────────────────────────────────────┐
   │  ┌─────────────────────────────┐   │
   │  │  Create your account        │   │
   │  │                             │   │
   │  │  📧 Email                    │   │
   │  │  ┌─────────────────────┐    │   │
   │  │  │ new@example.com    │    │   │
   │  │  └─────────────────────┘    │   │
   │  │                             │   │
   │  │  🔒 Password                 │   │
   │  │  ┌─────────────────────┐    │   │
   │  │  │ •••••••••           │    │   │
   │  │  └─────────────────────┘    │   │
   │  │                             │   │
   │  │  🔒 Confirm Password        │   │
   │  │  ┌─────────────────────┐    │   │
   │  │  │ •••••••••           │    │   │
   │  │  └─────────────────────┘    │   │
   │  │                             │   │
   │  │  ☑️ I agree to Terms        │   │
   │  │                             │   │
   │  │  [ Create Account → ]       │   │
   │  │                             │   │
   │  │  ── or sign up with ──      │   │
   │  │  [ G ] [ GitHub ]           │   │
   │  │                             │   │
   │  │  Already have an account?   │   │
   │  │  Sign in →                 │   │
   │  └─────────────────────────────┘   │
   └─────────────────────────────────────┘

3. VALIDATE & CREATE ACCOUNT (Clerk handles)

   VALIDATIONS PERFORMED:
   ✅ Email format valid
   ✅ Password meets complexity rules (length, chars, etc.)
   ✅ Password matches confirmation
   ✅ Email not already registered
   ✅ Terms checkbox checked (if required)
   ✅ Bot detection (invisible CAPTCHA)

   ACTIONS PERFORMED:
   📝 Hash password (bcrypt/argon2)
   👤 Create user record in Clerk DB
   📧 Send verification email (if enabled)
   🍪 Create session (auto-signin after signup)
   📊 Emit analytics event

4. OPTIONAL: EMAIL VERIFICATION FLOW

   If email verification REQUIRED in Clerk Dashboard:

   ┌─────────────────────────────────────┐
   │  ✉️ Check your email!               │
   │                                     │
   │  We've sent a verification link to: │
   │  new@example.com                   │
   │                                     │
   │  [ Resend email ]  [ Change email ] │
   └─────────────────────────────────────┘

   User clicks link → Verified → Redirected to fallback URL

5. POST-SIGNUP HOOKS (Optional but Recommended)

   Use Clerk Webhooks to trigger actions:

   ENDPOINT: /api/webhooks/clerk

   EVENT: user.created

   PAYLOAD:
   {
     "type": "event",
     "data": {
       "id": "evt_abc123",
       "object": "event",
       "created_at": 1707891234,
       "type": "user.created",
       "data": {
         "id": "user_new123",
         "email_addresses": [...],
         "first_name": "Jane",
         "last_name": "Doe",
         "image_url": "...",
         "created_at": 1707891234,
         ...
       }
     }
   }

   YOUR HANDLER (app/api/webhooks/clerk/route.ts):

   - Upsert user into Convex users table
   - Initialize default settings/preferences
   - Send welcome email (via SendGrid/Resend/etc.)
   - Create trial subscription record
   - Add to onboarding email sequence

6. REDIRECT AFTER SUCCESS

   Priority order:
   1. forceRedirectUrl prop (if set on <SignUp />)
   2. redirect_url query parameter
   3. NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL env var
   4. Default: /prompts
```

**WEBHOOK IMPLEMENTATION EXAMPLE:**

```typescript
// app/api/webhooks/clerk/route.ts
import { WebhookEvent } from '@clerk/nextjs/server';
import { httpRouter } from 'convex/server';
import { api } from '../../../convex/_generated/api';
import { convex } from '../../../convex/_generated';

// Verify webhook signature (CRITICAL for security)
async function validateWebhook(request: Request): Promise<WebhookEvent> {
  const payload = await request.text();
  const svixHeaders = {
    'svix-id': request.headers.get('svix-id')!,
    'svix-timestamp': request.headers.get('svix-timestamp')!,
    'svix-signature': request.headers.get('svix-signature')!,
  };

  // Use Clerk's built-in webhook validation
  const evt = await WebhookEvent.create(payload, svixHeaders);
  return evt;
}

export async function POST(request: Request) {
  try {
    const evt = await validateWebhook(request);

    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;

      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;

      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;

      default:
        console.log(`Unhandled event type: ${evt.type}`);
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}

async function handleUserCreated(data: any) {
  const email = data.email_addresses?.[0]?.email_address;
  const name =
    [data.first_name, data.last_name].filter(Boolean).join(' ') || undefined;

  // Call Convex mutation to create user
  await convex.mutation(api.users.upsertFromClerk, {
    clerkId: data.id,
    email: email || '',
    name: name,
    imageUrl: data.image_url,
  });

  console.log(`✅ Created user in Convex: ${data.id}`);
}
```

---

### **Flow D: Protected Route Access Control**

```
SCENARIO: Authenticated user accesses /prompts

LAYER 1: NETWORK BOUNDARY (proxy.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Request arrives at Next.js server
         │
         ▼
proxy.ts intercepts
         │
         ▼
clerkMiddleware() runs
         │
         ├─ Extract session cookie from request headers
         │
         ▼
Check: Is /prompts in publicRoutes array?
         │
         └─ NO → Proceed with auth check

         ▼
Call auth.protect()
         │
         ├─ Validate session token with Clerk
         │
         ├─ IF VALID:
         │   └─ Allow request to proceed → Next.js handler
         │
         └─ IF INVALID/MISSING:
             └─ Redirect response (302)
                 Location: /sign-in?redirect_url=%2Fprompts


LAYER 2: CLIENT-SIDE GUARDS (React Components)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Page component renders
         │
         ▼
<AuthLoading> shown initially
(useConvexAuth().isLoading === true)
         │
         ▼
Auth state resolved
         │
         ├─ isAuthenticated: true
         │   └─ Render <Authenticated> children
         │       └─ <PromptsContent />
         │
         └─ isAuthenticated: false
             └─ Render <Unauthenticated> children
                 └─ <SignInButton mode="redirect" />
                     └─ Redirects to /sign-in


LAYER 3: BACKEND ENFORCEMENT (Convex Functions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Prompts calls Convex query
         │
         ▼
api.prompts.getPrompts
         │
         ▼
Convex function executes
         │
         ▼
const identity = await ctx.auth.getUserIdentity()
         │
         ├─ IF identity exists:
         │   └─ Proceed with data fetch
         │       return { ... }
         │
         └─ IF identity is null:
             └─ throw new Error("Unauthorized")
                 └─ Client receives 401/403
                     └─ Show error or redirect
```

**CODE IMPLEMENTATION:**

```typescript
// convex/prompts.ts
import { query } from './_generated/server';

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    // CRITICAL: Always verify authentication
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // Option A: Throw error (client shows error boundary)
      throw new Error('Unauthorized');

      // Option B: Return null (client checks for null)
      // return null
    }

    // Safe to access user-specific data now
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      // User exists in Clerk but not yet synced to Convex
      // Could auto-create here, or require webhook sync
      throw new Error('User profile not found');
    }

    // Fetch stats
    const chatsCount = await ctx.db
      .query('chats')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect()
      .then((chats) => chats.length);

    const messagesCount = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('chatId') /* would need join */))
      .collect()
      .then((msgs) => msgs.length); // Simplified; use aggregation in production

    return {
      userId: user._id,
      chatsCount,
      messagesCount,
      memberSince: user.createdAt,
      subscriptionTier: user.subscriptionTier || 'free',
    };
  },
});
```

---

## **7. Development Plan**

### **Phase 1: Foundation Setup (Day 1)**

#### **Task 1.1: Environment Configuration**

**Goal:** Configure all required environment variables

**Files Modified:**

- `.env.local` (create from template)

**Steps:**

1. Copy environment variable template from Section 4.3
2. Obtain values from:
   - Clerk Dashboard → API Keys
   - Convex Dashboard → Settings
   - Clerk Dashboard → Integrations → Convex (Frontend API URL)
3. Fill in all values
4. Add `.env.local` to `.gitignore`
5. Create `.env.example` with placeholder values (commit this)

**Validation:**

```bash
# Test that variables are accessible
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY
echo $NEXT_PUBLIC_CONVEX_URL
```

**Acceptance Criteria:**

- [ ] All 10+ environment variables defined
- [ ] No values committed to git
- [ ] Template exists for team members

---

#### **Task 1.2: Proxy Configuration**

**Goal:** Set up route protection at network boundary

**File Created:** `proxy.ts` (project root)

**Implementation:**

```typescript
// See Section 4.3 Code Block B for full implementation
```

**Key Decisions:**

- Protect all routes by default
- Whitelist public routes explicitly
- Include `/`, `/sign-in(.*)`, `/sign-up(.*)` as public
- Add `/api/webhooks(.*)` if using webhooks later

**Acceptance Criteria:**

- [ ] File exists at project root (not src/)
- [ ] Named `proxy.ts` NOT `middleware.ts` (Next.js 16!)
- [ ] Public routes array includes auth pages
- [ ] Matcher config excludes static assets
- [ ] TypeScript compiles without errors

---

#### **Task 1.3: Convex Authentication Configuration**

**Goal:** Enable Clerk JWT validation in Convex backend

**File Created:** `convex/auth.config.ts`

**Implementation:**

```typescript
// See Section 4.3 Code Block D for full implementation
```

**Steps:**

1. Create `convex/auth.config.ts` with domain config
2. Ensure `CLERK_FRONTEND_API_URL` is set in `.env.local`
3. Run `npx convex dev` to sync config
4. Verify terminal output shows successful deployment

**Acceptance Criteria:**

- [ ] `auth.config.ts` references `process.env.CLERK_FRONTEND_API_URL`
- [ ] Provider domain matches Clerk Dashboard exactly
- [ ] `npx convex dev` completes without errors
- [ ] Convex dashboard shows auth config updated

---

### **Phase 2: Provider Integration (Day 1-2)**

#### **Task 2.1: Convex Client Provider Wrapper**

**Goal:** Create reusable component combining Convex + Clerk contexts

**File Created:** `components/ConvexClientProvider.tsx`

**Implementation:**

```typescript
// See Section 4.3 Code Block E for full implementation
```

**Key Points:**

- Must be `'use client'` component (uses hooks)
- Creates singleton `ConvexReactClient` instance
- Wraps children in `<ConvexProviderWithClerk>`
- Passes `useAuth` hook from Clerk
- Validates `NEXT_PUBLIC_CONVEX_URL` on import

**Acceptance Criteria:**

- [ ] Component is client-side ('use client' directive)
- [ ] Exports default function accepting `{ children }` prop
- [ ] Throws clear error if env var missing
- [ ] TypeScript types are correct (ReactNode for children)

---

#### **Task 2.2: Root Layout Integration**

**Goal:** Wire up providers in correct order

**File Modified:** `app/layout.tsx`

**Implementation:**

```typescript
// See Section 4.3 Code Block F for full implementation
```

**CRITICAL ORDER:**

```
<html>
  <body>
    <ClerkProvider>           ← OUTER (provides auth context)
      <ConvexClientProvider>  ← INNER (consumes auth context)
        {children}            ← Your app
      </ConvexClientProvider>
    </ClerkProvider>
  </body>
</html>
```

**Acceptance Criteria:**

- [ ] `<ClerkProvider>` wraps `<ConvexClientProvider>`
- [ ] Optional: Global `appearance` prop for consistent styling
- [ ] Layout still renders without errors
- [ ] Font imports preserved (Geist, etc.)

---

### **Phase 3: Authentication Pages (Day 2-3)**

#### **Task 3.1: Custom Sign-In Page**

**Goal:** Create branded sign-in page at `/sign-in`

**Directory Created:** `app/sign-in/[[...sign-in]]/`
**File Created:** `app/sign-in/[[...sign-in]]/page.tsx`

**Implementation:**

```typescript
// See Section 4.3 Code Block B for full implementation
```

**Customization Options:**

- Layout: Centered card, max-width container
- Header: Custom title/description above `<SignIn />`
- Appearance: Match shadcn/ui color scheme
- Optional: Logo, branding elements

**Acceptance Criteria:**

- [ ] Page renders at `/sign-in`
- [ ] Also works at `/sign-in/foo/bar` (catch-all route)
- [ ] Shows Clerk SignIn component
- [ ] Styled consistently with app theme
- [ ] Has proper SEO metadata (title, description)
- [ ] Responsive on mobile/tablet/desktop

---

#### **Task 3.2: Custom Sign-Up Page**

**Goal:** Create branded sign-up page at `/sign-up`

**Directory Created:** `app/sign-up/[[...sign-up]]/`
**File Created:** `app/sign-up/[[...sign-up]]/page.tsx`

**Implementation:**

```typescript
// See Section 4.3 Code Block C for full implementation
```

**Differences from Sign-In:**

- Uses `<SignUp />` component instead of `<SignIn />`
- Different heading ("Create an account")
- Different meta description
- May have additional fields (name, username) depending on Clerk config

**Acceptance Criteria:**

- [ ] Page renders at `/sign-up`
- [ ] Catch-all route works correctly
- [ ] Shows Clerk SignUp component
- [ ] Styling matches sign-in page
- [ ] Toggle link to sign-in works
- [ ] Metadata is unique

---

#### **Task 3.3: Appearance Theme Configuration**

**Goal:** Define consistent styling for all Clerk components

**Approach:** Create shared appearance config (optional utility)

**File Created (optional):** `lib/clerk-appearance.ts`

```typescript
// lib/clerk-appearance.ts
import type { Appearance } from '@clerk/types';

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: 'hsl(var(--primary))',
    colorBackground: 'hsl(var(--background))',
    colorInputBackground: 'hsl(var(--background))',
    colorInputText: 'hsl(var(--foreground))',
    fontFamily: 'var(--font-geist-sans), sans-serif',
  },
  elements: {
    formButtonPrimary:
      'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
    formFieldInput: 'border-input rounded-md px-3 py-2 text-sm',
    card: 'shadow-lg border-border rounded-lg',
    headerTitle: 'text-foreground font-semibold',
    headerSubtitle: 'text-muted-foreground text-sm',
    socialButtonsBlockButton: 'border-input hover:bg-accent',
    footerActionLink: 'text-primary hover:text-primary/80 text-sm font-medium',
    formFieldLabel: 'text-foreground text-sm font-medium',
    formResendCodeLink: 'text-primary hover:text-primary/80 text-sm',
    alertBox: 'border-destructive bg-destructive/10 text-destructive',
  },
};

// Export for reuse in SignIn, SignUp, UserButton, etc.
export default clerkAppearance;
```

**Usage:**

```tsx
import { clerkAppearance } from '@/lib/clerk-appearance'

<SignIn appearance={clerkAppearance} />
<SignUp appearance={clerkAppearance} />

// Or globally in ClerkProvider:
<ClerkProvider appearance={clerkAppearance}>
```

**Acceptance Criteria:**

- [ ] Colors match CSS variables (--primary, --background, etc.)
- [ ] Typography uses Geist font
- [ ] Border radius matches shadcn defaults
- [ ] Hover/focus states work properly
- [ ] Dark mode compatible (uses CSS variables)

---

### **Phase 4: Protected Routes & Auth State (Day 3-4)**

#### **Task 4.1: Update Home Page with Auth States**

**Goal:** Show different content based on authentication status

**File Modified:** `app/page.tsx`

**Implementation:**

```tsx
// See Flow A code example for full implementation
```

**Components Used:**

- `<Authenticated>` from `convex/react`
- `<Unauthenticated>` from `convex/react`
- `<AuthLoading>` from `convex/react`
- `<SignInButton>` from `@clerk/nextjs`
- `<UserButton>` from `@clerk/nextjs`

**Acceptance Criteria:**

- [ ] Loading spinner shown while checking auth
- [ ] Authenticated users see prompts CTA
- [ ] Unauthenticated users see marketing content + sign-up buttons
- [ ] User avatar/menu appears when signed in
- [ ] No layout shift when state changes

---

#### **Task 4.2: Create Protected Prompts Page**

**Goal:** Build example protected route

**Directory Created:** `app/(protected)/prompts/`
**File Created:** `app/(protected)/prompts/page.tsx`

**Features:**

- Shows user info from Convex
- Displays sample stats (chats count, etc.)
- Demonstrates auth guard pattern
- Includes navigation to other protected areas

**Implementation:**

```tsx
// See Section 4.3 Code Block G for full implementation
```

**Acceptance Criteria:**

- [ ] Redirects unauthenticated users to /sign-in
- [ ] Shows loading state during auth check
- [ ] Displays user data when authenticated
- [ ] Has proper error boundaries
- [ ] Responsive layout

---

#### **Task 4.3: Implement Convex User Functions**

**Goal:** Create backend functions for user data management

**File Created:** `convex/users.ts`

**Functions:**

```typescript
// 1. Get current user profile
export const getCurrentUser = query({ ... })

// 2. Upsert user from Clerk webhook
export const upsertFromClerk = mutation({ ... })

// 3. Update user preferences
export const updatePreferences = mutation({ ... })

// 4. Delete user account (GDPR)
export const deleteUser = mutation({ ... })
```

**Implementation:**

```typescript
// See Section 4.3 Code Block H for examples
```

**Acceptance Criteria:**

- [ ] All functions verify auth via `ctx.auth.getUserIdentity()`
- [ ] Queries return typed data matching schema
- [ ] Mutations handle edge cases (duplicate emails, missing fields)
- [ ] Error messages are descriptive
- [ ] Indexes used for efficient lookups

---

### **Phase 5: Polish & Edge Cases (Day 4-5)**

#### **Task 5.1: Error Handling & Loading States**

**Goal:** Handle all authentication edge cases gracefully

**Scenarios to Handle:**

| Scenario             | Component       | Behavior                                          |
| -------------------- | --------------- | ------------------------------------------------- |
| Network offline      | Sign-In/Up      | Show retry button; cache-friendly message         |
| Slow auth check      | Any page        | Show skeleton/spinner; don't flash content        |
| Expired session      | Protected route | Redirect to sign-in; show "Session expired" toast |
| Clerk service down   | Any page        | Show friendly error; retry mechanism              |
| Invalid credentials  | Sign-In         | Inline error below input field                    |
| Email already exists | Sign-Up         | Inline error; suggest sign-in link                |
| Weak password        | Sign-Up         | Show requirements inline                          |
| Rate limited         | Sign-In/Up      | Countdown timer; "Try again in X seconds"         |

**Implementation Patterns:**

```tsx
// Example: Error boundary for auth failures
// components/AuthErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="text-destructive mb-4 h-12 w-12" />
            <h2 className="mb-2 text-xl font-semibold">Authentication Error</h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              {this.state.error?.message ||
                'Something went wrong with authentication.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

**Acceptance Criteria:**

- [ ] All error scenarios handled (see table above)
- [ ] Error messages are user-friendly (no stack traces)
- [ ] Recovery actions available (retry, sign-out, contact support)
- [ ] No infinite loops or cascading failures
- [ ] Console logs errors for debugging (but not sensitive data)

---

#### **Task 5.2: Accessibility & Keyboard Navigation**

**Goal:** Ensure WCAG 2.1 AA compliance for auth pages

**Checks:**

- [ ] All interactive elements focusable via Tab key
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals (if any)
- [ ] Focus trapped in auth forms
- [ ] Error announcements via aria-live regions
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Screen reader labels on all inputs
- [ ] Skip-to-content link available

**Implementation:**

```tsx
// Example: Enhanced accessibility for sign-in page
<div role="main" aria-label="Sign in form" className="min-h-screen... flex">
  <div className="w-full max-w-md" aria-describedby="signin-description">
    <h1 id="signin-title" tabIndex={-1}>
      Welcome back
    </h1>
    <p id="signin-description" className="sr-only">
      Enter your email and password to sign in to your Promptamist account
    </p>

    <SignIn
      appearance={{
        elements: {
          // Ensure proper labeling
          formFieldInput: 'focus-visible:ring-2 focus-visible:ring-ring',
          formButtonPrimary: 'focus-visible:ring-2 focus-visible:ring-ring',
        },
      }}
    />
  </div>
</div>
```

**Tools for Testing:**

- axe DevTools browser extension
- WAVE evaluation tool
- Screen reader testing (NVDA, VoiceOver)
- Keyboard-only navigation audit

---

#### **Task 5.3: Testing Strategy**

**Goal:** Verify all functionality works end-to-end

**Manual Testing Checklist:**

**Happy Paths:**

- [ ] New user can sign up with email/password
- [ ] Existing user can sign in with correct credentials
- [ ] Social login (Google/GitHub) works if configured
- [ ] After auth, redirected to correct URL
- [ ] Session persists across page refreshes
- [ ] User can sign out successfully
- [ ] After sign-out, redirected to home or sign-in

**Sad Paths:**

- [ ] Wrong password shows error (not crash)
- [ ] Unknown email shows appropriate message
- [ ] Expired session forces re-authentication
- [ ] Network error shows friendly message
- [ ] Rate limiting displays countdown

**Integration Tests:**

- [ ] Protected route blocks unauthenticated access
- [ ] Public routes accessible without auth
- [ ] Convex functions reject unauthenticated calls
- [ ] Webhooks fire on user creation/deletion

**Browser Testing:**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

**Automated Tests (Optional but Recommended):**

```typescript
// Example: Playwright E2E test
test('complete sign-up flow', async ({ page }) => {
  await page.goto('/sign-up');

  await page.fill('input[name="emailAddress"]', 'test@example.com');
  await page.fill('input[name="password"]', 'StrongPass123!');
  await page.fill('input[name="confirmPassword"]', 'StrongPass123!');
  await page.click('button[type="submit"]');

  // Should redirect to home or prompts
  await expect(page).toHaveURL(/\/(prompts|\?)$/);

  // Should show user avatar/button
  await expect(page.locator('[data-testid="user-button"]')).toBeVisible();
});

test('protected route redirects to sign-in', async ({ page }) => {
  // Don't sign in first
  await page.goto('/prompts');

  // Should redirect to sign-in
  await expect(page).toHaveURL(/\/sign-in\?redirect_url=%2Fprompts/);
});
```

---

### **Phase 6: Documentation & Handoff (Day 5)**

#### **Task 6.1: Developer Documentation**

**Create:** `docs/AUTHENTICATION.md`

**Contents:**

1. Overview of auth architecture
2. How to add new protected routes
3. How to access user data in Convex functions
4. Environment variable setup guide
5. Troubleshooting common issues
6. Webhook setup instructions

#### **Task 6.2: Team Training**

**Deliverables:**

- Walkthrough of auth flow (30-min presentation)
- Demo of sign-up/sign-in flows
- Q&A session on customization options
- Written guide for adding new auth features

---

## **8. File Summary**

### **New Files Created (7 files)**

| File Path                             | Purpose                     | Lines (~) |
| ------------------------------------- | --------------------------- | --------- |
| `proxy.ts`                            | Route protection middleware | 45        |
| `convex/auth.config.ts`               | Convex auth provider config | 15        |
| `components/ConvexClientProvider.tsx` | Provider wrapper component  | 35        |
| `app/sign-in/[[...sign-in]]/page.tsx` | Custom sign-in page         | 60        |
| `app/sign-up/[[...sign-up]]/page.tsx` | Custom sign-up page         | 60        |
| `lib/clerk-appearance.ts`             | Shared styling config       | 50        |
| `docs/AUTHENTICATION.md`              | Developer documentation     | 200       |

### **Modified Files (3 files)**

| File Path        | Changes                                        |
| ---------------- | ---------------------------------------------- |
| `.env.local`     | Add 10+ environment variables                  |
| `app/layout.tsx` | Wrap with ClerkProvider + ConvexClientProvider |
| `app/page.tsx`   | Add auth-aware rendering (optional)            |

**Total Estimated Effort:** ~500 lines of code across 10 files

---

## **9. Risk Mitigation**

### **High-Risk Areas**

| Risk                                                 | Likelihood | Impact                     | Mitigation                                                              |
| ---------------------------------------------------- | ---------- | -------------------------- | ----------------------------------------------------------------------- |
| **Proxy misconfiguration causes infinite redirects** | Medium     | High (blocks all users)    | Test thoroughly in dev; add logging; whitelist public routes explicitly |
| **Clerk/Convex version incompatibility**             | Low        | High (auth breaks)         | Pin exact versions; check compatibility matrix; update together         |
| **Environment variable missing in production**       | Medium     | Critical (app crashes)     | Validation on startup; CI/CD checks; clear error messages               |
| **JWT token expiration timing issues**               | Low        | Medium (intermittent 401s) | Use `ConvexProviderWithClerk` (handles refresh); monitor Convex logs    |
| **Social login OAuth misconfiguration**              | Medium     | Medium (login fails)       | Follow provider docs exactly; test in incognito; check callback URLs    |

### **Rollback Plan**

If critical issues arise post-deployment:

1. **Immediate rollback:** Revert to previous commit (before auth changes)
2. **Feature flag:** Wrap auth in feature flag; disable if needed
3. **Fallback:** Temporarily remove `auth.protect()` from `proxy.ts` (makes all routes public)
4. **Communication:** Notify users of temporary auth issues via status page

---

## **10. Success Metrics**

### **Technical Metrics**

- ✅ **Page load time:** < 2s for auth pages (3G connection)
- ✅ **TTI (Time to Interactive):** < 3s for protected pages
- ✅ **Auth success rate:** > 99% (excluding user errors)
- ✅ **Session persistence:** 100% across refreshes
- ✅ **Zero security vulnerabilities** in OWASP top 10

### **Business Metrics**

- ✅ **Sign-up conversion rate:** Track funnel completion
- ✅ **Drop-off rate:** Monitor where users abandon auth flow
- ✅ **Support tickets related to auth:** Target < 5% of total tickets
- ✅ **User satisfaction:** Survey new users on onboarding experience

---

## **11. Future Enhancements (Out of Scope for V1)**

These features can be added after initial implementation:

- [ ] **Multi-factor authentication (MFA)** - Enable in Clerk Dashboard with one click
- [ ] **Organization/Team support** - Clerk Organizations for SSO/RBAC
- [ ] **Magic link authentication** - Passwordless email login
- [ ] **Passkey/WebAuthn support** - Biometric authentication
- [ ] **Custom onboarding flow** - Post-signup tutorial/wizard
- [ ] **Rate limiting analytics** - Track brute force attempts
- [ ] **Session management UI** - View active sessions, remote logout
- [ ] **Internationalization (i18n)** - Multi-language auth pages
- [ ] **Custom email templates** - Branded verification/welcome emails
- [ ] **Audit logging** - Log all auth events for compliance

---

## **Conclusion**

This design plan provides a **comprehensive, production-ready blueprint** for implementing custom authentication in Promptamist using **Clerk v7**, **Convex**, and **Next.js 16**.

### **Key Takeaways:**

1. **Security First** - Multiple layers of protection (network, client, server)
2. **Developer Experience** - Minimal boilerplate; libraries handle complexity
3. **User Experience** - Fast, responsive, accessible auth flows
4. **Maintainability** - Clear separation of concerns; well-documented patterns
5. **Scalability** - Architecture supports future enhancements (organizations, MFA, etc.)

### **Estimated Timeline:**

- **Phase 1-2 (Setup):** 1-2 days
- **Phase 3 (Auth Pages):** 1-2 days
- **Phase 4 (Protected Routes):** 1-2 days
- **Phase 5 (Polish):** 1-2 days
- **Phase 6 (Documentation):** 0.5 day

**Total: 5-8 working days** for complete implementation including testing and documentation.

---

**Ready to build?** Start with Phase 1, Task 1.1 (environment setup), and work through sequentially. Good luck building secure authentication for Promptamist! 🚀
