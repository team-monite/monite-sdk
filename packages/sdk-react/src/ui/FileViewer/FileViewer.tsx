import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMeasure } from 'react-use';

import { CenteredContentBox } from '@/ui/box';
import { LoadingPage } from '@/ui/loadingPage';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { Grid } from '@mui/material';

import {
  PDFDocumentProxy,
  PDFPageProxy,
  RenderParameters,
} from 'pdfjs-dist/types/display/api';

const SCALE_STEP = 0.1;
const SCALE_MAX = 1.5;
const SCALE_MIN = 1;

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
  const [pdfJsDynamic, setPdfJsDynamic] = useState<{
    pdfjsLib: AsyncReturnType<typeof loadPdfJs> | null;
    error: string | null;
    loading: boolean;
  }>({
    error: null,
    pdfjsLib: null,
    loading: false,
  });

  const { i18n } = useLingui();
  const isSSR = typeof window === 'undefined';

  useEffect(() => {
    if (!isSSR && props.mimetype === 'application/pdf') {
      setPdfJsDynamic((prev) => ({ ...prev, loading: true }));
      loadPdfJs()
        .then((pdfjsLib) => {
          setPdfJsDynamic({
            pdfjsLib,
            error: null,
            loading: false,
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
          setPdfJsDynamic({
            pdfjsLib: null,
            error: errorMessage
              ? t(i18n)`Failed to load PDF Viewer: ${errorMessage}`
              : t(i18n)`Failed to load PDF Viewer`,
            loading: false,
          });
        });
    }
  }, [i18n, isSSR, props.mimetype]);

  if (pdfJsDynamic.loading) {
    return <LoadingPage />;
  }

  if (pdfJsDynamic.pdfjsLib) {
    return <FileViewerComponent {...props} pdfjsLib={pdfJsDynamic.pdfjsLib} />;
  }

  if (pdfJsDynamic.error) {
    return (
      <CenteredContentBox>
        <Box color="danger">{pdfJsDynamic.error}</Box>
      </CenteredContentBox>
    );
  }

  return (
    <object
      data={props.url}
      type={props.mimetype}
      style={{ width: '100%', height: '100vh', border: 'none' }}
    >
      <iframe src={props.url} title={props.name} width="100%" height="100vh">
        <a href={props.url}>{props.name}</a>
      </iframe>
    </object>
  );
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
  url,
  mimetype,
  name,
  rightIcon,
  pdfjsLib,
  onReloadCallback,
}: FileViewerProps & { pdfjsLib: AsyncReturnType<typeof loadPdfJs> }) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const renderTaskRef = useRef<any>(null); // Reference to keep track of the render task

  useEffect(() => {
    pdfjsLib.getDocument(url).promise.then((pdf: PDFDocumentProxy) => {
      setNumPages(pdf.numPages);
    });
  }, [pdfjsLib, url]);

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

  const renderPage = useCallback(() => {
    pdfjsLib.getDocument(url).promise.then((pdf: PDFDocumentProxy) => {
      pdf.getPage(pageNumber).then((page: PDFPageProxy) => {
        const viewport = page.getViewport({ scale });
        const canvas = document.getElementById(
          'pdf-canvas'
        ) as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel(); // Cancel any ongoing render task
        }

        if (context) {
          const outputScale = window.devicePixelRatio || 1;

          canvas.width = viewport.width * outputScale;
          canvas.height = viewport.height * outputScale;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          const renderContext: RenderParameters = {
            canvasContext: context as NonNullable<unknown>,
            transform:
              outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : undefined,
            viewport: viewport,
          };

          renderTaskRef.current = page.render(renderContext);
          renderTaskRef.current.promise.catch((error: Error) => {
            if (error.name !== 'RenderingCancelledException') {
              console.error('Render failed:', error);
            }
          });
        }
      });
    });
  }, [pdfjsLib, pageNumber, scale, url]);

  useEffect(() => {
    if (pdfjsLib) {
      renderPage();
    }
  }, [pdfjsLib, pageNumber, scale, url, width, renderPage]);

  if (!url) {
    return <ErrorComponent onError={onReloadCallback} />;
  }

  const isPdf = mimetype === 'application/pdf';

  const renderFile = () => {
    if (isPdf) {
      return <canvas id="pdf-canvas" style={{ width: '100%' }} />;
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
      <Grid
        container
        sx={{ flex: '1 1 auto', overflow: 'auto', height: 'auto' }}
      >
        {renderFile()}
      </Grid>
    </>
  );
};

const loadPdfJs = async () => {
  const pdfjsLib = await import('pdfjs-dist/build/pdf.min');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
  return pdfjsLib;
};

type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : never;
