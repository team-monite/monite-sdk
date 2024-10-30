/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { OnboardingError } from './OnboardingError';

export type OnboardingCountryField = {
  error?: OnboardingError | null;
  required: boolean;
  value?: AllowedCountries | null;
};
