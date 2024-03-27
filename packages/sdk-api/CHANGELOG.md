# @monite/sdk-api

## 3.9.0

### Minor Changes

- a61f5f0c: feature(DEV-9854): add table for user roles

## 3.8.0

### Minor Changes

- f00c951: feat(DEV-10049): Generate a payment link before user emails an invoice

## 3.7.0

### Minor Changes

- 2a1d016e: feat(DEV-3954): Add Sentry to UI Widgets
- 561301b1: add ApprovalPolicyDetails component
- a9007acc: feat(DEV-9563): add read/create/update functionality for approval policy
- 782f67a: fix(DEV-9368): Add mapping for countries depending on currency for bank accounts in onboarding

### Patch Changes

- 80219cdd: chore(DEV-9786): Update dependencies up to secure version
- 5f4ba6f3: fix(DEV-9448): Session expiration

## 3.6.0

### Patch Changes

- af3be9f7: Add descriptions for Onboarding documents
- 604e4dbf: update entity onboarding models
- a70860ee: add text for error code 422
- 1a5389bd: update models and field to check ocr status

## 3.6.0-beta.0

### Patch Changes

- af3be9f7: Add descriptions for Onboarding documents
- 604e4dbf: update entity onboarding models
- a70860ee: add text for error code 422
- 1a5389b: update models and field to check ocr status

## 3.5.0

### Minor Changes

- 6dab8cc1: Update to the new API version 2023-09-01
- ee964e3e: feat(DEV-8987): Create PreviewScreen for the Invoice creation flow
- 0589d9d2: add attach file to payable feature

### Patch Changes

- 14476397: Updated `yaml`, `http-cache-semantics`, `json5`, `loader-utils`, `@adobe/css-tools`, `postcss`, `graphql`, `word-wrap`, `semver`, and `tough-cookie` to address multiple high and moderate severity vulnerabilities.
- 2e83d980: move from team-monite to monite for public packages in readme files
- 7e0f9a94: Updated dependencies to address a vulnerability in the deprecated version of @babel/traverse

## 3.5.0-beta.2

## 3.5.0-beta.1

### Minor Changes

- ee964e3e: feat(DEV-8987): Create PreviewScreen for the Invoice creation flow
- 0589d9d2: add attach file to payable feature

### Patch Changes

- 14476397: Updated `yaml`, `http-cache-semantics`, `json5`, `loader-utils`, `@adobe/css-tools`, `postcss`, `graphql`, `word-wrap`, `semver`, and `tough-cookie` to address multiple high and moderate severity vulnerabilities.
- 7e0f9a94: Updated dependencies to address a vulnerability in the deprecated version of @babel/traverse

## 3.5.0-beta.0

### Minor Changes

- 6dab8cc1: Update to the new API version 2023-09-01

### Patch Changes

- 2e83d980: move from team-monite to monite for public packages in readme files

## 3.4.0

### Minor Changes

- adb18e07: feat(DEV-7835): Add counterparts and entity VAT & TAX id's in invoice creation. Add Fulfillment date & Purchase order field

## 3.4.0-beta.4

### Minor Changes

- adb18e07: feat(DEV-7835): Add counterparts and entity VAT & TAX id's in invoice creation. Add Fulfillment date & Purchase order field

## 3.4.0-beta.3

## 3.4.0-beta.2

## 3.4.0-beta.1

## 3.4.0-beta.0

## 3.3.0

## 3.3.0-beta.0

## 3.2.0

## 3.1.0

### Minor Changes

- 75b5d192: Added a new component to display list of products `<ProductsTable />` with built-in filters, sorting and pagination
- 6d383559: `InvoiceDetails` now can create invoices but not only update it. Provide `type` property and you will see a create receivables page

### Patch Changes

- 023f2893: Enable storybook story-source
- f4235b22: updating schema for receivable invoice entity

## 3.1.0-beta.1

### Minor Changes

- 75b5d192: Added a new component to display list of products `<ProductsTable />` with built-in filters, sorting and pagination

## 3.1.0-beta.0

### Minor Changes

- 6d383559: `InvoiceDetails` now can create invoices but not only update it. Provide `type` property and you will see a create receivables page

### Patch Changes

- f4235b22: updating schema for receivable invoice entity

## 3.0.1

### Minor Changes

- f357cb2c: Added Counterpart VAT IDd supporting
- 976f991e: Created line items service and added line items form.

### Patch Changes

- 90a204c0: Updated API Models & Services to support `tax_id` field

## 3.0.0-beta.1

### Patch Changes

- 90a204c0: Updated API Models & Services to support `tax_id` field

## 3.0.0-alpha.6

### Minor Changes

- f357cb2c: Added Counterpart VAT IDd supporting

## 3.0.0-alpha.5

## 3.0.0-alpha.4

## 3.0.0-alpha.3

## 3.0.0-alpha.2

## 3.0.0-alpha.1

## 3.0.0-alpha.0

### Minor Changes

- 976f991e: Created line items service and added line items form.

## 2.8.0

## 2.8.0-beta.0

## 2.7.0

## 2.7.0-beta.0

## 2.6.1

### Patch Changes

- 34fbf100: Fix `PaymentService.confirmPayment` endpoint url

## 2.6.0

## 2.6.0-beta.0

## 2.5.0

### Minor Changes

- 6abe2300: Update API services and interfaces
- 77a52bcd: Added ability to set Authorization via option with headers from '\_\_request'
- 9b20b294: Covered receivables API methods in SDK
- 21f3adf3: Updated models according OpenAPI scheme

### Patch Changes

- 5ff47d1b: Improve "dev" hot-reload
- cb7b3711: Moved to the new API version 2023-04-12
- 556bdf80: Generated new models

## 2.5.0-beta.7

## 2.5.0-beta.6

## 2.5.0-beta.5

## 2.5.0-beta.4

### Minor Changes

- 21f3adf3: Updated models according OpenAPI scheme

## 2.5.0-beta.3

### Patch Changes

- 556bdf80: Generated new models

## 2.4.0-beta.2

### Minor Changes

- 9b20b294: Covered receivables API methods in SDK

### Patch Changes

- 5ff47d1b: Improve "dev" hot-reload
- cb7b3711: Moved to the new API version 2023-04-12

## 2.4.0-beta.1

### Minor Changes

- 77a52bcd: Added ability to set Authorization via option with headers from '\_\_request'

## 2.4.0-beta.0

### Minor Changes

- 6abe2300: Update API services and interfaces

## 2.3.1

### Patch Changes

- 901d376e: Republish Packages under release tag

## 2.3.0

### Minor Changes

- 98dde9a8: Update server models & provide new methods for OnboardingService for Stripe and Airwallex Component onboarding processes
- 2d9afca3: Add Payable Upload support
- 9df1a9f6: Updated backend models

### Patch Changes

- de2834e8: Update current Onboarding schemas

## 2.3.0-beta.3

### Minor Changes

- 2d9afca3: Add Payable Upload support

## 2.3.0-beta.2

### Minor Changes

- 9df1a9f6: Updated backend models

## 2.3.0-beta.1

### Patch Changes

- de2834e8: Update current Onboarding schemas

## 2.3.0-beta.0

### Minor Changes

- 98dde9a8: Update server models & provide new methods for OnboardingService for Stripe and Airwallex Component onboarding processes

## 2.2.1

### Patch Changes

- 156a1be9: `entity_users/${id}` requests are not executed if there is no entity_user_id provided
