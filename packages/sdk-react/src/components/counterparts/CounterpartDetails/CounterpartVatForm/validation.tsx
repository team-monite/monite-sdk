import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getValidationSchema = (i18n: I18n) =>
  z.object({
    country: z.string().min(1, t(i18n)`Country is required`),
    type: z.string().min(1, t(i18n)`VAT Type is required`),
    value: z.string().min(1, t(i18n)`VAT Value is required`),
  });
