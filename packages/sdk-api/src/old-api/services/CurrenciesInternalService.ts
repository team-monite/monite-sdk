import type { CancelablePromise } from '../CancelablePromise';
import type { CurrencyDetails } from '../models/CurrencyDetails';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const CURRENCIES_ENDPOINT = 'internal/currencies';

export class CurrenciesInternalService extends CommonService {
  /**
   * Get Currencies
   * @returns CurrencyDetails Successful Response
   * @throws ApiError
   */
  public getCurrencies(): CancelablePromise<Record<string, CurrencyDetails>> {
    return __request(
      {
        method: 'GET',
        url: `/${CURRENCIES_ENDPOINT}`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          409: `Biz logic error`,
          416: `Requested Range Not Satisfiable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }
}
