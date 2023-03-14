/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartOrganizationResponse } from './CounterpartOrganizationResponse';
import type { CounterpartType } from './CounterpartType';

/**
 * Represents counterparts that are organizations (juridical persons).
 */
export type CounterpartOrganizationRootResponse = {
    /**
     * Unique ID of the counterpart.
     */
    id: string;
    /**
     * Date and time when the counterpart was created. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
     */
    created_at: string;
    /**
     * Date and time when the counterpart was last updated. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
     */
    updated_at: string;
    /**
     * The counterpart type: `organization` (juridical person) or `individual` (natural person).
     */
    type: CounterpartType;
    /**
     * `true` if the counterpart was created automatically by Monite when processing incoming invoices with OCR. `false` if the counterpart was created by the API client.
     */
    created_automatically?: boolean;
    reminders_enabled?: boolean;
    organization: CounterpartOrganizationResponse;
};

