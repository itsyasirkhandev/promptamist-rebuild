# Product Requirements Document (PRD)

## Target Users

- **AI Chatbot Users:** Individuals who interact frequently with AI and need to store/retrieve their best prompts.
- **AI Application Developers:** Developers working with frameworks like Langchain or LangGraph who need a repository for their system and user prompts.
- **Outreach Professionals:** Sales or marketing personnel who need to build, store, and reuse dynamic, templated outreach scripts.
- **User Goals:** Efficiently store, organize, and reuse prompts without losing track of their best work.
- **Pain Points:** Losing high-quality prompts over time or forgetting where they were saved across different notes and documents.

## MVP Scope

The MVP encompasses the core functionality already established:

- Secure user authentication (Sign In / Sign Up).
- The ability to store and manage static text prompts.
- The ability to construct and save dynamic prompts utilizing templated variables.
- _Out of Scope:_ Features beyond this core prompt management and sharing lifecycle are deferred for future iterations.

## Primary User Flow

1. **Discovery:** The user lands on the landing page and explores the value proposition.
2. **Onboarding:** Interested users click a Call-to-Action (CTA) button, redirecting them to the authentication flow (Sign Up / Log In).
3. **Dashboard Access:** Upon successful authentication, the user is presented with their primary dashboard.
4. **Creation & Management:** The user creates new prompts (static or dynamic), edits existing ones, and saves them to their account.

## Key Features

- **Static Prompts:** Ability to create and save static, plain-text prompts.
- **Dynamic Prompts:** Ability to create templated prompts with customizable dynamic variables.
- **Sharing & Public Prompts:** Ability to share prompts with others and mark specific prompts as public for broader use.
- **Subscription Upgrades:** Ability for users to upgrade their plan from Hobby to Pro tiers.
- **Prompt Editing:** Full CRUD capabilities to edit all saved prompts.
- **Public Prompt Usage:** Ability to discover and utilize public prompts created by the community.
- **Workspaces:** Ability to use the workspace feature to organize prompts effectively.

## Functional Requirements

- **Authentication:** Handled via Clerk.
- **Payments & Subscriptions:** Managed via Polar.sh for handling Pro plan upgrades.
- **Database & API:** Handled by Convex (utilizing `convex-helpers` for auth-related queries and mutations).
- **Form Management:** React Hook Form coupled with Zod for robust client-side validation.
- **Data Validation:** Zod utilized for both client and server-side schema validation.
- **Error Handling:** Robust error management using Effect TS.
- **Drag and Drop:** `dnd-kit` used for managing drag-and-drop functionality of dynamic variables in the prompt creation/editing views.

## Target Technical Shape

- **Framework:** Next.js (utilizing modern App Router patterns).
- **Backend:** Convex for real-time database and serverless functions.
- **Styling:** Tailwind CSS.
- **UI Components:** shadcn/ui for accessible, customizable components.
- **TypeScript:** Strict type checking to be enforced across the stack.
- **Architecture Constraints:** The current Next.js + Convex setup is confirmed as the stable foundation without further immediate architectural deviations.
