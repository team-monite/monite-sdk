/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DayOfMonth } from './DayOfMonth';

export type CreateRecurrencePayload = {
    invoice_id: string;
    start_year: number;
    start_month: number;
    end_year: number;
    end_month: number;
    day_of_month: DayOfMonth;
};

