---
'@monite/sdk-react': major
'@monite/sdk-drop-in': major
---

Financing components have been redesigned and improved, FinanceBanner is now the main component to display financing outside of FinancingTab
- FinanceApplicationCard has been renamed to FinanceIntegrationCard
- FinanceBanner accepts 2 props:
  - enableServicingBanner
  - handleViewDetails
It is also worth noting that the width of the banner is 100%, so what defines the width of the banner is the wrapping container.

enableServicingBanner is a boolean flag that enables the FinanceBanner to be a small summarized version of the financing tab, but only works when entity is onboarded and is servicing.

handleViewDetails is a function that is passed to the View details button. The button will only appear when entity is servicing, enableServicingBanner is true and handleViewDetails is passed. The purpose of this button is to give the user a way to navigate to the financing page through it.

componentSettings now also has an option for financing which allows user to customize whether the finance menu buttons will show on the top right corner of the financing tab page or inside the finance card. By default the buttons will show at the top right corner.
componentSettings also allows user to pass an array of finance steps to define the content of the How does invoice financing work drawer component.