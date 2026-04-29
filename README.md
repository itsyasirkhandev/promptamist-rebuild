# Promptamist

<img width="1269" height="907" alt="image" src="https://github.com/user-attachments/assets/db96c269-2427-4d69-b719-be36d317525e" />

**Prompt Engineering as Code.** A professional, high-fidelity platform for managing, versioning, and sharing dynamic AI prompts with real-time synchronization.

[![pnpm](https://img.shields.io/badge/package--manager-pnpm-orange?style=flat-square)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Backend-Convex-ff6b6b?style=flat-square)](https://convex.dev/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## 🏗️ Project Overview

Promptamist is a prompt management system built for developers and prompt engineers who need more than just a text file. It treats prompts as dynamic assets, providing a type-safe, real-time environment for building complex LLM interactions.

### Why Promptamist?

- **Prompt Engineering as Code**: Prompts are structured, versioned, and dynamic.
- **Functional Core**: Built with the `Effect` library for robust, type-safe business logic.
- **Real-time Everything**: Powered by Convex for instant synchronization across all clients.
- **Developer First**: Optimized for speed, type-safety, and modern development workflows.

---

## ✨ Key Features

### 📝 Advanced Prompt Editor

- **Dynamic Variables**: Support for `Text`, `Number`, `Textarea`, `Choices`, and `List` types.
- **Drag & Drop**: Reorder variables intuitively using `@dnd-kit`.
- **Live Preview**: See how your prompt renders with current variable values in real-time.

### 🌐 Sharing & Collaboration

- **Public/Private Visibility**: Control who can see and use your prompt templates.
- **Slug Generation**: Human-readable, unique URLs for easy sharing (`/p/your-prompt-slug`).
- **Tags & Search**: Organize and find prompts quickly with a powerful tagging system.

### 🛡️ Secure & Scalable

- **Clerk Auth**: Enterprise-grade identity management and secure user flows.
- **Protected Actions**: Fine-grained access control for mutations and queries.
- **User Syncing**: Automatic data synchronization via Clerk Webhooks.

---

## 🛠️ Tech Stack

| Frontend                          | Backend                               | Functional Logic                |
| :-------------------------------- | :------------------------------------ | :------------------------------ |
| **Next.js 16** (App Router)       | **Convex** (Real-time DB & Functions) | **Effect** (Functional Effects) |
| **React 19** (Server Components)  | **Clerk** (Auth & Identity)           | **TypeScript 5** (Strict Mode)  |
| **Tailwind CSS 4** (OKLCH Colors) | **@dnd-kit** (Sortable Lists)         | **Zod** (Schema Validation)     |
| **shadcn/ui** (New York Style)    | **Svix** (Webhook Verification)       | **Lucide** (Iconography)        |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [pnpm](https://pnpm.io/) (`corepack enable pnpm`)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/promptamist.git
cd promptamist
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Convex URL (set automatically by npx convex dev)
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Webhook Secret (for Clerk user sync)
CLERK_WEBHOOK_SECRET=your_webhook_signing_secret
```

### 3. Clerk Webhook Configuration

> [!IMPORTANT]  
> **User Synchronization Required**  
> To keep the local `users` table in sync with Clerk, you must configure a webhook:
>
> 1. In Clerk Dashboard, go to **Webhooks**.
> 2. Add an endpoint: `https://<YOUR_CONVEX_DEPLOYMENT_URL>/clerk-users-webhook`.
> 3. Select `user.created` and `user.updated` events.
> 4. Copy the **Signing Secret** and add it to your `.env.local` (or Convex dashboard) as `CLERK_WEBHOOK_SECRET`.

### 4. Run Development Environment

You will need two terminal windows:

**Terminal 1: Backend**

```bash
npx convex dev
```

**Terminal 2: Frontend**

```bash
pnpm dev
```

---

## 📁 Project Structure

```text
promptamist/
├── convex/             # Backend: Schema, mutations, and webhooks
│   ├── authed/         # Client-facing protected functions
│   ├── private/        # Backend-only internal functions
│   ├── _generated/     # Auto-generated Convex types
│   ├── http.ts         # HTTP router (webhooks)
│   └── schema.ts       # Database definitions
├── src/
│   ├── app/            # Next.js App Router (Layouts, Pages)
│   ├── components/     # UI components (shadcn/ui + custom)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Shared utilities and Effect logic
│   └── proxy.ts        # Type-safe client proxies
├── docs/               # Technical documentation
└── specs/              # Feature specifications and designs
```

---

## 🎨 Design System

Promptamist adheres to a strict design language defined in `DESIGN_GUIDELINES.md`:

- **8pt Grid System**: All spacing (margins, padding, gaps) is divisible by 8 or 4.
- **60/30/10 Color Rule**: Balanced distribution using OKLCH colors for maximum accessibility.
- **Minimalist Typography**: Limited to 4 sizes and 2 weights (Regular, Semibold) for clarity.

---

## 🛠️ Development Workflow

We use a strict set of checks to maintain code quality:

| Command          | Description                              |
| :--------------- | :--------------------------------------- |
| `pnpm dev`       | Start Next.js development server         |
| `pnpm check`     | Run all checks (Lint, Typecheck, Format) |
| `pnpm lint`      | Run ESLint check                         |
| `pnpm typecheck` | Run TypeScript compiler check            |
| `pnpm format`    | Format codebase with Prettier            |
| `pnpm build`     | Create a production build                |

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
