# 🖋️ Promptamist

> Master the art of prompting. Manage, share, and iterate on your LLM prompts with precision.

Promptamist is a modern platform designed for LLM enthusiasts and prompt engineers. It provides a robust suite of tools to manage your prompt library, experiment with dynamic variables, and share your best prompts with the community.

## ✨ Features

- **Prompt Management**: Effortlessly create, edit, and organize your prompt library (CRUD).
- **Advanced Variables**: Support for multiple dynamic variable types including `text`, `number`, `textarea`, `choices`, and `list`.
- **Public Sharing**: Generate unique, shareable slugs for your prompts to showcase your work publicly.
- **Prompt Templates**: Mark your favorite prompts as templates for easy reuse and iteration.
- **User Profiles**: Secure authentication and profile management powered by Clerk.
- **Modern UI**: A clean, responsive, and accessible interface built with Tailwind CSS 4 and Radix UI.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: [Convex](https://www.convex.dev/) (Database & Real-time Functions)
- **Authentication**: [Clerk](https://clerk.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- [pnpm](https://pnpm.io/) installed (`npm install -g pnpm`)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/itsyasirkhandev/promptamist-rebuild.git
    cd promptamist
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Clerk and Convex keys:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    CONVEX_DEPLOYMENT=your_convex_deployment_url
    NEXT_PUBLIC_CONVEX_URL=your_convex_url
    ```

### Running the Application

1.  **Start the backend (Convex):**

    ```bash
    npx convex dev
    ```

2.  **Start the frontend (Next.js):**
    ```bash
    pnpm dev
    ```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: UI components (built with shadcn/ui and custom logic).
- `convex`: Backend schema definitions and functions (queries, mutations, actions).
- `specs`: Technical specifications and design documents for project features.

## 📜 Available Scripts

- `pnpm dev`: Starts the Next.js development server.
- `pnpm build`: Builds the application for production.
- `pnpm lint`: Runs ESLint for code quality checks.
- `pnpm typecheck`: Runs TypeScript's type checker.
- `pnpm format`: Formats code using Prettier.
- `pnpm check`: Runs linting, type checking, and formatting checks simultaneously.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details. (Placeholders)
