# Promptamist

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=24&duration=3000&pause=1000&color=F8FAFC&center=true&vCenter=true&width=600&lines=Prompt+Engineering+as+Code.;Versioned.+Syncable.+Type-Safe.;Scale+your+LLM+workflows+with+precision." alt="Promptamist Tagline" />
</p>

<p align="center">
  <img width="1269" height="907" alt="Promptamist Dashboard" src="https://github.com/user-attachments/assets/db96c269-2427-4d69-b719-be36d317525e" />
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

## 🏗️ 3-Tier Backend Architecture

Promptamist enforces a strict, type-safe architecture to decouple raw database operations from core business workflows, ensuring absolute data consistency and sanitization.

```mermaid
flowchart TD
    Client["Next.js Client"] --> API["Authenticated API Boundary\n(convex/authed/helpers.ts)"]
    API -->|"validates Clerk identity"| Logic["Effect Logic Pipeline\n(convex/authed/prompts.ts)"]
    Logic -->|"ctx.db forbidden here"| DAL["Data Access Layer (DAL)\n(convex/dal/*.dal.ts)"]
    DAL --> DB[(Convex DB)]
    Logic -->|"sanitized output via"| DTO["DTO Mappers\n(convex/dto.ts)"]
    DTO --> Client

    style API fill:#1a1a2e,stroke:#6C47FF,color:#fff
    style Logic fill:#1a1a2e,stroke:#ff6b6b,color:#fff
    style DAL fill:#1a1a2e,stroke:#58a6ff,color:#fff
    style DTO fill:#1a1a2e,stroke:#3fb950,color:#fff
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
