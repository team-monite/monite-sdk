import {
  CurrencyEnum,
  OrderEnum,
  ProductCursorFields,
  ProductServicePaginationResponse,
  ProductServiceTypeEnum,
  ProductServiceRequest,
  ProductServiceResponse,
  ProductServiceUpdate,
} from '../';
import { CancelablePromise } from '../CancelablePromise';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export interface ProductsServiceGetAllRequest {
  /** Order by */
  order?: OrderEnum;

  /** Max is 100 */
  limit: number;

  /** A token, obtained from previous page. Prior over other filters */
  paginationToken?: string;

  /** Allowed sort fields */
  sort?: ProductCursorFields;
  name?: string;
  nameContains?: string;
  nameIcontains?: string;
  type?: ProductServiceTypeEnum;
  price?: number;
  priceGt?: number;
  priceLt?: number;
  priceGte?: number;
  priceLte?: number;
  currency?: CurrencyEnum;
  currencyIn?: Array<CurrencyEnum>;
  measureUnitId?: string;
  createdAtGt?: string;
  createdAtLt?: string;
  createdAtGte?: string;
  createdAtLte?: string;
}

export const PRODUCTS_ENDPOINT = 'products';
/**
 * Products Service is responsible for managing goods, materials, and services that can be listed in invoices.
 *
 * @see {@link https://docs.monite.com/docs/manage-products} for an API documentation
 */
export class ProductsService extends CommonService {
  /**
   * Get Products
   *
   * @see {@link https://docs.monite.com/reference/get_products} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#list-all-products} for additional documentation
   *
   * @returns ProductServicePaginationResponse Successful Response
   * @throws ApiError
   */
  public getAll(
    params: ProductsServiceGetAllRequest
  ): CancelablePromise<ProductServicePaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${PRODUCTS_ENDPOINT}`,
        query: {
          order: params.order,
          limit: params.limit,
          pagination_token: params.paginationToken,
          sort: params.sort,
          name: params.name,
          name__contains: params.nameContains,
          name__icontains: params.nameIcontains,
          type: params.type,
          price: params.price,
          price__gt: params.priceGt,
          price__lt: params.priceLt,
          price__gte: params.priceGte,
          price__lte: params.priceLte,
          currency: params.currency,
          currency__in: params.currencyIn,
          measure_unit_id: params.measureUnitId,
          created_at__gt: params.createdAtGt,
          created_at__lt: params.createdAtLt,
          created_at__gte: params.createdAtGte,
          created_at__lte: params.createdAtLte,
        },
      },
      this.openApi
    );
  }

  /**
   * Create Product
   * Before creating a product, you must also create the related measure units.
   *
   * @param requestBody The request body needs to contain
   * the product name, type (product or service), price per unit, measure unit ID,
   * and other necessary information.
   *
   * @see {@link https://docs.monite.com/reference/post_products} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#create-a-product} for additional documentation
   *
   * @returns ProductServiceResponse Successful Response
   * @throws ApiError
   */
  public createProduct(
    requestBody: ProductServiceRequest
  ): CancelablePromise<ProductServiceResponse> {
    return __request<ProductServiceResponse>(
      {
        method: 'POST',
        url: `/${PRODUCTS_ENDPOINT}`,
        body: requestBody,
        mediaType: 'application/json',
      },
      this.openApi
    );
  }

  /**
   * Get Product By Id
   *
   * @param {string} productId Product identifier
   *
   * @see {@link https://docs.monite.com/reference/get_products_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#retrieve-a-product} for additional documentation
   *
   * @returns ProductServiceResponse Successful Response
   * @throws ApiError
   */
  public getById(productId: string): CancelablePromise<ProductServiceResponse> {
    return __request<ProductServiceResponse>(
      {
        method: 'GET',
        url: `/${PRODUCTS_ENDPOINT}/${productId}`,
      },
      this.openApi
    );
  }

  /**
   * Delete Product By Id
   *
   * @param {string} productId Product identifier
   *
   * @see {@link https://docs.monite.com/reference/delete_products_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#delete-a-product} for additional documentation
   *
   * @returns void
   * @throws ApiError
   */
  public deleteById(productId: string): CancelablePromise<void> {
    return __request<void>(
      {
        method: 'DELETE',
        url: `/${PRODUCTS_ENDPOINT}/${productId}`,
      },
      this.openApi
    );
  }

  /**
   * Update Product By Id
   *
   * @param {string} productId Product identifier
   *

   * @param requestBody
   *
   * @see {@link https://docs.monite.com/reference/patch_products_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-products#edit-a-product} for additional documentation
   *
   * @returns ProductServiceResponse Successful Response
   * @throws ApiError
   */
  public updateById(
    productId: string,
    requestBody: ProductServiceUpdate
  ): CancelablePromise<ProductServiceResponse> {
    return __request<ProductServiceResponse>(
      {
        method: 'PATCH',
        url: `/${PRODUCTS_ENDPOINT}/${productId}`,
        body: requestBody,
        mediaType: 'application/json',
      },
      this.openApi
    );
  }
}
