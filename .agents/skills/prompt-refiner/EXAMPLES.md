# Prompt Refiner Examples

## Example 1: Creating a React Component

**User Input:**
"Write a login page in React."

**Agent Output:**
Here is your refined prompt:

```markdown
# Context & Environment

- **Tech Stack**: Next.js (App Router), React, Tailwind CSS.
- **Dependencies**: Clerk for authentication, `lucide-react` for icons.
- **Existing Patterns**: All components use TypeScript and functional component definitions. Authentication state is handled via Clerk's `<SignIn />` or custom hooks.

# Objective

Create a responsive, accessible custom Login page component that integrates with our existing authentication setup.

# Instructions

1. Build a functional React component named `LoginPage`.
2. Include a form with fields for "Email Address" and "Password".
3. Include a "Sign In" submit button.
4. Add state management for the form fields using React hooks (`useState`).
5. Include basic client-side validation for email format and required fields.
6. Provide a placeholder `onSubmit` handler for the login logic.

# Constraints & Guidelines

- Use TypeScript and avoid `any` types.
- Use Tailwind CSS for styling to ensure a modern, centered, and mobile-responsive design.
- Ensure form inputs have appropriate HTML5 types (`type="email"`, `type="password"`) and `aria-labels`.
```

## Example 2: API Route Creation

**User Input:**
"make an api to save user profile data"

**Agent Output:**
Here is your refined prompt:

```markdown
# Context & Environment

- **Tech Stack**: Next.js, Convex (Backend-as-a-Service).
- **Dependencies**: `@convex-dev/server`, Clerk (for auth).
- **Existing Patterns**: All backend operations are defined as Convex mutations/queries in the `convex/` directory.

# Objective

Implement a Convex mutation to save or update user profile data in the database.

# Instructions

1. Create a new file or update an existing one in the `convex/` directory (e.g., `convex/users.ts`).
2. Define a `mutation` that accepts user profile arguments (e.g., name, bio).
3. Validate the input arguments using Convex's `v` validator.
4. Check the authentication state to ensure the user is logged in (using `ctx.auth`).
5. Write the logic to insert or update the user record in the database using `ctx.db`.

# Constraints & Guidelines

- Use TypeScript for all definitions.
- Implement robust error handling if the user is not authenticated.
- Follow Convex best practices for defining schemas and mutations.
```
