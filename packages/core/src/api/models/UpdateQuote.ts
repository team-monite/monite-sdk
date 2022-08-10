/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

export type UpdateQuote = {
    currency?: CurrencyEnum;
    counterpart_id?: string;
    vat_exempt?: boolean;
    vat_exemption_rationale?: string;
    /**
     * A note with additional information for a receivable
     */
    memo?: string;
    /**
     * Time by which the quote is active. Timestamps follow the ISO 8601 standard.
     */
    expiry_date?: string;
};

