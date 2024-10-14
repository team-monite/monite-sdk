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
      .positive()
      .test(
        'amount',
        i18n._(t(i18n)`Can't be more than the amount due`),
        (value) => {
          if (!value) return false;
          const currencyAmount = value * 100;
          return currencyAmount > 0 && currencyAmount <= amount_due;
        }
      ),
    // reference_number: yup
    //   .string()
    //   .label(i18n._(t(i18n)`Reference number`))
    //   .max(255)
    //   .required(),
    payment_date: yup
      .date()
      .max(new Date(), i18n._(t(i18n)`Date must be today or in the past`))
      .label(i18n._(t(i18n)`Date`))
      .required(),
    // payment_time: yup
    //   .date()
    //   .label(i18n._(t(i18n)`Time`))
    //   .required(),
  });
// Extra fields to be added in the future
