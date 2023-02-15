import React, { forwardRef, useEffect, useMemo } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Controller, useForm, ControllerFieldState } from 'react-hook-form';
import {
  StyledModalLayoutScrollContent,
  StyledModalLayoutScroll,
} from '@team-monite/ui-kit-react';
import {
  PayableResponseSchema,
  PayableUpdateSchema,
} from '@team-monite/sdk-api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Input,
  DatePicker,
  Multiselect,
  Select,
  Loading,
} from '@team-monite/ui-kit-react';

import useOptionalFields from 'core/hooks/useOptionalFields';
import { getSymbolFromCurrency } from 'core/utils/currency';

import {
  CurrencyAddon,
  FormItem,
  FormSection,
  FormTitle,
} from '../PayableDetailsStyle';

import usePayableDetailsForm from './usePayableDetailsForm';

import {
  counterpartsToSelect,
  PayableDetailsFormFields,
  prepareDefaultValues,
  prepareSubmit,
  tagsToSelect,
} from './helpers';

import { OptionalFields } from '../PayableDetails';

interface PayableDetailsFormProps {
  payable: PayableResponseSchema;
  saveInvoice: (data: PayableUpdateSchema) => void;
  isFormLoading: boolean;
  optionalFields?: OptionalFields;
}

const getValidationSchema = (t: TFunction) =>
  yup
    .object()
    .shape({
      counterpart: yup
        .object()
        .shape({
          value: yup
            .string()
            .required(`${t('common:counterpart')}${t('errors:requiredField')}`),
          label: yup
            .string()
            .required(`${t('common:counterpart')}${t('errors:requiredField')}`),
        })
        .required(),
      invoiceNumber: yup.string().required(),
      dueDate: yup.string().required(),
      total: yup.number().positive().required(),
      tags: yup.array(
        yup.object().shape({
          value: yup.string().required(),
          label: yup.string().required(),
        })
      ),
    })
    .required();

const PayableDetailsForm = forwardRef<HTMLFormElement, PayableDetailsFormProps>(
  ({ payable, saveInvoice, isFormLoading, optionalFields }, ref) => {
    const { t } = useTranslation();
    const { control, handleSubmit, reset, watch } =
      useForm<PayableDetailsFormFields>({
        resolver: yupResolver(getValidationSchema(t)),
        defaultValues: useMemo(() => prepareDefaultValues(payable), [payable]),
      });
    const currentCounterpart = watch('counterpart');

    useEffect(() => {
      reset(prepareDefaultValues(payable));
    }, [payable]);

    const {
      tagQuery,
      counterpartQuery,
      counterpartAddressQuery,
      // entityUserQuery,
      createTag,
    } = usePayableDetailsForm({
      payable,
      currentCounterpartId: currentCounterpart.value,
    });
    const {
      showInvoiceDate,
      showSuggestedPaymentDate,
      showTags,
      showIban,
      showBic,
    } = useOptionalFields<OptionalFields>(optionalFields, {
      showInvoiceDate: true,
      showSuggestedPaymentDate: true,
      showTags: true,
      showIban: true,
      showBic: true,
    });

    return (
      <StyledModalLayoutScrollContent>
        {isFormLoading && <Loading />}
        <StyledModalLayoutScroll>
          <form
            ref={ref}
            id="payableDetailsForm"
            noValidate
            onSubmit={handleSubmit(async (values) => {
              const counterpartAddress =
                counterpartAddressQuery?.data?.data.find(
                  (address) => address.is_default
                );

              if (counterpartAddress) {
                await saveInvoice(
                  prepareSubmit({
                    ...values,
                    counterpartAddress: {
                      country: counterpartAddress.country,
                      city: counterpartAddress.city,
                      postal_code: counterpartAddress.postal_code,
                      state: counterpartAddress.state,
                      line1: counterpartAddress.line1,
                      line2: counterpartAddress.line2,
                    },
                  })
                );
              }
            })}
          >
            <FormSection>
              <FormTitle textSize={'bold'}>
                {t('payables:tabPanels.document')}
              </FormTitle>
              <Controller
                name={'counterpart'}
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
                    label={t('payables:details.counterpart')}
                    id={field.name}
                    error={error?.value?.message || error?.label?.message}
                    required
                  >
                    {/* TODO: Add Created automatically */}
                    <Select
                      {...field}
                      options={counterpartsToSelect(
                        counterpartQuery?.data?.data
                      )}
                    />
                  </FormItem>
                )}
              />

              <Controller
                name="invoiceNumber"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem
                    label={t('payables:details.invoiceNumber')}
                    id={field.name}
                    error={error?.message}
                    required
                  >
                    <Input
                      {...field}
                      id={field.name}
                      isInvalid={!!error}
                      required
                    />
                  </FormItem>
                )}
              />

              {showInvoiceDate && (
                <Controller
                  name="invoiceDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormItem
                      label={t('payables:details.invoiceDate')}
                      id={field.name}
                      error={error?.message}
                    >
                      <DatePicker
                        {...field}
                        id={field.name}
                        isInvalid={!!error}
                        date={field.value ? new Date(field.value) : null}
                      />
                    </FormItem>
                  )}
                />
              )}

              {showSuggestedPaymentDate && (
                <Controller
                  name="suggestedPaymentDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    // TODO Add discount
                    <FormItem
                      label={t('payables:details.suggestedPaymentDate')}
                      id={field.name}
                      error={error?.message}
                    >
                      <DatePicker
                        {...field}
                        id={field.name}
                        date={field.value ? new Date(field.value) : null}
                        isInvalid={!!error}
                      />
                    </FormItem>
                  )}
                />
              )}

              <Controller
                name="dueDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem
                    label={t('payables:details.dueDate')}
                    id={field.name}
                    error={error?.message}
                    required
                  >
                    <DatePicker
                      {...field}
                      id={field.name}
                      date={field.value ? new Date(field.value) : null}
                      isInvalid={!!error}
                      required
                    />
                  </FormItem>
                )}
              />

              <Controller
                name="total"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem
                    label={t('payables:details.total')}
                    id={field.name}
                    error={error?.message}
                    required
                  >
                    <Input
                      {...field}
                      renderAddon={() => {
                        if (!payable.currency) return undefined;
                        return (
                          <CurrencyAddon color={'lightGrey1'}>
                            {getSymbolFromCurrency(payable.currency)}
                          </CurrencyAddon>
                        );
                      }}
                      required
                      type="number"
                      min={0}
                      id={field.name}
                      isInvalid={!!error}
                    />
                  </FormItem>
                )}
              />
              {!!tagQuery?.data?.data?.length && showTags && (
                <Controller
                  name={'tags'}
                  control={control}
                  render={({ field: { ref, ...restField } }) => (
                    <FormItem
                      label={t('payables:details.tags')}
                      id={restField.name}
                    >
                      <Multiselect
                        {...restField}
                        optionAsTag
                        options={tagsToSelect(tagQuery.data.data)}
                        onCreate={createTag}
                      />
                    </FormItem>
                  )}
                />
              )}
            </FormSection>

            {(showIban || showBic) && (
              <FormSection>
                <FormTitle textSize={'bold'}>
                  {t('payables:tabPanels.payment')}
                </FormTitle>
                {showIban && (
                  <Controller
                    name="iban"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormItem
                        label={t('payables:details.iban')}
                        id={field.name}
                        error={error?.message}
                      >
                        <Input {...field} id={field.name} isInvalid={!!error} />
                      </FormItem>
                    )}
                  />
                )}

                {showBic && (
                  <Controller
                    name="bic"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormItem
                        label={t('payables:details.bic')}
                        id={field.name}
                        error={error?.message}
                      >
                        <Input {...field} id={field.name} isInvalid={!!error} />
                      </FormItem>
                    )}
                  />
                )}
              </FormSection>
            )}
          </form>
        </StyledModalLayoutScroll>
      </StyledModalLayoutScrollContent>
    );
  }
);
export default PayableDetailsForm;
