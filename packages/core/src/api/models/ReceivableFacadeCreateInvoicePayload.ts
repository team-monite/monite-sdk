/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { api__schemas__accounts_receivables__receivables__LineItem } from './api__schemas__accounts_receivables__receivables__LineItem';
import type { CurrencyEnum } from './CurrencyEnum';
import type { EntityBankAccountRequest } from './EntityBankAccountRequest';

export type ReceivableFacadeCreateInvoicePayload = {
    /**
     * The type of the document uploaded.
     */
    type: ReceivableFacadeCreateInvoicePayload.type;
    currency: CurrencyEnum;
    line_items: Array<api__schemas__accounts_receivables__receivables__LineItem>;
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
};

export namespace ReceivableFacadeCreateInvoicePayload {

    /**
     * The type of the document uploaded.
     */
    export enum type {
        INVOICE = 'invoice',
    }


}
