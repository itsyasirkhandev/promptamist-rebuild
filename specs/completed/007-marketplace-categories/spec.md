# Marketplace Categories Specification

**1. Problem Statement**
As the Promptamist marketplace grows, users need a way to browse and discover public prompts tailored to specific use cases. Currently, there is only a search bar and tag filtering, but no high-level category organization. Owners sharing prompts need a standard set of categories to classify their contributions, ensuring that the community can easily navigate and find high-quality templates for their specific needs (e.g., programming, creative writing, marketing, productivity).

**2. Functional Requirements**

- **Standardized Categories**:
  - The system will support a fixed list of high-level categories:
    1. **General** (Value: `general`, Label: `General`) - The fallback and default category.
    2. **Productivity** (Value: `productivity`, Label: `Productivity`)
    3. **Development** (Value: `development`, Label: `Development`)
    4. **Marketing** (Value: `marketing`, Label: `Marketing`)
    5. **Creative** (Value: `creative`, Label: `Creative`)
    6. **Education** (Value: `education`, Label: `Education`)
- **Owner Category Selection**:
  - In the Prompt Create/Edit forms, within the **Settings** card, a category selector (e.g., standard custom select or dropdown) will appear.
  - **Visibility**: The category selector is context-dependent and will **only** be visible when the **Make Public** toggle is switched **ON**. If "Make Public" is turned off, the category selector will be hidden.
  - **Default Value**: By default, the category field will be set to **General**.
  - **Validation**: When submitting the form, if the prompt is set to public (`isPublic` is `true`), a valid category must be saved.
- **Database Schema & Schema Fallback**:
  - Add an optional `category` field of type `v.optional(v.string())` to the `prompts` table in `convex/schema.ts`.
  - To prevent needing an immediate full database migration and maintain backward compatibility, the API DTO layer will dynamically default any missing or undefined `category` field to `'general'` when serving public prompts.
- **Marketplace Filters**:
  - Introduce a modern, visually stunning, horizontal scrollable row of aesthetic pill buttons/tabs at the top of the Marketplace page.
  - The tabs will include: **All**, followed by the 6 standard categories: **General**, **Productivity**, **Development**, **Marketing**, **Creative**, and **Education**.
  - **All** will be selected by default.
  - When a user clicks a category pill:
    - The active category pill is highlighted using premium styling (vibrant accent border/background, smooth scale micro-animation).
    - The marketplace results are filtered to only display prompts belonging to the selected category.
    - If "All" is selected, prompts from all categories are displayed.
  - **Search Synergy**: The category filter must work seamlessly alongside the existing search input query. Searching while a category is active will search _only_ within that active category.

**3. Inputs and Outputs: Primary Actions**

- **USER ACTION**: Toggles "Make Public" switch **ON** in Create/Edit Prompt Form.
  - **SYSTEM BEHAVIOR**: Smoothly animates/slides open the Category Select dropdown under the toggle. The dropdown is populated with the 6 standard categories, and **General** is pre-selected.
- **USER ACTION**: Toggles "Make Public" switch **OFF** in Create/Edit Prompt Form.
  - **SYSTEM BEHAVIOR**: Smoothly hides/collapses the Category Select dropdown.
- **USER ACTION**: Saves the prompt with "Make Public" set to **ON** and category set to **Productivity**.
  - **SYSTEM BEHAVIOR**: Saves the prompt document in the Convex DB with `isPublic: true` and `category: "productivity"`. Shows a success toast notification and redirects the user back to their prompts list.
- **USER ACTION**: Visits the Public Marketplace page.
  - **SYSTEM BEHAVIOR**: Loads all public prompts. Displays the category pills with **All** selected and highlighted.
- **USER ACTION**: Clicks the **Development** category pill on the Marketplace.
  - **SYSTEM BEHAVIOR**: Sets the active category filter to `development`, fetches/filters prompts belonging to the `development` category, and displays them. The **Development** pill animates to an active visual state.

**4. Constraints**

- **UI & UX Constraints**:
  - Responsive design: The category pills row must support smooth horizontal touch scrolling/swipe on mobile screens without breaking the page layout.
  - Aesthetic excellence: The dropdown and active category pills must feature premium, curated color matching (e.g., harmonious HSL-based styles matching Promptamist's design system) and micro-animations.
- **Performance Constraints**:
  - Category filtering should load and render rapidly, matching the responsiveness of the existing marketplace search.

**5. Edge Cases and Error Handling**

- **Undefined Categories (Backward Compatibility)**:
  - If a public prompt in the database lacks a category (existing prompts), the server and client will dynamically treat it as belonging to the **General** category. It will appear when the **General** or **All** filters are selected.
- **No Prompts in Category (Empty State)**:
  - If a user selects a category (e.g., _Education_) and there are no prompts in that category, display an aesthetically beautiful empty state: "No prompts in this category yet. Be the first to share one!", along with a prominent illustrative icon.
- **Network / Load Failures**:
  - Handle query loading states with custom skeletons matching the grid cards of the marketplace. Show a clean error notification if Convex queries fail.

**6. Acceptance Criteria**

- Users can create a new prompt, toggle it public, select a category, and verify that the category is correctly saved.
- Users can edit an existing prompt, toggle it public, see the category select dropdown appear defaulted to "General", modify it (e.g. to "Creative"), and successfully save it.
- The Marketplace displays a horizontal row of category pills (All, General, Productivity, Development, Marketing, Creative, Education).
- Selecting a category pill filters the prompts dynamically. Selecting "All" resets the filter.
- Selecting a category pill and typing in the search bar combines both filters (e.g. searching "React" in "Development" category).
- Any existing public prompt without an assigned category defaults to "General" and is displayed when "All" or "General" is active.
