/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type VerificationAirwallexPlaidRequest = {
  /**
   * The name of your application to be displayed in Plaid Modal
   */
  client_name: string;
  /**
   * The name of the Link customization configured on the Plaid Dashboard. If not specified, the default customization will be applied
   */
  link_customization_name?: string;
  /**
   * URL to handle the OAuth verification flow
   */
  redirect_url: string;
};
