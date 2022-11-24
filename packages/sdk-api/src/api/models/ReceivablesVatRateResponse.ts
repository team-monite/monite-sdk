/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesAllowedCountriesCodes } from './ReceivablesAllowedCountriesCodes';
import type { ReceivablesVatRateCreator } from './ReceivablesVatRateCreator';
import type { VatRateReceivablesStatusEnum } from './VatRateReceivablesStatusEnum';

export type ReceivablesVatRateResponse = {
    /**
     * Unique identifier of the vat rate object.
     */
    id: string;
    /**
     * Date/time when this rate was recorded in the table.
     */
    created_at: string;
    /**
     * Date/time when this rate was updated in the table.
     */
    updated_at: string;
    /**
     * Percent minor units. Example: 12.5% is 1250.
     */
    value: number;
    /**
     * Two-letter ISO country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)).
     */
    country: ReceivablesAllowedCountriesCodes;
    /**
     * Date when this rate was depreciated, after this date rate cannot be used.
     */
    valid_until?: string;
    /**
     * Date starting from when this rate can be used.
     */
    valid_from?: string;
    /**
     * Status for this vat rate: active | inactive.
     */
    status: VatRateReceivablesStatusEnum;
    /**
     * By whom this rate was recorded: monite employee | accounting system.
     */
    created_by: ReceivablesVatRateCreator;
};

