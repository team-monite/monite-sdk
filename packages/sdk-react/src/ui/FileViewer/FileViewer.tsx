import React, { ReactNode, useEffect, useState } from 'react';
import { useId } from 'react';
import { useMeasure } from 'react-use';

import { CenteredContentBox } from '@/ui/box';
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
  url?: string;
  mimetype: string;
  name?: string;
  rightIcon?: ReactNode;
  onReloadCallback?: () => void;
}

export const FileViewer = (props: FileViewerProps) => {
  const { i18n } = useLingui();
  const isSSR = typeof window === 'undefined';
  const [error, setError] = useState<string | null>(null);

  const rawPdfViewerId = useId();
  const pdfViewerId = `pdf-viewer-${rawPdfViewerId.replace(/:/g, '-')}`;

  useEffect(() => {
    if (!isSSR && props.mimetype === 'application/pdf' && props.url) {
      try {
        PDFObject.embed(props.url, `#${pdfViewerId}`, {});
      } catch (err) {
        if (err instanceof Error) {
          setError(t(i18n)`Failed to load PDF Viewer: ${err?.message}`);
        }
      }
    }
  }, [i18n, isSSR, props.mimetype, props.url, pdfViewerId]);

  if (error) {
    return (
      <CenteredContentBox>
        <Box color="danger">{error}</Box>
      </CenteredContentBox>
    );
  }

  return <FileViewerComponent {...props} pdfViewerId={pdfViewerId} />;
};

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
  url = '',
  mimetype,
  name,
  rightIcon,
  pdfViewerId,
  onReloadCallback,
}: FileViewerProps & { pdfViewerId: string }) => {
  const [ref] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    PDFObject.embed(url, `#${pdfViewerId}`, {
      fallbackLink: true,
    });
  }, [url, pdfViewerId]);

  if (!url) {
    return <ErrorComponent onError={onReloadCallback} />;
  }

  const isPdf = mimetype === 'application/pdf';

  const renderFile = () => {
    if (isPdf) {
      return (
        <object
          data={url}
          type={mimetype}
          style={{ width: '100%', height: '100vh', border: 'none' }}
        >
          <iframe src={url} title={name} width="100%" height="100vh">
            <a href={url}>{name}</a>
          </iframe>
        </object>
      );
    }
    return <img src={url} alt={name} style={{ width: '100%' }} />;
  };

  return (
    <>
      <Grid container ref={ref}>
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
