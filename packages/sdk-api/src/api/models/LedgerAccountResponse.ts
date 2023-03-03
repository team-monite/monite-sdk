/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

export type LedgerAccountResponse = {
    id: string;
    nominal_code: string;
    name: string;
    description?: string;
    type: string;
    subtype: string;
    status: string;
    current_balance: number;
    currency: CurrencyEnum;
    is_bank_account: boolean;
};

