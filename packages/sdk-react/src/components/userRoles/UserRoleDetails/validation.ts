import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { z } from 'zod';

export const getValidationSchema = (i18n: I18n) =>
  z.object({
    name: z
      .string()
      .max(255, t(i18n)`Name cannot exceed 255 characters`)
      .min(1, t(i18n)`Name is required`),
    permissions: z.array(z.any()),
  });
