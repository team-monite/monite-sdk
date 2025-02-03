import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';
import type { SchemaOf } from 'yup';

import { getAddressValidationSchema } from '../../CounterpartAddressForm/validation';

export const getUpdateIndividualValidationSchema = (
  i18n: I18n
): SchemaOf<{
  tax_id?: string;
  remindersEnabled: boolean;
  individual: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    counterpartType?: 'vendor' | 'customer';
  };
}> =>
  yup.object().shape({
    tax_id: yup.string(),
    remindersEnabled: yup.boolean().required(),
    individual: yup.object().shape({
      firstName: yup.string().required(t(i18n)`First name is required`),
      lastName: yup.string().required(t(i18n)`Last name is required`),
      email: yup
        .string()
        .email(t(i18n)`Email must be a valid email`)
        .required(t(i18n)`Email is required`),
      phone: yup.string(),
      counterpartType: yup.mixed().oneOf(['vendor', 'customer']),
    }),
  });

export const getCreateIndividualValidationSchema = (
  i18n: I18n
): SchemaOf<{
  tax_id?: string;
  remindersEnabled: boolean;
  individual: {
    firstName: string;
    lastName: string;
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
    individual: yup.object().shape({
      firstName: yup.string().required(t(i18n)`First name is required`),
      lastName: yup.string().required(t(i18n)`Last name is required`),
      email: yup
        .string()
        .email(t(i18n)`Email must be a valid email`)
        .required(t(i18n)`Email is required`),
      phone: yup.string(),
      counterpartType: yup.mixed().oneOf(['vendor', 'customer']),
      ...getAddressValidationSchema(i18n),
    }),
  });
