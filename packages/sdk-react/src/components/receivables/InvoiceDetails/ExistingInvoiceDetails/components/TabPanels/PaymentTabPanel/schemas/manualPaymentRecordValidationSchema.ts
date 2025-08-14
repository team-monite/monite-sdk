import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { type PaymentRecordFormValues } from '../PaymentRecordForm';

import { z } from 'zod';

export const manualPaymentRecordValidationSchema = (
  i18n: I18n,
  amount_due: number
) =>
  z.object({
    amount: z
      .number({ error: t(i18n)`Amount is required` })
      .min(0.01, t(i18n)`Can't be a negative number`)
      .refine(
        (value) => {
          const currencyAmount = value * 100;
          return currencyAmount <= amount_due;
        },
        {
          message: t(i18n)`Can't be more than the amount due`,
        }
      )
      .nullable(),
    payment_date: z
      .date({ error: t(i18n)`Date is required` })
      .nullable(),
    payment_time: z
      .date({ error: t(i18n)`Time is required` })
      .nullable(),
  }) satisfies z.ZodType<PaymentRecordFormValues>;
