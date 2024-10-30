/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AirwallexMandateType } from './AirwallexMandateType';
import type { AirwallexMandateVersion } from './AirwallexMandateVersion';

export type AirwallexMandate = {
  /**
   * PDF copy of mandate will be sent to the email by Airwallex
   */
  email: string;
  /**
   * Name of the person signed the mandate, must be a bank account owner
   */
  signatory: string;
  type: AirwallexMandateType;
  version: AirwallexMandateVersion;
};
