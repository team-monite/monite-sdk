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
