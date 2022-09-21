import React, { forwardRef, ReactNode, useEffect, useMemo } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { TFunction } from 'react-i18next';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Checkbox,
  List,
  ListItem,
  Input,
  FormField,
  ModalLayout,
  Text,
  Header,
  Box,
} from '@monite/ui-kit-react';

import {
  CounterpartCreateOrganizationPayload,
  CounterpartCreatePayload,
  CounterpartOrganizationResponse,
} from '@monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';

import {
  CounterpartOrganizationFormFields,
  prepareCounterpartOrganization,
  prepareCounterpartOrganizationSubmit,
} from './helpers';

import {
  CounterpartAddressForm,
  getAddressValidationSchema,
} from '../../CounterpartAddress';

import {
  CounterpartDetailsBlock,
  StyledCounterpartScroll,
} from '../../CounterpartDetailsStyle';

import { StyledScrollContent } from 'components/payables/PayableDetails/PayableDetailsStyle';

export type CounterpartOrganizationFormProps = {
  counterpart?: CounterpartOrganizationResponse;
  onSubmit: (values: CounterpartCreatePayload) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: Error | string | null;
  actions: ReactNode;
};

const getValidationSchema = (t: TFunction) =>
  yup.object().shape({
    companyName: yup
      .string()
      .required(
        `${t('counterparts:organization.companyName')}${t(
          'errors:requiredField'
        )}`
      ),
    email: yup
      .string()
      .email(`${t('counterparts:organization.email')}${t('errors:validEmail')}`)
      .required(
        `${t('counterparts:organization.email')}${t('errors:requiredField')}`
      ),
    phone: yup.string(),
    counterpartType: yup.string(),
    vatNumber: yup
      .string()
      .required(
        `${t('counterparts:organization.vatNumber')}${t(
          'errors:requiredField'
        )}`
      ),
    ...getAddressValidationSchema(t),
  });

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CounterpartOrganizationForm = forwardRef<
  HTMLFormElement,
  CounterpartOrganizationFormProps
>(({ counterpart, onCancel, onSubmit, actions }, ref) => {
  const { t } = useComponentsContext();
  const methods = useForm<CounterpartOrganizationFormFields>({
    resolver: yupResolver(getValidationSchema(t)),
    defaultValues: useMemo(
      () => prepareCounterpartOrganization(counterpart?.organization),
      [counterpart]
    ),
  });

  useEffect(() => {
    reset(prepareCounterpartOrganization(counterpart?.organization));
  }, [counterpart]);

  const { control, handleSubmit, reset } = methods;

  return (
    <ModalLayout
      size={'md'}
      isDrawer
      header={
        <Box sx={{ borderBottom: '1px solid #DDDDDD' }}>
          <Header>
            <Text textSize={'h3'}>Create Counterpart – Organization</Text>
          </Header>
        </Box>
      }
      footer={
        <Box sx={{ borderTop: '1px solid #DDDDDD' }}>
          <Header actions={actions}>{''}</Header>
        </Box>
      }
    >
      <StyledScrollContent>
        <StyledCounterpartScroll>
          <FormProvider {...methods}>
            <Form
              id="counterpartOrganizationForm"
              ref={ref}
              onSubmit={handleSubmit((values) =>
                onSubmit({
                  type: 'organization' as CounterpartCreateOrganizationPayload.type,
                  organization: prepareCounterpartOrganizationSubmit(values),
                })
              )}
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
                      name="isVendor"
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
                      name="isCustomer"
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
            </Form>
          </FormProvider>
        </StyledCounterpartScroll>
      </StyledScrollContent>
    </ModalLayout>
  );
});

export default CounterpartOrganizationForm;
