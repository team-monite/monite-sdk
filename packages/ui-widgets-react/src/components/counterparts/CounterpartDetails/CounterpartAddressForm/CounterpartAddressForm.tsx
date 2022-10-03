import React from 'react';
import {
  Controller,
  ControllerFieldState,
  useFormContext,
} from 'react-hook-form';
import { FormField, Input, Select, Card } from '@team-monite/ui-kit-react';
import { countries } from 'core/utils/countries';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { CounterpartAddressFormFields } from './helpers';
import { CounterpartContainer } from '../styles';
import { FormItem } from '../../../payables/PayableDetails/PayableDetailsStyle';
import { countriesToSelect } from '../helpers';

const CounterpartAddressForm = () => {
  const { t } = useComponentsContext();
  const { control } = useFormContext<CounterpartAddressFormFields>();

  return (
    <Card>
      <CounterpartContainer>
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
          name={'country'}
          control={control}
          render={({
            field,
            fieldState: { error },
          }: any & {
            fieldState: {
              error: ControllerFieldState & {
                value?: { message?: string };
                label?: { message?: string };
              };
            };
          }) => (
            <FormItem
              label={t('counterparts:address.country')}
              id={field.name}
              error={error?.value?.message || error?.label?.message}
              required
            >
              <Select {...field} options={countriesToSelect(countries)} />
            </FormItem>
          )}
        />
      </CounterpartContainer>
    </Card>
  );
};

export default CounterpartAddressForm;
