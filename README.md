# Promptamist

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=24&duration=3000&pause=1000&color=F8FAFC&center=true&vCenter=true&width=600&lines=Prompt+Engineering+as+Code.;Versioned.+Syncable.+Type-Safe.;Scale+your+LLM+workflows+with+precision." alt="Promptamist Tagline" />
</p>

<p align="center">
  <img width="1269" height="907" alt="Promptamist Dashboard" src="https://github.com/user-attachments/assets/db96c269-2427-4d69-b719-be36d317525e" />
</p>

<div align="center">

[![pnpm](https://img.shields.io/badge/pnpm-orange?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-ff6b6b?style=flat-square&logo=convex&logoColor=white)](https://convex.dev/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)
[![License](https://img.shields.io/badge/license-MIT-3fb950?style=flat-square)](LICENSE)

</div>

---

## [01] Architectural Flow

Promptamist utilizes a high-performance reactive stack to manage prompt lifecycles from definition to execution.

```mermaid
graph TD
    User([User Engineer]) --> UI[Next.js App Router]
    UI --> Hooks[Convex React Hooks]
    Hooks <--> Sync[Convex Real-time DB]

    subgraph Engine [Backend Engine]
        Sync --> Actions[Convex Actions/Mutations]
        Actions --> Effect[Effect Library Logic]
        Effect --> LLM[LLM Provider API]
    end

    subgraph Security [Identity and Security]
        Auth[Clerk Auth] -.-> UI
        Webhook[SVIX Webhook] -.-> Sync
    end

    style User fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Engine fill:#f0f4ff,stroke:#58a6ff,stroke-width:1px
    style Security fill:#fff5f5,stroke:#ff6b6b,stroke-width:1px
```

---

## [02] Core Capabilities

### Prompt Architecture

- **Dynamic Variable Injection**: Schema-aware support for `Text`, `Number`, `Choices`, and `Lists`.
- **Structural Integrity**: Strict versioning and draft/publish workflows.
- **Live Context Rendering**: Real-time evaluation of prompt templates with active variables.

### Distribution & Lifecycle

- **Semantic Routing**: Human-readable, SEO-optimized slugs for prompt discovery.
- **Collaborative Workspaces**: Fine-grained visibility controls (Public vs. Private).
- **Metadata Engine**: Robust tagging and categorization for large-scale prompt libraries.

### Security Infrastructure

- **Unified Identity**: Enterprise-grade authentication via Clerk integration.
- **Edge Security**: SVIX-verified webhook synchronization for user data integrity.
- **Contextual Access**: Server-side permission enforcement on all data operations.

---

## [03] Infrastructure Stack

| Layer            | Implementation | Strategic Rationale                                     |
| :--------------- | :------------- | :------------------------------------------------------ |
| **Interface**    | Next.js 16     | SSR-first performance and optimized asset delivery.     |
| **Persistence**  | Convex         | Document-relational storage with native real-time sync. |
| **Logic Engine** | Effect         | Type-safe error handling and functional composition.    |
| **Identity**     | Clerk          | Decoupled auth management and multi-session support.    |
| **Design**       | Tailwind 4     | JIT-compiled utility-first styling with OKLCH support.  |
| **Components**   | shadcn/ui      | Radix-based accessible UI primitives.                   |

---

## [04] Local Deployment

### 1. Environment Initialization

```bash
git clone https://github.com/your-username/promptamist.git
cd promptamist
pnpm install
```

### 2. Service Configuration

Define local environment variables in `.env.local`:

```env
# Identity Provider
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Backend Sync
NEXT_PUBLIC_CONVEX_URL=https://...
CLERK_WEBHOOK_SECRET=whsec_...
```

### 3. Execution

```bash
# Terminal A: Background Services
npx convex dev

# Terminal B: Development Server
pnpm dev
```

---

## [05] Project Topology

```text
promptamist/
├── convex/             # Database schema, mutations, and actions
│   ├── authed/         # Authenticated API boundary
│   ├── private/        # Internal backend utilities
│   └── schema.ts       # Type-safe database definitions
├── src/
│   ├── app/            # Application layouts and page routing
│   ├── components/     # UI primitives and composite blocks
│   ├── lib/            # Effect logic and domain utilities
│   └── proxy.ts        # Client-side API orchestration
└── docs/               # Technical specifications
```

---

## [06] Governance & Quality

- **Linting**: Strict ESLint configuration for code consistency.
- **Types**: 100% TypeScript coverage with inferred API types.
- **Formatting**: Automated Prettier enforcement.
- **Testing**: Vitest suite for core logic validation.

---

## [07] License

Released under the [MIT License](LICENSE).
