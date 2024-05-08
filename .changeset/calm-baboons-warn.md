---
'@monite/sdk-react': patch
---

Added two new components: `<InvoiceStatusChip/>` and `<PayableStatusChip/>`. Both components are configurable through
Material-UI theming to adapt their appearance and functionality according to application needs. For instance,
the `InvoiceStatusChip` can be customized under the component name `MoniteInvoiceStatusChip` in the MUI theme settings.
This allows for defining default properties and specific styles for various statuses, such as 'paid' and 'overdue'. This
configurability ensures that both components can be seamlessly integrated and styled within the existing application
framework, providing a consistent user experience.
