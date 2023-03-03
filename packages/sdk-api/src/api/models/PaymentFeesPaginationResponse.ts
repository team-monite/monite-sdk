/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentFeeResponse } from './PaymentFeeResponse';

export type PaymentFeesPaginationResponse = {
    /**
     * Array of payment fees
     */
    data: Array<PaymentFeeResponse>;
    /**
     * A token that can be sent in the `pagination_token` query parameter to get the previous page of results, or `null` if there is no previous page (i.e. you've reached the first page).
     */
    prev_pagination_token?: string;
    /**
     * A token that can be sent in the `pagination_token` query parameter to get the next page of results, or `null` if there is no next page (i.e. you've reached the last page).
     */
    next_pagination_token?: string;
};

