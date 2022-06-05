/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartUpdateAddress } from './CounterpartUpdateAddress';

/**
 * Represents counterparts that are organizations (juridical persons).
 */
export type OptionalCounterpartUpdateOrganization = {
    /**
     * The legal name of the organization.
     */
    legal_name?: string;
    /**
     * The VAT number of the organization.
     */
    vat_number?: string;
    /**
     * Indicates if the counterpart is a vendor.
     */
    is_vendor?: boolean;
    /**
     * Indicates if the counterpart is a customer.
     */
    is_customer?: boolean;
    /**
     * The phone number of the organization.
     */
    phone?: string;
    /**
     * The email address of the organization.
     */
    email?: string;
    /**
     * The address of the organization.
     */
    registered_address?: CounterpartUpdateAddress;
};
