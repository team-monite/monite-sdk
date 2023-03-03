/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BankAccount } from './BankAccount';
import type { PaymentAccountType } from './PaymentAccountType';

export type RecipientAccountResponse = {
    id: string;
    type: PaymentAccountType;
    bank_accounts?: Array<BankAccount>;
    name?: string;
};

