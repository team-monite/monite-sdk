/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartAddress } from './CounterpartAddress';
import type { CurrencyEnum } from './CurrencyEnum';
import type { Discount } from './Discount';
import type { LineItem } from './LineItem';

export type ReceivableFacadeCreateInvoicePayload = {
  commercial_condition_description?: string;
  /**
   * Address of invoicing, need to state as a separate fields for some countries if it differs from address of a company.
   */
  counterpart_billing_address?: CounterpartAddress;
  /**
   * Different types of companies for different countries, ex. GmbH, SAS, SNC, etc.
   */
  counterpart_business_type?: string;
  counterpart_id: string;
  /**
   * Address where goods were shipped / where services were provided.
   */
  counterpart_shipping_address?: CounterpartAddress;
  /**
   * Counterpart VAT ID id
   */
  counterpart_vat_id_id?: string;
  currency: CurrencyEnum;
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
   * The date when the goods are shipped or the service is provided.
   *
   * If omitted, defaults to the invoice issue date,
   * and the value is automatically set when the invoice status changes to `issued`.
   */
  fulfillment_date?: string;
  line_items: Array<LineItem>;
  /**
   * A note with additional information for a receivable
   */
  memo?: string;
  overdue_reminder_id?: string;
  /**
   * Metadata for partner needs
   */
  partner_metadata?: Record<string, any>;
  /**
   * Link for custom invoice payment page.
   */
  payment_page_url?: string;
  payment_reminder_id?: string;
  payment_terms_id?: string;
  /**
   * Contain purchase order number.
   */
  purchase_order?: string;
  /**
   * The type of the document uploaded.
   */
  type: ReceivableFacadeCreateInvoicePayload.type;
  vat_exempt?: boolean;
  vat_exemption_rationale?: string;
  /**
   * The amount of tax withheld in percent minor units
   */
  withholding_tax_rate?: number;
};

export namespace ReceivableFacadeCreateInvoicePayload {
  /**
   * The type of the document uploaded.
   */
  export enum type {
    INVOICE = 'invoice',
  }
}
