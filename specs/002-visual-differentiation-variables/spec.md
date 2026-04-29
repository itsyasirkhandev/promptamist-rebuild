# Feature 002: Visual Differentiation for Variable Types

## 1. Problem Statement

Users have difficulty differentiating between various dynamic variable types (`text`, `number`, `textarea`, `choices`, `list`) when managing them or filling them out. Currently, all variables look identical in lists and configuration forms, which requires users to read carefully to understand the expected input format. The goal is to make it easy for users to look at the interface and instantly identify what each variable is for based on its visual representation.

## 2. Functional Requirements

- **Variable Type Badges**: Whenever a variable type is displayed (e.g., in `SortableVariableItem` within the `VariableList`), it must display an easily distinguishable background and text color based on its type.
- **Form Field Indicators**: When rendering variable input fields for users to fill (in both `[id]/use/page.tsx` and `PublicPromptClient.tsx`), the inputs or their surrounding containers must show visual cues (e.g., border color or subtle background tint) that match their variable type colors.
- **Consistent Color Mapping**: Establish a unified color map across the application for the following five variable types: `text`, `number`, `textarea`, `choices`, and `list`.

## 3. Inputs and Outputs: Color Mapping and UI Behavior

**Color Mapping Definition (Tailwind References):**

- **Text (`text`)**: Blue
  - _Light_: `bg-blue-100 text-blue-800`
  - _Dark_: `dark:bg-blue-900/30 dark:text-blue-400`
  - _Input focus_: `focus-visible:ring-blue-500/50`
- **Number (`number`)**: Green
  - _Light_: `bg-green-100 text-green-800`
  - _Dark_: `dark:bg-green-900/30 dark:text-green-400`
  - _Input focus_: `focus-visible:ring-green-500/50`
- **Textarea (`textarea`)**: Purple
  - _Light_: `bg-purple-100 text-purple-800`
  - _Dark_: `dark:bg-purple-900/30 dark:text-purple-400`
  - _Input focus_: `focus-visible:ring-purple-500/50`
- **Choices (`choices`)**: Orange
  - _Light_: `bg-orange-100 text-orange-800`
  - _Dark_: `dark:bg-orange-900/30 dark:text-orange-400`
  - _Input focus_: `focus-visible:ring-orange-500/50`
- **List (`list`)**: Rose/Pink
  - _Light_: `bg-rose-100 text-rose-800`
  - _Dark_: `dark:bg-rose-900/30 dark:text-rose-400`
  - _Input focus_: `focus-visible:ring-rose-500/50`

**Component Changes:**

- **USER ACTION**: View the variables list in the Prompt Editor (`SortableVariableItem`).
- **SYSTEM BEHAVIOR**: The variable type label (e.g., "TEXT", "NUMBER") is rendered as a styled badge utilizing the appropriate color map instead of the default muted foreground text.

- **USER ACTION**: Interact with prompt fields in `UseTemplatePage` or `PublicPromptClient`.
- **SYSTEM BEHAVIOR**: The input components (Input, Textarea, Select) feature a subtle visual tie (e.g., border accent or background tint) corresponding to the variable type. The focus ring (`focus-visible:ring-...`) matches the variable type color instead of the default primary ring.

## 4. Constraints

- **Tailwind Safelisting**: If dynamically generating classes based on type (e.g., `bg-${color}-100`), ensure the necessary classes are explicitly written in a mapping object (e.g., a dictionary of exact tailwind class strings) so they aren't purged by Tailwind.
- **Accessibility**: All text and background color combinations must maintain acceptable contrast ratios (WCAG AA). Use darker text on lighter backgrounds for light mode, and lighter text on subdued dark backgrounds for dark mode.
- **Theme Support**: UI must look coherent and maintain high visibility in both light and dark modes.

## 5. Edge Cases and Error Handling

- **Unknown Variable Types**: If a legacy or malformed variable type defaults to an unknown string, it must fall back to a neutral style (e.g., current `bg-secondary/30 text-muted-foreground`).
- **Invalid Form State**: Form validation styling (e.g., red borders for errors) must take precedence over the variable type colors if a variable fails validation constraints.

## 6. Acceptance Criteria

- [ ] In the prompt editor, each variable in the `VariableList` displays a colored badge identifying its type (`text`, `number`, `textarea`, `choices`, `list`).
- [ ] Each of the 5 variable types has a distinct, consistent color assigned across the whole application.
- [ ] When using a prompt (`/use` page and `PublicPromptClient`), the input fields corresponding to different variable types have subtle visual indicators (e.g., specific focus rings or subtle borders/backgrounds) matching the type's assigned color.
- [ ] The visual indicators look correct, pleasing, and legible in both light and dark themes without compromising contrast ratios.
- [ ] Fallback styling handles any variable types that fall outside the known 5 categories without breaking the application layout.
