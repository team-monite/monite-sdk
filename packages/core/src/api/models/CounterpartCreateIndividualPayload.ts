/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartIndividual } from './CounterpartIndividual';

/**
 * This schema is used to create counterparts that are individuals (natural persons).
 */
export type CounterpartCreateIndividualPayload = {
    /**
     * Must be "individual".
     */
    type: CounterpartCreateIndividualPayload.type;
    individual: CounterpartIndividual;
};

export namespace CounterpartCreateIndividualPayload {

    /**
     * Must be "individual".
     */
    export enum type {
        INDIVIDUAL = 'individual',
    }


}

