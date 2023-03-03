/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RemindersSettings = {
    enabled?: boolean;
    /**
     * Counterparts UUID's for which reminders will be turned off
     */
    excluded_counterpart_ids?: Array<string>;
};

