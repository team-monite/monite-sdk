import React from 'react';
import samplePDF from './example.pdf';

import PdfViewer from './';

const Story = {
  title: 'PdfViewer',
  component: PdfViewer,
};
export default Story;

export const DefaultPdfViewer = () => (
  <>
    <PdfViewer file={samplePDF} />
  </>
);
