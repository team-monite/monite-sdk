import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

const getReminderValidationSchema = (i18n: I18n) => {
  return yup
    .object({
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
    })
    .optional()
    .nullable();
};

export const getBeforeDueDateValidationSchema = (i18n: I18n) => {
  return yup.object({
    name: yup
      .string()
      .label(t(i18n)`Preset Name`)
      .min(1)
      .max(255)
      .required(),
    term_1_reminder: getReminderValidationSchema(i18n),
    term_2_reminder: getReminderValidationSchema(i18n),
    term_final_reminder: getReminderValidationSchema(i18n),
  });
};

export const getOverdueValidationSchema = (i18n: I18n) => {
  return yup.object({
    name: yup
      .string()
      .label(t(i18n)`Preset Name`)
      .min(1)
      .max(255)
      .required(),
    terms: yup
      .array()
      .min(1, t(i18n)`At least 1 reminder is required`)
      .max(3, t(i18n)`No more than 3 reminders are allowed`)
      .of(
        yup.object({
          days_after: yup
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
        })
      ),
  });
};
