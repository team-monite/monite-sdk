/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { BankAccountVerificationType } from './BankAccountVerificationType';
import type { CompleteVerificationAirwallexPlaidRequest } from './CompleteVerificationAirwallexPlaidRequest';

export type CompleteVerificationRequest = {
  airwallex_plaid: CompleteVerificationAirwallexPlaidRequest;
  type: BankAccountVerificationType;
};
