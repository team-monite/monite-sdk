/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TaxIDTypeEnum } from './TaxIDTypeEnum';

export type CounterpartTaxIDResponse = {
    type?: TaxIDTypeEnum;
    value: string;
    id: string;
    counterpart_id: string;
};

