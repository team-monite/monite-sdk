This file contains a list of changes, new features, and fixes in each release of Monite SDK.

## @monite/sdk-react@3.13.0 & @monite/sdk-api@3.13.0
This package is a minor release with no breaking changes.

### New features and improvements
- Added by counterpart name and status to the `ReceivablesTable` component.
- Improved error handling when previewing invoices on the `InvoiceDetails` component.
- Improved overall layout, security, and performance of the React SDK.
- Improved sorting on the `ReceivablesTable` component.
- Added a "**Due date**" column to the `InvoiceTable` component.

### Bug fixes
- Fix layouts of PDF toolbars that caused scroll issues on PDFs.
- Fixed export issues on the `ReceivablesTable` component of the SDK.

## @monite/sdk-react@3.12.0 & @monite/sdk-api@3.12.0
This package is a minor release with no breaking changes.

### New features and improvements
- Added the `InvoiceStatusChip` and `PayableStatusChip` components to show the status of invoices and payables.
- Introduced the `TablePagination` to handle customization and pagination on all table components.
- Added the ability to edit an invoice on the `InvoiceDetails` component.
- Introduced the `currencyNumberFormat` field on the locale prop that handles currency display on the SDK.
- Improved context management and usability of the `MoniteProvider` wrapper.
- Several internal changes to improve the overall theming, internationalization, and localization experience with the SDK.

## @monite/sdk-react@3.11.0 & @monite/sdk-api@3.11.0
This package is a minor release with no breaking changes.

### New features and improvements
- Added the "Created on" column to the `ReceivablesTable` component.
- Addressed bottlenecks within the SDK to improve and optimize the overall performance.

### Bug fixes
- Fixed a bug that prevented invoices from being issued on the `InvoiceDetails` component.
- Fixed a bug that prevented editing the `ProductDetails` component with an empty "Description" field.

## @monite/sdk-react@3.10.0 & @monite/sdk-api@3.10.0
This package is a minor release with no breaking changes.

### New features and improvements
- Updated internal dependencies within the SDK for better functionality.

### Bug fixes
- Fixed an issue causing incorrect renderings of product lists on the `InvoiceDetails` component.
- Fixed a bug on the `Onboarding` component that caused incorrect loading of bank account details.

## @monite/sdk-react@3.9.0 & @monite/sdk-api@3.9.0
This package is a minor release with no breaking changes.

### New features and improvements
- Added the `UserRole` component, allowing you to view all your user roles, permissions, and other related details.
- Added the `UserRoleTable` component for viewing all user roles and permissions. 
- Added the ability to view user role permissions on the `UserRoleDetails` components.
## @monite/sdk-react@3.8.0 & @monite/sdk-api@3.8.0
This package is a minor release with no breaking changes.

## New features and improvements
- Added the ability to preview invoices on the `InvoiceDetails` component.
- Added the ability to issue and send an invoice to a counterpart via email using the `InvoiceDetails` component.

### Bug fixes
- Fixed a bug that prevented the display of the `Onboarding` component on screens with phone input.

## @monite/sdk-react@3.7.0 & @monite/sdk-api@3.7.0
This package is a minor release with no breaking changes.

### New features and improvements
- The `Onboarding` component has been released as beta. This fully embeddable component allows customers to complete payment onboarding without leaving your application. For more information, see [Onboarding component](https://docs.monite.com/docs/onboarding) and [Onboarding via Web Component](https://docs.monite.com/docs/onboarding-web-component).
- We added the ability to edit approval policies trigger and script within the `ApprovalPolicies` component.
- Addressed multiple security vulnerabilities in the React SDK and SDK API packages.

## @monite/sdk-react@3.6.0 & @monite/sdk-api@3.6.0
This package is a minor release with no breaking changes.

### New features and improvements
- Added input validation for phone numbers based on countries across all form components. 
- We improved error messages on form validation errors across form components.

### Bug fixes
- Fixed a styling issue that prevented popup menus from rendering correctly.
- Fixed a bug that prevented the creation of new counterparts via the SDK.

## @monite/sdk-react@3.5.0 & @monite/sdk-api@3.5.0
This package is a minor release with no breaking changes.

### New features and improvements
- All requests via the `MoniteSDK` instance now use Monite's `2023-09-01` API version. 
- Added the ability to create new counterparts while creating invoices via the `InvoiceDetails` component in creation mode.
- Added a field to view the approval policy associated with a payable on the `PayableDetails` component.
- Updated the `PayableDetails` component to show the amount of taxes to be paid.
- Added the ability to attach files to a payable with no existing file on the `PayableDetails` component.
- Added callbacks props to the `Payables` component and deprecated callbacks with inconsistent namings.
- Updated an internal dependency that handles internalization. This alteration may cause some challenges when testing the package. For more information, see [Configuring Jest for SDK](https://github.com/team-monite/monite-sdk/tree/main/packages/sdk-react#configuring-jest-for-sdk).
- Updated multiple dependencies to address possible high and moderate severity vulnerabilities in the SDK packages.
- Introduced independent scrolling between the different parts of the `PayableDetails` component.

### Bug fixes
- Fixed an issue that affected the display of falsy values on the `PayableDetails` component.
- Fixed an issue where fields on the Payables creation screen were not cleared on the `Payables` component.

## @monite/sdk-react@3.4.0 & @monite/sdk-api@3.4.0
This package is a minor release with no breaking changes.

### New features and improvements
- We added the ability to create invoices using the `type` prop on the `InvoiceDetails` component. For more information, see [InvoiceDetails](https://docs.monite.com/docs/invoicedetails#usage).
- Deprecated and removed the `ProductCreateForm`, `ProductEditForm`, and  `ProductDeleteModal` components.
- Added the `ProductsTable` component for viewing all products.

### Bug fixes
- Fixed a bug that caused irregular rendering of payables PDF in the `Payables` and `PayableDetails` components.
- Fixed a bug that disrupted the UI by allowing viewers to infinitely zoom in and out of the payables PDFs on the `Payables` and `PayableDetails` components. 
- Fixed a bug causing incorrect rendering of calendars on the `Payables` component.
- Fixed a bug causing incorrect rendering of currencies on the `Products` component.

## @monite/sdk-react@3.3.0 & @monite/sdk-api@3.3.0
This package is a minor release with no breaking changes.

### New features and improvements
- Added a `ProductCreateForm` component for creating products. For more information, see [ProductCreateForm](doc:productcreateform).
- Added a `ProductEditForm` component for updating details of an existing product. For more information, see [ProductEditForm](doc:producteditform).
- Added a `ProductDeleteModal` component for deleting products. For more information, see [ProductDeleteModal](doc:productdeletemodal).

### Bug fixes
- Fix a styling issue that affected the height of rows on the `CounterpartDetails` components.

## @monite/sdk-react@3.2.0 & @monite/sdk-api@3.2.0
This package is a minor release with no breaking changes.

### New features and improvements
- Added OCR processing state to the `PayablesTable` and `PayableDetails` components.
- Added the `ProductDetails` component to display product information.
- Improved validation for counterpart bank accounts on the `CounterpartDetails` component.

## @monite/sdk-react@3.1.0 & @monite/sdk-api@3.1.0
This package is a minor release with no breaking changes.
### New features and improvements
- Added a new `ProductsTable` component to display a list of an entity's products and services. For more information, see [ProductsTable](https://docs.monite.com/docs/productstable).
- Added a new `Products` component. For more information, see [Products](https://docs.monite.com/docs/products-1).
- Added information about subtotal, taxes, and the total amount payable while editing payables on the `PayableDetails` component.

### Bug fixes
- Fixed and improved form validation when creating or updating payables on the `PayableDetails` form.
- Fixed a bug that produces errors on the console whenever a counterpart is deleted.
- Fixed form validation errors on the `CounterpartDetails` component.
- Fixed an issue on the `TagFormModal` component that prevented tags from being updated successfully.

## @monite/sdk-react@3.0.0 & @monite/sdk-api@3.0.0 

This is a major release with several breaking changes. Refer to the [Migration guide](https://docs.monite.com/docs/migration-guide) for details on how to update your application to use `v3.0.0+` of Monite's React SDK packages.
### Breaking Changes
- `@team-monite/ui-widgets-react` package has been renamed to `@monite/sdk-react`.
- `@team-monite/sdk-api` package has been renamed to `@monite/sdk-api`.
- The `currencyLocale` property on the `MoniteProvider` wrapper's `locale` object has been deprecated in favor of a new `code` property.
- UI appearance has been changed due to a migration to Material UI components.
- Theming mechanism has been changed. For more information, see [Migration guide](https://docs.monite.com/docs/migration-guide#theming-and-customization).
- "Details" components no longer appear as modals by default. All "Details" components now adopt a `page` layout.
- The `layout` property has been removed for details components
- The `ConfirmDeleteModal` component has been deprecated.
-  The `TagFormModal` component now requires the `open` property.
- "IBAN" and "BIC" fields have been removed from the `PayableDetails` form. You can now select from a list of available counterpart bank accounts.
- The "Counterpart" field on the `PayableDetails` form has been changed to "Supplier".
- The "Supplier" field is no longer required for payables on the `PayableDetails` form. Thus, you can save and move a payable from **"Draft"** to **"New"** status without chosen counterpart.
- The "Invoice date" column has been renamed to "Issue date" on the `PayableDetails` form 
- The "Suggested payment date" field has been removed from the `PayableDetails` form
- `PayableDetails` form now enters **"Read"** mode by default instead of **"Edit"** mode
- The "Amount" field on the `PayableDetails` form is now immutable. This field is calculated and populated automatically by Monite.

### New features and improvements
- Migrated our SDKs so all requests to Monite servers use the `2023-06-04` API version.
- Introduced a new `Dialog` component that handles component layouts. For more information, see [Migration guide](https://docs.monite.com/docs/migration-guide#step-3-include-the-dialog-component).
- Added a new section—**"Business address"**—to the `CounterpartDetails` form.
- Added a new field for counterpart VAT IDs—**"VAT ID"**— to the `CounterpartDetails` component.
- Added a new field for counterpart Tax IDs—**"Tax ID"**— to the `CounterpartDetails` component.
- Added **"Creation"** mode on the `PayableDetails` component.
-  Added the ability to create a new payable manually via the `Payables` component.
- Added new field—**"Contact person"**—to the `PayableDetails` form.
- Added new section—**"Items"**—to the `PayableDetails` form
- Added new section—**"History"**—to the `PayableDetails` form.
- The `BrowserRouter` component is no longer required on the `Receivables` and `Payables` components.
### Bug fixes
- Fixed some UI issues in all components.
- Fixed inconsistent date formats for all date pickers.
- Fixed behavior of **the "Cancel"** button on the `PayableDetails` form.
- Fixed validation for GBP bank accounts on the 'CounterpartDetails` form.
- Fixed a bug that renders the `PayableDetails` form despite the presence of a payable.
 - Fixed the showing of duplicated error messages on all components.
- Fixed a bug that caused a currency change while updating payable on the `PayableDetails` form.
- Fixed payable amounts calculations to allow moving from "New" to "Draft" status on the `PayableDetails` form.
- Fixed some UI artifacts on the `PayableDetails` form.

## @team-monite/ui-widgets-react@2.8.0 & @team-monite/sdk-api@2.8.0
This package is a minor release with no breaking changes.

### Bug fixes
- Resolved a bug on the `PayableDetails` component that caused an error when saving changes.
- Fixed an issue where incorrect triggers were rendered on the `ApprovalPolicies` and `ApprovalPoliciesTable` components.
-  Fixed a bug where the "Created at" filter on the `ApprovalPoliciesTable` component was not working.
## @team-monite/ui-widgets-react@2.7.0 & @team-monite/sdk-api@2.7.0
This package is a minor release with no breaking changes.
### New features and improvements
- Added the ability to manage counterpart categories on the `Counterparts`, `CounterpartDetails`, and `CounterpartsTable` components.
### Bug fixes
- Fixed a layout issue that caused a misalignment of components.

## @team-monite/ui-widgets-react@2.6.1 & @team-monite/sdk-api@2.6.1
This package is a patch release with no new features or breaking changes.
### Bug fixes
- We fixed a bug that hindered real-time localization changes on SDK components.
## @team-monite/ui-widgets-react@2.6.0 & @team-monite/sdk-api@2.6.0
This package is a minor release with no breaking changes.
### New features and improvements
-  Added the ability to customize the layout of our `PayableDetails`, `CounterpartDetails`, and `InvoiceDetails` components using the `layout` prop.

## @team-monite/ui-widgets-react@2.5.0 & @team-monite/sdk-api@2.5.0
This package is a minor release with no breaking changes.
### New features and improvements
- Migrated our SDKs so all requests to Monite servers use the `2023-04-12` API version. For more information, see [Release notes](https://docs.monite.com/docs/release-notes). 
- Added roles and permissions to our `CounterpartsDetails` component.
- Added more methods for making API requests on our `team-monite/sdk-api` package.
- Included the ability to change date formats on all UI components and packages.


### Bug fixes
- We fixed the case sensitivity issue on the `Counterpart` component's search bar.
- We fixed a bundling issue on the `@team-monite/ui-widgets-react` package.
- We fixed an issue with Approval chain renders on the `ApprovalPoliciesTable` component.
- Fixed a bug resulting in an error when a counterpart's contact person is deleted.
- Fixed a bug resulting in an error when rendering the `InvoiceDetails` component.
- We fixed a bug that hindered real-time localization changes on SDK components.


## @team-monite/ui-widgets-react@2.4.0 & @team-monite/sdk-api@2.4.0
This package is a minor release with no breaking change.
### New features and improvements

- Added ability to create payables via file uploads in Payables components.
- Created unified components for individual UI pages—`Counterparts`, `Payables`, `Receivables`, `Tags`, and `ApprovalPolicies`. This allows you to use these components to create complete UI flows for these pages rather than configuring page components individually.

### Bug fixes
- Fixed a styling display issue that prevented components with tables from rendering table data.
- Fixed issues with `PayableDetails` component permissions.

## @team-monite/ui-widgets-react@2.3.0 & @team-monite/sdk-api@2.3.0
This package is a minor release with no breaking change.
### New features and improvements
- We've added roles and permissions to our `CounterpartsTable` component.
- We've improved permissions for all Payables components.

### Bug fixes
-  Resolved an issue where filters on the Payables Table were not functioning after pagination.
- Fixed a bug that sometimes led to errors when rendering the `TagsTable` component.

## @team-monite/ui-widgets-react@2.2.0 & @team-monite/sdk-api@2.2.0
This is a minor release with no breaking changes.
### New features and improvements

- We've added roles and permissions to our `PayablesTable` and `PayablesDetails` components.
- The Monite React UI components SDK is now compatible with Next.js applications.

### Bug fixes

- Fixed a bug that prevented the creation of new bank accounts on the `CounterpartDetails` component page.
## @team-monite/ui-widgets-react@2.1.0 & @team-monite/sdk-api@2.1.0

This is a hotfix release with critical fixes for the published npm packages.

## @team-monite/ui-widgets-react@2.0.0 & @team-monite/sdk-api@2.0.0

This is a major release with several breaking changes.
Refer to the [Migration Guide](./MIGRATION.md) for details on how to update your application to use v. 2.0.0 of Monite SDK packages.

### Breaking changes

* `MoniteApp` has been renamed to `MoniteSDK`.
* `MoniteSDK` now accepts the `fetchToken` parameter instead of `token`.
* `MoniteProvider` now accepts an extended `locale` object, whereas `MoniteSDK` no longer uses the `locale` and `currencyLocale` parameters.
* The `ReceivableDetails` component has been renamed to `InvoiceDetails` to indicate that it is used for invoices only.
* The SDK has been updated to use the latest Monite API version, 2023-03-14.

### New features and improvements

* New components for Accounts Receivable: `InvoicesTables` to display outgoing invoices, `QuotesTable` to display quotes, `CreditNotesTable` to display credit notes.
  * The `ReceivablesTable` component has been reworked to use these new components to display the data.

* The `InvoiceDetails` component has been improved to support invoice status transitions:
  * It displays action buttons relevant to the current status of the invoice. For example, "draft" invoices are displayed with the "Issue" and "Delete" buttons.
  * It supports new callbacks that are triggered by status transitions: `onCancel`, `onDelete`, `onIssue`, `onMarkAsUncollectible`.

* By default, the `PayablesTable` component now sorts payables by the creation date (from newest to oldest).

## ui-widgets-react 1.5.0

### New features

* Support for real-time mode in the `PayableDetails` and `PayablesTable` components. These components now automatically refresh the displayed data every few minutes and upon window focus.

### Bug fixes

* Fixed status names in the `PayablesTable` component.
* Fixed some keys in the [localization template file](./packages/ui-widgets-react/src/core/i18n/locales/messages.pot).

## ui-widgets-react 1.4.0

### New features

* Support for customizing and localizing UI labels in components.

## ui-widgets-react 1.3.0

### Breaking changes

* In the `<CounterpartDetails>` component, the default value of the `showBankAccounts` prop was changed from `false`
  to `true`.

### New features

* You can now change the currency locale used by Monite UI Widgets. To do this, use the new `currencyLocale` prop of the
  root `<MoniteApp>` component. The prop accepts a [BCP 47](https://en.wikipedia.org/wiki/IETF_language_tag) language
  identifier, such as "en-US". The default value is "de-DE".

  Usage example:

  ```js
  const monite = new MoniteApp({
    apiUrl: 'https://api.sandbox.monite.com/v1',
    entityId: 'ENTITY_ID',
    token: 'ACCESS_TOKEN',
    currencyLocale: 'en-US'
  });
  ```

## ui-widgets-react 1.2.4

### Breaking changes

* Previously, clicking the Pay button in the `<PayablesTable>` and `<PayableDetails>` components would automatically
  send a request to the Monite API to mark the invoice as paid. This automatic API call was removed.

  However, you can use the `onPay` callback to perform the desired actions when the users click Pay. For example, you
  can explicitly call the "mark as paid" API from the callback function.

### Bug fixes

* Fixed errors when clicking Save in the `<PayableDetails>` component.

## ui-widgets-react 1.2.3

* Internal changes to support future enhancements.

## ui-widgets-react 1.2.2

### Bug fixes

* Fixed an issue where the `<CounterpartsTable>` component did not display the last name and contact information of
  counterparts of type=individual.
* Fixed an issue where the Save button in the `<PayableDetails>` component also triggered the Submit action if the form
  was previously filled out with errors.

## ui-widgets-react 1.2.1

### Removed functionality

* Column sorting was removed from the `<PayablesTable>` component.

### Bug fixes

* Fixed an issue where new counterparts could not be created.
* Fixed displaying of counterpart addresses.

## ui-widgets-react 1.2.0

### New features

* The `<PayableDetails>` component has a new `optionalFields` prop that controls whether to display or hide some
  optional fields in payable details, specifically: "Invoice date", "Suggested payment date", "Tags", "IBAN", and "BIC".
  By default, these fields are displayed. Usage example:

  ```
  <PayableDetails
    id="9df6c614-f25f-4b2f-807c-f1e2c919019c"
    ...
    optionalFields={{
      invoiceDate: true,
      suggestedPaymentDate: true,
      tags: false,
      iban: false,
      bic: false
    }}
  />
  ```

### Improvements

* The `<PayableDetails>` component demo in the Storybook was reworked to better illustrate the entire payable lifecycle
  flow starting from the `draft` status until `paid`/`canceled`.

* Monite SDK is now built using Node.js v. 18.14.0 instead of v. 16.14.2.

### Bug fixes

* Fixed an issue where currencies other than Euro did not work properly in payable components.

* Fixed an issue with applying filters in the `<ApprovalPoliciesTable>` component after pagination.

* Fixed a display issue with the `<PaymentDetails>` component in the Storybook.

## ui-widgets-react 1.1.0

### New features

* The `<CounterpartDetails>` component has a new `showBankAccounts` prop that controls whether to display the "Bank
  accounts" section.

### Bug fixes

* Fixed an issue with the `<CounterpartDetails>` component that caused a blank page.

## ui-widgets-react 1.0.0

This is the first major release of Monite UI Widgets (`@team-monite/ui-widgets-react`) - a React component library for
building embedded finance capabilities into your products, powered by Monite API.

This release comes with new components for Accounts Payable and Accounts Receivable integration.

Notable changes since v. 0.0.4 of `ui-widgets-react`:

* Added new components to display and manage tags:
  * `<TagsTable>` - a table that displays the list of existing tags with built-in sorting, pagination, rename and delete
    capabilities.
  * `<TagFormModal>` - the "create new tag" modal.
  * `<ConfirmDeleteModal>` - a confirmation modal displayed before a tag is deleted.
* Added new component for approval policies:
  * `<ApprovalPoliciesTable>` - a table that displays the list of existing approval policies with built-in pagination,
    sorting, and filtering capabilities.
* Added new component for Accounts Receivable:
  * `<CreateInvoice>` - the "create invoice" modal.

Browse all available components in our interactive explorer at https://sdk.dev.monite.com.
