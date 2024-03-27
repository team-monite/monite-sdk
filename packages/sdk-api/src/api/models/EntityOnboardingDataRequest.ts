/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { BusinessProfile } from './BusinessProfile';
import type { OwnershipDeclaration } from './OwnershipDeclaration';
import type { TermsOfServiceAcceptance } from './TermsOfServiceAcceptance';

export type EntityOnboardingDataRequest = {
  /**
   * Business information about the entity.
   */
  business_profile?: BusinessProfile;
  /**
   * Used to attest that the beneficial owner information provided is both current and correct.
   */
  ownership_declaration?: OwnershipDeclaration;
  /**
   * Details on the entity's acceptance of the service agreement.
   */
  tos_acceptance?: TermsOfServiceAcceptance;
};
