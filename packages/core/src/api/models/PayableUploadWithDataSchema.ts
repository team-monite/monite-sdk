/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

/**
 * This schema is used to create a new payable by providing its data along with the original file.
 */
export type PayableUploadWithDataSchema = {
    /**
     * The [currency code](https://docs.monite.com/docs/currencies) of the currency used in the payable.
     */
    currency?: CurrencyEnum;
    /**
     * The total amount to be paid, in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
     */
    amount?: number;
    /**
     * An arbitrary description of this payable.
     */
    description?: string;
    /**
     * The date by which the payable must be paid, in the YYYY-MM-DD format. If the payable specifies payment terms with early payment discounts, this is the final payment date.
     */
    due_date?: string;
    /**
     * The date when the payable was issued, in the YYYY-MM-DD format.
     */
    issued_at?: string;
    /**
     * SWIFT code (BIC) of the vendor's bank.
     */
    counterpart_bank_id?: string;
    /**
     * Vendor's bank account number, IBAN, or similar.
     */
    counterpart_account_id?: string;
    /**
     * Vendor or supplier name.
     */
    counterpart_name?: string;
    /**
     * Base64-encoded contents of the original issued payable. The file is provided for reference purposes as the original source of the data.
     *
     * Any file formats are allowed. The most common formats are PDF, PNG, JPG, GIF.
     */
    base64_encoded_file: string;
};
