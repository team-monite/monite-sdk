import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getValidationSchema = (i18n: I18n) =>
  z.object({
    iban: z.string().optional(),
    bic: z.string().optional(),
    name: z.string().optional(),
    account_number: z.string().optional(),
    sort_code: z.string().optional(),
    routing_number: z.string().optional(),
    country: z.string().min(1, t(i18n)`Country is required`),
    currency: z.string().min(1, t(i18n)`Currency is required`),
  });
