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
  Loading,
  FlexContainer,
} from '@team-monite/ui-kit-react';

import { StyledHeaderActions } from 'components/payables/PayableDetails/PayableDetailsStyle';
import { useComponentsContext } from 'core/context/ComponentsContext';

import { getIndividualName, getCounterpartName } from '../../helpers';

import {
  CounterpartFooter,
  CounterpartHeader,
  CounterpartForm,
  CounterpartContactName,
  CounterpartEntityTitle,
} from '../styles';
import CounterpartAddressForm from '../CounterpartAddressForm';

import useCounterpartContactForm, {
  CounterpartContactFormProps,
} from './useCounterpartContactForm';

const CounterpartContactForm = (props: CounterpartContactFormProps) => {
  const { t } = useComponentsContext();

  const {
    methods,
    counterpart,
    contact,
    formRef,
    submitForm,
    saveContact,
    isLoading,
  } = useCounterpartContactForm(props);

  const { control, handleSubmit, watch } = methods;

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
              <Text textSize={'bold'}>
                {!!contact
                  ? getIndividualName(watch('firstName'), watch('lastName'))
                  : t('counterparts:actions.addContactPerson')}
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
                  {!!contact
                    ? t('counterparts:actions.updateContact')
                    : t('counterparts:actions.createContact')}
                </Button>
              </StyledHeaderActions>
            }
          />
        </CounterpartFooter>
      }
    >
      <FormProvider {...methods}>
        <CounterpartForm
          id="counterpartContactForm"
          ref={formRef}
          onSubmit={handleSubmit(saveContact)}
        >
          <CounterpartContactName>
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormField
                  label={t('counterparts:contact.firstName')}
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
              name="lastName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormField
                  label={t('counterparts:contact.lastName')}
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
          </CounterpartContactName>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                label={t('counterparts:contact.email')}
                id={field.name}
                required
                error={error?.message}
              >
                <Input
                  {...field}
                  id={field.name}
                  isInvalid={!!error}
                  type="email"
                />
              </FormField>
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <FormField
                label={t('counterparts:contact.phone')}
                id={field.name}
              >
                <Input {...field} id={field.name} type="tel" />
              </FormField>
            )}
          />

          <FlexContainer flexDirection={'column'} gap={20}>
            <Text textSize={'h4'}>{t('counterparts:contact.address')}</Text>
            <CounterpartAddressForm />
          </FlexContainer>
        </CounterpartForm>
      </FormProvider>
    </ModalLayout>
  );
};

export default CounterpartContactForm;
