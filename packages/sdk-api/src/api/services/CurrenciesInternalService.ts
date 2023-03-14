import type { CurrencyDetails } from '../models/CurrencyDetails';
import type { CancelablePromise } from '../CancelablePromise';
import { request as __request } from '../request';
import { OpenAPIConfig } from '../OpenAPI';

export const CURRENCIES_ENDPOINT = 'internal/currencies';

export default class CurrenciesInternalService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

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
      this.openapiConfig
    );
  }
}
