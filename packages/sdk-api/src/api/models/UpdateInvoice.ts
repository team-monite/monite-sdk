/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartAddress } from './CounterpartAddress';
import type { CurrencyEnum } from './CurrencyEnum';
import type { Discount } from './Discount';
import type { LineItemUpdate } from './LineItemUpdate';

export type UpdateInvoice = {
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
    payment_terms_id?: string;
    payment_reminder_id?: string;
    overdue_reminder_id?: string;
    /**
     * The date when the goods are shipped or the service is provided.
     *
     * If omitted, defaults to the invoice issue date,
     * and the value is automatically set when the invoice status changes to `issued`.
     */
    fulfillment_date?: string;
};

