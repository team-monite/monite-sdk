import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';
import type { SchemaOf } from 'yup';

import { getAddressValidationSchema } from '../../CounterpartAddressForm/validation';

export const getUpdateCounterpartValidationSchema = (
  i18n: I18n
): SchemaOf<{
  tax_id?: string;
  remindersEnabled: boolean;
  organization: {
    companyName: string;
    email: string;
    phone?: string;
    counterpartType?: 'vendor' | 'customer';
  };
}> =>
  yup.object().shape({
    tax_id: yup.string(),
    remindersEnabled: yup.boolean().required(),
    organization: yup.object({
      companyName: yup.string().required(t(i18n)`Company name is required`),
      email: yup
        .string()
        .email(t(i18n)`Email must be a valid email`)
        .required(t(i18n)`Email is required`),
      phone: yup.string(),
      counterpartType: yup.mixed().oneOf(['vendor', 'customer']),
    }),
  });

export const getCreateCounterpartValidationSchema = (
  i18n: I18n
): SchemaOf<{
  tax_id?: string;
  remindersEnabled: boolean;
  organization: {
    companyName: string;
    email: string;
    phone?: string;
    counterpartType?: 'vendor' | 'customer';
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}> =>
  yup.object().shape({
    tax_id: yup.string(),
    remindersEnabled: yup.boolean().required(),
    organization: yup.object({
      companyName: yup.string().required(t(i18n)`Company name is required`),
      email: yup
        .string()
        .email(t(i18n)`Email must be a valid email`)
        .required(t(i18n)`Email is required`),
      phone: yup.string(),
      counterpartType: yup.mixed().oneOf(['vendor', 'customer']),
      ...getAddressValidationSchema(i18n),
    }),
  });
