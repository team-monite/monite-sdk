import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

const getRecipientsSchema = () => {
  return z
    .object({
      bcc: z.array(z.string()).optional(),
      cc: z.array(z.string()).optional(),
      to: z.array(z.string()).optional(),
    })
    .optional();
};

const getReminderValidationSchema = (i18n: I18n) => {
  return z
    .object({
      days_before: z
        .number()
        .min(1, t(i18n)`Days before must be at least 1`)
        .max(10000, t(i18n)`Days before must be at most 10000`),
      subject: z.string().min(1, t(i18n)`Subject is required`),
      body: z.string().min(1, t(i18n)`Body is required`),
    })
    .optional();
};

const getOverdueReminderValidationSchema = (i18n: I18n) => {
  return z.object({
    days_after: z
      .number()
      .min(1, t(i18n)`Days after must be at least 1`)
      .max(9999, t(i18n)`Days after must be at most 9999`),
    subject: z.string().min(1, t(i18n)`Subject is required`),
    body: z.string().min(1, t(i18n)`Body is required`),
  });
};

export const getBeforeDueDateValidationSchema = (i18n: I18n) => {
  return z.object({
    name: z
      .string()
      .min(1, t(i18n)`Preset Name is required`)
      .max(255, t(i18n)`Preset Name must be 255 characters or less`),
    recipients: getRecipientsSchema(),
    term_1_reminder: getReminderValidationSchema(i18n),
    term_2_reminder: getReminderValidationSchema(i18n),
    term_final_reminder: getReminderValidationSchema(i18n),
  });
};

export const getOverdueValidationSchema = (i18n: I18n) => {
  return z.object({
    name: z
      .string()
      .min(1, t(i18n)`Preset Name is required`)
      .max(255, t(i18n)`Preset Name must be 255 characters or less`),
    recipients: getRecipientsSchema(),
    terms: z
      .array(getOverdueReminderValidationSchema(i18n))
      .min(1, t(i18n)`At least 1 reminder is required`)
      .max(3, t(i18n)`No more than 3 reminders are allowed`),
  });
};
