/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartAddress } from './CounterpartAddress';
import type { CurrencyEnum } from './CurrencyEnum';
import type { Discount } from './Discount';
import type { LineItemUpdate } from './LineItemUpdate';

export type UpdateQuote = {
    currency?: CurrencyEnum;
    vat_exempt?: boolean;
    vat_exemption_rationale?: string;
    /**
     * A note with additional information for a receivable
     */
    memo?: string;
    /**
     * The discount for a receivable.
     */
    discount?: Discount;
    /**
     * Address where goods were shipped / where services were provided.
     */
    counterpart_shipping_address?: CounterpartAddress;
    /**
     * Address of invoicing, need to state as a separate fields for some countries if it differs from address of a company.
     */
    counterpart_billing_address?: CounterpartAddress;
    line_items?: Array<LineItemUpdate>;
    /**
     * Unique ID of the counterpart.
     */
    counterpart_id?: string;
    /**
     * Unique ID of the counterpart contact.
     */
    contact_id?: string;
    /**
     * Unique ID of the payment terms.
     */
    payment_terms_id?: string;
    /**
     * The date (in ISO 8601 format) until which the quote is valid.
     */
    expiry_date?: string;
};

