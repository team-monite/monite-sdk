import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { z } from 'zod';

export const getDocumentNumberFormSchema = (
  i18n: I18n,
  nextNumbers: components['schemas']['NextDocumentNumbers']
) => {
  return z.object({
    min_digits: z
      .number()
      .min(1, t(i18n)`Can't be less than 1`)
      .max(20, t(i18n)`Can't be greater than 20`),
    credit_note: z.string().min(1),
    credit_note_number: z
      .number()
      .min(
        nextNumbers.credit_note,
        t(i18n)`Can't be less than ${nextNumbers.credit_note}`
      ),
    delivery_note: z.string().min(1),
    delivery_note_number: z
      .number()
      .min(
        nextNumbers.delivery_note,
        t(i18n)`Can't be less than ${nextNumbers.delivery_note}`
      ),
    quote: z.string().min(1),
    quote_number: z
      .number()
      .min(nextNumbers.quote, t(i18n)`Can't be less than ${nextNumbers.quote}`),
    invoice: z.string().min(1),
    invoice_number: z
      .number()
      .min(
        nextNumbers.invoice,
        t(i18n)`Can't be less than ${nextNumbers.invoice}`
      ),
    purchase_order: z.string().min(1),
    purchase_order_number: z
      .number()
      .min(
        nextNumbers.purchase_order,
        t(i18n)`Can't be less than ${nextNumbers.purchase_order}`
      ),
    include_date: z.boolean(),
    prefix: z.string(),
    separator: z.enum(['/', '-', '|', '.', '']),
  });
};
