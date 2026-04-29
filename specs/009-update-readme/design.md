# Design: README Update

## 1. Objective

Transform the current `README.md` into a high-fidelity documentation hub that accurately reflects Promptamist's modern architecture (Next.js 16, Tailwind 4, Effect, Convex) and professional design standards. The goal is to provide a "single source of truth" for developers and contributors that is both visually appealing and technically comprehensive.

## 2. Tech Stack & Tools

- **Framework**: Next.js 16.2.4 (App Router, React 19)
- **Styling**: Tailwind CSS 4.0.0-alpha.x (using `@theme` and OKLCH)
- **Backend**: Convex 1.35.1 (Real-time functions and DB)
- **Auth**: Clerk 7.2.3
- **Functional Programming**: Effect 4.0.0-beta.52
- **Drag & Drop**: @dnd-kit 6.3.1
- **Icons**: Lucide React, Iconify
- **Components**: shadcn/ui (New York style)

## 3. Layout Architecture

The README will follow a structured flow designed for quick onboarding and deep-dive technical understanding:

1.  **Hero Section**: Logo, centralized tagline, and status badges (pnpm, Next.js, License).
2.  **Elevator Pitch**: Concise project description focusing on "Prompt Engineering as Code".
3.  **Key Features**: Split into logical buckets (Management, Variables, Collaboration).
4.  **Tech Stack Showcase**: A visual grid highlighting the core pillars.
5.  **Technical Architecture**: Explanation of the functional approach using `Effect` and the real-time nature of Convex.
6.  **Getting Started**: Prerequisites, environment setup, and installation steps.
7.  **Clerk & Webhook Configuration**: Dedicated section for the critical user-sync logic.
8.  **Project Structure**: Navigational guide to the codebase.
9.  **Development Workflow**: Commands for linting, formatting, and type-checking.
10. **Design System**: Brief mention of the 8pt grid and 60/30/10 rule.
11. **License**.

## 4. Core Design Decisions

### 4.1 Visual Language

- **Tone**: Professional, direct, and senior-engineer oriented.
- **Iconography**: Use GitHub-flavored Markdown emojis (e.g., 🚀, 🛠️, 🏗️) sparingly to anchor sections.
- **Badges**: Use `img.shields.io` for status (Build, License, Node version, Package Manager).

### 4.2 Markdown Components

- **Callouts**: Use GitHub's alert syntax (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!TIP]`) for critical setup instructions.
- **Tech Grid**: Use a Markdown table with centered content for the tech stack to ensure alignment.
- **Code Blocks**: Always specify the language (e.g., `bash`, `ts`, `env`) for syntax highlighting.

## 5. Content Mockups

### 5.1 Tech Stack Grid Mockup

| Frontend                     | Backend               | Functional Logic |
| :--------------------------- | :-------------------- | :--------------- |
| Next.js 16 (App Router)      | Convex (Real-time DB) | Effect Library   |
| React 19 (Server Components) | Clerk (Identity)      | TypeScript 5     |
| Tailwind CSS 4               | @dnd-kit (Sortable)   | Zod (Validation) |

### 5.2 Project Structure Tree

```text
promptamist/
├── convex/             # Backend functions, schema, and webhooks
│   ├── authed/         # Client-facing protected functions
│   ├── private/        # Backend-only internal functions
│   └── schema.ts       # Database definitions
├── src/
│   ├── app/            # Next.js App Router (Pages & Layouts)
│   ├── components/     # UI components (shadcn/ui + custom)
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Shared utilities and Effect logic
├── docs/               # Deep-dive documentation
└── specs/              # Feature specifications and designs
```

### 5.3 Webhook Setup Instructions (Mockup)

> [!IMPORTANT]
> **Clerk Webhook Synchronization**
> To keep the local `users` table in sync with Clerk, you must configure a webhook:
>
> 1. In Clerk Dashboard, go to **Webhooks**.
> 2. Add an endpoint: `https://<YOUR_CONVEX_URL>/clerk-users-webhook`.
> 3. Select `user.created` and `user.updated` events.
> 4. Copy the **Signing Secret** to your `.env.local` as `CLERK_WEBHOOK_SECRET`.

## 6. Functional Flows (Development Setup)

1.  **Clone & Install**: `git clone` -> `pnpm install`.
2.  **Environment Setup**: Create `.env.local` with Clerk and Convex keys.
3.  **Backend Sync**: Run `npx convex dev` to push the schema and start the backend.
4.  **Frontend Start**: Run `pnpm dev` in a separate terminal.
5.  **Validation**: Run `pnpm check` to ensure code quality before commits.

## 7. Validation Strategy

- **Hyperlink Audit**: Manually verify all links to external documentation (Convex, Clerk, Effect).
- **Command Verification**: Ensure `pnpm check` and `pnpm dev` work exactly as described on a clean environment.
- **File Path Check**: Verify the "Project Structure" tree accurately reflects the current directory state.
- **Markdown Rendering**: Preview the final file in a GitHub-compliant environment to ensure alerts and badges render correctly.
