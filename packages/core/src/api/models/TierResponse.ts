/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FeeResponse } from './FeeResponse';
import type { MeasureUnitEnum } from './MeasureUnitEnum';
import type { PeriodEnum } from './PeriodEnum';

export type TierResponse = {
    id: string;
    oid: number;
    fee: FeeResponse;
    measure_unit: MeasureUnitEnum;
    period: PeriodEnum;
    lower_range: number;
    higher_range: number;
    created_at: string;
    updated_at: string;
};

