import { getCurrencies } from '@/core/utils';
import { currenciesToStringArray } from '@/core/utils/selectHelpers';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { components } from '@monite/sdk-api/src/api';

import * as yup from 'yup';

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
  yup.object({
    name: yup
      .string()
      .label(t(i18n)`Product name`)
      .required(),
    type: yup
      .mixed<ProductServiceTypeEnum>()
      .oneOf(['product', 'service'], t(i18n)`Product type is required`)
      .required(),
    units: yup
      .string()
      .label(t(i18n)`Units`)
      .required(),
    smallestAmount: yup
      .number()
      .min(0)
      .label(t(i18n)`Smallest amount`)
      .required(),
    pricePerUnit: yup
      .number()
      .min(0)
      .label(t(i18n)`Price per unit`)
      .required(),
    currency: yup
      .mixed<CurrencyEnum>()
      .oneOf(currenciesToStringArray(getCurrencies(i18n)))
      .label(t(i18n)`Currency`)
      .required(),
    description: yup.string().label(t(i18n)`Description`),
  });

export type IProductFormSubmitValues = yup.InferType<
  ReturnType<typeof getValidationSchema>
>;

type ProductServiceTypeEnum = components['schemas']['ProductServiceTypeEnum'];
type CurrencyEnum = components['schemas']['CurrencyEnum'];
