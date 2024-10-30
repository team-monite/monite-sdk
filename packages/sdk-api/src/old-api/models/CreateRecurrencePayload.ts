/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DayOfMonth } from './DayOfMonth';

export type CreateRecurrencePayload = {
  day_of_month: DayOfMonth;
  end_month: number;
  end_year: number;
  invoice_id: string;
  start_month: number;
  start_year: number;
};
