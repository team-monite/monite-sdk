/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingStringField } from './OnboardingStringField';

export type OnboardingPersonDocuments = {
  id: string;
  additional_verification_document_back?: OnboardingStringField;
  additional_verification_document_front?: OnboardingStringField;
  verification_document_back?: OnboardingStringField;
  verification_document_front?: OnboardingStringField;
};
