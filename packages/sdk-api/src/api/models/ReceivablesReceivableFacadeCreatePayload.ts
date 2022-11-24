/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivableCreateBasedOnPayload } from './ReceivableCreateBasedOnPayload';
import type { ReceivablesReceivableFacadeCreateInvoicePayload } from './ReceivablesReceivableFacadeCreateInvoicePayload';
import type { ReceivablesReceivableFacadeCreateQuotePayload } from './ReceivablesReceivableFacadeCreateQuotePayload';

export type ReceivablesReceivableFacadeCreatePayload = (ReceivablesReceivableFacadeCreateQuotePayload | ReceivablesReceivableFacadeCreateInvoicePayload | ReceivableCreateBasedOnPayload);

