/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OverdueReminderTermResponse } from './OverdueReminderTermResponse';

export type OverdueReminderResponse = {
    name: string;
    /**
     * Overdue reminder to send for payment term
     */
    term: OverdueReminderTermResponse;
    id: string;
    /**
     * Time at which the OverdueReminder was created. Timestamps follow the ISO 8601 standard.
     */
    created_at: string;
    /**
     * Time at which the OverdueReminder was last updated. Timestamps follow the ISO 8601 standard.
     */
    updated_at: string;
};

