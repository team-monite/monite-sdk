import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const getEmailInvoiceDetailsSchema = (i18n: I18n) =>
  yup.object({
    recipients: yup
      .object()
      .label(t(i18n)`Recipients`)
      .optional(),
    subject: yup
      .string()
      .label(t(i18n)`Subject`)
      .required(),
    body: yup
      .string()
      .label(t(i18n)`Body`)
      .required(),
  });
