---
'@monite/sdk-react': patch
---

fix(DEV-11506): prevent PDFObject.embed() call for image URLs

We've updated the file preview logic to skip calling `PDFObject.embed()` when the URL points to an image. This fix
addresses an issue where attempting to embed image files as PDFs was causing errors or unexpected behavior.
