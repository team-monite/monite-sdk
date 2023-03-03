/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UpdateCreditNotePayload } from './UpdateCreditNotePayload';
import type { UpdateInvoicePayload } from './UpdateInvoicePayload';
import type { UpdateIssuedInvoicePayload } from './UpdateIssuedInvoicePayload';
import type { UpdateQuotePayload } from './UpdateQuotePayload';

export type ReceivableUpdatePayload = (UpdateQuotePayload | UpdateInvoicePayload | UpdateCreditNotePayload | UpdateIssuedInvoicePayload);

