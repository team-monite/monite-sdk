import { getAddressValidationSchema } from '../../CounterpartAddressForm/validation';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getUpdateIndividualValidationSchema = (i18n: I18n) =>
  z.object({
    tax_id: z.string().optional(),
    remindersEnabled: z.boolean(),
    individual: z.object({
      firstName: z.string().min(1, t(i18n)`First name is required`),
      lastName: z.string().min(1, t(i18n)`Last name is required`),
      email: z
        .email(t(i18n)`Email must be a valid email`)
        .min(1, t(i18n)`Email is required`),
      phone: z.string().optional(),
      isCustomer: z.boolean(),
      isVendor: z.boolean(),
    }),
  });

export type UpdateCounterpartIndividualFormFields = z.infer<
  ReturnType<typeof getUpdateIndividualValidationSchema>
>;

export const getCreateIndividualValidationSchema = (i18n: I18n) =>
  z.object({
    tax_id: z.string().optional(),
    remindersEnabled: z.boolean(),
    individual: z.object({
      firstName: z.string().min(1, t(i18n)`First name is required`),
      lastName: z.string().min(1, t(i18n)`Last name is required`),
      email: z
        .email(t(i18n)`Email must be a valid email`)
        .min(1, t(i18n)`Email is required`),
      phone: z.string().optional(),
      isCustomer: z.boolean(),
      isVendor: z.boolean(),
      ...getAddressValidationSchema(i18n).shape,
    }),
  });

export type CreateCounterpartIndividualFormFields = z.infer<
  ReturnType<typeof getCreateIndividualValidationSchema>
>;
