import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const getDocumentNumberFormSchema = (i18n: I18n) => {
  return yup.object().shape({
    min_digits: yup.number().min(1, t(i18n)`Can't be less than 1`),
    credit_note: yup.string().required(),
    delivery_note: yup.string().required(),
    quote: yup.string().required(),
    invoice: yup.string().required(),
    purchase_order: yup.string().required(),
  });
};
