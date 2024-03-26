import { ApiError, HTTPValidationError } from '@monite/sdk-api';

export type ErrorType = ApiError | HTTPValidationError | null;
