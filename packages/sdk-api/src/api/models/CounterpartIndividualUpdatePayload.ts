/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents counterparts that are individuals (natural persons).
 */
export type CounterpartIndividualUpdatePayload = {
    /**
     * The person's first name.
     */
    first_name?: string;
    /**
     * The person's last name.
     */
    last_name?: string;
    /**
     * The person's title or honorific. Examples: Mr., Ms., Dr., Prof.
     */
    title?: string;
    /**
     * Indicates if the counterpart is a vendor.
     */
    is_vendor?: boolean;
    /**
     * Indicates if the counterpart is a customer.
     */
    is_customer?: boolean;
    /**
     * The person's phone number.
     */
    phone?: string;
    /**
     * The person's email address.
     */
    email?: string;
};

