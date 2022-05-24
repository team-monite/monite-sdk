import {
  TagCursorFields,
  TagsPaginationResponse,
  TagCreateOrUpdateSchema,
  OrderEnum,
  TagReadSchema,
} from '../../api';
import type { CancelablePromise } from '../CancelablePromise';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const TAGS_ENDPOINT = 'tags';

export class TagService extends CommonService {
  /**
   * Get Tags
   * Get a list of all tags that can be assigned to payables.
   * Tags can be used, for example, as trigger conditions in payable approval workflows.
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param createdByEntityUserId
   * @returns TagsPaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: TagCursorFields,
    createdByEntityUserId?: string
  ): CancelablePromise<TagsPaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${TAGS_ENDPOINT}`,
        query: {
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          created_by_entity_user_id: createdByEntityUserId,
        },
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Create Tag
   * Create a new tag for use in payables. The tag name must be unique.
   * Tag names are case-sensitive, that is `Marketing` and `marketing` are two different tags.
   *
   *
   * The response returns an auto-generated ID assigned to this tag.
   * To assign this tag to a payable, send the tag ID in the `tag_ids` list when creating or updating a payable.
   * @param requestBody
   * @returns TagReadSchema Successful Response
   * @throws ApiError
   */
  public create(
    requestBody: TagCreateOrUpdateSchema
  ): CancelablePromise<TagReadSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${TAGS_ENDPOINT}`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Delete Tag
   * Delete a tag with the given ID. This tag will be automatically deleted from all payables where it's used.
   * @param tagId
   * @returns void
   * @throws ApiError
   */
  public delete(tagId: string): CancelablePromise<void> {
    return __request(
      {
        method: 'DELETE',
        url: `/${TAGS_ENDPOINT}/{tag_id}`,
        path: {
          tag_id: tagId,
        },
        errors: {
          400: `Bad Request`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Update Tag
   * Change the tag name. The new name must be unique among existing tags.
   * Tag names are case-sensitive, that is `Marketing` and `marketing` are two different tags.
   * @param tagId
   * @param requestBody
   * @returns TagReadSchema Successful Response
   * @throws ApiError
   */
  public update(
    tagId: string,
    requestBody: TagCreateOrUpdateSchema
  ): CancelablePromise<TagReadSchema> {
    return __request(
      {
        method: 'PATCH',
        url: `/${TAGS_ENDPOINT}/{tag_id}`,
        path: {
          tag_id: tagId,
        },
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }
}
