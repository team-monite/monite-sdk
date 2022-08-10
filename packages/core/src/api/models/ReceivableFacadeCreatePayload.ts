/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivableCreateBasedOnPayload } from './ReceivableCreateBasedOnPayload';
import type { ReceivableFacadeCreateInvoicePayload } from './ReceivableFacadeCreateInvoicePayload';
import type { ReceivableFacadeCreateQuotePayload } from './ReceivableFacadeCreateQuotePayload';

export type ReceivableFacadeCreatePayload = (ReceivableFacadeCreateQuotePayload | ReceivableFacadeCreateInvoicePayload | ReceivableCreateBasedOnPayload);

