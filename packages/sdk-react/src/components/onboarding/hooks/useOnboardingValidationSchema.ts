import { components } from '@/api';
import { OnboardingFieldsType } from '@/components/onboarding/types';
import { useLingui } from '@lingui/react';

import {
  generateOnboardingValidationSchema,
  ValidationSchemasType,
} from '../transformers';

export const useOnboardingValidationSchema = ({
  fields,
  type,
  country,
}: {
  fields?: OnboardingFieldsType;
  type: ValidationSchemasType;
  country?: AllowedCountries;
}) => {
  const { i18n } = useLingui();

  if (!fields) return undefined;

  return generateOnboardingValidationSchema({
    fields,
    type,
    i18n,
    country,
  });
};

type AllowedCountries = components['schemas']['AllowedCountries'];
