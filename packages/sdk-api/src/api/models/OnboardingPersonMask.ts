/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingPersonAddressMask } from './OnboardingPersonAddressMask';
import type { OnboardingPersonRelationshipMask } from './OnboardingPersonRelationshipMask';

export type OnboardingPersonMask = {
  address?: OnboardingPersonAddressMask;
  date_of_birth?: boolean;
  email?: boolean;
  first_name?: boolean;
  id_number?: boolean;
  last_name?: boolean;
  phone?: boolean;
  relationship: OnboardingPersonRelationshipMask;
  ssn_last_4?: boolean;
};
