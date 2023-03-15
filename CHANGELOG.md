This file contains a list of changes, new features, and fixes in each release of Monite SDK.

## ui-widgets-react 1.2.2

### Bug fixes
* Fixed an issue where the `<CounterpartsTable>` component did not display the last name and contact information of counterparts of type=individual.
* Fixed an issue where the Save button in the `<PayableDetails>` component also triggered the Submit action if the form was previously filled out with errors.

## ui-widgets-react 1.2.1

## Removed functionality
* Column sorting was removed from the `<PayablesTable>` component.

## Bug fixes
* Fixed an issue where new counterparts could not be created.
* Fixed displaying of counterpart addresses.

## ui-widgets-react 1.2.0

### New features
* The `<PayableDetails>` component has a new `optionalFields` prop that controls whether to display or hide some optional fields in payable details, specifically: "Invoice date", "Suggested payment date", "Tags", "IBAN", and "BIC". By default, these fields are displayed. Usage example:

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
* The `<PayableDetails>` component demo in the Storybook was reworked to better illustrate the entire payable lifecycle flow starting from the `draft` status until `paid`/`canceled`.

* Monite SDK is now built using Node.js v. 18.14.0 instead of v. 16.14.2.

### Bug fixes
* Fixed an issue where currencies other than Euro did not work properly in payable components.

* Fixed an issue with applying filters in the `<ApprovalPoliciesTable>` component after pagination.

* Fixed a display issue with the `<PaymentDetails>` component in the Storybook.

## ui-widgets-react 1.1.0
### New features
* The `<CounterpartDetails>` component has a new `showBankAccounts` prop that controls whether to display the "Bank accounts" section.

### Bug fixes
* Fixed an issue with the `<CounterpartDetails>` component that caused a blank page.

## ui-widgets-react 1.0.0

This is the first major release of Monite UI Widgets (`@team-monite/ui-widgets-react`) - a React component library for building embedded finance capabilities into your products, powered by Monite API.

This release comes with new components for Accounts Payable and Accounts Receivable integration.

Notable changes since v. 0.0.4 of `ui-widgets-react`:

* Added new components to display and manage tags:
    * `<TagsTable>` - a table that displays the list of existing tags with built-in sorting, pagination, rename and delete capabilities.
    * `<TagFormModal>` - the "create new tag" modal.
    * `<ConfirmDeleteModal>` - a confirmation modal displayed before a tag is deleted.
* Added new component for approval policies:
    * `<ApprovalPoliciesTable>` - a table that displays the list of existing approval policies with built-in pagination, sorting, and filtering capabilities.
* Added new component for Accounts Receivable:
    * `<CreateInvoice>` - the "create invoice" modal.

Browse all available components in our interactive explorer at https://sdk.dev.monite.com.