import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  CountryOption,
  RHFAutocomplete,
} from '@/components/RHF/RHFAutocomplete';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { AllowedCountries } from '@/enums/AllowedCountries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { OnboardingStepContent, OnboardingSubTitle } from '../OnboardingLayout';
import { OnboardingAddressType } from '../types';
import { getRegionName } from '../utils';

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
        <RHFAutocomplete
          disabled={isLoading}
          name="address.country"
          control={control}
          label={t(i18n)`Country`}
          optionKey="code"
          labelKey="label"
          options={AllowedCountries.map((code) => ({
            code,
            label: t(i18n)`${getRegionName(code)}`,
          }))}
          renderOption={(props, option, state) => (
            <CountryOption
              key={option.code}
              props={props}
              // @ts-expect-error - Will be fixed in DEV-11737
              option={option}
              state={state}
            />
          )}
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
