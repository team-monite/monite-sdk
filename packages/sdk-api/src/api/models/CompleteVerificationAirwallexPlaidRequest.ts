/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AirwallexMandate } from './AirwallexMandate';
import type { AirwallexPlaidAccount } from './AirwallexPlaidAccount';
import type { AirwallexPlaidInstitution } from './AirwallexPlaidInstitution';

export type CompleteVerificationAirwallexPlaidRequest = {
  /**
   * The bank account that was selected in the Plaid Modal
   */
  account: AirwallexPlaidAccount;
  /**
   * The financial institution that was selected in the Plaid Modal
   */
  institution: AirwallexPlaidInstitution;
  mandate: AirwallexMandate;
  /**
   * The Plaid Public Token
   */
  public_token: string;
};
