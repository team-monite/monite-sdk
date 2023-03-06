import { rest } from 'msw';

import {
  TAGS_ENDPOINT,
  TagsPaginationResponse,
  TagCreateOrUpdateSchema,
  TagReadSchema,
} from '@team-monite/sdk-api';

import { tagListFixture } from './tagsFixture';

const tagsPath = `*/${TAGS_ENDPOINT}`;

interface TagDeleteRequest {
  /** Tag identifier. But if it's `true` then the response should be with error */
  id: string;
}

interface ErrorResponse {
  error: {
    message: string;
  };
}

export const tagsHandlers = [
  // read tag list
  rest.get<undefined, {}, TagsPaginationResponse>(
    tagsPath,
    ({ url }, res, ctx) => {
      return res(
        ctx.json({
          data: tagListFixture,
        })
      );
    }
  ),

  // read tag list with limit
  // TODO should combine with above handler using path params
  rest.get<undefined, {}, TagsPaginationResponse>(
    `${tagsPath}?limit=10`,
    ({ url }, res, ctx) => {
      return res(
        ctx.json({
          data: tagListFixture,
        })
      );
    }
  ),

  // create tag
  rest.post<TagCreateOrUpdateSchema, {}, TagReadSchema>(
    tagsPath,
    ({ params }, res, ctx) => {
      return res(ctx.json(tagListFixture[0]));
    }
  ),

  // update tag
  rest.patch<TagCreateOrUpdateSchema, {}, TagReadSchema>(
    `${tagsPath}/:id`,
    ({ params }, res, ctx) => {
      return res(ctx.json(tagListFixture[0]));
    }
  ),

  /**
   * Delete tag by `id`
   * If provided `0` as `tagId` parameter then return an error
   *
   * @returns Nothing with 204 status code or error message
   */
  rest.delete<
    TagCreateOrUpdateSchema,
    TagDeleteRequest,
    TagReadSchema | ErrorResponse
  >(`${tagsPath}/:id`, ({ params }, res, ctx) => {
    /** If tag is `0` then we should trigger an error */
    if (params.id === '0') {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Custom error message',
          },
        })
      );
    }

    return res(ctx.status(204));
  }),
];
