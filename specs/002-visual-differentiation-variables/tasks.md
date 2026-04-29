# Feature 002: Visual Differentiation for Variable Types - Implementation Tasks

## Phase 1: Foundation (Core Utilities)

### Task 1.1: Create Centralized Configuration for Variable Colors

- **Target File**: `src/lib/variables.ts`
- **Action**: Add the configuration mapping and helper functions for variable colors.
- **Details**:
  - Import `Doc` from `../../convex/_generated/dataModel`.
  - Export `VariableType` type derived from `Doc<"prompts">["variables"][number]["type"]`.
  - Define `variableTypeColors` constant object (as shown in the design doc) containing `badge` and `input` Tailwind classes for `text`, `number`, `textarea`, `choices`, and `list` types. Ensure it's exported as `const`.
  - Create and export an `isVariableType(type: string): type is VariableType` type guard function.
  - Create and export a `getVariableColorConfig(type: string | VariableType)` function that returns the `{ badge, input }` colors based on the type, with a standard default fallback.
- **Validation**: Ensure `src/lib/variables.ts` has no TypeScript errors and correctly exports the variables.

## Phase 2: Frontend (Editor and Consumption UIs)

### Task 2.1: Update Editor UI Badges

- **Target File**: `src/components/prompts/SortableVariableItem.tsx`
- **Action**: Apply the badge styling to the variable type label.
- **Details**:
  - Import `getVariableColorConfig` from `@/lib/variables`.
  - Within the component, call `getVariableColorConfig(variable.type)` to get the `colors` object.
  - Update the `<p>` tag rendering `{variable.type}`. Add the `colors.badge` to the `className` string. Include foundational styling like `text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded font-medium`.
- **Validation**: Open a prompt in the editor (`/prompts/[id]/edit` or similar depending on routing) and visually verify that the variable type text looks like a distinctive badge.

### Task 2.2: Update Authenticated Consumption UI Inputs

- **Target File**: `src/app/(protected)/prompts/[id]/use/page.tsx`
- **Action**: Apply `input` ring styles based on variable type.
- **Details**:
  - Find the mapping block where input fields are rendered for each variable in the prompt execution form (e.g., `renderVariableInput` mapping).
  - Import `getVariableColorConfig` from `@/lib/variables`.
  - Inside the mapping logic, retrieve the colors using `const colors = getVariableColorConfig(v.type);`.
  - Append `colors.input` to the `className` prop of the respective form controls (`<Input>`, `<Textarea>`, `<SelectTrigger>`) inside the `text`, `number`, `textarea`, `choices`, and `list` switch cases.
- **Validation**: Go to the `/use` page for a prompt with various variable types and verify the focus rings color-match the corresponding types.

### Task 2.3: Update Public Consumption UI Inputs

- **Target File**: `src/components/prompts/PublicPromptClient.tsx`
- **Action**: Apply `input` ring styles to the public prompt form.
- **Details**:
  - Import `getVariableColorConfig` from `@/lib/variables`.
  - Locate the loop `(prompt.variables as Variable[]).map((variable) => ...)` or similar where form controls are generated.
  - Retrieve the color configuration: `const colors = getVariableColorConfig(variable.type);`.
  - Append `colors.input` to the `className` of the respective controls (`<Input>`, `<Textarea>`, `<SelectTrigger>`) corresponding to `text`, `number`, `textarea`, `choices`, and `list` types.
- **Validation**: Open a public prompt link and verify focus rings on inputs match the specific variable type color scheme.

## Phase 3: Polish

### Task 3.1: Final Verification & Code Quality

- **Target Files**: All modified files.
- **Action**: Run linting, formatting, and type-checking.
- **Details**:
  - Run `pnpm typecheck` to ensure there are no missing types or interface mismatches from the `VariableType` changes.
  - Run `pnpm lint --fix` and `pnpm format` to conform to project standards.
- **Validation**: Commands pass without outputting any errors or warnings.
