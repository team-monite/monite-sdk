export function getLegacyAPIErrorMessage(err: unknown): string | undefined {
  if (typeof err === 'object' && err !== null && 'body' in err) {
    if (
      typeof err.body === 'object' &&
      err.body !== null &&
      'error' in err.body
    ) {
      if (
        typeof err.body.error === 'object' &&
        err.body.error !== null &&
        'message' in err.body.error &&
        typeof err.body.error.message === 'string'
      ) {
        return err.body.error.message;
      }
    }
  }

  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof err.message === 'string'
  ) {
    return err.message;
  }

  if (typeof err === 'object' && err !== null && 'error' in err) {
    if (
      typeof err.error === 'object' &&
      err.error !== null &&
      'message' in err.error &&
      typeof err.error.message === 'string'
    ) {
      return err.error.message;
    }
  }
}
