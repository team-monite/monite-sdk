/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MeasureUnitEnum } from './MeasureUnitEnum';
import type { PeriodEnum } from './PeriodEnum';

export type UpdateTierPayload = {
    fee_id?: string;
    measure_unit?: MeasureUnitEnum;
    period?: PeriodEnum;
    lower_range?: number;
    higher_range?: number;
};

