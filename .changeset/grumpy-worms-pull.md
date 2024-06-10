---
'@monite/sdk-react': major
---

Fixed a bug with PDF rendering caused by SSR rendering by changing to a more native approach. Switched from `react-pdf` to `pdfjs-dist`, which is the main library behind `react-pdf`. Implemented custom canvas rendering and fallback logic for iframes with objects.
