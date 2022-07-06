import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import {
  IconButton,
  ZoomPlusIcon,
  ZoomMinusIcon,
  DownloadFileIcon,
  BackIcon,
  ForthIcon,
  Flex,
} from '@monite/ui';

import * as Styled from './styles';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const SCALE_STEP = 0.1; //TODO: Peter will define scale step later

export interface PDfViewerProps {
  /**
   * Defines what PDF should be displayed.
   * Its value can be an URL,
   * a file (imported using import ... from ... or from file input form element),
   * or an object with parameters
   *  (
   *   url - URL;
   *   data - data, preferably Uint8Array;
   *   range - PDFDataRangeTransport;
   *   httpHeaders - custom request headers, e.g. for authorization
   *   withCredentials - a boolean to indicate whether or not to include cookies in the request (defaults to false)
   *  )
   */
  file: any;
}

const PdfViewer = ({ file }: PDfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const onPreviousPage = () => changePage(-1);

  const onNextPage = () => changePage(1);

  const onZoomIn = () => setScale(scale + SCALE_STEP);

  const onZoomOut = () => setScale(scale - SCALE_STEP);

  return (
    <>
      <Styled.ControlPanel>
        <Flex alignItems="center">
          <IconButton
            variant="icon"
            onClick={onPreviousPage}
            disabled={pageNumber <= 1}
            minWidth={48}
          >
            <BackIcon width={24} height={24} />
          </IconButton>
          <div>
            {pageNumber || (numPages ? 1 : '-')} of {numPages || '-'}
          </div>
          <IconButton
            variant="icon"
            disabled={pageNumber >= numPages}
            onClick={onNextPage}
            minWidth={48}
          >
            <ForthIcon width={24} height={24} />
          </IconButton>
        </Flex>
        <Flex>
          <IconButton variant="icon" onClick={onZoomOut}>
            <ZoomMinusIcon width={24} height={24} />
          </IconButton>
          <IconButton variant="icon" onClick={onZoomIn}>
            <ZoomPlusIcon width={24} height={24} />
          </IconButton>
          <IconButton variant="icon">
            <Styled.Link href={file} download>
              <DownloadFileIcon width={24} height={24} color="black" />
            </Styled.Link>
          </IconButton>
        </Flex>
      </Styled.ControlPanel>

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={console.error} //TODO add error view when design will be ready
      >
        <Page pageNumber={pageNumber} scale={scale} />
      </Document>
    </>
  );
};

export default PdfViewer;
