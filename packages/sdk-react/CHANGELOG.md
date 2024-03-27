# @monite/sdk-react

## 3.9.0

### Minor Changes

- b030810: feature(DEV-9854): add table for user roles

### Patch Changes

- b030810: refactor(DEV-9443): Improved user permission support for UI
- b030810: fix(DEV-9443): Do not display output `null` in `<ApprovalPoliciesUser/>`if user name is not specified
- Updated dependencies [b030810]
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
