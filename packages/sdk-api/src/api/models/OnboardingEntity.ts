/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingAddress } from './OnboardingAddress';
import type { OnboardingEmailField } from './OnboardingEmailField';
import type { OnboardingEntityIndividual } from './OnboardingEntityIndividual';
import type { OnboardingEntityOrganization } from './OnboardingEntityOrganization';
import type { OnboardingStringField } from './OnboardingStringField';

export type OnboardingEntity = {
  address?: OnboardingAddress;
  email?: OnboardingEmailField;
  individual?: OnboardingEntityIndividual;
  organization?: OnboardingEntityOrganization;
  phone?: OnboardingStringField;
  tax_id?: OnboardingStringField;
};
