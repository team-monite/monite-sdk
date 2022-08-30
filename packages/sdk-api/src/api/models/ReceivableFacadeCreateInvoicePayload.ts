/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { EntityBankAccountRequest } from './EntityBankAccountRequest';
import type { LineItem } from './LineItem';

export type ReceivableFacadeCreateInvoicePayload = {
    /**
     * The type of the document uploaded.
     */
    type: ReceivableFacadeCreateInvoicePayload.type;
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
    payment_terms_id?: string;
    payment_reminder_id?: string;
};

export namespace ReceivableFacadeCreateInvoicePayload {

    /**
     * The type of the document uploaded.
     */
    export enum type {
        INVOICE = 'invoice',
    }


}

