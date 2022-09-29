import React from 'react';
import { Controller, FormProvider } from 'react-hook-form';

import {
  Input,
  FormField,
  ModalLayout,
  Text,
  Header,
  Button,
  UArrowRight,
} from '@monite/ui-kit-react';

import { StyledHeaderActions } from 'components/payables/PayableDetails/PayableDetailsStyle';
import { useComponentsContext } from 'core/context/ComponentsContext';

import { getName } from '../../helpers';

import {
  CounterpartFooter,
  CounterpartHeader,
  CounterpartForm,
  CounterpartEntityTitle,
} from '../styles';

import useCounterpartBankForm, {
  CounterpartBankFormProps,
} from './useCounterpartBankForm';
import { CounterpartDetailsLoading } from '../styles/CounterpartDetailsLoading';

const CounterpartBankForm = (props: CounterpartBankFormProps) => {
  const { t } = useComponentsContext();

  const {
    methods,
    counterpart,
    bank,
    formRef,
    submitForm,
    saveBank,
    isLoading,
  } = useCounterpartBankForm(props);

  const { control, handleSubmit, watch } = methods;

  if (!counterpart) return null;

  return (
    <ModalLayout
      scrollableContent={true}
      size={'md'}
      isDrawer
      loading={isLoading && <CounterpartDetailsLoading />}
      header={
        <CounterpartHeader>
          <Header>
            <CounterpartEntityTitle>
              <Text textSize={'bold'} color={'#B8B8B8'}>
                {getName(counterpart)}
              </Text>
              <UArrowRight size={20} color={'#B8B8B8'} />
              <Text textSize={'bold'}>
                {!!bank
                  ? watch('name')
                  : t('counterparts:actions.addBankAccount')}
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
                <Button onClick={submitForm} disabled={isLoading}>
                  {!!bank
                    ? t('counterparts:actions.updateBank')
                    : t('counterparts:actions.createBank')}
                </Button>
              </StyledHeaderActions>
            }
          />
        </CounterpartFooter>
      }
    >
      <FormProvider {...methods}>
        <CounterpartForm
          id="counterpartBankForm"
          ref={formRef}
          onSubmit={handleSubmit(saveBank)}
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                label={t('counterparts:bank.name')}
                id={field.name}
                required
                error={error?.message}
              >
                <Input
                  {...field}
                  id={field.name}
                  isInvalid={!!error}
                  required
                />
              </FormField>
            )}
          />
          <Controller
            name="iban"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                label={t('counterparts:bank.iban')}
                id={field.name}
                required
                error={error?.message}
              >
                <Input
                  {...field}
                  id={field.name}
                  isInvalid={!!error}
                  required
                />
              </FormField>
            )}
          />
          <Controller
            name="bic"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                label={t('counterparts:bank.bic')}
                id={field.name}
                required
                error={error?.message}
              >
                <Input
                  {...field}
                  id={field.name}
                  isInvalid={!!error}
                  required
                />
              </FormField>
            )}
          />
        </CounterpartForm>
      </FormProvider>
    </ModalLayout>
  );
};

export default CounterpartBankForm;
