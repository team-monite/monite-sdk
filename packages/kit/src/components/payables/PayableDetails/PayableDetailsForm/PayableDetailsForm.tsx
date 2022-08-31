import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Input, DatePicker, Multiselect, Select } from '@monite/ui';

import { getSymbolFromCurrency } from 'core/utils/currency';

import {
  CurrencyAddon,
  FormItem,
  FormSection,
  FormTitle,
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

export type PayablesDetailsFormProps = UsePayableDetailsFormProps & {
  onSubmit: () => void;
};

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
  PayablesDetailsFormProps
>(({ onSubmit, payable, debug }, ref) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<PayableDetailsFormFields>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: prepareDefaultValues(payable),
  });

  const { tags, counterparts, submitMutation } = usePayableDetailsForm({
    payable,
    debug,
  });

  return (
    <StyledScrollContent>
      <StyledScroll>
        <form
          ref={ref}
          id="payableDetailsForm"
          onSubmit={handleSubmit((values) =>
            submitMutation.mutate(prepareSubmit(values))
          )}
        >
          <FormSection>
            <FormTitle textSize={'bold'}>
              {t('payables:tabPanels.document')}
            </FormTitle>
            <FormItem
              label={t('payables:details.suppliersName')}
              id="suppliersName"
              required
            >
              {/* TODO: Add Created automatically */}
              <Controller
                name={'suppliersName'}
                control={control}
                render={({ field: { ref, ...restField } }) => (
                  <Select
                    {...restField}
                    options={counterpartsToSelect(counterparts)}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t('payables:details.invoiceNumber')}
              id="invoiceNumber"
              required
            >
              <Controller
                name="invoiceNumber"
                control={control}
                render={({
                  field: { ref, ...restField },
                  fieldState: { error },
                }) => (
                  <Input
                    {...restField}
                    ref={ref}
                    error={error?.message}
                    isInvalid={!!error}
                    required
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t('payables:details.invoiceDate')}
              id="invoiceDate"
              required
            >
              <Controller
                name="invoiceDate"
                control={control}
                render={({
                  field: { ref, value, ...restField },
                  fieldState: { error },
                }) => (
                  <DatePicker
                    {...restField}
                    required
                    ref={ref}
                    error={error?.message}
                    isInvalid={!!error}
                    date={value ? new Date(value) : null}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t('payables:details.suggestedPaymentDate')}
              id="suggestedPaymentDate"
              required
            >
              <Controller
                name="suggestedPaymentDate"
                control={control}
                render={({
                  field: { ref, value, ...restField },
                  fieldState: { error },
                }) => (
                  // TODO Add discount
                  <DatePicker
                    {...restField}
                    date={value ? new Date(value) : null}
                    ref={ref}
                    error={error?.message}
                    isInvalid={!!error}
                    required
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t('payables:details.dueDate')}
              id="dueDate"
              required
            >
              <Controller
                name="dueDate"
                control={control}
                render={({
                  field: { ref, value, ...restField },
                  fieldState: { error },
                }) => (
                  <DatePicker
                    {...restField}
                    date={value ? new Date(value) : null}
                    ref={ref}
                    error={error?.message}
                    isInvalid={!!error}
                    required
                  />
                )}
              />
            </FormItem>
            <FormItem label={t('payables:details.total')} id="total" required>
              <Controller
                name="total"
                control={control}
                render={({
                  field: { ref, ...restField },
                  fieldState: { error },
                }) => (
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
                    error={error?.message}
                    isInvalid={!!error}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label={t('payables:details.submittedBy')}
              id="submittedBy"
            >
              {/*TODO Waiting design*/}
            </FormItem>
            {!!tags?.length && (
              <FormItem label={t('payables:details.tags')} id="tags">
                <Controller
                  name={'tags'}
                  control={control}
                  render={({ field: { ref, ...restField } }) => (
                    <Multiselect
                      {...restField}
                      optionAsTag
                      options={tagsToSelect(tags)}
                    />
                  )}
                />
              </FormItem>
            )}
          </FormSection>

          <FormSection>
            <FormTitle textSize={'bold'}>
              {t('payables:tabPanels.payment')}
            </FormTitle>
            <FormItem label={t('payables:details.iban')} id="iban" required>
              <Controller
                name="iban"
                control={control}
                render={({
                  field: { ref, ...restField },
                  fieldState: { error },
                }) => (
                  <Input
                    {...restField}
                    ref={ref}
                    error={error?.message}
                    isInvalid={!!error}
                    required
                  />
                )}
              />
            </FormItem>
            <FormItem label={t('payables:details.bic')} id="bic" required>
              <Controller
                name="bic"
                control={control}
                render={({
                  field: { ref, ...restField },
                  fieldState: { error },
                }) => (
                  <Input
                    {...restField}
                    ref={ref}
                    error={error?.message}
                    isInvalid={!!error}
                    required
                  />
                )}
              />
            </FormItem>
          </FormSection>
        </form>
      </StyledScroll>
    </StyledScrollContent>
  );
});

export default PayableDetailsForm;
