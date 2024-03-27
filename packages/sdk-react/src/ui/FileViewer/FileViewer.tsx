import React, { ReactNode, useEffect, useState } from 'react';
import { useMeasure } from 'react-use';

import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { CenteredContentBox } from '@/ui/box';
import { LoadingPage } from '@/ui/loadingPage';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Box, IconButton } from '@mui/material';
import { Grid } from '@mui/material';

const SCALE_STEP = 0.1;
const SCALE_MAX = 1.5;
const SCALE_MIN = 1;

export const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
];

export interface FileViewerProps {
  /**
   * Defines what PDF should be displayed.
   * Its value can be a URL,
   * a file (imported using import ... from ... or from file input form element),
   * or an object with parameters
   *  (
   *   url - URL;
   *   data - data, preferably Uint8Array;
   *   range - PDFDataRangeTransport;
   *   httpHeaders - custom request headers, e.g. for authorization
   *   withCredentials - a boolean to indicate whether to include cookies in the request (defaults to false)
   *  )
   */
  url: any;
  mimetype: string;
  name?: string;
  rightIcon?: ReactNode;
}

export const FileViewer = (props: FileViewerProps) => {
  const [reactPdfDynamic, setReactPdfDynamic] = useState<{
    components: AsyncReturnType<typeof loadReactPDF> | null;
    error: string | null;
    loading: boolean;
  }>({
    error: null,
    components: null,
    loading: true,
  });

  const { i18n } = useLingui();

  useEffect(() => {
    /**
     * We have to load react-pdf dynamically because it is not compatible with SSR.
     */
    loadReactPDF()
      .then((components) => {
        setReactPdfDynamic((prev) => ({
          components,
          error: null,
          loading: false,
        }));
      })
      .catch((error) => {
        setReactPdfDynamic((prev) => {
          const errorMessage = error.message;
          return {
            components: null,
            error: errorMessage
              ? t(i18n)`Failed to load PDF Viewer: ${errorMessage}`
              : t(i18n)`Failed to load PDF Viewer`,
            loading: false,
          };
        });
      });
  }, [i18n]);

  if (reactPdfDynamic.loading) {
    return <LoadingPage />;
  }

  if (reactPdfDynamic.components) {
    const { Document, Page } = reactPdfDynamic.components;
    return <FileViewerComponent {...props} Document={Document} Page={Page} />;
  }

  if (reactPdfDynamic.error) {
    return (
      <CenteredContentBox>
        <Box color="danger">{reactPdfDynamic.error}</Box>
      </CenteredContentBox>
    );
  }

  return null;
};

const FileViewerComponent = ({
  url,
  mimetype,
  name,
  rightIcon,
  Document,
  Page,
}: FileViewerProps & AsyncReturnType<typeof loadReactPDF>) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const onPreviousPage = () => changePage(-1);
  const onNextPage = () => changePage(1);
  const onZoomIn = () => {
    const newScale = scale <= SCALE_MAX ? scale + SCALE_STEP : scale;

    setScale(Math.round(newScale * 10) / 10);
  };
  const onZoomOut = () => {
    const newScale = scale >= SCALE_MIN ? scale - SCALE_STEP : scale;

    setScale(Math.round(newScale * 10) / 10);
  };

  const isPdf = mimetype === 'application/pdf';

  const renderFile = () => {
    if (isPdf)
      return (
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={console.error} //TODO add error view when design will be ready
        >
          <Page
            pageNumber={pageNumber}
            width={width}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      );

    return <img src={url} alt={name} />;
  };

  return (
    <MoniteStyleProvider>
      <Grid container ref={ref}>
        <Grid
          item
          container
          flexWrap="nowrap"
          sx={{ justifyContent: isPdf ? 'space-between' : 'flex-end' }}
        >
          {isPdf && (
            <Grid item container alignItems="center">
              <IconButton
                color="inherit"
                onClick={onPreviousPage}
                disabled={pageNumber <= 1}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Trans>
                  {pageNumber || (numPages ? 1 : '-')} of {numPages || '-'}
                </Trans>
              </Box>
              <IconButton
                color="inherit"
                onClick={onNextPage}
                disabled={pageNumber >= numPages}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Grid>
          )}
          <Grid item container justifyContent="flex-end">
            {isPdf && (
              <>
                <IconButton
                  color="inherit"
                  onClick={onZoomOut}
                  disabled={scale === SCALE_MIN}
                >
                  <ZoomOutIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={onZoomIn}
                  disabled={scale === SCALE_MAX}
                >
                  <ZoomInIcon />
                </IconButton>
              </>
            )}

            <IconButton color="inherit" target={'_blank'} href={url} download>
              <FileDownloadIcon />
            </IconButton>

            {rightIcon}
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ flex: '1 1 auto', overflow: 'auto', height: 0 }}>
        {renderFile()}
      </Grid>
    </MoniteStyleProvider>
  );
};

const loadReactPDF = async () => {
  const { pdfjs, Document, Page } = await import('react-pdf');
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  return { Document, Page } as const;
};

type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : never;
