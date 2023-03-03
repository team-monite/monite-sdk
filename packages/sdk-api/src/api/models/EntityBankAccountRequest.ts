/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EntityBankAccountRequest = {
    /**
     * The IBAN of the entity’s bank account.
     */
    iban: string;
    /**
     * The BIC of the entity’s bank account.
     */
    bic: string;
    /**
     * The name of the entity’s bank account.
     */
    bank_name: string;
    display_name?: string;
    /**
     * Marks if a bank account should be used by default. Only 1 can be True
     */
    is_default?: boolean;
};

