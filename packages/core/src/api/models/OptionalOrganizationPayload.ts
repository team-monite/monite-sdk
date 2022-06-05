/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartType } from './CounterpartType';
import type { OptionalCounterpartUpdateOrganization } from './OptionalCounterpartUpdateOrganization';

/**
 * Represents counterparts that are organizations (juridical persons).
 */
export type OptionalOrganizationPayload = {
    /**
     * Must be "organization".
     */
    type: CounterpartType;
    organization: OptionalCounterpartUpdateOrganization;
};
