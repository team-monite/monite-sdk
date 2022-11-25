import React from 'react';
import { Controller } from 'react-hook-form';

import {
  Input,
  FormField,
  ModalLayout,
  Text,
  Header,
  Button,
  Loading,
  UArrowRight,
} from '@team-monite/ui-kit-react';

import { StyledHeaderActions } from 'components/payables/PayableDetails/PayableDetailsStyle';
import { useComponentsContext } from 'core/context/ComponentsContext';

import { getCounterpartName } from '../../helpers';

import {
  CounterpartFooter,
  CounterpartHeader,
  CounterpartForm,
  CounterpartEntityTitle,
} from '../styles';

import useCounterpartBankForm, {
  CounterpartBankFormProps,
} from './useCounterpartBankForm';

const CounterpartBankForm = (props: CounterpartBankFormProps) => {
  const { t } = useComponentsContext();

  const {
    methods: { control, handleSubmit, watch },
    counterpart,
    bank,
    formRef,
    submitForm,
    saveBank,
    isLoading,
  } = useCounterpartBankForm(props);

  if (!counterpart) return null;

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
                {getCounterpartName(counterpart)}
              </Text>
              <UArrowRight size={20} color={'#B8B8B8'} />
              <Text data-testid={'bankName'} textSize={'bold'}>
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
                <Button
                  onClick={submitForm}
                  type={'submit'}
                  disabled={isLoading}
                >
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
              <Input {...field} id={field.name} isInvalid={!!error} required />
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
              <Input {...field} id={field.name} isInvalid={!!error} required />
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
              <Input {...field} id={field.name} isInvalid={!!error} required />
            </FormField>
          )}
        />
      </CounterpartForm>
    </ModalLayout>
  );
};

export default CounterpartBankForm;
