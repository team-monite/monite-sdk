/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingError } from './OnboardingError';

export type OnboardingStringField = {
  error?: OnboardingError | null;
  required: boolean;
  value?: string | null;
};
