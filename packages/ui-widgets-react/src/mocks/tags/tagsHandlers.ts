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

interface GetRequest {
  order: 'desc' | 'asc';
  limit: string;
  sort: 'updated_at' | 'created_at';
  pagination_token: string;
}

export const tagsHandlers = [
  /**
   * Get all tags
   *
   * Also supports sorting, limits and ordering
   */
  rest.get<undefined, GetRequest, TagsPaginationResponse>(
    tagsPath,
    (req, res, ctx) => {
      const sort =
        (req.url.searchParams.get('sort') as GetRequest['sort']) || null;

      const order =
        (req.url.searchParams.get('order') as GetRequest['order']) || null;

      const limit =
        (req.url.searchParams.get('limit') as GetRequest['limit']) || null;

      const pagination_token =
        (req.url.searchParams.get(
          'pagination_token'
        ) as GetRequest['pagination_token']) || null;

      let next_pagination_token = undefined;
      let prev_pagination_token = undefined;

      const filteredData = (() => {
        const parsedLimit = Number(limit);

        /** We should return next elements */
        if (pagination_token === '1') {
          next_pagination_token = undefined;
          prev_pagination_token = '-1';

          return tagListFixture.slice(parsedLimit);
        }

        /** We should return first `limit` elements */
        next_pagination_token = '1';
        prev_pagination_token = undefined;

        return tagListFixture.slice(0, parsedLimit);
      })();

      const sortedData = filteredData.sort((a, b) => {
        if (sort === null) {
          return 0;
        }

        const aTime = new Date(a[sort]);
        const bTime = new Date(b[sort]);

        if (order === 'desc') {
          return bTime.getTime() - aTime.getTime();
        } else if (order === 'asc') {
          return aTime.getTime() - bTime.getTime();
        }

        return 0;
      });

      return res(
        ctx.json({
          data: sortedData,
          next_pagination_token,
          prev_pagination_token,
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
