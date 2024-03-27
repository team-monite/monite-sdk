/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CreditNoteResponsePayload } from './CreditNoteResponsePayload';
import type { InvoiceResponsePayload } from './InvoiceResponsePayload';
import type { QuoteResponsePayload } from './QuoteResponsePayload';

export type ReceivableResponse =
  | QuoteResponsePayload
  | InvoiceResponsePayload
  | CreditNoteResponsePayload;
