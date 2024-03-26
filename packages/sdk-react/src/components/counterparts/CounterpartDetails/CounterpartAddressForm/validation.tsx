import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const getAddressValidationSchema = (i18n: I18n) => ({
  line1: yup.string().required(t(i18n)`Address line 1 is required`),

  line2: yup.string(),

  city: yup.string().required(t(i18n)`City is required`),

  state: yup.string().required(t(i18n)`State / Area / Province is required`),

  country: yup.string().required(t(i18n)`Country is required`),

  postalCode: yup.string().required(t(i18n)`ZIP code is required`),
});
