import { components } from '@/api';
import { CurrencyEnumSchema } from '@/enums/CurrencyEnum';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export interface ProductFormValues {
  name: string;
  type: ProductServiceTypeEnum;
  units: string;
  smallestAmount: number;
  pricePerUnit: number;
  currency: CurrencyEnum;
  description?: string;
}

export const getValidationSchema = (i18n: I18n) =>
  z.object({
    name: z.string().trim().min(1, t(i18n)`Product name is required`)
      .meta({ title: t(i18n)`Product Name` }),
    type: z
      .enum(['product', 'service'] as const, t(i18n)`Product type is required`)
      .meta({ title: t(i18n)`Type` }),
    units: z.string().trim().min(1, t(i18n)`Units is required`)
      .meta({ title: t(i18n)`Units` }),
    smallestAmount: z.coerce
      .number()
      .min(0, t(i18n)`Minimum quantity must be 0 or greater`)
      .meta({ title: t(i18n)`Minimum Quantity` }),
    pricePerUnit: z.coerce
      .number()
      .min(0, t(i18n)`Price per unit must be 0 or greater`)
      .meta({ title: t(i18n)`Price Per Unit` }),
    currency: CurrencyEnumSchema.meta({ title: t(i18n)`Currency` }),
    description: z
      .string()
      .trim()
      .max(255, t(i18n)`Description must be 255 characters or less`)
      .optional()
      .meta({ title: t(i18n)`Description` }),
  });

export type IProductFormSubmitValues = z.infer<
  ReturnType<typeof getValidationSchema>
>;
type ProductServiceTypeEnum = components['schemas']['ProductServiceTypeEnum'];
type CurrencyEnum = components['schemas']['CurrencyEnum'];
