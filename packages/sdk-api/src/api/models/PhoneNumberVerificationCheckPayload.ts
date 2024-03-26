/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PhoneNumberVerificationCheckPayload = {
  /**
   * The phone number of person attached to onboarding link
   */
  phone?: string;
  /**
   * Verification code received on phone number
   */
  code: string;
};
