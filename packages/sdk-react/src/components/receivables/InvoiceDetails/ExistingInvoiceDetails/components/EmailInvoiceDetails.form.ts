import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getEmailInvoiceDetailsSchema = (i18n: I18n) =>
  z.object({
    to: z.email(t(i18n)`Enter a valid email address`),
    subject: z
      .string()
      .trim()
      .min(1, t(i18n)`Subject is required`),
    body: z
      .string()
      .trim()
      .min(1, t(i18n)`Body is required`),
  });
