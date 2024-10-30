/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type VerificationAirwallexPlaidResponse = {
  /**
   * Client name from the request
   */
  client_name: string;
  expires_at: string;
  /**
   * Customization name from the request
   */
  link_customization_name?: string;
  /**
   * Link token that should be used to init Plaid SDK
   */
  link_token: string;
  /**
   * URL from the request
   */
  redirect_url: string;
};
