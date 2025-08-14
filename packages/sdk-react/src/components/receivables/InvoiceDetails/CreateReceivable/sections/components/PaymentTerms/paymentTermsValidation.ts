import { PaymentTermsFields } from './types';
import { type I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getValidation = (i18n: I18n) =>
  z
    .object({
      name: z
        .string()
        .max(100, t(i18n)`Name must be 100 characters or less`)
        .min(1, t(i18n)`Name is required`),
      term_final: z.object({
        number_of_days: z.coerce.number().min(1, t(i18n)`Number of days is required`),
      }),
      description: z
        .string()
        .max(250, t(i18n)`Description must be 250 characters or less`)
        .optional(),
      term_1: z
        .object({
          number_of_days: z.union([z.coerce.number(), z.null()]),
          discount: z.union([z.coerce.number(), z.null()]),
        })
        .nullable()
        .optional(),
      term_2: z
        .object({
          number_of_days: z.union([z.coerce.number(), z.null()]),
          discount: z.union([z.coerce.number(), z.null()]),
        })
        .nullable()
        .optional(),
    })
    .refine(
      (data) => {
        // Check that term_1 days is less than term_final days
        if (data.term_1?.number_of_days && data.term_final.number_of_days) {
          return data.term_1.number_of_days < data.term_final.number_of_days;
        }
        return true;
      },
      {
        message: t(
          i18n
        )`The number of days in Discount must be less than of Due days`,
        path: ['term_1', 'number_of_days'],
      }
    )
    .refine(
      (data) => {
        // Check that term_2 days is less than term_final days
        if (data.term_2?.number_of_days && data.term_final.number_of_days) {
          return data.term_2.number_of_days < data.term_final.number_of_days;
        }
        return true;
      },
      {
        message: t(
          i18n
        )`The number of days in Discount must be less than of Due days`,
        path: ['term_2', 'number_of_days'],
      }
    )
    .refine(
      (data) => {
        // Check that term_2 days is greater than term_1 days
        if (data.term_2?.number_of_days && data.term_1?.number_of_days) {
          return data.term_2.number_of_days > data.term_1.number_of_days;
        }
        return true;
      },
      {
        message: t(
          i18n
        )`The number of days in Discount 2 must be more than the number of Discount 1 days`,
        path: ['term_2', 'number_of_days'],
      }
    )
    .refine(
      (data) => {
        if (data.term_1) {
          const hasNumberOfDays = data.term_1.number_of_days !== null;
          const hasDiscount = data.term_1.discount !== null;
          return hasNumberOfDays === hasDiscount;
        }
        return true;
      },
      {
        message: t(i18n)`To add a discount you need to fill out all the fields`,
        path: ['term_1', 'number_of_days'],
      }
    )
    .refine(
      (data) => {
        if (data.term_2) {
          const hasNumberOfDays = data.term_2.number_of_days !== null;
          const hasDiscount = data.term_2.discount !== null;
          return hasNumberOfDays === hasDiscount;
        }
        return true;
      },
      {
        message: t(i18n)`To add a discount you need to fill out all the fields`,
        path: ['term_2', 'number_of_days'],
      }
    ) satisfies z.ZodType<PaymentTermsFields>;
