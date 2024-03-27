import type { ApiResult } from './ApiResult';

interface ApiErrorParams {
  readonly ok: ApiResult['ok'];
  readonly status: ApiResult['status'];
  readonly statusText: ApiResult['statusText'];
  readonly body: ApiResult['body'];
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly body: any;

  constructor(response: ApiErrorParams, message: string) {
    super(message);

    this.name = 'ApiError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = response.body;
    this.message = message;
  }

  static isAuthExpiredError(error: unknown): boolean {
    if (error instanceof ApiError) {
      const errorMessage = error.body?.error?.message;

      return (
        (error.status === 400 ||
          error.status === 401 ||
          error.status === 403) &&
        typeof errorMessage === 'string' &&
        errorMessage.includes('expired')
      );
    }

    return false;
  }
}
