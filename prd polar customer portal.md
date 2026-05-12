# Context & Environment
- **Tech Stack**: Next.js 16.2.4 (App Router), React 19.2.4, Tailwind CSS 4, shadcn/ui.
- **Dependencies**: Convex (v1.35.1), Clerk (`@clerk/nextjs` v7.2.3), Polar SDK (`@polar-sh/sdk` v0.47.1).
- **Existing Patterns**:
  - The application backend logic for retrieving the current user is fetched via Convex (`currentUser = useQuery(api.users.getCurrentUser)`).
  - The Polar backend logic for opening the customer portal session is already fully implemented as a server action: `createCustomerPortalSession()` exported from `src/app/actions/polar.ts`.
  - The header subscription button is located at `src/components/subscription/SubscriptionButton.tsx`.
  - UI components follow the shadcn/ui pattern and are located in `src/components/ui/`.
- **Relevant Tools & Skills**: `fallow` skill (for checking codebase health), `vercel-react-best-practices` skill (for Next.js App Router performance and patterns).

# Objective
Update the `SubscriptionButton` component to display a dropdown menu for "Pro" users instead of a static button. The dropdown should provide a clear action button allowing the user to navigate to the Polar Customer Portal to manage their subscription.

# Instructions
1. Update `src/components/subscription/SubscriptionButton.tsx` to conditionally wrap the button in a `DropdownMenu` when the user is on the "Pro" plan.
2. Import the necessary components from `@/components/ui/dropdown-menu`.
3. If the user is on the Free ("Hobby") plan, maintain the exact existing behavior: clicking the button should trigger `setShowUpgradeModal(true)`. It should not trigger a dropdown menu.
4. If the user is on the "Pro" plan, clicking the button should trigger the `DropdownMenuTrigger` instead of performing the previous no-op.
5. In the dropdown content for Pro users, add a `DropdownMenuItem` labeled "Manage Subscription".
6. Wire the "Manage Subscription" item to call the existing Server Action `createCustomerPortalSession()` from `src/app/actions/polar.ts`.
7. Implement `useTransition` to handle loading states smoothly while the portal session URL is being generated, and provide visual feedback to the user when clicked.

# Constraints & Guidelines
- Ensure that you use the existing Tailwind CSS classes for the `SubscriptionButton` so the aesthetic parity remains identical to the original design.
- Do not use `as any`; rely on type inference or define proper TypeScript interfaces.
- Execute changes with full React 19 / Next.js Server Action best practices.
- Use `pnpm` as the package manager if executing commands.
