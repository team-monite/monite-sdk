import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getAddressValidationSchema = (i18n: I18n) => ({
  line1: z.string().min(1, t(i18n)`Address line 1 is required`),

  line2: z.string().optional(),

  city: z.string().min(1, t(i18n)`City is required`),

  state: z.string().min(1, t(i18n)`State / Area / Province is required`),

  country: z.string().min(1, t(i18n)`Country is required`) as z.ZodType<
    components['schemas']['AllowedCountries']
  >,

  postalCode: z.string().min(1, t(i18n)`Postal code is required`),
});
