# @monite/sdk-react

## 3.14.1

### Patch Changes

- 84ebfffc: fix(DEV-11506): prevent PDFObject.embed() call for image URLs

  We've updated the file preview logic to skip calling `PDFObject.embed()` when the URL points to an image. This fix
  addresses an issue where attempting to embed image files as PDFs was causing errors or unexpected behavior.

  - @monite/sdk-api@3.14.1

## 3.14.0

### Minor Changes

- b48b887a: fix(DEV-11166): rewrite <FileViewer /> component to use native PDF rendering

  - Fixed a bug with PDF rendering caused by SSR rendering by changing to a more native approach.
  - Switched from `react-pdf` to native iframe.

- ee976e67: feat(DEV-8691): add validation for `smallest_amount` field for the Products in AR
- 6c20fcd3: feat(DEV-9680): add new features to UserRoleDetails component

  - add a feature to create a new role with permissions
  - add a feature to modify permissions for an existing role

### Patch Changes

- 6342a10c: fix(proposal): allow nullable `smallest_amount` to allow invoices creation for products without a defined minimum amount.
- 3a6c97f7: fix(DEV-11218): improve error handling with unstable response
- b45cfbc8: feat(DEV-11112): change all form ID's in a unique names
- 862b381d: feat(DEV-10046): migrate the `<TagsTable />` component from the legacy SDK API to Qraft
- 4c754e6f: chore(proposal): replaced Product Form synthetic event submissions
- 24689762: feat(DEV-11111): rename all `I` prefix for props to convention without `I` and with a `Props` postfix
- ded78db5: feat(DEV-10025): show loader when PDF url is absent
- 7347a1fc: fix(DEV-11222): add filter by direction to avoid duplicated payment methods for AR
- 7e39ce8e: feat(DEV-10959): fix counterpart_vat_id_id default value to edit an invoice
- b2c3d366: fix(ESLINT-2024): Update ESLint Rule 'mui-require-container-property' for `useMenuButton(...)` Hook

  - Added logic in `mui-require-container-property.ts` to specifically handle cases where `useMenuButton(...)` is used to spread props into MUI components, ensuring the `container` property is included if missing.
  - Expanded test coverage in `mui-require-container-property.test.ts` to include scenarios with `useMenuButton(...)` hook, particularly checking for the presence of the `container` property in spread operations.
  - Modified ESLint configurations in `.eslintrc.json` within `sdk-react` package to switch the rule from "off" to "error", enforcing strict compliance across the codebase.
  - Adjusted various components to directly include or correct the `container` property in their spread attributes to adhere to the updated rule, reducing potential rendering issues in popper-based components.

- 59265b6d: fix(DEV-11012): remove `cloneElement` usage
- 3b65d363: feat(DEV-8691): fix frontend validation when customer adds another line item to an existing ones
- Updated dependencies [7c9cbf3e]
- Updated dependencies [6c20fcd3]
  - @monite/sdk-api@3.14.0

## 3.13.0

### Minor Changes

- 5dcd266d: feat(DEV-10563): provide ReceivablesTable into a public export
- 647efc9d: feat(DEV-10391): add support for multiple message contexts

  Adds support for multiple translations of the same message string (`msgstr`) based on different message
  contexts (`msgctxt`).

- 062b80b8: feat(DEV-10943): replace `fulfillment_date` column with `due_date` in `<InvoicesTable/>`
- a5e64ad2: refactor(DEV-8894): update react-pdf lib version
- 6dee4d58: feat(DEV-10786): add sorting by counterpart_name and status to the Receivables tables
- 0d9e7b4c: feat(DEV-10391): add actions menu to InvoicesTable

  Adds a new Actions Menu to the `InvoicesTable` component. This allows users to perform actions on individual invoices
  directly from the table, such as viewing, editing, and deleting them.

  The Actions Menu can be customized using the new `rowActions` prop, which allows you to specify which actions are
  available for each invoice status. If no `rowActions` prop is provided, a set of default actions will be displayed.

### Patch Changes

- 1852a085: style(DEV-10643): fix pdf layout to have fixed pdf toolbar when scroll
- cde308c6: fix(DEV-10943): Invoice Details "Fulfillment date" output
- 1644a535: feat(DEV-8990): support backend permissions for different buttons. Don't show some blocks if there is no data for it
- 9cdd98a1: feat(DEV-10563): Improve test stability
- cb9c44c1: feat(DEV-8990): improve InvoiceDetails screen.
- 600a51d7: feat(DEV-10896): fixed table height jumping and scrollbar issues during pagination by refactoring the theme props and adding `autoHeight` to `<DataGrid />`.
- 62a0c4e9: feat(proposal): improve `<ReceivablesTable/>` ARIA usage
- Updated dependencies [9711e3e2]
- Updated dependencies [1fb0d928]
  - @monite/sdk-api@3.13.0

## 3.12.0

### Minor Changes

- b05f3448: enhanced the `<TablePagination/>` component with extended customization options via MUI theming, ensuring it fits seamlessly across different application contexts
- d180bf4d: 1. Providers that may affect the customer's context have been moved to `<MoniteScopedProviders/>`. 2. All exported components and all components opening in `<Portal/>` receive `Monite-ContainerCssBaseline` class name. It provides styles for the color scheme of native controls _(dark/light)_ and default colors for components. > Backgrounds will not be added (neither for dark nor light themes), to minimize conflicts with embedding in customer applications. 3. The `<MoniteContext/>` interface has been updated to include:

  - `theme`: Moved from `<MoniteThemeContext/>`.
  - `i18n`: Added instead of `code`, pre-created via Suspense to contain all necessary data for components and hooks.
  - `dateFnsLocale`: Added for DatePicker functionality, pre-created via Suspense.
  - `queryClient`: Added for usage within `<MoniteScopedProviders/>`.

  These changes improve the modularity and maintainability of the `MoniteProvider` while providing enhanced context management and usability for Monite SDK customers.

- 709ca851: feat(DEV-4699): add an ability to edit Invoice
- f4666f32: feat(DEV-10786): add consistent output of the Counterpart name
- 5fad36b8: update `react-virtuoso` up to v4.7.10

### Patch Changes

- aa32e901: feat(DEV-10397): add `currencyNumberFormat` option to `MoniteLocale` to allow customization of currency formatting in different locales.
- 565199dc: feat(DEV-10576): implement and reuse useMenuButton Hook
- 57b9806e: Added two new components: `<InvoiceStatusChip/>` and `<PayableStatusChip/>`. Both components are configurable through
  Material-UI theming to adapt their appearance and functionality according to application needs. For instance,
  the `InvoiceStatusChip` can be customized under the component name `MoniteInvoiceStatusChip` in the MUI theme settings.
  This allows for defining default properties and specific styles for various statuses, such as 'paid' and 'overdue'. This
  configurability ensures that both components can be seamlessly integrated and styled within the existing application
  framework, providing a consistent user experience.
- a8edbbd0: style(DEV-10393): align pagination arrows center
- f8cb7575: allow `<Menu/>` incorrect nesting
- e25094ab: fix(DEV-10393): fix table page reset and styles for page size selector
  - @monite/sdk-api@3.12.0

## 3.11.0

### Minor Changes

- 5f0e96d4: feat(DEV-10501): add column Created on to receivables tables
- b47ae586: add theme package and theme switcher to demo

### Patch Changes

- c3445207: feat(DEV-9977): update msw from 0._._ to 2.2.\*
- c7cb26b3: fix(DEV-9738): update default values for the ProductDetails component
- fb2dd719: fix(DEV-10542): issue an invoice before creating a payment link
  - @monite/sdk-api@3.11.0

## 3.10.0

### Minor Changes

- 12369494: update tanstack query to v5

### Patch Changes

- bb5d37f2: DEV-10434: fix initial loading of products in the receivables
- ffafb609: DEV-9931: fix bank details loading for onboarding component
- a06ef763: (DEV-10078): add eslint query plugin
  - @monite/sdk-api@3.10.0

## 3.9.0

### Minor Changes

- c7a3c487: feat(DEV-9853): add component for role details
- d8816902: feature(DEV-9854): add table for user roles

### Patch Changes

- 807c82ab: refactor(DEV-9443): Improved user permission support for UI
- 67bf83c3: fix(DEV-9443): Do not display output `null` in `<ApprovalPoliciesUser/>`if user name is not specified
- 6e649faf: fix role details cell style
- Updated dependencies [d8816902]
  - @monite/sdk-api@3.9.0

## 3.8.0

### Minor Changes

- c2df30b: feat(DEV-9007): Update InvoiceDetails component based on new design
- f00c951: feat(DEV-10049): Generate a payment link before user emails an invoice

### Patch Changes

- 4884312: fix(DEV-9957): fix phone input
- Updated dependencies [f00c951]
  - @monite/sdk-api@3.8.0

## 3.7.0

### Minor Changes

- 2a1d016e: feat(DEV-3954): Add Sentry to UI Widgets
- 561301b1: add ApprovalPolicyDetails component
- a9007acc: feat(DEV-9563): add read/create/update functionality for approval policy
- 782f67a: fix(DEV-9368): Add mapping for countries depending on currency for bank accounts in onboarding

### Patch Changes

- 80219cdd: chore(DEV-9786): Update dependencies up to secure version
- ab18b104: fix(DEV-8480): Add usage of `container` property for `<Menu/>` component
- Updated dependencies [80219cdd]
- Updated dependencies [2a1d016e]
- Updated dependencies [5f4ba6f3]
- Updated dependencies [561301b1]
- Updated dependencies [a9007acc]
- Updated dependencies [782f67a]
  - @monite/sdk-api@3.7.0

## 3.6.0

### Minor Changes

- c3db24ee: created search field component, added to all tables with search filter

### Patch Changes

- 1220ae0e: We've provided root as a container for all necessary components (DEV-9583)
- af3be9f7: Add descriptions for Onboarding documents
- 6b01a47e: changed text for onboarding last step
- 604e4dbf: update entity onboarding models
- a70860ee: add text for error code 422
- f3a9b29a: show improved error messages in payable line items
- 1d4314db: We've added TextFieldPhone and usage (DEV-2465)
- 1a5389bd: update models and field to check ocr status
- 8db256e: feat(DEV-9582): Fix counterpart bank creation flow. During bank creation flow we always received errors
- Updated dependencies [af3be9f7]
- Updated dependencies [604e4dbf]
- Updated dependencies [a70860ee]
- Updated dependencies [1a5389bd]
  - @monite/sdk-api@3.6.0

## 3.6.0-beta.0

### Minor Changes

- c3db24e: created search field component, added to all tables with search filter

### Patch Changes

- 1220ae0: We've provided root as a container for all necessary components (DEV-9583)
- af3be9f7: Add descriptions for Onboarding documents
- 6b01a47: changed text for onboarding last step
- 604e4dbf: update entity onboarding models
- a70860ee: add text for error code 422
- 1d4314d: We've added TextFieldPhone and usage (DEV-2465)
- 1a5389b: update models and field to check ocr status
- Updated dependencies [af3be9f7]
- Updated dependencies [604e4dbf]
- Updated dependencies [a70860ee]
- Updated dependencies [1a5389b]
  - @monite/sdk-api@3.6.0-beta.0

## 3.5.0

### Minor Changes

- de7ddceb: feat(DEV-8628): Add a button into `Bill to` select and show a counterpart creation form
- 948d03ed: add callback props to Payable component, deprecate ones with wrong names
- 284f8c46: new zoom levels of file preview
- 6dab8cc1: Update to the new API version 2023-09-01
- 2744defb: show approval policy in payable if applied
- ee964e3e: feat(DEV-8987): Create PreviewScreen for the Invoice creation flow
- 0589d9d2: add attach file to payable feature
- f1b33326: Update LinguiJS up to v4
- 8aeb4f21: feat(DEV-8983): Add availability to change from Table into PDF view
- af5e3119: Add onboarding functionality

### Patch Changes

- 1c13726e: remove cache from new payable form
- 4bea13fb: make payable details columns scroll independently
- c6765211: wrap user first last name with function to prevent null
- 14476397: Updated `yaml`, `http-cache-semantics`, `json5`, `loader-utils`, `@adobe/css-tools`, `postcss`, `graphql`, `word-wrap`, `semver`, and `tough-cookie` to address multiple high and moderate severity vulnerabilities.
- 6190fbb7: change the field to display payable tax amount, remove unused hooks, fix line item invalidation
- b073a90a: fix(DEV-9003): Fix InvoicesTable view. Handle default state for `fullfillment_date`, `issue_date`, and `document_id`. Also fixed counterpart name view in the InvoicesTable
- 5efb8454: feat(DEV-7867): Put methods under `useMemo` and `useCallback` to reduce re-rendering time
- 33030aa5: fix(DEV-9003): Change `Create document` button into `Create invoice` in `Receivables` component
- 01352286: feat(DEV-8989): Reuse `Currency` component in Products, Counterpart, and Receivables
- 2e83d980: move from team-monite to monite for public packages in readme files
- f7697755: fix(DEV-9267): Fetch next data only if `next_pagination_token` exists
- a10de7b6: Updated loader-utils package to fix potential vulnerabilities
- 2b21788c: Fix "devDependencies"
- 7e0f9a94: Updated dependencies to address a vulnerability in the deprecated version of @babel/traverse
- Updated dependencies [14476397]
- Updated dependencies [6dab8cc1]
- Updated dependencies [ee964e3e]
- Updated dependencies [0589d9d2]
- Updated dependencies [2e83d980]
- Updated dependencies [7e0f9a94]
  - @monite/sdk-api@3.5.0

## 3.5.0-beta.2

### Minor Changes

- 948d03ed: add callback props to Payable component, deprecate ones with wrong names
- 8aeb4f21: feat(DEV-8983): Add availability to change from Table into PDF view

### Patch Changes

- 1c13726e: remove cache from new payable form
  - @monite/sdk-api@3.5.0-beta.2

## 3.5.0-beta.1

### Minor Changes

- 284f8c46: new zoom levels of file preview
- 2744defb: show approval policy in payable if applied
- ee964e3e: feat(DEV-8987): Create PreviewScreen for the Invoice creation flow
- 0589d9d2: add attach file to payable feature
- af5e3119: Add onboarding functionality

### Patch Changes

- 4bea13fb: make payable details columns scroll independently
- 14476397: Updated `yaml`, `http-cache-semantics`, `json5`, `loader-utils`, `@adobe/css-tools`, `postcss`, `graphql`, `word-wrap`, `semver`, and `tough-cookie` to address multiple high and moderate severity vulnerabilities.
- 6190fbb7: change the field to display payable tax amount, remove unused hooks, fix line item invalidation
- b073a90a: fix(DEV-9003): Fix InvoicesTable view. Handle default state for `fullfillment_date`, `issue_date`, and `document_id`. Also fixed counterpart name view in the InvoicesTable
- 01352286: feat(DEV-8989): Reuse `Currency` component in Products, Counterpart, and Receivables
- f7697755: fix(DEV-9267): Fetch next data only if `next_pagination_token` exists
- a10de7b6: Updated loader-utils package to fix potential vulnerabilities
- 2b21788c: Fix "devDependencies"
- 7e0f9a94: Updated dependencies to address a vulnerability in the deprecated version of @babel/traverse
- Updated dependencies [14476397]
- Updated dependencies [ee964e3e]
- Updated dependencies [0589d9d2]
- Updated dependencies [7e0f9a94]
  - @monite/sdk-api@3.5.0-beta.1

## 3.5.0-beta.0

### Minor Changes

- de7ddceb: feat(DEV-8628): Add a button into `Bill to` select and show a counterpart creation form
- 6dab8cc1: Update to the new API version 2023-09-01
- f1b33326: Update LinguiJS up to v4

### Patch Changes

- c6765211: wrap user first last name with function to prevent null
- 5efb8454: feat(DEV-7867): Put methods under `useMemo` and `useCallback` to reduce re-rendering time
- 2e83d980: move from team-monite to monite for public packages in readme files
- Updated dependencies [6dab8cc1]
- Updated dependencies [2e83d980]
  - @monite/sdk-api@3.5.0-beta.0

## 3.4.0

### Minor Changes

- cd81eb45: feat(DEV-8523): Fix Infinity Scroll for ProductsTable on Create Invoice page
- 20a3bc53: feat(DEV-6687): Create invoice receivables creation
- adb18e07: feat(DEV-7835): Add counterparts and entity VAT & TAX id's in invoice creation. Add Fulfillment date & Purchase order field
- aeb715c8: feat(DEV-7837): Provide `Billing` & `Shipping` addresses into invoice creation form
- 57d402c9: add pdf viewer scale limit
- 120b27cf: feat(DEV-8528): Show VAT exempt rationale when at least 1 item has 0% VAT
- 9ef423b5: feat(8574): Provide `ProductsTable` and `ProductsDetails` as Public API components
- e18ee66d: feat(DEV-7835): Provide an API to toggle tabs in ReceivablesTable
- 4713cea3: feat(DEV-8526): Create new product or service via Create Invoice form

### Patch Changes

- f9a81e34: Fix `<RHFAutocomplete />` component styles leakage from Shadow DOM
- 936fa15b: feat(DEV-8523): Implement infinity scroll for the ProductsTable in Create invoice component
- abe5e621: fit invoice preview to column width
- 3e8d518f: Creating a `QueryClient` with `MoniteProvider` during rendering in favor of server-side rendering compatibility
- a08b475d: Fix `<DatePicker />` component styles leakage from Shadow DOM
- 7e614607: Fix `<DatePicker />` component styles leakage from Shadow DOM
- f4c90c17: Improve internalization
- Updated dependencies [adb18e07]
  - @monite/sdk-api@3.4.0

## 3.4.0-beta.4

### Minor Changes

- adb18e07: feat(DEV-7835): Add counterparts and entity VAT & TAX id's in invoice creation. Add Fulfillment date & Purchase order field
- e18ee66d: feat(DEV-7835): Provide an API to toggle tabs in ReceivablesTable

### Patch Changes

- a08b475d: Fix `<DatePicker />` component styles leakage from Shadow DOM
- Updated dependencies [adb18e07]
  - @monite/sdk-api@3.4.0-beta.4

## 3.4.0-beta.3

### Minor Changes

- 4713cea3: feat(DEV-8526): Create new product or service via Create Invoice form

### Patch Changes

- f9a81e34: Fix `<RHFAutocomplete />` component styles leakage from Shadow DOM
- 7e614607: Fix `<DatePicker />` component styles leakage from Shadow DOM
  - @monite/sdk-api@3.4.0-beta.3

## 3.4.0-beta.2

### Minor Changes

- aeb715c8: feat(DEV-7837): Provide `Billing` & `Shipping` addresses into invoice creation form

### Patch Changes

- @monite/sdk-api@3.4.0-beta.2

## 3.4.0-beta.1

### Minor Changes

- 57d402c9: add pdf viewer scale limit
- 120b27cf: feat(DEV-8528): Show VAT exempt rationale when at least 1 item has 0% VAT
- 9ef423b5: feat(8574): Provide `ProductsTable` and `ProductsDetails` as Public API components

### Patch Changes

- 936fa15b: feat(DEV-8523): Implement infinity scroll for the ProductsTable in Create invoice component
- abe5e621: fit invoice preview to column width
- 3e8d518f: Creating a `QueryClient` with `MoniteProvider` during rendering in favor of server-side rendering compatibility
  - @monite/sdk-api@3.4.0-beta.1

## 3.4.0-beta.0

### Minor Changes

- 20a3bc53: feat(DEV-6687): Create invoice receivables creation

### Patch Changes

- @monite/sdk-api@3.4.0-beta.0

## 3.3.0

### Minor Changes

- d24c9ac1: Added `ProductCreateForm` component for creating products.
  Added `ProductEditForm` component for editing products.
  Added `ProductDeleteModal` component for deleting products.

### Patch Changes

- be7f79f7: fix(DEV-8331): Fix styles for CounterpartDetails. Now all rows have the same height
- 88b2ca3c: Updated tests for payable details
  - @monite/sdk-api@3.3.0

## 3.3.0-beta.0

### Minor Changes

- d24c9ac1: Added `ProductCreateForm` component for creating products.
  Added `ProductEditForm` component for editing products.
  Added `ProductDeleteModal` component for deleting products.

### Patch Changes

- be7f79f7: fix(DEV-8331): Fix styles for CounterpartDetails. Now all rows have the same height
- 88b2ca3c: Updated tests for payable details
  - @monite/sdk-api@3.3.0-beta.0

## 3.2.0

### Minor Changes

- 1c782141: Added a new component to display product details `<ProductDetails />`
- 313785d6: add ocr processing state to payable table and details

### Patch Changes

- 3b4f98b9: feat(DEV-8278): Validations removal for creation of banking information in counterparts
  - @monite/sdk-api@3.2.0

## 3.1.0

### Minor Changes

- 75b5d192: Added a new component to display list of products `<ProductsTable />` with built-in filters, sorting and pagination
- 6d383559: `InvoiceDetails` now can create invoices but not only update it. Provide `type` property and you will see a create receivables page

### Patch Changes

- 29b26fce: Reset cache in TagsFormModal when the dialog is closed
- 2c37c49e: Fix payable fixtures to fetch correct counterpart in test environment
- e22986cc: fix(DEV-8029): Do not show `Cancel` button at CounterpartDetails when the form in `create` mode and not in modal
- 1e1e0b54: Fix console.log errors in confirmation dialogs
- 46aa3d16: Show `NotFound` page for CounterpartDetails component, if there is no counterpart by provided `id`
- 7214b090: Disable AR invoice
- a743ef0e: Add Bank Account to Counterpart form depends on the selected country:

  - `account_number` and `sort_code` fields have been added for GB
  - `account_number` and `routing_number` fields have been added for US

  Bank Account information displays fields `account_number`, `sort_code` and `routing_number`, if present.

- f4235b22: updating schema for receivable invoice entity
- bf302b87: fix(DEV-7486): Incorrect error display for a client while updating payable details
- Updated dependencies [75b5d192]
- Updated dependencies [023f2893]
- Updated dependencies [6d383559]
- Updated dependencies [f4235b22]
  - @monite/sdk-api@3.1.0

## 3.1.0-beta.1

### Minor Changes

- 75b5d192: Added a new component to display list of products `<ProductsTable />` with built-in filters, sorting and pagination

### Patch Changes

- 29b26fce: Reset cache in TagsFormModal when the dialog is closed
- e22986cc: fix(DEV-8029): Do not show `Cancel` button at CounterpartDetails when the form in `create` mode and not in modal
- 1e1e0b54: Fix console.log errors in confirmation dialogs
- 46aa3d16: Show `NotFound` page for CounterpartDetails component, if there is no counterpart by provided `id`
- 7214b090: Disable AR invoice
- a743ef0e: Add Bank Account to Counterpart form depends on the selected country:

  - `account_number` and `sort_code` fields have been added for GB
  - `account_number` and `routing_number` fields have been added for US

  Bank Account information displays fields `account_number`, `sort_code` and `routing_number`, if present.

- bf302b87: fix(DEV-7486): Incorrect error display for a client while updating payable details
- Updated dependencies [75b5d192]
  - @monite/sdk-api@3.1.0-beta.1

## 3.1.0-beta.0

### Minor Changes

- 6d383559: `InvoiceDetails` now can create invoices but not only update it. Provide `type` property and you will see a create receivables page

### Patch Changes

- 2c37c49e: Fix payable fixtures to fetch correct counterpart in test environment
- f4235b22: updating schema for receivable invoice entity
- Updated dependencies [6d383559]
- Updated dependencies [f4235b22]
  - @monite/sdk-api@3.1.0-beta.0

## 3.0.1

### Major Changes

- 4ce28be7: Migrate TagsTable into Material UI
- 01c6cf74: Rewrite Payable Details component with Material UI components
- 6888a5d7: Migrate ApprovalPoliciesTable into Material UI

### Minor Changes

- f357cb2c: Added Counterpart VAT IDd supporting
- 976f991e: Created line items service and added line items form.

### Patch Changes

- ee5ec5cb: Improve CounterpartsTable delete dialog (to avoid any blinks)
- d9625e0e: Provide default monite theme from SDK
- e72a6399: removed contacts request for individual counterparts
- 5b0723ff: removed unused props for payable details
- b5ab872c: Add support of `tax_id` field for the Counterpart
- 69f37e38: fix currency consistency in payable details form
- 57b0d0d2: Add sort code, routing and account numbers in counterparts bank accounts
- b1d6158d: Provide `Dialog` as public component from UI Widgets React
- 78fee2a5: fixed closing menu for payable creation menu
- 30efe12c: remove required attribute for counterpart in payable details
- 2cc37d6c: add dependency between cancel button and permissions for payable details
- e94f8d06: update tax calculation for payable
- 90a204c0: Updated API Models & Services to support `tax_id` field
- dce5d4aa: Capability to add custom caption to the "CounterpartOrganizationForm" Business Adresss section
- 41740f4c: update not found dialog template and handle not found case for payable details coponent
- dce411e6: added payable form creation
- 8dcc3471: Provide default theme to MoniteThemeProvider
- 2a5ff49a: Remove `onClose` properties from \*Details components
- f4c81144: added bank account to readonly payable view
- 7c6c5116: deleting the `currencyLocale` field and replacing it with the `code` parameter.
- Updated dependencies [f357cb2c]
- Updated dependencies [90a204c0]
- Updated dependencies [976f991e]
  - @monite/sdk-api@3.0.0

## 3.0.0-beta.1

### Patch Changes

- 57b0d0d2: Add sort code, routing and account numbers in counterparts bank accounts
- 2cc37d6c: add dependency between cancel button and permissions for payable details
- 90a204c0: Updated API Models & Services to support `tax_id` field
- 41740f4c: update not found dialog template and handle not found case for payable details coponent
- 7c6c5116: deleting the `currencyLocale` field and replacing it with the `code` parameter.
- Updated dependencies [90a204c0]
  - @monite/sdk-api@3.0.0-beta.1

## 3.0.0-alpha.6

### Minor Changes

- f357cb2c: Added Counterpart VAT IDd supporting

### Patch Changes

- dce411e6: added payable form creation
- Updated dependencies [f357cb2c]
  - @team-monite/sdk-api@3.0.0-alpha.6

## 3.0.0-alpha.5

### Patch Changes

- 2a5ff49a: Remove `onClose` properties from \*Details components
  - @team-monite/sdk-api@3.0.0-alpha.5

## 3.0.0-alpha.4

### Patch Changes

- ee5ec5cb: Improve CounterpartsTable delete dialog (to avoid any blinks)
- b1d6158d: Provide `Dialog` as public component from UI Widgets React
  - @team-monite/sdk-api@3.0.0-alpha.4

## 3.0.0-alpha.3

### Patch Changes

- 8dcc3471: Provide default theme to MoniteThemeProvider
  - @team-monite/sdk-api@3.0.0-alpha.3

## 3.0.0-alpha.2

### Patch Changes

- d9625e0e: Provide default monite theme from SDK
  - @team-monite/sdk-api@3.0.0-alpha.2

## 3.0.0-alpha.1

### Patch Changes

- Updated dependencies [c36c07eb]
  - @team-monite/ui-kit-react@2.4.3-alpha.0
  - @team-monite/sdk-api@3.0.0-alpha.1

## 3.0.0-alpha.0

### Major Changes

- 4ce28be7: Migrate TagsTable into Material UI
- 01c6cf74: Rewrite Payable Details component with Material UI components
- 6888a5d7: Migrate ApprovalPoliciesTable into Material UI

### Minor Changes

- 976f991e: Created line items service and added line items form.

### Patch Changes

- Updated dependencies [976f991e]
  - @team-monite/sdk-api@3.0.0-alpha.0

## 2.8.0

### Minor Changes

- d8884495: added a date formatter for payable payload

### Patch Changes

- @team-monite/sdk-api@2.8.0

## 2.8.0-beta.0

### Minor Changes

- d8884495: added a date formatter for payable payload

### Patch Changes

- @team-monite/sdk-api@2.8.0-beta.0

## 2.7.0

### Minor Changes

- d753cbee: Added new props 'showCategories' and 'defaultCategories' for CounterpartsDetails
  and 'showCategories' for CounterpartsTable

### Patch Changes

- @team-monite/sdk-api@2.7.0

## 2.7.0-beta.0

### Minor Changes

- d753cbee: Added new props 'showCategories' and 'defaultCategories' for Counterparts
- 92ceef92: Added 'showCategories' and 'defaultValues' props for Counterpart

### Patch Changes

- @team-monite/sdk-api@2.7.0-beta.0

## 2.6.1

### Patch Changes

- 0d939bae: Fix locale change in realtime
- dfb43c4e: Add Widget wrappers
- Updated dependencies [34fbf100]
  - @team-monite/sdk-api@2.6.1

## 2.6.0

### Minor Changes

- 8bd72e4c: Implemented view as a page for all detail components

### Patch Changes

- @team-monite/sdk-api@2.6.0

## 2.6.0-beta.0

### Minor Changes

- 8bd72e4c: Implemented view as a page for all detail components

### Patch Changes

- @team-monite/sdk-api@2.6.0-beta.0

## 2.5.0

### Minor Changes

- db65bf5a: Added two new attributes to the drop-in: component and router
- a7c8f33c: Remove Router from MoniteProvider
- 82658d2a: Bumping
- 21f3adf3: Updated models according OpenAPI scheme

### Patch Changes

- 50132c05: Use `currencyLocale` property to localize not only currency format but also dates
- 5ff47d1b: Improve "dev" hot-reload
- 50132c05: Apply `currencyLocale` not only at currencies but also to the dates
- 341d459a: Add displaying of "Approval chain" in "Approval policies"
- d4d96c42: Make search in CounterpartsTable from case-sensitive into case-insensitive
- 2bbca641: fix invoice details crash
- 556bdf80: Generated new models
- eb32e7a1: Fix React Query Devtools dependencies
- 9631ff22: Updated exports from widgets
- Updated dependencies [5ff47d1b]
- Updated dependencies [cb7b3711]
- Updated dependencies [6abe2300]
- Updated dependencies [77a52bcd]
- Updated dependencies [556bdf80]
- Updated dependencies [9b20b294]
- Updated dependencies [21f3adf3]
  - @team-monite/ui-kit-react@2.4.2
  - @team-monite/sdk-api@2.5.0

## 2.5.0-beta.7

### Patch Changes

- eb32e7a1: Fix React Query Devtools dependencies
  - @team-monite/sdk-api@2.5.0-beta.7

## 2.5.0-beta.6

### Patch Changes

- 9631ff22: Updated exports from widgets
  - @team-monite/sdk-api@2.5.0-beta.6

## 2.5.0-beta.5

### Minor Changes

- a7c8f33c: Remove Router from MoniteProvider

### Patch Changes

- @team-monite/sdk-api@2.5.0-beta.5

## 2.5.0-beta.4

### Minor Changes

- db65bf5a: Added two new attributes to the drop-in: component and router
- 21f3adf3: Updated models according OpenAPI scheme

### Patch Changes

- 50132c05: Use `currencyLocale` property to localize not only currency format but also dates
- 50132c05: Apply `currencyLocale` not only at currencies but also to the dates
- 2bbca641: fix invoice details crash
- Updated dependencies [21f3adf3]
  - @team-monite/sdk-api@2.5.0-beta.4

## 2.5.0-beta.3

### Minor Changes

- 82658d2a: Bumping

### Patch Changes

- 556bdf80: Generated new models
- Updated dependencies [556bdf80]
  - @team-monite/sdk-api@2.5.0-beta.3

## 2.4.2-beta.2

### Patch Changes

- 5ff47d1b: Improve "dev" hot-reload
- 341d459a: Add displaying of "Approval chain" in "Approval policies"
- d4d96c42: Make search in CounterpartsTable from case-sensitive into case-insensitive
- Updated dependencies [5ff47d1b]
- Updated dependencies [cb7b3711]
- Updated dependencies [9b20b294]
  - @team-monite/ui-kit-react@2.4.2-beta.0
  - @team-monite/sdk-api@2.4.0-beta.2

## 2.4.2-beta.1

### Patch Changes

- Updated dependencies [77a52bcd]
  - @team-monite/sdk-api@2.4.0-beta.1

## 2.4.2-beta.0

### Patch Changes

- Updated dependencies [6abe2300]
  - @team-monite/sdk-api@2.4.0-beta.0

## 2.4.1

### Patch Changes

- 901d376e: Republish Packages under release tag
- Updated dependencies [901d376e]
  - @team-monite/sdk-api@2.3.1
  - @team-monite/ui-kit-react@2.4.1

## 2.4.0

### Minor Changes

- 649d00e9: Add Super Components
- 20803381: Upgrade Lingui packages
- 6cd3e080: Changed component files hierarchy
- f98ad817: Add permissions for CounterpartDetails component. Now it's not possible to do Edit / Delete actions if the
  user has no permissions to do so
- 2d9afca3: Add Payable Upload support

### Patch Changes

- 8defcfdd: fix AccessRestriction banner alignment
- 55fece4e: Set default currency format based on user browser locale
- 36f76f2f: Remove usage of top level `t`
- Updated dependencies [911d5b9c]
- Updated dependencies [98dde9a8]
- Updated dependencies [ea6cdd77]
- Updated dependencies [de2834e8]
- Updated dependencies [2d9afca3]
- Updated dependencies [9df1a9f6]
- Updated dependencies [537bfd07]
  - @team-monite/ui-kit-react@2.4.0
  - @team-monite/sdk-api@2.3.0

## 2.4.0-beta.6

### Minor Changes

- 649d00e9: Add Super Components
- 6cd3e080: Changed component files hierarchy
- 2d9afca3: Add Payable Upload support

### Patch Changes

- Updated dependencies [2d9afca3]
  - @team-monite/sdk-api@2.3.0-beta.3

## 2.4.0-beta.5

### Patch Changes

- Updated dependencies [911d5b9c]
  - @team-monite/ui-kit-react@2.4.0-beta.2

## 2.4.0-beta.4

### Patch Changes

- 55fece4e: Set default currency format based on user browser locale
- Updated dependencies [9df1a9f6]
  - @team-monite/sdk-api@2.3.0-beta.2

## 2.4.0-beta.3

### Patch Changes

- Updated dependencies [de2834e8]
  - @team-monite/sdk-api@2.3.0-beta.1

## 2.4.0-beta.2

### Patch Changes

- Updated dependencies [98dde9a8]
  - @team-monite/sdk-api@2.3.0-beta.0

## 2.4.0-beta.1

### Minor Changes

- f98ad817: Add permissions for CounterpartDetails component. Now it's not possible to do Edit / Delete actions if the
  user has no permissions to do so

### Patch Changes

- Updated dependencies [537bfd07]
  - @team-monite/ui-kit-react@2.4.0-beta.1

## 2.4.0-beta.0

### Minor Changes

- 20803381: Upgrade Lingui packages

### Patch Changes

- 8defcfdd: fix AccessRestriction banner alignment
- 36f76f2f: Remove usage of top level `t`
- Updated dependencies [ea6cdd77]
  - @team-monite/ui-kit-react@2.4.0-beta.0

## 2.3.0

### Minor Changes

- 6f1e36ed: Add "Monite Web Component"

### Patch Changes

- 156a1be9: `entity_users/${id}` requests are not executed if there is no entity_user_id provided
- Updated dependencies [6f1e36ed]
- Updated dependencies [156a1be9]
  - @team-monite/ui-kit-react@2.3.0
  - @team-monite/sdk-api@2.2.1
    - @team-monite/ui-kit-react@2.4.2
    - @team-monite/sdk-api@2.5.0
    - @team-monite/sdk-api@2.5.0-beta.7
    - @team-monite/sdk-api@2.5.0-beta.6
    - @team-monite/sdk-api@2.5.0-beta.4
    - @team-monite/sdk-api@2.5.0-beta.3
    - @team-monite/ui-kit-react@2.4.2-beta.0
    - @team-monite/sdk-api@2.4.0-beta.2
    - @team-monite/sdk-api@2.4.0-beta.1
    - @team-monite/sdk-api@2.4.0-beta.0
    - @team-monite/sdk-api@2.3.1
    - @team-monite/ui-kit-react@2.4.1
- f98ad817: Add permissions for CounterpartDetails component. Now it's not possible to do Edit / Delete actions if the
  user has no permissions to do so
  - @team-monite/ui-kit-react@2.4.0
  - @team-monite/sdk-api@2.3.0
  - @team-monite/sdk-api@2.3.0-beta.3
  - @team-monite/ui-kit-react@2.4.0-beta.2
  - @team-monite/sdk-api@2.3.0-beta.2
  - @team-monite/sdk-api@2.3.0-beta.1
  - @team-monite/sdk-api@2.3.0-beta.0
- f98ad817: Add permissions for CounterpartDetails component. Now it's not possible to do Edit / Delete actions if the
  user has no permissions to do so
  - @team-monite/ui-kit-react@2.4.0-beta.1
  - @team-monite/ui-kit-react@2.4.0-beta.0
  - @team-monite/ui-kit-react@2.3.0
  - @team-monite/sdk-api@2.2.1
