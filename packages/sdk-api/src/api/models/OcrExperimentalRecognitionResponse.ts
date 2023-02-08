/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OCRResponseInvoiceReceiptData } from './OCRResponseInvoiceReceiptData';
import type { OCRResultEnum } from './OCRResultEnum';

export type OcrExperimentalRecognitionResponse = {
    /**
     * UUID of OCR service request
     */
    request_id?: string;
    /**
     * Short 1-page documents are getting processed instantly, long PDF files are getting processed via async queue
     */
    status?: OCRResultEnum;
    /**
     * True if the processed document is a PDF file with multiple pages
     */
    is_multipage_document?: boolean;
    /**
     * True if the result is not yet available and will be asynchronously processed later
     */
    is_async_request?: boolean;
    /**
     * If service process one-page document, there will be a data structure with recognized data
     */
    document_data?: OCRResponseInvoiceReceiptData;
};

