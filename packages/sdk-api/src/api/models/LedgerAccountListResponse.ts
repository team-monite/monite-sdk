/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { LedgerAccountResponse } from './LedgerAccountResponse';

export type LedgerAccountListResponse = {
  data: Array<LedgerAccountResponse>;
  next_pagination_token?: string;
  prev_pagination_token?: string;
};
