import { entityUsers } from '@/mocks/entityUsers/entityUserByIdFixture';
import { delay } from '@/mocks/utils';
import {
  generateRandomDate,
  generateRandomId,
  getRandomProperty,
} from '@/utils/storybook-utils';
import {
  TAGS_ENDPOINT,
  TagsPaginationResponse,
  TagCreateOrUpdateSchema,
  TagReadSchema,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { tagListFixture } from './tagsFixture';

let tagsList = tagListFixture;

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

          return tagsList.slice(parsedLimit);
        }

        /** We should return first `limit` elements */
        next_pagination_token = '1';
        prev_pagination_token = undefined;

        return tagsList.slice(0, parsedLimit);
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
        delay(),
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

      const newTag: TagReadSchema = {
        id: generateRandomId(),
        name: json.name,
        updated_at: generateRandomDate(),
        created_at: generateRandomDate(),
        created_by_entity_user_id: getRandomProperty(entityUsers).id,
      };

      tagsList.push(newTag);

      return res(ctx.json(newTag));
    }
  ),

  /**
   * The mock for Update a Tag.
   * Rejects the request if tag name includes `error` string
   *
   * @returns A default fixtures with provided `name`
   */
  rest.patch<
    TagCreateOrUpdateSchema,
    { id: string },
    TagReadSchema | ErrorResponse
  >(`${tagsPath}/:id`, async (req, res, ctx) => {
    const json = await req.json<{ name: string }>();
    const tagId = req.params.id;

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

    tagsList = tagsList.map((tag) => {
      if (tag.id === tagId) {
        return {
          ...tag,
          name: json.name,
        };
      }

      return tag;
    });

    const updatedTag = tagsList.find((tag) => tag.id === tagId);

    if (!updatedTag) {
      return res(
        delay(),
        ctx.status(403),
        ctx.json({
          error: {
            message: json.name,
          },
        })
      );
    }

    return res(ctx.json(updatedTag));
  }),

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

    tagsList = tagsList.filter((tag) => tag.id !== params.id);

    return res(ctx.status(204));
  }),
];
