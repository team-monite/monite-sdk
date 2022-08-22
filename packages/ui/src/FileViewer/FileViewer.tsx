import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

import {
  IconButton,
  USearchPlus,
  USearchMinus,
  UFileDownload,
  UArrowLeft,
  UArrowRight,
  Flex,
} from '../index';

import { pdfjs } from 'react-pdf';

import { StyledScroll, ControlPanel } from './styles';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const SCALE_STEP = 0.1; //TODO: Peter will define scale step later

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
}

const FileViewer = ({ url, mimetype, name }: FileViewerProps) => {
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
  const onZoomIn = () => setScale(scale + SCALE_STEP);
  const onZoomOut = () => setScale(scale - SCALE_STEP);

  const isPdf = mimetype === 'application/pdf';

  const renderFile = () => {
    if (isPdf)
      return (
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={console.error} //TODO add error view when design will be ready
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      );

    return <img src={url} alt={name} />;
  };

  return (
    <>
      <ControlPanel isPdf={isPdf}>
        {isPdf && (
          <Flex alignItems="center">
            <IconButton
              color={'black'}
              onClick={onPreviousPage}
              disabled={pageNumber <= 1}
              minWidth={48}
            >
              <UArrowLeft width={24} height={24} />
            </IconButton>
            <div>
              {pageNumber || (numPages ? 1 : '-')} of {numPages || '-'}
            </div>
            <IconButton
              color={'black'}
              disabled={pageNumber >= numPages}
              onClick={onNextPage}
              minWidth={48}
            >
              <UArrowRight width={24} height={24} />
            </IconButton>
          </Flex>
        )}
        <Flex>
          {isPdf && (
            <>
              <IconButton color={'black'} onClick={onZoomOut}>
                <USearchMinus width={24} height={24} />
              </IconButton>
              <IconButton color={'black'} onClick={onZoomIn}>
                <USearchPlus width={24} height={24} />
              </IconButton>
            </>
          )}

          <IconButton color={'black'}>
            <IconButton target={'_blank'} href={url} download>
              <UFileDownload width={24} height={24} color="black" />
            </IconButton>
          </IconButton>
        </Flex>
      </ControlPanel>

      <StyledScroll>{renderFile()}</StyledScroll>
    </>
  );
};

export default FileViewer;
