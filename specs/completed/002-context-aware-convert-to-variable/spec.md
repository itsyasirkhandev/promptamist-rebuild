# Context-Aware Convert to Variable Specification

**1. Problem Statement**
Currently, the "convert to variable" button is disabled when the "dynamic template" switch is turned on, preventing users from easily inserting variables while in this mode. Furthermore, variable insertion lacks contextual awareness regarding the user's cursor position. The goal is to keep the "convert to variable" button enabled even when the dynamic template switch is on, and to make it intelligently insert the variable exactly at the user's current cursor position within the active input field. This functionality needs to be seamlessly supported across both desktop and mobile layouts with an excellent user experience.

**2. Functional Requirements**

- **State Independence**: The "convert to variable" button must remain enabled and fully functional regardless of the "dynamic template" switch state (on or off).
- **Context-Aware Insertion**: Clicking the "convert to variable" button should insert the generated variable at the exact location of the user's active cursor within the currently focused input field.
- **Focus Tracking**: The system must track which input field was most recently focused and the cursor's exact position within that field to ensure the variable is inserted correctly, even if focus is temporarily lost to click the button.
- **Responsive Design**: The "convert to variable" functionality and button placement must be optimized for both desktop and mobile screens. On mobile, this may involve adapting the button's size, placement (e.g., above the keyboard or floating), or interaction model to prevent fat-finger errors and ensure usability.

**3. Inputs and Outputs: Primary Actions**

- USER ACTION: Turns on "dynamic template" switch.
- SYSTEM BEHAVIOR: "Convert to variable" button remains enabled and clickable.
- USER ACTION: Clicks inside a text input field, types some text, and leaves the cursor at a specific position.
- SYSTEM BEHAVIOR: The system records the active input field and the cursor's position (selection start/end).
- USER ACTION: Clicks the "convert to variable" button.
- SYSTEM BEHAVIOR: The system generates the variable and inserts it at the previously recorded cursor position within the recorded input field.
- USER ACTION: Uses the feature on a mobile device.
- SYSTEM BEHAVIOR: The UI adapts to mobile constraints, ensuring the button is easily accessible without obscuring the active input field.

**4. Constraints**

- **Performance**: Cursor position tracking must have zero perceptible lag so typing feels natural.
- **UI/UX**: The button must be clearly visible and accessible on all screen sizes. On mobile, it must not interfere with the native virtual keyboard.
- **Technical Constraints**: Requires reliable browser API support for tracking `selectionStart` and `selectionEnd` on input/textarea elements across different browsers (Chrome, Safari, Firefox, iOS Safari, Android Chrome).

**5. Edge Cases and Error Handling**

- **No Focused Field**: If the user clicks "convert to variable" but hasn't focused any input field yet (or focus was lost and can't be reliably restored), append the variable to the end of the primary input field by default, or show a subtle toast notification: "Please select a text field first."
- **Multiple Input Fields**: The system must correctly identify _which_ input field was active. If there are multiple (e.g., a title field and a body field), the variable must go to the correct one.
- **Mobile Keyboard Re-flow**: On mobile, opening the keyboard changes viewport height. The "convert to variable" button must remain visible (e.g., sticking to the top of the keyboard or remaining in a fixed toolbar).
- **Preserve Text Selection**: If a user highlights a block of text and clicks "convert to variable", the system must replace the highlighted text with the variable, exactly preserving the existing behavior.

**6. Acceptance Criteria**

- [ ] Turning on the "dynamic template" switch does not disable the "convert to variable" button.
- [ ] Clicking "convert to variable" inserts the variable exactly at the cursor's position in the currently active input field.
- [ ] If no field is active, the system handles it gracefully (e.g., appends to the main field or alerts the user).
- [ ] The functionality works seamlessly on desktop browsers.
- [ ] The functionality and UI adapt gracefully to mobile screens, maintaining a highly usable experience.
- [ ] Highlighting text and clicking the button replaces the selected text with the variable, completely preserving the previous functionality.
