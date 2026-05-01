Project guidelines:

- use pnpm for the package manager
- when installing new packages, use 'pnpm add' instead of manually editing the package.json file

- when defining convex actions, queries, and mutations that are exposed to the client use the authed setup in `src/convex/authed`

- when defining convex actions, queries, and mutations that are called from the backend use the private setup in `src/convex/private`

- use modern react and nextjs patterns and primitives
- avoid 'as any' at all costs, try to infer types from functions as much as possible
- use tailwindcss for styling whenever possible, only resort to custom css if needed
- I am on windows so use powershell 5 for commands
- run 'pnpm lint' to check for linting errors and fix the linting errors and if the errore is fixable with --fix command then fix it, 'pnpm format' if files are not formated then only format the files that are not formated, and 'pnpm typecheck' to check for errors after making changes

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.

<!-- convex-ai-end -->