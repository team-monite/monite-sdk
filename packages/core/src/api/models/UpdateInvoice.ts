/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

export type UpdateInvoice = {
    currency?: CurrencyEnum;
    counterpart_id?: string;
    vat_exempt?: boolean;
    vat_exemption_rationale?: string;
    payment_terms_id?: string;
};
