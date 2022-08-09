/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartOrganization } from './CounterpartOrganization';

/**
 * This schema is used to create counterparts that are organizations (juridical persons).
 */
export type CounterpartCreateOrganizationPayload = {
    /**
     * Must be "organization".
     */
    type: CounterpartCreateOrganizationPayload.type;
    organization: CounterpartOrganization;
};

export namespace CounterpartCreateOrganizationPayload {

    /**
     * Must be "organization".
     */
    export enum type {
        ORGANIZATION = 'organization',
    }


}

