import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import {
  api__v1__receivables__pagination__CursorFields,
  ReceivablesOrderEnum,
  ReceivablesPaginationResponse,
  ReceivablesReceivablesStatusEnum,
  ReceivablesReceivableType,
  ReceivableResponse,
  ReceivablesReceivablesReceivablesPaymentTermsListResponse,
  ProductServiceReceivablesPaginationResponse,
  Receivablesapi__v1__products_services__pagination__CursorFields,
  ReceivablesCurrencyEnum,
  ReceivablesProductServiceTypeEnum,
  ReceivablesReceivablesCounterpartBankAccountsResponse,
  ReceivablesReceivableFacadeCreatePayload,
  ReceivablesUnitListResponse,
  ReceivablesVatRateListResponse,
} from '../../api';

export const RECEIVABLES_ENDPOINT = 'receivables';

export default class ReceivableService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get All
   * @param xMoniteEntityId monite entity_id
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param type
   * @param documentId
   * @param documentIdContains
   * @param documentIdIcontains
   * @param issueDateGt
   * @param issueDateLt
   * @param issueDateGte
   * @param issueDateLte
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @param counterpartName
   * @param counterpartNameContains
   * @param counterpartNameIcontains
   * @param amount
   * @param amountGt
   * @param amountLt
   * @param amountGte
   * @param amountLte
   * @param status
   * @param statusIn
   * @param entityUserId
   * @param entityUserIdIn
   * @param basedOn
   * @returns ReceivablesPaginationResponse Successful Response
   * @throws ApiError
   */
  public getAllReceivables(
    xMoniteEntityId: string,
    order?: ReceivablesOrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: api__v1__receivables__pagination__CursorFields,
    type?: ReceivablesReceivableType,
    documentId?: string,
    documentIdContains?: string,
    documentIdIcontains?: string,
    issueDateGt?: string,
    issueDateLt?: string,
    issueDateGte?: string,
    issueDateLte?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string,
    counterpartName?: string,
    counterpartNameContains?: string,
    counterpartNameIcontains?: string,
    amount?: number,
    amountGt?: number,
    amountLt?: number,
    amountGte?: number,
    amountLte?: number,
    status?: ReceivablesReceivablesStatusEnum,
    statusIn?: Array<ReceivablesReceivablesStatusEnum>,
    entityUserId?: string,
    entityUserIdIn?: Array<string>,
    basedOn?: string
  ): CancelablePromise<ReceivablesPaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${RECEIVABLES_ENDPOINT}`,
        headers: {
          'x-monite-entity-id': xMoniteEntityId,
        },
        query: {
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          type: type,
          document_id: documentId,
          document_id__contains: documentIdContains,
          document_id__icontains: documentIdIcontains,
          issue_date__gt: issueDateGt,
          issue_date__lt: issueDateLt,
          issue_date__gte: issueDateGte,
          issue_date__lte: issueDateLte,
          created_at__gt: createdAtGt,
          created_at__lt: createdAtLt,
          created_at__gte: createdAtGte,
          created_at__lte: createdAtLte,
          counterpart_name: counterpartName,
          counterpart_name__contains: counterpartNameContains,
          counterpart_name__icontains: counterpartNameIcontains,
          amount: amount,
          amount__gt: amountGt,
          amount__lt: amountLt,
          amount__gte: amountGte,
          amount__lte: amountLte,
          status: status,
          status__in: statusIn,
          entity_user_id: entityUserId,
          entity_user_id__in: entityUserIdIn,
          based_on: basedOn,
        },
        errors: {
          400: `Bad Request`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          409: `Possible responses: \`Action for {object_type} at permissions not found: {action}\`,\`Object type at permissions not found: {object_type}\`,\`Action {action} for {object_type} not allowed\``,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Get Receivable Pdf link by Id
   * @returns string Successful Response
   * @throws ApiError
   */
  public getReceivablePdfLink(receivableId: string): CancelablePromise<string> {
    return __request(
      {
        method: 'GET',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/pdf_link`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Create New Receivable
   * @param xMoniteEntityId The ID of the entity that owns the requested resource.
   * @param requestBody
   * @returns ReceivableResponse Successful Response
   * @throws ApiError
   */
  public createNewReceivableV1ReceivablesPost(
    xMoniteEntityId: string,
    requestBody: ReceivablesReceivableFacadeCreatePayload
  ): CancelablePromise<ReceivableResponse> {
    return __request(
      {
        method: 'POST',
        url: '/receivables',
        headers: {
          'x-monite-entity-id': xMoniteEntityId,
        },
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          409: `Biz logic error`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Get Counterparts Bank Accounts
   * @param counterpartId
   * @param xMoniteEntityId The ID of the entity that owns the requested resource.
   * @returns ReceivablesReceivablesCounterpartBankAccountsResponse Successful Response
   * @throws ApiError
   */
  public getCounterpartsBankAccountsV1CounterpartsCounterpartIdBankAccountsGet(
    counterpartId: string,
    xMoniteEntityId: string
  ): CancelablePromise<ReceivablesReceivablesCounterpartBankAccountsResponse> {
    return __request(
      {
        method: 'GET',
        url: '/counterparts/{counterpart_id}/bank_accounts',
        path: {
          counterpart_id: counterpartId,
        },
        headers: {
          'x-monite-entity-id': xMoniteEntityId,
        },
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

  /**
   * Get Items
   * @param xMoniteEntityId The ID of the entity that owns the requested resource.
   * @returns ReceivablesReceivablesReceivablesPaymentTermsListResponse Successful Response
   * @throws ApiError
   */
  public getItemsV1PaymentTermsGet(
    xMoniteEntityId: string
  ): CancelablePromise<ReceivablesReceivablesReceivablesPaymentTermsListResponse> {
    return __request(
      {
        method: 'GET',
        url: '/payment_terms',
        headers: {
          'x-monite-entity-id': xMoniteEntityId,
        },
        errors: {
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

  /**
   * Get Products
   * @param xMoniteEntityId The ID of the entity that owns the requested resource.
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
   * @returns ProductServiceReceivablesPaginationResponse Successful Response
   * @throws ApiError
   */
  public getProductsV1ProductsGet(
    xMoniteEntityId: string,
    order?: ReceivablesOrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: Receivablesapi__v1__products_services__pagination__CursorFields,
    name?: string,
    nameContains?: string,
    nameIcontains?: string,
    type?: ReceivablesProductServiceTypeEnum,
    price?: number,
    priceGt?: number,
    priceLt?: number,
    priceGte?: number,
    priceLte?: number,
    currency?: ReceivablesCurrencyEnum,
    currencyIn?: Array<ReceivablesCurrencyEnum>,
    measureUnitId?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string
  ): CancelablePromise<ProductServiceReceivablesPaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: '/products',
        headers: {
          'x-monite-entity-id': xMoniteEntityId,
        },
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

  /**
   * Get Units
   * @param xMoniteEntityId The ID of the entity that owns the requested resource.
   * @returns ReceivablesUnitListResponse Successful Response
   * @throws ApiError
   */
  public getUnitsV1MeasureUnitsGet(
    xMoniteEntityId: string
  ): CancelablePromise<ReceivablesUnitListResponse> {
    return __request(
      {
        method: 'GET',
        url: '/measure_units',
        headers: {
          'x-monite-entity-id': xMoniteEntityId,
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

  /**
   * Get Vat Rates
   * @param counterpartId
   * @param xMoniteEntityId The ID of the entity that owns the requested resource.
   * @returns ReceivablesVatRateListResponse Successful Response
   * @throws ApiError
   */
  public getVatRatesV1VatRatesGet(
    counterpartId: string,
    xMoniteEntityId: string
  ): CancelablePromise<ReceivablesVatRateListResponse> {
    return __request(
      {
        method: 'GET',
        url: '/vat_rates',
        headers: {
          'x-monite-entity-id': xMoniteEntityId,
        },
        query: {
          counterpart_id: counterpartId,
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

  /**
   * Get Receivable By Id
   * @param receivableId
   * @returns ReceivableResponse Successful Response
   * @throws ApiError
   */
  public getById(receivableId: string): CancelablePromise<ReceivableResponse> {
    return __request(
      {
        method: 'GET',
        url: `/receivables/${receivableId}`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }
}
