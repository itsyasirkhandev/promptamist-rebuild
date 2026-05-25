# Promptamist

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=24&duration=3000&pause=1000&color=F8FAFC&background=1A1A2E&center=true&vCenter=true&width=600&lines=save+your+high+quality+prompts;version%2C+manage+and+share+your+prompts;Scale+your+workflows+with+Prompts" alt="Promptamist Tagline" />
</p>

<p align="center">
  <img width="1269" height="907" alt="Promptamist Dashboard" src="https://github.com/user-attachments/assets/c0c2aa60-b83f-4ca0-89d3-75d141b5675d" />
</p>

<div align="center">

[![pnpm](https://img.shields.io/badge/pnpm-orange?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-1.39.1-ff6b6b?style=flat-square&logo=convex&logoColor=white)](https://convex.dev/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)

</div>

---

Promptamist is a modern, developer-first **AI prompt manager** and **prompt engineering tool** engineered to solve the chaos of losing high-value prompts in cluttered chat logs. Built with rigorous functional type-safety and real-time database sync, it offers a robust platform for creating, versioning, and deploying **reusable Claude prompt templates** and **ChatGPT prompt sharing** flows. Designed for power users, Promptamist provides **type-safe prompt versioning** combined with instant public template sharing under stable, unique slugs.

---

## 🏗️ Architectural Topology & Tech Stack Layering

Promptamist enforces a strict, type-safe architecture to decouple raw database operations from core business workflows, ensuring absolute data consistency, premium styling, and transactional robustness.

### 1. Structural Architecture & Tech Stack Layering

This diagram displays the vertical stack boundaries—tracing standard client operations from UI styles down to the core database engine:

```mermaid
flowchart TD
    subgraph UI ["Client UI Layer"]
        Client["Next.js App Client"]
        Styling["Tailwind CSS v4 & shadcn/ui"]
        Client -.->|styled with| Styling
    end

    subgraph Auth ["Identity & Security Gateway"]
        Clerk["Clerk Authentication"]
    end

    subgraph Backend ["Convex Serverless Backend (Strict 3-Tier)"]
        API["1. Authenticated API Boundary\n(convex/authed/helpers.ts)\n• convex-helpers wrappers\n• authedQuery / authedMutation"]

        Logic["2. Functional Logic Engine\n(convex/authed/*.ts)\n• Effect TS (Effect.gen pipelines)\n• Typed error handling\n• Action orchestration"]

        DAL["3. Data Access Layer (DAL)\n(convex/dal/*.dal.ts)\n• Direct ctx.db calls isolated here"]

        DTO["4. DTO Mapping Layer\n(convex/dto.ts)\n• Output sanitization"]

        DB[(Convex DB)]
    end

    Client -->|Authenticated Request| API
    Clerk -.->|Verifies identity at| API
    API -->|Runs in pipeline| Logic
    Logic -->|Calls queries/mutations| DAL
    DAL -->|Read / Write| DB
    Logic -->|Maps result via| DTO
    DTO -->|Sanitized response| Client

    %% Custom styling for premium look
    style UI fill:#151525,stroke:#4f46e5,stroke-width:2px,color:#fff
    style Auth fill:#151525,stroke:#9333ea,stroke-width:2px,color:#fff
    style Backend fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Client fill:#1e1b4b,stroke:#818cf8,color:#fff
    style Styling fill:#1e1b4b,stroke:#06b6d4,color:#fff
    style Clerk fill:#3b0764,stroke:#c084fc,color:#fff
    style API fill:#1e293b,stroke:#a855f7,color:#fff
    style Logic fill:#1e293b,stroke:#f43f5e,color:#fff
    style DAL fill:#1e293b,stroke:#0ea5e9,color:#fff
    style DTO fill:#1e293b,stroke:#10b981,color:#fff
    style DB fill:#0f172a,stroke:#f59e0b,color:#fff
```

### 2. Event-Driven Lifecycles & External API Webhooks

This diagram maps the horizontal integration pathways—explaining exactly how asynchronous webhooks, email delivery, and customer subscriptions interact across third-party networks:

```mermaid
flowchart TD
    subgraph UserSync ["Cycle 1: User Registration & Synchronization"]
        U1["User Registers / Logs in"] -->|Triggers| C1["Clerk Auth Event"]
        C1 -->|HTTP POST webhook payload| Webhook["Convex HTTP Router\n(convex/http.ts /clerk-users-webhook)"]
        Webhook -->|1. Verify with Svix\n2. Ingest via Effect pipeline| Upsert["upsertFromClerk\n(convex/users.ts)"]
        Upsert -->|3. Insert user info| DAL_User["users.dal.ts"]
        DAL_User -->|4. Save| ConvexDB[(Convex DB)]

        %% Asynchronous Scheduler Flows
        Upsert -->|5a. Schedule background task| EmailAction["internal.emails.sendWelcomeEmail\n(convex/emails.ts)"]
        EmailAction -->|Send SMTP Payload| Brevo["Brevo SMTP REST API"]
        Brevo -->|Deliver to User Inbox| WelcomeEmail["Welcome Email Received"]

        Upsert -->|5b. Schedule background task| PolarAction["internal.private.polar.createPolarCustomerBackground\n(convex/private/polar.ts)"]
        PolarAction -->|Instantiate Polar Client| PolarSDK["Polar TS SDK"]
        PolarSDK -->|Create Native Customer| PolarPlatform["Polar.sh Platform"]
        PolarPlatform -->|Return polarCustomerId| PolarAction
        PolarAction -->|Save customer ID| SavePolarId["savePolarCustomerIdInternal\n(convex/users.ts)"]
        SavePolarId -->|Write field| ConvexDB
    end

    subgraph SubBilling ["Cycle 2: Subscription & Entitlement Lifecycle"]
        P1["User clicks 'Upgrade' in UI"] -->|Call Next.js Server Action| SA["createCheckoutSession\n(src/app/actions/polar.ts)"]
        SA -->|1. Fetch polarCustomerId| QueryCustomer["getPolarCustomerId\n(convex/authed/users)"]
        QueryCustomer -->|Returns cached ID| SA
        SA -->|2. Generate checkout URL| PolarSDK2["Polar TS SDK"]
        PolarSDK2 -->|Redirect User| CheckoutPage["Polar Checkout Page"]
        CheckoutPage -->|User successfully pays| PolarPlatform2["Polar.sh Platform"]

        PolarPlatform2 -->|HTTP POST webhook payload| PolarWebhook["Convex HTTP Router\n(convex/http.ts /polar-webhook)"]
        PolarWebhook -->|1. Base64 encode secret\n2. Verify with Svix| PolarWebhook

        PolarWebhook -->|3. If tier upgraded to Pro| ProEmail["internal.private.emails.sendProWelcome\n(convex/private/emails.ts)"]
        ProEmail -->|Send SMTP Payload via Effect| Brevo
        Brevo -->|Deliver to User Inbox| ProWelcomeEmail["Pro Celebration Email"]

        PolarWebhook -->|4. Ingest subscription status| UpdateSub["updateSubscriptionTier\n(convex/users.ts)"]
        UpdateSub -->|Update tier to 'pro'| DAL_Sub["users.dal.ts"]
        DAL_Sub -->|Write status & IDs| ConvexDB
    end

    %% Styles for Cycle 1 & 2
    style UserSync fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff
    style SubBilling fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#fff
    style Webhook fill:#1e293b,stroke:#a855f7,color:#fff
    style Upsert fill:#1e293b,stroke:#f43f5e,color:#fff
    style EmailAction fill:#1e293b,stroke:#f59e0b,color:#fff
    style PolarAction fill:#1e293b,stroke:#0ea5e9,color:#fff
    style SA fill:#1e293b,stroke:#6366f1,color:#fff
    style PolarWebhook fill:#1e293b,stroke:#a855f7,color:#fff
    style UpdateSub fill:#1e293b,stroke:#10b981,color:#fff
    style Brevo fill:#1e1b4b,stroke:#ea580c,color:#fff
    style PolarPlatform fill:#1e1b4b,stroke:#ec4899,color:#fff
    style PolarPlatform2 fill:#1e1b4b,stroke:#ec4899,color:#fff
```

### Technical Stack & Dependencies

- **Framework**: Next.js `16.2.6` (App Router, RSC, SSR)
- **UI Library**: React & React DOM `19.2.6`
- **Backend & DB**: Convex & `convex-helpers` `^1.39.1`
- **Logic Engine**: Effect (Functional Programming) `4.0.0-beta.52`
- **Authentication**: Clerk (`@clerk/nextjs`, themes) `^7.2.3`
- **Billing**: Polar.sh SDK `^0.47.1` & SVIX `^1.90.0`
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **Validation**: Zod `^4.3.6`
- **Testing**: Vitest `^4.1.5`

---

## 🚀 Quick Starts

### For Non-Coders / Product Teams

1. Access the live deployed application at **[repromptamist.vercel.app](https://repromptamist.vercel.app)**.
2. Sign in via **Clerk** (Google, GitHub, or Passwordless Email).
3. Click **New Prompt**, draft your template using `{{variables}}`, and toggle **Public** to instantly share your prompt link.

### For Developers (Local Setup)

```bash
# 1. Clone and Install
git clone https://github.com/itsyasirkhandev/promptamist-rebuild.git
cd promptamist-rebuild
pnpm install

# 2. Add Environment Variables (.env.local)

# 3. Spin up Developer Environment
# Terminal A (Convex Dev Engine)
npx convex dev
# Terminal B (Next.js client)
pnpm dev

# 4. Verify Code Quality (ESLint + Prettier + TypeScript + Vitest Tests)
pnpm check
```

---

## ⚙️ Environment Configurations

For production deployment, environment variables must be split between **Convex (Backend)** and **Vercel (Frontend)** as follows:

### 🎛️ Convex Backend (Convex Dashboard)

Configure these variables in your **Convex Dashboard (Settings > Environment Variables)**:

- **`CLERK_FRONTEND_API_URL`**: `https://tidy-bullfrog-8.clerk.accounts.dev` (JWT verification issuer domain)
- **`CONVEX_PRIVATE_BRIDGE_KEY`**: Custom shared token to authorize Next.js server actions calling private Convex actions
- **`CLERK_WEBHOOK_SECRET`**: `whsec_...` (Verifies incoming user sync webhooks)
- **`POLAR_WEBHOOK_SECRET`**: `whsec_...` (Verifies incoming subscription status webhooks)
- **`POLAR_ACCESS_TOKEN`**: `polar_oat_...` (Polar authorization credential)
- **`POLAR_ENVIRONMENT`**: `sandbox` or `production` (Determines Polar payment target API)
- **`NEXT_PUBLIC_APP_URL`**: Deployed URL target for checkout redirects
- **`BREVO_API_KEY`**: Brevo SMTP key (if configured for dispatching transactional mail)

### 🌐 Vercel Frontend (Next.js Settings)

Configure these variables in your **Vercel Settings (Settings > Environment Variables)**:

- **`NEXT_PUBLIC_APP_URL`**: `https://repromptamist.vercel.app`
- **`NEXT_PUBLIC_CONVEX_URL`**: `https://[your-project].convex.cloud`
- **`NEXT_PUBLIC_CONVEX_SITE_URL`**: `https://[your-project].convex.site`
- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`**: `pk_test_...`
- **`CLERK_FRONTEND_API_URL`**: Clerk frontend connection URL
- **`CLERK_SECRET_KEY`**: Secure key for server-side Next.js middleware and API integrations
- **`CONVEX_PRIVATE_BRIDGE_KEY`**: Custom shared key enabling Vercel server actions to invoke Convex
- **`POLAR_ACCESS_TOKEN`**: Polar authentication key for checkout generation
- **`POLAR_ENVIRONMENT`**: sandbox or production payment target
- **`NEXT_PUBLIC_CLERK_SIGN_IN_URL`**: `/sign-in`
- **`NEXT_PUBLIC_CLERK_SIGN_UP_URL`**: `/sign-up`
- **`NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`**: `/prompts`
- **`NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`**: `/prompts`

---

## 🎯 Contributor Expectations & Guardrails

We enforce strict coding and layout principles. Pull Requests violating these guidelines will be rejected.

### 1. Strict 3-Tier Backend Layering

> [!IMPORTANT]
> Raw database operations are forbidden outside the Data Access Layer (DAL). Do not bypass layers.

- **Data Access Layer (DAL)**: All direct `ctx.db` calls must reside inside `convex/dal/` (e.g. `prompts.dal.ts`, `users.dal.ts`).
- **Effect Logic Engine**: Real mutations/queries execute inside functional `Effect.gen` pipelines caught by `runEffect` (`convex/effect.ts`), raising typed errors (`errors.ts`).
- **Authenticated API Boundary**: Client functions must be wrapped using custom `authedQuery`, `authedMutation`, or `authedAction` wrappers (`convex/authed/helpers.ts`).
- **Data Transfer Objects (DTO)**: Results returned to the client must pass through DTO mappers (`convex/dto.ts`) to strip sensitive credentials.

### 2. Design System Limitations (`DESIGN_GUIDELINES.md`)

> [!WARNING]
> Do not introduce custom font sizes, spacing increments, or arbitrary colors.

- **Typography**: Strictly limited to **4 font sizes** and **2 font weights** (Regular & Semibold) for clean hierarchy.
- **Spacing**: Rigid **8pt grid system**. Margins, padding, gaps, and heights must be divisible by `8` or `4`.
- **Color Balance**: A clean **60/30/10 distribution** using modern, perceptually uniform **OKLCH variables**.

---

## 🤝 Socials & Project Support

- 🌟 **Star the Repository**: Show your appreciation on GitHub!
- 💼 **Connect on LinkedIn**: Professional networking and updates at [Yasir Khan](https://www.linkedin.com/in/connectyasir/).
- 🐦 **Follow the Creator**: Follow updates and announcements on X/Twitter at [@withyasirkhan](https://x.com/withyasirkhan).
