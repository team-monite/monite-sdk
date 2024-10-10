# @team-monite/eslint-plugin

## 2.0.3

### Patch Changes

- 40616848: feat(rules): add new rule for slotProps

## 2.0.3-beta.0

### Patch Changes

- 40616848: feat(rules): add new rule for slotProps

## 2.0.2

### Patch Changes

- b2c3d366: fix(ESLINT-2024): Update ESLint Rule 'mui-require-container-property' for `useMenuButton(...)` Hook

  - Added logic in `mui-require-container-property.ts` to specifically handle cases where `useMenuButton(...)` is used to spread props into MUI components, ensuring the `container` property is included if missing.
  - Expanded test coverage in `mui-require-container-property.test.ts` to include scenarios with `useMenuButton(...)` hook, particularly checking for the presence of the `container` property in spread operations.
  - Modified ESLint configurations in `.eslintrc.json` within `sdk-react` package to switch the rule from "off" to "error", enforcing strict compliance across the codebase.
  - Adjusted various components to directly include or correct the `container` property in their spread attributes to adhere to the updated rule, reducing potential rendering issues in popper-based components.

## 2.0.1

### Patch Changes

- d5816511: feature(DEV-8480): Add ESLint custom rule to detect if `container` property is not used for specific MUI components

## 2.0.0

### Major Changes

- cb4afb0b: Add usage of eslint-plugin-lingui

### Patch Changes

- 7e0f9a94: Updated dependencies to address a vulnerability in the deprecated version of @babel/traverse

## 2.0.0-beta.1

### Patch Changes

- 7e0f9a94: Updated dependencies to address a vulnerability in the deprecated version of @babel/traverse

## 2.0.0-beta.0

### Major Changes

- cb4afb0b: Add usage of eslint-plugin-lingui
