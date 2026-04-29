# Feature 002: Visual Differentiation for Variable Types - Technical Design

## 1. Objective

Implement visual differentiation for the 5 dynamic variable types (`text`, `number`, `textarea`, `choices`, `list`) throughout the prompt editing and consumption flows. This includes creating a centralized color mapping for badges and input elements, and applying these mappings so that variables can be instantly identified by their appearance.

## 2. Tech Stack

- **Next.js / React**: For the UI components (`SortableVariableItem`, `PublicPromptClient`, and `/use` page).
- **Tailwind CSS**: For styling. A static color dictionary will be exported to ensure classes are not purged and correctly applied for dark and light modes.

## 3. High-Level Architecture

1. **Central Configuration (`src/lib/variables.ts`)**: Define a constant object providing the specific Tailwind classes for `badge` and `input`. Export a helper function to retrieve these classes safely.
2. **Editor UI (`src/components/prompts/SortableVariableItem.tsx`)**: Apply the `badge` classes to the variable type label, turning it into a distinct pill/badge.
3. **Consumption UI (`src/app/(protected)/prompts/[id]/use/page.tsx` & `src/components/prompts/PublicPromptClient.tsx`)**: Apply the `input` classes to the rendered `Input`, `Textarea`, and `Select` elements so that their focus rings (and potentially borders) correspond to the variable type colors.

## 4. Data Model

No changes to the Convex database models are required. The prompt variables arrays already enforce the correct types (`'text' | 'number' | 'textarea' | 'choices' | 'list'`).

## 5. Core Design Decisions

- **Tailwind Safelisting via Object Mapping**: Instead of editing `safelist` in `tailwind.config.ts`, we map explicit strings in a central TypeScript object (`src/lib/variables.ts`). This ensures the exact needed utility classes are bundled and is easier to maintain.
- **Subtle Forms vs Distinct Badges**:
  - Form inputs receive subtle styling (`focus-visible:ring-{color}-500/50`) so they do not overwhelm the page context.
  - Badges use solid light backgrounds (e.g., `bg-blue-100`) and darker text for clear, immediate visual recognition.
- **Fallback Handlers**: Any malformed or legacy variable type string will safely fall back to neutral secondary gray styling using the default `ring-primary`.

## 6. Core Functional Flows

1. **Resolving Variable Appearance**:
   - A helper `getVariableColorConfig(type: string)` resolves the target variable string to an object containing `{ badge, input }` full Tailwind class names.
2. **UI Implementation**:
   - `SortableVariableItem` dynamically appends `.badge` classes.
   - Consumers (`page.tsx` and `PublicPromptClient.tsx`) dynamically append `.input` classes to UI primitives.

## 7. Development Plan

### Step 1: Centralized Configuration

**Target File**: `src/lib/variables.ts`
Add the configuration mapping and helper function:

```typescript
import type { Doc } from '../../convex/_generated/dataModel';

export type VariableType = Doc<'prompts'>['variables'][number]['type'];

export const variableTypeColors: Record<
  VariableType,
  { badge: string; input: string }
> = {
  text: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    input: 'focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50',
  },
  number: {
    badge:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    input:
      'focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50',
  },
  textarea: {
    badge:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    input:
      'focus-visible:ring-purple-500/50 dark:focus-visible:ring-purple-500/50',
  },
  choices: {
    badge:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    input:
      'focus-visible:ring-orange-500/50 dark:focus-visible:ring-orange-500/50',
  },
  list: {
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    input: 'focus-visible:ring-rose-500/50 dark:focus-visible:ring-rose-500/50',
  },
} as const;

export function isVariableType(type: string): type is VariableType {
  return type in variableTypeColors;
}

export function getVariableColorConfig(type: string | VariableType) {
  if (isVariableType(type)) {
    return variableTypeColors[type];
  }
  return {
    badge: 'bg-secondary/30 text-muted-foreground',
    input: 'focus-visible:ring-ring', // standard default
  };
}
```

### Step 2: Editor Updates

**Target File**: `src/components/prompts/SortableVariableItem.tsx`

- Import `getVariableColorConfig` from `@/lib/variables`.
- Update the `<p>` tag rendering `{variable.type}` to use badge styling:

```tsx
const colors = getVariableColorConfig(variable.type);
// ...
<p
  className={`rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${colors.badge}`}
>
  {variable.type}
</p>;
```

### Step 3: Authenticated Form Updates

**Target File**: `src/app/(protected)/prompts/[id]/use/page.tsx`

- Import `getVariableColorConfig`.
- Inside the `renderVariableInput` mapping function:
  ```tsx
  const colors = getVariableColorConfig(v.type);
  ```
- Pass `className={colors.input}` to:
  - `<Input>` in `text` block
  - `<Input>` in `number` block
  - `<Textarea>` in `textarea` block
  - `<SelectTrigger>` in `choices` block
  - `<Input>` in `list` block

### Step 4: Public Form Updates

**Target File**: `src/components/prompts/PublicPromptClient.tsx`

- Import `getVariableColorConfig`.
- Inside the `(prompt.variables as Variable[]).map((variable) => ...)` loop:
  ```tsx
  const colors = getVariableColorConfig(variable.type);
  ```
- Pass `className={colors.input}` to:
  - `<Input>` in `text` block
  - `<Input>` in `number` block
  - `<Textarea>` in `textarea` block
  - `<SelectTrigger>` in `choices` block
  - `<Input>` in `list` block
