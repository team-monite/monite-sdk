/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { EntityBankAccountRequest } from './EntityBankAccountRequest';
import type { LineItem } from './LineItem';

export type ReceivableFacadeCreateQuotePayload = {
    /**
     * The type of the document uploaded.
     */
    type: ReceivableFacadeCreateQuotePayload.type;
    /**
     * Time by which the quote is active. Timestamps follow the ISO 8601 standard.
     */
    expiry_date?: string;
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
};

export namespace ReceivableFacadeCreateQuotePayload {

    /**
     * The type of the document uploaded.
     */
    export enum type {
        QUOTE = 'quote',
    }


}

