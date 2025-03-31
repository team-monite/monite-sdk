---
'@monite/sdk-react': major
'@monite/sdk-drop-in': major
---

Financing components have been redesigned and improved, FinanceBanner is now the main component to display financing outside of FinancingTab
- FinanceApplicationCard no longer exists, we use FinanceBanner component now with the variant of "finance_card"
- FinanceBanner has 3 different visual styles: onboard, finance and finance_card
    onboard has a height of 90px, it is set to be used as an actual banner
    finance has a height of 192px, it is also set to be used as a banner but only when you are already part of a financing plan
    finance_card has a height of 280px, it is supposed to be used as a card
It is also worth noting that their widths are all 100%, so what defines the width of the banner is the wrapping container.