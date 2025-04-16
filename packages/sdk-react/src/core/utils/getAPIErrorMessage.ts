import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const getAPIErrorMessage = (
  i18n: I18n,
  error:
    | Error
    | { error: { message: string } }
    | components['schemas']['HTTPValidationError'],
  defaultMessage?: string
): string => {
  if (error instanceof Error) return error.message;
  if ('error' in error && 'message' in error.error) return error.error.message;
  if ('detail' in error && Array.isArray(error.detail))
    return error.detail?.map((detail) => detail.msg).join(', ');
  if ('message' in error && error.message === 'Request size limit exceeded') {
    return t(i18n)`Request size limit exceeded`;
  }

  return defaultMessage ?? t(i18n)`Unknown`;
};
