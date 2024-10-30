/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CurrencyEnum } from './CurrencyEnum';

export type LedgerAccountResponse = {
  id: string;
  currency: CurrencyEnum;
  current_balance?: number;
  description?: string;
  is_bank_account: boolean;
  name: string;
  nominal_code?: string;
  status: string;
  subtype?: string;
  type: string;
};
