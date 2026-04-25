# 🖋️ Promptamist

You struggle to manage, share, and test your LLM prompts. They get lost in random notes or long chat histories. When you lose a great prompt, you waste hours trying to recreate it. You cannot easily share your best work with others, and testing new ideas feels slow and messy.

We built Promptamist to solve this. We give you one place to write, test, and share your prompts with exact precision. 

## Manage Your Prompts Like a Pro

- **Organize your library:** Create, edit, and sort your prompts in one central place.
- **Test new ideas:** Use dynamic variables like text, numbers, and lists to experiment quickly.
- **Share your work:** Generate unique links to show your best prompts to the world.
- **Reuse your favorites:** Save your top prompts as templates and load them instantly.
- **Secure your data:** Log in safely and manage your profile with ease.
- **Work anywhere:** Enjoy a clean, fast interface that looks great on any screen.

## How We Built It

- **Frontend:** Build fast pages with Next.js, React 19, and Tailwind CSS 4.
- **Backend:** Sync your data in real-time with Convex.
- **Authentication:** Keep your account safe using Clerk.
- **UI & Icons:** Create beautiful screens with Radix UI, shadcn/ui, and Lucide React.

## Start Building Today

### What You Need First

- Install Node.js on your machine.
- Install pnpm by running `npm install -g pnpm`.

### Set Up Your Workspace

1. **Clone the repository:**
   ```bash
   git clone https://github.com/itsyasirkhandev/promptamist-rebuild.git
   cd promptamist
   ```

2. **Install the dependencies:**
   ```bash
   pnpm install
   ```

3. **Add your keys:**
   Create a `.env.local` file in the root directory. Add your Clerk and Convex keys to it:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CONVEX_DEPLOYMENT=your_convex_deployment_url
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   ```

### Launch Your App

1. **Start the backend server:**
   ```bash
   npx convex dev
   ```

2. **Start the frontend server:**
   ```bash
   pnpm dev
   ```

Open your browser and go to `http://localhost:3000`.

## Find Your Way Around

- Check the `src/app` folder for your pages and layouts.
- Open `src/components` to find the building blocks of the UI.
- Look inside `convex` to see your database rules and backend logic.
- Read the files in `specs` to understand the technical plans for new features.

## Run These Commands

- `pnpm dev`: Start your local development server.
- `pnpm build`: Prepare your app for production.
- `pnpm lint`: Find and fix code issues.
- `pnpm typecheck`: Catch type errors before they break your app.
- `pnpm format`: Make your code look clean and consistent.
- `pnpm check`: Run lint, typecheck, and format all at once.

## Help Us Improve

We want your help! Open an issue first to tell us what you want to change. Then, submit a Pull Request with your updates.

## License

We license this project under the MIT License. Read the LICENSE file to learn more.