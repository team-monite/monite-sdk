/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { EntityBankAccountResponse } from './EntityBankAccountResponse';
import type { FileSchema } from './FileSchema';
import type { IndividualSchema } from './IndividualSchema';
import type { StatusEnum } from './StatusEnum';

/**
 * A base for an entity response schema
 */
export type EntityIndividualWBankAccountResponse = {
    /**
     * An address description of the entity
     */
    address: EntityAddressSchema;
    /**
     * An official email address of the entity
     */
    email: string;
    /**
     * A phone number of the entity
     */
    phone?: string;
    /**
     * UTC datetime
     */
    created_at: string;
    /**
     * UUID entity ID
     */
    id: string;
    /**
     * A logo image of the entity
     */
    logo?: FileSchema;
    /**
     * record status, 'active' by default
     */
    status: StatusEnum;
    /**
     * UTC datetime
     */
    updated_at: string;
    bank_accounts?: Array<EntityBankAccountResponse>;
    /**
     * A type for an individual
     */
    type: 'individual';
    /**
     * A set of metadata describing an individual
     */
    individual: IndividualSchema;
};

