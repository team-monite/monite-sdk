/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentsPaymentsAccountType } from './PaymentsPaymentsAccountType';
import type { PaymentsPaymentsPaymentsPaymentsBankAccount } from './PaymentsPaymentsPaymentsPaymentsBankAccount';

export type PaymentsRecipientPaymentsPaymentsAccountResponse = {
    id: string;
    type: PaymentsPaymentsAccountType;
    bank_account?: PaymentsPaymentsPaymentsPaymentsBankAccount;
    name?: string;
};

