/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ReceivableCounterpartContact = {
    /**
     * The first name of the counterpart contact.
     */
    first_name: string;
    /**
     * The last name of the counterpart contact.
     */
    last_name: string;
    /**
     * The contact email of the counterpart.
     */
    email: string;
    /**
     * The contact phone number of the counterpart.
     */
    phone: string;
    /**
     * The counterpart contact title (e.g. Dr., Mr., Mrs., Ms., etc).
     */
    title?: string;
};
