/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { BankAccount } from './BankAccount';
import type { PaymentAccountType } from './PaymentAccountType';

export type AccountResponse = {
  id: string;
  bank_accounts?: Array<BankAccount>;
  type: PaymentAccountType;
};
