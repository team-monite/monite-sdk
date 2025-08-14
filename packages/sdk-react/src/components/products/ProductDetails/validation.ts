import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';
import { CurrencyEnum as currencies } from '@/enums/CurrencyEnum';

export interface ProductFormValues {
  name?: string;
  type: ProductServiceTypeEnum;
  units?: string;
  smallestAmount?: number;
  pricePerUnit?: number;
  currency?: CurrencyEnum;
  description?: string;
}

export const getValidationSchema = (i18n: I18n) =>
  z.object({
    name: z.string().min(1, t(i18n)`Product name is required`),
    type: z.enum(['product', 'service'] as const, t(i18n)`Product type is required`),
    units: z.string().min(1, t(i18n)`Units is required`),
    smallestAmount: z
      .coerce
      .number()
      .min(0, t(i18n)`Minimum quantity must be 0 or greater`),
    pricePerUnit: z
      .coerce
      .number()
      .min(0, t(i18n)`Price per unit must be 0 or greater`),
    currency: z.enum(
      currencies as [string, ...string[]],
      t(i18n)`Currency is required`
    ),
    description: z
      .string()
      .max(255, t(i18n)`Description must be 255 characters or less`)
      .optional(),
  });

export type IProductFormSubmitValues = z.infer<ReturnType<typeof getValidationSchema>>;
type ProductServiceTypeEnum = components['schemas']['ProductServiceTypeEnum'];
type CurrencyEnum = components['schemas']['CurrencyEnum'];
