---
'@monite/sdk-react': patch
'@monite/sdk-drop-in': patch
---

Event handlers for payable actions (such as saved, canceled, submitted, etc.) are now only available when a corresponding callback is defined; otherwise, they will be undefined
