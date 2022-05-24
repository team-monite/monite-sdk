/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EntityBankAccountResponse = {
    id: string;
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
    was_created_by_user_id?: string;
};
