import React from 'react';
import { FormProvider } from 'react-hook-form';

import { useOnboardingEntity } from '@/components/onboarding/hooks/useOnboardingEntity';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { RHFTextFieldPhone } from '@/components/RHF/RHFTextFieldPhone';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  EntityResponse,
  OnboardingRequirement,
  UpdateEntityRequest,
} from '@monite/sdk-api';

import { useOnboardingForm } from '../hooks';
import { OnboardingAddress } from '../OnboardingAddress';
import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { enrichFieldsByValues } from '../transformers';
import { OnboardingEntityIndividual } from './OnboardingEntityIndividual';
import { OnboardingEntityOrganization } from './OnboardingEntityOrganization';

export const OnboardingEntity = () => {
  const { i18n } = useLingui();

  const { isLoading, updateEntity, entity } = useOnboardingEntity();

  const { defaultValues, methods, checkValue, handleSubmit } =
    useOnboardingForm<UpdateEntityRequest, EntityResponse>(entity, 'entity');

  const { control } = methods;

  if (!defaultValues || !entity) return null;

  const isOrganization = checkValue('organization');

  const getAddressTitle = () => {
    if (isOrganization) return t(i18n)`Registered business address`;
    return t(i18n)`Home address`;
  };

  const getPhoneLabel = () => {
    if (isOrganization) return t(i18n)`Business phone number`;
    return t(i18n)`Phone number`;
  };

  return (
    <FormProvider {...methods}>
      <OnboardingForm
        actions={<OnboardingFormActions isLoading={isLoading} />}
        onSubmit={handleSubmit((values) =>
          updateEntity(enrichFieldsByValues(entity, values), [
            OnboardingRequirement.ENTITY,
          ])
        )}
      >
        <OnboardingStepContent>
          {!!defaultValues.organization && (
            <OnboardingEntityOrganization
              defaultValues={defaultValues.organization}
              isLoading={isLoading}
            />
          )}

          {!!defaultValues.individual && (
            <OnboardingEntityIndividual
              defaultValues={defaultValues.individual}
              isLoading={isLoading}
            />
          )}

          {checkValue('email') && (
            <RHFTextField
              control={control}
              disabled={isLoading}
              label={t(i18n)`Email address`}
              name="email"
              type="email"
            />
          )}

          {checkValue('phone') && (
            <RHFTextFieldPhone
              control={control}
              disabled={isLoading}
              name="phone"
              label={getPhoneLabel()}
            />
          )}

          {checkValue('tax_id') && (
            <RHFTextField
              disabled={isLoading}
              label={t(i18n)`Tax number`}
              name="tax_id"
              control={control}
            />
          )}
        </OnboardingStepContent>

        {!!defaultValues.address && (
          <OnboardingAddress
            title={getAddressTitle()}
            defaultValues={defaultValues.address}
            isLoading={isLoading}
          />
        )}
      </OnboardingForm>
    </FormProvider>
  );
};
