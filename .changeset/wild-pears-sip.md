---
'@monite/sdk-react': minor
---

feat(DEV-10391): add actions menu to InvoicesTable

Adds a new Actions Menu to the `InvoicesTable` component. This allows users to perform actions on individual invoices
directly from the table, such as viewing, editing, and deleting them.

The Actions Menu can be customized using the new `rowActions` prop, which allows you to specify which actions are
available for each invoice status. If no `rowActions` prop is provided, a set of default actions will be displayed.
