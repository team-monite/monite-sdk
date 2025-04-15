---
'@monite/sdk-react': minor
'@monite/sdk-drop-in': minor
---

- Added entity bank account creation flow
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
  - `ankAccountCurrencies` custom list of available currencies to select from when creating a bank account, by default we display all.
