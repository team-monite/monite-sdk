/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartAddress } from './CounterpartAddress';
import type { CounterpartType } from './CounterpartType';
import type { CounterpartVatIDResponse } from './CounterpartVatIDResponse';
import type { CurrencyEnum } from './CurrencyEnum';
import type { Discount } from './Discount';
import type { EntityAddressSchema } from './EntityAddressSchema';
import type { EntityBankAccount } from './EntityBankAccount';
import type { EntityVatIDResponse } from './EntityVatIDResponse';
import type { FileSchema } from './FileSchema';
import type { QuoteStateEnum } from './QuoteStateEnum';
import type { ReceivableCounterpartContact } from './ReceivableCounterpartContact';
import type { ReceivablesEntityIndividual } from './ReceivablesEntityIndividual';
import type { ReceivablesEntityOrganization } from './ReceivablesEntityOrganization';
import type { ResponseItem } from './ResponseItem';
import type { TotalVatAmountItem } from './TotalVatAmountItem';

export type QuoteResponsePayload = {
  id: string;
  /**
   * Time at which the receivable was created. Timestamps follow the ISO 8601 standard.
   */
  created_at: string;
  /**
   * Time at which the receivable was last updated. Timestamps follow the ISO 8601 standard.
   */
  updated_at: string;
  /**
   * The unique ID of a previous document related to the receivable if applicable.
   */
  based_on?: string;
  /**
   * The unique document ID of a previous document related to the receivable if applicable.
   */
  based_on_document_id?: string;
  /**
   * Field with a comment on why the client declined this Quote
   */
  comment?: string;
  /**
   * The commercial terms of the receivable (e.g. The products must be delivered in X days).
   */
  commercial_condition_description?: string;
  counterpart_address: CounterpartAddress;
  /**
   * Address of invoicing, need to state as a separate fields for some countries if it differs from address of a company.
   */
  counterpart_billing_address?: CounterpartAddress;
  /**
   * Different types of companies for different countries, ex. GmbH, SAS, SNC, etc.
   */
  counterpart_business_type?: string;
  /**
   * Additional information about counterpart contacts.
   */
  counterpart_contact?: ReceivableCounterpartContact;
  /**
   * Unique ID of the counterpart.
   */
  counterpart_id: string;
  /**
   * A legal name of a counterpart it is an organization
   */
  counterpart_name?: string;
  /**
   * Address where goods were shipped / where services were provided.
   */
  counterpart_shipping_address?: CounterpartAddress;
  /**
   * The VAT/TAX ID of the counterpart.
   */
  counterpart_tax_id?: string;
  /**
   * The type of the counterpart.
   */
  counterpart_type: CounterpartType;
  counterpart_vat_id?: CounterpartVatIDResponse;
  /**
   * The currency used in the receivable.
   */
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
   * Total price of the receivable with discounts before taxes [minor units](https://docs.monite.com/docs/currencies#minor-units).
   */
  discounted_subtotal?: number;
  /**
   * The sequential code systematically assigned to invoices.
   */
  document_id?: string;
  /**
   * Optional field representing date until which invoice should be paid
   */
  due_date?: string;
  entity: ReceivablesEntityOrganization | ReceivablesEntityIndividual;
  entity_address: EntityAddressSchema;
  entity_bank_account?: EntityBankAccount;
  /**
   * The entity user who created this document.
   */
  entity_user_id?: string;
  entity_vat_id?: EntityVatIDResponse;
  /**
   * The date (in ISO 8601 format) until which the quote is valid.
   */
  expiry_date?: string;
  file?: FileSchema;
  file_url?: string;
  /**
   * Optional field for the issue of the entry.
   */
  issue_date?: string;
  line_items: Array<ResponseItem>;
  /**
   * A note with additional information for a receivable.
   */
  memo?: string;
  /**
   * Metadata for partner needs
   */
  partner_metadata?: Record<string, any>;
  /**
   * Link for custom quote accept page
   */
  quote_accept_page_url?: string;
  /**
   * The status of the Quote inside the receivable workflow.
   */
  status: QuoteStateEnum;
  /**
   * The subtotal (excluding VAT), in [minor units](https://docs.monite.com/docs/currencies#minor-units).
   */
  subtotal?: number;
  /**
   * Total price of the receivable in [minor units](https://docs.monite.com/docs/currencies#minor-units). Calculated as a subtotal + total_vat_amount.
   */
  total_amount?: number;
  /**
   * The total VAT of all line items, in [minor units](https://docs.monite.com/docs/currencies#minor-units).
   */
  total_vat_amount: number;
  /**
   * List of total vat amount for each VAT, presented in receivable
   */
  total_vat_amounts?: Array<TotalVatAmountItem>;
  /**
   * Total price of the receivable with tax withheld in minor units
   */
  total_withholding_tax?: number;
  /**
   * The type of the document uploaded.
   */
  type: QuoteResponsePayload.type;
  /**
   * Indicates whether the goods, materials, or services listed in the receivable are exempt from VAT or not.
   */
  vat_exempt?: boolean;
  /**
   * The reason for the VAT exemption, if applicable.
   */
  vat_exemption_rationale?: string;
  /**
   * The amount of tax withheld in percent minor units
   */
  withholding_tax_rate?: number;
};

export namespace QuoteResponsePayload {
  /**
   * The type of the document uploaded.
   */
  export enum type {
    QUOTE = 'quote',
  }
}
