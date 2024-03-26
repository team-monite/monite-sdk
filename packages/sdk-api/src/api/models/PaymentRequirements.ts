/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentRequirements = {
  current_deadline?: string;
  currently_due: Array<string>;
  eventually_due: Array<string>;
  pending_verification: Array<string>;
};
