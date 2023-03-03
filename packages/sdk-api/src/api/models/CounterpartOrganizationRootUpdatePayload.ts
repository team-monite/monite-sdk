/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartOrganizationUpdatePayload } from './CounterpartOrganizationUpdatePayload';

/**
 * Represents counterparts that are organizations (juridical persons).
 */
export type CounterpartOrganizationRootUpdatePayload = {
    /**
     * Must be "organization".
     */
    type: CounterpartOrganizationRootUpdatePayload.type;
    organization: CounterpartOrganizationUpdatePayload;
    /**
     * `true` if the counterpart was created automatically by Monite when processing incoming invoices with OCR. `false` if the counterpart was created by the API client.
     */
    created_automatically?: boolean;
    reminders_enabled?: boolean;
};

export namespace CounterpartOrganizationRootUpdatePayload {

    /**
     * Must be "organization".
     */
    export enum type {
        ORGANIZATION = 'organization',
    }


}

