import { getAddressValidationSchema } from '../../CounterpartAddressForm/validation';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getUpdateIndividualValidationSchema = (
  i18n: I18n
): z.ZodSchema<{
  tax_id?: string;
  remindersEnabled: boolean;
  individual: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isCustomer: boolean;
    isVendor: boolean;
  };
}> =>
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

export const getCreateIndividualValidationSchema = (
  i18n: I18n
): z.ZodSchema<{
  tax_id?: string;
  remindersEnabled: boolean;
  individual: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isCustomer: boolean;
    isVendor: boolean;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}> =>
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
      ...getAddressValidationSchema(i18n),
    }),
  });
