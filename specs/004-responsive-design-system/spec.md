### 1. Problem Statement

The current application is mostly functional on desktop but lacks a cohesive, "mobile-first" responsive strategy. Users on smaller screens (phones/tablets) may experience awkward layout wrapping, difficult navigation, and a less-than-optimal editing experience for prompts and variables. Specifically, the editing flow for creating/updating prompts requires a lot of scrolling on mobile, and there is no unified navigation system that adapts to screen size.
**Solution:** Implement a comprehensive responsive design system that optimizes layouts, typography, and interaction patterns for all device types.

### 2. Functional Requirements

- **Unified Navigation:** Implement a responsive navigation component.
  - Mobile: Bottom navigation bar or sticky top bar with a drawer.
  - Desktop: Permanent sidebar or top navigation header.
- **Responsive Layouts:**
  - Dashboard: Grid that scales from 1 column (mobile) to 2 (tablet) to 3+ (desktop).
  - Editor Flow: Multi-column layout on desktop; stacked single-column on mobile.
- **Sticky Action Bar:** Introduce a sticky footer or header for critical actions (e.g., "Save Prompt", "Create New") on mobile devices.
- **Touch-Optimized Interactions:**
  - Ensure touch targets for buttons and links are at least 44x44px.
  - Optimize the Prompt Editor's "Convert to Variable" selection flow for mobile browsers.
  - Improve `VariableList` drag-and-drop feedback for touch input.
- **Fluid Typography & Spacing:** Use a consistent responsive scale for fonts and whitespace to ensure readability and balance across screen sizes.

### 3. Inputs and Outputs / Interaction Behavior

**Navigation Switching**

- **USER ACTION (INPUT):** User accesses the app from a mobile device or narrows the browser window.
- **EXPECTED SYSTEM BEHAVIOR:**
  - The desktop sidebar/header hides.
  - A mobile-optimized navigation appears (e.g., bottom bar with icons for "Home", "Prompts", "Profile").
  - Secondary actions move into a "More" drawer or hamburger menu.

**Prompt Editor Mobile Flow**

- **USER ACTION (INPUT):** User focuses the Prompt Editor on a mobile device.
- **EXPECTED SYSTEM BEHAVIOR:**
  - The editor expands to utilize available screen height.
  - If text is selected, the "Convert to Variable" button remains easily reachable (possibly as a floating button or part of a sticky keyboard toolbar).
  - Typing does not cause the layout to jump or hide the active line behind the virtual keyboard.

**Variable Management on Mobile**

- **USER ACTION (INPUT):** User drags a variable to reorder.
- **EXPECTED SYSTEM BEHAVIOR:**
  - Provide clear haptic-like visual feedback (e.g., slight lift, shadow, or scale).
  - Ensure the "drag handle" is large enough for thumb interaction.
  - Prevent page scrolling while an active drag is in progress.

### 4. Constraints

- **Loading Speed:** Responsive assets (icons, images) must be optimized to not degrade performance on mobile networks.
- **UI Consistency:** Must use existing Tailwind CSS colors and design tokens to maintain brand identity.
- **No Auto-Zoom:** Set font sizes for inputs to at least 16px on mobile to prevent iOS Safari from automatically zooming in.
- **Breakpoints:** Use standard Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) for all layout transitions.

### 5. Edge Cases and Error Handling

- **Extremely Small Screens (<320px):** Content should remain readable, utilizing horizontal padding reduction and word-breaking if necessary.
- **Landscape Orientation:** Handle "short but wide" screens by adjusting card heights or switching to a two-column layout if height is below a threshold.
- **Network Latency:** Ensure navigation menus and drawers feel snappy even if data is still loading (using skeletons or optimistic UI).
- **Selection Conflicts:** On mobile, the browser's native selection menu might conflict with the "Convert to Variable" button. The UI should be positioned to minimize overlap.

### 6. Acceptance Criteria

- **Dashboard:** Cards wrap from 1 column (<768px) to 2 columns (768px-1024px) to 3+ columns (>1024px).
- **Navigation:** A functional mobile menu/bar is present on screens <768px.
- **Editor Flow:** The "Save Prompt" button is accessible on mobile without scrolling to the bottom of the page (sticky bar).
- **Touch Targets:** All buttons in the `VariableList` and `PromptCard` have a minimum touch area of 44px.
- **Typography:** Headers and body text scale down appropriately on smaller screens (e.g., using `text-2xl` on mobile vs `text-4xl` on desktop).
- **Empty States:** "No prompts found" screen is centered and looks balanced on both mobile and desktop.
- **Modals:** All dialogs (like `VariableConfigModal`) are responsive and do not overflow the viewport on small screens.
