/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { LabelNValue } from './LabelNValue';

/**
 * Contains information about all text blocks extracted from an uploaded invoice by OCR.
 * The text blocks are grouped into `line_items` (invoice line items) and `summary` (all other information).
 * Legacy schema used for AWS textract recognition.
 */
export type OcrRecognitionResponse = {
  /**
   * Invoice text content other than the line items. Such as the invoice issue and due dates, vendor name and address, and other general information.
   */
  summary?: Array<LabelNValue>;
  /**
   * Text content of the invoice line items as recognized by OCR.
   */
  line_items?: Array<LabelNValue>;
};
