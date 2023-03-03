/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BankAccount } from './BankAccount';
import type { PaymentAccountType } from './PaymentAccountType';

export type AccountResponse = {
    id: string;
    type: PaymentAccountType;
    bank_accounts?: Array<BankAccount>;
};

