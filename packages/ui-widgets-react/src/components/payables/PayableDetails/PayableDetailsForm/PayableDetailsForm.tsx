import React, { forwardRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, ControllerFieldState } from 'react-hook-form';
import {
  StyledModalLayoutScrollContent,
  StyledModalLayoutScroll,
} from '@team-monite/ui-kit-react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Input,
  DatePicker,
  Multiselect,
  Select,
  Loading,
} from '@team-monite/ui-kit-react';

import { getSymbolFromCurrency } from 'core/utils/currency';

import {
  CurrencyAddon,
  FormItem,
  FormSection,
  FormTitle,
} from '../PayableDetailsStyle';

import usePayableDetailsForm, {
  UsePayableDetailsFormProps,
} from './usePayableDetailsForm';

import {
  counterpartsToSelect,
  PayableDetailsFormFields,
  prepareDefaultValues,
  prepareSubmit,
  tagsToSelect,
} from './helpers';

const getValidationSchema = () =>
  yup
    .object()
    .shape({
      suppliersName: yup
        .object()
        .shape({
          value: yup.string().required(),
          label: yup.string().required(),
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
      iban: yup.string().required(),
      bic: yup.string().required(),
    })
    .required();

const PayableDetailsForm = forwardRef<
  HTMLFormElement,
  UsePayableDetailsFormProps
>(({ onSubmit, payable }, ref) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<PayableDetailsFormFields>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: useMemo(() => prepareDefaultValues(payable), [payable]),
  });

  useEffect(() => {
    reset(prepareDefaultValues(payable));
  }, [payable]);

  const {
    tagQuery,
    counterpartQuery,
    // entityUserQuery,
    saveInvoice,
    isFormLoading,
    createTag,
  } = usePayableDetailsForm({
    payable,
    onSubmit,
  });

  return (
    <StyledModalLayoutScrollContent>
      {isFormLoading && <Loading />}
      <StyledModalLayoutScroll>
        <form
          ref={ref}
          id="payableDetailsForm"
          onSubmit={handleSubmit((values) =>
            saveInvoice(prepareSubmit(values))
          )}
        >
          <FormSection>
            <FormTitle textSize={'bold'}>
              {t('payables:tabPanels.document')}
            </FormTitle>
            <Controller
              name={'suppliersName'}
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
                  label={t('payables:details.suppliersName')}
                  id={field.name}
                  error={error?.value?.message || error?.label?.message}
                  required
                >
                  {/* TODO: Add Created automatically */}
                  <Select
                    {...field}
                    options={counterpartsToSelect(counterpartQuery?.data?.data)}
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
                    id={field.name}
                    isInvalid={!!error}
                  />
                </FormItem>
              )}
            />

            {/*<FormItem*/}
            {/*  label={t('payables:details.submittedBy')}*/}
            {/*  id="submittedBy"*/}
            {/*>*/}
            {/*  /!*TODO Waiting design*!/*/}
            {/*  /!*{entityUserQuery.error && entityUserQuery.error.message}*!/*/}
            {/*</FormItem>*/}

            {!!tagQuery?.data?.data?.length && (
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

          <FormSection>
            <FormTitle textSize={'bold'}>
              {t('payables:tabPanels.payment')}
            </FormTitle>
            <Controller
              name="iban"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormItem
                  label={t('payables:details.iban')}
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

            <Controller
              name="bic"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormItem
                  label={t('payables:details.bic')}
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
          </FormSection>
        </form>
      </StyledModalLayoutScroll>
    </StyledModalLayoutScrollContent>
  );
});

export default PayableDetailsForm;
