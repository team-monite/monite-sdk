import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getEmailInvoiceDetailsSchema = (i18n: I18n) =>
  z.object({
    to: z.string().min(1, t(i18n)`To is required`),
    subject: z.string().min(1, t(i18n)`Subject is required`),
    body: z.string().min(1, t(i18n)`Body is required`),
  });
