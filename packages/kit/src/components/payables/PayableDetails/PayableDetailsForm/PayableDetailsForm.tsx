import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';

import { Input, DatePicker, Multiselect, Select } from '@monite/ui';

import {
  PayableResponseSchema,
  TagReadSchema,
  CounterpartResponse as Counterpart,
} from '@monite/js-sdk';

import {
  convertToMajorUnits,
  getSymbolFromCurrency,
} from 'core/utils/currency';

import {
  getFullName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from 'components/counterparts/helpers';

import {
  CurrencyAddon,
  FormItem,
  FormSection,
  FormTitle,
} from '../PayableDetailsStyle';

export type PayablesDetailsFormProps = {
  onSubmit: (values: PayableDetailsFormFields) => void;
  payable: PayableResponseSchema;
  tags?: TagReadSchema[];
  counterparts?: Counterpart[];
};

type Option = { label: string; value: string };

export interface PayableDetailsFormFields {
  suppliersName: Option;
  invoiceNumber: string;
  invoiceDate: string;
  suggestedPaymentDate: string;
  dueDate: string;
  total: number;
  tags: Option[];
  iban: string;
  bic: string;
}

const counterpartsToSelect = (counterparts: Counterpart[] | undefined) => {
  if (!counterparts) return [];

  return counterparts?.map((counterpart) => ({
    value: counterpart.id,
    label: isIndividualCounterpart(counterpart)
      ? getFullName(
          counterpart.individual.first_name,
          counterpart.individual.last_name
        )
      : isOrganizationCounterpart(counterpart)
      ? counterpart.organization.legal_name
      : '',
  }));
};

const tagsToSelect = (tags: TagReadSchema[] | undefined) => {
  if (!tags) return [];

  return tags.map(({ id: value, name: label }) => ({
    value,
    label,
  }));
};

const PayableDetailsForm = forwardRef<
  HTMLFormElement,
  PayablesDetailsFormProps
>(({ onSubmit, payable, tags, counterparts }, ref) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<PayableDetailsFormFields>();

  return (
    <form ref={ref} id="payableDetails" onSubmit={handleSubmit(onSubmit)}>
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
            defaultValue={{
              value: payable.counterpart_id || '',
              label: payable.counterpart_name || '',
            }}
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
            defaultValue={payable.document_id}
            render={({ field: { ref, ...restField } }) => (
              <Input {...restField} required />
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
            defaultValue={payable.issued_at}
            render={({ field: { ref, value, ...restField } }) => (
              <DatePicker
                {...restField}
                required
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
            defaultValue={payable?.suggested_payment_term?.date}
            render={({ field: { ref, value, ...restField } }) => (
              // TODO Add discount
              <DatePicker
                {...restField}
                date={value ? new Date(value) : null}
                required
              />
            )}
          />
        </FormItem>
        <FormItem label={t('payables:details.dueDate')} id="dueDate" required>
          <Controller
            name="dueDate"
            control={control}
            defaultValue={payable.due_date}
            render={({ field: { ref, value, ...restField } }) => (
              <DatePicker
                {...restField}
                date={value ? new Date(value) : null}
                required
              />
            )}
          />
        </FormItem>
        <FormItem label={t('payables:details.total')} id="total" required>
          <Controller
            name="total"
            control={control}
            defaultValue={convertToMajorUnits(
              payable.amount ?? 0,
              payable.currency ?? ''
            )}
            render={({ field: { ref, ...restField } }) => (
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
              />
            )}
          />
        </FormItem>
        <FormItem label={t('payables:details.submittedBy')} id="submittedBy">
          {/*TODO Waiting design*/}
          submittedBy
        </FormItem>
        <FormItem label={t('payables:details.tags')} id="tags">
          <Controller
            name={'tags'}
            control={control}
            defaultValue={tagsToSelect(payable.tags)}
            render={({ field: { ref, ...restField } }) => (
              <Multiselect
                {...restField}
                optionAsTag
                options={tagsToSelect(tags)}
              />
            )}
          />
        </FormItem>
      </FormSection>

      <FormSection>
        <FormTitle textSize={'bold'}>
          {t('payables:tabPanels.payment')}
        </FormTitle>
        <FormItem label={t('payables:details.iban')} id="iban" required>
          <Controller
            name="iban"
            control={control}
            defaultValue={payable.counterpart_account_id}
            render={({ field: { ref, ...restField } }) => (
              <Input {...restField} required />
            )}
          />
        </FormItem>
        <FormItem label={t('payables:details.bic')} id="bic" required>
          <Controller
            name="bic"
            control={control}
            defaultValue={payable.counterpart_bank_id}
            render={({ field: { ref, ...restField } }) => (
              <Input {...restField} required />
            )}
          />
        </FormItem>
      </FormSection>
    </form>
  );
});

export default PayableDetailsForm;
