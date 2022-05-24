/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AccountIdentification } from './AccountIdentification';
import type { YapilyCountriesCoverageCodes } from './YapilyCountriesCoverageCodes';

export type AuthPaymentIntentPayload = {
  bank_id: string;
  payer_account_country?: YapilyCountriesCoverageCodes;
  payer_account_holder_name?: string;
  payer_account_identification: AccountIdentification;
};
