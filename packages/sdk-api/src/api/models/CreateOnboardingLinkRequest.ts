/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { Recipient } from './Recipient';

export type CreateOnboardingLinkRequest = {
  recipient: Recipient;
  refresh_url: string;
  return_url: string;
};
