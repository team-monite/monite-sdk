/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OCRAddress } from './OCRAddress';
import type { OCRResponseInvoiceReceiptLineItem } from './OCRResponseInvoiceReceiptLineItem';

export type OCRResponseInvoiceReceiptData = {
    /**
     * Total in cents/eurocents
     */
    total?: number;
    /**
     * ISO 4217 currency code
     */
    currency?: string;
    /**
     * Counterpart name
     */
    counterpart_name?: string;
    /**
     * Counterpart address
     */
    counterpart_address?: string;
    /**
     * Invoice/receipt ID
     */
    document_id?: string;
    /**
     * Payment terms
     */
    payment_terms?: string;
    /**
     * Tax payer ID (aka VAT ID)
     */
    tax_payer_id?: string;
    /**
     * Document issuance date in ISO format
     */
    document_issued_at_date?: string;
    /**
     * Document due date in ISO format
     */
    document_due_date?: string;
    /**
     * Counterpart address as a json object compatible with counterparts service
     */
    counterpart_address_object?: OCRAddress;
    /**
     * List of line items from documen
     */
    line_items?: Array<OCRResponseInvoiceReceiptLineItem>;
};

