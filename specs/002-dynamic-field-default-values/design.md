# Design Plan: Dynamic Field Default Values

## 1. Objective

Implement the ability to set and use default values for dynamic fields (variables) in prompts. This allows prompt creators to provide typical values, reducing execution time and providing examples for users.

## 2. Tech Stack & Affected Areas

- **Frontend:** React, Next.js, React Hook Form, Tailwind CSS, Shadcn UI
- **Backend:** Convex (Schema & API)
- **State Management:** React Hook Form for editing, Convex queries for fetching.

## 3. High-Level Architecture

The feature requires a simple schema update to allow an optional `defaultValue` property on prompt variables. This property is then exposed in the variable configuration UI and utilized on the frontend usage pages to prepopulate input fields.

1. **Schema Layer:** Add `defaultValue` to the `variables` array objects in the `prompts` table.
2. **Editor UI:** Enhance `VariableConfigModal` to include an input for `defaultValue` that changes based on the selected field `type`.
3. **Execution UI (Private & Public):** Initialize `useForm` (private) or local state (public) with the `defaultValue` when a prompt is loaded.

## 4. Data Model

Update `convex/schema.ts` to include `defaultValue` in the `variables` array.

```typescript
// convex/schema.ts (Snippet)
variables: v.array(
  v.object({
    id: v.string(),
    name: v.string(),
    type: v.union(
      v.literal('text'),
      v.literal('number'),
      v.literal('textarea'),
      v.literal('choices'),
      v.literal('list'),
    ),
    options: v.optional(v.array(v.string())),
    defaultValue: v.optional(v.string()), // <--- Added
  }),
),
```

## 5. Core Design Decisions

- **Decision 1: Store `defaultValue` as a string**
  _Why:_ Even for numbers or lists, string representation is the simplest to handle during template interpolation (which operates on strings) and HTML input forms. Lists are comma-separated strings, and choices are single string options.
- **Decision 2: Backward Compatibility**
  _Why:_ By making `defaultValue` optional (`v.optional(v.string())`), existing templates without this property will continue to function without any migration scripts.
- **Decision 3: Matching Data Type in Configuration UI**
  _Why:_ To adhere to the specification ("support text input, matching the data type of the dynamic field"), the `VariableConfigModal` will render different input types for `defaultValue` (e.g., `Input type="number"` for numbers, `Textarea` for long text, `Select` for choices) just like the prompt execution pages do.

## 6. Core Functional Flows

### A. Configuring a Default Value

- **Trigger:** User clicks "Convert to Variable" or edits an existing variable in `PromptEditor`.
- **Action:** Opens `VariableConfigModal`.
- **UI:** A new section "Default Value" appears. The input component changes dynamically based on the "Field Type" (Text, Number, Textarea, Choices, List).
- **Save:** Forms saves the variable object with the `defaultValue` property.

### B. Private Prompt Execution (`UseTemplatePage`)

- **Trigger:** User opens `/prompts/[id]/use`.
- **State Init:** The `useForm` initialization is updated to populate default values based on `prompt.variables`.

```typescript
// src/app/(protected)/prompts/[id]/use/page.tsx
const { setValue, control, reset } = useForm<Record<string, string>>({
  defaultValues: React.useMemo(() => {
    if (!prompt || !prompt.variables) return {};
    return prompt.variables.reduce(
      (acc, v) => {
        if (v.defaultValue) acc[v.name] = v.defaultValue;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [prompt]),
});

// Since prompt loads async, reset the form when prompt data arrives
React.useEffect(() => {
  if (prompt?.variables) {
    const defaults = prompt.variables.reduce(
      (acc, v) => {
        if (v.defaultValue) acc[v.name] = v.defaultValue;
        return acc;
      },
      {} as Record<string, string>,
    );
    reset(defaults);
  }
}, [prompt, reset]);
```

### C. Public Prompt Execution (`PublicPromptClient`)

- **Trigger:** User opens `/p/[slug]`.
- **State Init:** The `variableValues` state is populated with defaults on mount.

```typescript
// src/components/prompts/PublicPromptClient.tsx
React.useEffect(() => {
  if (prompt?.isTemplate && prompt.variables) {
    const defaults: Record<string, string> = {};
    let hasDefaults = false;
    prompt.variables.forEach((v) => {
      if (v.defaultValue) {
        defaults[v.name] = v.defaultValue;
        hasDefaults = true;
      }
    });
    // Only set if we haven't already set user inputs
    if (hasDefaults) {
      setVariableValues((prev) =>
        Object.keys(prev).length === 0 ? defaults : prev,
      );
    }
  }
}, [prompt]);
```

## 7. Development Plan & File Changes

1. **`convex/schema.ts`**
   - Add `defaultValue: v.optional(v.string())` to the `variables` object in the `prompts` table.

2. **`src/components/prompts/VariableConfigModal.tsx`**
   - Update `variableSchema` to include `defaultValue: z.string().optional()`.
   - Update form UI to include a "Default Value" label and input field.
   - Use conditional rendering to show the correct input type (`Input`, `Textarea`, `Select`) based on `selectedType`.
   - Ensure the default value is included in the data returned by `onConfirm`.

3. **`src/components/prompts/PromptEditor.tsx`** & **`src/components/prompts/SortableVariableItem.tsx`** & **`src/components/prompts/VariableList.tsx`**
   - Update the `Variable` interface to include `defaultValue?: string;`.
   - In `SortableVariableItem.tsx`, optionally show a small badge or text if a default value exists.

4. **`src/app/(protected)/prompts/[id]/use/page.tsx`**
   - Update the `PromptVariable` interface.
   - Add a `React.useEffect` to call `reset(defaults)` once the `prompt` data is fetched, ensuring default values populate the form and live preview.

5. **`src/components/prompts/PublicPromptClient.tsx`**
   - Update the `Variable` interface.
   - Add a `React.useEffect` to set `variableValues` to their respective defaults when the `prompt` data loads, prior to user interaction.
