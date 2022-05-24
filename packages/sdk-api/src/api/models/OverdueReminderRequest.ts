/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OverdueReminderTermRequest } from './OverdueReminderTermRequest';

export type OverdueReminderRequest = {
  name: string;
  /**
   * Overdue reminder to send for payment term
   */
  term: OverdueReminderTermRequest;
};
