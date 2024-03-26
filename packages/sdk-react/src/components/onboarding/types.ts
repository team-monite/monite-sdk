import type {
  OnboardingCountryField,
  OnboardingCurrencyField,
  OnboardingDateField,
  OnboardingEmailField,
  OnboardingError,
  OnboardingFloatField,
  OnboardingStringField,
  OnboardingUrlField,
  OptionalPersonAddress,
  OrganizationSchema,
} from '@monite/sdk-api';
import type { EntityAddressSchema } from '@monite/sdk-api';
import {
  OnboardingPersonRelationship,
  OnboardingRequirement,
} from '@monite/sdk-api';

export type OnboardingPersonId = string | null;

export type OnboardingField =
  | OnboardingCurrencyField
  | OnboardingDateField
  | OnboardingEmailField
  | OnboardingFloatField
  | OnboardingStringField
  | OnboardingCountryField
  | OnboardingUrlField;

export type OnboardingErrorField = {
  code: string;
  message: string;
};

export type OnboardingOutputFieldsType = NestedDictionary<
  OnboardingField | OnboardingValueType
>;

export type OnboardingOutputValuesType = NestedDictionary<OnboardingValueType>;

export type OnboardingFieldsType =
  | OnboardingOutputFieldsType
  | Blob
  | boolean
  | number
  | string;

export type OnboardingValuesType =
  | OnboardingOutputValuesType
  | boolean
  | Blob
  | number
  | string;

export type OnboardingMaskType = NestedDictionary<boolean>;

export type OnboardingAddressType = OptionalPersonAddress | EntityAddressSchema;

export type OnboardingValueType =
  | undefined
  | boolean
  | string
  | number
  | Blob
  | null
  | OnboardingError;

type NestedDictionary<T> = {
  [key: string]: T | NestedDictionary<T>;
};

export type OnboardingTestData<
  F extends OnboardingFieldsType = OnboardingFieldsType,
  V extends OnboardingOutputValuesType = OnboardingOutputValuesType,
  E extends OnboardingErrorField[] = OnboardingErrorField[]
> = {
  fields: F;
  values: V;
  errors: E;
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
    ? RecursivePartial<T[P]>
    : T[P];
};

export type OnboardingOptionalParams = {
  parentKey?: string;
  exclude?: string[];
  optional?: string[];
  errors?: {
    code: string;
    message: string;
  }[];
};

export type OnboardingRelationshipCode = keyof Pick<
  OnboardingPersonRelationship,
  'representative' | 'owner' | 'director' | 'executive'
>;

export type EntityOrganizationRelationshipCode = keyof Pick<
  OrganizationSchema,
  | 'representative_provided'
  | 'owners_provided'
  | 'directors_provided'
  | 'executives_provided'
>;

export type OrganizationRequirements = Partial<
  Record<EntityOrganizationRelationshipCode, boolean>
>;

export type OnboardingPersonIndex = string | null;

export type OnboardingRequirementMask =
  | OnboardingRequirement.REPRESENTATIVE
  | OnboardingRequirement.DIRECTORS
  | OnboardingRequirement.OWNERS
  | OnboardingRequirement.EXECUTIVES;
