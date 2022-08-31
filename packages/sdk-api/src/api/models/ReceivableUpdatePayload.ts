/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UpdateInvoicePayload } from './UpdateInvoicePayload';
import type { UpdateQuotePayload } from './UpdateQuotePayload';

/**
 * An abstract which provides interfaces for managing polymorphic schemas
 */
export type ReceivableUpdatePayload = (UpdateQuotePayload | UpdateInvoicePayload);

