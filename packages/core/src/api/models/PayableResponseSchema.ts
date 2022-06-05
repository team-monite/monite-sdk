/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyExchangeSchema } from './CurrencyExchangeSchema';
import type { PayableOriginEnum } from './PayableOriginEnum';
import type { PayableStateEnum } from './PayableStateEnum';

export type PayableResponseSchema = {
    id: string;
    entity_id: string;
    status: PayableStateEnum;
    source_of_payable_data: string;
    currency?: string;
    amount?: number;
    description?: string;
    due_date?: string;
    issued_at?: string;
    counterpart_bank_id?: string;
    counterpart_account_id?: string;
    counterpart_name?: string;
    payable_origin: PayableOriginEnum;
    was_created_by_external_user_name?: string;
    was_created_by_external_user_id?: string;
    currency_exchange?: CurrencyExchangeSchema;
    created_at: string;
    updated_at: string;
};
