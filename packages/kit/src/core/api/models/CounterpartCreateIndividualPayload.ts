/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartIndividual } from './CounterpartIndividual';
import type { CounterpartType } from './CounterpartType';

/**
 * This schema is used to create counterparts that are individuals (natural persons).
 */
export type CounterpartCreateIndividualPayload = {
    /**
     * Must be "individual".
     */
    type: CounterpartType;
    individual: CounterpartIndividual;
};
