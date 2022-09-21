import React from 'react';
import { TFunction } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField, Input } from '@monite/ui-kit-react';
import * as yup from 'yup';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { CounterpartAddressFormFields } from './helpers';

export const getAddressValidationSchema = (t: TFunction) => ({
  line1: yup
    .string()
    .required(`${t('counterparts:address.line1')}${t('errors:requiredField')}`),
  line2: yup.string(),
  city: yup
    .string()
    .required(`${t('counterparts:address.city')}${t('errors:requiredField')}`),
  state: yup
    .string()
    .required(`${t('counterparts:address.state')}${t('errors:requiredField')}`),
  country: yup
    .string()
    .required(
      `${t('counterparts:address.country')}${t('errors:requiredField')}`
    ),
  postalCode: yup
    .string()
    .required(
      `${t('counterparts:address.postalCode')}${t('errors:requiredField')}`
    ),
});

const CounterpartAddressForm = () => {
  const { t } = useComponentsContext();
  const { control } = useFormContext<CounterpartAddressFormFields>();

  return (
    <>
      <Controller
        name="line1"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField
            label={t('counterparts:address.line1')}
            required
            id={field.name}
            error={error?.message}
          >
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />
      <Controller
        name="line2"
        control={control}
        render={({ field }) => (
          <FormField label={t('counterparts:address.line2')} id={field.name}>
            <Input {...field} id={field.name} />
          </FormField>
        )}
      />
      <Controller
        name="city"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField
            label={t('counterparts:address.city')}
            id={field.name}
            required
            error={error?.message}
          >
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />
      <Controller
        name="postalCode"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField
            label={t('counterparts:address.postalCode')}
            id={field.name}
            required
            error={error?.message}
          >
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />
      <Controller
        name="state"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField
            label={t('counterparts:address.state')}
            id={field.name}
            required
            error={error?.message}
          >
            <Input {...field} id={field.name} isInvalid={!!error} required />
          </FormField>
        )}
      />
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormField
            label={t('counterparts:address.country')}
            id={field.name}
            required
            error={error?.message}
          >
            <Input
              {...field}
              disabled
              id={field.name}
              isInvalid={!!error}
              required
            />
          </FormField>
        )}
      />
    </>
  );
};

export default CounterpartAddressForm;
