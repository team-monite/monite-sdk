/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type WebhookResponse = {
    id: string;
    attempts_before_disabling: number;
    url: string;
    response: string;
    requests_made_count: number;
    event_id: string;
    was_successful: boolean;
};

