/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesCounterpartAddress } from './ReceivablesCounterpartAddress';
import type { ReceivablesCurrencyEnum } from './ReceivablesCurrencyEnum';
import type { ReceivablesDiscount } from './ReceivablesDiscount';
import type { ReceivablesEntityBankAccountRequest } from './ReceivablesEntityBankAccountRequest';
import type { ReceivablesLineItem } from './ReceivablesLineItem';

export type ReceivablesReceivableFacadeCreateQuotePayload = {
    /**
     * The type of the document uploaded.
     */
    type: ReceivablesReceivableFacadeCreateQuotePayload.type;
    /**
     * The date (in ISO 8601 format) until which the quote is valid.
     */
    expiry_date?: string;
    currency: ReceivablesCurrencyEnum;
    line_items: Array<ReceivablesLineItem>;
    counterpart_id: string;
    commercial_condition_description?: string;
    entity_bank_account?: ReceivablesEntityBankAccountRequest;
    vat_exempt?: boolean;
    vat_exemption_rationale?: string;
    /**
     * A note with additional information for a receivable
     */
    memo?: string;
    /**
     * The discount for a receivable.
     */
    discount?: ReceivablesDiscount;
    /**
     * Address where goods were shipped / where services were provided.
     */
    counterpart_shipping_address?: ReceivablesCounterpartAddress;
    /**
     * Address of invoicing, need to state as a separate fields for some countries if it differs from address of a company.
     */
    counterpart_billing_address?: ReceivablesCounterpartAddress;
    /**
     * Different types of companies for different countries, ex. GmbH, SAS, SNC, etc.
     */
    counterpart_business_type?: string;
};

export namespace ReceivablesReceivableFacadeCreateQuotePayload {

    /**
     * The type of the document uploaded.
     */
    export enum type {
        QUOTE = 'quote',
    }


}

