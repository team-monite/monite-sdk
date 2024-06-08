import React from 'react';
import { renderToString } from 'react-dom/server';

import i18n from '@/mocks/i18n';
import { renderWithClient } from '@/utils/test-utils';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { screen } from '@testing-library/react';

import { FileViewer } from './FileViewer';

const customI18n = setupI18n({
  locale: i18n.locale,
  messages: {
    [i18n.locale]: {
      ...i18n.messages,
    },
  },
});

describe('FileViewer', () => {
  describe('# Interface', () => {
    describe('# PDF', () => {
      test('should render a PDF file', async () => {
        renderWithClient(
          <FileViewer
            url="https://pdfobject.com/pdf/sample.pdf"
            mimetype="application/pdf"
            name="Sample PDF"
          />
        );

        const downloadLink = await screen.findByTestId('FileDownloadIcon');
        expect(downloadLink.closest('a')).toHaveAttribute(
          'href',
          'https://pdfobject.com/pdf/sample.pdf'
        );

        const pdfDocument = await screen.findByText(/Failed to load PDF file/i);
        expect(pdfDocument).toBeInTheDocument();
      });

      test('should render a PDF file with custom styles', async () => {
        renderWithClient(
          <FileViewer
            url="https://pdfobject.com/pdf/sample.pdf"
            mimetype="application/pdf"
            name="Sample PDF"
            rightIcon={<button>Custom Icon</button>}
          />
        );

        const downloadLink = await screen.findByTestId('FileDownloadIcon');
        expect(downloadLink.closest('a')).toHaveAttribute(
          'href',
          'https://pdfobject.com/pdf/sample.pdf'
        );

        const customIconButton = await screen.findByText('Custom Icon');
        expect(customIconButton).toBeInTheDocument();

        const pdfDocument = await screen.findByText(/Failed to load PDF file/i);
        expect(pdfDocument).toBeInTheDocument();
      });

      test('should render correctly on the server (SSR)', () => {
        const html = renderToString(
          <I18nProvider i18n={customI18n}>
            <FileViewer
              url="https://pdfobject.com/pdf/sample.pdf"
              mimetype="application/pdf"
              name="Sample PDF"
            />
          </I18nProvider>
        );

        expect(html).toContain('Sample PDF');
        expect(html).toContain('<iframe');
      });
    });

    describe('# Image', () => {
      test('should render an image file', async () => {
        renderWithClient(
          <FileViewer
            url="https://placehold.co/600x400/black/white"
            mimetype="image/jpeg"
            name="Sample Image"
          />
        );

        const imageElement = await screen.findByAltText(/Sample Image/i);
        expect(imageElement).toBeInTheDocument();
      });

      test('should render an image file with custom styles', async () => {
        renderWithClient(
          <FileViewer
            url="https://placehold.co/600x400/black/white"
            mimetype="image/jpeg"
            name="Sample Image"
            rightIcon={<button>Custom Icon</button>}
          />
        );

        const imageElement = await screen.findByAltText(/Sample Image/i);
        const customIconButton = await screen.findByText('Custom Icon');
        expect(imageElement).toBeInTheDocument();
        expect(customIconButton).toBeInTheDocument();
      });
    });
  });
});
