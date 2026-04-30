# Graph Report - .  (2026-04-30)

## Corpus Check
- Corpus is ~26,704 words - fits in a single context window. You may not need a graph.

## Summary
- 228 nodes · 144 edges · 18 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.82)
- Token cost: 500 input · 200 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Convex Core & Error Handling|Convex Core & Error Handling]]
- [[_COMMUNITY_Core Architecture & Schema|Core Architecture & Schema]]
- [[_COMMUNITY_Variable Management Logic|Variable Management Logic]]
- [[_COMMUNITY_UI Components Sidebar|UI Components: Sidebar]]
- [[_COMMUNITY_Dashboard & Utilities|Dashboard & Utilities]]
- [[_COMMUNITY_Prompt Editor Logic|Prompt Editor Logic]]
- [[_COMMUNITY_Error Handling & Editing|Error Handling & Editing]]
- [[_COMMUNITY_Layout & Design System|Layout & Design System]]
- [[_COMMUNITY_Tailwind Styling|Tailwind Styling]]
- [[_COMMUNITY_Schema Versions|Schema: Versions]]
- [[_COMMUNITY_Schema Deployments|Schema: Deployments]]
- [[_COMMUNITY_Schema Providers|Schema: Providers]]
- [[_COMMUNITY_Schema Likes|Schema: Likes]]
- [[_COMMUNITY_Schema Stats|Schema: Stats]]
- [[_COMMUNITY_Schema Favorites|Schema: Favorites]]
- [[_COMMUNITY_Design Animations|Design: Animations]]
- [[_COMMUNITY_Design Accessibility|Design: Accessibility]]
- [[_COMMUNITY_Workflow Training|Workflow: Training]]

## God Nodes (most connected - your core abstractions)
1. `Promptamist` - 4 edges
2. `Prompts Table` - 4 edges
3. `getVariableColorConfig()` - 3 edges
4. `Convex Backend` - 3 edges
5. `Users Table` - 3 edges
6. `onSubmit()` - 2 edges
7. `DashboardStats()` - 2 edges
8. `handleInput()` - 2 edges
9. `handleAddVariable()` - 2 edges
10. `SortableVariableItem()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Clerk Authentication` --maps_to--> `Users Table`  [INFERRED]
  docs/AUTHENTICATION.md → convex/schema.ts
- `Glassmorphism Design` --applied_to--> `App Layout`  [INFERRED]
  DESIGN_GUIDELINES.md → src/app/layout.tsx
- `Promptamist` --uses--> `Convex Backend`  [EXTRACTED]
  README.md → convex/schema.ts
- `onSubmit()` --calls--> `handleError()`  [INFERRED]
  src\app\(protected)\prompts\[id]\edit\page.tsx → src\lib\error-handler.ts
- `DashboardStats()` --calls--> `formatRelativeTime()`  [INFERRED]
  src\components\HomeClient.tsx → src\lib\utils.ts

## Communities

### Community 0 - "Convex Core & Error Handling"
Cohesion: 0.11
Nodes (4): InternalError, NotFound, Unauthorized, ValidationError

### Community 2 - "Core Architecture & Schema"
Cohesion: 0.28
Nodes (8): Clerk Authentication, Convex Backend, Promptamist, Prompts Table, Tags Table, Users Table, Variables Table, shadcn/ui

### Community 3 - "Variable Management Logic"
Cohesion: 0.29
Nodes (3): getVariableColorConfig(), isVariableType(), SortableVariableItem()

### Community 6 - "UI Components: Sidebar"
Cohesion: 0.33
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 7 - "Dashboard & Utilities"
Cohesion: 0.33
Nodes (2): DashboardStats(), formatRelativeTime()

### Community 8 - "Prompt Editor Logic"
Cohesion: 0.5
Nodes (2): handleAddVariable(), handleInput()

### Community 14 - "Error Handling & Editing"
Cohesion: 0.5
Nodes (2): onSubmit(), handleError()

### Community 22 - "Layout & Design System"
Cohesion: 0.67
Nodes (3): App Layout, App Sidebar, Glassmorphism Design

### Community 79 - "Tailwind Styling"
Cohesion: 1.0
Nodes (1): Tailwind CSS

### Community 80 - "Schema: Versions"
Cohesion: 1.0
Nodes (1): Versions Table

### Community 81 - "Schema: Deployments"
Cohesion: 1.0
Nodes (1): Deployments Table

### Community 82 - "Schema: Providers"
Cohesion: 1.0
Nodes (1): Providers Table

### Community 83 - "Schema: Likes"
Cohesion: 1.0
Nodes (1): Likes Table

### Community 84 - "Schema: Stats"
Cohesion: 1.0
Nodes (1): Stats Table

### Community 85 - "Schema: Favorites"
Cohesion: 1.0
Nodes (1): Favorites Table

### Community 86 - "Design: Animations"
Cohesion: 1.0
Nodes (1): Animations Design

### Community 87 - "Design: Accessibility"
Cohesion: 1.0
Nodes (1): Accessibility

### Community 88 - "Workflow: Training"
Cohesion: 1.0
Nodes (1): Training Workflow

## Knowledge Gaps
- **19 isolated node(s):** `Unauthorized`, `NotFound`, `ValidationError`, `InternalError`, `shadcn/ui` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `UI Components: Sidebar`** (7 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenu()`, `SidebarMenuButton()`, `SidebarMenuItem()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard & Utilities`** (6 nodes): `DashboardStats()`, `HomeClient()`, `cn()`, `formatRelativeTime()`, `HomeClient.tsx`, `utils.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prompt Editor Logic`** (5 nodes): `handleAddVariable()`, `handleInput()`, `handleSelection()`, `openVariableModal()`, `PromptEditor.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Error Handling & Editing`** (4 nodes): `onSubmit()`, `handleError()`, `page.tsx`, `error-handler.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Styling`** (1 nodes): `Tailwind CSS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Schema: Versions`** (1 nodes): `Versions Table`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Schema: Deployments`** (1 nodes): `Deployments Table`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Schema: Providers`** (1 nodes): `Providers Table`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Schema: Likes`** (1 nodes): `Likes Table`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Schema: Stats`** (1 nodes): `Stats Table`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Schema: Favorites`** (1 nodes): `Favorites Table`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Design: Animations`** (1 nodes): `Animations Design`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Design: Accessibility`** (1 nodes): `Accessibility`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workflow: Training`** (1 nodes): `Training Workflow`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `Unauthorized`, `NotFound`, `ValidationError` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Convex Core & Error Handling` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._