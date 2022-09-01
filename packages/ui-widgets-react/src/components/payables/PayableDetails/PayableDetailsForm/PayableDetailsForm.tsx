import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Input,
  DatePicker,
  Multiselect,
  Select,
  Spinner,
} from '@monite/ui-kit-react';

import { getSymbolFromCurrency } from 'core/utils/currency';

import {
  CurrencyAddon,
  FormItem,
  FormSection,
  FormTitle,
  StyledLoading,
  StyledScroll,
  StyledScrollContent,
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
    .object({
      suppliersName: yup.object({
        value: yup.string(),
        label: yup.string().required(),
      }),
      invoiceNumber: yup.string().required(),
      invoiceDate: yup.string().required(),
      suggestedPaymentDate: yup.string().required(),
      dueDate: yup.string().required(),
      total: yup.number().positive().required(),
      tags: yup
        .array(
          yup.object({
            value: yup.string().required(),
            label: yup.string().required(),
          })
        )
        .required(),
      iban: yup.string().required(),
      bic: yup.string().required(),
    })
    .required();

const PayableDetailsForm = forwardRef<
  HTMLFormElement,
  UsePayableDetailsFormProps
>(({ onSubmit, payable, debug }, ref) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<PayableDetailsFormFields>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: prepareDefaultValues(payable),
  });

  const { tags, counterparts, saveMutation } = usePayableDetailsForm({
    payable,
    debug,
    onSubmit,
  });

  return (
    <StyledScrollContent>
      {saveMutation.isLoading && (
        <StyledLoading>
          <Spinner color={'primary'} pxSize={45} />
        </StyledLoading>
      )}
      <StyledScroll>
        <form
          ref={ref}
          id="payableDetailsForm"
          onSubmit={handleSubmit((values) =>
            saveMutation.mutate(prepareSubmit(values))
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
                field: { ref, ...restField },
                fieldState: { error },
              }) => (
                <FormItem
                  label={t('payables:details.suppliersName')}
                  id={restField.name}
                  error={error?.message}
                  required
                >
                  {/* TODO: Add Created automatically */}
                  <Select
                    {...restField}
                    options={counterpartsToSelect(counterparts)}
                  />
                </FormItem>
              )}
            />

            <Controller
              name="invoiceNumber"
              control={control}
              render={({
                field: { ref, ...restField },
                fieldState: { error },
              }) => (
                <FormItem
                  label={t('payables:details.invoiceNumber')}
                  id={restField.name}
                  error={error?.message}
                  required
                >
                  <Input
                    {...restField}
                    ref={ref}
                    isInvalid={!!error}
                    required
                  />
                </FormItem>
              )}
            />
            <Controller
              name="invoiceDate"
              control={control}
              render={({
                field: { ref, value, ...restField },
                fieldState: { error },
              }) => (
                <FormItem
                  label={t('payables:details.invoiceDate')}
                  id={restField.name}
                  error={error?.message}
                  required
                >
                  <DatePicker
                    {...restField}
                    required
                    ref={ref}
                    isInvalid={!!error}
                    date={value ? new Date(value) : null}
                  />
                </FormItem>
              )}
            />

            <Controller
              name="suggestedPaymentDate"
              control={control}
              render={({
                field: { ref, value, ...restField },
                fieldState: { error },
              }) => (
                // TODO Add discount
                <FormItem
                  label={t('payables:details.suggestedPaymentDate')}
                  id={restField.name}
                  error={error?.message}
                  required
                >
                  <DatePicker
                    {...restField}
                    date={value ? new Date(value) : null}
                    ref={ref}
                    isInvalid={!!error}
                    required
                  />
                </FormItem>
              )}
            />

            <Controller
              name="dueDate"
              control={control}
              render={({
                field: { ref, value, ...restField },
                fieldState: { error },
              }) => (
                <FormItem
                  label={t('payables:details.dueDate')}
                  id={restField.name}
                  error={error?.message}
                  required
                >
                  <DatePicker
                    {...restField}
                    date={value ? new Date(value) : null}
                    ref={ref}
                    isInvalid={!!error}
                    required
                  />
                </FormItem>
              )}
            />
            <Controller
              name="total"
              control={control}
              render={({
                field: { ref, ...restField },
                fieldState: { error },
              }) => (
                <FormItem
                  label={t('payables:details.total')}
                  id={restField.name}
                  error={error?.message}
                  required
                >
                  <Input
                    {...restField}
                    renderAddon={() => {
                      if (!payable.currency) return undefined;
                      return (
                        <CurrencyAddon color={'lightGrey1'}>
                          {getSymbolFromCurrency(payable.currency)}
                        </CurrencyAddon>
                      );
                    }}
                    id="total"
                    required
                    type="number"
                    ref={ref}
                    isInvalid={!!error}
                  />
                </FormItem>
              )}
            />
            <FormItem
              label={t('payables:details.submittedBy')}
              id="submittedBy"
            >
              {/*TODO Waiting design*/}
            </FormItem>
            {!!tags?.length && (
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
                      options={tagsToSelect(tags)}
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
              render={({
                field: { ref, ...restField },
                fieldState: { error },
              }) => (
                <FormItem
                  label={t('payables:details.iban')}
                  id={restField.name}
                  error={error?.message}
                  required
                >
                  <Input
                    {...restField}
                    ref={ref}
                    isInvalid={!!error}
                    required
                  />
                </FormItem>
              )}
            />
            <Controller
              name="bic"
              control={control}
              render={({
                field: { ref, ...restField },
                fieldState: { error },
              }) => (
                <FormItem
                  label={t('payables:details.bic')}
                  id={restField.name}
                  error={error?.message}
                  required
                >
                  <Input
                    {...restField}
                    ref={ref}
                    isInvalid={!!error}
                    required
                  />
                </FormItem>
              )}
            />
          </FormSection>
        </form>
      </StyledScroll>
    </StyledScrollContent>
  );
});

export default PayableDetailsForm;
