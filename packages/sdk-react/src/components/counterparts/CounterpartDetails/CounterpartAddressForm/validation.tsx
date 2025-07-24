import { AllowedCountries } from '@/enums/AllowedCountries';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getAddressValidationSchema = (i18n: I18n) =>
  z.object({
    line1: z.string().min(1, t(i18n)`Address line 1 is required`),
    line2: z.string().optional(),
    city: z.string().min(1, t(i18n)`City is required`),
    state: z.string().min(1, t(i18n)`State / Area / Province is required`),
    country: z.enum(AllowedCountries as [string, ...string[]]),
    postalCode: z.string().min(1, t(i18n)`Postal code is required`),
  });

export type CounterpartAddressFormFields = z.infer<
  ReturnType<typeof getAddressValidationSchema>
>;
