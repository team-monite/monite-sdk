import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import styled from '@emotion/styled';

import {
  Input,
  FormField,
  DatePicker,
  Multiselect,
  Text,
  Select,
} from '@monite/ui';
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
import PayableDetailsFormFields from './types';

export type PayablesDetailsFormProps = {
  onSubmit: (values: PayableDetailsFormFields) => void;
  payable: PayableResponseSchema;
  tags?: TagReadSchema[];
  counterparts?: Counterpart[];
};

export const FormSection = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 40px;
`;

export const FormItem = styled(FormField)`
  margin-bottom: 24px;
`;

export const FormTitle = styled(Text)`
  margin-bottom: 24px;
`;

const CurrencyAddon = styled(Text)`
  position: absolute;
  right: 10px;
  top: 50%;
  display: flex;
  justify-content: center;
  transform: translateY(-50%);
`;

const getCounterparts = (counterparts: Counterpart[]) =>
  counterparts?.map((counterpart) => ({
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

const PayableDetailsForm = ({
  onSubmit,
  payable,
  tags,
  counterparts,
}: PayablesDetailsFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<PayableDetailsFormFields>();

  return (
    <form id="payableDetails" onSubmit={handleSubmit(onSubmit)}>
      <FormSection>
        <FormTitle textSize={'bold'}>
          {t('payables:tabPanels.document')}
        </FormTitle>
        {counterparts && payable.counterpart_id && (
          <FormItem
            label={t('payables:details.suppliersName')}
            id="suppliersName"
            required
          >
            <Controller
              name={'suppliersName'}
              control={control}
              defaultValue={{
                value: payable.counterpart_id,
                label: payable.counterpart_name || '',
              }}
              render={({ field: { ref, ...restField } }) => (
                <Select
                  options={getCounterparts(counterparts)}
                  {...restField}
                />
              )}
            />
          </FormItem>
        )}
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
              <Input required {...restField} />
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
                required
                date={value ? new Date(value) : null}
                {...restField}
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
                date={value ? new Date(value) : null}
                required
                {...restField}
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
                date={value ? new Date(value) : null}
                required
                {...restField}
              />
            )}
          />
        </FormItem>
        {!!(payable.amount && payable.currency) && (
          <FormItem label={t('payables:details.total')} id="total" required>
            <Controller
              name="total"
              control={control}
              defaultValue={convertToMajorUnits(
                payable.amount,
                payable.currency
              )}
              render={({ field: { ref, ...restField } }) => (
                <Input
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
                  {...restField}
                />
              )}
            />
          </FormItem>
        )}
        <FormItem label={t('payables:details.submittedBy')} id="submittedBy">
          {/*TODO Waiting design*/}
          submittedBy
        </FormItem>
        {!!(payable.tags && tags) && (
          <FormItem label={t('payables:details.tags')} id="tags">
            <Controller
              name={'tags'}
              control={control}
              defaultValue={payable.tags.map(({ id: value, name: label }) => ({
                value,
                label,
              }))}
              render={({ field: { ref, ...restField } }) => (
                <Multiselect
                  optionAsTag
                  options={tags.map(({ id: value, name: label }) => ({
                    value,
                    label,
                  }))}
                  {...restField}
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
            defaultValue={payable.counterpart_account_id}
            render={({ field: { ref, ...restField } }) => (
              <Input required {...restField} />
            )}
          />
        </FormItem>
        <FormItem label={t('payables:details.bic')} id="bic" required>
          <Controller
            name="bic"
            control={control}
            defaultValue={payable.counterpart_bank_id}
            render={({ field: { ref, ...restField } }) => (
              <Input required {...restField} />
            )}
          />
        </FormItem>
      </FormSection>
    </form>
  );
};

export default PayableDetailsForm;
