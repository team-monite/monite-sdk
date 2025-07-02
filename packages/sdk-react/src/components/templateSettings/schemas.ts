import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const getDocumentNumberFormSchema = (
  i18n: I18n,
  nextNumbers: components['schemas']['NextDocumentNumbers']
) => {
  return yup.object().shape({
    min_digits: yup
      .number()
      .required()
      .min(1, t(i18n)`Can't be less than 1`)
      .max(20, t(i18n)`Can't be greater than 20`),
    credit_note: yup.string().required(),
    credit_note_number: yup
      .number()
      .min(
        nextNumbers.credit_note,
        t(i18n)`Can't be less than ${nextNumbers.credit_note}`
      ),
    delivery_note: yup.string().required(),
    delivery_note_number: yup
      .number()
      .min(
        nextNumbers.delivery_note,
        t(i18n)`Can't be less than ${nextNumbers.delivery_note}`
      ),
    quote: yup.string().required(),
    quote_number: yup
      .number()
      .min(nextNumbers.quote, t(i18n)`Can't be less than ${nextNumbers.quote}`),
    invoice: yup.string().required(),
    invoice_number: yup
      .number()
      .min(
        nextNumbers.invoice,
        t(i18n)`Can't be less than ${nextNumbers.invoice}`
      ),
    purchase_order: yup.string().required(),
    purchase_order_number: yup
      .number()
      .min(
        nextNumbers.purchase_order,
        t(i18n)`Can't be less than ${nextNumbers.purchase_order}`
      ),
  });
};
