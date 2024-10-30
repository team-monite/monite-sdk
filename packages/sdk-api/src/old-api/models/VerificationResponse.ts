/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { BankAccountVerificationType } from './BankAccountVerificationType';
import type { VerificationAirwallexPlaidResponse } from './VerificationAirwallexPlaidResponse';

export type VerificationResponse = {
  airwallex_plaid: VerificationAirwallexPlaidResponse;
  type: BankAccountVerificationType;
};
