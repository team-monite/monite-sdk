/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { StatusEnum } from './StatusEnum';

export type TransactionResponse = {
    /**
     * UUID transaction ID
     */
    id: string;
    /**
     * Record status, 'active' by default
     */
    status: StatusEnum;
    /**
     * Currency code: EUR by default
     */
    currency: CurrencyEnum;
    /**
     * Transaction amount in cents/eurocents
     */
    amount: number;
    /**
     * Description of payment
     */
    description: string;
    /**
     * Local date when transaction was executed
     */
    transaction_date: string;
    /**
     * Optional UTC date and time when transaction was executed
     */
    transaction_date_utc: string;
    /**
     * Our API partners also have their internal IDs for transactions. This field is allowing the to map our transactions to theirs
     */
    internal_api_partner_transaction_id: string;
    /**
     * Additional information if transaction was made via plastic card
     */
    card_details_string: string;
    /**
     * BIC or SWIFT
     */
    entity_bank_id: string;
    /**
     * IBAN or other bank account ID
     */
    entity_account_id: string;
    /**
     * Counterpart BIC of SWIFT
     */
    counterpart_bank_id: string;
    /**
     * IBAN or similar
     */
    counterpart_account_id: string;
    was_created_by_user_name: string;
    was_created_by_user_id: string;
    /**
     * UTC datetime
     */
    created_at: string;
    /**
     * UTC datetime
     */
    updated_at: string;
};
