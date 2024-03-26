/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CurrencyEnum } from './CurrencyEnum';
import type { OnboardingError } from './OnboardingError';

export type OnboardingCurrencyField = {
  error?: OnboardingError | null;
  required: boolean;
  value?: CurrencyEnum | null;
};
