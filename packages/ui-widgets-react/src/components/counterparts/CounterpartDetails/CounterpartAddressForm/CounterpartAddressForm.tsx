import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField, Input } from '@monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { CounterpartAddressFormFields } from './helpers';

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
