import { renderToString } from 'react-dom/server';

import i18n from '@/mocks/i18n';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { CSSProperties } from '@mui/material/styles/createMixins';
import { Meta, StoryObj } from '@storybook/react';

import { FileViewer } from './FileViewer';

const customI18n = setupI18n({
  locale: i18n.locale,
  messages: {
    [i18n.locale]: {
      ...i18n.messages,
    },
  },
});

const meta: Meta<typeof FileViewer> = {
  title: 'Components / FileViewer',
  component: FileViewer,
};

type Story = StoryObj<typeof FileViewer>;

const customStyles: CSSProperties = {
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

export const SSRFile: Story = {
  name: 'SSR File',
  args: {
    url: 'https://pdfobject.com/pdf/sample.pdf',
    mimetype: 'application/pdf',
    name: 'Sample PDF',
  },
  render: (args) => {
    const html = renderToString(
      <I18nProvider i18n={customI18n}>
        <FileViewer {...args} />
      </I18nProvider>
    );
    console.log(html);
    return (
      <div
        style={{
          width: '100%',
          maxWidth: 600,
          height: '100vh',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  },
};

export default meta;
