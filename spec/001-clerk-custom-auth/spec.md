# Complete Specification: Custom Sign-In & Sign-Up Pages with Clerk + Convex in Next.js 16

## **Versions & Sources Used**

### **Technology Stack Versions:**

- **Next.js**: 16.2.4
- **React**: 19.2.4
- **@clerk/nextjs**: ^7.2.3
- **convex**: ^1.35.1
- **TypeScript**: ^5
- **Tailwind CSS**: v4

### **Official Documentation Sources (Verified April 2026):**

1. **Clerk Custom Sign-In/Sign-Up Page Guide**: https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page
2. **Clerk Custom Sign-Up Page Guide**: https://clerk.com/docs/nextjs/guides/development/custom-sign-up-page
3. **Clerk + Convex Integration**: https://clerk.com/docs/guides/development/integrations/databases/convex
4. **Clerk Appearance Customization**: https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/overview
5. **Clerk Middleware Reference (proxy.ts)**: https://clerk.com/docs/reference/nextjs/clerk-middleware
6. **Next.js 16 Proxy Documentation**: https://nextjs.org/docs/messages/middleware-to-proxy

---

## **1. Problem Statement**

As users interact with the Promptamist application, they need secure authentication to access personalized features, save chat history, and maintain session state. Currently, there is no authentication system implemented.

This makes it difficult for users to:

- **Secure their data** - Chat history and preferences are not protected
- **Access personalized features** - No user-specific functionality available
- **Maintain sessions** - Users cannot resume their work across devices
- **Manage accounts** - No profile or account management capabilities

**Solution:** This feature implements custom sign-in and sign-up pages using Clerk for authentication, integrated with Convex for backend data management, providing a seamless and secure authentication experience.

---

## **2. Functional Requirements**

The system should:

### **Authentication Flow**

- Provide a custom **Sign In page** at `/sign-in` route
- Provide a custom **Sign Up page** at `/sign-up` route
- Support **email/password authentication** by default
- Support **social login providers** (Google, GitHub, etc.) as configured in Clerk Dashboard
- Allow users to **toggle between Sign In and Sign Up** flows from either page
- **Redirect authenticated users** away from auth pages (to home/prompts)
- **Redirect unauthenticated users** to sign-in when accessing protected routes

### **Integration Requirements**

- Integrate **Clerk authentication** with **Convex backend** for seamless auth state
- Use **ConvexProviderWithClerk** for proper auth context sharing
- Configure **JWT-based authentication** between Clerk and Convex
- Expose **user identity** in Convex functions via `ctx.auth.getUserIdentity()`

### **UI/UX Requirements**

- Use **custom styling** consistent with Promptamist design system (shadcn/ui + Tailwind v4)
- Support **responsive design** for mobile and desktop
- Provide **loading states** during authentication
- Show **error messages** for failed authentication attempts
- Support **dark/light theme** based on application settings

---

## **3. Inputs and Outputs**

### **3.1 Sign-In Page Behavior**

**USER ACTION (INPUT)**
When a user navigates to `/sign-in` or clicks "Sign In" button

**EXPECTED SYSTEM BEHAVIOR**

```
✓ Render SignIn component from @clerk/nextjs
✓ Display email/username and password fields
✓ Show social login buttons (if configured)
✓ Display "Don't have an account? Sign up" link → navigates to /sign-up
✓ Validate credentials against Clerk backend
✓ On success: Redirect to CLERK_SIGN_IN_FALLBACK_REDIRECT_URL (default: /)
✓ On failure: Display error message inline
✓ If already authenticated: Redirect to home URL automatically
```

### **3.2 Sign-Up Page Behavior**

**USER ACTION (INPUT)**
When a user navigates to `/sign-up` or clicks "Sign Up" link

**EXPECTED SYSTEM BEHAVIOR**

```
✓ Render SignUp component from @clerk/nextjs
✓ Display registration form (email, password, confirm password, etc.)
✓ Show social signup buttons (if configured)
✓ Display "Already have an account? Sign in" link → navigates to /sign-in
✓ Validate input against Clerk's password policies
✓ Create new user account in Clerk
✓ On success: Redirect to CLERK_SIGN_UP_FALLBACK_REDIRECT_URL (default: /)
✓ Optionally: Trigger post-signup tasks (email verification, onboarding, etc.)
✓ If already authenticated: Redirect to home URL automatically
```

### **3.3 Authentication State Integration**

**SYSTEM STATE (INPUT)**
User completes sign-in/sign-up successfully

**EXPECTED SYSTEM BEHAVIOR**

```
✓ Clerk creates session and issues JWT token
✓ ConvexProviderWithClerk receives auth state from useAuth hook
✓ Convex client authenticates with backend using Clerk JWT
✓ useConvexAuth() hook returns { isAuthenticated: true, isLoading: false }
✓ <Authenticated> components render for authenticated users
✓ User identity available in Convex queries/mutations via ctx.auth
✓ User can now access protected routes and data
```

---

## **4. Technical Implementation Details**

### **4.1 File Structure**

```
promptamist/
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Home page
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx             # Custom sign-in page ⭐
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx             # Custom sign-up page ⭐
│   └── (protected)/                 # Protected routes group
│       ├── dashboard/
│       └── chat/
├── components/
│   ├── ConvexClientProvider.tsx      # Convex + Clerk wrapper ⭐
│   ├── ui/                          # shadcn/ui components
│   └── auth/
│       └── AuthGuard.tsx            # Optional: route protection component
├── convex/
│   ├── auth.config.ts               # Convex auth configuration ⭐
│   └── *.ts                         # Your Convex functions
├── proxy.ts                         # Next.js 16 proxy (middleware) ⭐
├── .env.local                       # Environment variables ⭐
└── package.json
```

⭐ = Files created/modified for this feature

### **4.2 Environment Variables Configuration**

**File: `.env.local`**

```bash
# ===========================================
# CLERK AUTHENTICATION CONFIGURATION
# ===========================================

# Get these from your Clerk Dashboard → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# ===========================================
# CUSTOM AUTH PAGE ROUTES (IMPORTANT!)
# ===========================================
# These tell Clerk where your custom auth pages are hosted
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ===========================================
# REDIRECT URLS AFTER AUTHENTICATION
# ===========================================
# Where to redirect after successful sign-in/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/prompts
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/prompts

# Optional: Force redirect URLs (overrides all other redirect logic
# NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
# NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# ===========================================
# CONVEX INTEGRATION
# ===========================================
# Get from Convex Dashboard → Settings
NEXT_PUBLIC_CONVEX_URL=https://your-app-name.convex.cloud
CONVEX_DEPLOY_KEY=convex_deploy_key_here

# ===========================================
# CLERK → CONVEX INTEGRATION
# ===========================================
# Get from Clerk Dashboard → Integrations → Convex
# Format: https://verb-noun-00.clerk.accounts.dev (dev)
#        https://clerk.yourdomain.com (prod)
CLERK_FRONTEND_API_URL=https://your-clerk-instance.clerk.accounts.dev
```

---

### **4.3 Core Implementation Code**

#### **A. Proxy Configuration (Next.js 16)**

**File: `proxy.ts`** (⚠️ NOT middleware.ts - renamed in Next.js 16!)

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', // Sign-in page and sub-routes
  '/sign-up(.*)', // Sign-up page and sub-routes
  '/', // Home page (optional - make public for landing)
  '/api/webhook(.*)', // Webhooks (if using Clerk webhooks)
  // Add other public routes here:
  // '/about',
  // '/pricing',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except public ones
  if (!isPublicRoute(req)) {
    await auth.protect();
    // Optional: Add role-based protection
    // await auth.protect((has) => has.role:'org:admin'))
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files (unless in search params)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

**⚠️ CRITICAL NOTE FOR NEXT.JS 16:**

- Next.js 16 **renamed** `middleware.ts` → `proxy.ts`
- The code logic remains identical, only filename changes
- If you're using Next.js ≤15, use `middleware.ts` instead
- This is confirmed in both Clerk docs and Next.js 16 migration guide

---

#### **B. Custom Sign-In Page**

**File: `app/sign-in/[[...sign-in]]/page.tsx`**

```tsx
import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Promptamist',
  description: 'Sign in to your Promptamist account',
};

export default function SignInPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Optional: Custom header */}
        <div className="text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <SignIn
          appearance={{
            // Customize to match your shadcn/ui theme
            elements: {
              formButtonPrimary:
                'bg-primary text-primary-foreground hover:bg-primary/90',
              card: 'shadow-lg border-border',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton:
                'border-input bg-background hover:bg-accent',
              formFieldInput: 'border-input bg-background',
              footerActionLink: 'text-primary hover:text-primary/80',
            },
            variables: {
              colorPrimary: 'hsl(var(--primary))',
              colorBackground: 'hsl(var(--background))',
              colorInputBackground: 'hsl(var(--background))',
              colorInputText: 'hsl(var(--foreground))',
            },
          }}
        />
      </div>
    </div>
  );
}
```

---

#### **C. Custom Sign-Up Page**

**File: `app/sign-up/[[...sign-up]]/page.tsx`**

```tsx
import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Promptamist',
  description: 'Create your Promptamist account',
};

export default function SignUpPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Optional: Custom header */}
        <div className="text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Get started with Promptamist today
          </p>
        </div>

        {/* Clerk SignUp Component */}
        <SignUp
          appearance={{
            // Same styling as SignIn for consistency
            elements: {
              formButtonPrimary:
                'bg-primary text-primary-foreground hover:bg-primary/90',
              card: 'shadow-lg border-border',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton:
                'border-input bg-background hover:bg-accent',
              formFieldInput: 'border-input bg-background',
              footerActionLink: 'text-primary hover:text-primary/80',
            },
            variables: {
              colorPrimary: 'hsl(var(--primary))',
              colorBackground: 'hsl(var(--background))',
              colorInputBackground: 'hsl(var(--background))',
              colorInputText: 'hsl(var(--foreground))',
            },
          }}
          // Optional: Pre-fill form fields
          // initialValues={{
          //   emailAddress: '',
          //   username: '',
          // }}
        />
      </div>
    </div>
  );
}
```

---

#### **D. Convex Authentication Configuration**

**File: `convex/auth.config.ts`**

```typescript
export default {
  providers: [
    {
      domain: process.env.CLERK_FRONTEND_API_URL, // e.g., "https://your-issuer.clerk.accounts.dev"
      applicationID: 'convex',
    },
  ],
};
```

**⚠️ IMPORTANT:** After creating this file, run:

```bash
npx convex dev
```

This syncs the auth configuration to your Convex backend.

---

#### **E. Convex + Clerk Provider Wrapper**

**File: `components/ConvexClientProvider.tsx`**

```tsx
'use client';

import { ReactNode } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs';

// Validate environment variable
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL environment variable');
}

// Create Convex client instance (singleton)
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

interface ConvexClientProviderProps {
  children: ReactNode;
}

export default function ConvexClientProvider({
  children,
}: ConvexClientProviderProps) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
```

---

#### **F. Root Layout with Providers**

**File: `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/components/ConvexClientProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Promptamist',
  description: 'AI-powered prompt management platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        {/* 
          ⚠️ ORDER MATTERS! 
          ClerkProvider MUST wrap ConvexClientProvider
          so Convex can access Clerk's auth context
        */}
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: 'hsl(var(--primary))',
              colorBackground: 'hsl(var(--background))',
              colorText: 'hsl(var(--foreground))',
            },
          }}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

---

#### **G. Example: Protected Page Using Auth State**

**File: `app/(protected)/dashboard/page.tsx`**

```tsx
'use client';

import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen">
      {/* Header with user menu */}
      <header className="border-border border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Promptamist</h1>

          <Authenticated>
            <UserButton afterSignOutUrl="/sign-in" />
          </Authenticated>

          <Unauthenticated>
            <SignInButton mode="modal">
              <button className="btn btn-primary">Sign In</button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </header>

      {/* Main content based on auth state */}
      <main className="container mx-auto px-4 py-8">
        <AuthLoading>
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            <span className="text-muted-foreground ml-3">Loading...</span>
          </div>
        </AuthLoading>

        <Authenticated>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back, {user?.firstName || 'User'}!
              </h2>
              <p className="text-muted-foreground">Here's your dashboard</p>
            </div>

            {/* Your authenticated content here */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Dashboard cards, stats, etc. */}
            </div>
          </div>
        </Authenticated>

        <Unauthenticated>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4 text-lg">
              Please sign in to view your dashboard
            </p>
            <SignInButton mode="redirect">
              <button className="btn btn-primary btn-lg">
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        </Unauthenticated>
      </main>
    </div>
  );
}
```

---

#### **H. Example: Convex Function with Auth**

**File: `convex/users.ts`**

```typescript
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get current user's profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user identity from Clerk JWT
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    // identity contains:
    // - identity.subject (user ID)
    // - identity.email
    // - identity.name
    // - identity.givenName
    // - identity.familyName
    // - identity.imageUrl
    // - Any custom claims you've added

    // Look up user in database
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();

    return user;
  },
});

// Create/update user profile after sign-up
export const upsertFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert('users', {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return userId;
    }
  },
});
```

---

## **5. Constraints**

### **Performance Constraints**

- Auth pages must load within **2 seconds** on standard broadband
- Authentication state must be established within **500ms** of page load
- Redirects must happen within **100ms** of auth state confirmation
- Convex auth token refresh must not cause visible UI flicker

### **Security Constraints**

- All environment variables containing secrets must be **server-side only** (no `NEXT_PUBLIC_` prefix)
- Session tokens must be validated on **every Convex function call**
- Protected routes must **never render** unauthenticated content (even briefly)
- CSRF protection must be enabled (handled automatically by Clerk)

### **Compatibility Constraints**

- Must work with **Next.js 16 App Router** (not Pages Router)
- Must support **React 19** concurrent features
- Must integrate with **Tailwind CSS v4** styling
- Must work with **shadcn/ui v4** component library
- Must support **SSR (Server-Side Rendering)** properly

### **UX Constraints**

- Mobile-responsive layout (works on screens ≥320px wide)
- Keyboard navigation support for accessibility
- Screen reader compatible (proper ARIA labels)
- Clear error messages for failed authentication
- Loading indicators during async operations

---

## **6. Edge Cases and Error Handling**

### **6.1 Authentication Edge Cases**

| Scenario                                        | Expected Behavior                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| **User already signed in visits /sign-in**      | Auto-redirect to home URL (`/`)                                           |
| **User already signed in visits /sign-up**      | Auto-redirect to home URL (`/`)                                           |
| **Unauthenticated user visits protected route** | Redirect to `/sign-in` with `redirect_url` parameter                      |
| **Session expires during usage**                | Show re-authentication modal or redirect to sign-in                       |
| **Network error during sign-in**                | Show error message: "Network error. Please check your connection."        |
| **Invalid credentials**                         | Show inline error: "Invalid email or password"                            |
| **Email already exists (signup)**               | Show inline error: "An account with this email already exists"            |
| **Weak password (signup)**                      | Show inline error with password requirements                              |
| **Social login fails**                          | Show error: "Unable to authenticate with [provider]. Please try again."   |
| **Clerk service down**                          | Show error: "Authentication service unavailable. Please try again later." |

### **6.2 Integration Edge Cases**

| Scenario                                            | Expected Behavior                                                                |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Convex auth token missing/expired**               | `useConvexAuth()` returns `{ isAuthenticated: false, isLoading: false }`         |
| **Race condition: auth loading vs query execution** | Use `<AuthLoading>` fallback; don't render queries until `isAuthenticated: true` |
| **Missing CLERK_FRONTEND_API_URL**                  | Throw clear error on startup: "Missing CLERK_FRONTEND_API_URL"                   |
| **Convex backend unreachable**                      | Show error state; retry with exponential backoff                                 |
| **User identity null in Convex function**           | Throw error: "Unauthorized"; handle in UI with error boundary                    |

### **6.3 Configuration Edge Cases**

| Scenario                                      | Expected Behavior                                      |
| --------------------------------------------- | ------------------------------------------------------ |
| **Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** | Console error; Clerk components won't render           |
| **Missing CLERK_SECRET_KEY**                  | Server-side auth checks fail; clear error message      |
| **Wrong redirect URLs in env**                | Users redirected to wrong pages after auth             |
| **Proxy.ts not configured**                   | All routes public; no auth protection                  |
| **Forgot to add /sign-in to public routes**   | Infinite redirect loop (sign-in → protected → sign-in) |

---

## **7. Acceptance Criteria**

This feature is considered **complete** when:

### **Functional Completeness**

- [ ] Users can access `/sign-in` page and see custom-styled sign-in form
- [ ] Users can access `/sign-up` page and see custom-styled sign-up form
- [ ] Users can successfully sign in with valid credentials
- [ ] Users can successfully create new accounts via sign-up
- [ ] Social login buttons appear and function correctly (if configured)
- [ ] Toggle links between sign-in/sign-up work correctly
- [ ] After successful auth, users are redirected to correct URL
- [ ] Already-authenticated users are redirected away from auth pages

### **Integration Completeness**

- [ ] ClerkProvider wraps entire app in root layout
- [ ] ConvexClientProvider wraps children inside ClerkProvider
- [ ] `useConvexAuth()` hook returns correct auth state
- [ ] `<Authenticated>` component renders only when user signed in
- [ ] `<Unauthenticated>` component renders only when user signed out
- [ ] Convex functions can access user identity via `ctx.auth.getUserIdentity()`
- [ ] No console errors related to auth initialization

### **Protection Completeness**

- [ ] Protected routes redirect unauthenticated users to `/sign-in`
- [ ] Public routes (`/sign-in`, `/sign-up`, `/`) are accessible without auth
- [ ] API routes are protected by proxy.ts
- [ ] Auth state persists across page refreshes
- [ ] Session expires appropriately and forces re-authentication

### **UI/UX Completeness**

- [ ] Auth pages match Promptamist design system (colors, fonts, spacing)
- [ ] Responsive layout works on mobile (320px+), tablet, desktop
- [ ] Loading states display during authentication
- [ ] Error messages are clear and actionable
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus management is logical (auto-focuses first input field)

### **Error Handling Completeness**

- [ ] Invalid credentials show inline errors (not alerts)
- [ ] Network errors show user-friendly messages
- [ ] Missing environment variables fail fast with clear messages
- [ ] Edge cases (already signed in, expired session) handled gracefully
- [ ] No infinite redirect loops occur

### **Testing Completeness**

- [ ] Manual testing: Complete sign-up flow end-to-end
- [ ] Manual testing: Complete sign-in flow end-to-end
- [ ] Manual testing: Verify social login (if configured)
- [ ] Manual testing: Access protected route while logged out
- [ ] Manual testing: Access auth pages while logged in
- [ ] Manual testing: Refresh page while authenticated
- [ ] Browser console: No errors or warnings
- [ ] Network tab: Auth requests complete successfully (200 status codes)

---

## **8. Setup Checklist (Step-by-Step)**

### **Prerequisites**

- [ ] Clerk account created (https://clerk.com)
- [ ] Convex account created (https://convex.dev)
- [ ] Next.js 16 project initialized with your package.json dependencies

### **Configuration Steps**

**Step 1: Clerk Dashboard Setup**

1. Go to Clerk Dashboard → Select/Create application
2. Navigate to **Integrations → Convex**
3. Click **Activate Convex integration**
4. Copy the **Frontend API URL** shown
5. Configure sign-in methods (Email, Social providers, etc.)
6. (Optional) Customize branding and themes

**Step 2: Environment Variables**

1. Copy `.env.local` template from Section 4.2
2. Fill in all values from dashboards
3. Never commit `.env.local` to git!

**Step 3: Install Dependencies** (should already be in your package.json)

```bash
pnpm install @clerk/nextjs convex convex-react-clerk
```

**Step 4: Create Files** (in order)

1. `proxy.ts` - Route protection
2. `convex/auth.config.ts` - Convex auth config
3. `components/ConvexClientProvider.tsx` - Provider wrapper
4. Update `app/layout.tsx` - Add providers
5. `app/sign-in/[[...sign-in]]/page.tsx` - Sign-in page
6. `app/sign-up/[[...sign-up]]/page.tsx` - Sign-up page

**Step 5: Deploy & Test**

```bash
# Start Convex dev server
pnpm convex dev

# Start Next.js dev server
pnpm dev

# Visit http://localhost:3000/sign-in
# Visit http://localhost:3000/sign-up
# Test full authentication flow
```

---

## **9. Important Notes & Gotchas**

### **🚨 Critical Warnings**

1. **Next.js 16 Naming Change**
   - File is `proxy.ts`, NOT `middleware.ts`
   - Code is identical, only filename changed
   - Using wrong filename = auth won't work!

2. **Provider Order Matters**
   - Must be: `<ClerkProvider>` → `<ConvexClientProvider>`
   - Reversing order = Convex can't access Clerk auth context
   - Will cause cryptic errors about missing auth

3. **Environment Variable Prefixes**
   - `NEXT_PUBLIC_*` = exposed to browser (safe for publishable keys)
   - No prefix = server-only (MUST use for secret keys)
   - Never expose `CLERK_SECRET_KEY` to client!

4. **Optional Catch-All Routes**
   - Must use `[[...sign-in]]` not `[sign-in]`
   - Supports query parameters like `?redirect_url=/dashboard`
   - Required for Clerk's internal routing to work

5. **Convex Auth Sync**
   - Must run `npx convex dev` after creating `auth.config.ts`
   - Changes won't take effect until synced to Convex cloud
   - Check terminal output for sync confirmation

### **💡 Pro Tips**

1. **Customize Appearance Globally**
   - Add `appearance` prop to `<ClerkProvider>` in `layout.tsx`
   - Applies to ALL Clerk components (SignIn, SignUp, UserButton, etc.)
   - Override per-component if needed

2. **Use Clerk Webhooks for Post-Signup Tasks**
   - Create user in Convex DB after Clerk signup
   - Send welcome emails
   - Initialize user data/settings
   - Endpoint: `/api/webhooks/clerk`

3. **Handle Auth Loading States Properly**
   - Always use `<AuthLoading>` fallback
   - Prevents flash of unauthenticated content
   - Better UX than conditional rendering alone

4. **Test in Incognito/Private Mode**
   - Avoids cached sessions confusing tests
   - Simulates fresh user experience
   - Catches cookie/localStorage issues early

5. **Use TypeScript Strictly**
   - All examples use proper typing
   - Catches configuration errors at compile time
   - Enables better IDE autocomplete

---

## **10. Official Documentation Links**

### **Clerk Documentation**

- 📘 **Custom Sign-In Page**: https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page
- 📘 **Custom Sign-Up Page**: https://clerk.com/docs/nextjs/guides/development/custom-sign-up-page
- 📘 **Appearance Customization**: https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/overview
- 📘 **Themes**: https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/themes
- 📘 **Middleware (proxy.ts) Reference**: https://clerk.com/docs/reference/nextjs/clerk-middleware
- 📘 **SignIn Component Props**: https://clerk.com/docs/nextjs/reference/components/authentication/sign-in
- 📘 **SignUp Component Props**: https://clerk.com/docs/nextjs/reference/components/authentication/sign-up
- 📘 **Environment Variables**: https://clerk.com/docs/nextjs/guides/environment-variables

### **Convex Documentation**

- 📗 **Clerk Integration**: https://clerk.com/docs/guides/development/integrations/databases/convex
- 📗 **Convex Auth Configuration**: https://docs.convex.dev/auth/configuration
- 📗 **ConvexProviderWithClerk**: https://docs.convex.dev/auth/clerk
- 📗 **Authentication in Functions**: https://docs.convex.dev/auth/authentication-in-functions

### **Next.js 16 Documentation**

- 📙 **Proxy (Middleware) Guide**: https://nextjs.org/docs/messages/middleware-to-proxy
- 📙 **App Router**: https://nextjs.org/docs/app/building-your-application/routing
- 📙 **Route Handlers**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
