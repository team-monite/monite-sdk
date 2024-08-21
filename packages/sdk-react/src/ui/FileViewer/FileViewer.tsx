import { useEffect, useRef } from 'react';

import { embed } from 'pdfobject';

export const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
];

interface FileViewerProps {
  url: string;
  mimetype: string;
  name?: string;
}

export const FileViewer = ({ url, mimetype, name }: FileViewerProps) => {
  if (mimetype === 'application/pdf') return <PdfFileViewer url={url} />;

  return (
    <img
      className="Monite-ImageFileViewer"
      src={url}
      alt={name}
      loading="lazy"
      style={{ width: '100%', objectFit: 'contain' }}
    />
  );
};

const PdfFileViewer = ({ url }: { url: string }) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pdfRef.current) return;

    embed(url, pdfRef.current, {
      fallbackLink: true,
      pdfOpenParams: {
        scrollBar: 0,
        statusBar: 0,
        toolbar: 1,
        navpanes: 0,
        pagemode: 'none',
        messages: 0,
      },
    });
  }, [url]);

  return (
    <div
      className="Monite-PdfFileViewer"
      ref={pdfRef}
      style={{ width: '100%', minHeight: '100%', border: 'none' }}
    />
  );
};
