/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OCRAddress } from './OCRAddress';
import type { OCRResponseInvoiceReceiptLineItem } from './OCRResponseInvoiceReceiptLineItem';
import type { OCRResponsePaymentTermsPayload } from './OCRResponsePaymentTermsPayload';

export type OCRResponseInvoiceReceiptData = {
  /**
   * Total in cents/eurocents
   */
  total?: number;
  /**
   * Subtotal cents/eurocents
   */
  total_excl_vat?: number;
  /**
   * VAT amount in cents
   */
  total_vat_amount?: number;
  /**
   * VAT Percent minor units. Example: 12.5% is 1250.
   */
  total_vat_rate?: number;
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
   * Counterpart bank ID
   */
  counterpart_account_id?: string;
  /**
   * Invoice/receipt ID
   */
  document_id?: string;
  /**
   * Payment terms. Deprecated.
   */
  payment_terms?: string;
  /**
   * Payment terms parsed and calculated.
   */
  payment_terms_parsed?: OCRResponsePaymentTermsPayload;
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
   * The bank account number
   */
  counterpart_account_number?: string;
  /**
   * The bank routing number
   */
  counterpart_routing_number?: string;
  /**
   * List of line items from document
   */
  line_items?: Array<OCRResponseInvoiceReceiptLineItem>;
};
