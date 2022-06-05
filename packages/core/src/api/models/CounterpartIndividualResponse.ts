/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartIndividual } from './CounterpartIndividual';
import type { CounterpartType } from './CounterpartType';

/**
 * Represents counterparts that are individuals (natural persons).
 */
export type CounterpartIndividualResponse = {
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
    individual: CounterpartIndividual;
};
