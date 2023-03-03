/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartIndividualUpdatePayload } from './CounterpartIndividualUpdatePayload';

/**
 * Represents counterparts that are individuals (natural persons).
 */
export type CounterpartIndividualRootUpdatePayload = {
    /**
     * Must be "individual".
     */
    type: CounterpartIndividualRootUpdatePayload.type;
    individual: CounterpartIndividualUpdatePayload;
    /**
     * `true` if the counterpart was created automatically by Monite when processing incoming invoices with OCR. `false` if the counterpart was created by the API client.
     */
    created_automatically?: boolean;
    reminders_enabled?: boolean;
};

export namespace CounterpartIndividualRootUpdatePayload {

    /**
     * Must be "individual".
     */
    export enum type {
        INDIVIDUAL = 'individual',
    }


}

