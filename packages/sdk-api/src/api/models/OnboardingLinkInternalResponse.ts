/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { Provider } from './Provider';

export type OnboardingLinkInternalResponse = {
  refresh_url: string;
  return_url: string;
  expires_at: string;
  id: string;
  entity_id: string;
  url: string;
  partner_id: string;
  project_id: string;
  provider: Provider;
  phone?: string;
  is_exhausted: boolean;
};
