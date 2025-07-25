import { useFormContext } from 'react-hook-form';

import { MoniteCountry } from '@/ui/Country';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { OnboardingStepContent, OnboardingSubTitle } from '../OnboardingLayout';
import { OnboardingAddressType } from '../types';

type AddressType = { address: OnboardingAddressType };

type OnboardingAddressProps = {
  title: string;
  defaultValues: OnboardingAddressType;
  isLoading: boolean;
};

export const OnboardingAddress = ({
  title,
  defaultValues,
  isLoading,
}: OnboardingAddressProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<AddressType>();

  const checkValue = (key: keyof OnboardingAddressType) =>
    defaultValues.hasOwnProperty(key);

  return (
    <OnboardingStepContent>
      <OnboardingSubTitle>{title}</OnboardingSubTitle>

      {checkValue('country') && (
        <MoniteCountry
          disabled={isLoading}
          name="address.country"
          control={control}
          required
        />
      )}

      {checkValue('line1') && (
        <RHFTextField
          disabled={isLoading}
          label={t(i18n)`Line 1`}
          name="address.line1"
          control={control}
        />
      )}

      {checkValue('line2') && (
        <RHFTextField
          disabled={isLoading}
          label={t(i18n)`Line 2`}
          name="address.line2"
          control={control}
        />
      )}

      {checkValue('city') && (
        <RHFTextField
          disabled={isLoading}
          label={t(i18n)`City`}
          name="address.city"
          control={control}
        />
      )}

      {checkValue('state') && (
        <RHFTextField
          disabled={isLoading}
          label={t(i18n)`State`}
          name="address.state"
          control={control}
        />
      )}

      {checkValue('postal_code') && (
        <RHFTextField
          disabled={isLoading}
          type="tel"
          label={t(i18n)`Postal code`}
          name="address.postal_code"
          control={control}
        />
      )}
    </OnboardingStepContent>
  );
};
