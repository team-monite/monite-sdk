/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartAddress } from './CounterpartAddress';
import type { CurrencyEnum } from './CurrencyEnum';
import type { Discount } from './Discount';
import type { EntityBankAccountRequest } from './EntityBankAccountRequest';
import type { LineItem } from './LineItem';

export type ReceivableFacadeCreateQuotePayload = {
    /**
     * The type of the document uploaded.
     */
    type: ReceivableFacadeCreateQuotePayload.type;
    /**
     * The date (in ISO 8601 format) until which the quote is valid.
     */
    expiry_date?: string;
    /**
     * Link for custom quote accept page
     */
    quote_accept_page_url?: string;
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
};

export namespace ReceivableFacadeCreateQuotePayload {

    /**
     * The type of the document uploaded.
     */
    export enum type {
        QUOTE = 'quote',
    }


}

