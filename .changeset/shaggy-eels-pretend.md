---
'@monite/sdk-react': minor
---

Added a new `disableAutoCalculateTotals` flag in Payables `componentSettings`. When set to `true`, this allows users to manually edit the totals values of a Payable; no automatic calculation will be performed on the client side. The default is `false`. Note: Enabling manual totals editing may require coordination with API Partner Settings to allow this functionality.
