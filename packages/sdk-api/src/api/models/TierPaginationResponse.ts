/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TierResponse } from './TierResponse';

export type TierPaginationResponse = {
    /**
     * array of tiers
     */
    data: Array<TierResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};

