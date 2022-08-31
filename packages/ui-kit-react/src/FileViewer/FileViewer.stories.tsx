import samplePDF from './example.pdf';

import FileViewer from './FileViewer';

const Story = {
  title: 'Data Display/FileViewer',
  component: FileViewer,
};
export default Story;

export const DefaultPdfViewer = () => (
  <div style={{ width: 612, padding: 48, background: '#F3F3F3' }}>
    <FileViewer mimetype={'application/pdf'} url={samplePDF} />
  </div>
);
