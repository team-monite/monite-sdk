import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { components } from '@monite/sdk-api/src/api';

export const getAPIErrorMessage = (
  i18n: I18n,
  error:
    | Error
    | { error: { message: string } }
    | components['schemas']['HTTPValidationError']
): string => {
  if (error instanceof Error) return error.message;
  if ('error' in error && 'message' in error.error) return error.error.message;
  if ('detail' in error && Array.isArray(error.detail))
    return error.detail?.map((detail) => detail.msg).join(', ');
  return t(i18n)`Unknown`;
};
