import { AllowedCountries } from '@/enums/AllowedCountries';
import { VatIDTypeEnum } from '@/enums/VatIDTypeEnum';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getValidationSchema = (i18n: I18n) =>
  z.object({
    country: z.enum(AllowedCountries as [string, ...string[]]),
    type: z.enum(VatIDTypeEnum as [string, ...string[]]),
    value: z.string().min(1, t(i18n)`VAT Value is required`),
  });

export type CounterpartVatFormFields = z.infer<
  ReturnType<typeof getValidationSchema>
>;
