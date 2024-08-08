import { toast } from 'react-hot-toast';

import { components } from '@/api';

/**
 * Shows an error toast message.
 * We don't want to show the error message if the error object has error.details.
 * This is because error.details are handled in form validation and highlights errors in the form.
 * (See: useOnboardingForm.ts handleSubmit function)
 *
 * We only want to show toast message if the error object has error.message.
 */

export const showErrorToast = (
  error:
    | Error
    | { error: { message: string } }
    | components['schemas']['HTTPValidationError']
): void => {
  if (error instanceof Error) {
    toast.error(error.message);
  }
  if ('error' in error && 'message' in error.error) {
    toast.error(error.error.message);
  }
};
