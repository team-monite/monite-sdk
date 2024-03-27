import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { AllowedCountries } from '@monite/sdk-api';

import * as yup from 'yup';

export const getValidationSchema = (i18n: I18n) =>
  yup.object().shape({
    iban: yup.string().label(t(i18n)`IBAN`),
    bic: yup.string(),
    name: yup.string(),
    account_number: yup.string(),
    sort_code: yup.string().label(t(i18n)`Sort code`),
    routing_number: yup.string().label(t(i18n)`Routing number`),
    country: yup
      .string()
      .label(t(i18n)`Country`)
      .required(),
    currency: yup
      .string()
      .label(t(i18n)`Currency`)
      .required(),
  });
