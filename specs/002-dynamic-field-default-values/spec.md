**1. Problem Statement**

When creating or editing dynamic fields for prompts, users cannot specify a default value.
This makes it difficult for users to:

- Provide a fallback value when the field is optional but a standard value applies.
- Speed up prompt execution for common scenarios where the default value is usually sufficient.
- Guide other users (or themselves) on what a typical value looks like when using a public or private prompt.

Solution: This feature introduces the ability to set a default value for dynamic fields during creation/editing, which will be prepopulated or used when the field is left empty during prompt usage.

**2. Functional Requirements**

The system should:

- Add a "Default Value" input field to the dynamic field creation and editing forms.
- Save the default value to the database along with the other field configurations.
- Prepopulate the default value in the input field when the prompt is viewed on the public prompt usage page.
- Prepopulate the default value in the input field when the prompt is viewed on the private prompt usage page.
- Allow users to override the default value by typing their own input.
- Use the default value during prompt execution if the user leaves the field empty.

**3. Inputs and Outputs: Default Value Behavior**

USER ACTION (INPUT)
When a creator sets "Default Value" to "English" for a "Language" field

EXPECTED SYSTEM BEHAVIOR

- Save "English" as the default value for that specific dynamic field
- When a user opens the prompt usage page, the "Language" field automatically contains "English"
- If the user clicks 'Run' or 'Copy' without changing the field, "English" is used in the prompt template
- If the user changes it to "Spanish", "Spanish" is used in the prompt template

**4. Constraints**

- The default value field should support text input, matching the data type of the dynamic field.
- The default value should be clearly indicated as a default (e.g., visually pre-filled value).
- Adding this property must be backward-compatible with existing dynamic fields that do not have a default value set.

**5. Edge Cases and Error Handling**

Default value is too long

- Truncate or validate against the maximum allowed length for that dynamic field.

User clears the default value on usage page

- If the field is required, show a validation error: "This field is required." If optional, allow an empty string to be used.

Creator clears the default value while editing

- The system should save it as empty/null and remove the default behavior.

Old prompts without default values

- System treats default value as empty string or null; usage page behaves as it currently does.

**6. Acceptance Criteria**

This feature is considered complete if:

- Creators can see and use a "Default Value" input when adding or editing a dynamic field.
- The default value is successfully saved and retrieved from the database.
- The public prompt usage page automatically populates the dynamic field with the saved default value.
- The private prompt usage page automatically populates the dynamic field with the saved default value.
- Users can easily override the default value on the usage pages.
- Executing or copying the prompt uses the default value if the user hasn't changed it.
- Executing or copying the prompt uses the user's custom input if they overrode the default.
- Existing prompts without default values continue to function normally.
