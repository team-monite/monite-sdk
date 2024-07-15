import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import {
  booleanValidator,
  dateOfBirthValidator,
  ibanValidator,
  numberValidator,
  phoneValidator,
  stringValidator,
} from './validators';
import type { ValidationSchema } from './validators';

export const entitySchema = (
  i18n: I18n
): ValidationSchema<UpdateEntityRequest> => ({
  email: stringValidator()
    .label(t(i18n)`Email address`)
    .email(),
  phone: phoneValidator(i18n).label(t(i18n)`Business phone number`),
  tax_id: stringValidator().label(t(i18n)`Tax number`),
});

export const entityIndividualSchema = (
  i18n: I18n
): ValidationSchema<OptionalIndividualSchema> => ({
  first_name: stringValidator().label(t(i18n)`First name`),
  last_name: stringValidator().label(t(i18n)`Last name`),
  title: stringValidator().label(t(i18n)`Title`),
  date_of_birth: dateOfBirthValidator(i18n).label(t(i18n)`Date of birth`),
  id_number: stringValidator().label(t(i18n)`Security number`),
  ssn_last_4: stringValidator()
    .label(t(i18n)`Last 4 digits of Social Security number`)
    .trim()
    .length(4),
});

export const entityOrganizationSchema = (
  i18n: I18n
): ValidationSchema<OptionalOrganizationSchema> => ({
  legal_name: stringValidator().label(t(i18n)`Legal business name`),
});

export type EntityDocumentsSchema = Pick<
  EntityOnboardingDocumentsPayload,
  | 'verification_document_front'
  | 'verification_document_back'
  | 'additional_verification_document_front'
  | 'additional_verification_document_back'
>;

export const entityDocumentsSchema = (
  i18n: I18n
): ValidationSchema<EntityDocumentsSchema> => ({
  verification_document_front: stringValidator().label(
    t(i18n)`Front of your identify document`
  ),
  verification_document_back: stringValidator().label(
    t(i18n)`Back of your identify document`
  ),
  additional_verification_document_front: stringValidator().label(
    t(i18n)`Front of your additional identify document`
  ),
  additional_verification_document_back: stringValidator().label(
    t(i18n)`Back of your additional identify document`
  ),
});

export type PersonDocumentsSchema = Pick<
  PersonOnboardingDocumentsPayload,
  | 'verification_document_front'
  | 'verification_document_back'
  | 'additional_verification_document_front'
  | 'additional_verification_document_back'
>;

export const personDocumentsSchema = (
  i18n: I18n
): ValidationSchema<PersonDocumentsSchema> => ({
  verification_document_front: stringValidator().label(
    t(i18n)`Front of your identify document`
  ),
  verification_document_back: stringValidator().label(
    t(i18n)`Back of your identify document`
  ),
  additional_verification_document_front: stringValidator().label(
    t(i18n)`Front of your additional identify document`
  ),
  additional_verification_document_back: stringValidator().label(
    t(i18n)`Back of your additional identify document`
  ),
});

export const personSchema = (
  i18n: I18n
): ValidationSchema<OptionalPersonRequest> => ({
  first_name: stringValidator().label(t(i18n)`First name`),
  last_name: stringValidator().label(t(i18n)`Last name`),
  email: stringValidator()
    .label(t(i18n)`Email address`)
    .email(),
  phone: phoneValidator(i18n).label(t(i18n)`Phone number`),
  date_of_birth: dateOfBirthValidator(i18n).label(t(i18n)`Date of birth`),
  id_number: stringValidator().label(t(i18n)`Security number`),
  ssn_last_4: stringValidator()
    .label(t(i18n)`Last 4 digits of Social Security number`)
    .trim()
    .min(4),
});

export const bankAccountSchema = (
  i18n: I18n
): ValidationSchema<CreateEntityBankAccountRequest> => ({
  country: stringValidator().label(t(i18n)`Country`),
  currency: stringValidator().label(t(i18n)`Currency`),
  account_holder_name: stringValidator().label(t(i18n)`Account holder name`),
  account_number: stringValidator().label(t(i18n)`Account number`),
  sort_code: stringValidator().label(t(i18n)`Sort code`),
  iban: ibanValidator(i18n).label(t(i18n)`IBAN`),
  routing_number: stringValidator().label(t(i18n)`Routing number`),
});

export const businessProfileSchema = (
  i18n: I18n
): ValidationSchema<BusinessProfile> => ({
  mcc: stringValidator().label(t(i18n)`Industry`),
  url: stringValidator()
    .label(t(i18n)`Business website`)
    .url(),
});

export const relationshipSchema = (
  i18n: I18n
): ValidationSchema<OptionalPersonRelationship> => ({
  title: stringValidator().label(t(i18n)`Job title`),
  percent_ownership: numberValidator().label(t(i18n)`Percent ownership`),
  representative: booleanValidator(),
  owner: booleanValidator(),
  executive: booleanValidator(),
  director: booleanValidator(),
});

export const addressSchema = (
  i18n: I18n
): ValidationSchema<EntityAddressSchema | OptionalPersonAddress> => ({
  country: stringValidator().label(t(i18n)`Country`),
  line1: stringValidator().label(t(i18n)`Line 1`),
  line2: stringValidator().label(t(i18n)`Line 2`),
  city: stringValidator().label(t(i18n)`City`),
  state: stringValidator().label(t(i18n)`State`),
  postal_code: stringValidator().label(t(i18n)`Postal code`),
});

export type OnboardingAgreementsSchema = {
  tos_acceptance?: boolean;
  ownership_declaration?: boolean;
};

export const agreementsSchema = (
  i18n: I18n
): ValidationSchema<OnboardingAgreementsSchema> => ({
  tos_acceptance: booleanValidator()
    .oneOf([true], t(i18n)`Please accept Service Agreement to proceed.`)
    .label(t(i18n)`Terms of Service`),
  ownership_declaration: booleanValidator()
    .oneOf([true], t(i18n)`Please accept Ownership Declaration to proceed.`)
    .label(t(i18n)`Ownership declaration`),
});

type BusinessProfile = components['schemas']['BusinessProfile'];
type CreateEntityBankAccountRequest =
  components['schemas']['CreateEntityBankAccountRequest'];
type EntityAddressSchema = components['schemas']['EntityAddressSchema'];
type EntityOnboardingDocumentsPayload =
  components['schemas']['EntityOnboardingDocumentsPayload'];
type OptionalIndividualSchema =
  components['schemas']['OptionalIndividualSchema'];
type OptionalOrganizationSchema =
  components['schemas']['OptionalOrganizationSchema'];
type OptionalPersonAddress = components['schemas']['OptionalPersonAddress'];
type OptionalPersonRelationship =
  components['schemas']['OptionalPersonRelationship'];
type OptionalPersonRequest = components['schemas']['OptionalPersonRequest'];
type PersonOnboardingDocumentsPayload =
  components['schemas']['PersonOnboardingDocumentsPayload'];
type UpdateEntityRequest = components['schemas']['UpdateEntityRequest'];
