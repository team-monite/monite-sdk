import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

interface Terms {
  term_1_reminder: boolean;
  term_2_reminder: boolean;
  term_final_reminder: boolean;
}

export const getValidationSchema = (i18n: I18n, terms: Terms) => {
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
    term_1_reminder: getReminderValidationSchema(terms.term_1_reminder),
    term_2_reminder: getReminderValidationSchema(terms.term_2_reminder),
    term_final_reminder: getReminderValidationSchema(terms.term_final_reminder),
  });
};
