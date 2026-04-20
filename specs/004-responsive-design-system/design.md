# Design Plan: Responsive Design System

Technical specification for implementing a comprehensive, mobile-first responsive strategy for Promptamist, leveraging Next.js 16, React 19.2, and Tailwind CSS 4.

### 1. Objective
Transform the current desktop-centric application into a fully responsive platform. This involves implementing a unified navigation system (Sidebar vs. Mobile Nav), refactoring layouts with modern CSS (Grid, Flexbox, and Container Queries), and optimizing critical user flows (Prompt Editor, Variable Management) for touch devices and smaller viewports.

### 2. Tech Stack
*   **Frontend Framework**: Next.js 16.2.4 (App Router)
*   **UI Library**: React 19.2.4
*   **Styling**: Tailwind CSS 4 (Oxide engine, CSS-first config)
*   **Components**: Radix UI + Shadcn UI
*   **Icons**: Lucide React + Iconify
*   **Drag & Drop**: dnd-kit (with Touch Sensors)
*   **Why this stack?**:
    *   **Next.js 16/React 19.2**: Provides native View Transitions and improved performance for layout shifts.
    *   **Tailwind CSS 4**: Native support for **Container Queries** allows components like `PromptCard` to adapt based on their parent container's width (e.g., sidebar vs. main grid) rather than just the viewport.
    *   **OKLCH Colors**: Used in `globals.css` for better color consistency and accessibility across different devices.

### 3. High-Level Architecture
*   **Responsive Layout Shell**: A shared layout component that conditionally renders navigation based on viewport breakpoints.
*   **Adaptive Navigation**:
    *   **Desktop Sidebar**: A permanent, collapsible sidebar for screens `≥ 1024px` (lg).
    *   **Mobile Bottom Bar**: A sticky navigation bar at the bottom for screens `< 768px` (md).
    *   **Tablet Navigation**: A hybrid approach using a collapsed sidebar or a top header for screens between `768px` and `1024px`.
*   **Layered Responsibility**:
    *   **Layout Layer**: Handles global spacing, navigation visibility, and max-widths.
    *   **Component Layer**: Uses Container Queries (`@container`) to internalize responsiveness.
    *   **Interaction Layer**: Manages touch vs. hover states and haptic-like feedback.

**ARCHITECTURE FLOW**:
`Viewport (Window Resize) -> CSS Breakpoints (sm, md, lg) -> Layout Shell (Conditional Nav) -> Page Content (Grid/Flex) -> Modular Components (Container Queries)`

### 4. Data Model
While primarily a UI refactor, we will maintain a consistent `NavigationConfig` to ensure parity between mobile and desktop views.

```typescript
// src/lib/navigation.ts
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/prompts', icon: 'lucide:layout-dashboard' },
  { id: 'create', label: 'Create', href: '/prompts/create', icon: 'lucide:plus-circle' },
  { id: 'profile', label: 'Profile', href: '/profile', icon: 'lucide:user' },
];
```

### 5. Core Design Decisions
*   **Decision 1: Viewport vs. Container Breakpoints**: Use media queries (`md:`, `lg:`) for top-level layout (e.g., hiding/showing the sidebar). Use container queries (`@md:`, `@lg:`) for components like `PromptCard` and `VariableList` so they look correct regardless of where they are placed.
*   **Decision 2: Touch-Target Standardization**: Enforce a minimum touch target of `44x44px` for all interactive elements on mobile.
*   **Decision 3: Sticky Mobile Action Bar**: In the `PromptEditor`, the primary actions (Save, Cancel) will be moved to a sticky footer on mobile to keep them within thumb-reach.
*   **Decision 4: Fluid Typography**: Use Tailwind 4's `@theme` to define a responsive font scale that automatically adjusts base sizes for mobile vs. desktop.
*   **Decision 5: Haptic Feedback**: Use `dnd-kit`'s `useSensor` with `TouchSensor` to provide immediate visual feedback (scaling/shadows) during drag operations on mobile.

### 6. Core Functional Flows
*   **A. Adaptive Layout Switching**:
    *   User loads app on a phone: Layout hides `Sidebar`, shows `MobileBottomNav`.
    *   User rotates to landscape: Content adjusts via Grid wrapping, `MobileBottomNav` might switch to a side-rail if height is limited.
*   **B. Mobile Prompt Creation**:
    1. User clicks "New Prompt" from `MobileBottomNav`.
    2. Editor opens in full-screen mode.
    3. Typing: Editor area adjusts to prevent keyboard overlap (using `overscroll-behavior: none`).
    4. Selection: "Convert to Variable" appears in a floating toolbar above the selection.
*   **C. Variable Management**:
    *   Desktop: Drag handle visible on hover.
    *   Mobile: Larger drag handle always visible; long-press or direct drag initiates reordering with a "lifted" card effect.

### 7. Development Plan
1.  **Refactor Layout Shell**: 
    *   Implement `src/components/layout/AppLayout.tsx` to wrap all protected routes.
    *   Create `Sidebar` and `MobileBottomNav` components.
2.  **Responsive Dashboard**:
    *   Update `PromptsPage` to use a responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
    *   Add `@container` to the card wrapper for fine-grained responsiveness.
3.  **Mobile-Optimized Editor**:
    *   Refactor `PromptEditor` to include a sticky action header/footer for mobile.
    *   Ensure inputs have `font-size: 16px` to prevent auto-zoom on iOS.
4.  **Interaction Polish**:
    *   Optimize `VariableList` for touch using `dnd-kit` touch sensors.
    *   Add transitions for sidebar collapse/expand.
5.  **Final Audit**:
    *   Verify all touch targets are `≥ 44px`.
    *   Test across multiple device emulators (iPhone SE, iPad Pro, Desktop).
