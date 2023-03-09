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

  /**
   * The mock for Create a Tag.
   * Rejects the request if tag name includes `error` string
   *
   * @returns A default fixtures with provided `name`
   */
  rest.post<TagCreateOrUpdateSchema, {}, TagReadSchema | ErrorResponse>(
    tagsPath,
    async (req, res, ctx) => {
      const json = await req.json<{ name: string }>();

      if (json.name.includes('error')) {
        return res(
          ctx.status(403),
          ctx.json({
            error: {
              message: json.name,
            },
          })
        );
      }

      /** Response already existing texture but with the name what the user provided */
      const responseJson = { ...tagListFixture[0], name: json.name };

      return res(ctx.json(responseJson));
    }
  ),

  /**
   * The mock for Update a Tag.
   * Rejects the request if tag name includes `error` string
   *
   * @returns A default fixtures with provided `name`
   */
  rest.patch<TagCreateOrUpdateSchema, {}, TagReadSchema | ErrorResponse>(
    `${tagsPath}/:id`,
    async (req, res, ctx) => {
      const json = await req.json<{ name: string }>();

      if (json.name.includes('error')) {
        return res(
          ctx.status(403),
          ctx.json({
            error: {
              message: json.name,
            },
          })
        );
      }

      /** Response already existing texture but with the name what the user provided */
      const responseJson = { ...tagListFixture[0], name: json.name };

      return res(ctx.json(responseJson));
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
