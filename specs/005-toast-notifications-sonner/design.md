# Design Plan: Shadcn Sonner Toast Notifications

Technical specification for integrating `sonner` toast notifications across the application to provide real-time feedback for user actions.

### 1. Objective

Enable global notification visibility by mounting the Sonner `<Toaster />` in the root layout and ensure all primary actions (Create, Update, Delete, Copy, Variable Management) provide clear success/error feedback.

### 2. Tech Stack

- **Library**: `sonner` (^2.0.7)
- **UI Components**: `shadcn/ui` (customized `Toaster` component)
- **Icons**: `lucide-react` (integrated into `Toaster` icons)
- **Theme**: `next-themes` for light/dark mode support.

**Why this stack?**: `sonner` is the standard for modern Next.js applications, offering high performance, accessibility, and a great developer experience. Integrating it with `next-themes` ensures consistency with the app's visual state.

### 3. High-Level Architecture

- **A. Root Layout Integration**: Mount the `<Toaster />` at the top level to ensure it stays mounted during navigation.
- **B. Event-Driven Notifications**: Trigger toasts directly from event handlers (e.g., `onClick`, `onSubmit`) and async operation callbacks (e.g., `catch` blocks).

### 4. Data Model

Toasts do not require a database schema but follow the `sonner` API structure:

```typescript
toast.success('Message', { description: 'Optional detail' });
toast.error('Error Message');
toast.info('Information');
```

### 5. Core Design Decisions

- **Decision 1: Global Placement**: Place `<Toaster />` in `src/app/layout.tsx` inside the `ClerkProvider` and `ConvexClientProvider` to ensure it's always available.
- **Decision 2: Rich Icons**: Use the pre-configured icons in `src/components/ui/sonner.tsx` (CircleCheck, OctagonX, etc.) for visual distinction.
- **Decision 3: Variable Lifecycle Toasts**: Add granular toasts for variable actions (Added, Updated, Removed) to help users track changes in complex templates.

### 6. Core Functional Flows

#### A. Prompt Management

- **Create/Update**: Show success toast after mutation succeeds; redirect to dashboard.
- **Delete**: Show success toast after mutation succeeds.
- **Copy**: Show success toast when `navigator.clipboard.writeText` succeeds.

#### B. Variable Management (In Editor/Form)

- **Add Variable**: Triggered in `PromptEditor` when text is converted.
  - _Message_: `Variable "{{name}}" added`
- **Edit Variable**: Triggered in `CreatePromptPage`/`EditPromptPage` when modal confirms.
  - _Message_: `Variable updated`
- **Remove Variable**: Triggered in `CreatePromptPage`/`EditPromptPage` when delete icon clicked.
  - _Message_: `Variable removed`

### 7. Development Plan

1.  **Toaster Integration**:
    - Import `{ Toaster }` from `@/components/ui/sonner` in `src/app/layout.tsx`.
    - Add `<Toaster />` inside the `<body>` but outside the main layout content if possible, or within the provider tree.

2.  **PromptEditor Modifications**:
    - Import `toast` from `sonner`.
    - In `handleAddVariable`, call `toast.success('Variable "{{name}}" added')`.

3.  **Create/Edit Page Modifications**:
    - In `removeVariable`, call `toast.info('Variable removed')`.
    - In `handleEditVariable`, call `toast.success('Variable updated')`.
    - Ensure all `try/catch` blocks for `createPrompt` and `updatePrompt` have `toast.error` calls.

4.  **Verification**:
    - Check mobile responsiveness (bottom center).
    - Check theme consistency (light vs dark).
    - Verify stacking behavior during rapid actions (e.g., clicking "Copy" multiple times).
