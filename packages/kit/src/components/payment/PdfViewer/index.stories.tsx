import samplePDF from './example.pdf';

import PdfViewer from './PdfViewer';

const Story = {
  title: 'PdfViewer',
  component: PdfViewer,
};
export default Story;

export const DefaultPdfViewer = () => (
  <div style={{ width: 612, padding: 48, background: '#F3F3F3' }}>
    <PdfViewer file={samplePDF} />
  </div>
);
