---
'@team-monite/eslint-plugin': patch
'@monite/sdk-react': patch
---

fix(ESLINT-2024): Update ESLint Rule 'mui-require-container-property' for `useMenuButton(...)` Hook

* Added logic in `mui-require-container-property.ts` to specifically handle cases where `useMenuButton(...)` is used to spread props into MUI components, ensuring the `container` property is included if missing.
* Expanded test coverage in `mui-require-container-property.test.ts` to include scenarios with `useMenuButton(...)` hook, particularly checking for the presence of the `container` property in spread operations.
* Modified ESLint configurations in `.eslintrc.json` within `sdk-react` package to switch the rule from "off" to "error", enforcing strict compliance across the codebase.
* Adjusted various components to directly include or correct the `container` property in their spread attributes to adhere to the updated rule, reducing potential rendering issues in popper-based components.

