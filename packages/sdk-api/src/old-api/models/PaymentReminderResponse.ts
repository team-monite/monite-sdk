/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { Reminder } from './Reminder';
import type { StatusEnum } from './StatusEnum';

export type PaymentReminderResponse = {
  id: string;
  /**
   * Time at which the PaymentReminder was created. Timestamps follow the ISO 8601 standard.
   */
  created_at: string;
  /**
   * Time at which the PaymentReminder was last updated. Timestamps follow the ISO 8601 standard.
   */
  updated_at: string;
  entity_id: string;
  name: string;
  status: StatusEnum;
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
