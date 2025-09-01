# @monite/sdk-drop-in

## 2.4.0

### Minor Changes

- cd86e73: Fix UX issue on forms when some data would automatically refetch on the background

### Patch Changes

- d332e4f: Various line item fixes (validation, formatting, etc)
- ec9113e: Implemented footer field for customer notes in invoice
- ba35d0e: Save input upon chat closure. Add chat to chat history right away. Fix UI problem with buttons.

## 2.3.0

### Minor Changes

- 17e46dd: Added a new componentSettings property for templateSettings availableTemplateIds that allows the partner to customise which templates will be available for selection on the template selection component
- f9c0497: Added entity profile modal in invoice creation screen

### Patch Changes

- fe155c6: Improved cleanup handling for fixing memory leaks
- 9a3b6a1: Apply font-family from Theme to tailwind fonts
- a415f2d: Rename Payables default title to Bill Pay
- cfa6cb9: Add payables approval flow components and logic

## 2.2.1

### Patch Changes

- 102dc7e: Event handlers for payable actions (such as saved, canceled, submitted, etc.) are now only available when a corresponding callback is defined; otherwise, they will be undefined

## 2.2.0

### Minor Changes

- 7ef2451: Theme colors improved across components
- 7f17198: Add primaryForeground color property. This can be used to customize the text/icons color on primary elements (e.g. buttons)

### Patch Changes

- 954ee35: Add payables custom event callbacks. A custom hook for managing component settings callbacks
- 20d79d8: Fix inconsistencies with primary color generation

## 2.1.0

### Minor Changes

- 55393f1: New built-in PDF viewer
- 979f92a: Custom VAT rates properties are added to the schema
- d9f6ba1: Added clone functionality for invoices
- 3e50e05: Update columns on Account Payables Table
- 2a0d029: Added functionality for selecting vat mode when creating an invoice
- cb1028a: - Replaced current `DocumentDesign` component with `TemplateSettings`, a more complete component to edit template settings, giving more flexibility in customisation. It accepts 3 props: - `isDialog`, a boolean value that tells whether the component will be rendered inside a Dialog wrapper or not - `isOpen`, a boolean flag that controls the dialog state - `handleCloseDialog`, a callback function that is called to close the dialog
  - Also added a new option in componentSettings: `templateSettings`
    This option allows the user to further customise how the settings will be presented and it accepts the following props: - `showTemplateSection`, a boolean value that defines whether to display or not the template selection section, defaults to true. - `showTemplatePreview`, a boolean value that defines whether to display or not the template PDF preview, defaults to true. - `showLogoSection`, a boolean value that defines whether to display or not the logo selection section, defaults to true. - `enableDocumentNumberCustomisationTab`, a boolean value that enables the document number customisation tab if true or hides it if false, defaults to true. - `availableARDocuments`, list of available AR documents for customisation, defaults to all of the documents. - `availableAPDocuments`, list of available AP documents for customisation, defaults to all of the documents.

### Patch Changes

- 505e8b9: Fix validation triggering automatically when creating a new payable
- f557381: Fixed bugs on the Invoice Creation screen, specifically on the VAT and memo fields, and on the costumer modal. Improved design of the reminders component.
- d5b8f4b: Removed ssn_last_4 in favor of id_number

## 2.0.3

### Patch Changes

- 350ac2e: Fixed some minor bugs with bank account behavior

## 2.0.2

### Patch Changes

- 1fdc678: Fixed invoice preview not showing bank account information and some other minor fixes to bank account creation
- d62d343: Business website field renamed to URL, alert info updated to reflect the change

## 2.0.1

### Patch Changes

- 560bd48: Added some minor adjustments to finance banner

## 2.0.0

### Major Changes

- 646c7ac: Bump Drop-in (v4)
- 595e63a: Financing components have been redesigned and improved, FinanceBanner is now the main component to display financing outside of FinancingTab
  - FinanceApplicationCard has been renamed to FinanceIntegrationCard
  - FinanceBanner accepts 2 props:
    - enableServicingBanner
    - handleViewDetails
      It is also worth noting that the width of the banner is 100%, so what defines the width of the banner is the wrapping container.

  enableServicingBanner is a boolean flag that enables the FinanceBanner to be a small summarized version of the financing tab, but only works when entity is onboarded and is servicing.

  handleViewDetails is a function that is passed to the View details button. The button will only appear when entity is servicing, enableServicingBanner is true and handleViewDetails is passed. The purpose of this button is to give the user a way to navigate to the financing page through it.

  componentSettings now also has an option for financing which allows user to customize whether the finance menu buttons will show on the top right corner of the financing tab page or inside the finance card. By default the buttons will show at the top right corner.
  componentSettings also allows user to pass an array of finance steps to define the content of the How does invoice financing work drawer component.

### Minor Changes

- 60a0972: New Dropin syntax
- 166b0d8: refactor(DEV-12144) remove sdk-api package
- 143072a: Default styles refresh across all components
- c5d39e5: Line item units management added
- 9d52e3b: - Added entity bank account creation flow
  - Receivables now exports `BankAccountFormDialog`, a Dialog component for the entity bank account creation flow
    This component has the following props:
    - `entityBankAccountId` id of the selected bank account, if passed, dialog will be edit mode and if not it will be the create one.
    - `isOpen` determines the state of the dialog
    - `bankAccounts` list of available entity bank accounts
    - `onCancel` callback function when clicking on Cancel button
    - `onCreate` callback function that gets called after creating new bank account
    - `onUpdate` callback function that gets called after updating a bank account
    - `onDelete` callback function that gets called after deleting a bank account
    - `handleClose` callback function that gets called when closing the dialog
    - `handleSelectBankAfterDeletion` callback function that gets called after bank account is deleted to enable user to select another bank account

  - `componentSettings` now has 3 new properties for `receivables`:
    - `enableEntityBankAccount` flag to turn on entity bank account creation, by default it is set to false.
    - `bankAccountCountries` custom list of available countries to select from when creating a bank account, by default we display all.
    - `bankAccountCurrencies` custom list of available currencies to select from when creating a bank account, by default we display all.

- 5dddf03: New pre-release v4
- 0a107f7: Adds Dropin unmount method
- 575e2a6: Fix Kanmon SDK env URL
- 3583a16: Bump Drop-in
- 2c645e2: Fixed style issues
- 00808d4: update sdk dependency
- 010861f: Added discounts for payables
- 9462a2f: Invoice creation redesign
- 4fed228: Bump dropin to latest version
- 331d6d4: feat(proposal): add component settings
- bee7fab: Change Dropin exports
- ca42346: Added ability to hide customer type section when creating a counterpart, default is set to ['customer', 'vendor'] through componentSettings and also added a new property called customerTypes to Receivables, Payables and Counterparts components to customize the available customer type options when creating a counterpart

### Patch Changes

- 7b75dbf: Add Document templates to Dropin
- 8ccf36d: Improve onboarding styles and copies
- 6a68134: Prepend https in empty Onboarding URL field
- 2fe7793: Style improvements in Onboarding component
- 23c29de: Update Kanmon live URL
- cb63d74: onCreate receivable event added
- 92425e1: Fix payment term discounts translations
- 2c0fd42: Onboarding footer customization: added `onboarding.footerLogoUrl` and `onboarding.footerWebsiteUrl` to `componentSettings` for direct configuration.
- 923df35: Fix counterpart creation form styles
- d068bbf: Added onboarding and sent invoice email events to the SDK and Drop-in component
- 069ec35: Ordered customers filter dropdown in Receivables alphabetically
- a8b6f84: Re-create translation files
- 2f0f481: Fix invoice preview styles
- 368fe8e: UI minor fixes in invoice creation
- 6ead5f4: Fix issue with Kanmon provider
- 1a0042c: Fix styling issues in Receivables table
- 18df891: Improve error messages in Products&Services component
- 3f6cd29: Load styles on invoice preview properly
- e70b0de: First invoice sent event renamed to invoice sent
- 4a9f5e5: Event handlers for drop in component (Receivables)
- 25e34f4: Improve aspect ratio in Invoice preview
- 0539718: Add onContinue/onComplete events in onboarding component
- ef4d3b1: Fix issue when adding bank accounts through the onboarding flow
- 34cd50b: Onboarding minor fixes

## 2.0.0-beta.7

### Patch Changes

- 34cd50b: Onboarding minor fixes

## 2.0.0-beta.6

### Patch Changes

- 8ccf36d: Improve onboarding styles and copies
- ef4d3b1: Fix issue when adding bank accounts through the onboarding flow

## 2.0.0-beta.5

### Patch Changes

- 0539718: Add onContinue/onComplete events in onboarding component

## 2.0.0-beta.4

### Patch Changes

- 6ead5f4: Fix issue with Kanmon provider

## 2.0.0-beta.3

### Major Changes

- 595e63a: Financing components have been redesigned and improved, FinanceBanner is now the main component to display financing outside of FinancingTab
  - FinanceApplicationCard has been renamed to FinanceIntegrationCard
  - FinanceBanner accepts 2 props:
    - enableServicingBanner
    - handleViewDetails
      It is also worth noting that the width of the banner is 100%, so what defines the width of the banner is the wrapping container.

  enableServicingBanner is a boolean flag that enables the FinanceBanner to be a small summarized version of the financing tab, but only works when entity is onboarded and is servicing.

  handleViewDetails is a function that is passed to the View details button. The button will only appear when entity is servicing, enableServicingBanner is true and handleViewDetails is passed. The purpose of this button is to give the user a way to navigate to the financing page through it.

  componentSettings now also has an option for financing which allows user to customize whether the finance menu buttons will show on the top right corner of the financing tab page or inside the finance card. By default the buttons will show at the top right corner.
  componentSettings also allows user to pass an array of finance steps to define the content of the How does invoice financing work drawer component.

### Patch Changes

- 2fe7793: Style improvements in Onboarding component
- 2c0fd42: Onboarding footer customization: added `onboarding.footerLogoUrl` and `onboarding.footerWebsiteUrl` to `componentSettings` for direct configuration.
- 069ec35: Ordered customers filter dropdown in Receivables alphabetically
- e70b0de: First invoice sent event renamed to invoice sent

## 2.0.0-beta.2

### Patch Changes

- 7b75dbf: Add Document templates to Dropin

## 2.0.0-beta.1

### Minor Changes

- 143072a: Default styles refresh across all components
- 0a107f7: Adds Dropin unmount method
- 010861f: Added discounts for payables
- ca42346: Added ability to hide customer type section when creating a counterpart, default is set to ['customer', 'vendor'] through componentSettings and also added a new property called customerTypes to Receivables, Payables and Counterparts components to customize the available customer type options when creating a counterpart

### Patch Changes

- 92425e1: Fix payment term discounts translations
- d068bbf: Added onboarding and sent invoice email events to the SDK and Drop-in component

## 2.0.0-alpha.18

### Minor Changes

- 3583a16: Bump Drop-in

## 2.0.0-alpha.17

### Minor Changes

- 60a0972: New Dropin syntax

## 2.0.0-alpha.16

### Minor Changes

- bee7fab: Change Dropin exports

### Patch Changes

- 923df35: Fix counterpart creation form styles

## 2.0.0-alpha.15

### Minor Changes

- c5d39e5: Line item units management added

### Patch Changes

- 6a68134: Prepend https in empty Onboarding URL field
- 4a9f5e5: Event handlers for drop in component (Receivables)

## 2.0.0-alpha.14

### Minor Changes

- 4fed228: Bump dropin to latest version

## 2.0.0-alpha.13

### Patch Changes

- 23c29de: Update Kanmon live URL
- 25e34f4: Improve aspect ratio in Invoice preview

## 2.0.0-alpha.12

### Patch Changes

- 2f0f481: Fix invoice preview styles

## 2.0.0-alpha.11

### Patch Changes

- 3f6cd29: Load styles on invoice preview properly

## 2.0.0-alpha.10

### Minor Changes

- 575e2a6: Fix Kanmon SDK env URL
- 9462a2f: Invoice creation redesign

## 2.0.0-alpha.9

### Patch Changes

- cb63d74: onCreate receivable event added

## 2.0.0-alpha.8

### Patch Changes

- a8b6f84: Re-create translation files
- 18df891: Improve error messages in Products&Services component

## 2.0.0-alpha.7

### Major Changes

- 646c7ac: Bump Drop-in (v4)

## 1.8.0-alpha.6

### Minor Changes

- 2c645e2: Fixed style issues

## 1.8.0-alpha.5

### Minor Changes

- 5dddf03: New pre-release v4

## 1.8.0-alpha.4

### Patch Changes

- 368fe8e: UI minor fixes in invoice creation

## 1.8.0-alpha.3

### Minor Changes

- 00808d4: update sdk dependency

## 1.8.0-alpha.2

### Patch Changes

- 1a0042c: Fix styling issues in Receivables table

## 1.8.0-alpha.1

### Minor Changes

- 331d6d4: feat(proposal): add component settings

## 1.8.0-alpha.0

### Minor Changes

- fda8dd2: refactor(DEV-12144) remove sdk-api package

## 1.9.0

### Minor Changes

- 9976bc8: Divide merged columns on Payables and Receivables components

### Patch Changes

- @monite/sdk-api@3.22.0

## 1.8.1

### Patch Changes

- @monite/sdk-api@3.21.0

## 1.8.0

### Minor Changes

- 10974e1: Bump packages for release

### Patch Changes

- @monite/sdk-api@3.20.0

## 1.7.3

### Patch Changes

- @monite/sdk-api@3.19.1

## 1.7.2

### Patch Changes

- @monite/sdk-api@3.19.0

## 1.7.1

### Patch Changes

- @monite/sdk-api@3.18.0

## 1.7.0

### Minor Changes

- 61e288f6: update lingui swc plugin and nextjs versions
- c2874803: update swc plugins and libs to the compatible versions

### Patch Changes

- Updated dependencies [c2874803]
  - @monite/sdk-api@3.17.0

## 1.7.0-beta.1

### Minor Changes

- 61e288f6: update lingui swc plugin and nextjs versions
- c2874803: update swc plugins and libs to the compatible versions

### Patch Changes

- Updated dependencies [c2874803]
  - @monite/sdk-api@3.17.0-beta.1

## 1.6.1-beta.0

### Patch Changes

- @monite/sdk-api@3.17.0-beta.0

## 1.6.0

### Minor Changes

- ab0a1842: feat(DEV-11689): migrated API from version `2023-09-01` to `2024-01-31`
- 1f30c113: feat(DEV-12074): migrate MUI Data-Grid to v7

### Patch Changes

- 369ba2c9: feat(DEV-11417): add Recurring Invoice support
- 47e6e95e: encapsulate entity check logic
- 47e6e95e: chore(DEV-11611): update iframe docs
- 55ce4cdb: fix(onboarding): fix mobile DatePicker for web component
- Updated dependencies [47e6e95e]
  - @monite/sdk-api@3.16.0

## 1.6.0-beta.5

### Patch Changes

- 43a2d4e6: encapsulate entity check logic
- Updated dependencies [43a2d4e6]
  - @monite/sdk-api@3.16.0-beta.5

## 1.6.0-beta.4

### Patch Changes

- @monite/sdk-api@3.16.0-beta.4

## 1.6.0-beta.3

### Patch Changes

- @monite/sdk-api@3.16.0-beta.3

## 1.6.0-beta.2

### Minor Changes

- 1f30c113: feat(DEV-12074): migrate MUI Data-Grid to v7

### Patch Changes

- 369ba2c9: add Recurrence Invoice support
  - @monite/sdk-api@3.16.0-beta.2

## 1.6.0-beta.1

### Patch Changes

- @monite/sdk-api@3.16.0-beta.1

## 1.6.0-beta.0

### Minor Changes

- ab0a1842: feat(DEV-11689): migrated API from version `2023-09-01` to `2024-01-31`

### Patch Changes

- 55ce4cdb: fix(onboarding): fix mobile DatePicker for web component
  - @monite/sdk-api@3.16.0-beta.0

## 1.5.0

### Minor Changes

- 7aeecda1: feat(DEV-11277): Implement the Monite Iframe Application
- a9dd6747: feat(DEV-11277): add DropIn `disabled` property support

  This allows deferred setting of attributes like `component` or `api-url` if they are not known at the time of initial page rendering.

### Patch Changes

- @monite/sdk-api@3.15.0

## 1.4.8

### Patch Changes

- @monite/sdk-api@3.14.1

## 1.4.7

### Patch Changes

- Updated dependencies [7c9cbf3e]
- Updated dependencies [6c20fcd3]
  - @monite/sdk-api@3.14.0

## 1.4.6

### Patch Changes

- Updated dependencies [9711e3e2]
- Updated dependencies [1fb0d928]
  - @monite/sdk-api@3.13.0

## 1.4.5

### Patch Changes

- aa1eb622: Add `delegatesFocus` for simple and effective focus management.
  - @monite/sdk-api@3.12.0

## 1.4.4

### Patch Changes

- @monite/sdk-api@3.11.0

## 1.4.3

### Patch Changes

- @monite/sdk-api@3.10.0

## 1.4.2

### Patch Changes

- Updated dependencies [d8816902]
  - @monite/sdk-api@3.9.0

## 1.4.1

### Patch Changes

- Updated dependencies [f00c951]
  - @monite/sdk-api@3.8.0

## 1.4.0

### Minor Changes

- 2a1d016e: feat(DEV-3954): Add Sentry to UI Widgets

### Patch Changes

- 80219cdd: chore(DEV-9786): Update dependencies up to secure version
- Updated dependencies [80219cdd]
- Updated dependencies [2a1d016e]
- Updated dependencies [5f4ba6f3]
- Updated dependencies [561301b1]
- Updated dependencies [a9007acc]
- Updated dependencies [782f67a]
  - @monite/sdk-api@3.7.0

## 1.3.4

### Patch Changes

- 8279a2cd: Integrate Onboarding into DropIn
- Updated dependencies [af3be9f7]
- Updated dependencies [604e4dbf]
- Updated dependencies [a70860ee]
- Updated dependencies [1a5389bd]
  - @monite/sdk-api@3.6.0

## 1.3.4-beta.0

### Patch Changes

- 8279a2cd: Integrate Onboarding into DropIn
- Updated dependencies [af3be9f7]
- Updated dependencies [604e4dbf]
- Updated dependencies [a70860ee]
- Updated dependencies [1a5389b]
  - @monite/sdk-api@3.6.0-beta.0

## 1.3.3

### Patch Changes

- 133378e4: Update Vite up to v5.0.11
- Updated dependencies [14476397]
- Updated dependencies [6dab8cc1]
- Updated dependencies [ee964e3e]
- Updated dependencies [0589d9d2]
- Updated dependencies [2e83d980]
- Updated dependencies [7e0f9a94]
  - @monite/sdk-api@3.5.0

## 1.3.3-beta.2

### Patch Changes

- @monite/sdk-api@3.5.0-beta.2

## 1.3.3-beta.1

### Patch Changes

- 133378e4: Update Vite up to v5.0.11
- Updated dependencies [14476397]
- Updated dependencies [ee964e3e]
- Updated dependencies [0589d9d2]
- Updated dependencies [7e0f9a94]
  - @monite/sdk-api@3.5.0-beta.1

## 1.3.1-beta.0

### Patch Changes

- Updated dependencies [6dab8cc1]
- Updated dependencies [2e83d980]
  - @monite/sdk-api@3.5.0-beta.0

## 1.3.0

## 1.2.1

### Patch Changes

- Updated dependencies [adb18e07]
  - @monite/sdk-api@3.4.0

## 1.2.1-beta.3

### Patch Changes

- Updated dependencies [adb18e07]
  - @monite/sdk-api@3.4.0-beta.4

## 1.2.1-beta.2

### Patch Changes

- @monite/sdk-api@3.4.0-beta.3

## 1.2.1-beta.1

### Patch Changes

- @monite/sdk-api@3.4.0-beta.2

## 1.2.1-beta.0

### Patch Changes

- @monite/sdk-api@3.4.0-beta.1
