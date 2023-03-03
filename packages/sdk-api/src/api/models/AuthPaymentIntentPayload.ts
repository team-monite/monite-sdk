/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountIdentification } from './AccountIdentification';

export type AuthPaymentIntentPayload = {
    bank_id: string;
    payer_account_identification: AccountIdentification;
};

