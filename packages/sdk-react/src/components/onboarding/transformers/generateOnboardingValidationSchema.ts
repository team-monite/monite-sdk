import { components } from '@/api';
import { OnboardingFieldsType } from '@/components/onboarding/types';
import { I18n } from '@lingui/core';

import type { AnyObjectSchema } from 'yup';
import { object } from 'yup';

import {
  entityDocumentsSchema,
  personDocumentsSchema,
  ValidatorType,
} from '../validators';
import type { ValidationSchema } from '../validators';
import {
  OnboardingAgreementsSchema,
  addressSchema,
  agreementsSchema,
  bankAccountSchema,
  businessProfileSchema,
  entityIndividualSchema,
  entityOrganizationSchema,
  entitySchema,
  personSchema,
  relationshipSchema,
} from '../validators/validationSchemas';
import { isOnboardingField } from './index';

export type ValidationSchemasType =
  | 'entity'
  | 'entityIndividual'
  | 'entityOrganization'
  | 'entityDocuments'
  | 'person'
  | 'personDocuments'
  | 'bankAccount'
  | 'businessProfile'
  | 'relationship'
  | 'address'
  | 'agreements';

type UnifiedSchemaType =
  | UpdateEntityBankAccountRequest
  | UpdateEntityRequest
  | OptionalIndividualSchema
  | OptionalOrganizationSchema
  | OptionalPersonRequest
  | BusinessProfile
  | OptionalPersonRelationship
  | EntityAddressSchema
  | OptionalPersonAddress
  | OnboardingAgreementsSchema;

export type GenerateValidationSchemaType = {
  fields: OnboardingFieldsType;
  type: ValidationSchemasType;
  i18n: I18n;
};

export const generateOnboardingValidationSchema = ({
  fields,
  type,
  i18n,
}: GenerateValidationSchemaType): AnyObjectSchema => {
  const schema: ValidationSchema<UnifiedSchemaType> =
    getSchemaByType(type)(i18n);

  return object(
    Object.entries(fields).reduce((acc, [key, item]) => {
      const field = item as OnboardingFieldsType;
      const schemaKey = key as keyof typeof schema;
      const validator =
        schemaKey in schema && (schema[schemaKey] as ValidatorType);

      const subresourceType = getSubresourceTypeByKey(key);

      if (!subresourceType && validator) {
        return { ...acc, ...{ [key]: getValidatorSettings(field, validator) } };
      }

      if (!subresourceType) {
        return acc;
      }

      return {
        ...acc,
        ...{
          [key]: generateOnboardingValidationSchema({
            fields: field,
            type: subresourceType,
            i18n,
          }),
        },
      };
    }, {} as ValidationSchema<UnifiedSchemaType>)
  );
};

const getSchemaByType = (type: ValidationSchemasType) => {
  switch (type) {
    case 'entity':
      return entitySchema;
    case 'entityIndividual':
      return entityIndividualSchema;
    case 'entityOrganization':
      return entityOrganizationSchema;
    case 'entityDocuments':
      return entityDocumentsSchema;
    case 'person':
      return personSchema;
    case 'personDocuments':
      return personDocumentsSchema;
    case 'bankAccount':
      return bankAccountSchema;
    case 'businessProfile':
      return businessProfileSchema;
    case 'relationship':
      return relationshipSchema;
    case 'address':
      return addressSchema;
    case 'agreements':
      return agreementsSchema;
  }
};

const getSubresourceTypeByKey = (
  code: string
): ValidationSchemasType | undefined => {
  switch (code) {
    case 'individual':
      return 'entityIndividual';
    case 'organization':
      return 'entityOrganization';
    case 'relationship':
      return 'relationship';
    case 'address':
      return 'address';
  }
};

const getValidatorSettings = (
  field: OnboardingFieldsType,
  validator: ValidatorType
): ValidatorType => {
  if (!isOnboardingField(field)) return validator;
  if (!field.required) return validator;
  return validator.required();
};

type BusinessProfile = components['schemas']['BusinessProfile'];
type EntityAddressSchema = components['schemas']['EntityAddressSchema'];
type OptionalIndividualSchema =
  components['schemas']['OptionalIndividualSchema'];
type OptionalOrganizationSchema =
  components['schemas']['OptionalOrganizationSchema'];
type OptionalPersonAddress = components['schemas']['OptionalPersonAddress'];
type OptionalPersonRelationship =
  components['schemas']['OptionalPersonRelationship'];
type OptionalPersonRequest = components['schemas']['OptionalPersonRequest'];
type UpdateEntityBankAccountRequest =
  components['schemas']['UpdateEntityBankAccountRequest'];
type UpdateEntityRequest = components['schemas']['UpdateEntityRequest'];
