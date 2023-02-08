import React, { useEffect, useMemo } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import {
  Checkbox,
  List,
  ListItem,
  Input,
  FormField,
  ModalLayout,
  Text,
  Header,
  Button,
  Loading,
  FlexContainer,
} from '@team-monite/ui-kit-react';

import {
  CounterpartCreatePayload,
  CounterpartIndividualRootResponse,
  CounterpartUpdatePayload,
} from '@team-monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';

import {
  CounterpartIndividualFields,
  prepareCounterpartIndividual,
  prepareCounterpartIndividualSubmit,
} from './mapper';

import CounterpartAddressForm from '../../CounterpartAddressForm';

import {
  CounterpartFooter,
  CounterpartHeader,
  CounterpartForm,
  CounterpartContactName,
} from '../../styles';

import { StyledHeaderActions } from 'components/payables/PayableDetails/PayableDetailsStyle';
import useCounterpartForm, {
  CounterpartsFormProps,
} from '../useCounterpartForm';

import { getIndividualName } from '../../../helpers';

import getValidationSchema from './validation';

export const CounterpartIndividualForm = (props: CounterpartsFormProps) => {
  const { t } = useComponentsContext();

  const {
    counterpart,
    formRef,
    submitForm,
    createCounterpart,
    updateCounterpart,
    isLoading,
  } = useCounterpartForm(props);

  const individualCounterpart =
    counterpart as CounterpartIndividualRootResponse;

  const methods = useForm<CounterpartIndividualFields>({
    resolver: yupResolver(getValidationSchema(t)),
    defaultValues: useMemo(
      () => prepareCounterpartIndividual(individualCounterpart?.individual),
      [counterpart]
    ),
  });

  const { control, handleSubmit, reset, watch } = methods;

  useEffect(() => {
    reset(prepareCounterpartIndividual(individualCounterpart?.individual));
  }, [counterpart]);

  return (
    <ModalLayout
      scrollableContent={true}
      size={'md'}
      isDrawer
      loading={isLoading && <Loading />}
      header={
        <CounterpartHeader>
          <Header>
            <Text textSize={'h3'}>
              {!!counterpart
                ? getIndividualName(watch('firstName'), watch('lastName'))
                : t('counterparts:titles.create', {
                    name: t('counterparts:titles.individual'),
                  })}
            </Text>
          </Header>
        </CounterpartHeader>
      }
      footer={
        <CounterpartFooter>
          <Header
            actions={
              <StyledHeaderActions>
                <Button
                  onClick={!!counterpart ? props.onCancel : props.onClose}
                  variant={'link'}
                  disabled={isLoading}
                  color={'secondary'}
                >
                  {t('counterparts:actions.cancel')}
                </Button>
                <Button onClick={submitForm} disabled={isLoading}>
                  {!!counterpart
                    ? t('counterparts:actions.update')
                    : t('counterparts:actions.create')}
                </Button>
              </StyledHeaderActions>
            }
          />
        </CounterpartFooter>
      }
    >
      <FormProvider {...methods}>
        <CounterpartForm
          id="counterpartIndividualForm"
          ref={formRef}
          onSubmit={handleSubmit((values) => {
            const payload = {
              type: 'individual',
              individual: prepareCounterpartIndividualSubmit(values),
            };

            return !!counterpart
              ? updateCounterpart(payload as CounterpartUpdatePayload)
              : createCounterpart(payload as CounterpartCreatePayload);
          })}
        >
          <CounterpartContactName>
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormField
                  label={t('counterparts:individual.firstName')}
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
                  label={t('counterparts:individual.lastName')}
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
          <FormField
            label={`${t('counterparts:actions.setCounterpart')}:`}
            id="counterpartType"
          >
            <List>
              <ListItem>
                <Controller
                  name="isCustomer"
                  control={control}
                  render={({ field: { ref, ...other } }) => (
                    <Checkbox
                      {...other}
                      label={t('counterparts:customer')}
                      id={other.name}
                      value={other.name}
                      checked={!!other.value}
                    />
                  )}
                />
              </ListItem>
              <ListItem>
                <Controller
                  name="isVendor"
                  control={control}
                  render={({ field: { ref, ...other } }) => (
                    <Checkbox
                      {...other}
                      label={t('counterparts:vendor')}
                      id={other.name}
                      value={other.name}
                      checked={!!other.value}
                    />
                  )}
                />
              </ListItem>
            </List>
          </FormField>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                label={t('counterparts:individual.email')}
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
                label={t('counterparts:individual.phone')}
                id={field.name}
              >
                <Input {...field} id={field.name} type="tel" />
              </FormField>
            )}
          />

          <FlexContainer flexDirection={'column'} gap={20}>
            <Text textSize={'h4'}>{t('counterparts:individual.address')}</Text>
            <CounterpartAddressForm />
          </FlexContainer>
        </CounterpartForm>
      </FormProvider>
    </ModalLayout>
  );
};
