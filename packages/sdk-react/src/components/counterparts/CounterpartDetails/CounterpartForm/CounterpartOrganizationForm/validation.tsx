import { getAddressValidationSchema } from '@/components/counterparts/CounterpartDetails/CounterpartAddressForm/validation';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getUpdateCounterpartValidationSchema = (i18n: I18n) =>
  z.object({
    tax_id: z.string().optional(),
    remindersEnabled: z.boolean(),
    organization: z.object({
      companyName: z.string().min(1, t(i18n)`Company name is required`),
      email: z
        .email(t(i18n)`Email must be a valid email`)
        .min(1, t(i18n)`Email is required`),
      phone: z.string().optional(),
      isVendor: z.boolean().optional(),
      isCustomer: z.boolean().optional(),
    }),
  });

export type UpdateCounterpartOrganizationFormFields = z.infer<
  ReturnType<typeof getUpdateCounterpartValidationSchema>
>;

export const getCreateCounterpartValidationSchema = (i18n: I18n) =>
  z.object({
    tax_id: z.string().optional(),
    remindersEnabled: z.boolean(),
    organization: z.object({
      companyName: z.string().min(1, t(i18n)`Company name is required`),
      email: z
        .email(t(i18n)`Email must be a valid email`)
        .min(1, t(i18n)`Email is required`),
      phone: z.string().optional(),
      isVendor: z.boolean().optional(),
      isCustomer: z.boolean().optional(),
      ...getAddressValidationSchema(i18n),
    }),
  });

export type CreateCounterpartOrganizationFormFields = z.infer<
  ReturnType<typeof getCreateCounterpartValidationSchema>
>;
