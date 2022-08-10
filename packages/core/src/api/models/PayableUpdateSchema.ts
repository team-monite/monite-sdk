/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { PaymentTermsCreatePayload } from './PaymentTermsCreatePayload';
import type { SuggestedPaymentTerm } from './SuggestedPaymentTerm';

/**
 * This schema is used to update the data of an existing payable.
 */
export type PayableUpdateSchema = {
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
     * The number of days to pay with potential discount for options shorter than due_date
     */
    payment_terms?: PaymentTermsCreatePayload;
    /**
     * The suggested date and corresponding discount in which payable could be paid. The date is in the YYYY-MM-DD format. The discount is calculated as X * (10^-4) - for example, 100 is 1%, 25 is 0,25%, 10000 is 100 %. Date varies depending on the payment terms and may even be equal to the due date with discount 0.
     */
    suggested_payment_term?: SuggestedPaymentTerm;
    /**
     * The date when the payable was issued, in the YYYY-MM-DD format.
     */
    issued_at?: string;
    /**
     * SWIFT code (BIC) of the vendor's bank.
     */
    counterpart_bank_id?: string;
    /**
     * The ID of the counterpart object that represents the vendor or supplier.
     */
    counterpart_id?: string;
    /**
     * Vendor's bank account number, IBAN, or similar.
     */
    counterpart_account_id?: string;
    /**
     * Vendor or supplier name.
     */
    counterpart_name?: string;
    /**
     * A list of IDs of user-defined tags (labels) assigned to this payable. Tags can be used to trigger a specific approval policy for this payable.
     */
    tag_ids?: Array<string>;
};

