import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const getValidationSchema = (i18n: I18n) => {
  const getReminderValidationSchema = (value: boolean) => {
    if (!value) return yup.object().notRequired();

    return yup.object({
      days_before: yup
        .number()
        .label(t(i18n)`Remind`)
        .min(1)
        .max(10000)
        .required(),
      subject: yup
        .string()
        .label(t(i18n)`Subject`)
        .required(),
      body: yup
        .string()
        .label(t(i18n)`Body`)
        .required(),
    });
  };

  return yup.object({
    name: yup
      .string()
      .label(t(i18n)`Preset Name`)
      .min(1)
      .max(255)
      .required(),
    term_1_reminder: yup
      .object()
      .when('is_discount_date_1', (value) =>
        getReminderValidationSchema(value)
      ),
    term_2_reminder: yup
      .object()
      .when('is_discount_date_2', (value) =>
        getReminderValidationSchema(value)
      ),
    term_final_reminder: yup
      .object()
      .when('is_due_date', (value) => getReminderValidationSchema(value)),
  });
};
