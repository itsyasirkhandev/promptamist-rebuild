Candidate 1: The Billing Provider Seam (Deepening Polar Billing Integration)
Files involved: convex/authed/polar.ts, convex/private/polar.ts, convex/users.ts
Problem: The Polar SDK initialization, customer creation, and fallback logic are duplicated across multiple actions (generateCheckoutUrl, generatePortalUrl, createPolarCustomerBackground). The current modules are shallow, forcing high-level actions to manage SDK credentials, conditional database mutations, and low-level API configurations.
Solution: Extract all billing mechanics behind a deep Billing Provider module. This establishes a clean billing seam with a high-leverage interface (e.g., ensureCustomer, createCheckoutSession, createBillingPortal). We will implement a concrete Adapter for Polar that handles the SDK intricacies.
Benefits:
Leverage: Callee actions get checkout and portal URLs with single, vendor-agnostic function calls.
Locality: Billing SDK configuration, network handling, and error translations are concentrated in one module.
Testability: Hiding the vendor behind a seam allows us to write mocks for the billing adapter, preventing external API calls to Polar during test suite runs.
Candidate 2: The User Stats Module (Consolidating Profile and Prompt Counter Mutations)
Files involved: convex/authed/userStats.ts, convex/authed/prompts.ts, convex/users.ts
Problem: Prompt writes (createPrompt, updatePrompt, deletePrompt) are tightly coupled with stats tracking. Callers in prompts.ts must manually calculate counter deltas (e.g., templates: args.isTemplate ? 1 : 0) and coordinate separate calls to both prompts.dal and userStats. This shallow interface leaks the responsibility of maintaining data consistency to the caller.
Solution: Deepen the prompt mutation handlers or the data-access-layer writes to automatically trigger, calculate, and apply the denormalized statistics changes within the same database transaction.
Benefits:
Leverage: Callers simply write or delete a prompt without needing to compute stats deltas, manage weekly rollover windows, or remember to invoke statistical tracking.
Locality: The business rules defining what increments stats (e.g. templates vs. public prompts) and the rollover time-windows live in one self-contained module.
Testability: Guarantees that no prompt write test can ever cause the user's statistics to drift out of sync.
Candidate 3: Enforcing and Deepening the Data Access Layer (DAL) Seam
Files involved: convex/publicPrompts.ts, convex/dal/users.dal.ts, convex/dal/prompts.dal.ts
Problem: While a dal folder exists to centralize raw ctx.db operations, the abstraction leaks. For example, convex/publicPrompts.ts bypasses the DAL and queries the database directly with ctx.db.get(prompt.userId) to fetch authors. Bypassing the DAL defeats the purpose of the layer and prevents us from enforcing schema-wide policies or caching.
Solution: Fully enforce the DAL seam by refactoring all direct ctx.db calls in business logic to route strictly through DAL methods, and extend the DAL to handle compound lookups (e.g., fetching a prompt along with its author profile).
Benefits:
Leverage: Business queries and mutations interact exclusively with clean, domain-focused methods (findUserById, listPromptsByUser) rather than low-level DB accessors.
Locality: Index specifications, query optimization constraints, and data-hiding invariants reside strictly inside the DAL files.
Testability: We can easily trace database read/write patterns and ensure consistent indexing is used across every entry point.