/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartOrganization } from './CounterpartOrganization';
import type { CounterpartType } from './CounterpartType';

/**
 * This schema is used to create counterparts that are organizations (juridical persons).
 */
export type CounterpartCreateOrganizationPayload = {
    /**
     * Must be "organization".
     */
    type: CounterpartType;
    organization: CounterpartOrganization;
};
