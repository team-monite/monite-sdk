/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { CurrencyEnum } from './CurrencyEnum';

export type OnboardingLinksBankAccount = {
  country?: AllowedCountries;
  currency?: CurrencyEnum;
  iban?: string;
  account_number?: string;
  sort_code?: string;
};
