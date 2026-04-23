# Tasks: Dynamic Field Default Values

## Phase 1: Backend & Schema

- [x] [Phase 1] Update `convex/schema.ts` to add `defaultValue: v.optional(v.string())` to the `variables` array object in the `prompts` table.

## Phase 2: Editor UI (Configuring Default Value)

- [x] [Phase 2] Update `Variable` interfaces to include `defaultValue?: string;` across `src/components/prompts/PromptEditor.tsx`, `src/components/prompts/VariableList.tsx`, and `src/components/prompts/SortableVariableItem.tsx`.
- [x] [Phase 2] In `src/components/prompts/VariableConfigModal.tsx`, update `variableSchema` to include `defaultValue: z.string().optional()`.
- [x] [Phase 2] In `src/components/prompts/VariableConfigModal.tsx`, update form UI to include a "Default Value" input field, conditionally rendering as `Input`, `Textarea`, or `Select` based on `selectedType`. Ensure it's included in `onConfirm`.
- [x] [Phase 2] In `src/components/prompts/SortableVariableItem.tsx`, display an indicator (e.g., small badge or text) if a variable has a default value configured.

## Phase 3: Private Prompt Execution

- [x] [Phase 3] Update `PromptVariable` interface in `src/app/(protected)/prompts/[id]/use/page.tsx` to include `defaultValue?: string;`.
- [x] [Phase 3] In `src/app/(protected)/prompts/[id]/use/page.tsx`, initialize `useForm` with default values and add a `React.useEffect` to call `reset(defaults)` once the prompt data is loaded, populating the inputs and live preview.

## Phase 4: Public Prompt Execution

- [x] [Phase 4] Update `Variable` interface in `src/components/prompts/PublicPromptClient.tsx` to include `defaultValue?: string;`.
- [x] [Phase 4] In `src/components/prompts/PublicPromptClient.tsx`, add a `React.useEffect` to populate `variableValues` state with defaults when the prompt data is loaded.
