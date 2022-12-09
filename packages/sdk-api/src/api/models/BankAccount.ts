/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BankAccount = {
    id: string;
    iban?: string;
    bic?: string;
    /**
     * Display name of a bank account
     */
    name?: string;
    is_default?: boolean;
};

