/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { BankAccountVerificationType } from './BankAccountVerificationType';
import type { VerificationAirwallexPlaidRequest } from './VerificationAirwallexPlaidRequest';

export type VerificationRequest = {
  airwallex_plaid: VerificationAirwallexPlaidRequest;
  type: BankAccountVerificationType;
};
