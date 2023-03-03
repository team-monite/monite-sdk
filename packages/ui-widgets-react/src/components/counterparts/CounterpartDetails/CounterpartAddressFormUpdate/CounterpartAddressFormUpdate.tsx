import React from 'react';
import {
  Button,
  FormField,
  Header,
  Input,
  Loading,
  ModalLayout,
  Select,
  Text,
} from '@team-monite/ui-kit-react';
import {
  CounterpartEntityTitle,
  CounterpartFooter,
  CounterpartForm,
  CounterpartHeader,
} from '../styles';
import {
  FormItem,
  StyledHeaderActions,
} from '../../../payables/PayableDetails/PayableDetailsStyle';
import { Controller, ControllerFieldState } from 'react-hook-form';
import { countriesToSelect } from '../helpers';
import { countries } from 'core/utils/countries';

import useCounterpartAddressFormUpdate, {
  CounterpartAddressFormUpdateProps,
} from './useCounterpartAddressFormUpdate';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { prepareCounterpartAddressSubmit } from '../CounterpartAddressForm';

const CounterpartAddressFormUpdate = (
  props: CounterpartAddressFormUpdateProps
) => {
  const { t } = useComponentsContext();
  const {
    methods: { control, handleSubmit },
    formRef,
    submitForm,
    updateAddress,
    isLoading,
  } = useCounterpartAddressFormUpdate(props);

  return (
    <ModalLayout
      scrollableContent={true}
      size={'md'}
      isDrawer
      loading={isLoading && <Loading />}
      header={
        <CounterpartHeader>
          <Header>
            <CounterpartEntityTitle>
              <Text textSize={'bold'} color={'#B8B8B8'}>
                {t('counterparts:titles.address')}
              </Text>
            </CounterpartEntityTitle>
          </Header>
        </CounterpartHeader>
      }
      footer={
        <CounterpartFooter>
          <Header
            actions={
              <StyledHeaderActions>
                <Button
                  onClick={props.onCancel}
                  variant={'link'}
                  disabled={isLoading}
                  color={'secondary'}
                >
                  {t('counterparts:actions.cancel')}
                </Button>
                <Button
                  onClick={submitForm}
                  type={'submit'}
                  disabled={isLoading}
                >
                  {t('counterparts:actions.update')}
                </Button>
              </StyledHeaderActions>
            }
          />
        </CounterpartFooter>
      }
    >
      <CounterpartForm
        id="counterpartBankForm"
        ref={formRef}
        onSubmit={handleSubmit((values) =>
          updateAddress(prepareCounterpartAddressSubmit(values))
        )}
      >
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
      </CounterpartForm>
    </ModalLayout>
  );
};

export default CounterpartAddressFormUpdate;
