/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LedgerAccountResponse } from './LedgerAccountResponse';

export type LedgerAccountListResponse = {
    data: Array<LedgerAccountResponse>;
    prev_pagination_token?: string;
    next_pagination_token?: string;
};

