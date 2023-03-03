import { OpenAPIConfig } from '../OpenAPI';
import { OrderEnum } from '../models/OrderEnum';
import { ProductCursorFields } from '../models/ProductCursorFields';
import { ProductServiceTypeEnum } from '../models/ProductServiceTypeEnum';
import { CurrencyEnum } from '../models/CurrencyEnum';
import { CancelablePromise } from '../CancelablePromise';
import { ProductServicePaginationResponse } from '../models/ProductServicePaginationResponse';
import { request as __request } from '../request';

export default class ProductsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Products
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param name
   * @param nameContains
   * @param nameIcontains
   * @param type
   * @param price
   * @param priceGt
   * @param priceLt
   * @param priceGte
   * @param priceLte
   * @param currency
   * @param currencyIn
   * @param measureUnitId
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @returns ProductServicePaginationResponse Successful Response
   * @throws ApiError
   */
  public getProducts(
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: ProductCursorFields,
    name?: string,
    nameContains?: string,
    nameIcontains?: string,
    type?: ProductServiceTypeEnum,
    price?: number,
    priceGt?: number,
    priceLt?: number,
    priceGte?: number,
    priceLte?: number,
    currency?: CurrencyEnum,
    currencyIn?: Array<CurrencyEnum>,
    measureUnitId?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string
  ): CancelablePromise<ProductServicePaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: '/products',
        query: {
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          name: name,
          name__contains: nameContains,
          name__icontains: nameIcontains,
          type: type,
          price: price,
          price__gt: priceGt,
          price__lt: priceLt,
          price__gte: priceGte,
          price__lte: priceLte,
          currency: currency,
          currency__in: currencyIn,
          measure_unit_id: measureUnitId,
          created_at__gt: createdAtGt,
          created_at__lt: createdAtLt,
          created_at__gte: createdAtGte,
          created_at__lte: createdAtLte,
        },
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }
}
