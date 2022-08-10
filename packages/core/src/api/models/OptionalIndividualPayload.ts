/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OptionalCounterpartIndividual } from './OptionalCounterpartIndividual';

/**
 * Represents counterparts that are individuals (natural persons).
 */
export type OptionalIndividualPayload = {
    /**
     * Must be "individual".
     */
    type: OptionalIndividualPayload.type;
    individual: OptionalCounterpartIndividual;
};

export namespace OptionalIndividualPayload {

    /**
     * Must be "individual".
     */
    export enum type {
        INDIVIDUAL = 'individual',
    }


}

