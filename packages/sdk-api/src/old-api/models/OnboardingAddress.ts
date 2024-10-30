/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingCountryField } from './OnboardingCountryField';
import type { OnboardingStringField } from './OnboardingStringField';

export type OnboardingAddress = {
  city?: OnboardingStringField;
  country?: OnboardingCountryField;
  line1?: OnboardingStringField;
  line2?: OnboardingStringField;
  postal_code?: OnboardingStringField;
  state?: OnboardingStringField;
};
