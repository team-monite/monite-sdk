/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingError } from './OnboardingError';

export type OnboardingFloatField = {
  error?: OnboardingError | null;
  required: boolean;
  value?: number | null;
};
