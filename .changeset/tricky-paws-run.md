---
'@monite/sdk-drop-in': minor
'@monite/sdk-react': minor
---

- Replaced current `DocumentDesign` component with `TemplateSettings`, a more complete component to edit template settings, giving more flexibility in customisation. It accepts 3 props:
    - `isDialog`, a boolean value that tells whether the component will be rendered inside a Dialog wrapper or not
    - `isOpen`, a boolean flag that controls the dialog state
    - `handleCloseDialog`, a callback function that is called to close the dialog

- Also added a new option in componentSettings: `templateSettings`
This option allows the user to further customise how the settings will be presented and it accepts the following props:
    - `showTemplateSection`, a boolean value that defines whether to display or not the template selection section, defaults to true.
    - `showTemplatePreview`, a boolean value that defines whether to display or not the template PDF preview, defaults to true.
    - `showLogoSection`, a boolean value that defines whether to display or not the logo selection section, defaults to true.
    - `enableDocumentNumberCustomisationTab`, a boolean value that enables the document number customisation tab if true or hides it if false, defaults to true.
    - `availableARDocuments`, list of available AR documents for customisation, defaults to all of the documents.
    - `availableAPDocuments`, list of available AP documents for customisation, defaults to all of the documents.