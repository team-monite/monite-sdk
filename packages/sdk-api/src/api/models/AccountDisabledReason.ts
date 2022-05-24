/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An enumeration.
 */
export enum AccountDisabledReason {
  REQUIREMENTS_PAST_DUE = 'requirements.past_due',
  REQUIREMENTS_PENDING_VERIFICATION = 'requirements.pending_verification',
  LISTED = 'listed',
  PLATFORM_PAUSED = 'platform_paused',
  REJECTED_FRAUD = 'rejected.fraud',
  REJECTED_LISTED = 'rejected.listed',
  REJECTED_TERMS_OF_SERVICE = 'rejected.terms_of_service',
  REJECTED_OTHER = 'rejected.other',
  UNDER_REVIEW = 'under_review',
  OTHER = 'other',
}
