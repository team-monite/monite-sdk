This file contains a list of changes, new features, and fixes in each release of Monite SDK.

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