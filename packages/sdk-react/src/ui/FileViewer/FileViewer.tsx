import React, { ReactNode, useEffect, useRef } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

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
  rightIcon?: ReactNode;
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
  rightIcon,
  onReloadCallback,
}: FileViewerProps) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    PDFObject.embed(url, pdfRef.current, {
      fallbackLink: true,
      pdfOpenParams: {
        // eslint-disable-next-line lingui/no-unlocalized-strings
        view: 'FitH',
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
          style={{ width: '100%', height: '100vh', border: 'none' }}
        ></div>
      );
    }
    return <img src={url} alt={name} style={{ width: '100%' }} />;
  };

  return (
    <>
      <Grid container>
        <Grid
          item
          container
          flexWrap="nowrap"
          sx={{ justifyContent: isPdf ? 'space-between' : 'flex-end' }}
        >
          <Grid item container justifyContent="flex-end">
            {rightIcon}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{ flex: '1 1 auto', overflow: 'auto', height: 'auto' }}
      >
        {renderFile()}
      </Grid>
    </>
  );
};
