import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const getEntityBankAccountValidationSchema = (
  i18n: I18n,
  isUpdateSchema?: boolean
) => {
  if (isUpdateSchema) {
    return yup.object().shape({
      display_name: yup
        .string()
        .label(t(i18n)`Display name`)
        .optional()
        .max(200),
      account_holder_name: yup
        .string()
        .label(t(i18n)`Account holder name`)
        .optional(),
    });
  }

  return yup.object().shape({
    country: yup
      .string()
      .label(t(i18n)`Country`)
      .required(),
    currency: yup
      .string()
      .label(t(i18n)`Currency`)
      .required(),
    bank_name: yup
      .string()
      .label(t(i18n)`Bank name`)
      .optional()
      .max(100),
    display_name: yup
      .string()
      .label(t(i18n)`Display name`)
      .optional()
      .max(200),
    account_number: yup
      .string()
      .label(t(i18n)`Account number`)
      .when('currency', {
        is: 'EUR',
        then: yup.string().notRequired(),
        otherwise: yup.string().required(),
      }),
    account_holder_name: yup
      .string()
      .label(t(i18n)`Account holder name`)
      .when('currency', {
        is: (value: string) => value === 'USD' || value === 'GBP',
        then: yup.string().required(),
        otherwise: yup.string().optional(),
      }),
    routing_number: yup
      .string()
      .label(t(i18n)`Routing number`)
      .optional()
      .when('currency', {
        is: (value: string) => value !== 'EUR' && value !== 'GBP',
        then: yup.string().required(),
        otherwise: yup.string().notRequired(),
      }),
    sort_code: yup
      .string()
      .label(t(i18n)`Sort code`)
      .optional()
      .when('currency', {
        is: (value: string) => value !== 'EUR' && value !== 'USD',
        then: yup.string().required().length(6),
        otherwise: yup.string().notRequired(),
      }),
    iban: yup
      .string()
      .label(t(i18n)`IBAN`)
      .when('currency', {
        is: (value: string) => value === 'EUR',
        then: yup.string().required(),
        otherwise: yup.string().notRequired(),
      }),
    bic: yup
      .string()
      .label(t(i18n)`SWIFT / BIC`)
      .optional(),
  });
};
