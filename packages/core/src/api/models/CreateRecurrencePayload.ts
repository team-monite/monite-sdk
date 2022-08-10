/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DayOfMonth } from './DayOfMonth';

export type CreateRecurrencePayload = {
    invoice_id: string;
    start_month: string;
    end_month: string;
    day_of_month: DayOfMonth;
};

