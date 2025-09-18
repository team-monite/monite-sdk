import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export type FormValues = {
  name: string;
  description?: string;
};

export const getValidationSchema = (i18n: I18n) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t(i18n)`Unit label is required`),
    description: z.string().trim().optional(),
  });
