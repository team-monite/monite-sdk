/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingLinksAddress } from './OnboardingLinksAddress';

export type OnboardingLinksIndividual = {
  first_name?: string;
  last_name?: string;
  address?: OnboardingLinksAddress;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  id_number?: string;
  ssn_last_4?: string;
};
