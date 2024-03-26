/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingAddress } from './OnboardingAddress';
import type { OnboardingDateField } from './OnboardingDateField';
import type { OnboardingEmailField } from './OnboardingEmailField';
import type { OnboardingPersonRelationship } from './OnboardingPersonRelationship';
import type { OnboardingStringField } from './OnboardingStringField';

export type OnboardingPerson = {
  id: string;
  address?: OnboardingAddress;
  date_of_birth?: OnboardingDateField;
  email: OnboardingEmailField;
  first_name: OnboardingStringField;
  id_number?: OnboardingStringField;
  last_name: OnboardingStringField;
  phone?: OnboardingStringField;
  relationship: OnboardingPersonRelationship;
  ssn_last_4?: OnboardingStringField;
};
