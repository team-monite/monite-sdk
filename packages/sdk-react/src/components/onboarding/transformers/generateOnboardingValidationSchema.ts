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
import { isOnboardingField } from './commonDataTransformers';
import { components } from '@/api';
import { OnboardingFieldsType } from '@/components/onboarding/types';
import { I18n } from '@lingui/core';
import { z, type ZodType, type ZodObject, type ZodRawShape } from 'zod';
import { withIbanCountryConsistency } from '../validators/validators';

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
  country?: AllowedCountries | null;
};

export const generateOnboardingValidationSchema = ({
  fields,
  type,
  i18n,
  country,
}: GenerateValidationSchemaType) => {
  const schema: ValidationSchema<UnifiedSchemaType> = getSchemaByType(type)(
    i18n,
    country
  );

  const shape = Object.entries(fields).reduce(
    (acc: Record<string, ZodType>, [key, item]) => {
      const field = item as OnboardingFieldsType;
      const schemaKey = key as keyof typeof schema;
      const validator = schemaKey in schema ? (schema[schemaKey] as ValidatorType) : undefined;

      const subresourceType = getSubresourceTypeByKey(key);

      if (!subresourceType && validator) {
        acc[key] = getValidatorSettings(field, validator) as ZodType;
        return acc;
      }

      if (!subresourceType) {
        return acc;
      }

      const nested = generateOnboardingValidationSchema({
        fields: field,
        type: subresourceType,
        i18n,
        country,
      });
      acc[key] = nested as ZodObject<ZodRawShape>;
      return acc;
    },
    {} as Record<string, ZodType>
  );

  const objectSchema = z.object(shape);
  return type === 'bankAccount'
    ? withIbanCountryConsistency(objectSchema, i18n)
    : objectSchema;
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
): ZodType => {
  if (!isOnboardingField(field)) return validator;
  // Make field optional when not required; allow null for optional fields
  if (field.required) return validator;
  // optional + nullable for non-required fields
  return (validator as ZodType).optional().nullable();
};

type BusinessProfile = components['schemas']['BusinessProfile-Input'];
type EntityAddressSchema = components['schemas']['EntityAddressSchema'];
type OptionalIndividualSchema =
  components['schemas']['OptionalIndividualSchema'];
type OptionalOrganizationSchema =
  components['schemas']['OptionalOrganizationSchema'];
type OptionalPersonAddress =
  components['schemas']['OptionalPersonAddressRequest'];
type OptionalPersonRelationship =
  components['schemas']['OptionalPersonRelationship'];
type OptionalPersonRequest = components['schemas']['OptionalPersonRequest'];
type UpdateEntityBankAccountRequest =
  components['schemas']['UpdateEntityBankAccountRequest'];
type UpdateEntityRequest = components['schemas']['UpdateEntityRequest'];
type AllowedCountries = components['schemas']['AllowedCountries'];
