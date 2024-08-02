import { Meta, StoryObj } from '@storybook/react';

import { FileViewer } from './FileViewer';

const meta: Meta<typeof FileViewer> = {
  title: 'Components / FileViewer',
  component: FileViewer,
};

type Story = StoryObj<typeof FileViewer>;

const customStyles = {
  width: '100%',
  maxWidth: 600,
};

export const FileViewerPdf: Story = {
  name: 'pdf file',
  args: {
    url: 'https://pdfobject.com/pdf/sample.pdf',
    mimetype: 'application/pdf',
    name: 'Sample PDF',
  },
  render: (args) => (
    <div style={customStyles}>
      <FileViewer {...args} />
    </div>
  ),
};

export const FileViewerImage: Story = {
  name: 'image file',
  args: {
    url: 'https://placehold.co/600x400/black/white',
    mimetype: 'image/jpeg',
    name: 'Sample Image',
  },
  render: (args) => (
    <div style={customStyles}>
      <FileViewer {...args} />
    </div>
  ),
};

export default meta;
