import { type I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

const lessThanDue = (value: number | undefined, getFormState: () => any) => {
  const form = getFormState();
  const termFinalDays = form?.term_final?.number_of_days;

  if (!value || !termFinalDays) {
    return true;
  }

  return value < termFinalDays;
};

const largerThanPreviousDiscount = (
  value: number | undefined,
  getFormState: () => any
) => {
  const form = getFormState();
  const previousTermDays = form?.term_1?.number_of_days;

  if (!value || !previousTermDays) {
    return true;
  }

  return value > previousTermDays;
};

export const getValidation = (i18n: I18n, getFormState: () => any) =>
  yup.object({
    name: yup.string().max(100).required(),
    term_final: yup.object().shape({
      number_of_days: yup.number().required(),
    }),
    description: yup.string().max(250).optional(),
    term_1: yup
      .object()
      .nullable()
      .shape({
        number_of_days: yup
          .number()
          .default(null)
          .typeError(
            t(i18n)`To add a discount you need to fill out all the fields`
          )
          .test(
            'less-than-due',
            t(
              i18n
            )`The number of days in Discount must be less than of Due days`,
            (value) => lessThanDue(value, getFormState)
          ),
        discount: yup
          .number()
          .typeError(
            t(i18n)`To add a discount you need to fill out all the fields`
          ),
      })
      .default(undefined)
      .optional(),
    term_2: yup
      .object()
      .nullable()
      .shape({
        number_of_days: yup
          .number()
          .typeError(
            t(i18n)`To add a discount you need to fill out all the fields`
          )
          .test(
            'less-than-due',
            t(
              i18n
            )`The number of days in Discount must be less than of Due days`,
            (value) => lessThanDue(value, getFormState)
          )
          .test(
            'larger-than-previous',
            t(
              i18n
            )`The number of days in Discount 2 must be more than the number of Discount 1 days`,
            (value) => largerThanPreviousDiscount(value, getFormState)
          ),
        discount: yup
          .number()
          .typeError(
            t(i18n)`To add a discount you need to fill out all the fields`
          ),
      })
      .default(undefined)
      .optional(),
  });
