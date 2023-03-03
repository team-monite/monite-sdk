/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartAddress } from './CounterpartAddress';
import type { CurrencyEnum } from './CurrencyEnum';
import type { Discount } from './Discount';
import type { EntityBankAccountRequest } from './EntityBankAccountRequest';
import type { LineItem } from './LineItem';

export type ReceivableFacadeCreateInvoicePayload = {
    /**
     * The type of the document uploaded.
     */
    type: ReceivableFacadeCreateInvoicePayload.type;
    /**
     * The date when the goods are shipped or the service is provided.
     *
     * If omitted, defaults to the invoice issue date,
     * and the value is automatically set when the invoice status changes to `issued`.
     */
    fulfillment_date?: string;
    currency: CurrencyEnum;
    line_items: Array<LineItem>;
    counterpart_id: string;
    commercial_condition_description?: string;
    entity_bank_account?: EntityBankAccountRequest;
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
    /**
     * Different types of companies for different countries, ex. GmbH, SAS, SNC, etc.
     */
    counterpart_business_type?: string;
    payment_terms_id?: string;
    payment_reminder_id?: string;
    overdue_reminder_id?: string;
    /**
     * Contain purchase order number.
     */
    purchase_order?: string;
};

export namespace ReceivableFacadeCreateInvoicePayload {

    /**
     * The type of the document uploaded.
     */
    export enum type {
        INVOICE = 'invoice',
    }


}

