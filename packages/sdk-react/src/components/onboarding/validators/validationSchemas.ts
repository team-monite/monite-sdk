import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

import { getIdentificationLabel } from '../helpers';
import {
  booleanValidator,
  dateOfBirthValidator,
  ibanValidator,
  numberValidator,
  phoneValidator,
  stringValidator,
  emailValidator,
  urlValidator,
} from './validators';
import type { ValidationSchema } from './validators';

export const entitySchema = (
  i18n: I18n
): ValidationSchema<UpdateEntityRequest> => ({
  email: emailValidator(i18n).describe(t(i18n)`Email address`),
  phone: phoneValidator(i18n).describe(t(i18n)`Business phone number`),
  tax_id: stringValidator().describe(t(i18n)`Tax number`),
});

export const entityIndividualSchema = (
  i18n: I18n,
  country?: AllowedCountries | null
): ValidationSchema<OptionalIndividualSchema> => ({
  first_name: stringValidator().describe(t(i18n)`First name`),
  last_name: stringValidator().describe(t(i18n)`Last name`),
  title: stringValidator().describe(t(i18n)`Title`),
  date_of_birth: dateOfBirthValidator(i18n).describe(t(i18n)`Date of birth`),
  id_number: stringValidator().describe(getIdentificationLabel(i18n, country)),
});

export const entityOrganizationSchema = (
  i18n: I18n
): ValidationSchema<OptionalOrganizationSchema> => ({
  legal_name: stringValidator().describe(t(i18n)`Legal business name`),
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
  verification_document_front: stringValidator().describe(
    t(i18n)`Front of your identify document`
  ),
  verification_document_back: stringValidator().describe(
    t(i18n)`Back of your identify document`
  ),
  additional_verification_document_front: stringValidator().describe(
    t(i18n)`Front of your additional identify document`
  ),
  additional_verification_document_back: stringValidator().describe(
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
  verification_document_front: stringValidator().describe(
    t(i18n)`Front of your identify document`
  ),
  verification_document_back: stringValidator().describe(
    t(i18n)`Back of your identify document`
  ),
  additional_verification_document_front: stringValidator().describe(
    t(i18n)`Front of your additional identify document`
  ),
  additional_verification_document_back: stringValidator().describe(
    t(i18n)`Back of your additional identify document`
  ),
});

export const personSchema = (
  i18n: I18n,
  country?: AllowedCountries | null
): ValidationSchema<OptionalPersonRequest> => ({
  first_name: stringValidator().describe(t(i18n)`First name`),
  last_name: stringValidator().describe(t(i18n)`Last name`),
  email: emailValidator(i18n).describe(t(i18n)`Email address`),
  phone: phoneValidator(i18n).describe(t(i18n)`Phone number`),
  date_of_birth: dateOfBirthValidator(i18n).describe(t(i18n)`Date of birth`),
  id_number: stringValidator().describe(getIdentificationLabel(i18n, country)),
});

export const bankAccountSchema = (
  i18n: I18n
): ValidationSchema<CreateEntityBankAccountRequest> => ({
  country: stringValidator().describe(t(i18n)`Country`),
  currency: stringValidator().describe(t(i18n)`Currency`),
  account_holder_name: stringValidator().describe(t(i18n)`Account holder name`),
  account_number: stringValidator().describe(t(i18n)`Account number`),
  sort_code: stringValidator()
    .describe(t(i18n)`Sort code`)
    .refine((val) => !val || val.length === 6, {
      message: t(i18n)`Sort code must be 6 digits`,
    }),
  iban: ibanValidator(i18n).describe(t(i18n)`IBAN`),
  routing_number: stringValidator()
    .describe(t(i18n)`Routing number`)
    .refine((val) => !val || val.length === 9, {
      message: t(i18n)`Routing number must be 9 digits`,
    }),
});

export const businessProfileSchema = (
  i18n: I18n
): ValidationSchema<BusinessProfile> => ({
  mcc: stringValidator().describe(t(i18n)`Industry`),
  url: urlValidator(i18n).describe(t(i18n)`Business URL`),
});

export const relationshipSchema = (
  i18n: I18n
): ValidationSchema<OptionalPersonRelationship> => ({
  title: stringValidator().describe(t(i18n)`Job title`),
  percent_ownership: numberValidator().describe(t(i18n)`Percent ownership`),
  representative: booleanValidator(),
  owner: booleanValidator(),
  executive: booleanValidator(),
  director: booleanValidator(),
});

export const addressSchema = (
  i18n: I18n
): ValidationSchema<EntityAddressSchema | OptionalPersonAddress> => ({
  country: stringValidator().describe(t(i18n)`Country`),
  line1: stringValidator().describe(t(i18n)`Line 1`),
  line2: stringValidator().describe(t(i18n)`Line 2`),
  city: stringValidator().describe(t(i18n)`City`),
  state: stringValidator().describe(t(i18n)`State`),
  postal_code: stringValidator().describe(t(i18n)`Postal code`),
});

export type OnboardingAgreementsSchema = {
  tos_acceptance?: boolean;
  ownership_declaration?: boolean;
};

export const agreementsSchema = (
  i18n: I18n
): ValidationSchema<OnboardingAgreementsSchema> => ({
  tos_acceptance: z
    .boolean()
    .describe(t(i18n)`Terms of Service`)
    .refine((v) => v === true, {
      message: t(i18n)`Please accept Service Agreement to proceed.`,
    }),
  ownership_declaration: z
    .boolean()
    .describe(t(i18n)`Ownership declaration`)
    .refine((v) => v === true, {
      message: t(i18n)`Please accept Ownership Declaration to proceed.`,
    }),
});

type BusinessProfile = components['schemas']['BusinessProfile-Input'];
type CreateEntityBankAccountRequest =
  components['schemas']['CreateEntityBankAccountRequest'];
type EntityAddressSchema = components['schemas']['EntityAddressSchema'];
type EntityOnboardingDocumentsPayload =
  components['schemas']['EntityOnboardingDocumentsPayload'];
type OptionalIndividualSchema =
  components['schemas']['OptionalIndividualSchema'];
type OptionalOrganizationSchema =
  components['schemas']['OptionalOrganizationSchema'];
type OptionalPersonAddress =
  components['schemas']['OptionalPersonAddressRequest'];
type OptionalPersonRelationship =
  components['schemas']['OptionalPersonRelationship'];
type OptionalPersonRequest = components['schemas']['OptionalPersonRequest'];
type PersonOnboardingDocumentsPayload =
  components['schemas']['PersonOnboardingDocumentsPayload'];
type UpdateEntityRequest = components['schemas']['UpdateEntityRequest'];
type AllowedCountries = components['schemas']['AllowedCountries'];
