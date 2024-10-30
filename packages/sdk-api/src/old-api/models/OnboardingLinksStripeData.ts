/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingLinksBankAccount } from './OnboardingLinksBankAccount';
import type { OnboardingLinksBusinessProfile } from './OnboardingLinksBusinessProfile';
import type { OnboardingLinksCompany } from './OnboardingLinksCompany';
import type { OnboardingLinksIndividual } from './OnboardingLinksIndividual';
import type { OnboardingLinksPerson } from './OnboardingLinksPerson';

export type OnboardingLinksStripeData = {
  business_profile?: OnboardingLinksBusinessProfile;
  tos_acceptance_date?: string;
  bank_account?: OnboardingLinksBankAccount;
  individual?: OnboardingLinksIndividual;
  company?: OnboardingLinksCompany;
  persons?: Array<OnboardingLinksPerson>;
};
