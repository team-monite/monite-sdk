import React, { useEffect, useRef } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Stack, Typography } from '@mui/material';

import PDFObject from 'pdfobject';

export const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
];

export interface FileViewerProps {
  url: string;
  mimetype: string;
  name?: string;
  onReloadCallback?: () => void;
}

export const FileViewer = (props: FileViewerProps) => (
  <FileViewerComponent {...props} />
);

const ErrorComponent = ({
  onError,
}: {
  onError: FileViewerProps['onReloadCallback'];
}) => {
  const { i18n } = useLingui();

  return (
    <Box
      sx={{
        padding: 4,
      }}
    >
      <Stack alignItems="center" gap={2}>
        <ErrorOutlineIcon color="error" />
        <Stack gap={0.5} alignItems="center">
          <Typography variant="body1" fontWeight="bold">{t(
            i18n
          )`Failed to load PDF Viewer`}</Typography>
          <Stack alignItems="center">
            <Typography variant="body2">{t(
              i18n
            )`Please try to reload.`}</Typography>
            <Typography variant="body2">{t(
              i18n
            )`If the error recurs, contact support.`}</Typography>
          </Stack>
          {onError && (
            <Button
              variant="text"
              onClick={onError}
              startIcon={<RefreshIcon />}
            >{t(i18n)`Reload`}</Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

const FileViewerComponent = ({
  url,
  mimetype,
  name,
  onReloadCallback,
}: FileViewerProps) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    PDFObject.embed(url, pdfRef.current, {
      fallbackLink: true,
      pdfOpenParams: {
        // eslint-disable-next-line lingui/no-unlocalized-strings
        scrollBar: 0,
        statusBar: 0,
        toolbar: 1,
        navpanes: 0,
        pagemode: 'none',
        messages: 0,
      },
    });
  }, [url]);

  if (!url) {
    return <ErrorComponent onError={onReloadCallback} />;
  }

  const isPdf = mimetype === 'application/pdf';

  const renderFile = () => {
    if (isPdf) {
      return (
        <div
          ref={pdfRef}
          style={{ width: '100%', minHeight: '100%', border: 'none' }}
        />
      );
    }
    return <img src={url} alt={name} style={{ width: '100%' }} />;
  };

  return renderFile();
};
