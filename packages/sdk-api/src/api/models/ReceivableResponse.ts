/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesCreditNoteResponsePayload } from './ReceivablesCreditNoteResponsePayload';
import type { ReceivablesInvoiceResponsePayload } from './ReceivablesInvoiceResponsePayload';
import type { ReceivablesQuoteResponsePayload } from './ReceivablesQuoteResponsePayload';

export type ReceivableResponse =
  | ReceivablesQuoteResponsePayload
  | ReceivablesInvoiceResponsePayload
  | ReceivablesCreditNoteResponsePayload;
