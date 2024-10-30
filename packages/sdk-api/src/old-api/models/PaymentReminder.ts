/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { Reminder } from './Reminder';

export type PaymentReminder = {
  name: string;
  /**
   * Reminder to send for first payment term
   */
  term_1_reminder?: Reminder;
  /**
   * Reminder to send for second payment term
   */
  term_2_reminder?: Reminder;
  /**
   * Reminder to send for final payment term
   */
  term_final_reminder?: Reminder;
};
