/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingDateField } from './OnboardingDateField';
import type { OnboardingStringField } from './OnboardingStringField';

export type OnboardingEntityIndividual = {
  date_of_birth?: OnboardingDateField;
  first_name?: OnboardingStringField;
  id_number?: OnboardingStringField;
  last_name?: OnboardingStringField;
  ssn_last_4?: OnboardingStringField;
  title?: OnboardingStringField;
};
