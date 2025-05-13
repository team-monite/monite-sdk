# @monite/sdk-react

## 4.1.0

### Minor Changes

- 9ec6df7: Add component setting to make some Payables Table columns non-hideable.

### Patch Changes

- 6c99ae4: Properly format Tag Categories labels
- b327291: Coutry selector component refactored and updated
- 711d4c5: Automatically select the Counterpat default bank account when selecting a Counterpart on the Payable details form.
- 1727547: Fix bug of Payable form submission on saving of the Payable Vendor form.
- 350ac2e: Fixed some minor bugs with bank account behavior
- 3dc98e1: Monite currency selector has added group functionality and fixed filtering logic

## 4.0.2

### Patch Changes

- f83fbf8: Fix Payable Counterpart Bank Account selection to show Bank Account name
- 1fdc678: Fixed invoice preview not showing bank account information and some other minor fixes to bank account creation
- d178c9a: Improve Payable form Counterpart partial match warnings and form selection. Added option to edit selected Counterpart on the form.
- d62d343: Business website field renamed to URL, alert info updated to reflect the change

## 4.0.1

### Patch Changes

- eab13cf: Added onboarding currency and country options
- 560bd48: Added some minor adjustments to finance banner

## 4.0.0

### Major Changes

- 166b0d8: refactor(DEV-12144) remove sdk-api package
- 8d0ea89: feat(DEV-12955): add new styling approach for the SDK
- 1cb86af: refactor(DEV-12028): remove deprecated methods for payable details
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

- 377e6ad: feat(DEV-13343): move date time format to locale

### Minor Changes

- d9aa339: Updated copies on Products & Services page.
- 849f2f0: Edit tags in payables documents regardless of their status
- 143072a: Default styles refresh across all components
- c5d39e5: Line item units management added
- 08fa299: improvements requested after invoice preview merge
- ad63579: feat(DEV-13434): new styles for display components and form controls
- 876aaa8: New line items
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

- b3fc060: bugfix invoice previeww: tax rate showing always as zero, sometimes divided by 100 unnecessarily
- e04a0ba: Improve User Roles management view by simplifying permissions shown and splitting the dialog to edit the User Role into a full-screen dialog
- 5dddf03: New pre-release v4
- 575e2a6: Fix Kanmon SDK env URL
- 25d5f60: feat(DEV-13687) Argon changes during invoice creation
- 2c645e2: Fixed style issues
- a0cec41: feat(DEV-13430): add new styles to search and filters
- 010861f: Added discounts for payables
- 548efe1: Payment flow improvements on Accounts payable
- 77d926e: Added keywords and category to tags table
- 2c39324: feat(DEV-13429): add spacing token and update storybook utils to handle theme config
- 94f9497: Adds option to delete canceled payables
- ca42346: Added ability to hide customer type section when creating a counterpart, default is set to ['customer', 'vendor'] through componentSettings and also added a new property called customerTypes to Receivables, Payables and Counterparts components to customize the available customer type options when creating a counterpart
- fdb71ad: Added DocumentDesign component
- 86b7490: fix(DEV-13777): invoice preview

### Patch Changes

- 1ff6286: The payment terms discount units are converted to minor for API-related operations
- 7b75dbf: Add Document templates to Dropin
- 8ccf36d: Improve onboarding styles and copies
- 6a68134: Prepend https in empty Onboarding URL field
- 2604834: Display VAT id error message from API
- dab2d74: Fix Payables table payable.amount_paid
- f97dbe3: Added a tooltip for the website input field
- eb1d764: Payables table: prevent row click (and disable hover effect) for rows of payables with OCR status in processing
- 2fe7793: Style improvements in Onboarding component
- f1b62b9: Filter forbidden fields in update person payloads
- 23c29de: Update Kanmon live URL
- cb63d74: onCreate receivable event added
- 92425e1: Fix payment term discounts translations
- 2c0fd42: Onboarding footer customization: added `onboarding.footerLogoUrl` and `onboarding.footerWebsiteUrl` to `componentSettings` for direct configuration.
- 2e43f1d: Updated API schema and update supported currencies
- b50d841: Product creation default values
- fe95cbd: Line items bug fixes and refactoring
- 923df35: Fix counterpart creation form styles
- d068bbf: Added onboarding and sent invoice email events to the SDK and Drop-in component
- 069ec35: Ordered customers filter dropdown in Receivables alphabetically
- 705bb89: Improve Payables file upload by handling error messages for file size limits. Fix duplicated error messages on file upload errors
- a8b6f84: Re-create translation files
- 40cac95: Send invoice button changes its caption based on the invoice status
- 802f5c4: Custom currency dropdown renderer
- 2f0f481: Fix invoice preview styles
- 368fe8e: UI minor fixes in invoice creation
- d69ab5a: Issues with formatting vat values, autocomplete item names etc fixed
- 6ead5f4: Fix issue with Kanmon provider
- 64d39a2: Issue and send fixed on the preview page
- 1a0042c: Fix styling issues in Receivables table
- 18df891: Improve error messages in Products&Services component
- b0494f7: Update table styles
- 3f6cd29: Load styles on invoice preview properly
- 4140560: Removed Go to docs from user-roles modal
- dfebd5c: Payment terms update validation fixed, dialog close focus hook
- a63196a: Added user role delete functionality
- e70b0de: First invoice sent event renamed to invoice sent
- c3966ff: SSN title changed to Full Social Security Number
- 4a9f5e5: Event handlers for drop in component (Receivables)
- 25e34f4: Improve aspect ratio in Invoice preview
- 0539718: Add onContinue/onComplete events in onboarding component
- 7a518b8: PDF download button is disabled until the url is defined
- ef4d3b1: Fix issue when adding bank accounts through the onboarding flow
- 665c8e6: When sending an invoice, we use the organization's email address as a fallback if there is no contact person defined.
- 34cd50b: Onboarding minor fixes

## 4.0.0-beta.7

### Patch Changes

- 34cd50b: Onboarding minor fixes

## 4.0.0-beta.6

### Patch Changes

- 8ccf36d: Improve onboarding styles and copies
- eb1d764: Payables table: prevent row click (and disable hover effect) for rows of payables with OCR status in processing
- ef4d3b1: Fix issue when adding bank accounts through the onboarding flow

## 4.0.0-beta.5

### Patch Changes

- 0539718: Add onContinue/onComplete events in onboarding component

## 4.0.0-beta.4

### Patch Changes

- 6ead5f4: Fix issue with Kanmon provider

## 4.0.0-beta.3

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

- f97dbe3: Added a tooltip for the website input field
- 2fe7793: Style improvements in Onboarding component
- 2c0fd42: Onboarding footer customization: added `onboarding.footerLogoUrl` and `onboarding.footerWebsiteUrl` to `componentSettings` for direct configuration.
- 069ec35: Ordered customers filter dropdown in Receivables alphabetically
- a63196a: Added user role delete functionality
- e70b0de: First invoice sent event renamed to invoice sent
- c3966ff: SSN title changed to Full Social Security Number

## 4.0.0-beta.2

### Patch Changes

- 7b75dbf: Add Document templates to Dropin
- dab2d74: Fix Payables table payable.amount_paid
- dfebd5c: Payment terms update validation fixed, dialog close focus hook

## 4.0.0-beta.1

### Minor Changes

- 849f2f0: Edit tags in payables documents regardless of their status
- 143072a: Default styles refresh across all components
- 876aaa8: New line items
- e04a0ba: Improve User Roles management view by simplifying permissions shown and splitting the dialog to edit the User Role into a full-screen dialog
- 010861f: Added discounts for payables
- ca42346: Added ability to hide customer type section when creating a counterpart, default is set to ['customer', 'vendor'] through componentSettings and also added a new property called customerTypes to Receivables, Payables and Counterparts components to customize the available customer type options when creating a counterpart

### Patch Changes

- 92425e1: Fix payment term discounts translations
- 2e43f1d: Updated API schema and update supported currencies
- fe95cbd: Line items bug fixes and refactoring
- d068bbf: Added onboarding and sent invoice email events to the SDK and Drop-in component
- 40cac95: Send invoice button changes its caption based on the invoice status
- d69ab5a: Issues with formatting vat values, autocomplete item names etc fixed
- 64d39a2: Issue and send fixed on the preview page

## 4.0.0-alpha.19

### Patch Changes

- f1b62b9: Filter forbidden fields in update person payloads

## 4.0.0-alpha.18

### Patch Changes

- 665c8e6: When sending an invoice, we use the organization's email address as a fallback if there is no contact person defined.

## 4.0.0-alpha.17

### Patch Changes

- 2604834: Display VAT id error message from API
- 923df35: Fix counterpart creation form styles
- 7a518b8: PDF download button is disabled until the url is defined

## 4.0.0-alpha.16

### Minor Changes

- c5d39e5: Line item units management added

### Patch Changes

- 6a68134: Prepend https in empty Onboarding URL field
- b50d841: Product creation default values
- 802f5c4: Custom currency dropdown renderer
- 4a9f5e5: Event handlers for drop in component (Receivables)

## 4.0.0-alpha.15

### Minor Changes

- b3fc060: bugfix invoice previeww: tax rate showing always as zero, sometimes divided by 100 unnecessarily

## 4.0.0-alpha.14

### Minor Changes

- 77d926e: Added keywords and category to tags table

### Patch Changes

- 23c29de: Update Kanmon live URL
- 25e34f4: Improve aspect ratio in Invoice preview

## 4.0.0-alpha.13

### Patch Changes

- 2f0f481: Fix invoice preview styles

## 4.0.0-alpha.12

### Patch Changes

- 3f6cd29: Load styles on invoice preview properly

## 4.0.0-alpha.11

### Minor Changes

- 575e2a6: Fix Kanmon SDK env URL

## 4.0.0-alpha.10

### Minor Changes

- 08fa299: improvements requested after invoice preview merge
- 86b7490: fix(DEV-13777): invoice preview

## 4.0.0-alpha.9

### Patch Changes

- cb63d74: onCreate receivable event added

## 4.0.0-alpha.8

### Minor Changes

- d9aa339: Updated copies on Products & Services page.
- 94f9497: Adds option to delete canceled payables
- fdb71ad: Added DocumentDesign component

### Patch Changes

- a8b6f84: Re-create translation files
- 18df891: Improve error messages in Products&Services component
- 4140560: Removed Go to docs from user-roles modal

## 4.0.0-alpha.7

### Minor Changes

- 548efe1: Payment flow improvements on Accounts payable

## 4.0.0-alpha.6

### Minor Changes

- 2c645e2: Fixed style issues

## 4.0.0-alpha.5

### Minor Changes

- d452d77: feat(DEV-12235): Payment terms create/update/delete
- 5dddf03: New pre-release v4

## 4.0.0-alpha.4

### Patch Changes

- 368fe8e: UI minor fixes in invoice creation

## 4.0.0-alpha.3

### Minor Changes

- 25d5f60: feat(DEV-13687) Argon changes during invoice creation

## 4.0.0-alpha.2

### Patch Changes

- 1a0042c: Fix styling issues in Receivables table

## 4.0.0-alpha.1

### Minor Changes

- e942b9c: feat(DEV-13306): add financing tab
- ad63579: feat(DEV-13434): new styles for display components and form controls
- f57ac16: feat(DEV-13301): finance an invoice
- b787793: feat(DEV-13389): Default bank account is selected during counterpart and currency selection
- 5828ac1: feat(DEV-13304): implement finance banner
- 3a53ec0: feat(DEV-13398): expose finance components
- 66e853a: feat(DEV-13399): add integrations page and finance application card
- 069181e: feat(DEV-13346): show confirmation modal for bill cancelation
- a0cec41: feat(DEV-13430): add new styles to search and filters
- 66e853a: feat(DEV-13399): add integrations page and finance application card
- 2c39324: feat(DEV-13429): add spacing token and update storybook utils to handle theme config

### Patch Changes

- 88691dd: feat(DEV-13428): add wrapper for finance faq
- b0494f7: Update table styles

## 4.0.0-alpha.0

### Major Changes

- fda8dd2: refactor(DEV-12144) remove sdk-api package
- e2ae09a: feat(DEV-12955): add new styling approach for the SDK
- eb51f82: refactor(DEV-12028): remove deprecated methods for payable details
- 14a706d: feat(DEV-13343): move date time format to locale

## 3.22.0

### Minor Changes

- 9976bc8: Divide merged columns on Payables and Receivables components

### Patch Changes

- @monite/sdk-api@3.22.0

## 3.21.0

### Minor Changes

- 3174ba4: Accounts Payable payment flow improvements

### Patch Changes

- @monite/sdk-api@3.21.0

## 3.20.0

### Minor Changes

- e942b9c: feat(DEV-13306): add financing tab
- d452d77: feat(DEV-12235): Payment terms create/update/delete
- f57ac16: feat(DEV-13301): finance an invoice
- b787793: feat(DEV-13389): Default bank account is selected during counterpart and currency selection
- 5828ac1: feat(DEV-13304): implement finance banner
- 3a53ec0: feat(DEV-13398): expose finance components
- 66e853a: feat(DEV-13399): add integrations page and finance application card
- 069181e: feat(DEV-13346): show confirmation modal for bill cancelation
- 10974e1: Bump packages for release
- 66e853a: feat(DEV-13399): add integrations page and finance application card

### Patch Changes

- 88691dd: feat(DEV-13428): add wrapper for finance faq
  - @monite/sdk-api@3.20.0

## 3.19.1

### Patch Changes

- 1b4331b: fix(DEV-13498): fix vat validation based on current receivable_edit_flow
- 5c63146: fix(proposal): fix the pay button logic
  - @monite/sdk-api@3.19.1

## 3.19.0

### Minor Changes

- 65d692b2: Design improved in BillPay (payables) component
- 95ff47cc: fix(proposal): update default values for payables and receivables tables to align with the sep5 demo
- 3abc9641: fix(proposal): apply sep5 demo styles & features to the Payables Table component
- 0c65061e: feat(DEV-13257): add min height to all table components
- 7a7a149d: fix(proposal): add default and min width to added by column
- d71589f2: feat(proposal): temp paid marked on iframe close & update handle counterpart recipient for payment flow
- f0023941: chore(proposal): improve payment link generation based on payable
- ae5bf3cf: feat: add payment flow to payable details header component
- 859964e7: feat(proposal): merge number and status columns for the Receivables Table component
- a168d61f: fix(DEV-13228): Allow payments on partially_paid payables
- 01e9e402: chore: update api version by last schema from our current open api spec and added new query param for autocomplete search field component

### Patch Changes

- 6733e680: Added label to Bank account field in Bill Pay component
- 4956ae2b: refactor(DEV-12983): remove purchase order field and update design alignment of invoice fields
- 66682a7c: feat: add bank account holder name for counterpart creation
- 58559a0c: fix(proposal): remove margin bottom for the filter components it tables
- 076c81a2: feat(DEV-12983): invoice creation and update redesign
- c8e99f5e: feat: billing form items until customer is selected
- f6538fe7: Prevent click event on table rows when selecting text
- 84950a4e: feat(proposal): update line items validation and check for bill information
- c0182f2b: fix(proposal): set default color for texts in datagrid
- cb2e795b: fix incorrect tax value in generated invoice
  - @monite/sdk-api@3.19.0

## 3.18.0

### Minor Changes

- cb1a0cc6: introduce Custom Tabs for `<ReceivablesTable/>`

  ### Description

  Implemented the ability to configure custom tabs for Receivables using MUI. Users can now select the specific tabs they
  need, while backward compatibility is maintained. By default, the standard tabs Invoices, Quotes, and Credit Notes are
  displayed.

  ### Breaking Changes

  The `<ReceivablesTable/>` component interface has changed. Instead of using `ReceivablesTableTabEnum` for the active
  tab, you now need to pass a `number` representing the tab index. Additionally, the default tab indices have been
  updated:

  - **Invoices**: 0 (previously 1)
  - **Quotes**: 1 (previously 0)
  - **Credit Notes**: 2 (unchanged)

  Please update any existing integrations to reflect these changes.

- 315cde5a: feat: introduce icon wrapper component for all close icons to be cusotmisable from theme props
- 7232f7de: feat: add integration of payment flow with iframe modal

### Patch Changes

- e288b141: feat(DEV-13151): expand tax value check for non-vat supported countries
- 6233bff3: hide email section for upload bill dropdown
  - @monite/sdk-api@3.18.0

## 3.17.0

### Minor Changes

- 8a3195dd: feat(DEV-12896): apply validation form API to the payable form
- 14106eed: feat(DEV-12440): AP cards statuses
- f39c1a25: feat(DEV-12623): manual payment record implementation
- c2874803: update swc plugins and libs to the compatible versions
- 62f54a82: feat: allow multiple files upload and drag
- 1845626f: chore: combined both tables user roles and approvals & added extra fields and filters for approval policies

### Patch Changes

- 7a7b7d83: feat: allow multiple files upload on dragging
- 1d2880a3: feat: extra validation for approval policy
- 46dad74d: fix(DEV-12623): add more checks to manual payment records
- 5370ff8a: chore(proposal): better typings system for monite.ts themesation file
- 4f504a6d: fix: validation fixes for approval policies creation
- e7ea8955: add reopened state to payables details form after rejected
- Updated dependencies [c2874803]
  - @monite/sdk-api@3.17.0

## 3.17.0-beta.1

### Minor Changes

- 8a3195dd: feat(DEV-12896): apply validation form API to the payable form
- c2874803: update swc plugins and libs to the compatible versions
- 1845626f: chore: combined both tables user roles and approvals & added extra fields and filters for approval policies

### Patch Changes

- 1d2880a3: feat: extra validation for approval policy
- Updated dependencies [c2874803]
  - @monite/sdk-api@3.17.0-beta.1

## 3.17.0-beta.0

### Minor Changes

- 14106eed: feat(DEV-12440): AP cards statuses

### Patch Changes

- 5370ff8a: chore(proposal): better typings system for monite.ts themesation file
- e7ea8955: add reopened state to payables details form after rejected
  - @monite/sdk-api@3.17.0-beta.0

## 3.16.0

### Minor Changes

- 004b1dab: feat(DEV-11865): add payment reminders selection for invoice
- 04524bf6: feat(DEV-12368): Implement toggle to turn reminders on/off on counterpart level
- 504f60af: fix(DEV-12158): fix tables styles and improve height calculations
- dc11374d: feat(DEV-12084): make default option for counterparts contacts
- d0fd99c0: feat(DEV-12191): improve `DataGrid` auto-sizing algorithm to reduce layout jumps and preserve column widths
  between page reloads
- 47e6e95e: feat(DEV-12417): cover no data grid logic for receivalbes and tags
- 01e91e0d: feat(DEV-12181): configure custom fields that need to be mandatory after OCR for user to check
- 8964658c: feat(DEV-11928): introduced icon states to indicate the status of Counterparts for Payables processed via OCR.

  - **State 1**: Counterpart not found in the system.
  - **State 2**: Counterpart found but not selected in the document.
  - Note: If a Counterpart is already selected for the Payable, no icon will be displayed.

- c8450cc8: feat(DEV-12180): mark overdue date for payables
- 47e6e95e: feat: display warning when ocr data mismatch
- c36b9802: fix(DEV-12101): [SDK] [AP] OCR is not showing the correct Total, Tax field
- 47e6e95e: feat: Summary cards added for payables with theme customisation
- 47e6e95e: feat(DEV-12699): disable summary cards via theme customisation
- 47e6e95e: feat(DEV-12284): add Approval Policies builder component
- 037e81f7: feat(DEV-12296): fix DataGrid borders broken during PR approve
- dff7a844: feat(DEV-11981): **Invoice Creation and Editing**: Introduced the ability to specify Payment and
  Overdue reminders during the creation and editing of invoices.
- 18483022: feat(11876): Added a dialog for creating and editing both payment and overdue invoice reminders.
- 47e6e95e: Add country and city name next to counterpart name in tables.
- 47e6e95e: feat(DEV-12285): implement memo field for creating and updating invoice
- 47e6e95e: Open newly created invoice for preview immediately after creation.
- 47f48538: feat(DEV-11857): cancel invoice
- 47e6e95e: Add coloured avatars for counterparts in tables, improve look of Counterparts table.
- 09960120: refactor(DEV-12059): make label for reminders more clear, add warning for overdue reminders
- 47e6e95e: feat: Move order of columns - extend config to pass order
- 47e6e95e: Fix table filters layout, fix 'Status' filter font size
- 47e6e95e: feat(DEV-12179): custom Tabs for Payables
- 8d3fd461: feat(DEV-11928): implemented automatic selection of Counterparts for Payables processed via OCR in the editing form.

  - If a Counterpart is not selected for a Payable after file upload and OCR processing, it will be auto-selected if available.

- 47e6e95e: Table empty state (filters applied, not content to display)
- 4a69935d: feat(DEV-12283): payable upload file support pdf | png | jpeg | tiff
- 47e6e95e: Add the capability to change invoice recipient and preview invoice email before sending.
- 1f30c113: feat(DEV-12074): migrate MUI Data-Grid to v7
- 47e6e95e: feat(DEV-12655): overdue ap flag new design
- 70ffd3bb: Change date format from '08/20/2024' to US format 'Aug 21, 2024'
- 47e6e95e: chore(upgrade): api version upgrade to 2024-05-25
- 603a4659: feat(DEV-12154): align sorting in all table components with available API sort options

### Patch Changes

- 369ba2c9: feat(DEV-11417): add Recurring Invoice support
- 47e6e95e: feat(DEV-12410): ability for partners to remove tags
- c962003e: chore(DEV-11417): unify custom status chip interfaces

  Removed forced small size for status chips, allowing backward compatibility.

- eb4a7fe8: fix(DEV-12146): fix generated fields for <Onboarding />
- 47e6e95e: feat(DEV-12177): extended wildcard search for payables
- 47e6e95e: encapsulate entity check logic
- 47e6e95e: add support for body_text and subject_text when creating or updating recurring invoices
- 47e6e95e: feat(DEV-12590): improvements to email invoice functionality
- 8302fb12: fix chips by forwarding custom prop status
- 55ce4cdb: fix(onboarding): fix mobile DatePicker for web component
- 3519c12f: feat(DEV-11417): display recurring icon in the Invoices Table
- 878fa936: fix(DEV-11734): updated `CounterpartsTable` component to show the full name of individuals.
- Updated dependencies [47e6e95e]
  - @monite/sdk-api@3.16.0

## 3.16.0-beta.5

### Minor Changes

- b7c796bd: feat: display warning when ocr data mismatch
- 59ff0c92: feat: Summary cards added for payables with theme customisation
- 202101f0: feat(DEV-12699): disable summary cards via theme customisation
- 74d288f7: feat(DEV-12285): implement memo field for creating and updating invoice
- 932c4ce2: Open newly created invoice for preview immediately after creation.
- 0f7e21a5: feat: Move order of columns - extend config to pass order
- 84ee5502: feat(DEV-12179): custom Tabs for Payables
- a551b255: feat(DEV-12655): overdue ap flag new design
- 09b7a670: chore(upgrade): api version upgrade to 2024-05-25

### Patch Changes

- a71c3111: feat(DEV-12410): ability for partners to remove tags
- b155c2f3: feat(DEV-12177): extended wildcard search for payables
- 43a2d4e6: encapsulate entity check logic
- 292f0ebf: add support for body_text and subject_text when creating or updating recurring invoices
- 39b55464: feat(DEV-12590): improvements to email invoice functionality
- Updated dependencies [43a2d4e6]
  - @monite/sdk-api@3.16.0-beta.5

## 3.16.0-beta.4

### Minor Changes

- 017c0c20: feat(DEV-12417): cover no data grid logic for receivalbes and tags
- e9eeb68f: feat(DEV-12284): add Approval Policies builder component
- 0a37dc68: Add country and city name next to counterpart name in tables.
- 6c3faf43: Add coloured avatars for counterparts in tables, improve look of Counterparts table.
- 14106eed: feat(DEV-12440): AP cards statuses
- cddff2af: Fix table filters layout, fix 'Status' filter font size
- 6523f5b9: Table empty state (filters applied, not content to display)
- 5d4c1274: Add the capability to change invoice recipient and preview invoice email before sending.

### Patch Changes

- @monite/sdk-api@3.16.0-beta.4

## 3.16.0-beta.3

### Minor Changes

- 04524bf6: feat(DEV-12368): Implement toggle to turn reminders on/off on counterpart level
- 01e91e0d: feat(DEV-12181): configure custom fields that need to be mandatory after OCR for user to check
- c8450cc8: feat(DEV-12180): mark overdue date for payables
- 70ffd3bb: Change date format from '08/20/2024' to US format 'Aug 21, 2024'

### Patch Changes

- c962003e: chore(DEV-11417): unify custom status chip interfaces

  Removed forced small size for status chips, allowing backward compatibility.

- 8302fb12: fix chips by forwarding custom prop status
- 3519c12f: feat(DEV-11417): display recurring icon in the Invoices Table
  - @monite/sdk-api@3.16.0-beta.3

## 3.16.0-beta.2

### Minor Changes

- 504f60af: fix(DEV-12158): fix tables styles and improve height calculations
- dc11374d: feat(DEV-12084): make default option for counterparts contacts
- d0fd99c0: 1. Improves DataGrid autosizing algorithm (reduces amount of layout jumps), 2. Preserves column widths between page reloads
- 037e81f7: feat(DEV-12296): fix DataGrid borders broken during PR approve
- 47f48538: feat(DEV-11857): cancel invoice
- 09960120: refactor(DEV-12059): make label for reminders more clear, add warning for overdue reminders
- 4a69935d: feat(DEV-12283): payable upload file support pdf | png | jpeg | tiff
- 1f30c113: feat(DEV-12074): migrate MUI Data-Grid to v7
- 603a4659: feat(DEV-12154): align sorting in all table components with available API sort options

### Patch Changes

- 369ba2c9: add Recurrence Invoice support
  - @monite/sdk-api@3.16.0-beta.2

## 3.16.0-beta.1

### Minor Changes

- c36b9802: fix(DEV-12101): [SDK] [AP] OCR is not showing the correct Total, Tax field

### Patch Changes

- eb4a7fe8: fix(DEV-12146): fix generated fields for <Onboarding />
  - @monite/sdk-api@3.16.0-beta.1

## 3.16.0-beta.0

### Minor Changes

- a975061b: feat(DEV-11865): add payment reminders selection for invoice
- 8964658c: feat(DEV-11928): introduced icon states to indicate the status of Counterparts for Payables processed via OCR.

  - **State 1**: Counterpart not found in the system.
  - **State 2**: Counterpart found but not selected in the document.
  - Note: If a Counterpart is already selected for the Payable, no icon will be displayed.

- 89d1fac7: feat(DEV-11981): **Invoice Creation and Editing**: Introduced the ability to specify PaymentReminders and
  OverviewReminders during the creation and editing of invoices.
- d6e715a0: feat(11876): Added a dialog for creating and editing both payment and overdue invoice reminders.
- 8d3fd461: feat(DEV-11928): implemented automatic selection of Counterparts for Payables processed via OCR in the editing form.

  - If a Counterpart is not selected for a Payable after file upload and OCR processing, it will be auto-selected if available.

### Patch Changes

- 55ce4cdb: fix(onboarding): fix mobile DatePicker for web component
- 878fa936: fix(DEV-11734): updated `CounterpartsTable` component to show the full name of individuals.
  - @monite/sdk-api@3.16.0-beta.0

## 3.15.0

### Minor Changes

- 34baadde: feat(DEV-8980): display OCR error message in PayableDetails
- d8dc9a26: feat(DEV-11087): add ApprovalRequestsTable component

### Patch Changes

- f207a10e: fix: remove unnecessary `submitInvoice` in "Save" invoice action
  - @monite/sdk-api@3.15.0

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
