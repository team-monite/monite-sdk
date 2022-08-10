/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DayOfMonth } from './DayOfMonth';
import type { RecurrenceIteration } from './RecurrenceIteration';
import type { RecurrenceStatus } from './RecurrenceStatus';

export type Recurrence = {
    invoice_id: string;
    start_month: string;
    end_month: string;
    day_of_month: DayOfMonth;
    id: string;
    /**
     * Time at which the receivable was created. Timestamps follow the ISO 8601 standard.
     */
    created_at: string;
    /**
     * Time at which the receivable was last updated. Timestamps follow the ISO 8601 standard.
     */
    updated_at: string;
    iterations: Array<RecurrenceIteration>;
    status: RecurrenceStatus;
    current_iteration: number;
};

