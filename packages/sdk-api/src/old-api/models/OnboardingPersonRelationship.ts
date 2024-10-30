/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingFloatField } from './OnboardingFloatField';
import type { OnboardingStringField } from './OnboardingStringField';

export type OnboardingPersonRelationship = {
  director: boolean;
  executive: boolean;
  owner: boolean;
  percent_ownership?: OnboardingFloatField;
  representative: boolean;
  title?: OnboardingStringField;
};
