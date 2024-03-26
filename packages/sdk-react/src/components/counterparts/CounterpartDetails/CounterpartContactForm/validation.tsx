import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

import { getAddressValidationSchema } from '../CounterpartAddressForm/validation';

export const getValidationSchema = (i18n: I18n) =>
  yup.object().shape({
    firstName: yup.string().required(t(i18n)`First name is required`),
    lastName: yup.string().required(t(i18n)`Last name is required`),
    email: yup
      .string()
      .email(t(i18n)`Email must be a valid email`)
      .required(t(i18n)`Email is required`),
    phone: yup.string(),
    ...getAddressValidationSchema(i18n),
  });
