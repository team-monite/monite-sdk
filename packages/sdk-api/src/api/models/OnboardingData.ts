/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingBankAccount } from './OnboardingBankAccount';
import type { OnboardingBusinessProfile } from './OnboardingBusinessProfile';
import type { OnboardingEntity } from './OnboardingEntity';
import type { OnboardingEntityDocuments } from './OnboardingEntityDocuments';
import type { OnboardingOwnershipDeclaration } from './OnboardingOwnershipDeclaration';
import type { OnboardingPerson } from './OnboardingPerson';
import type { OnboardingPersonDocuments } from './OnboardingPersonDocuments';
import type { OnboardingTosAcceptance } from './OnboardingTosAcceptance';

export type OnboardingData = {
  bank_accounts?: Array<OnboardingBankAccount>;
  business_profile?: OnboardingBusinessProfile;
  entity?: OnboardingEntity;
  entity_documents?: OnboardingEntityDocuments;
  ownership_declaration?: OnboardingOwnershipDeclaration;
  persons?: Array<OnboardingPerson>;
  persons_documents?: Array<OnboardingPersonDocuments>;
  tos_acceptance?: OnboardingTosAcceptance;
};
