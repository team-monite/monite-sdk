/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesAllowedCountriesCodes } from './ReceivablesAllowedCountriesCodes';

export type ReceivablesVatRateResponse = {
    id: string;
    created_at: string;
    updated_at: string;
    /**
     * Percent minor units. Example: 12.5% is 1250
     */
    value: number;
    country: ReceivablesAllowedCountriesCodes;
};

