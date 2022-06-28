/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

export type UpdateInvoice = {
    currency?: CurrencyEnum;
    counterpart_id?: string;
    vat_exempt?: boolean;
    vat_exemption_rationale?: string;
    /**
     * A note with additional information for a receivable
     */
    memo?: string;
    payment_terms_id?: string;
};
