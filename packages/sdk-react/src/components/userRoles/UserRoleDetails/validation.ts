import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const getValidationSchema = (i18n: I18n) =>
  yup.object({
    name: yup
      .string()
      .label(i18n._(t(i18n)`Name`))
      .max(255)
      .required(),
  });
