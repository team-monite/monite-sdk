/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingCountryField } from './OnboardingCountryField';
import type { OnboardingCurrencyField } from './OnboardingCurrencyField';
import type { OnboardingStringField } from './OnboardingStringField';

export type OnboardingBankAccount = {
  id: string;
  account_holder_name?: OnboardingStringField;
  account_number?: OnboardingStringField;
  country: OnboardingCountryField;
  currency: OnboardingCurrencyField;
  iban?: OnboardingStringField;
  routing_number?: OnboardingStringField;
  sort_code?: OnboardingStringField;
};
