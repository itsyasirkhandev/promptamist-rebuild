# Graph Report - . (2026-04-30)

## Corpus Check

- Corpus is ~26,838 words - fits in a single context window. You may not need a graph.

## Summary

- 219 nodes · 201 edges · 9 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)

- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 73|Community 73]]

## God Nodes (most connected - your core abstractions)

1. `React` - 51 edges
2. `Promptamist` - 11 edges
3. `Effect` - 8 edges
4. `getVariableColorConfig()` - 3 edges
5. `Design Principles` - 3 edges
6. `onSubmit()` - 2 edges
7. `DashboardStats()` - 2 edges
8. `handleInput()` - 2 edges
9. `handleAddVariable()` - 2 edges
10. `SortableVariableItem()` - 2 edges

## Surprising Connections (you probably didn't know these)

- `onSubmit()` --calls--> `handleError()` [INFERRED]
  src\app\(protected)\prompts\[id]\edit\page.tsx → src\lib\error-handler.ts
- `DashboardStats()` --calls--> `formatRelativeTime()` [INFERRED]
  src\components\HomeClient.tsx → src\lib\utils.ts
- `SortableVariableItem()` --calls--> `getVariableColorConfig()` [INFERRED]
  src\components\prompts\SortableVariableItem.tsx → src\lib\variables.ts
- `Promptamist` --uses_as_backend--> `Convex` [EXTRACTED]
  README.md → GEMINI.md
- `Promptamist` --uses_for_auth--> `Clerk` [EXTRACTED]
  README.md → docs/AUTHENTICATION.md

## Communities

### Community 0 - "Community 0"

Cohesion: 0.14
Nodes (5): Effect, InternalError, NotFound, Unauthorized, ValidationError

### Community 1 - "Community 1"

Cohesion: 0.17
Nodes (13): 60/30/10 Color Rule, 8pt Grid System, Clerk, Convex, Copywriting Rules, Design Principles, Graphify, Next.js (+5 more)

### Community 3 - "Community 3"

Cohesion: 0.29
Nodes (3): getVariableColorConfig(), isVariableType(), SortableVariableItem()

### Community 4 - "Community 4"

Cohesion: 0.25
Nodes (1): React

### Community 7 - "Community 7"

Cohesion: 0.33
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 8 - "Community 8"

Cohesion: 0.33
Nodes (2): DashboardStats(), formatRelativeTime()

### Community 9 - "Community 9"

Cohesion: 0.5
Nodes (2): handleAddVariable(), handleInput()

### Community 15 - "Community 15"

Cohesion: 0.5
Nodes (2): onSubmit(), handleError()

### Community 73 - "Community 73"

Cohesion: 1.0
Nodes (1): Webhooks

## Knowledge Gaps

- **14 isolated node(s):** `Unauthorized`, `NotFound`, `ValidationError`, `InternalError`, `Prompt Engineering as Code` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 4`** (8 nodes): `React`, `ConvexClientProvider()`, `page.tsx`, `ConvexClientProvider.tsx`, `AppSidebar.tsx`, `SettingsSection.tsx`, `PromptPreview.tsx`, `VariableInput.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (7 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenu()`, `SidebarMenuButton()`, `SidebarMenuItem()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (6 nodes): `DashboardStats()`, `HomeClient()`, `cn()`, `formatRelativeTime()`, `HomeClient.tsx`, `utils.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (5 nodes): `handleAddVariable()`, `handleInput()`, `handleSelection()`, `openVariableModal()`, `PromptEditor.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (4 nodes): `onSubmit()`, `handleError()`, `page.tsx`, `error-handler.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (1 nodes): `Webhooks`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
