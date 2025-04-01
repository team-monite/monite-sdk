---
'@monite/sdk-react': major
'@monite/sdk-drop-in': major
---

Financing components have been redesigned and improved, FinanceBanner is now the main component to display financing outside of FinancingTab
- FinanceApplicationCard has been renamed to FinanceIntegrationCard
- FinanceBanner accepts 3 props:
  - variant
  - enableServicingBanner
  - handleViewDetails
variant accepts 3 different values: onboard, finance and finance_card:
    onboard has a height of 90px, it is set to be used as an actual banner
    finance has a height of 192px, it is also set to be used as a banner but only when you are already part of a financing plan
    finance_card has a height of 280px, it is supposed to be used as a card
It is also worth noting that their widths are all 100%, so what defines the width of the banner is the wrapping container.

enableServicingBanner is a boolean flag that enables the FinanceBanner to be a small summarized version of the financing tab, but only works when entity is onboarded and is servicing.

handleViewDetails is a function that is passed to the View details button. The button will only appear when entity is servicing, enableServicingBanner is true and handleViewDetails is passed. The purpose of this button is to give the user a way to navigate to the financing page through it.