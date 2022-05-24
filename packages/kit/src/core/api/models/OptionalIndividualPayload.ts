/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartType } from './CounterpartType';
import type { OptionalCounterpartIndividual } from './OptionalCounterpartIndividual';

/**
 * Represents counterparts that are individuals (natural persons).
 */
export type OptionalIndividualPayload = {
    /**
     * Must be "individual".
     */
    type: CounterpartType;
    individual: OptionalCounterpartIndividual;
};
