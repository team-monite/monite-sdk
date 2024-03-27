/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartAddress } from './CounterpartAddress';
import type { CurrencyEnum } from './CurrencyEnum';
import type { Discount } from './Discount';
import type { LineItemUpdate } from './LineItemUpdate';

/**
 * Raise if None was explicitly passed to given fields
 */
export type UpdateQuote = {
  /**
   * Unique ID of the counterpart contact.
   */
  contact_id?: string;
  /**
   * Address of invoicing, need to state as a separate fields for some countries if it differs from address of a company.
   */
  counterpart_billing_address?: CounterpartAddress;
  /**
   * Unique ID of the counterpart.
   */
  counterpart_id?: string;
  /**
   * Address where goods were shipped / where services were provided.
   */
  counterpart_shipping_address?: CounterpartAddress;
  /**
   * Counterpart VAT ID id
   */
  counterpart_vat_id_id?: string;
  currency?: CurrencyEnum;
  /**
   * The amount of tax deducted in minor units
   */
  deduction_amount?: number;
  /**
   * A note with additional information about a tax deduction
   */
  deduction_memo?: string;
  /**
   * The discount for a receivable.
   */
  discount?: Discount;
  /**
   * Entity bank account ID
   */
  entity_bank_account_id?: string;
  /**
   * Entity VAT ID id
   */
  entity_vat_id_id?: string;
  /**
   * The date (in ISO 8601 format) until which the quote is valid.
   */
  expiry_date?: string;
  line_items?: Array<LineItemUpdate>;
  /**
   * A note with additional information for a receivable
   */
  memo?: string;
  /**
   * Metadata for partner needs
   */
  partner_metadata?: Record<string, any>;
  /**
   * Unique ID of the payment terms.
   */
  payment_terms_id?: string;
  /**
   * Link for custom quote accept page
   */
  quote_accept_page_url?: string;
  vat_exempt?: boolean;
  vat_exemption_rationale?: string;
  /**
   * The amount of tax withheld in percent minor units
   */
  withholding_tax_rate?: number;
};
