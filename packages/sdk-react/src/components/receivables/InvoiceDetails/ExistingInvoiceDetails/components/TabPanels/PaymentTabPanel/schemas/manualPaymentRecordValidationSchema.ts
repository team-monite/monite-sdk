import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const manualPaymentRecordValidationSchema = (
  i18n: I18n,
  amount_due: number
) =>
  yup.object({
    amount: yup
      .number()
      .label(i18n._(t(i18n)`Amount`))
      .required()
      .test('amount', i18n._(t(i18n)`Can't be a negative number`), (value) => {
        if (!value) return false;
        return value > 0;
      })
      .test(
        'amount',
        i18n._(t(i18n)`Can't be more than the amount due`),
        (value) => {
          if (!value) return false;
          const currencyAmount = value * 100;
          return currencyAmount <= amount_due;
        }
      ),
    payment_date: yup
      .date()
      .label(i18n._(t(i18n)`Date`))
      .required(),
    payment_time: yup
      .date()
      .label(i18n._(t(i18n)`Time`))
      .required(),
  });
