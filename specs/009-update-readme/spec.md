# Spec: Project README Update

## 1. Problem Statement

The current `README.md` for Promptamist, while functional, does not fully reflect the professional quality and technical depth of the project. As the repository evolves, it needs a high-fidelity documentation hub that clearly communicates its value proposition, modern tech stack (Next.js 16+, Convex, Clerk, Tailwind CSS 4), and detailed feature set to both users and potential contributors.

## 2. Functional Requirements

### 2.1 Content Sections

The updated `README.md` must include the following sections:

- **Hero Section**: Project logo (if available), catchy tagline, and status badges (Build, License, etc.).
- **Project Overview**: A concise explanation of "What is Promptamist?" and the primary problem it solves. Highlight the sophisticated architecture combining functional programming and real-time synchronization.
- **Key Features**: A detailed, categorized list of features:
  - **Prompt Management**: Organization, tags, search.
  - **Dynamic Variables**: Support for Text, Number, Textarea, Choices, and List types with drag-and-drop reordering powered by `@dnd-kit`.
  - **Sharing & Collaboration**: Public/Private prompts, unique slug generation.
  - **User Experience**: Clerk-powered authentication, Responsive UI with Tailwind 4 and Shadcn.
  - **Backend Architecture**: Type-safe functional programming using the `Effect` library for robust business logic.
- **Tech Stack**: Explicitly mention the core technologies:
  - **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4.
  - **Backend**: Convex (Real-time database and functions).
  - **Auth**: Clerk (User management and security).
  - **UI Components**: Shadcn UI, Radix UI, Lucide Icons, `@dnd-kit`.
  - **Core Logic**: `Effect` library for functional effects and error handling.
- **Development Setup**:
  - Prerequisites (Node.js, pnpm).
  - Step-by-step installation.
  - Environment variable configuration (Clerk & Convex).
  - **Clerk Webhook Setup**: Instructions for configuring `CLERK_WEBHOOK_SECRET` and the `/clerk-users-webhook` endpoint to ensure user data synchronization.
  - Running the development environment (`pnpm dev` + `npx convex dev`).
- **Project Structure**: A high-level tree view or guide to the `src/` and `convex/` directories.
- **Documentation**: Reference to deeper guides in the `docs/` folder (e.g., `AUTHENTICATION.md`).
- **Commands Reference**: A table or list of common scripts (`build`, `lint`, `format`, `typecheck`, `check`).
- **Guidelines**: References to `GEMINI.md` and `DESIGN_GUIDELINES.md`, highlighting the **8pt Grid System** and **60/30/10 Color Rule**.
- **License**: MIT License information.

### 2.2 Aesthetic Requirements

- Use clear headings and subheadings.
- Use emojis sparingly but effectively to improve scannability.
- Utilize GitHub-flavored markdown features like callouts (Note/Warning/Tip) and badges.
- Ensure all links (e.g., to Convex, Clerk, or repo files) are correct and functional.

## 3. Inputs and Outputs

### 3.1 Inputs (Source of Truth)

- `package.json`: For versions and tech stack.
- `convex/schema.ts`: For data model and variable types.
- `convex/http.ts`: For webhook routing logic.
- `src/app/page.tsx`: For marketing copy and mission.
- `DESIGN_GUIDELINES.md`: For UI philosophy.
- `GEMINI.md`: For development workflows.

### 3.2 Output

- A revised `README.md` file in the root directory.

## 4. Constraints

- Must use `pnpm` as the primary package manager in all instructions.
- Must accurately reflect the use of Tailwind CSS v4 and Next.js 16+ patterns.
- Instructions must be compatible with Windows (PowerShell) as per project context.

## 5. Edge Cases and Error Handling

- **Missing Environment Variables**: The setup section must emphasize the necessity of `.env.local` and `CLERK_WEBHOOK_SECRET`.
- **Convex Initialization**: Clearly distinguish between starting the frontend and starting the Convex backend.
- **Stale Documentation**: Ensure the project structure reflects the actual file layout found during research.

## 6. Acceptance Criteria

- [ ] The README includes a clear value proposition for "Promptamist".
- [ ] All technologies (Next.js 16, Convex, Clerk, Tailwind 4, Effect) are explicitly listed.
- [ ] Variable types (Text, Number, etc.) and drag-and-drop sorting are mentioned.
- [ ] Setup instructions include Clerk Webhook configuration.
- [ ] Project structure correctly identifies `src/` and `convex/` roles.
- [ ] Commands like `pnpm check` are documented.
- [ ] The README looks professional and is easy to navigate.
- [ ] References to `DESIGN_GUIDELINES.md` (8pt grid, 60/30/10 rule) and `GEMINI.md` are present.
