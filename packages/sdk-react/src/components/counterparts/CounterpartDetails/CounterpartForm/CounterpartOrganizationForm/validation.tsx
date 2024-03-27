import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

import { getAddressValidationSchema } from '../../CounterpartAddressForm/validation';

export const getValidationSchema = (isUpdate: boolean, i18n: I18n) =>
  yup.object().shape({
    tax_id: yup.string(),
    organization: yup.object({
      companyName: yup.string().required(t(i18n)`Company name is required`),
      email: yup
        .string()
        .email(t(i18n)`Email must be a valid email`)
        .required(t(i18n)`Email is required`),
      phone: yup.string(),
      counterpartType: yup.string(),
      ...(!isUpdate && getAddressValidationSchema(i18n)),
    }),
  });
