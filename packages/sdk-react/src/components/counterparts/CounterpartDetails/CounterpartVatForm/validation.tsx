import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const getValidationSchema = (i18n: I18n) =>
  yup.object().shape({
    country: yup
      .string()
      .label(t(i18n)`Country`)
      .required(),
    type: yup
      .string()
      .label(t(i18n)`Vat Type`)
      .required(),
    value: yup
      .string()
      .label(t(i18n)`Vat Value`)
      .required(),
  });
