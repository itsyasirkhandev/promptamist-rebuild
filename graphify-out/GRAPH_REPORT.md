# Graph Report - promptamist  (2026-04-30)

## Corpus Check
- 91 files · ~27,035 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 222 nodes · 204 edges · 9 communities detected
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
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 72|Community 72]]

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
- `onSubmit()` --calls--> `handleError()`  [INFERRED]
  src\app\(protected)\prompts\[id]\edit\page.tsx → src\lib\error-handler.ts
- `DashboardStats()` --calls--> `formatRelativeTime()`  [INFERRED]
  src\components\HomeClient.tsx → src\lib\utils.ts
- `SortableVariableItem()` --calls--> `getVariableColorConfig()`  [INFERRED]
  src\components\prompts\SortableVariableItem.tsx → src\lib\variables.ts
- `Promptamist` --uses_as_backend--> `Convex`  [EXTRACTED]
  README.md → GEMINI.md
- `Promptamist` --uses_for_auth--> `Clerk`  [EXTRACTED]
  README.md → docs/AUTHENTICATION.md

## Communities

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (5): Effect, InternalError, NotFound, Unauthorized, ValidationError

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (13): 60/30/10 Color Rule, 8pt Grid System, Clerk, Convex, Copywriting Rules, Design Principles, Graphify, Next.js (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.2
Nodes (1): React

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (3): getVariableColorConfig(), isVariableType(), SortableVariableItem()

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (2): DashboardStats(), formatRelativeTime()

### Community 9 - "Community 9"
Cohesion: 0.5
Nodes (2): handleAddVariable(), handleInput()

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (2): onSubmit(), handleError()

### Community 72 - "Community 72"
Cohesion: 1.0
Nodes (1): Webhooks

## Knowledge Gaps
- **14 isolated node(s):** `Unauthorized`, `NotFound`, `ValidationError`, `InternalError`, `Prompt Engineering as Code` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 3`** (10 nodes): `React`, `Logo()`, `CreatePromptPage()`, `page.tsx`, `page.tsx`, `AppSidebar.tsx`, `Logo.tsx`, `SettingsSection.tsx`, `PromptPreview.tsx`, `VariableInput.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (7 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenu()`, `SidebarMenuButton()`, `SidebarMenuItem()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (6 nodes): `DashboardStats()`, `HomeClient()`, `cn()`, `formatRelativeTime()`, `HomeClient.tsx`, `utils.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (5 nodes): `handleAddVariable()`, `handleInput()`, `handleSelection()`, `openVariableModal()`, `PromptEditor.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (4 nodes): `onSubmit()`, `handleError()`, `page.tsx`, `error-handler.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (1 nodes): `Webhooks`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `React` connect `Community 3` to `Community 2`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 11`, `Community 12`, `Community 13`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 29`, `Community 32`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 38`, `Community 39`, `Community 40`, `Community 41`, `Community 42`, `Community 43`, `Community 44`, `Community 45`, `Community 46`, `Community 47`, `Community 48`, `Community 49`, `Community 50`, `Community 51`, `Community 52`, `Community 53`, `Community 54`, `Community 55`?**
  _High betweenness centrality (0.474) - this node is a cross-community bridge._
- **What connects `Unauthorized`, `NotFound`, `ValidationError` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._