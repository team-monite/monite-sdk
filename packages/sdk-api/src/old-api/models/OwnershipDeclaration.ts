/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OwnershipDeclaration = {
  /**
   * The date and time (in the ISO 8601 format) when the beneficial owner attestation was made.
   */
  date?: string;
  /**
   * The IP address from which the beneficial owner attestation was made. If omitted or set to `null` in the request, the IP address is inferred from the request origin or the `X-Forwarded-For` request header.
   */
  ip?: string;
};
