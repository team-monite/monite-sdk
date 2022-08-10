/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OptionalCounterpartUpdateOrganization } from './OptionalCounterpartUpdateOrganization';

/**
 * Represents counterparts that are organizations (juridical persons).
 */
export type OptionalOrganizationPayload = {
    /**
     * Must be "organization".
     */
    type: OptionalOrganizationPayload.type;
    organization: OptionalCounterpartUpdateOrganization;
};

export namespace OptionalOrganizationPayload {

    /**
     * Must be "organization".
     */
    export enum type {
        ORGANIZATION = 'organization',
    }


}

