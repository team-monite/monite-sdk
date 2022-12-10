/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountType } from './AccountType';
import type { BankAccount } from './BankAccount';

export type AccountResponse = {
    id: string;
    type: AccountType;
    bank_accounts?: Array<BankAccount>;
};

