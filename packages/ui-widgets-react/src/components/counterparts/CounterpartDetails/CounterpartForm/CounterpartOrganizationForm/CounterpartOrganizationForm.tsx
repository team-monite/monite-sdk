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
} from '@team-monite/ui-kit-react';

import {
  CounterpartCreatePayload,
  CounterpartOrganizationResponse,
  CounterpartUpdatePayload,
} from '@team-monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';

import {
  CounterpartOrganizationFields,
  prepareCounterpartOrganization,
  prepareCounterpartOrganizationSubmit,
} from './mapper';

import CounterpartAddressForm from '../../CounterpartAddressForm';

import {
  CounterpartDetailsBlock,
  CounterpartFooter,
  CounterpartHeader,
  CounterpartForm,
} from '../../styles';

import { StyledHeaderActions } from 'components/payables/PayableDetails/PayableDetailsStyle';

import useCounterpartForm, {
  CounterpartsFormProps,
} from '../useCounterpartForm';

import getValidationSchema from './validation';
import { CounterpartDetailsLoading } from '../../styles/CounterpartDetailsLoading';

export const CounterpartOrganizationForm = (props: CounterpartsFormProps) => {
  const { t } = useComponentsContext();

  const {
    counterpart,
    formRef,
    submitForm,
    createCounterpart,
    updateCounterpart,
    isLoading,
  } = useCounterpartForm(props);

  const organizationCounterpart =
    counterpart as CounterpartOrganizationResponse;

  const methods = useForm<CounterpartOrganizationFields>({
    resolver: yupResolver(getValidationSchema(t)),
    defaultValues: useMemo(
      () =>
        prepareCounterpartOrganization(organizationCounterpart?.organization),
      [counterpart]
    ),
  });

  const { control, handleSubmit, reset, watch } = methods;

  useEffect(() => {
    reset(
      prepareCounterpartOrganization(organizationCounterpart?.organization)
    );
  }, [counterpart]);

  return (
    <ModalLayout
      scrollableContent={true}
      size={'md'}
      isDrawer
      loading={isLoading && <CounterpartDetailsLoading />}
      header={
        <CounterpartHeader>
          <Header>
            <Text textSize={'h3'}>
              {!!counterpart
                ? watch('companyName')
                : t('counterparts:titles.create', {
                    name: t('counterparts:titles.organization'),
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
          id="counterpartOrganizationForm"
          ref={formRef}
          onSubmit={handleSubmit((values) => {
            const payload = {
              type: 'organization',
              organization: prepareCounterpartOrganizationSubmit(values),
            };

            return !!counterpart
              ? updateCounterpart(payload as CounterpartUpdatePayload)
              : createCounterpart(payload as CounterpartCreatePayload);
          })}
        >
          <Controller
            name="companyName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                label={t('counterparts:organization.companyName')}
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
            name="vatNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                label={t('counterparts:organization.vatNumber')}
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
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField
                label={t('counterparts:organization.email')}
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
                label={t('counterparts:organization.phone')}
                id={field.name}
              >
                <Input {...field} id={field.name} type="tel" />
              </FormField>
            )}
          />

          <CounterpartDetailsBlock
            title={t('counterparts:organization.address')}
          >
            <CounterpartAddressForm />
          </CounterpartDetailsBlock>
        </CounterpartForm>
      </FormProvider>
    </ModalLayout>
  );
};
