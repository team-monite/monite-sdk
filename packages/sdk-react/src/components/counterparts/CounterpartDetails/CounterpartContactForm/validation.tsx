import { getAddressValidationSchema } from '../CounterpartAddressForm/validation';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const getValidationSchema = (i18n: I18n) =>
  z.object({
    firstName: z.string().min(1, t(i18n)`First name is required`),
    lastName: z.string().min(1, t(i18n)`Last name is required`),
    email: z
      .string()
      .min(1, t(i18n)`Email is required`)
      .email(t(i18n)`Email must be a valid email`),
    phone: z.string().optional(),
    ...getAddressValidationSchema(i18n),
  });
