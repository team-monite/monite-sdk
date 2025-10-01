import { components } from '@/api';
import type { OnboardingSettings } from '@/core/componentSettings';

export type OnboardingPersonId = string | null;

/**
 * Extended onboarding requirement type that includes Treasury requirements
 * TODO: Remove this when backend adds 'treasury_tos_acceptance' to the union type
 */
export type OnboardingRequirementExtended = 
  | components['schemas']['OnboardingRequirement']
  | 'treasury_tos_acceptance';

/**
 * Treasury-specific onboarding data
 */
export interface TreasuryOnboardingData {
  treasury_tos_acceptance?: {
    date?: string;
  };
  stripe_account_id?: string;
  stripe_setup_intent_id?: string;
}

export type OnboardingField =
  | components['schemas']['OnboardingCurrencyField']
  | components['schemas']['OnboardingDateField']
  | components['schemas']['OnboardingEmailField']
  | components['schemas']['OnboardingFloatField']
  | components['schemas']['OnboardingStringField']
  | components['schemas']['OnboardingCountryField']
  | components['schemas']['OnboardingUrlField'];

export type OnboardingErrorField = {
  code: string;
  message: string;
};

export type OnboardingOutputFieldsType = NestedDictionary<
  OnboardingField | OnboardingValueType
>;

export type OnboardingOutputValuesType<
  TValue extends OnboardingValueType = OnboardingValueType
> = NestedDictionary<TValue>;

export type OnboardingFieldsType =
  | OnboardingOutputFieldsType
  | Blob
  | boolean
  | number
  | string;

export type OnboardingValuesType<
  TValue extends OnboardingValueType = OnboardingValueType
> = OnboardingOutputValuesType<TValue> | boolean | Blob | number | string;

export type OnboardingMaskType = NestedDictionary<boolean>;

export type OnboardingAddressType =
  | components['schemas']['OptionalPersonAddressRequest']
  | components['schemas']['EntityAddressSchema'];

export type OnboardingValueType =
  | undefined
  | boolean
  | string
  | number
  | Blob
  | null
  | components['schemas']['OnboardingError'];

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
  components['schemas']['OnboardingPersonRelationship'],
  'representative' | 'owner' | 'director' | 'executive'
>;

export type EntityOrganizationRelationshipCode = keyof Pick<
  components['schemas']['OrganizationSchema'],
  | 'representative_provided'
  | 'owners_provided'
  | 'directors_provided'
  | 'executives_provided'
>;

export type OrganizationRequirements = Partial<
  Record<EntityOrganizationRelationshipCode, boolean>
>;

export type OnboardingPersonIndex = string | null;

export type OnboardingRequirementMask = Extract<
  components['schemas']['OnboardingRequirement'],
  'representative' | 'directors' | 'executives' | 'owners'
>;

export type OnboardingProps = Pick<
  OnboardingSettings,
  | 'showContinueButton'
  | 'allowedCurrencies'
  | 'allowedCountries'
  | 'onComplete'
  | 'onContinue'
>;
