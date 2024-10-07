---
'@monite/sdk-react': minor
---

introduce Custom Tabs for `<ReceivablesTable/>`

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
