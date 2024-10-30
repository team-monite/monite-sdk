/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';

export type OnboardingLinksAddress = {
  country?: AllowedCountries;
  line1?: string;
  line2?: string;
  postal_code?: string;
  city?: string;
  state?: string;
};
