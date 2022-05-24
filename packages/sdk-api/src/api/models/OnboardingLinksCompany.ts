/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingLinksAddress } from './OnboardingLinksAddress';

export type OnboardingLinksCompany = {
  name?: string;
  tax_id?: string;
  address?: OnboardingLinksAddress;
  phone?: string;
  email?: string;
  representative_provided?: boolean;
  owners_provided?: boolean;
  directors_provided?: boolean;
  executives_provided?: boolean;
};
