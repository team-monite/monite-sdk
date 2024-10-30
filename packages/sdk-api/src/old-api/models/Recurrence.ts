/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DayOfMonth } from './DayOfMonth';
import type { RecurrenceIteration } from './RecurrenceIteration';
import type { RecurrenceStatus } from './RecurrenceStatus';

export type Recurrence = {
  id: string;
  /**
   * Time at which the receivable was created. Timestamps follow the ISO 8601 standard.
   */
  created_at: string;
  /**
   * Time at which the receivable was last updated. Timestamps follow the ISO 8601 standard.
   */
  updated_at: string;
  current_iteration: number;
  day_of_month: DayOfMonth;
  end_month: number;
  end_year: number;
  invoice_id: string;
  iterations: Array<RecurrenceIteration>;
  start_month: number;
  start_year: number;
  status: RecurrenceStatus;
};
