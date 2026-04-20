# Design Plan: Prompt Creation and Templating

Technical specification for implementing a robust prompt management and templating system using Next.js 16, Convex, and Tailwind CSS 4.

### 1. Objective

Enable users to author, categorize, and reuse prompts. Specifically, provide a mechanism to turn static text into dynamic templates with configurable variables, reducing repetitive tasks and improving prompt engineering workflows.

### 2. Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack default)
- **React**: 19.2.4 (React Compiler enabled)
- **Backend**: Convex 1.35.1 (Real-time database and serverless functions)
- **Styling**: Tailwind CSS 4 (CSS-first configuration)
- **Forms**: React Hook Form with Zod 4 validation
- **Auth**: Clerk 7.2.3 (integrated via `src/proxy.ts`)

**Why this stack?**

- **Next.js 16**: Leverages the new explicit caching model (`use cache`) and async dynamic APIs for better performance.
- **Convex**: Provides seamless real-time updates for prompt lists and easy relational data management between users and prompts.
- **Tailwind 4**: Offers a modernized styling approach with improved performance and easier theme management using CSS variables.

### 3. High-Level Architecture

- **Prompt Editor (`/create`)**: A complex client-side interface for managing prompt content, tags, and variable definitions.
- **Template Runner (`/prompts/[id]/use`)**: A dedicated interface for generating final prompts from templates via dynamic form inputs and live preview.
- **Convex API Layer**:
  - `src/convex/authed/prompts.ts`: Public-facing mutations and queries for prompt management.
  - `src/convex/schema.ts`: Defines the `prompts` table and its relationships.

**ARCHITECTURE FLOW**:
`User -> Next.js Page -> Convex Mutation -> Database (prompts) -> Real-time Update -> Prompt List`
`Template Usage -> Fetch Prompt -> Generate Dynamic Zod Schema -> React Hook Form -> Live Interpolation -> Preview`

### 4. Data Model

**Convex Schema (`convex/schema.ts`)**:

```typescript
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const promptSchema = {
  prompts: defineTable({
    userId: v.id('users'),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    isTemplate: v.boolean(),
    variables: v.array(
      v.object({
        id: v.string(), // Client-side UUID
        name: v.string(),
        type: v.union(
          v.literal('text'),
          v.literal('number'),
          v.literal('textarea'),
          v.literal('choices'),
          v.literal('list'),
        ),
        options: v.optional(v.array(v.string())),
      }),
    ),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_and_title', ['userId', 'title']),
};
```

**TypeScript Interfaces**:

```typescript
type VariableType = 'text' | 'number' | 'textarea' | 'choices' | 'list';

interface PromptVariable {
  id: string;
  name: string;
  type: VariableType;
  options?: string[];
}

interface Prompt {
  title: string;
  content: string;
  tags: string[];
  isTemplate: boolean;
  variables: PromptVariable[];
}
```

### 5. Core Design Decisions

- **Decision 1: Variable Syntax**: Use double curly braces `{{variable_name}}` as the placeholder syntax. It is industry-standard and easy to parse via regex.
- **Decision 2: Variable Highlighting**: Use a `contenteditable` div or a "Mirror Layer" over a `textarea`. Given the "Convert to Variable" requirement, a `contenteditable` div provides the best control over the Selection API and allows wrapping placeholders in styled `<span>` elements without full Rich Text complexity.
- **Decision 3: Async Dynamic APIs**: In Next.js 16, `params` and `searchParams` are async. The `/prompts/[id]/use` page will await `params` before fetching data from Convex.
- **Decision 4: Validation**: Use Zod 4 to enforce unique variable names and valid option lists for `choices`/`list` types.

### 6. Core Functional Flows

#### A. Variable Selection and Insertion

1.  **Detection**: Monitor `onSelect` on the editor. Enable "Convert to Variable" button only if `window.getSelection().toString()` is non-empty.
2.  **Insertion Logic**:
    ```typescript
    const insertVariable = (name: string) => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'bg-primary/20 text-primary rounded px-1 font-mono';
      span.textContent = `{{${name}}}`;
      span.dataset.variableId = variableId;
      range.deleteContents();
      range.insertNode(span);
    };
    ```

#### B. Template Usage & Live Preview

1.  **Dynamic Form**: Generate form fields based on the `variables` array.
2.  **Live Interpolation**:
    ```typescript
    const preview = content.replace(/{{(..*?)}}/g, (match, name) => {
      return (
        formValues[name] ||
        `<span class="text-muted-foreground opacity-50">${match}</span>`
      );
    });
    ```
3.  **Next.js 16 Caching**: Use the `"use cache"` directive on the preview component to ensure rapid updates without server-side lag.

### 7. Development Plan

1.  **Database & Schema**:
    - Update `convex/schema.ts` with the `prompts` table.
    - Implement `src/convex/authed/prompts.ts` (CRUD operations).
2.  **Prompt Creation UI (`/create`)**:
    - Build `PromptEditor` with `contenteditable` logic.
    - Implement `VariableConfigModal` for defining name, type, and options.
    - Integrate React Hook Form for title, tags, and template toggle.
3.  **Prompt Management UI (`/prompts`)**:
    - Build the list view with search and tag filtering.
    - Implement "Copy" (static) and "Use" (template) actions.
4.  **Template Usage UI (`/prompts/[id]/use`)**:
    - Implement split-screen layout with Tailwind 4 Grid.
    - Dynamic form generation from prompt metadata.
    - Live preview panel with copy-to-clipboard functionality.
5.  **Validation & Polish**:
    - Add Zod validation for all forms.
    - Implement deletion confirmation dialogs.
    - Add toast notifications for success/error states.
