/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentMethodRequirements = {
  current_deadline?: string;
  currently_due: Array<string>;
  eventually_due: Array<string>;
  past_due: Array<string>;
  pending_verification: Array<string>;
};
