import { FormProvider } from 'react-hook-form';

import { components } from '@/api';
import { useOnboardingEntity } from '@/components/onboarding/hooks/useOnboardingEntity';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { RHFTextFieldPhone } from '@/components/RHF/RHFTextFieldPhone';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useOnboardingForm } from '../hooks';
import { OnboardingAddress } from '../OnboardingAddress';
import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { enrichFieldsByValues } from '../transformers';
import { OnboardingEntityIndividual } from './OnboardingEntityIndividual';
import { OnboardingEntityOrganization } from './OnboardingEntityOrganization';

export const OnboardingEntity = () => {
  const { i18n } = useLingui();

  const { isPending, updateEntity, entity } = useOnboardingEntity();

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
        actions={<OnboardingFormActions isLoading={isPending} />}
        onSubmit={handleSubmit((values) =>
          updateEntity(enrichFieldsByValues(entity, values), ['entity'])
        )}
      >
        <OnboardingStepContent>
          {!!defaultValues.organization && (
            <OnboardingEntityOrganization
              defaultValues={defaultValues.organization}
              isLoading={isPending}
            />
          )}

          {!!defaultValues.individual && (
            <OnboardingEntityIndividual
              defaultValues={defaultValues.individual}
              isLoading={isPending}
            />
          )}

          {checkValue('email') && (
            <RHFTextField
              control={control}
              disabled={isPending}
              label={t(i18n)`Email address`}
              name="email"
              type="email"
            />
          )}

          {checkValue('phone') && (
            <RHFTextFieldPhone
              control={control}
              disabled={isPending}
              name="phone"
              label={getPhoneLabel()}
            />
          )}

          {checkValue('tax_id') && (
            <RHFTextField
              disabled={isPending}
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
            isLoading={isPending}
          />
        )}
      </OnboardingForm>
    </FormProvider>
  );
};

type EntityResponse = components['schemas']['EntityResponse'];
type UpdateEntityRequest = components['schemas']['UpdateEntityRequest'];
