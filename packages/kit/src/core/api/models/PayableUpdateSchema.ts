/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

export type PayableUpdateSchema = {
    currency?: CurrencyEnum;
    amount?: number;
    description?: string;
    due_date?: string;
    issued_at?: string;
    counterpart_bank_id?: string;
    counterpart_account_id?: string;
    counterpart_name?: string;
};
